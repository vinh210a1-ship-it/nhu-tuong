---
title: "Đo lường và đặc trưng nhũ tương – kích thước giọt, zeta, lưu biến, độ ổn định"
slug: do-luong
khu: nhu-tuong
thu_tu: 6
loai: bai
hien_tren_web: true
level: 4-thuc-hanh
tags: [DLS, nhieu-xa-laser, zeta, luu-bien, turbiscan, kem-hoa, DSC, hien-vi, oxy-hoa]
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/06-do-luong-va-dac-trung.md
---
# 06. Đo lường và đặc trưng nhũ tương

> **Kết luận trước.** Một nhũ tương (emulsion) chỉ được coi là "đã đặc trưng" khi có **ít nhất 4 nhóm số liệu**: (1) phân bố kích thước giọt (không chỉ trung bình), (2) điện tích/tính chất bề mặt, (3) lưu biến (rheology), (4) **diễn tiến theo thời gian** dưới điều kiện bảo quản (kích thước, kem hóa, vi cấu trúc, hóa học). Thiếu (4) thì không có cơ sở nói "ổn định". Mỗi kỹ thuật có **dải đo** và **cạm bẫy** riêng; dùng sai ngoài dải là lỗi phổ biến nhất.

Nguồn khung: McClements, tổng quan về kỹ thuật và quy trình đặc trưng độ ổn định nhũ tương **[N: @mcclements2007]**; tổng quan về kỹ thuật đặc trưng nhũ tương thực phẩm (2024) **[N: @kupikowskastobba2024]**; đề xuất quy trình chuẩn đo hạt ăn được **[N: @mcclements2016a]**.

Độ tin cậy: **[N]** có nguồn kiểm · **[K]** sách giáo khoa · **[G]** giả thuyết.

---

## 1. Kích thước giọt và phân bố

### 1.1 Bảng kỹ thuật (dải đo theo R18; đặc điểm bổ sung [K])
| Kỹ thuật | Dải đo (theo R18) | Ghi chú / cạm bẫy |
|---|---|---|
| Tán xạ ánh sáng động (DLS) | ~3 nm–5 µm | Độ tin cậy giảm với mẫu đa phân tán; cần pha loãng mạnh để tránh tán xạ nhiều lần; nhạy với bụi và giọt lớn |
| Tán xạ ánh sáng tĩnh (nhiễu xạ laser, lý thuyết Mie) | ~100 nm–1000 µm | Cần chiết suất pha phân tán/liên tục và hệ số hấp thụ; sai chiết suất ⇒ sai phân bố, đặc biệt dưới ~1 µm |
| Quang phổ siêu âm | ~10 nm–1000 µm | Đo được nhũ tương đậm đặc đến ~50% không cần pha loãng |
| Đếm xung điện (Coulter) | ~0,4–1200 µm | Cần pha loãng trong chất điện ly |
| SAXS | (nguyên lý tương tự DLS dùng tia X) | Đặc thù, không thường quy |
| Hiển vi quang học | độ phân giải ~1–2 µm | Quan sát keo tụ vs hợp giọt, đa dạng giọt |
| Hiển vi huỳnh quang / CLSM | giọt đến ~300 nm | Nhuộm riêng dầu/protein; quan sát lớp bề mặt |
| SEM / TEM | TEM tới ~0,1 nm | Cần chuẩn bị mẫu khô/cryo ⇒ có thể gây artefact |
| AFM | — | Màng giao diện, thường khô |
| PDI (DLS) theo hướng dẫn nhà sản xuất | <0,1 đơn phân tán; 0,1–0,4 đa phân tán vừa; >0,4 đa phân tán | Chỉ là quy ước; không so sánh PDI giữa các máy |

### 1.2 Quy tắc đọc kết quả [K]
1. Báo cáo **d₃₂, d₄₃ và d₉₀ (hoặc d₉₉)**, kèm **span** = (d₉₀ − d₁₀)/d₅₀. Hai mẫu cùng d₃₂ có thể có kem hóa (creaming) rất khác vì d₉₀ khác.
2. **Hai kỹ thuật cho kết quả khác nhau là bình thường** (DLS cho đường kính thủy động, nhiễu xạ laser cho đường kính tương đương thể tích). Chọn một kỹ thuật chuẩn và nêu rõ.
3. **Pha loãng** phải dùng pha liên tục (continuous phase) có thành phần giống hệt (pH, muối) để không phá cụm/giọt; pha loãng bằng nước tinh khiết có thể làm tan cụm keo tụ (flocculation) hoặc gây ripening.
4. Thêm một mẫu "phân tán lại" bằng SDS 1% hoặc siêu âm nhẹ để **phân biệt keo tụ và hợp giọt (coalescence)** (file 03, mục 3).
5. Đo ở **0 h, 24 h, 7 d, 30 d** và ở nhiệt độ bảo quản thực; dựng đồ thị $d_{43}$ và $d_{43}^3$ theo thời gian để phân biệt hợp giọt/ripening (ripening cho $d^3$ tuyến tính).

---

## 2. Điện tích bề mặt (zeta potential)
- Đo bằng điện di (laser Doppler); chuyển từ độ linh động điện di sang thế zeta bằng Smoluchowski (κa ≫ 1, giọt lớn trong nước lực ion trung bình) hoặc Hückel (κa ≪ 1). **[K]** Với giọt có lớp polymer dày, thế zeta là **số đại diện thô** của điện tích mặt trượt, không phải điện tích bề mặt thật.
- Quy ước "|ζ| > 30 mV là bền" **chỉ áp dụng** cho hệ ổn định tĩnh điện, không đúng với hệ ổn định lập thể (xem Pickering: R20 nhắc ±30 mV như ranh giới trong ngữ cảnh hạt **[N: @schroen2024]**).
- Cách dùng: quét zeta theo pH (pH 3 → 8) để tìm pI; theo [NaCl] để xem che chắn; theo [Ca²⁺] để xem cầu nối. **[K]**
- Luôn báo cáo pH, lực ion, nhiệt độ, pha loãng.

---

## 3. Lưu biến
- **Độ nhớt – đường cong chảy:** nhớt biểu kiến vs tốc độ cắt; nhũ tương loãng gần Newton; nhũ tương đậm đặc và HIPE: thinning và có ngưỡng chảy (yield stress). **[N: @kupikowskastobba2024 liệt kê độ nhớt, đường cong chảy và dao động]**
- **Dao động (oscillatory):** G′ (đàn hồi), G″ (nhớt); quét biên độ để xác định vùng tuyến tính, quét tần số để biết cấu trúc (gel yếu: G′ > G″ và ít phụ thuộc tần số). **[N: @kupikowskastobba2024]**
- **Liên hệ ổn định:** ngưỡng chảy lớn hơn ứng suất trọng trường tác dụng lên giọt ⇒ không kem hóa; nhớt ở cắt rất thấp (≈ 10⁻³ s⁻¹) mới tương ứng quá trình kem hóa thực tế. **[K; G: ngưỡng cụ thể tùy hệ]**
- **Cạm bẫy:** trượt tường (wall slip) ở nhũ tương đậm đặc ⇒ dùng bề mặt nhám; bay hơi nước ở nhiệt cao ⇒ bẫy dung môi; phá cấu trúc khi nạp mẫu ⇒ chờ nghỉ.

---

## 4. Đặc trưng ổn định theo thời gian

### 4.1 Kem hóa/lắng
- **Quan sát thẳng + chỉ số kem hóa (CI):** CI(%) = (chiều cao lớp kem hoặc lớp trong / chiều cao toàn mẫu) × 100; theo dõi theo ngày. Dễ nhưng chỉ phát hiện muộn. **[K]**
- **Quét quang học đa tán xạ (Turbiscan):** theo dõi đồng thời kem hóa, lắng (sedimentation) và thay đổi kích thước bằng ánh sáng cận hồng ngoại (880 nm ở dòng Turbiscan hiện nay **[N: @microtrac-turbiscan]**, 850 nm ở đời Turbiscan Classic cũ **[N: @dafratec-turbiscan-classic]**) trong chai nguyên vẹn; nhạy hơn mắt thường nhiều ngày. **[N: @kupikowskastobba2024]**
- **Ly tâm tăng tốc:** ly tâm ở nhiều gia tốc, đo tốc độ phân lớp; phù hợp sàng lọc nhưng nén giọt và có thể gây hợp giọt không có trong bảo quản thực. **[K; @mcclements2007 thảo luận quy trình thử độ ổn định]**

### 4.2 Thử thách môi trường (screening) [K; N: @mcclements2007, @mcclements2016a]
Nên thiết lập ma trận tối thiểu:

| Stress | Mức gợi ý | Cơ chế kiểm |
|---|---|---|
| pH | 3, 5, 7, 9 | keo tụ gần pI |
| Muối | 0, 50, 100, 200 mM NaCl; Ca²⁺ 5–10 mM | che chắn, cầu nối |
| Nhiệt độ | 30–90 °C, 30 phút, và chu trình | biến tính, dehydrat PEO |
| Đông–rã đông | 1–3 chu kỳ | hợp giọt |
| Cắt/ly tâm | theo quy trình chuẩn | hợp giọt |
| Tiêu hóa in vitro | Dạ dày + ruột | liên quan nanoemulsion **[N: @mcclements2017]** |

> Mức đề xuất ở bảng là **ví dụ thiết kế** [G]. Với sản phẩm cụ thể, chọn khoảng bao quanh điều kiện sản xuất–bảo quản–tiêu thụ.

### 4.3 Hợp giọt một phần và kết tinh mỡ
- **DSC** (kết tinh và nóng chảy mỡ trong giọt) — liệt kê trong R18 như một kỹ thuật bổ sung. **[N: @kupikowskastobba2024]**
- **Pulsed NMR / SFC**, hiển vi ánh sáng phân cực (tinh thể mỡ), phương pháp pha loãng thuốc nhuộm, độ đục, calorimetry, kích thước hạt mỡ đo hợp giọt một phần (partial coalescence): các phương pháp định lượng này được so sánh trong tổng quan; một số tương quan tốt (dye dilution, calorimetry, kích thước hạt mỡ) còn một số tương quan kém. **[N: @petrut2015]**

---

## 5. Hóa học và chức năng
- **Oxy hóa lipid (lipid oxidation):** peroxide value (sản phẩm đầu), p-anisidine/TBARS (sản phẩm thứ cấp), hexanal bằng headspace GC; đo **thời gian cảm ứng**. Tổng quan R18 nhắc đến "đo oxy hóa lipid" và FTIR như kỹ thuật bổ sung. **[N: @kupikowskastobba2024; K]**
- **Độ phủ bề mặt (surface load) Γ:** tách pha nước bằng ly tâm/siêu lọc, đo protein không hấp phụ bằng BCA/Bradford; Γ = lượng hấp phụ / diện tích bề mặt (tính từ d₃₂). **[K]**
- **Sức căng bề mặt (interfacial tension) và lưu biến bề mặt:** tensiometer giọt treo/giọt quay; lưu biến giãn nở (dilatational) cho độ đàn hồi bề mặt, dự đoán chống hợp giọt. **[K]**
- **Tiêu hóa in vitro (in vitro digestion)** (INFOGEST): tốc độ lipolysis phụ thuộc kích thước giọt, kết tụ trong dạ dày, chất nhũ hóa (emulsifier) cạnh tranh muối mật. **[N: @mcclements2017; K: INFOGEST là đồng thuận quốc tế – cần tra khi trích]**

---

## 6. Quy trình đề xuất (SOP khung) [G]

**Mẫu cần lấy:** ≥3 mẻ độc lập; mỗi mẻ đo lặp ≥3 lần; lưu mẫu bảo quản ở 4 °C, 25 °C (và 37 °C nếu cần).

1. **Ngày 0 (ngay sau chế biến):** d₃₂/d₄₃/d₉₀ (laser + hiển vi), zeta (đúng pH), pH, độ nhớt (cắt thấp + đường cong chảy).
2. **Stress:** pH, muối, nhiệt (bảng 4.2); đo lại kích thước và quan sát mắt thường/hiển vi.
3. **Ngày 1, 7, 14, 30:** kích thước; CI hoặc Turbiscan; vi cấu trúc (CLSM nếu có).
4. **Xác định cơ chế:** (i) d₉₀ tăng nhưng d₁₀ cố định ⇒ hợp giọt/keo tụ; (ii) phân tán lại bằng SDS khôi phục ⇒ keo tụ; (iii) $d^3$ tuyến tính ⇒ ripening; (iv) CI tăng mà kích thước không đổi ⇒ kem hóa do Stokes.
5. **Báo cáo:** bảng d₃₂/d₄₃/d₉₀/span/zeta/nhớt; đồ thị theo thời gian; **ghi giới hạn** (đo trên mẫu đã pha loãng, không có thử nghiệm vi sinh...).

---

## 7. Những lỗi thường gặp khi đọc số liệu
| Lỗi | Hậu quả | Cách tránh |
|---|---|---|
| Chỉ báo cáo "kích thước trung bình" | Bỏ sót đuôi giọt lớn ⇒ kết luận ổn định sai | Báo cáo d₉₀, span và hiển vi |
| Pha loãng bằng nước cất | Phá cụm, ripening nhân tạo | Pha loãng bằng pha liên tục |
| Sai chiết suất trong Mie | Phân bố sai ở dưới 1 µm | Đo/nhập đúng RI, kiểm với DLS/hiển vi |
| Dùng zeta để kết luận ổn định ở hệ lập thể | Kết luận ngược | Kết hợp thử độ bền thực |
| Ly tâm để "dự đoán" thời hạn dài | Tạo hiện tượng không có trong thực tế | Dùng như sàng lọc, xác nhận bằng bảo quản thực |
| Không có đối chứng | Không biết "tốt hơn" so với cái gì | Luôn có công thức nền và chỉ tiêu cụ thể |
