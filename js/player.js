/**
 * Subway Surfers Web - Player Controller & Physics
 */
class Player {
    constructor(scene) {
        this.scene = scene;
        this.lanes = [2.8, 0, -2.8]; // Làn 0: Trái (+2.8), Làn 1: Giữa (0), Làn 2: Phải (-2.8)
        this.currentLane = 1; // Bắt đầu ở làn giữa
        this.targetX = 0;

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocityY = 0;
        this.gravity = -48;
        this.baseJumpForce = 15.5;
        this.isGrounded = true;
        this.isSliding = false;
        this.slideTimer = 0;
        this.slideDuration = 0.75;
        this.isOnTrainRoof = false;
        this.currentGroundY = 0;

        this.powerups = {
            magnet: 0,
            jetpack: 0,
            sneakers: 0,
            multiplier: 0,
            hoverboard: 0
        };

        this.activeSkin = localStorage.getItem('subway_skin') || 'jake';
        this.activeBoard = localStorage.getItem('subway_board') || 'classic';

        this.mesh = null;
        this.boardMesh = null;
        this.runCycle = 0;

        this.invulnerableTimer = 0; // Thời gian bất tử sau khi vỡ ván
    }

    init() {
        if (this.mesh) this.scene.remove(this.mesh);
        if (this.boardMesh) this.scene.remove(this.boardMesh);

        this.mesh = window.modelBuilder.createCharacter(this.activeSkin);
        this.boardMesh = window.modelBuilder.createHoverboard(this.activeBoard);
        this.boardMesh.visible = false;

        this.mesh.add(this.boardMesh);
        this.scene.add(this.mesh);

        this.reset();
    }

    reset() {
        this.currentLane = 1;
        this.targetX = this.lanes[1];
        this.position.set(0, 0, 0);
        this.velocityY = 0;
        this.isGrounded = true;
        this.isSliding = false;
        this.slideTimer = 0;
        this.isOnTrainRoof = false;
        this.currentGroundY = 0;
        this.runCycle = 0;
        this.invulnerableTimer = 0;

        this.powerups = {
            magnet: 0,
            jetpack: 0,
            sneakers: 0,
            multiplier: 0,
            hoverboard: 0
        };

        if (this.boardMesh) this.boardMesh.visible = false;
        if (this.mesh) {
            this.mesh.position.set(0, 0, 0);
            this.mesh.rotation.set(0, 0, 0);
            this.mesh.visible = true;
        }
    }

    setSkin(skinId) {
        this.activeSkin = skinId;
        localStorage.setItem('subway_skin', skinId);
        this.init();
    }

    setBoard(boardId) {
        this.activeBoard = boardId;
        localStorage.setItem('subway_board', boardId);
        this.init();
    }

    // ==================== ĐIỀU KHIỂN ====================
    moveLeft() {
        if (this.currentLane > 0) {
            this.currentLane--;
            this.targetX = this.lanes[this.currentLane];
            window.audioManager.playJump();
        }
    }

    moveRight() {
        if (this.currentLane < this.lanes.length - 1) {
            this.currentLane++;
            this.targetX = this.lanes[this.currentLane];
            window.audioManager.playJump();
        }
    }

    jump() {
        if (this.powerups.jetpack > 0) return;

        if (this.isGrounded || this.isOnTrainRoof) {
            const jumpForce = this.powerups.sneakers > 0 ? this.baseJumpForce * 1.45 : this.baseJumpForce;
            this.velocityY = jumpForce;
            this.isGrounded = false;
            this.isSliding = false;
            window.audioManager.playJump();
        }
    }

    slide() {
        if (this.powerups.jetpack > 0) return;

        // Nếu đang ở trên không -> Bổ nhào nhanh xuống đất (Fast Fall)
        if (!this.isGrounded && !this.isOnTrainRoof) {
            this.velocityY = -35;
        }

        this.isSliding = true;
        this.slideTimer = this.slideDuration;
        window.audioManager.playSlide();
    }

    activateHoverboard() {
        if (this.powerups.hoverboard > 0) return;
        this.powerups.hoverboard = 30.0; // 30s hiệu lực
        if (this.boardMesh) this.boardMesh.visible = true;
        window.audioManager.playHoverboard();
    }

    applyPowerup(type) {
        window.audioManager.playPowerup();
        const durations = {
            magnet: 12.0,
            jetpack: 9.0,
            sneakers: 15.0,
            multiplier: 18.0
        };

        this.powerups[type] = durations[type] || 10.0;

        if (type === 'jetpack') {
            this.velocityY = 0;
            this.isSliding = false;
            if (window.game && window.game.track) {
                window.game.track.spawnImmediateSkyCoins(this.position.z + 6, this.position.z + 250);
            }
        }
    }

    // ==================== CẬP NHẬT VẬT LÝ & HOẠT ẢNH ====================
    update(dt, speed, obstacles, coins) {
        // 1. Chuyển làn mượt mà (Lerp X)
        this.position.x += (this.targetX - this.position.x) * 16.0 * dt;

        // Góc nghiêng khi rẽ làn
        const deltaX = this.targetX - this.position.x;
        const tiltZ = deltaX * 0.12;

        // 2. Xử lý Jetpack
        if (this.powerups.jetpack > 0) {
            this.powerups.jetpack -= dt;
            const targetSkyY = 9.0;
            this.position.y += (targetSkyY - this.position.y) * 6.0 * dt;
            this.isGrounded = false;
        } else {
            // 3. Vật lý Nhảy & Trọng lực
            // Kiểm tra xem đang chạy trên nóc tàu hay dưới đất
            this.checkRampAndRoof(obstacles);

            if (!this.isGrounded) {
                this.velocityY += this.gravity * dt;
                this.position.y += this.velocityY * dt;

                if (this.position.y <= this.currentGroundY) {
                    this.position.y = this.currentGroundY;
                    this.velocityY = 0;
                    this.isGrounded = true;
                }
            } else {
                this.position.y = this.currentGroundY;
            }
        }

        // 4. Xử lý Trượt (Slide)
        if (this.isSliding) {
            this.slideTimer -= dt;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
            }
        }

        // 5. Đếm ngược các Power-ups
        Object.keys(this.powerups).forEach(key => {
            if (this.powerups[key] > 0) {
                this.powerups[key] -= dt;
                if (this.powerups[key] <= 0) {
                    this.powerups[key] = 0;
                    if (key === 'hoverboard' && this.boardMesh) {
                        this.boardMesh.visible = false;
                    }
                }
            }
        });

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
        }

        // 6. Nam châm hút tiền (Magnet & Jetpack Sky Magnet)
        if (this.powerups.magnet > 0 || this.powerups.jetpack > 0) {
            const magnetRadius = this.powerups.jetpack > 0 ? 9.5 : 16.0;
            const pullSpeed = this.powerups.jetpack > 0 ? 45.0 : 38.0;
            coins.forEach(coin => {
                if (!coin.userData.collected) {
                    const dist = this.position.distanceTo(coin.position);
                    if (dist < magnetRadius) {
                        // Kéo đồng xu bay nhanh về phía người chơi
                        const dir = new THREE.Vector3().subVectors(this.position, coin.position).normalize();
                        coin.position.addScaledVector(dir, pullSpeed * dt);
                    }
                }
            });
        }

        // 7. Cập nhật vị trí Mesh 3D
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.z = tiltZ;

            // Hiệu ứng nhấp nháy khi bất tử
            if (this.invulnerableTimer > 0) {
                this.mesh.visible = Math.floor(Date.now() / 80) % 2 === 0;
            } else {
                this.mesh.visible = true;
            }

            // Hoạt ảnh cử động (Skeletal / Procedural Animation)
            this.animateCharacter(dt, speed);
        }
    }

    checkRampAndRoof(obstacles) {
        let detectedGroundY = 0;
        let onRoof = false;

        const playerFootZ = this.position.z;
        const playerX = this.position.x;

        for (const obs of obstacles) {
            if (obs.userData && obs.userData.type === 'train') {
                const trainX = obs.position.x;
                const trainZ = obs.position.z;
                const tWidth = obs.userData.width;
                const tLength = obs.userData.length;
                const tHeight = obs.userData.height;
                const isRamp = obs.userData.isRamp;

                // Kiểm tra xem người chơi có đang ở trong dải X của làn tàu không
                if (Math.abs(playerX - trainX) < tWidth / 2 + 0.3) {
                    // 1. Kiểm tra dốc dắt lên nóc tàu (Ramp)
                    if (isRamp) {
                        const rampStartZ = trainZ + tLength / 2 + 7.5;
                        const rampEndZ = trainZ + tLength / 2;
                        if (playerFootZ <= rampStartZ && playerFootZ >= rampEndZ) {
                            const ratio = (rampStartZ - playerFootZ) / 7.5;
                            const rampY = ratio * (tHeight + 0.3);
                            detectedGroundY = Math.max(detectedGroundY, rampY);
                            onRoof = true;
                        }
                    }

                    // 2. Kiểm tra nóc tàu
                    const roofStartZ = trainZ + tLength / 2;
                    const roofEndZ = trainZ - tLength / 2;
                    if (playerFootZ <= roofStartZ && playerFootZ >= roofEndZ) {
                        // Nếu chân người chơi đang ở tầm nóc tàu
                        if (this.position.y >= tHeight - 0.5) {
                            detectedGroundY = Math.max(detectedGroundY, tHeight + 0.3);
                            onRoof = true;
                        }
                    }
                }
            }
        }

        this.currentGroundY = detectedGroundY;
        this.isOnTrainRoof = onRoof;
        if (this.position.y > this.currentGroundY + 0.05) {
            this.isGrounded = false;
        }
    }

    animateCharacter(dt, speed) {
        const parts = this.mesh.userData;
        if (!parts.bodyRoot) return;

        const isHoverboarding = this.powerups.hoverboard > 0;
        const isJetpacking = this.powerups.jetpack > 0;

        if (isJetpacking) {
            // Tư thế bay phản lực
            parts.torsoGroup.position.set(0, 1.05, 0);
            parts.torsoGroup.rotation.set(-0.25, 0, 0);
            parts.headGroup.rotation.set(0.3, 0, 0);
            parts.leftArmGroup.rotation.set(0.2, 0, -0.4);
            parts.rightArmGroup.rotation.set(0.2, 0, 0.4);
            parts.leftLegGroup.rotation.set(-0.15, 0, -0.15);
            parts.rightLegGroup.rotation.set(-0.15, 0, 0.15);
            parts.shadowMesh.scale.set(0.4, 0.4, 0.4);
        } else if (isHoverboarding) {
            // Tư thế lướt ván (Surfing Stance)
            parts.torsoGroup.position.set(0, 0.95, 0);
            parts.torsoGroup.rotation.set(0, 0.4, 0);
            parts.headGroup.rotation.set(0, -0.4, 0);
            parts.leftArmGroup.rotation.set(-0.3, 0, -0.5);
            parts.rightArmGroup.rotation.set(0.3, 0, 0.5);
            parts.leftLegGroup.rotation.set(0.2, 0.3, 0);
            parts.rightLegGroup.rotation.set(-0.2, -0.3, 0);
            parts.shadowMesh.scale.set(1.2, 1.2, 1.2);
        } else if (this.isSliding) {
            // Tư thế trượt đất (Slide crouch)
            parts.torsoGroup.position.set(0, 0.5, -0.3);
            parts.torsoGroup.rotation.set(0.6, 0, 0);
            parts.headGroup.rotation.set(-0.5, 0, 0);
            parts.leftArmGroup.rotation.set(-0.8, 0, 0);
            parts.rightArmGroup.rotation.set(-0.8, 0, 0);
            parts.leftLegGroup.rotation.set(-1.2, 0, 0);
            parts.rightLegGroup.rotation.set(0.6, 0, 0);
            parts.shadowMesh.scale.set(1.0, 1.5, 1.0);
        } else if (!this.isGrounded) {
            // Tư thế nhảy (Jump pose)
            parts.torsoGroup.position.set(0, 1.05, 0);
            parts.torsoGroup.rotation.set(-0.15, 0, 0);
            parts.leftArmGroup.rotation.set(-1.5, 0, -0.3);
            parts.rightArmGroup.rotation.set(-1.5, 0, 0.3);
            parts.leftLegGroup.rotation.set(0.8, 0, 0);
            parts.rightLegGroup.rotation.set(0.5, 0, 0);

            const shadowScale = Math.max(0.3, 1.0 - this.position.y * 0.15);
            parts.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        } else {
            // Tư thế chạy bộ bình thường (Running cycle)
            this.runCycle += speed * 0.65 * dt;
            const swing = Math.sin(this.runCycle);
            const bob = Math.abs(Math.cos(this.runCycle)) * 0.08;

            parts.torsoGroup.position.set(0, 1.05 + bob, 0);
            parts.torsoGroup.rotation.set(0.1, 0, 0);
            parts.headGroup.rotation.set(-0.08, 0, 0);

            // Đung đưa tay chân so le
            parts.leftArmGroup.rotation.set(swing * 0.8, 0, 0);
            parts.rightArmGroup.rotation.set(-swing * 0.8, 0, 0);
            parts.leftLegGroup.rotation.set(-swing * 0.85, 0, 0);
            parts.rightLegGroup.rotation.set(swing * 0.85, 0, 0);

            parts.shadowMesh.scale.set(1.0, 1.0, 1.0);
        }
    }

    // ==================== TÍNH TOÁN VA CHẠM ====================
    getHitbox() {
        const height = this.isSliding ? 0.9 : 1.9;
        const yOffset = this.isSliding ? 0.45 : 0.95;
        return {
            minX: this.position.x - 0.42,
            maxX: this.position.x + 0.42,
            minY: this.position.y,
            maxY: this.position.y + height,
            minZ: this.position.z - 0.35,
            maxZ: this.position.z + 0.35
        };
    }
}

window.Player = Player;
