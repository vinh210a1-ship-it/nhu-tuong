---
title: "Quá trình: thanh trùng, đông lạnh, sấy, ép đùn (thông số định lượng)"
slug: qua-trinh-nhiet-lanh-say-ep-dun
khu: thuc-pham
thu_tu: 7
loai: bai
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-thuc-pham/07-qua-trinh-nhiet-lanh-say-ep-dun.md
---
# Quá trình: thanh trùng, đông lạnh, sấy, ép đùn (thông số định lượng)

**Kết luận trước.** Mỗi quá trình có **một phương trình chủ đạo** có thể đưa vào lab: thanh trùng/tiệt trùng → D-value, z-value, F; đông lạnh → điểm đóng băng, Tg′, nước không đóng băng; sấy → đẳng nhiệt hấp phụ (GAB), Tg; ép đùn → nhiệt độ, độ ẩm, tốc độ trục vít, biến tính-kết tụ protein. Phần lớn công thức là `[K]`; số liệu có nguồn đã đọc được đánh dấu `[N]`.

Nhãn: `[N: @khóa]` có nguồn đã đọc · `[K]` sách nền, chưa trích trang · `[T]` minh họa · `[G]` suy luận.

## 1. Thanh trùng, tiệt trùng nhiệt

**Khái niệm.** D = thời gian giảm 1 log (90%) ở nhiệt độ T; z = số °C để D giảm 10 lần; F = thời gian tương đương ở nhiệt độ chuẩn; Fz,T = Σ 10^((T−Tref)/z)·Δt `[K]`.

```
D(T)  = D_ref * 10^((T_ref - T)/z)                                   [K]
log N = log N0 - t/D                                                   [K]
L(T)  = 10^((T - T_ref)/z)         # tốc độ gây chết tương đương        [K]
F     = ∫ L(T(t)) dt               # F0: T_ref và z theo chuẩn sách nền (số tạm ẩn)   [K]
Q10   = 10^(10/z) ;  z = 2.303 R T^2 / Ea                              [K]
gia nhiệt (Ball): log(T_RT - T) = log(j*(T_RT-T0)) - t/f_h              [K]
```
- Ví dụ giá trị đại diện: bào tử *C. botulinum* (proteolytic) D121.1 ≈ 0,1–0,25 phút, z ≈ 10 °C; khái niệm "12D botulinum" tương ứng F0 ≈ 2,5–3 phút `[K]`. Đây là bậc độ lớn từ sách; **cần số trang** trước khi lên web.
- Giới hạn sinh trưởng và ngưỡng pH: bảng FDA trong file 02 `[N: @fda-app4]`: *C. botulinum* không mọc dưới pH 4,6 → ranh giới thực phẩm axit/ít axit `[N]`.
- Bất hoạt enzym bằng vi sóng: nấm PPO bất hoạt vi sóng 2450 MHz nhanh hơn nhiều so với nhúng nước nóng, giữ chất chống oxy hóa và giảm hóa nâu; hai kiểu gia nhiệt tạo trung gian enzym khác nhau `[N: @rodriguezlopez1999]`.
- Thanh trùng sữa HTST 72 °C/15 giây; UHT 135–150 °C/vài giây; thanh trùng chậm 63 °C/30 phút `[K]`.
- aw thấp làm vi sinh vật **bền nhiệt hơn** (aw ảnh hưởng độ bền nhiệt) `[N: @tapia2020]` (mục lục chương); dùng D-value theo aw nếu sản phẩm khô `[G]`.

## 2. Đông lạnh và trạng thái thủy tinh

- Dung dịch đông tập trung tối đa chứa ~80% chất tan và ~20% nước không đóng băng; riêng sucrose, khoảng 0,25 g nước/g sucrose không đóng băng (≈ 4,75 phân tử nước/phân tử sucrose) `[N: @roos2021]`.
- Bảo quản đông lạnh thường dưới −18 °C, khi đó chỉ chất tan có Tm′ thấp hơn −18 °C mới có thể kết tinh; tinh thể lactose > ~20–50 μm gây cảm giác sạn trong kem `[N: @roos2021]`.
- Tg′ (nhiệt độ thủy tinh của dung dịch đông tập trung): sucrose ≈ −32 °C, glucose ≈ −43 °C, fructose ≈ −42 °C, maltodextrin DE 10 ≈ −20 °C `[K]`. Nguyên tắc: bảo quản dưới Tg′ giữ chất lượng lâu hơn; trên Tg′, tái kết tinh nước (recrystallisation) và kết tinh chất tan phá cấu trúc `[N: @roos2021]` (khái niệm); số `[K]`.
- Tốc độ làm lạnh nhanh cho tinh thể đá nhỏ, nhiều; chậm cho tinh thể lớn, ít, gây vỡ tế bào, drip khi rã đông `[K]`.
- Trong surimi đông lạnh, trehalose chống đông và pyrophosphat (SPP) giữ nước hiệp lực sau 180 ngày `[N: @shi2026surimi]`.
- WLF: log(aT) = −C1(T−Tg)/(C2+T−Tg), C1 = 17,44, C2 = 51,6 K `[K]` — mô tả tốc độ tăng đột ngột khi T > Tg.

## 3. Sấy và hấp phụ ẩm

- Đẳng nhiệt GAB: M = M0·C·K·aw / [(1−K·aw)(1−K·aw+C·K·aw)] `[K]`; dùng đường cong này để biết aw ở ẩm độ nhất định và ngược lại.
- Trong bột sữa, aw tăng làm tăng Maillard và kết tinh lactose; Tg hạ dưới 0 °C ở aw 0,43–0,54 → bột kết cục `[N: @yan2022lactose]`.
- Sấy phun/sấy đông khô: chọn chất mang có Tg cao (maltodextrin DE thấp) để chống kết cục `[K]`.
- Nấm mốc và men có thể mọc ở aw 0,61–0,85 nên sấy phải đưa aw xuống dưới ~0,6 để ổn định vi sinh `[N: @beuchat1983]` (phạm vi); mốc xerophilic cực đoan, ngưỡng ~0,6 `[N: @allen2018]`.

## 4. Ép đùn

- Ép đùn ẩm cao (HME) cho thịt thực vật: ví dụ từ nghiên cứu đậu nành (SPI:SPC 1:9) trên máy Clextral Evolum 25 (twin-screw, L/D 24:1, 6 vùng gia nhiệt): profile nhiệt độ thấp 30–50–75–105–115–120 °C, cao 30–70–95–115–125–140 °C; tốc độ trục vít 300–400 rpm; độ ẩm cố định 69%; khuôn làm nguội 80 °C. Kết luận tác giả là tối ưu hóa tốc độ trục vít và nhiệt độ ảnh hưởng đến kết cấu và dinh dưỡng của sản phẩm `[N: @ribeiro2024]` (có chỗ không nhất quán nội bộ giữa phần mở đầu và phương pháp về tốc độ trục vít 350 so với 450 rpm, và hàm lượng protein 70% so với 77%; dùng số trong phần phương pháp).
- Thêm HDP 9% làm tăng độ texturization từ 1,33 lên 2,25 và WHC 3,04 g/g `[N: @wu2026hdp]`.
- Các vùng của máy đùn: trộn → nấu (biến tính, lộ –SH) → khuôn (định hướng) → làm nguội (hình thành lại liên kết); "dead-stop sampling" lấy mẫu từng vùng `[N: @wu2026hdp]`.
- Nấu đùn ngũ cốc nguyên hạt: hồ hóa, tái tổ chức protein, biến đổi chất xơ `[N: @meng2026]`.
- Degree of Texturization (DT) = tỷ lệ độ bền kéo dọc/ngang; thang >1,5 coi là có sợi `[K]`.

**Mô hình lab (T):** thanh trượt T_max (100–160 °C), % ẩm (35–70%), rpm (200–500); chỉ số DT = f(T, ẩm, rpm) dạng đường cong, đỉnh vùng nhiệt 120–140 °C ở ẩm cao; cảnh báo "sợi không tạo được" khi ẩm thấp.

## 5. Việc còn thiếu

1. Bảng D, z cho *C. botulinum*, *C. sporogenes* PA3679, *Geobacillus stearothermophilus*, *Listeria*, *Salmonella* (trích sách/FDA Appendix 4 có đoạn inactivation).
2. FDA 21 CFR 113 và 114: **chưa đọc**; Codex Code of Hygienic Practice cho thực phẩm đóng hộp ít axit.
3. Đông lạnh: Tm′, Tg′ theo từng chất tan (Roos 2021 có bảng; chưa lấy toàn văn).
