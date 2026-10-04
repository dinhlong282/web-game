# 🏃 Subway Surfers 3D - Web Edition

Tựa game **3D Subway Surfers** chạy trực tiếp trên trình duyệt Web (PC, Điện thoại, Tablet) được xây dựng bằng **Three.js** và **Web Audio API**.

---

## 🌟 Các tính năng nổi bật

- **Đồ họa 3D sống động (Three.js)**:
  - Đường ray 3 làn vô tận với cơ chế tái sinh môi trường (Procedural Track Generation).
  - Tàu hỏa 3D màu sắc đa dạng: tàu đứng yên, tàu di động chạy ngược chiều, tàu có dốc dẫn lên nóc.
  - Chướng ngại vật đa dạng: Rào chắn thấp (cần nhảy), biển cảnh báo trên cao (cần cúi trượt), cột tín hiệu đường sắt.
  - Hoạt ảnh nhân vật 3D mượt mà: Chạy bộ đung đưa tay chân, nhảy cao, cúi trượt người, lướt ván bay.

- **Vật phẩm trợ giúp (Power-Ups)**:
  - 🧲 **Nam châm (Coin Magnet)**: Tự động hút toàn bộ tiền xu xung quanh.
  - 🚀 **Bình phản lực (Jetpack)**: Đưa người chơi bay vút lên bầu trời thu thập hàng trăm tiền vàng an toàn.
  - 👟 **Giày siêu nhảy (Super Sneakers)**: Nhảy cao gấp đôi, dễ dàng vượt qua nóc tàu hỏa.
  - ⭐ **Nhân đôi điểm (2X Multiplier)**: Nhân đôi điểm số ghi được trong thời gian hiệu lực.
  - 🛹 **Ván trượt (Hoverboard)**: Kích hoạt bảo vệ người chơi khỏi 1 lần va chạm chí mạng (Save from crash).

- **Âm thanh & Nhạc nền 100% tự tổng hợp**:
  - Tự tổng hợp bằng Web Audio API không phụ thuộc file nhạc ngoài, không lo mất mạng hay lỗi link.

- **Cửa hàng (Shop) & Hệ thống Kỷ lục**:
  - Lưu trữ Kỷ lục điểm cao (Highscore) và Tổng tiền vàng trong `localStorage`.
  - Mở khóa 4 nhân vật (Jake, Tricky, Fresh, Cyber Ninja) và 4 ván trượt (Classic Red, Starboard Cosmic, Bouncer Spring, Cyber Blade).

---

## 🎮 Cách điều khiển

### Trên Máy tính (PC / Laptop):
- **Phím Mũi tên Trái / Phải** hoặc **A / D**: Đổi làn chạy.
- **Phím Mũi tên Lên** hoặc **W** hoặc **Space**: Nhảy qua rào chắn và nóc tàu.
- **Phím Mũi tên Xuống** hoặc **S**: Cúi trượt đất / Bổ nhào nhanh khi đang ở trên không.
- **Nhấn phím Space 2 lần** hoặc **Phím Q**: Kích hoạt ván trượt Hoverboard.
- **Phím Esc** hoặc **P**: Tạm dừng trò chơi (Pause).

### Trên Điện thoại / Máy tính bảng (Touch Mobile):
- **Vuốt Trái / Phải**: Đổi làn chạy.
- **Vuốt Lên**: Nhảy.
- **Vuốt Xuống**: Cúi trượt.
- **Chạm đúp (Double tap)** hoặc bấm nút **🛹**: Kích hoạt ván trượt Hoverboard.
- Có sẵn cụm phím ảo trên màn hình để thao tác tiện lợi.

---

## 🚀 Hướng dẫn chạy Game

### Cách 1: Chạy bằng Node.js Server
Trong thư mục dự án, chạy lệnh:
```bash
node server.js
```
Sau đó mở trình duyệt truy cập: `http://localhost:3000`

### Cách 2: Mở trực tiếp
Bạn cũng có thể mở trực tiếp file `index.html` bằng trình duyệt web bất kỳ (Chrome, Edge, Firefox, Safari) hoặc extension Live Server trong VS Code.
