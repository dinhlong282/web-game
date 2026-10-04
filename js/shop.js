/**
 * Subway Surfers Web - Authentic Shop, Inventory & Upgrades System
 */
class ShopManager {
    constructor() {
        const storedCoins = parseInt(localStorage.getItem('subway_total_coins'), 10);
        this.coins = isNaN(storedCoins) ? 100 : storedCoins;

        const storedKeys = parseInt(localStorage.getItem('subway_total_keys'), 10);
        this.keys = isNaN(storedKeys) ? 5 : storedKeys;

        try {
            this.unlockedSkins = JSON.parse(localStorage.getItem('subway_unlocked_skins')) || ['jake'];
        } catch (e) {
            this.unlockedSkins = ['jake'];
        }

        try {
            this.unlockedBoards = JSON.parse(localStorage.getItem('subway_unlocked_boards')) || ['classic'];
        } catch (e) {
            this.unlockedBoards = ['classic'];
        }

        this.activeSkin = localStorage.getItem('subway_skin') || 'jake';
        this.activeBoard = localStorage.getItem('subway_board') || 'classic';

        // Cấu hình Nâng cấp (Upgrades)
        try {
            this.upgrades = JSON.parse(localStorage.getItem('subway_upgrades')) || {
                jetpack: 1,
                magnet: 1,
                sneakers: 1,
                multiplier: 1
            };
        } catch (e) {
            this.upgrades = { jetpack: 1, magnet: 1, sneakers: 1, multiplier: 1 };
        }

        this.items = {
            characters: [
                { id: 'jake', name: 'Jake Surfer', price: 0, currency: 'coins', desc: 'Cậu bé đường phố tinh nghịch' },
                { id: 'tricky', name: 'Tricky Skater', price: 200, currency: 'coins', desc: 'Cô nàng trượt ván siêu đẳng' },
                { id: 'fresh', name: 'Fresh Beatboxer', price: 500, currency: 'coins', desc: 'Bậc thầy hiphop sành điệu' },
                { id: 'cyber', name: 'Cyber Ninja', price: 1000, currency: 'coins', desc: 'Chiến binh công nghệ neon' }
            ],
            boards: [
                { id: 'classic', name: 'Classic Red', price: 0, currency: 'coins', desc: 'Ván trượt cơ bản siêu bền' },
                { id: 'starboard', name: 'Starboard Cosmic', price: 300, currency: 'coins', desc: 'Ván vũ trụ vàng lấp lánh' },
                { id: 'bouncer', name: 'Bouncer Spring', price: 600, currency: 'coins', desc: 'Lò xo đàn hồi bật siêu cao' },
                { id: 'cyber', name: 'Cyber Blade', price: 1200, currency: 'coins', desc: 'Động cơ phản lực neon xanh' }
            ],
            upgrades: [
                { id: 'jetpack', name: 'Tên Lửa (Jetpack)', icon: '🚀', basePrice: 500, desc: 'Tăng thời gian bay trên bầu trời' },
                { id: 'magnet', name: 'Nam Châm (Coin Magnet)', icon: '🧲', basePrice: 400, desc: 'Tăng thời gian tự động hút tiền vàng' },
                { id: 'sneakers', name: 'Giày Siêu Nhảy (Sneakers)', icon: '👟', basePrice: 400, desc: 'Tăng thời gian nhảy siêu cao qua nóc tàu' },
                { id: 'multiplier', name: 'Nhân Đôi Điểm (2X Multiplier)', icon: '⭐', basePrice: 600, desc: 'Tăng thời gian nhân đôi điểm số' }
            ]
        };
    }

    getCoins() { return this.coins; }
    getKeys() { return this.keys; }

    addCoins(amount) {
        this.coins += amount;
        localStorage.setItem('subway_total_coins', this.coins);
        this.updateHUDCurrencies();
    }

    addKeys(amount) {
        this.keys += amount;
        localStorage.setItem('subway_total_keys', this.keys);
        this.updateHUDCurrencies();
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            localStorage.setItem('subway_total_coins', this.coins);
            this.updateHUDCurrencies();
            return true;
        }
        return false;
    }

    spendKeys(amount) {
        if (this.keys >= amount) {
            this.keys -= amount;
            localStorage.setItem('subway_total_keys', this.keys);
            this.updateHUDCurrencies();
            return true;
        }
        return false;
    }

    isUnlocked(type, id) {
        if (type === 'characters') return this.unlockedSkins.includes(id);
        if (type === 'boards') return this.unlockedBoards.includes(id);
        return false;
    }

    buyItem(type, id) {
        const list = this.items[type];
        const item = list ? list.find(it => it.id === id) : null;
        if (!item) return false;
        if (this.isUnlocked(type, id)) return false;

        const success = item.currency === 'keys' ? this.spendKeys(item.price) : this.spendCoins(item.price);

        if (success) {
            if (type === 'characters') {
                this.unlockedSkins.push(id);
                localStorage.setItem('subway_unlocked_skins', JSON.stringify(this.unlockedSkins));
                this.equipItem('characters', id);
            } else {
                this.unlockedBoards.push(id);
                localStorage.setItem('subway_unlocked_boards', JSON.stringify(this.unlockedBoards));
                this.equipItem('boards', id);
            }
            if (window.audioManager) window.audioManager.playPowerup();
            this.renderUI();
            return true;
        } else {
            alert(item.currency === 'keys' ? 'Bạn chưa đủ Chìa Khóa 🗝️!' : 'Bạn chưa đủ Tiền Vàng 🪙!');
            return false;
        }
    }

    upgradePowerup(powerupId) {
        const currentLevel = this.upgrades[powerupId] || 1;
        if (currentLevel >= 5) {
            alert('Đã đạt cấp độ tối đa (Level 5)!');
            return;
        }

        const upItem = this.items.upgrades.find(u => u.id === powerupId);
        const cost = upItem.basePrice * currentLevel;

        if (this.spendCoins(cost)) {
            this.upgrades[powerupId] = currentLevel + 1;
            localStorage.setItem('subway_upgrades', JSON.stringify(this.upgrades));
            if (window.audioManager) window.audioManager.playPowerup();
            this.renderUI();
        } else {
            alert('Bạn chưa đủ Tiền Vàng để nâng cấp!');
        }
    }

    buyMysteryBox() {
        if (this.spendCoins(500)) {
            const roll = Math.random();
            let rewardMsg = '';
            if (roll < 0.5) {
                const bonusCoins = Math.floor(Math.random() * 800) + 300;
                this.addCoins(bonusCoins);
                rewardMsg = `🎉 BẠN MỞ ĐƯỢC: 🪙 ${bonusCoins} TIỀN VÀNG!`;
            } else if (roll < 0.85) {
                const bonusKeys = Math.floor(Math.random() * 2) + 1;
                this.addKeys(bonusKeys);
                rewardMsg = `🎉 BẠN MỞ ĐƯỢC: 🗝️ ${bonusKeys} CHÌA KHÓA!`;
            } else {
                const bonusCoins = 2500;
                this.addCoins(bonusCoins);
                rewardMsg = `🔥 JACKPOT SIÊU CẤP: 🪙 2500 TIỀN VÀNG!`;
            }
            if (window.audioManager) window.audioManager.playPowerup();
            alert(rewardMsg);
            this.renderUI();
        } else {
            alert('Hộp bí ẩn cần 500 Tiền Vàng 🪙!');
        }
    }

    equipItem(type, id) {
        if (!this.isUnlocked(type, id)) return;
        if (type === 'characters') {
            this.activeSkin = id;
            localStorage.setItem('subway_skin', id);
            if (window.game && window.game.player) {
                window.game.player.setSkin(id);
            }
        } else {
            this.activeBoard = id;
            localStorage.setItem('subway_board', id);
            if (window.game && window.game.player) {
                window.game.player.setBoard(id);
            }
        }
        if (window.audioManager) window.audioManager.playClick();
        this.renderUI();
    }

    updateHUDCurrencies() {
        const coinEls = document.querySelectorAll('.total-coins-display');
        coinEls.forEach(el => { el.textContent = this.coins; });

        const keyEls = document.querySelectorAll('.total-keys-display');
        keyEls.forEach(el => { el.textContent = this.keys; });
    }

    renderUI() {
        this.updateHUDCurrencies();

        // 1. Render Characters
        const charContainer = document.getElementById('shop-characters-list');
        if (charContainer) {
            charContainer.innerHTML = '';
            this.items.characters.forEach(item => {
                const unlocked = this.isUnlocked('characters', item.id);
                const isSelected = this.activeSkin === item.id;

                const card = document.createElement('div');
                card.className = 'shop-card-item' + (isSelected ? ' active' : '') + (unlocked ? ' unlocked' : '');

                let btnHtml = '';
                if (isSelected) {
                    btnHtml = '<button class="btn-card-action selected" disabled>ĐANG DÙNG</button>';
                } else if (unlocked) {
                    btnHtml = `<button class="btn-card-action equip" onclick="window.shopManager.equipItem('characters', '${item.id}')">CHỌN</button>`;
                } else {
                    const icon = item.currency === 'keys' ? '🗝️' : '🪙';
                    btnHtml = `<button class="btn-card-action buy" onclick="window.shopManager.buyItem('characters', '${item.id}')">${icon} ${item.price}</button>`;
                }

                card.innerHTML = `
                    <div class="shop-item-preview">
                        <span class="skin-icon ${item.id}"></span>
                    </div>
                    <div class="shop-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.desc}</p>
                    </div>
                    <div>${btnHtml}</div>
                `;
                charContainer.appendChild(card);
            });
        }

        // 2. Render Boards
        const boardContainer = document.getElementById('shop-boards-list');
        if (boardContainer) {
            boardContainer.innerHTML = '';
            this.items.boards.forEach(item => {
                const unlocked = this.isUnlocked('boards', item.id);
                const isSelected = this.activeBoard === item.id;

                const card = document.createElement('div');
                card.className = 'shop-card-item' + (isSelected ? ' active' : '') + (unlocked ? ' unlocked' : '');

                let btnHtml = '';
                if (isSelected) {
                    btnHtml = '<button class="btn-card-action selected" disabled>ĐANG DÙNG</button>';
                } else if (unlocked) {
                    btnHtml = `<button class="btn-card-action equip" onclick="window.shopManager.equipItem('boards', '${item.id}')">CHỌN</button>`;
                } else {
                    btnHtml = `<button class="btn-card-action buy" onclick="window.shopManager.buyItem('boards', '${item.id}')">🪙 ${item.price}</button>`;
                }

                card.innerHTML = `
                    <div class="shop-item-preview">
                        <span class="board-icon ${item.id}"></span>
                    </div>
                    <div class="shop-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.desc}</p>
                    </div>
                    <div>${btnHtml}</div>
                `;
                boardContainer.appendChild(card);
            });
        }

        // 3. Render Upgrades
        const upgradeContainer = document.getElementById('shop-upgrades-list');
        if (upgradeContainer) {
            upgradeContainer.innerHTML = '';

            // Hộp bí ẩn Mystery Box card
            const boxCard = document.createElement('div');
            boxCard.className = 'shop-card-item';
            boxCard.innerHTML = `
                <div class="shop-item-preview">📦</div>
                <div class="shop-item-info">
                    <h4>Hộp Quà Bí Ẩn (Mystery Box)</h4>
                    <p>Mở ngẫu nhiên nhận Tiền Vàng hoặc Chìa Khóa</p>
                </div>
                <div>
                    <button class="btn-card-action buy" onclick="window.shopManager.buyMysteryBox()">🪙 500</button>
                </div>
            `;
            upgradeContainer.appendChild(boxCard);

            this.items.upgrades.forEach(u => {
                const lvl = this.upgrades[u.id] || 1;
                const cost = u.basePrice * lvl;
                const isMax = lvl >= 5;

                const card = document.createElement('div');
                card.className = 'shop-card-item';

                let btnHtml = isMax
                    ? '<button class="btn-card-action selected" disabled>TỐI ĐA (LV 5)</button>'
                    : `<button class="btn-card-action buy" onclick="window.shopManager.upgradePowerup('${u.id}')">🪙 ${cost}</button>`;

                card.innerHTML = `
                    <div class="shop-item-preview">${u.icon}</div>
                    <div class="shop-item-info">
                        <h4>${u.name} (Lv ${lvl}/5)</h4>
                        <p>${u.desc}</p>
                    </div>
                    <div>${btnHtml}</div>
                `;
                upgradeContainer.appendChild(card);
            });
        }
    }
}

window.shopManager = new ShopManager();