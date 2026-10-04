/**
 * Subway Surfers Web - Ultra-Detailed 3D Models Builder
 * Phiên bản đồ họa 3D siêu chi tiết chuẩn nguyên bản Subway Surfers:
 * - Nhân vật Jake/Tricky/Fresh với đầy đủ chi tiết khuôn mặt, trang phục, balo, bình sơn xịt, giày sneaker
 * - Tàu hỏa hiện đại với kính phản chiếu, đèn pha phát sáng, bánh xe trục sắt, nóc tàu tản nhiệt
 * - Bãi biển nhiệt đới: Biển xanh lấp lánh, bờ cát vàng, hàng dừa rợp bóng, dù bãi biển, ván lướt sóng, thuyền buồm, chim hải âu
 * - Đồng xu vàng 3D dập nổi, Powerups (Jetpack phun lửa, Giày có cánh, Nam châm điện, Sao 2X)
 */
class ModelBuilder {
    constructor() {
        this.materials = this.initMaterials();
    }

    initMaterials() {
        return {
            // Môi trường Bãi biển & Đường ray
            ground: new THREE.MeshLambertMaterial({ color: 0x334155 }),
            gravel: new THREE.MeshLambertMaterial({ color: 0x475569 }),
            sand: new THREE.MeshLambertMaterial({ color: 0xf59e0b }),
            sandLight: new THREE.MeshLambertMaterial({ color: 0xfcd34d }),
            sandDark: new THREE.MeshLambertMaterial({ color: 0xd97706 }),
            water: new THREE.MeshStandardMaterial({
                color: 0x0284c7,
                roughness: 0.1,
                metalness: 0.45,
                transparent: true,
                opacity: 0.92
            }),
            waterFoam: new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.75 }),
            rail: new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.12 }),
            railBase: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 }),
            sleeper: new THREE.MeshLambertMaterial({ color: 0x451a03 }),
            sleeperPlate: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 }),
            
            // Cây cối & Đạo cụ bãi biển
            palmTrunk: new THREE.MeshLambertMaterial({ color: 0x78350f }),
            palmTrunkRing: new THREE.MeshLambertMaterial({ color: 0x92400e }),
            palmLeaf: new THREE.MeshLambertMaterial({ color: 0x15803d }),
            palmLeafLight: new THREE.MeshLambertMaterial({ color: 0x22c55e }),
            coconut: new THREE.MeshLambertMaterial({ color: 0x451a03 }),
            umbrellaRed: new THREE.MeshLambertMaterial({ color: 0xef4444 }),
            umbrellaWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            umbrellaYellow: new THREE.MeshLambertMaterial({ color: 0xfbbf24 }),
            umbrellaBlue: new THREE.MeshLambertMaterial({ color: 0x0284c7 }),
            surfboardTeal: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2, metalness: 0.3 }),
            surfboardStripe: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
            cloud: new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 }),
            seagull: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            sail: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
            boatHull: new THREE.MeshLambertMaterial({ color: 0xb91c1c }),

            // Rào chắn & Cột tín hiệu
            steelGirder: new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.25 }),
            steelPost: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 }),
            hazardYellow: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
            hazardBlack: new THREE.MeshLambertMaterial({ color: 0x0f172a }),
            barrierWood: new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }),
            warningRed: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
            warningOrange: new THREE.MeshBasicMaterial({ color: 0xf97316 }),
            warningGreen: new THREE.MeshBasicMaterial({ color: 0x22c55e }),

            // Vàng / Xu 3D
            gold: new THREE.MeshStandardMaterial({
                color: 0xffd700,
                emissive: 0xf59e0b,
                emissiveIntensity: 0.4,
                metalness: 0.95,
                roughness: 0.1
            }),
            goldInner: new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                emissive: 0xd97706,
                emissiveIntensity: 0.3,
                metalness: 0.9,
                roughness: 0.15
            }),
            starEmblem: new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xfef08a,
                emissiveIntensity: 0.5,
                metalness: 0.8
            }),

            // Tàu hỏa 3D siêu chi tiết
            trainRedBody: new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.25, metalness: 0.3 }),
            trainBlueBody: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.3 }),
            trainWhiteStripe: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            trainSilverRoof: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 }),
            trainWindow: new THREE.MeshStandardMaterial({
                color: 0x0ea5e9,
                emissive: 0x0284c7,
                emissiveIntensity: 0.65,
                roughness: 0.05,
                metalness: 0.9
            }),
            trainHeadlight: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            trainTaillight: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
            trainBumper: new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 }),
            trainWheel: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.15 }),
            rampMetal: new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.25 }),

            // Powerups
            magnetRed: new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.65, roughness: 0.2 }),
            magnetSilver: new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.05 }),
            jetpackSilver: new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.15 }),
            jetpackNozzle: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 }),
            jetpackFlame: new THREE.MeshBasicMaterial({ color: 0xff5400 }),
            jetpackFlameCore: new THREE.MeshBasicMaterial({ color: 0xffd100 }),
            sneakerGold: new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.5 }),
            sneakerWing: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            multiplierCyan: new THREE.MeshStandardMaterial({
                color: 0x00f5d4,
                emissive: 0x06b6d4,
                emissiveIntensity: 0.65,
                metalness: 0.6
            }),

            shadow: new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.35,
                depthWrite: false
            })
        };
    }

    // ==================== TẠO NHÂN VẬT 3D CHUẨN XÁC NGUYÊN BẢN ====================
    createCharacter(skinId = 'jake') {
        const charGroup = new THREE.Group();

        // 1. Cấu hình màu trang phục
        const configs = {
            jake: {
                skin: 0xfcd34d,        // Da vàng cam hoạt hình
                hair: 0x543310,        // Tóc nâu sẫm
                hat: 0xd90429,         // Mũ đỏ đội ngược
                hatPatch: 0xffffff,    // Logo trắng trên mũ
                hoodie: 0x2563eb,      // Áo denim xanh
                hoodieInner: 0xffffff, // Áo thun trắng lót trong
                pants: 0x1e3a8a,       // Quần jeans xanh đậm
                pantsCuff: 0x60a5fa,   // Gấu quần xắn
                shoes: 0xd90429,       // Giày sneaker đỏ
                shoeSole: 0xffffff,    // Đế giày trắng
                backpack: 0x475569     // Balo xám
            },
            tricky: {
                skin: 0xfde68a,
                hair: 0xfacc15,        // Tóc vàng hoe pigtails
                hat: 0xf59e0b,         // Mũ len cam vàng
                hatPatch: 0xd97706,
                hoodie: 0xffffff,      // Áo crop top trắng
                hoodieInner: 0xec4899,
                pants: 0xdb2777,       // Quần baggy hồng
                pantsCuff: 0xf472b6,
                shoes: 0x18181b,       // Giày trượt ván đen
                shoeSole: 0xffffff,
                backpack: 0x831843
            },
            fresh: {
                skin: 0x92400e,
                hair: 0x18181b,        // Tóc fade
                hat: 0xef4444,         // Kính mát đỏ to bản
                hatPatch: 0x06b6d4,
                hoodie: 0x06b6d4,      // Áo gió xanh ngọc
                hoodieInner: 0xa855f7,
                pants: 0x6b21a8,       // Quần thể thao tím
                pantsCuff: 0xc084fc,
                shoes: 0xfacc15,       // Giày sneaker vàng
                shoeSole: 0xffffff,
                backpack: 0x3b82f6
            },
            cyber: {
                skin: 0x99f6e4,
                hair: 0xa855f7,
                hat: 0x00f5d4,         // Kính ngắm neon phát sáng
                hatPatch: 0x00f5d4,
                hoodie: 0x0f172a,      // Giáp đen công nghệ
                hoodieInner: 0x00f5d4,
                pants: 0x020617,
                pantsCuff: 0x38bdf8,
                shoes: 0x00f5d4,       // Giày phát sáng
                shoeSole: 0x38bdf8,
                backpack: 0x0284c7
            }
        };

        const cfg = configs[skinId] || configs.jake;

        const matSkin = new THREE.MeshLambertMaterial({ color: cfg.skin });
        const matHair = new THREE.MeshLambertMaterial({ color: cfg.hair });
        const matHat = new THREE.MeshLambertMaterial({ color: cfg.hat });
        const matHatPatch = new THREE.MeshLambertMaterial({ color: cfg.hatPatch });
        const matHoodie = new THREE.MeshLambertMaterial({ color: cfg.hoodie });
        const matHoodieInner = new THREE.MeshLambertMaterial({ color: cfg.hoodieInner });
        const matPants = new THREE.MeshLambertMaterial({ color: cfg.pants });
        const matPantsCuff = new THREE.MeshLambertMaterial({ color: cfg.pantsCuff });
        const matShoes = new THREE.MeshLambertMaterial({ color: cfg.shoes });
        const matSole = new THREE.MeshLambertMaterial({ color: cfg.shoeSole });
        const matBackpack = new THREE.MeshLambertMaterial({ color: cfg.backpack });

        const bodyRoot = new THREE.Group();
        bodyRoot.name = "bodyRoot";
        charGroup.add(bodyRoot);

        // 1. Thân người (Torso & Denim Vest)
        const torsoGroup = new THREE.Group();
        torsoGroup.name = "torsoGroup";
        torsoGroup.position.y = 1.08;
        bodyRoot.add(torsoGroup);

        // Áo khoác ngoài
        const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.76, 0.44), matHoodie);
        torsoMesh.castShadow = true;
        torsoGroup.add(torsoMesh);

        // Cổ áo & vạt áo thun trắng bên trong
        const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.58, 0.46), matHoodieInner);
        innerShirt.position.set(0, -0.09, 0.01);
        torsoGroup.add(innerShirt);

        // Dây rút mũ hoodie trắng hai bên
        const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
        const cordL = new THREE.Mesh(cordGeo, matHoodieInner);
        cordL.position.set(-0.14, 0.12, 0.24);
        const cordR = cordL.clone();
        cordR.position.x = 0.14;
        torsoGroup.add(cordL, cordR);

        // Balo Subway Surfers
        const backpackMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.6, 0.28), matBackpack);
        backpackMesh.position.set(0, 0.06, -0.28);
        backpackMesh.castShadow = true;
        torsoGroup.add(backpackMesh);

        // Bình xịt sơn nhét hông balo
        const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 8), new THREE.MeshLambertMaterial({ color: 0x00f5d4 }));
        canBody.position.set(0.22, 0.18, -0.34);
        canBody.rotation.z = -0.3;
        const canCap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        canCap.position.set(0.24, 0.36, -0.34);
        canCap.rotation.z = -0.3;
        torsoGroup.add(canBody, canCap);

        // 2. Đầu, Mũ đội ngược & Khuôn mặt
        const headGroup = new THREE.Group();
        headGroup.name = "headGroup";
        headGroup.position.set(0, 0.62, 0);
        torsoGroup.add(headGroup);

        const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), matSkin);
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Tóc mái nhô ra trước trán
        const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.22), matHair);
        hairMesh.position.set(0, 0.19, 0.18);
        headGroup.add(hairMesh);

        // Mũ lưỡi trai đỏ đội ngược
        const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.52), matHat);
        capCrown.position.y = 0.19;
        headGroup.add(capCrown);

        // Nút chóp trên đỉnh mũ
        const capButton = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), matHatPatch);
        capButton.position.y = 0.32;
        headGroup.add(capButton);

        // Vành mũ quay ra phía sau gáy
        const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.32), matHat);
        capVisor.position.set(0, 0.15, -0.36);
        capVisor.rotation.x = -0.12;
        headGroup.add(capVisor);

        // Logo tròn trắng thêu chữ "S" mặt trước mũ
        const capBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 12), matHatPatch);
        capBadge.rotation.x = Math.PI / 2;
        capBadge.position.set(0, 0.22, 0.27);
        headGroup.add(capBadge);

        // Mắt đen to tròn có điểm sáng
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.04), eyeMat);
        eyeL.position.set(-0.14, 0.04, 0.25);
        const eyeR = eyeL.clone();
        eyeR.position.x = 0.14;
        headGroup.add(eyeL, eyeR);

        // 3. Tay trái (Left Arm)
        const leftArmGroup = new THREE.Group();
        leftArmGroup.name = "leftArmGroup";
        leftArmGroup.position.set(-0.5, 0.28, 0);
        torsoGroup.add(leftArmGroup);

        const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.24), matHoodie);
        leftSleeve.position.y = -0.16;
        leftSleeve.castShadow = true;
        leftArmGroup.add(leftSleeve);

        const leftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.36, 0.19), matSkin);
        leftForearm.position.y = -0.44;
        leftArmGroup.add(leftForearm);

        const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), matSkin);
        leftHand.position.y = -0.64;
        leftArmGroup.add(leftHand);

        // 4. Tay phải (Right Arm)
        const rightArmGroup = new THREE.Group();
        rightArmGroup.name = "rightArmGroup";
        rightArmGroup.position.set(0.5, 0.28, 0);
        torsoGroup.add(rightArmGroup);

        const rightSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.24), matHoodie);
        rightSleeve.position.y = -0.16;
        rightSleeve.castShadow = true;
        rightArmGroup.add(rightSleeve);

        const rightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.36, 0.19), matSkin);
        rightForearm.position.y = -0.44;
        rightArmGroup.add(rightForearm);

        const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), matSkin);
        rightHand.position.y = -0.64;
        rightArmGroup.add(rightHand);

        // 5. Chân trái & Giày Sneaker
        const leftLegGroup = new THREE.Group();
        leftLegGroup.name = "leftLegGroup";
        leftLegGroup.position.set(-0.22, 0.72, 0);
        bodyRoot.add(leftLegGroup);

        const leftPants = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.58, 0.3), matPants);
        leftPants.position.y = -0.26;
        leftPants.castShadow = true;
        leftLegGroup.add(leftPants);

        // Gấu quần xắn
        const leftCuff = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.32), matPantsCuff);
        leftCuff.position.y = -0.52;
        leftLegGroup.add(leftCuff);

        // Giày Sneaker cao cổ
        const leftShoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.46), matShoes);
        leftShoeBody.position.set(0, -0.62, 0.08);
        leftShoeBody.castShadow = true;
        const leftShoeToe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.14), matSole);
        leftShoeToe.position.set(0, -0.65, 0.26);
        const leftShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.48), matSole);
        leftShoeSole.position.set(0, -0.71, 0.08);
        leftLegGroup.add(leftShoeBody, leftShoeToe, leftShoeSole);

        // 6. Chân phải & Giày Sneaker
        const rightLegGroup = new THREE.Group();
        rightLegGroup.name = "rightLegGroup";
        rightLegGroup.position.set(0.22, 0.72, 0);
        bodyRoot.add(rightLegGroup);

        const rightPants = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.58, 0.3), matPants);
        rightPants.position.y = -0.26;
        rightPants.castShadow = true;
        rightLegGroup.add(rightPants);

        const rightCuff = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.32), matPantsCuff);
        rightCuff.position.y = -0.52;
        rightLegGroup.add(rightCuff);

        const rightShoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.46), matShoes);
        rightShoeBody.position.set(0, -0.62, 0.08);
        rightShoeBody.castShadow = true;
        const rightShoeToe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.14), matSole);
        rightShoeToe.position.set(0, -0.65, 0.26);
        const rightShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.48), matSole);
        rightShoeSole.position.set(0, -0.71, 0.08);
        rightLegGroup.add(rightShoeBody, rightShoeToe, rightShoeSole);

        // 7. Bóng tròn dập nổi trên mặt đất
        const shadowGeo = new THREE.CircleGeometry(0.72, 16);
        shadowGeo.rotateX(-Math.PI / 2);
        const shadowMesh = new THREE.Mesh(shadowGeo, this.materials.shadow);
        shadowMesh.position.y = 0.03;
        charGroup.add(shadowMesh);

        charGroup.userData = {
            bodyRoot,
            torsoGroup,
            headGroup,
            leftArmGroup,
            rightArmGroup,
            leftLegGroup,
            rightLegGroup,
            shadowMesh
        };

        return charGroup;
    }

    // ==================== TẠO CÂY DỪA 3D NHIỆT ĐỚI ====================
    createPalmTree() {
        const tree = new THREE.Group();
        tree.name = "palmTree";

        const height = 7.5 + Math.random() * 2.0;
        const segments = 7;
        let currentY = 0;
        let currentCurve = 0;
        const curveDir = (Math.random() - 0.5) * 0.45;

        // Các khúc thân dừa
        for (let i = 0; i < segments; i++) {
            const segH = height / segments;
            const r1 = 0.38 * (1 - (i / segments) * 0.35);
            const r2 = 0.38 * (1 - ((i + 1) / segments) * 0.35);
            const trunkMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(r2, r1, segH, 8),
                i % 2 === 0 ? this.materials.palmTrunk : this.materials.palmTrunkRing
            );
            trunkMesh.position.set(currentCurve, currentY + segH / 2, 0);
            trunkMesh.rotation.z = -curveDir * 0.35;
            trunkMesh.castShadow = true;
            tree.add(trunkMesh);

            currentY += segH;
            currentCurve += curveDir;
        }

        // Tán lá dừa xòe 8 cánh
        const leafCount = 8;
        for (let l = 0; l < leafCount; l++) {
            const angle = (l / leafCount) * Math.PI * 2;
            const leafGroup = new THREE.Group();
            leafGroup.position.set(currentCurve, currentY, 0);
            leafGroup.rotation.y = angle;

            const leafGeo = new THREE.BoxGeometry(0.6, 0.08, 3.5);
            leafGeo.translate(0, 0, 1.75);
            const leafMesh = new THREE.Mesh(
                leafGeo,
                l % 2 === 0 ? this.materials.palmLeaf : this.materials.palmLeafLight
            );
            leafMesh.rotation.x = -0.48 - Math.random() * 0.15;
            leafMesh.castShadow = true;
            leafGroup.add(leafMesh);

            tree.add(leafGroup);
        }

        // 3 quả dừa nâu
        for (let c = 0; c < 3; c++) {
            const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), this.materials.coconut);
            coconut.position.set(
                currentCurve + (Math.random() - 0.5) * 0.35,
                currentY - 0.22,
                (Math.random() - 0.5) * 0.35
            );
            tree.add(coconut);
        }

        return tree;
    }

    // ==================== TẠO TÀU HỎA 3D SIÊU CHI TIẾT ====================
    createTrain(options = {}) {
        const isRamp = options.isRamp || false;
        const colorType = options.colorType || 'red';
        const trainGroup = new THREE.Group();
        trainGroup.name = "train";

        const length = 25.0;
        const width = 2.3;
        const height = 3.3;

        const bodyMat = colorType === 'blue' ? this.materials.trainBlueBody : this.materials.trainRedBody;

        // 1. Thân tàu chính
        const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), bodyMat);
        bodyMesh.position.y = height / 2 + 0.35;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        trainGroup.add(bodyMesh);

        // 2. Dải sơn trắng dọc sườn tàu
        const stripeGeo = new THREE.BoxGeometry(width + 0.02, 0.45, length + 0.02);
        const stripeMesh = new THREE.Mesh(stripeGeo, this.materials.trainWhiteStripe);
        stripeMesh.position.y = height / 2 + 0.2;
        trainGroup.add(stripeMesh);

        // 3. Nóc tàu kim loại có gờ
        const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.32, length + 0.12), this.materials.trainSilverRoof);
        roofMesh.position.y = height + 0.45;
        roofMesh.receiveShadow = true;
        trainGroup.add(roofMesh);

        // Cụm điều hòa & thông gió trên nóc tàu
        for (let i = -8; i <= 8; i += 8) {
            const acMesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 2.8), this.materials.trainBumper);
            acMesh.position.set(0, height + 0.65, i);
            trainGroup.add(acMesh);
        }

        // 4. Cửa sổ kính phát quang hai bên sườn
        const winGeo = new THREE.BoxGeometry(0.08, 0.95, 1.5);
        for (let z = -9.5; z <= 9.5; z += 3.2) {
            const winLeft = new THREE.Mesh(winGeo, this.materials.trainWindow);
            winLeft.position.set(-width / 2 - 0.02, height / 2 + 0.55, z);
            const winRight = new THREE.Mesh(winGeo, this.materials.trainWindow);
            winRight.position.set(width / 2 + 0.02, height / 2 + 0.55, z);
            trainGroup.add(winLeft, winRight);
        }

        // 5. Đèn pha trước & Kính chắn gió đầu tàu
        const headLightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14);
        headLightGeo.rotateX(Math.PI / 2);
        const light1 = new THREE.Mesh(headLightGeo, this.materials.trainHeadlight);
        light1.position.set(-0.65, 1.25, length / 2 + 0.06);
        const light2 = light1.clone();
        light2.position.x = 0.65;
        trainGroup.add(light1, light2);

        const frontWin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.85, 0.1), this.materials.trainWindow);
        frontWin.position.set(0, height / 2 + 0.75, length / 2 + 0.03);
        trainGroup.add(frontWin);

        // 6. Gầm tàu & Bánh xe sắt
        const chassisMesh = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.38, length), this.materials.trainBumper);
        chassisMesh.position.y = 0.2;
        trainGroup.add(chassisMesh);

        // Bánh xe lăn dọc hai bên gầm tàu
        const wheelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 12);
        wheelGeo.rotateZ(Math.PI / 2);
        for (let z = -length / 2 + 3; z <= length / 2 - 3; z += 5.5) {
            const wL = new THREE.Mesh(wheelGeo, this.materials.trainWheel);
            wL.position.set(-width / 2 + 0.1, 0.26, z);
            const wR = new THREE.Mesh(wheelGeo, this.materials.trainWheel);
            wR.position.set(width / 2 - 0.1, 0.26, z);
            trainGroup.add(wL, wR);
        }

        // 7. Dốc dắt lên nóc tàu (Ramp)
        if (isRamp) {
            const rampLength = 8.0;
            const rampShape = new THREE.Shape();
            rampShape.moveTo(0, 0);
            rampShape.lineTo(0, height + 0.25);
            rampShape.lineTo(rampLength, 0);
            rampShape.closePath();

            const rampGeo = new THREE.ExtrudeGeometry(rampShape, { depth: width, bevelEnabled: false });
            rampGeo.center();
            rampGeo.rotateY(Math.PI / 2);

            const rampMesh = new THREE.Mesh(rampGeo, this.materials.rampMetal);
            rampMesh.position.set(0, (height + 0.25) / 2 + 0.15, length / 2 + rampLength / 2);
            rampMesh.receiveShadow = true;
            trainGroup.add(rampMesh);

            // Các vạch kẻ vàng đen cảnh báo trượt dốc
            const stripeGeo = new THREE.BoxGeometry(width + 0.06, 0.05, 0.45);
            for (let s = 1.2; s < rampLength - 0.5; s += 1.4) {
                const stripe = new THREE.Mesh(stripeGeo, this.materials.hazardYellow);
                const ratio = (rampLength - s) / rampLength;
                stripe.position.set(0, ratio * (height + 0.25) + 0.2, length / 2 + s);
                stripe.rotation.x = Math.atan2(height + 0.25, rampLength);
                trainGroup.add(stripe);
            }
        }

        trainGroup.userData = {
            type: 'train',
            isRamp: isRamp,
            length: length,
            width: width,
            height: height,
            hitbox: {
                minX: -width / 2,
                maxX: width / 2,
                minY: 0,
                maxY: height + 0.5,
                minZ: -length / 2,
                maxZ: isRamp ? length / 2 + 8.0 : length / 2
            }
        };

        return trainGroup;
    }

    // ==================== TẠO ĐỒNG TIỀN VÀNG 3D DẬP NỔI ====================
    createCoin() {
        const coinGroup = new THREE.Group();
        coinGroup.name = "coin";

        // Vành ngoài đồng xu
        const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.09, 18);
        coinGeo.rotateZ(Math.PI / 2);
        const coinMesh = new THREE.Mesh(coinGeo, this.materials.gold);
        coinMesh.castShadow = true;
        coinGroup.add(coinMesh);

        // Lòng trong dập nổi dải vàng cam
        const innerGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.11, 14);
        innerGeo.rotateZ(Math.PI / 2);
        const innerMesh = new THREE.Mesh(innerGeo, this.materials.goldInner);
        coinGroup.add(innerMesh);

        // Ngôi sao dập nổi ở giữa đồng xu
        const starGeo = new THREE.BoxGeometry(0.22, 0.08, 0.08);
        const star1 = new THREE.Mesh(starGeo, this.materials.starEmblem);
        const star2 = star1.clone();
        star2.rotation.x = Math.PI / 2;
        coinGroup.add(star1, star2);

        coinGroup.position.y = 0.95;

        coinGroup.userData = {
            type: 'coin',
            collected: false,
            radius: 0.48
        };

        return coinGroup;
    }

    // ==================== TẠO CHỮ CÁI SĂN CHỮ (WORD HUNT LETTER 3D) ====================
    createWordLetter(letter = 'S') {
        const group = new THREE.Group();
        group.name = "word_letter_" + letter;

        // Khung hộp chữ mạ vàng phát sáng
        const boxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.2);
        const boxMesh = new THREE.Mesh(boxGeo, this.materials.gold);
        boxMesh.castShadow = true;
        group.add(boxMesh);

        // Viền đỏ neon
        const borderGeo = new THREE.BoxGeometry(0.7, 0.7, 0.24);
        const borderMesh = new THREE.Mesh(borderGeo, this.materials.hazardBlack);
        group.add(borderMesh);

        group.position.y = 1.2;
        group.userData = {
            type: 'word_letter',
            letter: letter,
            collected: false,
            radius: 0.7
        };

        return group;
    }

    // ==================== TẠO POWERUPS 3D SIÊU ĐẸP ====================
    createPowerup(type = 'magnet') {
        const group = new THREE.Group();
        group.name = "powerup_" + type;
        group.position.y = 1.05;

        if (type === 'magnet') {
            // Nam châm chữ U đỏ bạc
            const ringGeo = new THREE.TorusGeometry(0.38, 0.11, 10, 20, Math.PI);
            const magnetBody = new THREE.Mesh(ringGeo, this.materials.magnetRed);
            magnetBody.rotation.z = Math.PI;
            group.add(magnetBody);

            const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), this.materials.magnetSilver);
            tipL.position.set(-0.38, -0.16, 0);
            const tipR = tipL.clone();
            tipR.position.x = 0.38;
            group.add(tipL, tipR);
        } else if (type === 'jetpack') {
            // Tên lửa phản lực đôi
            const tankGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.7, 14);
            const tankL = new THREE.Mesh(tankGeo, this.materials.jetpackSilver);
            tankL.position.x = -0.24;
            const tankR = tankL.clone();
            tankR.position.x = 0.24;

            const coneGeo = new THREE.ConeGeometry(0.16, 0.22, 14);
            const capL = new THREE.Mesh(coneGeo, this.materials.magnetRed);
            capL.position.set(-0.24, 0.44, 0);
            const capR = capL.clone();
            capR.position.x = 0.24;

            // Đầu ống xả lửa
            const nozzleGeo = new THREE.CylinderGeometry(0.14, 0.1, 0.15, 12);
            const nozzleL = new THREE.Mesh(nozzleGeo, this.materials.jetpackNozzle);
            nozzleL.position.set(-0.24, -0.42, 0);
            const nozzleR = nozzleL.clone();
            nozzleR.position.x = 0.24;

            // Ngọn lửa phản lực cam vàng
            const flameGeo = new THREE.ConeGeometry(0.14, 0.45, 8);
            flameGeo.rotateX(Math.PI);
            const flameL = new THREE.Mesh(flameGeo, this.materials.jetpackFlame);
            flameL.position.set(-0.24, -0.68, 0);
            const flameR = flameL.clone();
            flameR.position.x = 0.24;

            const frame = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.12), this.materials.hazardBlack);
            group.add(tankL, tankR, capL, capR, nozzleL, nozzleR, flameL, flameR, frame);
        } else if (type === 'sneakers') {
            // Giày vàng có cánh thiên thần
            const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.6), this.materials.sneakerGold);
            const wingGeo = new THREE.BoxGeometry(0.04, 0.25, 0.35);
            const wingL = new THREE.Mesh(wingGeo, this.materials.sneakerWing);
            wingL.position.set(-0.24, 0.18, -0.12);
            wingL.rotation.z = 0.35;
            const wingR = wingL.clone();
            wingR.position.x = 0.24;
            wingR.rotation.z = -0.35;
            group.add(shoe, wingL, wingR);
        } else if (type === 'multiplier') {
            // Huy hiệu ngôi sao nhân đôi
            const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 18), this.materials.multiplierCyan);
            badge.rotation.x = Math.PI / 2;
            const star1 = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.16, 0.16), this.materials.gold);
            const star2 = star1.clone();
            star2.rotation.z = Math.PI / 2;
            group.add(badge, star1, star2);
        }

        group.userData = {
            type: 'powerup',
            powerupType: type,
            collected: false,
            radius: 0.7
        };

        return group;
    }

    // ==================== TẠO RÀO CHẮN & VẬT CẢN ====================
    createObstacle(type = 'low_barrier') {
        const group = new THREE.Group();
        group.name = "obstacle_" + type;

        if (type === 'low_barrier') {
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.15, 0.14), this.materials.steelPost);
            leftPost.position.set(-1.0, 0.58, 0);
            const rightPost = leftPost.clone();
            rightPost.position.x = 1.0;

            const boardMesh = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.42, 0.09), this.materials.hazardYellow);
            boardMesh.position.set(0, 0.8, 0);
            boardMesh.castShadow = true;

            for (let x = -0.85; x <= 0.85; x += 0.45) {
                const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.43, 0.1), this.materials.hazardBlack);
                stripe.position.set(x, 0.8, 0);
                group.add(stripe);
            }

            const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 8), this.materials.warningOrange);
            beacon.position.set(0, 1.1, 0);

            group.add(leftPost, rightPost, boardMesh, beacon);

            group.userData = {
                type: 'low_barrier',
                mustJump: true,
                hitbox: { minX: -1.1, maxX: 1.1, minY: 0, maxY: 1.15, minZ: -0.3, maxZ: 0.3 }
            };
        } else if (type === 'high_barrier') {
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.75, 0.14), this.materials.steelGirder);
            leftPost.position.set(-1.08, 1.38, 0);
            const rightPost = leftPost.clone();
            rightPost.position.x = 1.08;

            const signMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.15, 0.11), this.materials.hazardYellow);
            signMesh.position.set(0, 2.1, 0);
            signMesh.castShadow = true;

            for (let x = -0.88; x <= 0.88; x += 0.44) {
                const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.16, 0.12), this.materials.hazardBlack);
                stripe.position.set(x, 2.1, 0);
                group.add(stripe);
            }

            group.add(leftPost, rightPost, signMesh);

            group.userData = {
                type: 'high_barrier',
                mustSlide: true,
                hitbox: { minX: -1.1, maxX: 1.1, minY: 1.35, maxY: 2.75, minZ: -0.3, maxZ: 0.3 }
            };
        } else if (type === 'traffic_light') {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 8), this.materials.steelGirder);
            pole.position.y = 1.8;

            const box = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.95, 0.28), this.materials.hazardBlack);
            box.position.set(0, 2.85, 0);

            const red = new THREE.Mesh(new THREE.CircleGeometry(0.1, 14), this.materials.warningRed);
            red.position.set(0, 3.1, 0.15);
            const green = new THREE.Mesh(new THREE.CircleGeometry(0.1, 14), this.materials.warningGreen);
            green.position.set(0, 2.6, 0.15);

            group.add(pole, box, red, green);

            group.userData = {
                type: 'traffic_light',
                hitbox: { minX: -0.38, maxX: 0.38, minY: 0, maxY: 3.6, minZ: -0.3, maxZ: 0.3 }
            };
        }

        return group;
    }

    // ==================== TẠO VÁN TRƯỢT HOVERBOARD ====================
    createHoverboard(boardId = 'classic') {
        const boardGroup = new THREE.Group();

        const boardConfigs = {
            classic: { main: 0xe63946, trim: 0xf1faee, glow: 0xff0055 },
            starboard: { main: 0x7209b7, trim: 0xffd166, glow: 0xffb703 },
            bouncer: { main: 0x06d6a0, trim: 0x118ab2, glow: 0x00f5d4 },
            cyber: { main: 0x0f172a, trim: 0x00f5d4, glow: 0x00f5d4 }
        };

        const cfg = boardConfigs[boardId] || boardConfigs.classic;

        const mainMat = new THREE.MeshStandardMaterial({ color: cfg.main, roughness: 0.25, metalness: 0.5 });
        const trimMat = new THREE.MeshStandardMaterial({ color: cfg.trim, roughness: 0.2, metalness: 0.8 });
        const glowMat = new THREE.MeshBasicMaterial({ color: cfg.glow });

        const deck = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.09, 2.1), mainMat);
        deck.position.y = 0.16;
        boardGroup.add(deck);

        const tipGeo = new THREE.BoxGeometry(0.88, 0.09, 0.38);
        const frontTip = new THREE.Mesh(tipGeo, trimMat);
        frontTip.position.set(0, 0.24, 1.15);
        frontTip.rotation.x = -0.3;
        boardGroup.add(frontTip);

        const rearTip = new THREE.Mesh(tipGeo, trimMat);
        rearTip.position.set(0, 0.24, -1.15);
        rearTip.rotation.x = 0.3;
        boardGroup.add(rearTip);

        // Dải đèn neon phát quang dưới gầm ván
        const neon = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 2.0), glowMat);
        neon.position.y = 0.11;
        boardGroup.add(neon);

        return boardGroup;
    }

    // ==================== TẠO ĐOẠN ĐƯỜNG RAY BÃI BIỂN ====================
    createTrackChunk(chunkLength = 60) {
        const chunk = new THREE.Group();
        chunk.name = "trackChunk";

        // 1. Nền sỏi đường ray trung tâm
        const gravelGeo = new THREE.PlaneGeometry(10.5, chunkLength);
        gravelGeo.rotateX(-Math.PI / 2);
        const gravelMesh = new THREE.Mesh(gravelGeo, this.materials.gravel);
        gravelMesh.position.y = 0.02;
        gravelMesh.receiveShadow = true;
        chunk.add(gravelMesh);

        // 2. Bãi cát vàng nhiệt đới bên trái
        const sandLeftGeo = new THREE.PlaneGeometry(36, chunkLength);
        sandLeftGeo.rotateX(-Math.PI / 2);
        const sandLeft = new THREE.Mesh(sandLeftGeo, this.materials.sand);
        sandLeft.position.set(-23, 0, 0);
        sandLeft.receiveShadow = true;
        chunk.add(sandLeft);

        // 3. Biển xanh bao la bên phải
        const waterGeo = new THREE.PlaneGeometry(55, chunkLength);
        waterGeo.rotateX(-Math.PI / 2);
        const waterRight = new THREE.Mesh(waterGeo, this.materials.water);
        waterRight.position.set(33, -0.2, 0);
        chunk.add(waterRight);

        // Dải bờ cát mép sóng biển
        const sandRightEdge = new THREE.Mesh(new THREE.PlaneGeometry(6.5, chunkLength), this.materials.sandDark);
        sandRightEdge.rotation.x = -Math.PI / 2;
        sandRightEdge.position.set(7.8, -0.05, 0);
        sandRightEdge.receiveShadow = true;
        chunk.add(sandRightEdge);

        // 4. Tà vẹt gỗ sắt đúc (Sleepers)
        const sleeperGeo = new THREE.BoxGeometry(9.4, 0.14, 0.42);
        for (let z = -chunkLength / 2; z < chunkLength / 2; z += 1.6) {
            const sleeper = new THREE.Mesh(sleeperGeo, this.materials.sleeper);
            sleeper.position.set(0, 0.07, z);
            sleeper.receiveShadow = true;
            chunk.add(sleeper);
        }

        // 5. Ray thép 3 làn sáng bóng (Làn 0: +2.8, Làn 1: 0, Làn 2: -2.8)
        const railGeo = new THREE.BoxGeometry(0.09, 0.2, chunkLength);
        const laneOffsets = [2.8, 0, -2.8];
        const railSpacing = 0.82;

        laneOffsets.forEach(laneX => {
            const railLeft = new THREE.Mesh(railGeo, this.materials.rail);
            railLeft.position.set(laneX + railSpacing / 2, 0.2, 0);
            const railRight = new THREE.Mesh(railGeo, this.materials.rail);
            railRight.position.set(laneX - railSpacing / 2, 0.2, 0);
            chunk.add(railLeft, railRight);
        });

        // 6. Cây dừa & Đạo cụ bãi biển
        for (let z = -chunkLength / 2 + 8; z < chunkLength / 2; z += 18) {
            const palm = this.createPalmTree();
            palm.position.set(-8.8 - Math.random() * 6.0, 0, z);
            chunk.add(palm);

            // Dù bãi biển
            if (Math.random() > 0.35) {
                const umbrella = new THREE.Group();
                const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), this.materials.barrierWood);
                pole.position.y = 1.6;
                umbrella.add(pole);

                const canopy = new THREE.Mesh(
                    new THREE.ConeGeometry(2.1, 0.85, 12),
                    Math.random() > 0.5 ? this.materials.umbrellaRed : this.materials.umbrellaYellow
                );
                canopy.position.y = 3.05;
                canopy.rotation.z = 0.18;
                canopy.castShadow = true;
                umbrella.add(canopy);

                umbrella.position.set(-7.6 - Math.random() * 4.5, 0, z + 5);
                chunk.add(umbrella);
            }
        }

        // 7. Cột đèn & Vòm thép bãi biển
        const girderGeo = new THREE.BoxGeometry(16.8, 0.38, 0.38);
        for (let z = -chunkLength / 2 + 10; z < chunkLength / 2; z += 25) {
            const girder = new THREE.Mesh(girderGeo, this.materials.steelGirder);
            girder.position.set(0, 6.2, z);
            chunk.add(girder);

            const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.45), this.materials.warningOrange);
            lamp.position.set(0, 5.8, z);
            chunk.add(lamp);
        }

        // 8. Thuyền buồm ngoài khơi
        if (Math.random() > 0.35) {
            const boat = new THREE.Group();
            const hull = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 4.2), this.materials.boatHull);
            hull.position.y = 0.2;
            const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.8, 6), this.materials.barrierWood);
            mast.position.y = 2.5;
            const sail = new THREE.Mesh(new THREE.ConeGeometry(1.9, 3.8, 3), this.materials.sail);
            sail.position.set(0.65, 2.7, 0);
            sail.rotation.z = -Math.PI / 2;
            boat.add(hull, mast, sail);
            boat.position.set(30 + Math.random() * 16, -0.2, (Math.random() - 0.5) * 20);
            chunk.add(boat);
        }

        // 9. Chim hải âu bay lượn trên trời
        if (Math.random() > 0.4) {
            const gull = new THREE.Group();
            const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.6), this.materials.seagull);
            const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.25), this.materials.seagull);
            wingL.position.set(-0.5, 0, 0);
            wingL.rotation.z = 0.25;
            const wingR = wingL.clone();
            wingR.position.x = 0.5;
            wingR.rotation.z = -0.25;
            gull.add(body, wingL, wingR);
            gull.position.set(12 + Math.random() * 15, 14 + Math.random() * 4, (Math.random() - 0.5) * 25);
            chunk.add(gull);
        }

        return chunk;
    }
}

window.modelBuilder = new ModelBuilder();
