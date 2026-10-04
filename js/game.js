/**
 * Subway Surfers Web - Authentic Game Engine & Lifecycle (1:1 Original Edition)
 */
class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'SAVEME' | 'PAUSED' | 'GAMEOVER'

        this.clock = new THREE.Clock();
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('subway_highscore')) || 0;
        this.runCoins = 0;
        this.distance = 0;
        this.baseSpeed = 24.0;
        this.currentSpeed = this.baseSpeed;
        this.maxSpeed = 50.0;

        this.cameraOffset = new THREE.Vector3(0, 3.8, -6.8);
        this.cameraShake = 0;

        this.particles = [];
        this.hasUsedSaveMe = false;
        this.saveMeTimer = 5;
        this.saveMeInterval = null;

        // Word Hunt (S - U - R - F)
        this.wordHunt = {
            letters: ['S', 'U', 'R', 'F'],
            collected: [false, false, false, false]
        };

        // Touch handling
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastTapTime = 0;

        this.init();
    }

    init() {
        // 1. Khởi tạo Three.js Scene, Camera, Renderer (Miami / Rio Beach Theme)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x38bdf8);
        this.scene.fog = new THREE.Fog(0x7dd3fc, 45, 165);

        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 220);
        this.camera.position.set(0, 4, -7);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        this.container.appendChild(this.renderer.domElement);

        // 2. Thiết lập ánh sáng Nắng biển nhiệt đới
        this.setupLighting();

        // 3. Khởi tạo Player & Track Manager
        this.player = new Player(this.scene);
        this.player.init();

        this.track = new TrackManager(this.scene);

        // 4. Lắng nghe sự kiện (Resize, Keyboard, Touch, UI)
        this.setupEventListeners();
        this.updateHUDHighScore();
        this.updateWordHuntHUD();
        window.shopManager.renderUI();

        // 5. Bắt đầu vòng lặp Render
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLighting() {
        const ambient = new THREE.AmbientLight(0xbae6fd, 0.85);
        this.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
        sunLight.position.set(30, 60, -25);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 180;
        sunLight.shadow.camera.left = -25;
        sunLight.shadow.camera.right = 25;
        sunLight.shadow.camera.top = 25;
        sunLight.shadow.camera.bottom = -25;
        this.scene.add(sunLight);

        // Đèn ấm theo người chơi
        this.playerLight = new THREE.PointLight(0xfff3c4, 0.9, 28);
        this.playerLight.position.set(0, 4, 2);
        this.scene.add(this.playerLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || window.innerHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });

        // Bàn phím
        window.addEventListener('keydown', (e) => {
            if (this.state === 'MENU') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.startGame();
                }
                return;
            }

            if (this.state === 'SAVEME') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.reviveWithKey();
                } else if (e.code === 'Escape') {
                    this.skipSaveMe();
                }
                return;
            }

            if (this.state !== 'PLAYING') return;

            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.player.moveLeft();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.player.moveRight();
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.player.jump();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.player.slide();
                    break;
                case 'Space':
                    const now = Date.now();
                    if (now - this.lastTapTime < 350) {
                        this.player.activateHoverboard();
                    } else {
                        this.player.jump();
                    }
                    this.lastTapTime = now;
                    break;
                case 'KeyQ':
                    this.player.activateHoverboard();
                    break;
                case 'Escape':
                    this.togglePause();
                    break;
            }
        });

        // Cảm ứng Mobile (Swipe & Double Tap)
        const dom = this.renderer.domElement;
        dom.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        dom.addEventListener('touchend', (e) => {
            if (this.state === 'MENU') {
                this.startGame();
                return;
            }
            if (this.state !== 'PLAYING') return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - this.touchStartX;
            const dy = touchEndY - this.touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            const minSwipe = 28;

            if (Math.max(absDx, absDy) > minSwipe) {
                if (absDx > absDy) {
                    if (dx > 0) this.player.moveRight();
                    else this.player.moveLeft();
                } else {
                    if (dy < 0) this.player.jump();
                    else this.player.slide();
                }
            } else {
                // Tap hoặc Double tap
                const now = Date.now();
                if (now - this.lastTapTime < 300) {
                    this.player.activateHoverboard();
                }
                this.lastTapTime = now;
            }
        }, { passive: true });
    }

    // ==================== QUẢN LÝ TRẠNG THÁI GAME ====================
    showMenu() {
        this.state = 'MENU';
        window.audioManager.stopBGM();
        this.hasUsedSaveMe = false;

        document.getElementById('menu-screen').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('pause-modal').classList.add('hidden');
        document.getElementById('save-me-modal').classList.add('hidden');
        document.getElementById('game-over-modal').classList.add('hidden');

        this.updateHUDHighScore();
        window.shopManager.renderUI();
    }

    startGame() {
        window.audioManager.init();
        window.audioManager.startBGM();

        this.state = 'PLAYING';
        this.score = 0;
        this.runCoins = 0;
        this.distance = 0;
        this.currentSpeed = this.baseSpeed;
        this.hasUsedSaveMe = false;

        this.player.reset();
        this.track.reset();

        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('game-over-modal').classList.add('hidden');
        document.getElementById('pause-modal').classList.add('hidden');
        document.getElementById('save-me-modal').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');

        this.updateHUD();
    }

    restartGame() {
        this.startGame();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            window.audioManager.stopBGM();
            document.getElementById('pause-modal').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            window.audioManager.startBGM();
            document.getElementById('pause-modal').classList.add('hidden');
            this.clock.getDelta(); // Bỏ qua delta time khi pause
        }
    }

    // ==================== HỆ THỐNG CỨU MẠNG (SAVE ME) ====================
    triggerSaveMe() {
        if (this.hasUsedSaveMe) {
            this.gameOver();
            return;
        }

        this.state = 'SAVEME';
        this.hasUsedSaveMe = true;
        window.audioManager.playCrash();
        window.audioManager.stopBGM();

        const saveModal = document.getElementById('save-me-modal');
        if (saveModal) saveModal.classList.remove('hidden');

        this.saveMeTimer = 5;
        const timerEl = document.getElementById('save-me-countdown');
        if (timerEl) timerEl.textContent = this.saveMeTimer;

        if (this.saveMeInterval) clearInterval(this.saveMeInterval);
        this.saveMeInterval = setInterval(() => {
            this.saveMeTimer--;
            if (timerEl) timerEl.textContent = this.saveMeTimer;

            if (this.saveMeTimer <= 0) {
                clearInterval(this.saveMeInterval);
                this.skipSaveMe();
            }
        }, 1000);
    }

    reviveWithKey() {
        if (this.saveMeInterval) clearInterval(this.saveMeInterval);

        const currentKeys = window.shopManager.getKeys();
        if (currentKeys > 0) {
            window.shopManager.spendKeys(1);
        }

        // Hồi sinh!
        document.getElementById('save-me-modal').classList.add('hidden');
        this.state = 'PLAYING';
        this.player.invulnerableTimer = 3.0; // Bất tử 3 giây
        this.player.position.y = 0;
        this.player.velocityY = 0;
        this.player.isGrounded = true;

        window.audioManager.playPowerup();
        window.audioManager.startBGM();
        this.clock.getDelta();
    }

    skipSaveMe() {
        if (this.saveMeInterval) clearInterval(this.saveMeInterval);
        document.getElementById('save-me-modal').classList.add('hidden');
        this.gameOver();
    }

    gameOver() {
        this.state = 'GAMEOVER';
        window.audioManager.playCrash();
        window.audioManager.stopBGM();

        this.cameraShake = 0.8;

        // Cộng xu kiếm được vào ví tổng
        window.shopManager.addCoins(this.runCoins);

        const isNewHigh = this.score > this.highScore;
        if (isNewHigh) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('subway_highscore', this.highScore);
            this.updateHUDHighScore();
        }

        // Cập nhật thông số màn hình Game Over
        document.getElementById('final-score').textContent = Math.floor(this.score);
        document.getElementById('final-coins').textContent = this.runCoins;
        document.getElementById('final-distance').textContent = Math.floor(this.distance) + 'm';

        setTimeout(() => {
            document.getElementById('game-over-modal').classList.remove('hidden');
        }, 400);
    }

    // ==================== CẬP NHẬT HUD & WORD HUNT ====================
    updateHUDHighScore() {
        const hsEls = document.querySelectorAll('.highscore-display-val');
        hsEls.forEach(el => {
            el.textContent = this.highScore;
        });
    }

    updateWordHuntHUD() {
        const letters = ['s', 'u', 'r', 'f'];
        letters.forEach((l, idx) => {
            const el = document.getElementById('letter-' + l);
            if (el) {
                if (this.wordHunt.collected[idx]) {
                    el.classList.add('collected');
                } else {
                    el.classList.remove('collected');
                }
            }
        });
    }

    updateHUD() {
        // Điểm số & Xu
        document.getElementById('score-display').textContent = Math.floor(this.score);
        document.getElementById('run-coins-display').textContent = this.runCoins;

        // Multiplier
        const mult = this.player.powerups.multiplier > 0 ? 2 : 1;
        document.getElementById('multiplier-badge').textContent = mult + 'X';

        // Hoverboard count
        const boardEl = document.getElementById('hud-board-count');
        if (boardEl) {
            boardEl.textContent = this.player.powerups.hoverboard > 0 ? 'ĐANG DÙNG' : 'CHẠM ĐÚP';
        }

        // Power-up HUD bars
        this.updatePowerupBar('hud-magnet', this.player.powerups.magnet, 12.0);
        this.updatePowerupBar('hud-jetpack', this.player.powerups.jetpack, 9.0);
        this.updatePowerupBar('hud-sneakers', this.player.powerups.sneakers, 15.0);
        this.updatePowerupBar('hud-multiplier', this.player.powerups.multiplier, 18.0);
        this.updatePowerupBar('hud-hoverboard', this.player.powerups.hoverboard, 30.0);
    }

    updatePowerupBar(elementId, currentVal, maxVal) {
        const el = document.getElementById(elementId);
        if (!el) return;

        if (currentVal > 0) {
            el.classList.remove('hidden');
            const percent = (currentVal / maxVal) * 100;
            const fill = el.querySelector('.powerup-progress-fill');
            if (fill) fill.style.width = percent + '%';
        } else {
            el.classList.add('hidden');
        }
    }

    // ==================== HIỆU ỨNG HẠT (PARTICLES) ====================
    createCoinSparkle(pos) {
        for (let i = 0; i < 6; i++) {
            const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
            const pMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
            const p = new THREE.Mesh(pGeo, pMat);
            p.position.copy(pos);
            p.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 6,
                    Math.random() * 5 + 2,
                    (Math.random() - 0.5) * 6
                ),
                life: 0.45
            };
            this.scene.add(p);
            this.particles.push(p);
        }
    }

    createBoardBreakEffect(pos) {
        for (let i = 0; i < 16; i++) {
            const pGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
            const pMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
            const p = new THREE.Mesh(pGeo, pMat);
            p.position.copy(pos);
            p.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 12,
                    Math.random() * 8 + 3,
                    (Math.random() - 0.5) * 12
                ),
                life: 0.6
            };
            this.scene.add(p);
            this.particles.push(p);
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.userData.life -= dt;
            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
            } else {
                p.position.addScaledVector(p.userData.velocity, dt);
                p.userData.velocity.y -= 15 * dt; // Trọng lực
                p.scale.multiplyScalar(0.94);
            }
        }
    }

    // ==================== VÒNG LẶP CHÍNH (GAME LOOP) ====================
    animate() {
        requestAnimationFrame(this.animate);

        const dt = Math.min(this.clock.getDelta(), 0.08);

        if (this.state === 'PLAYING') {
            // Tăng tốc dần theo khoảng cách
            this.currentSpeed = Math.min(this.maxSpeed, this.baseSpeed + (this.distance / 120.0));

            // Tịnh tiến người chơi về phía trước (trục Z)
            this.player.position.z += this.currentSpeed * dt;
            this.distance = this.player.position.z;

            // Tính điểm
            const scoreMultiplier = this.player.powerups.multiplier > 0 ? 2 : 1;
            this.score += this.currentSpeed * dt * 1.5 * scoreMultiplier;

            // Cập nhật Player & Track
            this.player.update(dt, this.currentSpeed, this.track.obstacles, this.track.coins);
            this.track.update(dt, this.player.position.z);

            // Kiểm tra va chạm & nhặt vật phẩm
            this.checkCollisions();

            // Cập nhật đèn người chơi
            this.playerLight.position.set(this.player.position.x, this.player.position.y + 3, this.player.position.z + 1);

            this.updateHUD();
        } else if (this.state === 'MENU') {
            // Hoạt ảnh idle ở Menu chính
            if (this.player) {
                this.player.runCycle += dt * 2.0;
                if (this.player.mesh && this.player.mesh.userData.bodyRoot) {
                    this.player.mesh.userData.bodyRoot.position.y = Math.sin(this.player.runCycle) * 0.05;
                }
            }
        }

        this.updateParticles(dt);
        this.updateCamera(dt);

        this.renderer.render(this.scene, this.camera);
    }

    checkCollisions() {
        const playerHitbox = this.player.getHitbox();
        const playerPos = this.player.position;

        // 1. Kiểm tra ăn tiền xu
        for (let i = 0; i < this.track.coins.length; i++) {
            const coin = this.track.coins[i];
            if (!coin.userData.collected) {
                const dist = playerPos.distanceTo(coin.position);
                if (dist < 1.35) {
                    coin.userData.collected = true;
                    this.runCoins++;
                    this.score += 30 * (this.player.powerups.multiplier > 0 ? 2 : 1);
                    window.audioManager.playCoin();
                    this.createCoinSparkle(coin.position);
                }
            }
        }

        // 2. Kiểm tra nhặt Powerup
        for (let i = 0; i < this.track.powerups.length; i++) {
            const p = this.track.powerups[i];
            if (!p.userData.collected) {
                const dist = playerPos.distanceTo(p.position);
                if (dist < 1.45) {
                    p.userData.collected = true;
                    this.player.applyPowerup(p.userData.powerupType);
                    this.createCoinSparkle(p.position);
                }
            }
        }

        // 2.5 Kiểm tra nhặt chữ cái Word Hunt (S - U - R - F)
        for (let i = 0; i < this.track.wordLetters.length; i++) {
            const wl = this.track.wordLetters[i];
            if (!wl.userData.collected) {
                const dist = playerPos.distanceTo(wl.position);
                if (dist < 1.5) {
                    wl.userData.collected = true;
                    const letter = wl.userData.letter;
                    const idx = this.wordHunt.letters.indexOf(letter);
                    if (idx !== -1) {
                        this.wordHunt.collected[idx] = true;
                        this.updateWordHuntHUD();
                        window.audioManager.playPowerup();
                        this.createCoinSparkle(wl.position);

                        // Nếu đã thu thập đủ cả 4 chữ S-U-R-F
                        if (this.wordHunt.collected.every(c => c === true)) {
                            window.shopManager.addCoins(500);
                            window.shopManager.addKeys(1);
                            this.wordHunt.collected = [false, false, false, false];
                            setTimeout(() => this.updateWordHuntHUD(), 1500);
                        }
                    }
                }
            }
        }

        // 3. Kiểm tra va chạm Chướng ngại vật / Tàu hỏa
        if (this.player.powerups.jetpack > 0) return; // Bay Jetpack miễn nhiễm mọi chướng ngại vật

        for (const obs of this.track.obstacles) {
            const obsBox = this.getObstacleBoundingBox(obs);
            if (this.checkAABB(playerHitbox, obsBox)) {
                // Va chạm!
                if (this.player.powerups.hoverboard > 0) {
                    // Ván trượt đỡ 1 mạng!
                    this.player.powerups.hoverboard = 0;
                    if (this.player.boardMesh) this.player.boardMesh.visible = false;
                    this.player.invulnerableTimer = 1.8;
                    this.cameraShake = 0.5;
                    this.createBoardBreakEffect(playerPos);
                    window.audioManager.playCrash();
                    break;
                } else if (this.player.invulnerableTimer > 0) {
                    // Đang trong thời gian bất tử -> Bỏ qua
                    continue;
                } else {
                    // Kích hoạt Save Me
                    this.triggerSaveMe();
                    break;
                }
            }
        }
    }

    getObstacleBoundingBox(obs) {
        const hb = obs.userData.hitbox;
        const pos = obs.position;
        return {
            minX: pos.x + hb.minX,
            maxX: pos.x + hb.maxX,
            minY: pos.y + hb.minY,
            maxY: pos.y + hb.maxY,
            minZ: pos.z + hb.minZ,
            maxZ: pos.z + hb.maxZ
        };
    }

    checkAABB(b1, b2) {
        return (
            b1.minX <= b2.maxX &&
            b1.maxX >= b2.minX &&
            b1.minY <= b2.maxY &&
            b1.maxY >= b2.minY &&
            b1.minZ <= b2.maxZ &&
            b1.maxZ >= b2.minZ
        );
    }

    updateCamera(dt) {
        if (!this.player) return;

        // Vị trí Camera mượt mà theo người chơi
        const targetCamX = this.player.position.x * 0.45;
        const targetCamY = Math.max(3.2, this.player.position.y * 0.4 + 3.8);
        const targetCamZ = this.player.position.z + this.cameraOffset.z;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 10.0 * dt;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 8.0 * dt;
        this.camera.position.z = targetCamZ;

        // Rung màn hình khi va chạm
        if (this.cameraShake > 0) {
            this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
            this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
            this.cameraShake -= 2.0 * dt;
            if (this.cameraShake < 0) this.cameraShake = 0;
        }

        // Camera nhìn về phía trước người chơi
        const lookTarget = new THREE.Vector3(
            this.player.position.x * 0.2,
            Math.max(1.5, this.player.position.y * 0.5 + 1.6),
            this.player.position.z + 12
        );
        this.camera.lookAt(lookTarget);
    }
}

window.Game = Game;

function initSubwayGame() {
    if (!window.game) {
        try {
            window.game = new Game();
            console.log("Subway Surfers Game Engine initialized successfully!");
        } catch (e) {
            console.error("Failed to initialize game:", e);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubwayGame);
} else {
    initSubwayGame();
}
