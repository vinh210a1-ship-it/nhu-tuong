---
title: "Nền tảng vật lý–hóa học của chất hoạt động bề mặt (CHĐBM)"
slug: nen-tang-vat-ly-hoa-be-mat
khu: chat-nhu-hoa
thu_tu: 1
loai: bai
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-chat-hoat-dong-be-mat/01-nen-tang-vat-ly-hoa-be-mat.md
---
# 01. Nền tảng vật lý–hóa học của chất hoạt động bề mặt (CHĐBM)

> Luồng "chất hoạt động bề mặt / chất nhũ hóa" của dự án web kiến thức nhũ tương.
> Soạn ngày 2026-11-01. Xem chú giải nhãn bằng chứng ở `00-README-muc-luc.md`.
>
> **Nhãn:** [N] = có nguồn, đã đọc tóm tắt/toàn văn trong phiên này (số nguồn trong `06-nguon-tai-lieu.md`);
> [K] = kiến thức giáo khoa, tôi chưa đối chiếu nguồn trong phiên, cần kiểm trước khi đăng;
> [G] = suy luận của tôi.

---

## Kết luận trước

1. Chất nhũ hóa làm **ba việc** theo thứ tự thời gian: (i) hấp phụ nhanh lên mặt phân cách trong lúc đồng hóa, (ii) hạ sức căng bề mặt γ để giọt dễ vỡ nhỏ, (iii) tạo lớp áo đẩy nhau (tĩnh điện/lập thể) hoặc lớp màng nhớt–đàn hồi để giọt không hợp nhất sau đó. [N: @gumus2017 luận án, ch.1]
2. **HLB** là con số thực dụng để chọn loại nhũ tương (O/W hay W/O) và ghép phối, nhưng **không đủ** để dự đoán hành vi thật. Ví dụ trong kem, khả năng gây mất ổn định mỡ của chất nhũ hóa không giải thích hết bằng HLB mà tương ứng với sức căng bề mặt mà nó tạo ra. [N: @goff1989]
3. **Tham số đóng gói (CPP)** mô tả hình dạng phân tử → cấu trúc tự lắp ghép (mixen cầu, trụ, lớp đôi, mixen đảo). Rất đẹp để dạy, nhưng tác giả Steven Abbott cảnh báo nó chủ yếu hợp với chất hoạt động bề mặt nguyên chất trong nước, ít liên quan khi có dầu và nhũ tương. [N: @abbott]
4. Với web: nên dạy HLB và CPP như **công cụ tư duy có giới hạn**, kèm các ví dụ phản chứng.

---

## 1.1 Sức căng bề mặt, áp suất bề mặt, và vì sao giọt nhỏ cần nhiều năng lượng

### Hiện tượng → nguyên nhân
- Phân tử ở mặt phân cách dầu–nước có năng lượng cao hơn ở trong lòng pha, vì tiếp xúc "sai bạn". Năng lượng trên một đơn vị diện tích chính là **sức căng liên diện γ** (mN/m). [K]
- Muốn tạo nhũ tương phải tăng diện tích bề mặt rất lớn. Chia 1 mL dầu thành giọt d = 1 µm cho diện tích ≈ 6 m² (diện tích = 6V/d). [K: tính từ hình học]

### Áp suất Laplace và kích thước giọt
- Giọt cầu bán kính r có chênh áp Laplace ΔP = 2γ/r. Giọt càng nhỏ, ΔP càng lớn, càng khó vỡ thêm. [K]
- Luận án Gumus (UMass, hướng dẫn McClements) nêu rõ: **γ thấp hơn → giọt nhỏ hơn ở cùng năng lượng đồng hóa**. [N]

### Áp suất bề mặt Π
- Π = γ₀ − γ, trong đó γ₀ là sức căng của mặt phân cách sạch. Π tăng từ 0 đến Π_sat khi bề mặt bão hòa chất hoạt động bề mặt. Π_sat cao thường tương ứng giọt mịn hơn nếu chất nhũ hóa đủ nhiều và hấp phụ đủ nhanh. [N: @gumus2017]
- **Độ hoạt động bề mặt** SA = 1/C₅₀%, với C₅₀% là nồng độ cho một nửa Π_sat. Giá trị cao nghĩa là ái lực nhiệt động cao với mặt phân cách. [N: @gumus2017]

### Phương trình hấp phụ Gibbs [K]
Γ = −(1/RT) · (dγ / d ln C) (cho chất không ion ở dung dịch loãng; chất ion cần hệ số 2 khi không có điện ly dư).
- Γ = lượng dư bề mặt (mol/m²). Đo độ dốc đường γ theo ln C là cách tính Γ.
- Ở trên CMC (nồng độ mixen tới hạn) γ gần như phẳng vì chất thêm vào chui vào mixen.

---

## 1.2 Động học: tại sao "mạnh trên giấy" chưa chắc thắng trong máy đồng hóa

Tensiometer thông thường đo ở trạng thái cân bằng, quá chậm so với đồng hóa (mili-giây). Luận án Gumus nhấn mạnh điều này. [N]

Tiến trình của một phân tử chất nhũ hóa (mô hình giáo khoa [K]):
1. Khuếch tán/đối lưu đến sát bề mặt (nhanh nhờ cường độ rối trong đồng hóa).
2. Hấp phụ lên bề mặt (rào năng lượng nhỏ với phân tử nhỏ, lớn hơn với protein cầu cần "mở cấu trúc").
3. Sắp xếp lại (protein: duỗi, tăng tương tác bên cạnh để tạo mạng).

Hệ quả [G: dựa trên K]: phân tử nhỏ (Tween, lecithin, MDG) thắng về tốc độ → tạo giọt mịn nhanh; protein chậm hơn nhưng tạo màng nhớt–đàn hồi bền. Đây là lý do nhiều công thức dùng **cả hai**, và là gốc rễ của chủ đề cạnh tranh hấp phụ (file 03).

### Công thức kích thước giọt tối thiểu (khi thiếu chất nhũ hóa)
d_min ∝ Γ·φ / c_S (φ: phần thể tích dầu; c_S: nồng độ chất nhũ hóa; Γ: tải bề mặt). Vẽ d₃₂ theo 1/C ở nồng độ thấp cho đường thẳng qua gốc có độ dốc 6Γφ, nên Γ = độ dốc/(6φ). [N: @gumus2017, ch.1]

Chú ý khi dạy: đây là **giới hạn do thiếu chất nhũ hóa** (emulsifier-limited), khác với **giới hạn do năng lượng** (energy-limited).

### Tải bề mặt Γ: thứ tự độ lớn
- Thứ tự theo Gumus: saponin nhỏ < protein cầu (whey) < protein mềm dẻo (caseinate) < polysaccharide (gum arabic). [N]
- Whey ≈ 1 mg/m², gum arabic ≈ 25 mg/m² (số theo luận án). [N]
- Con số saponin (0,001 mg/m²) mà công cụ trích ra từ bản đọc **có vẻ bất thường**; **cần mở bản gốc để xác nhận trước khi dùng** vì có thể đã mất dấu thập phân hoặc bị đổi đơn vị khi trích. `[cảnh báo]`
- Số liệu thực nghiệm khác: tải bề mặt protein trong nhũ tương dầu hướng dương 10 wt%: WPI ≈ 1,4 mg/m², pea PPI ≈ 2,5 mg/m². [N: @hinderink2021]

---

## 1.3 CMC, điểm Krafft, điểm đục (cloud point)

| Khái niệm | Ý nghĩa | Gợi ý dùng | Nhãn |
|---|---|---|---|
| CMC | Nồng độ từ đó hình thành mixen; bão hòa bề mặt | Tính "lượng tối thiểu" và vì sao thêm quá không làm giảm γ thêm | [K] |
| Điểm Krafft | Dưới nhiệt độ này chất hoạt động bề mặt ion (SDS, SSL...) kết tinh, không thành mixen | Giải thích SSL/ DATEM cần "đánh nóng" hoặc phân tán ở nhiệt độ nhất định | [K] |
| Điểm đục (cloud point) | Chất không ion polyethoxy (Tween...) tách pha khi nóng lên vì liên kết hydro với nước yếu đi | Giải thích Tween "kém" khi tiệt trùng ở nhiệt độ rất cao/ nồng độ muối cao | [K] |
| Nhiệt độ đảo pha PIT | Chất polyethoxy đổi từ ưa nước sang ưa dầu khi nóng → nhũ tương đảo O/W→W/O | Dạy nhũ tương nano chế tạo bằng PIT | [K] |

---

## 1.4 HLB — cân bằng ưa nước–ưa dầu

### Định nghĩa và lịch sử
- Griffin đề xuất HLB năm 1949 và 1954 (thang 0–20, cho chất không ion, dựa trên tỉ lệ khối lượng phần ưa nước/toàn phân tử). Davies đề xuất cách khác năm 1957 dựa trên số nhóm hóa học. [N: Wikipedia — chưa kiểm nguyên bản Griffin]
- Công thức Griffin (1954) cho chất không ion [K]:
  - Este polyol/ axit béo: **HLB = 20 × (1 − S/A)**, S = chỉ số xà phòng hóa của este, A = chỉ số axit của axit béo.
  - Chất polyethoxy (không có este polyol): **HLB = E/5**, E = % khối lượng phần polyoxyethylene.
  - Chung: **HLB = 20 × M_ưa nước / M_phân tử**.
- Davies [N: @wikipedia, một phần]: nhóm ưa dầu CH, CH₂, CH₃, =CH mỗi nhóm −0,475; ví dụ nhóm sulfat muối 38,6; OH tự do 1,9. Công thức đầy đủ [K]: **HLB = 7 + Σ(số nhóm ưa nước) − Σ(số nhóm ưa dầu)**.

### Thang ứng dụng (kinh điển) [K: kiểm lại bằng sách của Griffin hoặc Becher]
| Dải HLB | Vai trò thường được nêu |
|---|---|
| 1–3 | chống tạo bọt |
| 3–6 | nhũ hóa nước-trong-dầu (W/O) |
| 7–9 | tác nhân thấm ướt |
| 8–16 | nhũ hóa dầu-trong-nước (O/W) |
| 13–16 | chất tẩy |
| 15–18 | chất hòa tan (solubilizer) |

### HLB của hỗn hợp
Với hai chất A và B có phần khối lượng w_A, w_B: **HLB_mix = w_A·HLB_A + w_B·HLB_B** (cộng tuyến tính, khối lượng-trung bình). [K] Đây là cơ sở của công cụ "pha trộn Tween–Span" trong bào chế và thực phẩm. Một nghiên cứu về este sucrose cho thấy trộn sucrose tallowate mono/di tuyến tính theo HLB trong dải 10–16. [N: @gupta1983]

### Bảng HLB tham khảo — **số liệu nền, chưa kiểm**
| Chất | HLB thường nêu | Nguồn trong phiên | Nhãn |
|---|---|---|---|
| Lecithin thô/đậu nành | ~2–8 tùy phân đoạn; kém khi dùng riêng | Gumus: "HLB 2–8 ổn định kém riêng lẻ" | [N] |
| Este sucrose | rất rộng, 1 đến 16+ tùy mức este hóa | Gupta 1983; Cholakova 2024; Zeng 2023 (S170 HLB 1); Zhu 2021 (mono-este 10,3–15,7) | [N] |
| Glyceryl monostearate/monooleate | ~3–4 | — | [K] |
| Span 80 (sorbitan monooleate) | ~4,3 | — | [K] |
| Tween 80 | ~15 | — | [K] |
| Tween 20 | ~16,7 | — | [K] |
| PGPR | ~1,5–3 | — | [K] |
| SSL | ~8–10 (rất dao động theo nguồn) | — | [K] |
| DATEM | ~8–10 | — | [K] |

**Quy tắc làm web:** bảng HLB nên có cột "nguồn" và cột "phương pháp (tính/đo/công bố của nhà sản xuất)". Các giá trị "kiểm lại từ nhà cung cấp (TDS)" được ưu tiên.

### Giới hạn của HLB — cần nói thẳng khi dạy
1. HLB là một con số tĩnh, không tính đến dầu, nhiệt độ, muối, pH, tỉ lệ pha. (Abbott nói rõ CPP/HLB-NAC phụ thuộc dầu, độ mặn, nhiệt độ.) [N: @abbott]
2. Kem: HLB không giải thích hết khả năng gây mất ổn định mỡ; chính sức căng liên diện giữa huyết thanh và mỡ có tương quan tốt hơn. Polysorbate 80 mạnh nhất, vì giảm lượng protein hấp phụ trên bề mặt hạt béo. [N: @goff1989; @goff1987]
3. Với chất không ion polyethoxy HLB đổi theo nhiệt độ vì liên kết hydro; nên dùng khái niệm **HLD/NAC** hay **PIT** nếu cần chính xác. [K]

---

## 1.5 Tham số đóng gói tới hạn (CPP) — hình dạng phân tử quyết định hình thái

### Công thức
**CPP = v / (a₀ · l_c)**, với v = thể tích đuôi, a₀ = diện tích nhóm đầu hiệu dụng, l_c = chiều dài đuôi tới hạn. [N: @abbott dùng V/(A·l)] Ý tưởng gốc của Israelachvili, Mitchell, Ninham (1976). [K]

### Thang cấu trúc
| CPP | Hình thái ưu thế | Ví dụ thực phẩm/gần thực phẩm | Nhãn |
|---|---|---|---|
| < 1/3 | mixen cầu trong nước (O/W) | Tween, sucrose monoester mạch ngắn | [N: @abbott] + [K] |
| 1/3–1/2 | mixen hình trụ/ lục giác | saponin? lysolecithin? (cần kiểm) | [N: @abbott: "hexagonal"] |
| 1/2–1 | lớp đôi mềm/ túi (vesicle) | lecithin sạch ở dải này khi hydrate hóa | [K] |
| ≈ 1 | lớp đôi phẳng (pha lamellar Lα) | MDG–nước tạo lamellar/ α-gel | [N: @abbott "cubic or simple Lα"] + [K] |
| > 1 | pha đảo, mixen đảo (W/O) | PGPR, phosphatidylethanolamine (PE) | [N: @abbott: >1 reverse] + [K] |

### Dùng CPP thế nào là hợp lý
- **Giải thích tại sao lecithin (hai đuôi, đầu nhỏ) thiên về lớp đôi/ túi, không phải mixen cầu**, và vì sao lysolecithin (một đuôi) dễ tạo O/W hơn. [K], [G]
- **Giải thích sự đảo pha khi đổi muối/nhiệt độ** (muối giảm a₀ của chất ion, tăng CPP). Abbott: muối làm giảm diện tích nhóm đầu hiệu dụng của chất ion; đồng chất hoạt động như dodecanol thêm thể tích đuôi mà ít thêm đầu. [N]
- **Đừng** dùng CPP để "tính" một nhũ tương thực phẩm đầy dầu: chưa có phép tính CPP đáng tin cho hỗn hợp lecithin–protein–MDG. [G]

---

## 1.6 Quy tắc Bancroft và các cơ chế bất ổn nhũ tương

- **Quy tắc Bancroft:** pha mà chất nhũ hóa tan tốt hơn thường là pha liên tục. Chất ưa nước → O/W; ưa dầu → W/O. [K] Có ngoại lệ (nhũ hóa bằng hạt Pickering, nhũ tương đảo pha khi nồng độ cao).
- **Các cơ chế mất ổn định:** tạo kem/lắng (creaming/sedimentation), keo tụ (flocculation), hợp nhất (coalescence), Ostwald ripening (đặc biệt với dầu tan chút ít trong nước), đảo pha. [K]
- **Hợp nhất từng phần (partial coalescence):** giọt chứa tinh thể mỡ gắn dính nhưng không hợp thành giọt tròn — cốt lõi của kem tươi đánh bông và kem lạnh (file 03). [N: @goff1997]
- **Hiệu ứng Gibbs–Marangoni:** khi một bề mặt giãn cục bộ, gradient γ kéo chất nhũ hóa và chất lỏng về chỗ mỏng → "tự sửa". Cần chất nhũ hóa có sẵn trong pha liên tục. [K]
- **Độ nhớt–đàn hồi liên diện:** màng nhớt–đàn hồi cản hợp nhất. Ví dụ, PGPR tạo màng có mô-đun giãn nở cao hơn polyglycerol-2 dioleate nhờ chuỗi ricinoleate phân nhánh và dài. [N: @jin2021]

---

## 1.7 Các thông số thực nghiệm cần có trong "bộ công cụ R&D"

| Đại lượng | Phương pháp | Ý nghĩa |
|---|---|---|
| γ cân bằng, γ(t) | giọt treo, Wilhelmy, bong bóng | tốc độ và độ mạnh hấp phụ |
| Mô-đun giãn nở E_d | giọt dao động | khả năng cản hợp nhất, Marangoni |
| Mô-đun cắt liên diện | lưu biến liên diện | độ rắn của màng (protein, saponin) |
| Tải bề mặt Γ (mg/m²) | kem rửa/ ly tâm + định lượng | đo lượng protein hấp phụ, theo dõi bị đẩy ra |
| Thế zeta | điện di | ổn định tĩnh điện |
| d₃₂, d₄₃, PDI | tán xạ laser/ DLS | kích thước, phân bố |
| PIT / cloud point | quan sát độ đục, độ dẫn điện | nhạy nhiệt của polyethoxy |

---

## Điều chắc / còn là giả thuyết / bước tiếp theo

**Chắc (có nguồn đã đọc):** vai trò ba bước của chất nhũ hóa; Π, Π_sat, SA; Γ tăng dần từ phân tử nhỏ → protein → polysaccharide; HLB có giới hạn (Goff); CPP có ngưỡng 1/3, 1/2, 1 và có cảnh báo của Abbott.

**Còn là giả thuyết/ cần kiểm:** công thức Griffin/Davies đầy đủ, bảng ứng dụng HLB, bảng HLB từng chất, đơn vị saponin Γ.

**Đề xuất:** lấy **Griffin 1954 (J. Soc. Cosmet. Chem. 5:249)** và **Israelachvili–Mitchell–Ninham 1976 (J. Chem. Soc., Faraday Trans. 2, 72:1525)** làm nguồn gốc; kiểm lại bảng HLB bằng datasheet nhà sản xuất (Palsgaard, Danisco/DuPont, Mitsubishi-Chemical Foods, Croda) hoặc bảng của Becher "Encyclopedia of Emulsion Technology". Hai tài liệu này có nhắc trong kết quả tìm kiếm nhưng tôi **chưa mở bản gốc** (trang SCC bị trả danh sách nhưng không đọc).
