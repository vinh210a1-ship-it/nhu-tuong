---
title: "Xử lý sự cố nhũ tương và quy trình thiết kế công thức"
slug: su-co-thiet-ke
khu: nhu-tuong
thu_tu: 8
loai: bai
hien_tren_web: true
level: 4-thuc-hanh
tags: [troubleshooting, DoE, chan-doan, kem-hoa, tach-lop, ripening, oxy-hoa]
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/08-xu-ly-su-co-va-quy-trinh-thiet-ke.md
---
# 08. Xử lý sự cố và quy trình thiết kế công thức

> **Kết luận trước.** Gần như mọi sự cố nhũ tương đều quy về một trong 7 mắt xích ở file 03. Quy trình chẩn đoán gồm **ba câu hỏi theo thứ tự**: (1) giọt có **đổi kích thước** không (hợp giọt/ripening) hay chỉ **di chuyển** (kem hóa/keo tụ)? (2) có **phân tán lại được** không (keo tụ) hay không (hợp giọt)? (3) quá trình có **tuyến tính theo d³** không (ripening)? Ba phép thử này tốn ít công mà loại được phần lớn giả thuyết.

Độ tin cậy: các hướng giải quyết dưới đây là **[K]/[G]** tổng hợp từ cơ chế ở file 02–03 (có nguồn ở đó); chưa phải số liệu thực nghiệm cho một sản phẩm cụ thể.

---

## 1. Bảng chẩn đoán: hiện tượng ⇒ nguyên nhân ⇒ bằng chứng ⇒ giải pháp ⇒ kiểm chứng

| Hiện tượng | Nguyên nhân hay gặp | Bằng chứng cần tìm | Giải pháp | Cách kiểm chứng |
|---|---|---|---|---|
| Lớp trắng/kem nổi trên cùng sau vài ngày, lắc thì trở lại | Kem hóa (Stokes) | d₉₀ cao; CI tăng; kích thước giữ nguyên sau lắc | Giảm d (thêm lần qua HPH); tăng η_c/ngưỡng chảy; chất làm nặng | CI giảm; d₉₀ giảm; Turbiscan |
| Kem hóa **nhanh hơn dự đoán Stokes** | Keo tụ (cụm lớn hiệu dụng) | Cụm thấy dưới kính hiển vi; d đo bằng laser **nhỏ hơn** hiển vi; phân tán lại bằng SDS ⇒ d trở lại ban đầu | Sửa điện tích/lập thể; giảm polymer tự do (cạn kiệt); chỉnh pH xa pI | d không đổi khi stress; zeta hoặc nhớt thay đổi |
| Xuất hiện "mắt dầu", lớp dầu tách ở trên, **không** phân tán lại bằng lắc | Hợp giọt | Phân bố kích thước dịch về giọt lớn, d₉₀ tăng nhưng không phục hồi sau SDS | Tăng chất nhũ hóa; chọn màng nhớt–đàn hồi; giảm cắt mạnh; kiểm tra nhiệt | d₄₃ ổn định; thử ly tâm/đông–rã đông |
| Giọt nhỏ biến mất, giọt lớn lớn dần chậm, $d^3$ tuyến tính theo thời gian | Ostwald ripening (dầu tan nước) | Vẽ $d_{43}^3$ vs t là đường thẳng; dầu là hương, tinh dầu, TAG ngắn | Thêm dầu không tan 50–60%+ (ví dụ trong thyme: ≥60% dầu bắp hoặc ≥50% MCT) **[N: @chang2012]**; giảm độ tan; chất nhũ hóa dày | Độ dốc d³–t giảm gần 0 |
| Nhũ tương **đặc lại**, đóng gel, rồi tách | Keo tụ mạng (gel hóa) hoặc đảo pha | Độ nhớt tăng; hiển vi thấy mạng | Giảm φ hoặc điều chỉnh gum; kiểm HLB/nhiệt | Lưu biến G′ giảm; hiển vi |
| O/W thành W/O khi thêm pha phân tán quá nhanh / φ cao | Đảo pha catastrophic | Độ dẫn điện giảm đột ngột (O/W dẫn, W/O gần như không) | Thêm pha phân tán chậm; đổi chất nhũ hóa; giảm φ | Đo độ dẫn trong quá trình thêm |
| Giọt không nhỏ hơn dù tăng áp suất | Giới hạn bởi chất nhũ hóa / độ tan protein kém | d gần như không đổi theo P; so sánh với Tween ở cùng điều kiện | Tăng chất nhũ hóa; chỉnh pH; xử lý protein (siêu âm, pH-shift) **[N: @yang2021]** | d giảm với chất mới |
| Hạt/lắng dưới đáy | Lắng hạt rắn hoặc protein tụ | Phân tách pha rắn khi ly tâm | Giảm cỡ hạt; thêm gellan/gum; chỉnh pH | Mẫu ly tâm không có cặn |
| Mùi ôi, tăng peroxide, hexanal | Oxy hóa lipid | PV/TBARS/hexanal tăng; kim loại; ánh sáng | Chelate (EDTA/citrate); chống oxy hóa; bề mặt điện tích dương; giảm O₂ | Thời gian cảm ứng kéo dài |
| Nhũ tương kép: mất hoạt chất, W₁ phồng/xẹp | Rò rỉ nước/thẩm thấu | Độ dẫn pha ngoài tăng; kích thước giọt O thay đổi | Cân bằng thẩm thấu (muối/đường); tăng độ nhớt W₁; Pickering hóa bề mặt **[N: @muschiolik2017]** | Hiệu suất W/O/W ổn định |
| Pickering: giọt to hơn mong đợi, hoặc đổi theo đồng hóa | Hợp giọt giới hạn do thiếu hạt hoặc hạt vỡ | d tỷ lệ nghịch với nồng độ hạt | Tăng hạt; kiểm tra tính toàn vẹn hạt sau đồng hóa **[N: @schroen2024]** | d giảm khi tăng hạt |

---

## 2. Thứ tự chẩn đoán đề xuất (cho web: sơ đồ quyết định)

```
Sản phẩm hỏng
│
├─ Có lớp kem/tách lớp sau lắc nhẹ trở lại? ── Có ──▶ KEM HÓA (± KEO TỤ). Kiểm: d₉₀, CI, SDS.
│                                                    ├─ Phân tán lại bằng SDS, d trở lại ban đầu ⇒ KEO TỤ
│                                                    └─ Không ⇒ KEM HÓA do giọt lớn / nhớt thấp
├─ Có mắt dầu, không hồi phục? ─────────── Có ──▶ HỢP GIỌT. Kiểm: d₄₃ tăng; màng; chất nhũ hóa
├─ d tăng chậm, d³ tuyến tính? ─────────── Có ──▶ OSTWALD RIPENING. Dầu tan nước ⇒ ức chế ripening
├─ Loại nhũ tương đổi (độ dẫn)? ─────────── Có ──▶ ĐẢO PHA
├─ Mùi ôi/peroxide? ─────────────────────── Có ──▶ OXY HÓA
└─ Không rõ ⇒ đo lại: d₃₂, d₉₀, zeta, nhớt, hiển vi; lặp lại theo thời gian
```

---

## 3. Quy trình thiết kế công thức nhũ tương từ đầu (từng bước) [G]

> Đây là khung làm việc thực dụng tổng hợp từ cơ chế; **không** phải quy trình chuẩn đã công bố. Các khoảng nồng độ mang tính khởi đầu.

**Bước 0 – Xác định yêu cầu:** loại sản phẩm; kích thước giọt mục tiêu (cảm quan, độ trong); thời hạn; pH, muối, nhiệt xử lý; nhãn (clean-label?).

**Bước 1 – Chọn pha dầu:** độ tan trong nước (có ripening không?), điểm chảy/SFC (kết tinh?), tỷ trọng (cần chất làm nặng?), nhạy oxy hóa.

**Bước 2 – Chọn chất nhũ hóa chính theo môi trường (file 04):** protein / phospholipid / polysaccharide / phân tử nhỏ / hạt; nồng độ khởi đầu theo **diện tích bề mặt** (file 01, mục 2.2) nhân hệ số 1,5–3.

**Bước 3 – Chọn thiết bị và quy trình (file 02):** pre-emulsion (rotor-stator) ⇒ HPH hoặc siêu âm; xác định chế độ giới hạn (năng lượng vs chất nhũ hóa).

**Bước 4 – Thiết kế thực nghiệm (DoE):**
- Biến: [chất nhũ hóa] (3 mức), áp suất/công suất (3 mức), [gum] (3 mức).
- Đáp ứng: d₃₂, d₉₀, span, zeta, nhớt, CI sau 7/14 ngày.
- Phân tích hồi quy bề mặt đáp ứng; chọn vùng ổn định.

**Bước 5 – Stress test (file 06, 4.2):** pH, muối, nhiệt, đông–rã đông.

**Bước 6 – Bảo quản thực:** 4 °C, 25 °C, (37 °C), ánh sáng/ôxy theo bao bì; thời điểm 0, 1, 7, 14, 30, 60, 90 ngày.

**Bước 7 – Quyết định đi tiếp:** nếu có ≥1 mắt xích mất ổn định ⇒ quay lại file 03 chọn công cụ.

**Bước 8 – Scale-up (file 02, mục 6).**

---

## 4. Mẫu "phiếu thí nghiệm" cho web (tải về)

| Trường | Ví dụ |
|---|---|
| Mã công thức | EM-001 |
| Pha dầu (loại, %) | Dầu hướng dương 10% |
| Pha nước (pH, muối) | pH 6,8; 20 mM NaCl |
| Chất nhũ hóa (loại, %) | Protein đậu Hà Lan 1% |
| Gum/chất ổn định | Xanthan 0,05% |
| Quy trình | Rotor-stator 10.000 rpm 2 phút ⇒ HPH 50 MPa × 2 |
| Nhiệt độ | Pha dầu 25 °C; sau HPH làm lạnh ≤ 25 °C trong 30 giây |
| Đáp ứng ngày 0 | d₃₂, d₄₃, d₉₀, span, zeta, nhớt |
| Đáp ứng ngày 7/14/30 | Như trên + CI |
| Kết luận cơ chế | Keo tụ / hợp giọt / ripening / kem hóa / oxy hóa |

(Ví dụ chỉ để minh họa định dạng; không phải kết quả đo.)
