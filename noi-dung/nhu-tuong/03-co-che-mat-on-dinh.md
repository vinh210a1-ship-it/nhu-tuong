---
title: "Cơ chế mất ổn định nhũ tương (vật lý và hóa học)"
slug: mat-on-dinh
khu: nhu-tuong
thu_tu: 3
loai: bai
hien_tren_web: true
level: 2-co-che
tags: [kem-hoa, Stokes, keo-tu, DLVO, can-kiet, hop-giot, Ostwald, dao-pha, oxy-hoa-lipid]
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/03-co-che-mat-on-dinh.md
---
# 03. Cơ chế mất ổn định nhũ tương

> **Kết luận trước.** Có **6 con đường vật lý** (kem hóa/lắng, keo tụ, hợp giọt, hợp giọt một phần, Ostwald ripening, đảo pha) và **vài con đường hóa học/sinh học** (oxy hóa lipid, thủy phân, vi sinh). Chúng **nối tiếp nhau**: keo tụ đưa giọt lại gần ⇒ hợp giọt; giọt lớn lên ⇒ kem hóa nhanh hơn. Vì vậy khi phân tích sản phẩm hỏng, hãy xác định **mắt xích đầu tiên** chứ không chỉ triệu chứng cuối (tách lớp). Cách chẩn đoán từng mắt xích bằng phép đo nằm ở file 06; bảng sự cố ở file 08.

Độ tin cậy: **[N]** có nguồn kiểm · **[K]** sách giáo khoa · **[T]** tính minh họa · **[G]** giả thuyết.

Các bài tổng quan đã kiểm cho phần này: tổng quan cơ chế mất ổn định nanoemulsion (kem hóa/lắng, keo tụ, hợp giọt, Ostwald ripening, oxy hóa lipid) **[N: @karthik2017, @liu2019]**; đánh giá kỹ thuật đo độ ổn định **[N: @mcclements2007]**.

---

## 0. Bản đồ các con đường

| # | Hiện tượng | Giọt có đổi kích thước? | Thuận nghịch? | Mắt xích điển hình |
|---|---|---|---|---|
| 1 | Kem hóa / lắng (gravitational separation) | Không | Thuận nghịch khi lắc (nếu giọt vẫn riêng) | Chênh lệch tỷ trọng + giọt lớn + nhớt thấp |
| 2 | Keo tụ (flocculation) | Không | Thường thuận nghịch (cụm mềm) | Mất lực đẩy: pH ~ pI, ion mạnh, polymer cạn kiệt |
| 3 | Hợp giọt (coalescence) | Có, tăng | **Không** | Màng hấp phụ mỏng/không đủ, cắt mạnh |
| 4 | Hợp giọt một phần (partial coalescence) | Giọt dính nhưng giữ hình | Không | Có tinh thể mỡ đâm xuyên (kem lạnh, kem đánh bông) |
| 5 | Ostwald ripening | Có, tăng dần (giọt nhỏ biến mất) | Không | Dầu tan được trong pha nước |
| 6 | Đảo pha (phase inversion) | Hệ đổi loại | Không | φ cao, nhiệt độ, chất nhũ hóa HLB sai |
| 7 | Oxy hóa lipid | Không (hóa học) | Không | Kim loại, ánh sáng, ôxy, bề mặt giọt |

---

## 1. Kem hóa và lắng (Creaming / sedimentation)

### Bản chất và cơ chế
Giọt dầu (tỷ trọng ~910–930 kg/m³) nhẹ hơn nước (~1000), nên nổi lên (kem hóa). Giọt tách ra theo vận tốc Stokes:

$$v_{Stokes}=\frac{2\,r^2\,(\rho_c-\rho_d)\,g}{9\,\eta_c}$$

(dấu dương = nổi lên). **[N: @mcclements2016 tr.294]**

**[T]** Tính cho Δρ = 80 kg/m³ (dầu thực vật trong nước), η_c = 1 mPa·s, 25 °C:

| Đường kính d | Vận tốc nổi | Quãng đường mỗi ngày |
|---|---|---|
| 0,1 µm | 4,4×10⁻¹⁰ m/s | 0,04 mm |
| 0,5 µm | 1,1×10⁻⁸ m/s | 0,94 mm |
| 1 µm | 4,4×10⁻⁸ m/s | 3,8 mm |
| 2 µm | 1,7×10⁻⁷ m/s | 15 mm |
| 5 µm | 1,1×10⁻⁶ m/s | 94 mm |
| 10 µm | 4,4×10⁻⁶ m/s | 377 mm |
| 20 µm | 1,7×10⁻⁵ m/s | 1,5 m |

Hai nhận xét quan trọng:
1. **v ∝ d²**: giọt 10 µm nổi nhanh gấp 100 lần giọt 1 µm. Kem hóa bị chi phối bởi **đuôi giọt lớn** ⇒ dùng d₉₀/d₄₃, không chỉ trung bình. **[T]**
2. **v ∝ 1/η_c**: tăng độ nhớt pha liên tục 10 lần ⇒ nổi chậm 10 lần. Ở d = 1 µm và η_c = 10 mPa·s, v ≈ 0,38 mm/ngày; ở 100 mPa·s ≈ 0,04 mm/ngày **[T]**.

**Hiệu ứng Brownian:** so với năng lượng nhiệt kT, năng lượng trọng trường của giọt rất nhỏ khi d ≲ 1 µm (≈ 0,05 kT với d = 1 µm), nên chuyển động Brown chống phân lớp một phần; nhưng Stokes dịch chuyển vẫn tích lũy theo ngày/tuần. Kem hóa giọt sub-micromet thường chậm hơn rất nhiều và thực tế bị cản bởi tương tác giọt. **[T]**

**Hiệu ứng nồng độ (hindered creaming):** ở φ cao, giọt cản nhau ⇒ vận tốc giảm; mô hình Richardson–Zaki $v=v_0(1-\varphi)^{k}$, k ≈ 4,65 cho cầu cứng. **[K]** Ở φ > ~0,5–0,6 hệ gần như không kem hóa.

**Keo tụ làm kem hóa nhanh hơn** (cụm giọt có kích thước hiệu dụng lớn) ⇒ kem hóa nhanh thường là dấu hiệu keo tụ, không chỉ giọt to. **[K]**

### Cách giảm kem hóa (theo thứ tự hiệu quả điển hình)
1. **Giảm kích thước giọt** (HPH, thêm số lần qua, chất nhũ hóa phù hợp).
2. **Tăng độ nhớt pha liên tục** (xanthan, guar, gellan, CMC, tinh bột biến tính). Đặc biệt gum tạo **ứng suất giới hạn (yield stress)** giữ giọt đứng yên (độ nhớt thấp cắt/độ đàn hồi ở tĩnh).
3. **Giảm chênh lệch tỷ trọng**: thêm **chất làm nặng** (weighting agent) vào pha dầu (SAIB, ester gum) để làm Δρ ≈ 0, thường dùng cho đồ uống nhũ hóa tinh dầu cam. **[N: @liu2019 liệt kê weighting agents]**
4. **Gel hóa pha liên tục** hoặc dùng giọt đặc (kem lạnh), tạo mạng giọt.

---

## 2. Keo tụ (flocculation)

### Bản chất
Giọt dính vào nhau thành cụm nhưng **không hợp lại** (màng vẫn nguyên). Xảy ra khi tương tác hút thắng đẩy ở khoảng cách gần.

### Cơ chế (khung DLVO mở rộng) [K: @israelachvili2011]

Thế tương tác tổng: $W(h)=W_{vdW}+W_{elec}+W_{steric}+W_{depl}+\dots$

- **Van der Waals** luôn hút (hằng số Hamaker cỡ 10⁻²¹–10⁻²⁰ J với dầu/nước).
- **Tĩnh điện** đẩy; tầm tác dụng là độ dài Debye:

$$\kappa^{-1}\approx\frac{0{,}304}{\sqrt{I}}\ \text{nm}\quad(I\text{ mol/L, chất điện ly 1:1, 25 °C, nước})$$

**[T]**
| Lực ion I | κ⁻¹ |
|---|---|
| 1 mM | 9,6 nm |
| 10 mM | 3,0 nm |
| 100 mM | 0,96 nm |
| 150 mM (≈ nước muối sinh lý/đường tiêu hóa) | 0,78 nm |

⇒ Ở lực ion thực phẩm điển hình (nước sốt, muối, dạ dày), đẩy tĩnh điện bị **che chắn** gần như hoàn toàn. Điện tích chỉ cứu được hệ có ít muối.
- **Lập thể**: polymer/protein/chuỗi PEO nhô ra đẩy nhau khi bị nén (entropy + áp suất thẩm thấu) ⇒ bền với muối. Mất khi polymer **mất tan** (nhiệt, pH, ion) hoặc bị thay thế.
- **Cạn kiệt (depletion)** [K: @asakura1954]: polymer/micelle **tự do** trong pha liên tục không thể xâm nhập khe giữa hai giọt ⇒ chênh áp suất thẩm thấu ép hai giọt lại. Xảy ra khi nồng độ polymer tự do vượt ngưỡng tới hạn (thấp hơn nhiều khi dùng polymer phân tử lớn). Ví dụ phổ biến: **thêm xanthan/guar/alginate vào nhũ tương protein** gây kem hóa nhanh hơn dù độ nhớt tăng, vì cạn kiệt. **[K; G: ngưỡng tùy hệ]**
- **Bắc cầu (bridging):** một polymer hấp phụ lên hai giọt cùng lúc, thường khi bề mặt giọt phủ chưa đủ để che kín. **[N: @mcclements2016 tr.323]**
  - Ngưỡng độ phủ gây bắc cầu: dưới khoảng 50–70%. **[K]**

### Điều kiện hay gặp trong thực phẩm
| Điều kiện | Hiệu ứng | Cách giảm |
|---|---|---|
| pH ≈ pI protein | Điện tích ≈ 0 ⇒ keo tụ | Đổi pH xa pI ≥ 1–1,5 đơn vị; dùng protein-polysaccharide; dùng chất nhũ hóa lập thể |
| Muối/Ca²⁺ cao | Che chắn điện tích; Ca²⁺ cầu nối | Dùng lập thể; chelate (EDTA/citrate); giảm ion |
| Polymer tự do dư | Cạn kiệt | Giảm polymer tự do (chọn chất nhũ hóa vừa phải), đổi kích cỡ polymer |
| Nhiệt (protein biến tính) | Protein lộ vùng kỵ nước ⇒ cầu nối giữa giọt | Làm nóng ở pH và lực ion kiểm soát |
| Đông–rã đông | Tinh thể nước đẩy giọt lại gần | Chất bảo vệ lạnh (đường, polyol), polymer |

**Ví dụ có nguồn:** tổng quan về giảm tốc độ tiêu hóa khi các giọt kết tụ trong dạ dày (caseinate kết tụ làm chậm tiêu hóa hơn Tween 80) **[N: @mcclements2017]**.

---

## 3. Hợp giọt (coalescence)

### Bản chất
Hai giọt hòa thành một, màng ngăn vỡ. **Không thuận nghịch.**

### Cơ chế [K: @mcclements2016, @walstra2003]
1. Hai giọt lại gần (do kem hóa, keo tụ, dòng cắt).
2. Màng nước giữa chúng mỏng dần (thoát màng, film drainage).
3. Nếu màng đạt **độ dày tới hạn** (cỡ vài nm) hoặc xuất hiện nhiễu động bề mặt ⇒ vỡ lỗ ⇒ hợp.
Tốc độ hợp giọt phụ thuộc vào:
- **Lớp hấp phụ** (độ dày, điện tích, **độ nhớt/đàn hồi bề mặt**). Protein tạo màng nhớt–đàn hồi chống hợp giọt tốt; phân tử nhỏ chống kém hơn nếu lớp chưa dày.
- **Hiệu ứng Gibbs–Marangoni** (file 01, mục 3.3).
- **Lực cắt/áp suất nén** (siêu âm, ly tâm, đông lạnh).
- **Độ cong** (giọt càng nhỏ, áp suất Laplace càng cao ⇒ năng lượng phản ứng thay đổi).

### Phân biệt hợp giọt và keo tụ (rất quan trọng khi chẩn đoán)
| Dấu hiệu | Keo tụ | Hợp giọt |
|---|---|---|
| Phân bố kích thước (ban đầu) | Giọt riêng lẻ vẫn nhỏ nếu phân tán lại | Lệch sang phải, giọt lớn mới xuất hiện |
| Phân tán lại bằng pha loãng/siêu âm nhẹ/chất tách cụm (SDS) | Trở về kích thước ban đầu | Không đổi |
| Hiển vi | Cụm nhìn thấy giọt | Giọt tròn lớn hơn |

Đây là phép thử phân biệt kinh điển **[K; @mcclements2007 mô tả phân bố kích thước/khả năng tái phân tán là kỹ thuật chuẩn]**.

### Cách giảm hợp giọt
1. Đủ chất nhũ hóa (xem ước lượng ở file 01, mục 2.2).
2. Chất nhũ hóa tạo **màng nhớt–đàn hồi**: protein, protein–polysaccharide, chất nhũ hóa polymeric; lớp đa tầng (LbL) **[N: @mcclements2017 đề cập lớp tĩnh điện đa tầng alginate/lactoferrin]**.
3. **Hạt Pickering** (rào cản cơ học, hấp phụ gần như không thuận nghịch): xem file 05 **[N: @li2022a, @schroen2024]**.
4. Kiểm soát cắt/áp suất/nhiệt trong chế biến.

---

## 4. Hợp giọt một phần (partial coalescence)

### Bản chất
Giọt chứa **mạng tinh thể mỡ** đâm xuyên qua màng, "móc" vào giọt kề cạnh nhưng hình giọt không hồi phục vì tinh thể cản; tạo cụm giọt dính (không hợp thành cầu to). Quan trọng trong **kem đánh bông, kem lạnh, bơ**; là hiện tượng **mong muốn có kiểm soát**.

### Cơ chế và yếu tố
- Cần **chất béo bán rắn** (SFC trung gian). Nghiên cứu hợp giọt do cắt với kem tái tổ hợp dùng AMF, dầu cọ, dầu hạt cọ ở 15, 20, 25 °C: hợp giọt một phần xảy ra **nhanh nhất ở 20 °C**; ở 25 °C với SFC gần như bằng nhau, ba loại mỡ cho hành vi khác nhau rõ ⇒ **không chỉ SFC mà cả vi cấu trúc tinh thể** quyết định. **[N: @moens2018]**
- Protein và chất nhũ hóa phân tử nhỏ cạnh tranh trên bề mặt: GMS (glyceryl monostearate) làm tăng mức hợp giọt một phần của hệ mỡ sữa khan nhưng ít ảnh hưởng với dầu dừa. **[N: @cheng2019]**
- Có các phương pháp định lượng (độ đục, pha loãng thuốc nhuộm, calorimetry, kích thước hạt mỡ) với ưu–nhược khác nhau; tương quan giữa các phương pháp khác nhau ở mức độ khác nhau. **[N: @petrut2015]**

### Ứng dụng
- Kem tươi: đánh bông cần hợp giọt một phần vừa phải để bắt bọt; quá nhiều ⇒ "bơ hóa".
- Kem lạnh: hợp giọt một phần khi đông–khuấy tạo mạng béo giữ bọt khí, ảnh hưởng độ cứng và tốc độ chảy khi tan. **[N: @yang2021 – chất thay thế sữa bột gầy bằng protein đậu Hà Lan xử lý pH+siêu âm]**

---

## 5. Ostwald ripening

### Bản chất
Giọt nhỏ **tan dần** trong pha liên tục, dầu khuếch tán qua nước và lắng vào giọt lớn. Hệ tiến tới ít giọt, to hơn. **Chỉ xảy ra khi dầu tan được trong pha liên tục** (dù rất ít).

### Cơ chế định lượng (LSW) [K: @lifshitz1961, @kabalnov1992; N: @mcclements2016 tr.360]
Độ tan hiệu dụng quanh giọt nhỏ cao hơn giọt lớn (hiệu ứng Kelvin/Laplace) ⇒ dòng khuếch tán từ giọt nhỏ sang lớn. Trong chế độ giới hạn bởi khuếch tán:

$$\frac{d\bar r^3}{dt}=\omega=\frac{8}{9}\,\frac{\gamma\,c_\infty\,V_m\,D}{R\,T}$$

$c_\infty$: độ tan khối của dầu trong pha liên tục; $V_m$: thể tích mol dầu; D: hệ số khuếch tán dầu trong nước.
- **$\bar r^3$ tăng tuyến tính theo thời gian** (kiểm chứng: vẽ $d_{43}^3$ theo t; đường thẳng ⇒ ripening; **kem hóa/hợp giọt không cho đường thẳng**).
- ω tỷ lệ với **độ tan $c_\infty$**: dầu có độ tan nước đáng kể (tinh dầu, hương, TAG mạch ngắn) ripening mạnh; TAG mạch dài (dầu hướng dương, dầu bắp) gần như không ripening. **[N: @park2025 – dầu như dầu hương, tinh dầu, TAG nhỏ ripening do độ tan nước đáng kể]**
- **So với thực nghiệm:** ở nhũ tương O/W không có micelle, ripening đo được nhanh hơn dự đoán LSW khoảng 2–3 lần; khi có micelle còn nhanh hơn nhiều. Nếu lớp bề mặt cản khuếch tán thì phải dùng phiên bản có hiệu chỉnh lớp bề mặt. **[N: @mcclements2016 tr.360]**
- **Chất nhũ hóa ảnh hưởng thế nào?** Nghiên cứu hệ model cho thấy loại chất hoạt động bề mặt phân tử nhỏ và thành phần pha dầu đều làm đổi tốc độ ripening, trong khi thay đổi thành phần pha dầu **không đổi sức căng bề mặt** dầu–nước **[N: @park2025]**. Cơ chế chi tiết (ví dụ vai trò của lớp màng dày/rắn cản khuếch tán) là **[G]**, cần nguồn riêng trước khi khẳng định trên web.

### Chất ức chế ripening (ripening inhibitor)
Nguyên tắc (Kabalnov–Webster) **[K: @kabalnov1992; N: @mcclements2016 tr.4]**: thêm vào giọt một thành phần dầu **gần như không tan nước**. Khi giọt nhỏ mất dầu tan, tỷ lệ thành phần không tan tăng, entropy trộn tạo chênh áp suất thẩm thấu **cân bằng với áp suất Laplace** ⇒ ripening dừng. Nhũ tương "ổn định theo thành phần". Sách McClements cũng nêu chất ức chế ripening phải là chất rất kỵ nước, và cho ví dụ dầu MCT trộn vitamin E acetate với Tween 80. **[N: @mcclements2016 tr.4, tr.280]**

**Bằng chứng có số liệu [N: @chang2012]:** nanoemulsion tinh dầu thyme (pH 3.5) bị ripening mạnh do độ tan nước tương đối cao của tinh dầu; ripening bị ức chế bằng cách trộn với chất không tan trước khi đồng hóa: **≥60 wt% dầu bắp hoặc ≥50 wt% MCT trong pha lipid**. Tăng nồng độ chất ức chế còn ảnh hưởng hoạt tính kháng khuẩn.

**Bằng chứng khác [N: @park2025]:** hệ model decane + chất không ion (polyoxyethylene (100) stearyl ether hoặc poloxamer P407); thêm alkane mạch dài hơn (tetradecane, hexadecane, octadecane) giảm ripening nhờ hiệu ứng thành phần (compositional ripening) dù **không đổi sức căng bề mặt**, nhưng đổi cả kích thước giọt ban đầu.

**Ứng dụng:** nanoemulsion đồ uống chứa hương cam, bạc hà; tinh dầu; ester của vitamin; vitamin E acetate được coi như chất ức chế hữu ích do độ tan nước thấp **[K; N: @mcclements2016 tr.280]**.

---

## 6. Đảo pha (phase inversion)

### Bản chất
O/W ⇄ W/O. Có thể không mong muốn (nhũ tương mỡ sữa bị khuấy quá mạnh ⇒ bơ) hoặc **được dùng có chủ ý** (chế tạo bơ bằng đánh sữa; PIT/EIP cho nanoemulsion).

### Cơ chế
- **Catastrophic (PIC/EIP):** tăng φ phân tán quá một ngưỡng (hay nồng độ chất nhũ hóa thay đổi) ⇒ pha liên tục đổi.
- **Transitional (PIT):** đổi nhiệt độ/độ mặn làm HLB hiệu dụng đổi ⇒ đảo.
**[N: @perazzo2015, @gupta2016]**

### Khi nào xảy ra ngoài ý muốn
φ > ~0,7–0,8; chất nhũ hóa HLB lệch ưu thế; nhiệt độ gần PIT của chất không ion; rót pha ngoài quá chậm; muối tăng đột ngột. **[K]**

---

## 7. Mất ổn định hóa học và sinh học

### 7.1 Oxy hóa lipid trong nhũ tương
- Phản ứng lan truyền gốc tự do ở **bề mặt giọt** nơi dầu tiếp xúc nước, ion kim loại (Fe²⁺, Cu²⁺), ôxy hòa tan và các tác nhân khởi phát. **[K]**
- **Điện tích bề mặt giọt** quyết định kim loại có hút đến bề mặt hay không: bề mặt tích điện âm (SDS, caseinate trên pI) thu hút Fe²⁺/Fe³⁺ ⇒ oxy hóa nhanh; bề mặt dương (chitosan, protein dưới pI) đẩy kim loại ⇒ chậm. **[K: nguyên tắc kinh điển của nhóm McClements/Decker; cần nguồn cụ thể khi trích]**
- **Giọt nhỏ ⇒ diện tích lớn ⇒ nhiều vị trí tiếp xúc**, nhưng không phải lúc nào cũng nhanh hơn (phụ thuộc chất nhũ hóa, chất chống oxy hóa). Tránh kết luận "nhỏ hơn thì oxy hóa nhanh hơn" nếu chưa có đối chứng. **[G]**
- Chiến lược: EDTA/citrate (chelate), chất chống oxy hóa tan trong dầu/nước đặt đúng vị trí (polar paradox), lớp đa tầng tích điện dương, bao bì chắn ôxy, đồng hóa không khí/N₂.
- Đo: peroxide value (giai đoạn đầu), TBARS/p-anisidine (sản phẩm thứ cấp), hexanal bằng headspace GC. **[K]**
- **Có tổng quan về hệ nanoemulsion thực phẩm gồm chất chống oxy hóa và chelate trong danh mục chất ổn định:** **[N: @liu2019]**

### 7.2 Thủy phân, phản ứng Maillard, protein biến tính
- Thủy phân triglyceride (axit béo tự do, ở nhiệt độ cao/pH thấp) ảnh hưởng chất nhũ hóa và mùi.
- Maillard giữa protein và đường khử trên bề mặt giọt có thể **tăng ổn định** (liên hợp) hoặc **giảm** khi nâu hóa quá mức. **[K]**

### 7.3 Vi sinh
Nhũ tương pH trung tính, hoạt độ nước cao là môi trường tốt cho vi sinh; giọt dầu là nguồn carbon; nhũ tương W/O lại có phân bố nước đặc biệt (giọt nước cô lập, giới hạn vi sinh theo kích thước giọt). Cần thiết kế bảo quản riêng. **[K]**

---

## 8. Ảnh hưởng của các yếu tố môi trường (tóm tắt thực hành)

| Yếu tố | Cơ chế chính | Tổng quan có bằng chứng |
|---|---|---|
| pH | Đổi điện tích protein/phospholipid; gần pI ⇒ keo tụ | **[N: @karthik2017 liệt kê pH, lực ion, nhiệt, kích thước giọt, điện tích hạt]** |
| Lực ion/muối | Che chắn điện tích; Ca²⁺ cầu nối | **[N: @karthik2017]** |
| Nhiệt | Biến tính protein, mất nước PEO ⇒ giảm lập thể; kết tinh mỡ | **[N: @karthik2017; @moens2018]** |
| Đông lạnh–rã đông | Tinh thể nước + mỡ ⇒ hợp giọt | [K] |
| Cắt/ly tâm/vận chuyển | Ép giọt, nhũ tương kép bị rách | **[N: @muschiolik2017 về nhũ tương kép]** |

---

## 9. Thời gian sống của nhũ tương: dự đoán thế nào?

Chỉ có thể kết luận về độ ổn định khi có **đặc trưng theo thời gian** (kích thước, điện tích, kem hóa, vi cấu trúc) dưới điều kiện bảo quản thực và **thử thách tăng tốc** có cơ sở: xem file 06 (mục "chương trình thử độ ổn định"). Thử thách tăng tốc có thể **gây hiện tượng khác** (ví dụ ly tâm gây nén giọt, nhiệt độ cao gây biến tính protein); vì vậy chỉ xem là sàng lọc, không thay thế thử nghiệm bảo quản thực. **[K; N: @mcclements2007 đề xuất quy trình]**
