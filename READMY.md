# Game tô và đếm số lượng (1–2)

Web game **Phaser** dành cho học sinh **5–6 tuổi** luyện đếm số lượng từ **1 → 2** thông qua thao tác **tô vòng tròn**.  
Bé sẽ:

- Quan sát **đồ vật hiển thị trên bảng**  
- **Tô đúng số vòng tròn** tương ứng  
- Nghe **giọng nói hướng dẫn**  
- Nhận **feedback âm thanh/hình ảnh** sau mỗi lượt

Dự án chạy bằng **Vite + TypeScript**, canvas tỉ lệ **16:9**, scale chế độ **FIT** vào màn hình.

---

## 1. Chạy nhanh

```bash
npm install        # Cài dependency
npm run dev        # Mở máy chủ Vite kèm hot reload
npm run build      # Build bundle production
npm run preview    # Chạy thử gói build để kiểm tra
```

---

## 2. Cấu trúc chính

### 2.1. `src/main.ts`

- Cấu hình Phaser:
  - Kích thước: `1280 x 720`
  - Scale mode: `FIT`
  - Align: `CENTER_BOTH`
- Khởi tạo và gắn canvas vào `#game-container`
- Hiện/ẩn nút DOM `#btn-reset`
- Khởi động các scene:
  - `QuantityScene`
  - `EndGameScene`
- Gọi hàm `initRotateOrientation` để:
  - Bật overlay yêu cầu xoay ngang trên mobile
  - Tạm dừng / phát lại audio khi Bé xoay máy

### 2.2. `src/scenes/QuantityScene.ts`

- Chịu trách nhiệm **gameplay chính**:
  - Tô vòng tròn
  - Khởi tạo và quản lý dữ liệu level
  - Xử lý logic:
    - Chọn vòng tròn
    - Tô màu
    - Kiểm tra đúng/sai
    - Chuyển level
- Phát:
  - Nhạc nền
  - Giọng nói hướng dẫn
  - Giọng đếm từng đồ vật
  - Voice khen khi trả lời đúng

### 2.3. `src/scenes/EndGameScene.ts`

- Màn **tổng kết** sau khi Bé hoàn thành toàn bộ level:
  - Hiển thị banner chúc mừng
  - Icon hoạt hoạ
  - Pháo giấy (confetti)
- Phát chuỗi âm thanh:
  - `complete` → `fireworks` → `applause`
- Có 2 nút:
  - **Chơi lại**: quay lại `QuantityScene`, reset thứ tự level và trạng thái
  - **Thoát**: gọi sang host (nếu có) hoặc quay lại màn chọn bài

### 2.4. `src/rotateOrientation.ts`

- Hiển thị overlay khi thiết bị đang ở chế độ **dọc (portrait)**:
  - Yêu cầu người dùng xoay ngang để chơi
- Khi overlay bật:
  - Tạm dừng toàn bộ âm thanh đang phát
  - Lưu lại key nhạc nền đang loop để phát lại sau
  - Ưu tiên phát voice `voice_rotate` nếu có
- Khi overlay tắt:
  - Phát lại nhạc nền / voice còn đang dang dở (nếu cần)

### 2.5. `public/assets/...`

- Hình nền theo bối cảnh:
  - Nhà, hồ, cánh đồng, núi…
- Icon đồ vật:
  - Lật đật, bóng bay, viên bi, kẹo… kèm nhiều biến thể
- UI:
  - Banner tiêu đề, khung bảng, vòng tròn tô, tick đúng…
- Âm thanh:
  - `bgm_quantity`: nhạc nền lặp
  - SFX chọn / sai / đúng / chuyển cảnh
  - Giọng nói:
    - Prompt hướng dẫn từng level
    - Giọng khen
    - Giọng đếm số lượng từng đồ vật

---

## 3. Gameplay chi tiết

### 3.1. Bố cục màn hình

- Nền được **cross-fade** từ 2 layer DOM:
  - `#bg-layer-a`
  - `#bg-layer-b`
- Trên canvas:
  - Banner tiêu đề bài học
  - Avatar bé (nhân vật đồng hành)
  - **Bảng hiển thị đồ vật** (khu vực phía trên)
  - **Vùng tô 7 vòng tròn** (hàng phía dưới)
- Nút **`HOÀN THÀNH`**:
  - Nằm ở giữa đáy màn hình
  - Bé bấm để chấm kết quả
- Nút **reset DOM `#btn-reset`**:
  - Nằm ở góc trên bên phải màn hình
  - Được dùng để quay lại từ level 1

### 3.2. Tương tác tô vòng tròn

- Bé có thể:
  - Chạm (mobile) hoặc
  - Click (desktop)
- Mỗi vòng tròn là một vùng tô độc lập:
  - `brushRadius = 14` (bán kính cọ)
  - Lưới tính toán: `10 x 10`
  - Vòng tròn được tính là **“tô hợp lệ”** khi:
    - Diện tích tô ≥ **60%** diện tích ô (ngưỡng `fillThreshold`)

- Có tổng cộng **7 vòng tròn** xếp theo layout cố định:
  - Giữ nguyên vị trí để trẻ dễ ghi nhớ thao tác
  - Tránh gây rối mắt khi chuyển level

### 3.3. Kiểm tra kết quả (nút HOÀN THÀNH)

Khi Bé bấm **`HOÀN THÀNH`**:

- Nếu **đúng**:
  - Hiện icon **tick** ở góc bảng đồ vật
  - Các vòng tròn được tô đúng sẽ:
    - Đổi sang màu xanh (trạng thái “được công nhận”)
  - Phát:
    - `sfx` đúng
    - Voice khen tương ứng từng level (`correct_quantity_*`)
  - Sau đó:
    - Hiển thị số đếm dưới từng đồ vật
    - Phát giọng **đếm lần lượt**: `count_1`, `count_2`, … tới `count_n`
    - Tự động **chuyển sang level tiếp theo** sau khi đếm xong

- Nếu **sai**:
  - Các vòng tròn sẽ **lắc nhẹ** (feedback động)
  - Phát:
    - SFX sai
    - Voice nhắc “làm lại” / “con thử lại nhé”
  - Xoá toàn bộ nét tô hiện tại để bé làm lại từ đầu

### 3.4. Gợi ý ở level đầu

- Ở **level 1**:
  - Hiển thị **bàn tay** làm mẫu
  - Hiển thị **vệt tô màu** sẵn trên một vòng tròn
- Khi Bé bắt đầu tô lần đầu:
  - Bàn tay và vệt tô gợi ý sẽ tự động **biến mất**
  - Sau đó game vận hành bình thường như các level khác

### 3.5. Reset game

- Nút DOM `#btn-reset`:
  - Gọi hàm: `compareScene.restartGame()` (hoặc hàm tương tự trong `QuantityScene`)
  - Tác dụng:
    - Quay về **level 1**
    - Xoá điểm hiện có
    - Reset toàn bộ trạng thái game:
      - Vòng tròn tô
      - Thứ tự level
      - Tick đúng/sai
      - Bất kỳ cờ trạng thái nội bộ nào

---

## 4. Dữ liệu level (`QuantityScene.buildLevels`)

Hàm `buildLevels()` trả về danh sách cấu hình level, ví dụ:

| id | Nội dung      | Số lượng (`objectCount`) | Icon chính                  | Voice prompt           | Voice khen             | Voice hướng dẫn vẽ         |
|----|---------------|--------------------------|-----------------------------|------------------------|------------------------|-----------------------------|
| 1  | Con lật đật   | 1                        | `hustle`                    | `prompt_quantity_1`    | `correct_quantity_1`   | `correct_draw_hustle`      |
| 2  | Bóng bay      | 2                        | `balloon*` (5 biến thể)     | `prompt_quantity_2`    | `correct_quantity_2`   | `correct_draw_ballon`      |
| 3  | Viên bi       | 3                        | `marbles*` (5 biến thể)     | `prompt_quantity_3`    | `correct_quantity_3`   | `correct_draw_marbles`     |
| 4  | Kẹo           | 4                        | `candy*` (4 biến thể)       | `prompt_quantity_4`    | `correct_quantity_4`   | `correct_draw_candy`       |

Ghi chú:

- Tất cả level dùng chung:
  - `maxCircles = 7`
- Bé cần:
  - **Tô đúng** `objectCount` vòng tròn tương ứng với số lượng đồ vật hiển thị
- Âm thanh:
  - Nhạc nền lặp: `bgm_quantity`
  - Giọng đếm: `count_1`…`count_4`  
    → Phát sau khi trả lời đúng để giúp củng cố khái niệm số lượng

### 4.1. Đổi background theo icon

- Background được chọn dựa trên **icon đầu tiên** trong `objectIcon` bằng map `bgByIcon`, ví dụ:

| Nhóm icon                      | Background gợi ý |
|--------------------------------|------------------|
| Lật đật, đồ chơi trong nhà     | `home`           |
| Bóng bay ngoài trời            | `field`          |
| Viên bi gần hồ                 | `lake`           |
| Kẹo, quà, tiệc                 | `mountain` hoặc `home` tùy concept |

---

## 5. Màn tổng kết – `EndGameScene`

Khi Bé hoàn thành **tất cả level**:

- Chuyển sang `EndGameScene`
- Màn hình tổng kết gồm:
  - Lớp mờ phủ DOM để tách khỏi gameplay
  - Banner chúc mừng (ví dụ: “Con giỏi lắm!”)
  - Icon nhân vật hoặc đồ vật nhảy múa
  - Hiệu ứng **confetti** (pháo giấy) chạy liên tục

### 5.1. Âm thanh

- Phát chuỗi:
  - `complete` → `fireworks` → `applause`
- Có thể lặp nhạc nền nhẹ nếu muốn giữ không khí vui tươi

### 5.2. Nút thao tác

- **Nút “Chơi lại”**:
  - Tắt toàn bộ âm thanh đang phát
  - Quay lại `QuantityScene`
  - Reset thứ tự level về mặc định (1 → 4)
  - Xoá mọi trạng thái game trước đó

- **Nút “Thoát”**:
  - Nếu đang chạy trong host IruKa:
    - Gọi:
      ```ts
      window.irukaHost.complete({
        score,
        timeMs,
        extras: { reason: "user_exit" },
      });
      ```
  - Nếu chạy độc lập (không có host):
    - Fallback: chuyển về `LessonSelectScene` (hoặc scene menu chính tuỳ dự án)

- Trong `EndGameScene`, ẩn các nút game không cần thiết:
  - `hideGameButtons()` để ẩn nút reset DOM, tránh nhầm lẫn

---

## 6. Trải nghiệm thiết bị & xoay màn hình

- Game thiết kế cho tỉ lệ **16:9**
- Phaser canvas được:
  - Scale mode: **FIT**
  - Nên luôn **nằm gọn** trong `#game-container`, không bị tràn
- Trên mobile:
  - Game chỉ cho phép chơi ở chế độ **ngang (landscape)**

### 6.1. Hành vi của `initRotateOrientation`

- Khi thiết bị ở **portrait**:
  - Hiển thị overlay yêu cầu xoay ngang
  - Tạm dừng mọi âm thanh:
    - Nhạc nền
    - Voice đang phát
- Lưu lại:
  - Key nhạc nền đang lặp để có thể phát lại đúng track
- Phát:
  - `voice_rotate` để nhắc Bé xoay thiết bị (nếu có asset)
- Khi Bé xoay sang **landscape**:
  - Ẩn overlay
  - Phát lại nhạc nền / voice cần thiết

---

## 7. Mở rộng / tuỳ biến

### 7.1. Thêm level mới

- Bổ sung phần tử mới trong `buildLevels()` với các trường:

  - `objectCount`: số lượng đồ vật cần tô
  - `objectIcon`: key icon chính + biến thể trong `public/assets`
  - `promptKey`: key voice hướng dẫn, ví dụ: `prompt_quantity_5`
  - `correctVoiceKey`: key voice khen, ví dụ: `correct_quantity_5`
  - `correctDrawVoiceKey`: voice hướng dẫn vẽ/ghi nhận, ví dụ: `correct_draw_cookie`

- Đảm bảo:
  - Icon và âm thanh tương ứng đã được thêm vào `public/assets` và preload trong preload scene.

### 7.2. Điều chỉnh ngưỡng tô & cỡ cọ

Trong `QuantityScene` có thể chỉnh:

- `brushRadius` – chỉnh lớn/nhỏ để:
  - Bé tô dễ hơn (tăng)
  - Hoặc yêu cầu chính xác hơn (giảm)
- `fillThreshold` – ngưỡng phần trăm tô:
  - Ví dụ: từ 0.6 → 0.5 để “dễ tính” hơn
- `paintGridSize` – độ mịn lưới kiểm tra tô:
  - Lưới dày hơn → kiểm tra chính xác hơn nhưng tốn tính toán hơn

### 7.3. Tuỳ biến UI

- Có thể thay:
  - Banner và background DOM
  - Text tiêu đề trong `QuantityScene.create()`
  - Avatar bé, icon tick, màu vòng tròn…
- Chỉ cần đảm bảo:
  - Giữ nguyên cấu trúc ID DOM (`#bg-layer-a/b`, `#btn-reset`, `#game-container`) nếu code đang phụ thuộc.

---

## 8. Tóm tắt

- Game giúp trẻ 5–6 tuổi:
  - Nhận biết **số lượng 1–2**
  - Luyện **khả năng đếm** và **gắn kết số với lượng**
  - Phát triển **khả năng quan sát** và **tập trung**
- Với hệ thống:
  - Tô vòng tròn trực quan
  - Voice hướng dẫn + khen
  - Nhạc nền và hiệu ứng sống động
---

## 9. Lưu ý âm thanh (iOS/Howler)

- **HowlerAudioManager**: chỉ bật `html5` cho âm thanh **không loop** (prompt/sfx ngắn) để tránh giật khi lặp trên iOS. BGM (`bgm_quantity`) nên để Web Audio để loop mượt.
- **Thiết lập asset**: trong `quantityAssets.ts` giữ `html5: true` cho prompt/sfx; bỏ `html5` cho BGM. Nếu ép BGM `html5`, chấp nhận khả năng giật khi lặp.
- **Unlock bằng thao tác chạm**: trong `QuantityScene.create()` lắng nghe `this.input.once('pointerdown', ...)` rồi gọi `this.audio.unlock(); this.audio.playBgm('bgm_quantity'); this.playPromptForLevel(level);` để Safari/iOS cho phép phát âm sau lần chạm đầu tiên.
- **Mute switch**: HTML5 Audio vẫn phát khi gạt mute; Web Audio sẽ tắt. Chỉ bật `html5` cho BGM nếu ưu tiên vượt mute hơn việc loop mượt.
---

### Có thể nhân bản game ra để làm game đếm số lương 3-10 ###
--- 
