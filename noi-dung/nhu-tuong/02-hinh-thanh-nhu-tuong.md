---
title: "Hình thành nhũ tương – vỡ giọt, hấp phụ, thiết bị, phương pháp năng lượng thấp"
slug: hinh-thanh
khu: nhu-tuong
thu_tu: 2
loai: bai
hien_tren_web: true
level: 2-co-che
tags: [vo-giot, Weber, Capillary, Kolmogorov, HPH, siêu âm, rotor-stator, PIT, EIP, tu-nhu-hoa]
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/02-hinh-thanh-nhu-tuong.md
---
# 02. Hình thành nhũ tương

> **Kết luận trước.** Kích thước giọt cuối cùng là kết quả của **cuộc đua giữa ba tốc độ**: (1) giọt bị bẻ nhỏ bởi ứng suất chảy, (2) chất nhũ hóa hấp phụ lên bề mặt mới, (3) giọt va chạm và hợp lại. Có hai chế độ: **giới hạn bởi năng lượng** (tăng áp suất/công suất thì giọt nhỏ đi) và **giới hạn bởi chất nhũ hóa** (tăng áp suất nhưng giọt không nhỏ thêm vì giọt mới hợp lại; phải tăng chất nhũ hóa hoặc dùng chất hấp phụ nhanh hơn). Chẩn đoán đúng chế độ là bước quan trọng nhất khi giọt không đạt cỡ mong muốn.

Độ tin cậy: **[N]** có nguồn kiểm · **[K]** sách giáo khoa · **[T]** tính minh họa · **[G]** giả thuyết.

---

## 1. Ba quá trình xảy ra gần như đồng thời (khung Walstra) [K: @walstra1993, @walstra2003; N: @mcclements2016 tr.249–251, tr.273–274]

```
Thô (pre-emulsion)  ──(1) vỡ giọt──▶  giọt nhỏ, bề mặt trần
                                        │
                              (2) hấp phụ chất nhũ hóa ◀── cạnh tranh ──▶ (3) hợp giọt
                                        │
                                  giọt bền, kích thước cuối
```

- **Thời gian vỡ giọt:** cỡ mili-giây đến micro-giây trong vùng ứng suất cao (khe van HPH, vùng cavitation).
- **Thời gian hấp phụ:** nếu hấp phụ khuếch tán chậm hơn thời gian giữa hai va chạm thì giọt mới hợp lại. Protein lớn, ít nồng độ ⇒ hấp phụ chậm. Phân tử nhỏ nồng độ cao ⇒ rất nhanh.
- **Hệ quả thực hành:** nhiều chất nhũ hóa lớn (protein) tạo giọt to hơn phân tử nhỏ ở cùng điều kiện đồng hóa, trừ khi nồng độ đủ cao. **[K]**

### Hai chế độ (cách chẩn đoán) [K]
| Hiện tượng khi tăng áp suất/công suất | Chế độ | Việc cần làm |
|---|---|---|
| Giọt nhỏ đi rõ rệt | Giới hạn bởi năng lượng | Tăng áp suất, thêm số lần qua máy, giảm độ nhớt pha phân tán |
| Giọt gần như không đổi hoặc **to lên** | Giới hạn bởi chất nhũ hóa (hợp giọt tái diễn) | Tăng nồng độ chất nhũ hóa, đổi sang chất hấp phụ nhanh (phân tử nhỏ + protein), hạ nhiệt độ pha dầu để tăng độ nhớt chống va chạm |
| Giọt to lên khi tăng số lần qua máy | "Over-processing" | Giảm áp suất ở bước hai, kiểm tra nhiệt độ |

---

## 2. Vật lý của vỡ giọt

### 2.1 Dòng chảy lớp (laminar) – số Capillary [K: @grace1982]
Giọt bị biến dạng bởi ứng suất nhớt $\eta_c\dot\gamma$ và bị giữ bởi áp suất Laplace $\gamma/r$. Số Capillary:

$$Ca = \frac{\eta_c\,\dot\gamma\,r}{\gamma}$$

Giọt vỡ khi $Ca > Ca_{crit}$. $Ca_{crit}$ phụ thuộc **tỷ lệ nhớt** $\lambda = \eta_d/\eta_c$ (đường cong Grace):
- λ ≈ 0,1–1: $Ca_{crit}$ nhỏ nhất (cỡ vài phần mười) ⇒ vỡ dễ nhất.
- λ ≳ 4: trong **cắt đơn thuần (simple shear)** giọt **không vỡ được** dù tăng tốc độ cắt; cần dòng kéo giãn (extensional flow).
- Hệ quả thực hành: dầu rất nhớt hoặc pha dầu chứa nhiều mỡ rắn cần **làm nóng pha dầu** (hạ $\eta_d$) và/hoặc dùng thiết bị có thành phần kéo giãn (khe hẹp, van đồng hóa).

### 2.2 Dòng chảy rối (turbulent) – Kolmogorov–Hinze [K: @hinze1955]
Trong HPH và rotor-stator tốc độ cao, ứng suất do xoáy rối là chính. Kích thước xoáy nhỏ nhất (Kolmogorov):

$$\eta_K = \left(\frac{\nu_c^3}{\varepsilon}\right)^{1/4}$$

$\varepsilon$ là tốc độ tiêu tán năng lượng riêng (W/kg). **[T]** Với $\nu_c=10^{-6}$ m²/s (nước):

| ε (W/kg) | η_K |
|---|---|
| 10⁵ | 1,8 µm |
| 10⁶ | 1,0 µm |
| 10⁷ | 0,56 µm |
| 10⁸ | 0,32 µm |

Hai vùng:
- **Giọt lớn hơn η_K (vùng quán tính):** kích thước giọt cực đại $d_{max}\propto \gamma^{0.6}\rho_c^{-0.2}\varepsilon^{-0.4}$. Tăng ε gấp 10 lần ⇒ giọt nhỏ đi ≈ 2,5 lần (theo lý thuyết).
- **Giọt nhỏ hơn η_K (vùng nhớt):** $d_{max}\propto \gamma\,(\rho_c\eta_c\varepsilon)^{-1/2}$, tức phụ thuộc $\varepsilon^{-0,5}$ và **độ nhớt pha liên tục**.

Khi cỡ giọt sub-micromet (cỡ η_K hoặc nhỏ hơn) bạn đã ở vùng nhớt: **tăng độ nhớt pha liên tục** (thêm gum, đường, glycerol) thường giúp tạo giọt nhỏ hơn ở cùng ε. **[K; G: ứng dụng cụ thể cần thử]**

> Thực nghiệm HPH thường cho quan hệ log–log giữa $d_{32}$ và áp suất với độ dốc âm khoảng từ −0,3 đến −0,6 (tùy hệ, tùy van). Đây là quan sát phổ biến, **không phải hằng số**; phải đo trên chính hệ của bạn. **[G]**

### 2.3 Cavitation
Áp suất giảm cục bộ dưới áp suất hơi ⇒ bọt hơi hình thành rồi sụp đổ ⇒ vi tia và sóng xung kích bẻ giọt. Quan trọng trong siêu âm cường độ cao (HIUS) và ở van HPH. **[N: @qayum2023 mô tả "HIUS-induced acoustic cavitation ... HPH-induced shear stress, turbulence, and cavitation lead to droplet disruption"]**

---

## 3. Hiệu suất năng lượng: tại sao đồng hóa tốn nhiều như vậy

**[T]** Năng lượng bề mặt thực sự cần tạo: φ = 0,2, d₃₂ = 1 µm, γ = 10 mN/m ⇒ γ·A = 0,01 × 1,2×10⁶ ≈ **1,2×10⁴ J/m³**. Trong khi HPH ở 100 MPa cấp mật độ năng lượng **≈ 10⁸ J/m³**. Tỷ lệ ≈ **0,01%**: phần còn lại hóa nhiệt.

Nhiệt độ tăng ở van (tính từ cân bằng năng lượng, bỏ qua mất nhiệt):

$$\Delta T \approx \frac{\Delta P}{\rho\,c_p} \approx \frac{10^8}{1000\times 4180} \approx 24\ \text{K}\ (\text{cho nước, 100 MPa})$$

tức **≈ 2,4 K mỗi 10 MPa**. Điều này giải thích vì sao: (i) sản phẩm ra khỏi HPH nóng, cần làm lạnh ngay; (ii) protein nhạy nhiệt (whey) có thể biến tính nếu pha trước đã ấm; (iii) kết tinh mỡ bị ảnh hưởng.

---

## 4. Thiết bị tạo nhũ tương

> Dải kích thước dưới đây là **khoảng thường gặp**, phụ thuộc hệ (độ nhớt, chất nhũ hóa, φ, số lần qua máy). Không dùng làm cam kết thiết kế. **[K; N: @gupta2016, @qayum2023 về nguyên lý HPH/siêu âm]** Cỡ giọt **nhỏ nhất** thường đạt theo McClements 2016 (Table 6.1): trộn cao tốc ≈2 µm; nghiền keo ≈1 µm; đồng hóa áp cao ≈0,1 µm; siêu âm đầu dò ≈0,1 µm; siêu âm dòng ≈1 µm; microfluidizer <0,1 µm; màng ≈0,3 µm. **[N: @mcclements2016 tr.250]** Sách không cho áp suất cụ thể (bao nhiêu bar): phần đó vẫn là khoảng thường gặp. **[K]**

| Thiết bị | Cơ chế | Kích thước giọt đạt được (khoảng) | Ưu | Nhược |
|---|---|---|---|---|
| Máy khuấy cánh / khuấy từ | Cắt, rối thấp | Hàng chục µm | Rẻ, bước tạo nhũ thô (pre-emulsion) | Đa phân tán |
| Rotor–stator (Ultra-Turrax, Silverson, inline) | Cắt cao + rối trong khe rotor–stator | ~1–10 µm (có thể thấp hơn với chất nhũ hóa nhanh) | Dễ scale, nhập liệu liên tục, xử lý được độ nhớt cao | Dải kích thước rộng; cuốn khí |
| Máy nghiền keo (colloid mill) | Cắt giữa đĩa | ~1–5 µm | Chịu độ nhớt cao (mayonnaise, bơ đậu phộng) | Mài mòn, nhiệt |
| Đồng hóa áp suất cao (HPH, van đồng hóa) | Cắt + kéo giãn + rối + cavitation ở khe van | ~0,1–1 µm; áp suất công nghiệp thường chục–vài trăm bar, nghiên cứu lên 150–200 MPa | Chuẩn công nghiệp sữa, đồ uống; quy mô lớn | Nhiệt, mài mòn van, tắc nghẽn với hạt lớn |
| Microfluidizer (buồng tương tác Y/Z) | Hai dòng chảy tốc độ cực cao va chạm | Sub-µm, gần 100 nm | Phân bố hẹp hơn HPH van tiêu chuẩn | Chi phí, nhiệt, khó scale |
| Siêu âm cường độ cao (đầu dò 20 kHz) | Cavitation âm | ~0,1–1 µm | Rất tiện cho phòng lab, thể tích nhỏ | Khó scale, nhiệt, tạp kim loại từ đầu dò; cần flow cell |
| Màng/membrane (SPG…) | Đẩy dầu qua lỗ màng vào pha nước chảy | Giọt bằng ~2–10 lần đường kính lỗ, rất đơn phân tán | Rất đồng đều; hợp nhũ tương kép nhạy cắt **[N: @muschiolik2017 nhấn mạnh phương pháp nhẹ cho W/O/W]** | Lưu lượng thấp, tắc màng |
| Microfluidics (chip) | Hình học giọt đơn | 10–1000 µm | Đơn phân tán tuyệt đối; nghiên cứu | Lưu lượng rất thấp (công bố scale-up vẫn là đề tài nghiên cứu, ví dụ post-array devices **[N: PubMed 40444208]**) |

**Điểm cần nhớ:** chọn thiết bị theo **mục tiêu**: (i) kích thước giọt cần đạt, (ii) độ nhạy cắt của vật liệu (protein, nhũ tương kép, tinh thể mỡ), (iii) độ nhớt, (iv) quy mô, (v) tính dễ vệ sinh/CIP.

### 4.1 Quy trình phòng lab điển hình O/W 10–20% dầu (khởi điểm, tinh chỉnh theo hệ) [G]
1. Hòa tan/hydrat hóa chất nhũ hóa vào pha nước (protein: 30–60 phút, nhiệt độ thấp, chỉnh pH). Kiểm tra pH **sau** khi hydrat hóa.
2. Đưa pha dầu (nếu có mỡ rắn: ấm hơn điểm chảy hoàn toàn ~10 °C) vào pha nước đang khuấy để tạo **nhũ tương thô**.
3. Tạo nhũ tương mịn: HPH 2 lần, ví dụ 5–10 MPa ở van thứ hai (tách cụm) và 50–100 MPa ở van thứ nhất; hoặc siêu âm có làm lạnh trong bể đá.
4. Làm lạnh ngay, đo d₃₂/d₄₃ ở 30 phút và 24 giờ.
5. Nếu d tăng sau 24 giờ ⇒ nghi chế độ giới hạn chất nhũ hóa hoặc ripening/hợp giọt: quay lại mục 1.

Các thông số trong bước 3 là ví dụ khởi đầu thường dùng trong thực hành phòng lab **[G]**; không phải tiêu chuẩn.

---

## 5. Phương pháp năng lượng thấp

Lợi thế: không cần máy đắt tiền, tạo được giọt rất nhỏ (nanoemulsion) với chất hoạt động bề mặt không ion; nhược: cần **lượng chất hoạt động bề mặt cao** và thành phần cụ thể. **[N: @gupta2016 liệt kê PIT, EIP, bubble bursting; @perazzo2015]**

### 5.1 Đảo pha theo nhiệt độ (PIT – transitional) [N: @perazzo2015; K: @shinoda1969]
- Chất không ion ethoxyl hóa **mất nước dần khi tăng nhiệt độ** ⇒ HLB hiệu dụng giảm.
- Ở **nhiệt độ đảo pha (PIT)** hệ ở điểm cân bằng ưa nước/ưa dầu: sức căng bề mặt cực thấp, có thể hình thành cấu trúc song liên tục.
- Quy trình: tạo hỗn hợp ở T > PIT (W/O) rồi **làm lạnh nhanh** qua PIT ⇒ O/W giọt rất nhỏ (cỡ vài chục nm đến ~100 nm, tùy hệ).
- Hạn chế: nhạy với muối, đồng dung môi, lipid; phải kiểm soát tốc độ làm lạnh; nanoemulsion sau đó thường dễ ripening nếu dầu tan nước.

### 5.2 Đảo pha theo thành phần (PIC/EIP – catastrophic) [N: @perazzo2015]
- Bắt đầu từ pha dầu + chất hoạt động bề mặt, **thêm nước từng chút** đến điểm đảo pha W/O → O/W. Giọt O/W hình thành rất nhỏ ngay tại thời điểm đảo.
- Dùng với nhiều hệ thực phẩm thực tế (ví dụ nhũ tương Tween–dầu, lecithin–dầu) khi cần đơn giản.
- Điều kiện: tốc độ thêm nước, khuấy, nhiệt độ ảnh hưởng đến kích thước.

### 5.3 Tự nhũ hóa / "ouzo effect" / thay thế dung môi [K]
- Hòa pha dầu + chất hoạt động bề mặt trong dung môi tan nước (ethanol, acetone), đổ vào nước ⇒ dung môi khuếch tán ra ⇒ giọt dầu quá bão hòa kết tủa thành giọt nanômét.
- Cần loại dung môi sau cùng (bay hơi); ứng dụng thực phẩm hạn chế bởi dư lượng.

### 5.4 Khi nào nên chọn?
| Mục tiêu | Gợi ý |
|---|---|
| Nanoemulsion trong, dầu hương tan nước một phần | PIT hoặc EIP (với chất không ion) + chất ức chế ripening (file 03) |
| Giữ cấu trúc nhạy cắt (protein, tinh thể mỡ, nhũ tương kép) | Phương pháp nhẹ: khuấy chậm, màng; tránh HPH mạnh |
| Sản xuất liên tục lớn (sữa, đồ uống) | HPH (hoặc rotor-stator inline cho pre-emulsion) |
| Nghiên cứu nhanh vài chục mL | Siêu âm (đầu dò) có kiểm soát nhiệt |

---

## 6. Scale-up – nguyên tắc và danh mục kiểm tra

> **Kết luận trước.** Scale-up nhũ tương không thể làm bằng "giữ tốc độ khuấy" hay "nhân tỷ lệ". Cần chọn **đại lượng bất biến** gắn với cơ chế vỡ giọt rồi **đo lại** ở quy mô mới: không có quy tắc đúng cho mọi hệ. **[G]**

### 6.1 Đại lượng bất biến thường dùng [K; G]
| Thiết bị | Quy tắc scale | Điểm cần kiểm |
|---|---|---|
| HPH | Giữ **áp suất** (hoặc mật độ năng lượng $E_V=\Delta P$) và **hình học van** tương tự; tăng lưu lượng bằng piston/lỗ lớn hơn | Thời gian lưu trong buồng, nhiệt độ ra, số lần qua máy |
| Rotor–stator | Giữ **tốc độ đỉnh rotor** (tip speed) hoặc **công suất riêng** (W/kg); tính thêm thời gian lưu | Công suất riêng thường **giảm** khi scale ⇒ giọt to hơn nếu giữ tip speed; kiểm số vòng tuần hoàn |
| Siêu âm | Giữ **công suất riêng** (W/mL) và thời gian; ở quy mô lớn dùng flow cell nhiều đầu dò | Phân bố cavitation không đều, nhiệt |
| Khuấy cánh (pre-emulsion) | Giữ P/V hoặc số Reynolds | Cuốn khí, vùng chết |

### 6.2 Danh mục kiểm tra khi scale-up [G]
1. Đo lại **d₃₂, d₄₃, d₉₀** và PDI ở mẻ lab, pilot, sản xuất; chấp nhận khi trong dung sai đã xác định trước.
2. **Nhiệt độ** (ra khỏi van; thời gian giữ nóng; làm lạnh sau).
3. **Trình tự hydrat hóa** chất nhũ hóa: ở quy mô lớn, thời gian hòa tan dài hơn; protein bị biến tính ở điểm nóng.
4. **Cuốn khí** (foam): đặc biệt với protein, saponin. Ảnh hưởng độ đục, đo kích thước.
5. **Thời gian chờ** giữa pha chuẩn bị và đồng hóa; ripening đã xảy ra nếu chờ lâu.
6. **Vật liệu tiếp xúc** (đầu dò titan, van): mài mòn, nhiễm kim loại, xúc tác oxy hóa lipid.
7. **CIP** và tồn dư chất nhũ hóa lô trước.
8. **Độ lặp lại**: ít nhất 3 mẻ liên tiếp ở quy mô mới.

### 6.3 Giới hạn kiến thức
Các quy tắc scale ở trên là nguyên lý chung từ chuyên khảo; chưa có nguồn cụ thể đã kiểm cho từng thiết bị trong phiên này. Với dự án thật, nên lấy số liệu từ nhà cung cấp thiết bị (hãng đồng hóa, rotor–stator) và làm thử nghiệm pilot.

---

## 7. Ví dụ phân tích nhanh (bài tập)

**Bài toán:** nhũ tương O/W 15% dầu hướng dương, 1% protein đậu Hà Lan; HPH 50 MPa 2 lần ⇒ d₃₂ ≈ 3 µm; tăng lên 100 MPa chỉ còn 2,8 µm.

**Phân tích:**
- Quan sát: gần như không nhỏ thêm ⇒ nghi ngờ chế độ giới hạn chất nhũ hóa (hợp giọt tái diễn). **[G]**
- Kiểm tra: tính nồng độ protein tối thiểu. φ = 0,15, d₃₂ = 1 µm ⇒ A = 9×10⁵ m²/m³; Γ = 2 mg/m² ⇒ 1,8 g/L ≈ 0,18%. Protein 1% là dư rất nhiều nếu protein **hòa tan và hoạt động**.
- Giả thuyết thay thế: protein đậu Hà Lan có độ tan thấp ở pH gần pI hoặc sau xử lý nhiệt ⇒ phần hoạt động thực sự ít hơn nhiều. **[G]**
- Cách kiểm chứng: đo độ tan protein theo pH (bước ly tâm + đo protein bề mặt), tăng pH/dùng siêu âm hoặc thủy phân nhẹ; đối chứng: dùng Tween 80 0,2% ở cùng điều kiện HPH. Nếu Tween cho giọt < 1 µm ⇒ nguyên nhân là chất nhũ hóa/độ tan, không phải máy.

Ví dụ về tăng cường protein đậu bằng siêu âm và dịch chuyển pH: **[N: @yang2021, PubMed 34371279]** (protein đậu Hà Lan xử lý pH-shifting + siêu âm trong kem sục khí).
