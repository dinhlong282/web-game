/**
 * Subway Surfers Web - Procedural Track Manager
 */
class TrackManager {
    constructor(scene) {
        this.scene = scene;
        this.chunkLength = 60;
        this.visibleChunks = 8;
        this.lanes = [2.8, 0, -2.8]; // Làn 0: Trái (+2.8), Làn 1: Giữa (0), Làn 2: Phải (-2.8)

        this.chunks = [];
        this.obstacles = [];
        this.coins = [];
        this.powerups = [];
        this.movingTrains = [];
        this.wordLetters = [];

        this.nextSpawnZ = 0;
        this.chunkCount = 0;
    }

    reset() {
        // Xóa sạch vật thể cũ khỏi Scene
        this.chunks.forEach(c => this.scene.remove(c));
        this.obstacles.forEach(o => this.scene.remove(o));
        this.coins.forEach(c => this.scene.remove(c));
        this.powerups.forEach(p => this.scene.remove(p));
        this.movingTrains.forEach(t => this.scene.remove(t));
        this.wordLetters.forEach(w => this.scene.remove(w));

        this.chunks = [];
        this.obstacles = [];
        this.coins = [];
        this.powerups = [];
        this.movingTrains = [];
        this.wordLetters = [];

        this.nextSpawnZ = -20;
        this.chunkCount = 0;

        // Sinh các chunk ban đầu
        for (let i = 0; i < this.visibleChunks; i++) {
            this.spawnChunk(this.chunkCount < 2);
        }
    }

    spawnChunk(isWarmup = false) {
        const chunkZ = this.nextSpawnZ + this.chunkLength / 2;
        const chunk = window.modelBuilder.createTrackChunk(this.chunkLength);
        chunk.position.z = chunkZ;
        this.scene.add(chunk);
        this.chunks.push(chunk);

        if (!isWarmup) {
            this.populateChunk(chunkZ);
        } else {
            // Warmup: Chỉ sinh tiền xu dẫn đường
            this.spawnCoinLine(0, chunkZ - 15, chunkZ + 15, 0.9);
        }

        this.nextSpawnZ += this.chunkLength;
        this.chunkCount++;
    }

    populateChunk(centerZ) {
        const isJetpack = window.game && window.game.player && window.game.player.powerups.jetpack > 0;

        if (isJetpack) {
            // Khi đang bay Jetpack -> Sinh tiền xu trên bầu trời (Y = 8 -> 10)
            const lane = this.lanes[Math.floor(Math.random() * this.lanes.length)];
            this.spawnSkyCoinTrail(lane, centerZ - 20, centerZ + 20);
            return;
        }

        const patterns = [
            'single_train_with_coins',
            'ramp_train_rooftop_run',
            'moving_train_challenge',
            'jump_and_slide_combo',
            'double_train_squeeze',
            'powerup_node',
            'triple_barrier_choice'
        ];

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        switch (pattern) {
            case 'single_train_with_coins': {
                const trainLaneIdx = Math.random() > 0.5 ? 0 : 2;
                const trainX = this.lanes[trainLaneIdx];
                const train = window.modelBuilder.createTrain({
                    colorType: Math.random() > 0.5 ? 'red' : 'blue',
                    isRamp: false
                });
                train.position.set(trainX, 0, centerZ);
                this.scene.add(train);
                this.obstacles.push(train);

                // Làn giữa có tiền xu
                this.spawnCoinArc(0, centerZ - 10, centerZ + 10);

                // Làn còn lại có rào chắn thấp
                const otherLaneIdx = trainLaneIdx === 0 ? 2 : 0;
                const barrier = window.modelBuilder.createObstacle('low_barrier');
                barrier.position.set(this.lanes[otherLaneIdx], 0, centerZ);
                this.scene.add(barrier);
                this.obstacles.push(barrier);
                break;
            }

            case 'ramp_train_rooftop_run': {
                const laneIdx = Math.floor(Math.random() * 3);
                const trainX = this.lanes[laneIdx];
                const train = window.modelBuilder.createTrain({
                    colorType: 'red',
                    isRamp: true
                });
                train.position.set(trainX, 0, centerZ);
                this.scene.add(train);
                this.obstacles.push(train);

                // Đồng xu chạy dọc từ dốc lên nóc tàu
                this.spawnRampCoins(trainX, centerZ);

                // Các làn khác có rào chắn
                this.lanes.forEach((lx, idx) => {
                    if (idx !== laneIdx && Math.random() > 0.4) {
                        const obsType = Math.random() > 0.5 ? 'low_barrier' : 'high_barrier';
                        const obs = window.modelBuilder.createObstacle(obsType);
                        obs.position.set(lx, 0, centerZ + (Math.random() * 10 - 5));
                        this.scene.add(obs);
                        this.obstacles.push(obs);
                    }
                });
                break;
            }

            case 'moving_train_challenge': {
                const laneIdx = Math.floor(Math.random() * 3);
                const trainX = this.lanes[laneIdx];
                const train = window.modelBuilder.createTrain({
                    colorType: 'blue',
                    isRamp: false
                });
                // Tàu xuất hiện xa và chạy ngược về phía người chơi
                train.position.set(trainX, 0, centerZ + 15);
                train.userData.isMoving = true;
                train.userData.speed = 12;
                this.scene.add(train);
                this.obstacles.push(train);
                this.movingTrains.push(train);

                // Hai làn còn lại có tiền xu & rào chắn
                const safeLane = this.lanes[(laneIdx + 1) % 3];
                this.spawnCoinLine(safeLane, centerZ - 15, centerZ + 15, 0.9);
                break;
            }

            case 'jump_and_slide_combo': {
                const laneIdx = Math.floor(Math.random() * 3);
                const laneX = this.lanes[laneIdx];

                // Rào thấp (Nhảy)
                const low = window.modelBuilder.createObstacle('low_barrier');
                low.position.set(laneX, 0, centerZ - 10);
                this.scene.add(low);
                this.obstacles.push(low);

                // Rào cao (Trượt) ngay sau đó
                const high = window.modelBuilder.createObstacle('high_barrier');
                high.position.set(laneX, 0, centerZ + 8);
                this.scene.add(high);
                this.obstacles.push(high);

                // Xu uốn lượn qua rào
                this.spawnCoinArc(laneX, centerZ - 14, centerZ - 6);
                this.spawnCoinLine(laneX, centerZ + 4, centerZ + 12, 0.5); // Xu thấp sát đất
                break;
            }

            case 'double_train_squeeze': {
                // Hai tàu 2 bên, hẹp ở giữa
                const trainL = window.modelBuilder.createTrain({ colorType: 'red', isRamp: false });
                trainL.position.set(this.lanes[0], 0, centerZ);
                const trainR = window.modelBuilder.createTrain({ colorType: 'blue', isRamp: false });
                trainR.position.set(this.lanes[2], 0, centerZ);

                this.scene.add(trainL, trainR);
                this.obstacles.push(trainL, trainR);

                // Làn giữa có chuỗi tiền vàng dày đặc
                this.spawnCoinLine(0, centerZ - 12, centerZ + 12, 0.9);
                break;
            }

            case 'powerup_node': {
                const types = ['magnet', 'jetpack', 'sneakers', 'multiplier'];
                const pType = types[Math.floor(Math.random() * types.length)];
                const pLane = this.lanes[Math.floor(Math.random() * this.lanes.length)];

                const powerup = window.modelBuilder.createPowerup(pType);
                powerup.position.set(pLane, 1.2, centerZ);
                this.scene.add(powerup);
                this.powerups.push(powerup);

                // Chuỗi xu bao quanh
                this.spawnCoinLine(pLane, centerZ - 12, centerZ - 3, 0.9);
                this.spawnCoinLine(pLane, centerZ + 3, centerZ + 12, 0.9);
                break;
            }

            case 'triple_barrier_choice': {
                // Cả 3 làn có rào chắn nhưng loại khác nhau
                const low1 = window.modelBuilder.createObstacle('low_barrier');
                low1.position.set(this.lanes[0], 0, centerZ);

                const high = window.modelBuilder.createObstacle('high_barrier');
                high.position.set(this.lanes[1], 0, centerZ);

                const low2 = window.modelBuilder.createObstacle('low_barrier');
                low2.position.set(this.lanes[2], 0, centerZ);

                this.scene.add(low1, high, low2);
                this.obstacles.push(low1, high, low2);

                this.spawnCoinLine(this.lanes[1], centerZ - 10, centerZ + 10, 0.5);
                break;
            }
        }

        // Thỉnh thoảng sinh chữ cái Word Hunt (S - U - R - F)
        if (window.game && Math.random() > 0.45) {
            const wh = window.game.wordHunt;
            const uncollectedIndices = [];
            wh.collected.forEach((isCol, i) => { if (!isCol) uncollectedIndices.push(i); });

            if (uncollectedIndices.length > 0) {
                const targetIdx = uncollectedIndices[Math.floor(Math.random() * uncollectedIndices.length)];
                const letter = wh.letters[targetIdx];
                const letterMesh = window.modelBuilder.createWordLetter(letter);
                const lane = this.lanes[Math.floor(Math.random() * this.lanes.length)];
                letterMesh.position.set(lane, 1.2, centerZ + (Math.random() * 8 - 4));
                this.scene.add(letterMesh);
                this.wordLetters.push(letterMesh);
            }
        }
    }

    // ==================== CÁC HÀM SINH TIỀN XU ====================
    spawnCoinLine(x, startZ, endZ, y = 0.9) {
        const step = 2.2;
        for (let z = startZ; z <= endZ; z += step) {
            const coin = window.modelBuilder.createCoin();
            coin.position.set(x, y, z);
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    spawnCoinArc(x, startZ, endZ) {
        const count = 7;
        const midIdx = (count - 1) / 2;
        for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            const z = startZ + (endZ - startZ) * ratio;
            // Parabola Y
            const distFromMid = Math.abs(i - midIdx) / midIdx;
            const y = 0.9 + (1 - distFromMid * distFromMid) * 2.5;

            const coin = window.modelBuilder.createCoin();
            coin.position.set(x, y, z);
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    spawnRampCoins(x, trainCenterZ) {
        // Dốc lên từ Z = trainCenterZ + 15 -> trainCenterZ + 12
        // Nóc tàu Z = trainCenterZ + 10 -> trainCenterZ - 10, Y = 4.2
        for (let z = trainCenterZ + 15; z >= trainCenterZ - 10; z -= 2.2) {
            const coin = window.modelBuilder.createCoin();
            let y = 4.2;
            if (z > trainCenterZ + 12) {
                const ratio = (trainCenterZ + 15 - z) / 3.0;
                y = 0.9 + ratio * 3.3;
            }
            coin.position.set(x, y, z);
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    spawnSkyCoinTrail(x, startZ, endZ) {
        // Sinh 3 làn xu uốn lượn phong phú trên bầu trời
        for (let z = startZ; z <= endZ; z += 2.0) {
            // Làn chính uốn lượn hình sin
            const waveY = 9.2 + Math.sin(z * 0.12) * 1.2;
            const coinCenter = window.modelBuilder.createCoin();
            coinCenter.position.set(x, waveY, z);
            this.scene.add(coinCenter);
            this.coins.push(coinCenter);

            // Thỉnh thoảng sinh thêm chùm xu ở 2 bên làn
            if (Math.floor(z) % 4 === 0) {
                const coinL = window.modelBuilder.createCoin();
                coinL.position.set(2.8, waveY, z);
                this.scene.add(coinL);
                this.coins.push(coinL);

                const coinR = window.modelBuilder.createCoin();
                coinR.position.set(-2.8, waveY, z);
                this.scene.add(coinR);
                this.coins.push(coinR);
            }
        }
    }

    spawnImmediateSkyCoins(startZ, endZ) {
        // Sinh tức thì dải xu bầu trời khi vừa nhặt Jetpack
        for (let z = startZ; z <= endZ; z += 2.2) {
            const waveY = 9.2 + Math.sin(z * 0.12) * 1.2;
            const laneOffset = Math.sin(z * 0.08) * 2.8;

            const coin = window.modelBuilder.createCoin();
            coin.position.set(laneOffset, waveY, z);
            this.scene.add(coin);
            this.coins.push(coin);

            if (Math.floor(z) % 6 === 0) {
                const coinExtra = window.modelBuilder.createCoin();
                coinExtra.position.set(0, waveY + 0.6, z);
                this.scene.add(coinExtra);
                this.coins.push(coinExtra);
            }
        }
    }

    // ==================== CẬP NHẬT MỖI FRAME ====================
    update(dt, playerZ) {
        const time = Date.now() * 0.003;

        // 1. Xoay đồng tiền vàng
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.rotation.y += 4.0 * dt;

            // Xóa coin đã trôi qua phía sau người chơi
            if (coin.position.z < playerZ - 20 || coin.userData.collected) {
                this.scene.remove(coin);
                this.coins.splice(i, 1);
            }
        }

        // 2. Hiệu ứng xoay & lơ lửng Powerup
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            p.rotation.y += 2.5 * dt;
            p.position.y = 1.1 + Math.sin(time * 3 + p.position.z) * 0.2;

            if (p.position.z < playerZ - 20 || p.userData.collected) {
                this.scene.remove(p);
                this.powerups.splice(i, 1);
            }
        }

        // 3. Cập nhật tàu chạy ngược chiều
        for (let i = this.movingTrains.length - 1; i >= 0; i--) {
            const t = this.movingTrains[i];
            t.position.z -= t.userData.speed * dt;
            if (t.position.z < playerZ - 30) {
                this.movingTrains.splice(i, 1);
            }
        }

        // 4. Dọn dẹp chướng ngại vật trôi qua sau
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            if (obs.position.z < playerZ - 35) {
                this.scene.remove(obs);
                this.obstacles.splice(i, 1);
            }
        }

        // 5. Quản lý sinh & tái chế Chunks
        if (this.chunks.length > 0 && this.chunks[0].position.z < playerZ - this.chunkLength - 10) {
            const oldChunk = this.chunks.shift();
            this.scene.remove(oldChunk);
            this.spawnChunk(false);
        }
    }
}

window.TrackManager = TrackManager;
