---
title: "Tá dược: chức năng, an toàn, tương kỵ và khung pháp lý"
slug: ta-duoc-chuc-nang-va-tuong-ky
khu: duoc-pham
thu_tu: 1
loai: bai
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-duoc-pham/01-ta-duoc-chuc-nang-va-tuong-ky.md
---
# 01. Tá dược: chức năng, an toàn, tương kỵ và khung pháp lý

> Nhãn: **[N: @khóa]** có nguồn; **[T]** minh họa/tính; **[K]** sách nền, chưa trích trang; **[G]** suy luận. Danh mục: `nguon-duoc-pham.csv`.

## Kết luận trước

- Tá dược (excipient) là phần **lớn nhất về khối lượng** của thuốc và quyết định liều có đều không, thuốc có bền không, sinh khả dụng ra sao; từng được coi là "trơ" nhưng thực tế không trơ về hóa học, sinh học và độc tính. [N: @pifferi2003]
- Một tá dược có thể làm **nhiều việc** tùy dạng bào chế (lactose là chất độn trong viên nhưng cũng là nguồn đường khử gây Maillard; polysorbate 80 là chất nhũ hóa nhưng tự oxy hóa tạo peroxide). Vì vậy bảng chức năng phải đi kèm **bảng tương kỵ**.
- Nơi tra "tá dược nào đã dùng ở đường dùng nào, dạng nào, với lượng tối đa bao nhiêu" là **Inactive Ingredient Database (IID)** của FDA. [N: @fdaiid] Toàn bộ bản tải tháng 10/2026 tra được ở trang [Tra cứu tá dược](../../tra-cuu-ta-duoc/). [N: @fda-iid-2026] Bảng nồng độ trong bài này vẫn để nhãn K vì chưa đối chiếu từng dòng với IID.

## 1. Phân loại tá dược theo chức năng

Cột "ví dụ" và "cơ chế" là kiến thức sách nền chuẩn của bào chế [K]; những ô có nguồn riêng được ghi.

| Nhóm chức năng | Ví dụ thường gặp | Cơ chế / vai trò | Dạng bào chế hay gặp |
|---|---|---|---|
| Chất độn (diluent/filler) | lactose, cellulose vi tinh thể (MCC), mannitol, tinh bột, calci hydrophosphat | Tăng khối lượng để dập/đóng nang được; quyết định tính chảy và khả năng nén. Tổng quan chất độn dùng cho dập thẳng: [N: @jivraj2000] | viên nén, nang |
| Chất dính (binder) | PVP, HPMC, tinh bột hồ hóa, MCC | Liên kết hạt; ở tạo hạt ướt hòa vào dịch tạo hạt | viên nén |
| Chất rã (disintegrant) | croscarmellose natri, natri starch glycolat, crospovidon | Trương nở, hồi phục biến dạng, hút nước theo mao dẫn làm viên vỡ. [N: @desai2016] | viên nén, nang |
| Chất bôi trơn / trơn chảy | magnesi stearat, acid stearic, natri stearyl fumarat; silic dioxyd keo, talc | Giảm ma sát thành cối; cải thiện chảy. Bôi trơn quá mức làm viên mềm và hòa tan chậm. [N: @wang2010] | viên nén |
| Polymer bao | HPMC, ethylcellulose, copolymer acid methacrylic, HPMCAS | Che mùi, bảo vệ, bao tan trong ruột, giải phóng kéo dài. [N: @felton2013] | viên bao |
| Chất hoạt động bề mặt / chất nhũ hóa | polysorbat 20/80, sorbitan ester (Span), natri lauryl sulfat, poloxamer, lecithin | Giảm sức căng bề mặt, ổn định giọt/hạt; xem bài 03–04 | nhũ tương, hỗn dịch, SEDDS, tiêm |
| Chất tăng tan | cyclodextrin, PEG, propylen glycol, dầu | Tạo phức bao hoặc hòa tan dạng lipid. [N: @brewster2007] | dung dịch, SEDDS, tiêm |
| Chất tạo nhớt / treo | carbomer, HPMC, CMC, xanthan | Tăng nhớt, tạo chảy yếu (yield stress) để treo hạt; xem bài 03 | gel, kem, hỗn dịch |
| Chất bảo quản | paraben, benzalkonium, alcol benzylic | Ức chế vi sinh trong chế phẩm nhiều liều/có nước | dung dịch, kem, nhỏ mắt |
| Chất chống oxy hóa / chelat | BHT, acid ascorbic, natri metabisulfit; EDTA | Chặn phản ứng gốc tự do; bắt ion kim loại xúc tác. Cơ chế oxy hóa: [N: @hovorka2001] | dung dịch, nhũ tương, kem |
| Đệm, đẳng trương | phosphat, citrat; NaCl, glucose | Giữ pH và áp suất thẩm thấu | tiêm, nhỏ mắt |
| Nền thuốc mỡ | vaselin, lanolin, PEG | Quyết định độ bít (occlusion) và độ phóng thích | thuốc mỡ, kem |

## 2. Cơ sở dữ liệu IID và cách đọc

- IID là các tệp CSV/Excel, **cập nhật hằng quý** (tháng 1, 4, 7, 10). [N: @fdaiid] Bản tải tháng 10/2026 (tệp IIR_OCOMM.xlsx) có 10 cột: *Ingredient Name, Route, Dosage Form, CAS Number, UNII, Potency Amount, Potency Unit, Maximum Daily Exposure, Maximum Daily Exposure Unit, Record Updated*; không dòng nào có cả hai loại số (hàm lượng mỗi đơn vị liều, lượng tối đa mỗi ngày). [N: @fda-iid-2026]
- Trang mô tả không nêu "tối đa", nhưng trong thực hành người ta đọc cột *Potency* như **lượng tá dược lớn nhất đã có trong một chế phẩm được duyệt** theo từng đường dùng và dạng. [G: diễn giải thông dụng, chưa thấy câu chữ chính thức trong trang đã đọc]
- Bảng tra "tá dược × dạng bào chế × đường dùng" từ IID đã có ở trang [Tra cứu tá dược](../../tra-cuu-ta-duoc/): 1.795 tá dược, 9.076 dòng. [N: @fda-iid-2026]

## 3. An toàn tá dược (nguyên tắc, không phải khuyến cáo lâm sàng)

- Tá dược đã bị đánh giá thấp về an toàn do cho rằng "trơ"; với các chất cũng dùng trong thực phẩm (chống oxy hóa, ngọt, màu) thì có độc tính học của JECFA, còn tá dược thuần dược thì dữ liệu mỏng hơn. [N: @pifferi2003]
- Lưu ý an toàn của tá dược nên đọc ở mức *tá dược nhạy cảm theo nhóm đối tượng/đường dùng* và trỏ tới văn bản gốc (EMA, FDA), không tự diễn giải. Tôi **chưa đọc được** hướng dẫn EMA về tá dược trên nhãn (xem bài 10), nên chưa nêu từng chất cụ thể. [G]

## 4. Tương kỵ có bằng chứng

### 4.1 Maillard giữa lactose và hoạt chất amin bậc hai

- Các chế phẩm generic fluoxetin HCl dùng lactose kém bền hơn chế phẩm dùng tinh bột, do phản ứng Maillard giữa amin bậc hai và lactose; chất sản phẩm đặc trưng là N-formylfluoxetin; ảnh hưởng của nước, nồng độ chất bôi trơn và nhiệt độ được ghi nhận. [N: @wirth1998]
- Ý nghĩa: quy tắc "amin + đường khử + ẩm + nhiệt = nâu hóa và mất hàm lượng", từng nghĩ chỉ áp dụng cho amin bậc một, **mở rộng sang amin bậc hai**. Dùng làm sự kiện cho lab ("tủ ấm 40 °C/75% RH làm viên đổi màu").

### 4.2 Polysorbat 20/80 tự oxy hóa và thủy phân

- Polysorbat phân hủy chủ yếu bằng **tự oxy hóa gốc tự do** ở mạch polyoxyethylen và ở nối đôi (PS80), và còn thủy phân ở nhiệt độ cao; trong dung dịch nước có peroxide tăng vọt, nhiều hơn ở PS80; thủy phân có nửa đời ~5 tháng ở 40 °C trong chế phẩm khảo sát. [N: @kishore2011]
- Ý nghĩa: chất nhũ hóa tự nó là **nguồn gây oxy hóa** cho hoạt chất nhạy cảm; liên hệ trực tiếp với bài chất béo/oxy hóa lipid của web (peroxide, chuỗi gốc tự do) và với cơ chế chống oxy hóa. [N: @hovorka2001]

### 4.3 Nước và tá dược hút ẩm

- Mỗi tá dược có đẳng nhiệt hấp phụ ẩm riêng; đẳng nhiệt này **tiên đoán được** ổn định pha rắn và các biến đổi pha ở giai đoạn sớm của phát triển công thức. [N: @airaksinen2005]

### 4.4 Chất bôi trơn và hòa tan

- Magnesi stearat kỵ nước tạo màng quanh hạt, giảm lực liên kết và làm viên mềm, đồng thời có thể làm chậm hòa tan; mức độ phụ thuộc thời gian trộn và cường độ trộn. [N: @wang2010]

## 5. Khung pháp lý Việt Nam về chất lượng thuốc và nguyên liệu

- Cơ sở dùng **Dược điển Việt Nam** hoặc một trong các dược điển tham chiếu: **EP, BP, USP, Ph.Int, JP**; khi áp dụng dược điển tham chiếu phải áp dụng *toàn bộ* chỉ tiêu, mức chất lượng và phương pháp thử; thuốc đã cấp phép phải cập nhật tiêu chuẩn theo bản dược điển mới nhất **trong tối đa 2 năm**. [N: @bytett11] (Thông tư 11/2018/TT-BYT ngày 04/05/2018, hiệu lực 20/06/2018; văn bản hợp nhất 01/VBHN-BYT ngày 02/01/2025; sửa bởi TT 03/2020, 23/2021, 45/2024.)
- Chỉ đọc qua trang tổng hợp luật bên thứ ba, **cần đối chiếu văn bản chính thức** trước khi đăng. [G]
- Dược điển Việt Nam V ban hành bằng Quyết định 5358/QĐ-BYT (2017): mới chỉ thấy tiêu đề trong kết quả tìm kiếm, chưa mở nội dung. [K]

## 6. Việc tiếp theo cho bài này

1. Tải IID và lập bảng nồng độ (xem bài 10).
2. Đối chiếu từng nhóm tá dược với Handbook of Pharmaceutical Excipients (cần sách).
3. Viết thẻ tá dược (khoảng 25 chất) theo khung: tên và mã; chức năng; cơ chế; độ tan/HLB/nhớt; tương kỵ; lưu ý an toàn; nguồn.
