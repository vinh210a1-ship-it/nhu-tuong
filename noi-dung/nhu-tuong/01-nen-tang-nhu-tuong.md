---
title: "Nền tảng nhũ tương thực phẩm"
slug: nen-tang
khu: nhu-tuong
thu_tu: 1
loai: bai
hien_tren_web: true
level: 1-nen-tang
tags: [dinh-nghia, nhiet-dong-hoc, suc-cang-be-mat, HLB, Laplace, dien-tich-be-mat]
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/01-nen-tang-nhu-tuong.md
---
# 01. Nền tảng nhũ tương thực phẩm

> **Kết luận trước.** Nhũ tương (emulsion) là hệ keo **không bền về nhiệt động** nhưng có thể **bền động học** trong thời hạn sử dụng. Toàn bộ công việc của người làm sản phẩm là (1) tạo ra giọt đủ nhỏ và đồng đều, (2) phủ kín bề mặt giọt bằng lớp chất nhũ hóa (emulsifier) đủ bền, (3) làm chậm mọi quá trình chuyển động và va chạm của giọt (nhớt, gel, điện tích, lập thể). Phần còn lại chỉ là chi tiết của ba việc này.

---

## 1. Định nghĩa và phân loại

**Nhũ tương** là hệ phân tán của một chất lỏng (pha phân tán/pha nội) dưới dạng giọt trong một chất lỏng khác không trộn lẫn (pha liên tục/pha ngoại). Trong thực phẩm, hai chất lỏng gần như luôn là dầu (lipid) và nước (dung dịch nước). **[K]**

| Loại | Cấu trúc | Ví dụ thực phẩm |
|---|---|---|
| O/W (dầu trong nước) | Giọt dầu trong nước | Sữa, kem tươi, mayonnaise, nước sốt, sữa thực vật, đồ uống nhũ hóa |
| W/O (nước trong dầu) | Giọt nước trong dầu | Bơ, margarine, phết béo (spread) |
| W/O/W (nhũ tương kép) | Giọt nước nhỏ nằm trong giọt dầu lớn, giọt dầu nằm trong nước | Hệ giảm béo, bao gói hoạt chất tan trong nước **[N: @muschiolik2017]** |
| O/W/O | Ngược lại W/O/W | Hiếm trong thực phẩm **[N: @muschiolik2017]** |
| HIPE (high internal phase emulsion) | Phân số pha phân tán φ > ~0,74 | Mayonnaise, W/O HIPE giảm béo **[N: @zhang2025]** |

**Phân loại theo kích thước giọt** (ranh giới thay đổi giữa các tác giả **[K]**):

| Loại | Kích thước giọt điển hình | Độ bền nhiệt động | Độ trong |
|---|---|---|---|
| Nhũ tương thông thường (macro/"conventional") | ~0,1–100 µm | Không bền (bền động học) | Đục, trắng |
| Nanoemulsion | ≲100–200 nm | Không bền nhiệt động, bền động học rất tốt | Trong mờ đến trong **[N: @gupta2016 nêu "khoảng 100 nm"]** |
| Microemulsion | ~5–50 nm | **Bền nhiệt động**, tự hình thành | Trong suốt |

> Lưu ý hay nhầm: *nanoemulsion* và *microemulsion* **không phải một thứ**. Microemulsion nằm ở cực tiểu năng lượng tự do và cần lượng chất hoạt động bề mặt (surfactant) lớn; nanoemulsion vẫn là hệ cân bằng giả (kinetically stable) **[N: @gupta2016; K]**.

---

## 2. Vì sao nhũ tương phải được "ép" tạo thành và tự tìm cách phân tách

### 2.1 Nhiệt động
Tạo giọt từ hai pha tách riêng làm tăng diện tích tiếp xúc dầu–nước một lượng ΔA. Năng lượng tự do cần cấp:

$$\Delta G_{form} = \gamma\,\Delta A - T\,\Delta S_{conf}$$

Số hạng entropy cấu hình $T\Delta S_{conf}$ rất nhỏ so với $\gamma\Delta A$ (với giọt ≥ ~100 nm), nên $\Delta G>0$: hệ **không tự hình thành** và luôn có xu hướng giảm diện tích (hợp giọt, ripening, tách pha). **[K]**

### 2.2 Diện tích bề mặt riêng — con số quyết định mọi thứ
Với giọt cầu, phân số thể tích dầu φ, đường kính trung bình diện tích–thể tích $d_{32}$:

$$A_{spec} = \frac{6\varphi}{d_{32}}\quad[\text{m}^2\text{ bề mặt / m}^3\text{ nhũ tương}]$$

**[T]** Ví dụ φ = 0,2:

| d₃₂ | Diện tích bề mặt | Năng lượng bề mặt (γ = 10 mN/m) |
|---|---|---|
| 10 µm | 1,2 × 10⁵ m²/m³ | 1,2 kJ/m³ |
| 1 µm | 1,2 × 10⁶ m²/m³ | 12 kJ/m³ |
| 0,2 µm | 6,0 × 10⁶ m²/m³ | 60 kJ/m³ |

Giảm đường kính 10 lần ⇒ diện tích bề mặt tăng 10 lần ⇒ cần **nhiều chất nhũ hóa hơn 10 lần** để phủ, và nhiều năng lượng hơn để tạo.

**Ước lượng lượng chất nhũ hóa tối thiểu** (từ độ phủ bề mặt Γ). Chất nhũ hóa thực phẩm thường có Γ cỡ vài mg/m² **[N: @mcclements2016 tr.193]**; chọn Γ = 2 mg/m² (đúng giá trị trong ví dụ của sách, tr.273): **[T]**

| d₃₂ | Chất nhũ hóa cần để phủ (φ = 0,2) |
|---|---|
| 5 µm | ≈ 0,5 g/L (≈ 0,05% w/v) |
| 1 µm | ≈ 2,4 g/L (≈ 0,24%) |
| 0,3 µm | ≈ 8 g/L (≈ 0,8%) |

Đây là mức **tối thiểu lý thuyết**; thực tế cần dư 1,5–3 lần để (i) bù phần protein không thể nằm trên bề mặt, (ii) tránh bắc cầu (bridging) khi thiếu phủ, và (iii) bù mất do giải hấp trong quá trình bảo quản. **[G]**

### 2.3 Các đường kính trung bình (dùng trong đo lường)
- $d_{32}$ (Sauter) $=\sum n_i d_i^3\big/\sum n_i d_i^2$: liên quan trực tiếp diện tích bề mặt, dùng cho tính lượng chất nhũ hóa.
- $d_{43}$ (De Brouckere) $=\sum n_i d_i^4\big/\sum n_i d_i^3$: nhạy với giọt lớn, dùng cho dự đoán kem hóa (creaming)/hợp giọt (coalescence).
- $d_{90}$ hoặc $d_{99}$: cái đuôi giọt lớn **quyết định tốc độ kem hóa** (xem file 03 và 06).

---

## 3. Giao diện dầu–nước: ba khái niệm cần nắm

### 3.1 Sức căng bề mặt và áp suất Laplace
Chất nhũ hóa hấp phụ làm giảm sức căng bề mặt (interfacial tension) γ. Giọt cầu bán kính r có áp suất bên trong cao hơn bên ngoài:

$$\Delta P = \frac{2\gamma}{r}$$

**[T]** Hệ quả: để bẻ giọt nhỏ phải thắng áp suất Laplace (Laplace pressure) lớn.

| d | γ | ΔP Laplace |
|---|---|---|
| 10 µm | 10 mN/m | 0,04 bar |
| 1 µm | 10 mN/m | 0,4 bar |
| 0,2 µm | 10 mN/m | 2 bar |
| 0,1 µm | 5 mN/m | 2 bar |
| 0,05 µm | 5 mN/m | 4 bar |

Áp suất này khá nhỏ so với 100–200 MPa của đồng hóa áp suất cao (high-pressure homogenization): phần lớn năng lượng thực tế **không** dùng để "thắng Laplace" mà để tạo ứng suất chảy đủ lớn trong thời gian cực ngắn (file 02).

### 3.2 Hấp phụ (Gibbs) và độ phủ
Chất hoạt động bề mặt/protein tự di chuyển ra giao diện làm giảm năng lượng hệ. Độ phủ bề mặt (surface load) Γ (mg/m² hoặc mmol/m²) tăng theo nồng độ rồi bão hòa. Với protein cầu, quá trình thường **không thuận nghịch**: sau khi hấp phụ và duỗi/biến dạng, protein khó giải hấp **[K]**; với phân tử nhỏ (Tween, SDS, lecithin) thì thuận nghịch và động. Hệ quả:

- Phân tử nhỏ: hạ γ mạnh và nhanh ⇒ tạo giọt nhỏ dễ, nhưng lớp màng mỏng, bền chủ yếu nhờ đẩy tĩnh điện/lập thể ngắn.
- Protein, polymer: hạ γ ít hơn, chậm hơn, nhưng tạo màng nhớt–đàn hồi dày ⇒ bền hợp giọt tốt hơn **[K]**.

### 3.3 Hiệu ứng Gibbs–Marangoni
Khi hai giọt tiến lại gần, màng nước giữa chúng bị vắt ra, kéo chất nhũ hóa khỏi vùng màng mỏng; chỗ đó γ tăng cục bộ ⇒ dòng Marangoni kéo chất lỏng và chất nhũ hóa quay lại ⇒ **chống màng mỏng đi**. Đây là cơ chế cơ bản khiến lớp phủ đủ dày, đủ chất nhũ hóa dư trong pha liên tục (continuous phase) sẽ chống hợp giọt trong lúc đồng hóa. **[K]**

---

## 4. Chất nhũ hóa: ba chức năng và chọn theo quy tắc nào

### 4.1 Ba chức năng của chất nhũ hóa [K]
1. **Hạ sức căng bề mặt** ⇒ dễ tạo giọt nhỏ.
2. **Hình thành lớp bảo vệ** ngăn hợp giọt: bằng đẩy tĩnh điện (zeta), đẩy lập thể (polymer, chuỗi PEO), độ nhớt–đàn hồi bề mặt (protein), hoặc rào cản cơ học (hạt Pickering **[N: @li2022a, @schroen2024]**).
3. **Làm chậm hợp giọt trong lúc tạo** (hiệu ứng Gibbs–Marangoni, độ nhớt bề mặt).

### 4.2 Quy tắc Bancroft
Pha mà chất nhũ hóa **tan tốt hơn** sẽ thành pha liên tục. Chất tan nước ⇒ O/W; tan dầu ⇒ W/O. **[N: @mcclements2016 tr.133–134]** Đây là quy tắc kinh nghiệm: sai lệch xảy ra với nhũ tương rất đậm đặc và với hạt rắn.

### 4.3 HLB – cân bằng ưa nước/ưa dầu (cho chất nhũ hóa phân tử nhỏ)
Thang 0–20. Theo sách McClements 2016: HLB 3–6 tan dầu, ổn định W/O; 7–9 là chất thấm ướt, nhũ tương dễ hợp giọt; 10–18 tan nước, ổn định O/W; quan sát thực nghiệm cho thấy bền nhất ở khoảng 10–12 (O/W) và 3–5 (W/O). **[N: @mcclements2016 tr.134–135]** Nguồn giáo dục mở OSU Extension nêu khoảng rộng hơn: **W/O: 3,5–6; O/W: 8–18**. **[N: trang OSU Extension "Food Emulsifiers" – không có số HLB từng chất]**

Công thức tính **[K: @griffin1949a, @davies1957]**:
- Griffin (chất không ion có chuỗi polyoxyethylene): $HLB = 20\,M_h/M$ ($M_h$ khối lượng phần ưa nước, M khối lượng phân tử).
- Este polyol với acid béo: $HLB = 20\,(1 - S/A)$ (S chỉ số xà phòng, A chỉ số acid).
- Davies (cộng nhóm): $HLB = 7 + \sum(\text{nhóm ưa nước}) - \sum(\text{nhóm ưa dầu})$. Sách McClements ghi công thức cộng nhóm này (Eq. 4.7) với nguồn "Davis 1994"; web gọi là công thức Davies. **[N: @mcclements2016 tr.134]**
- Hỗn hợp: $HLB_{mix} = \sum w_i\,HLB_i$ (xấp xỉ kinh nghiệm, dùng làm điểm khởi đầu rồi thử nghiệm).

HLB điển hình: sáu chất (trừ Span 85) lấy từ bảng của sách McClements 2016 (Table 4.6) **[N: @mcclements2016 tr.135]**; Span 85 không có trong bảng đó nên giữ giá trị theo nhà sản xuất/ICI, cần xác nhận với phiếu kỹ thuật lô thực tế:

| Chất | HLB điển hình |
|---|---|
| Span 85 | ~1,8 |
| Span 80 | ~4,3 |
| Span 60 | ~4,7 |
| Span 20 | ~8,6 |
| Tween 80 | ~15 |
| Tween 20 | ~16,7 |
| PGPR (polyglycerol polyricinoleate) | ~1,5 (cho W/O, dùng ở pha dầu của W/O/W) |

**Giới hạn của HLB:** HLB chỉ tính cấu trúc phân tử, **không** phản ánh nhiệt độ, độ mặn, loại dầu, thành phần hỗn hợp; trong thực phẩm, nhiều chất nhũ hóa quan trọng nhất (protein, lecithin, gum arabic, hạt) **không** dùng HLB để chọn. Khi hệ phức tạp, dùng khái niệm **HLD/PIT** hoặc phương pháp thử nghiệm lưới (DoE). Sách McClements nêu HLB đổi theo nhiệt độ và điều kiện dung dịch, và "HLB yêu cầu" của mỗi dầu phải xác định bằng thực nghiệm; sách không có bảng HLB yêu cầu của từng loại dầu. **[N: @mcclements2016 tr.136; K; G]**

### 4.4 Bảng nhóm chất nhũ hóa (tóm tắt; chi tiết ở khu Chất nhũ hóa)
| Nhóm | Ví dụ | Cơ chế ổn định chính |
|---|---|---|
| Phân tử nhỏ không ion | Tween, Span, mono/diglyceride, este đường | Lập thể ngắn, hạ γ mạnh |
| Phân tử nhỏ ion | SSL, CSL, DATEM, SDS (ngoài thực phẩm) | Điện tích + lập thể |
| Phospholipid | Lecithin (đậu nành, trứng, hướng dương) | Màng đơn lớp, tĩnh điện |
| Protein | Sữa (casein, whey), trứng, đậu nành, đậu Hà Lan | Màng nhớt–đàn hồi, tĩnh điện + lập thể |
| Polysaccharide hoạt động bề mặt | Gum arabic, OSA-starch, pectin củ cải đường | Lập thể dày (có phần protein) |
| Hạt rắn | Tinh bột, cellulose, chitin, protein dạng hạt | Rào cản cơ học, hấp phụ không thuận nghịch |
| Saponin (chất tạo bọt thực vật) | Quillaja | Màng nhớt–đàn hồi (hiểu biết hạn chế cần kiểm) |

Chi tiết từng nhóm nằm ở khu [Chất nhũ hóa](../../chat-nhu-hoa/); bài này chỉ giữ các điểm cần để hiểu cơ chế.

---

## 5. Phân số pha phân tán φ và cấu trúc đóng gói

- Cầu cứng đơn phân tán xếp ngẫu nhiên đặc nhất: φ ≈ 0,63. **[N: @mcclements2016 tr.299, tr.429]**
- Xếp mạng tinh thể (fcc): φ ≈ 0,74. **[K]**
- Trên ~0,63–0,74 giọt phải **biến dạng thành đa diện** ⇒ hệ chuyển từ lỏng sang chất rắn mềm đàn hồi (HIPE). **[K]**
- Mayonnaise chứa khoảng 75–84% dầu theo khối lượng, giọt xếp khít và nhiều giọt không cầu; vượt φ của cầu đơn phân tán nhờ giọt nhiều cỡ và biến dạng được. **[N: @mcclements2016 tr.567, tr.429]**
- Khi φ cao: độ nhớt tăng mạnh, kem hóa bị cản (hindered creaming – hệ số thường mô hình bằng $(1-\varphi)^{k}$ với k cỡ vài đơn vị; Richardson–Zaki k ≈ 4,65 cho cầu cứng **[K]**), nhưng nguy cơ hợp giọt và đảo pha (phase inversion) tăng.

---

## 6. Bản đồ khái niệm

```
Giọt nhỏ ──▶ Diện tích lớn ──▶ Cần nhiều chất nhũ hóa + nhiều năng lượng
   │
   ├── Chất nhũ hóa: hạ γ → bảo vệ → Marangoni
   │         └── HLB (phân tử nhỏ) / điện tích + lập thể (protein, polymer) / rào cản hạt
   │
   └── Ổn định: giảm chuyển động giọt (nhớt, gel pha liên tục) +
                giảm va chạm hiệu quả (điện tích, lập thể) +
                chặn ripening (dầu không tan) + chặn oxy hóa
```

**Đọc tiếp:** file 02 (hình thành), 03 (mất ổn định).
