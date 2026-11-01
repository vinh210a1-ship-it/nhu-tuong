---
title: "Thiết kế theo chất lượng (QbD), design space và scale-up"
slug: qbd-scale-up-quy-trinh
khu: duoc-pham
thu_tu: 7
loai: bai
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-duoc-pham/07-qbd-scale-up-quy-trinh.md
---
# 07. Thiết kế theo chất lượng (QbD), design space và scale-up

> Nhãn: **[N: @khóa]** có nguồn; **[T]** minh họa/tính; **[K]** sách nền; **[G]** suy luận.

## Kết luận trước

- QbD (ICH Q8(R2)) là khung tư duy: **xác định đích (QTPP) → liệt kê thuộc tính chất lượng quan trọng (CQA) → tìm thông số quy trình/nguyên liệu ảnh hưởng (CPP) → vẽ vùng thao tác an toàn (design space) → kiểm soát (control strategy)**. [N: @ichq8]
- Khung QTPP → CQA → CPP giúp đọc các bài 02–06 theo một trục: mỗi bài cung cấp các cặp "thông số → CQA" có số.
- Quy mô mẻ: thay đổi lớn nhất 10 lần mẻ thí điểm là "mức 1" trong SUPAC-IR; vượt 10 lần là mức 2. [N: @fdasupacir]

## 1. Định nghĩa chuẩn (ICH Q8(R2))

| Thuật ngữ | Định nghĩa (rút gọn) | Nhãn |
|---|---|---|
| QTPP | tóm tắt hướng tới các đặc tính chất lượng của thành phẩm *lý tưởng sẽ đạt được* | [N: @ichq8] |
| CQA | tính chất vật lý, hóa học, sinh học hoặc vi sinh *phải nằm trong giới hạn phù hợp* | [N: @ichq8] |
| CPP | thông số quy trình mà *biến thiên của nó ảnh hưởng tới CQA* | [N: @ichq8] |
| Design space | tổ hợp đa chiều và tương tác của biến đầu vào (thuộc tính nguyên liệu) và thông số quy trình | [N: @ichq8] |
| Control strategy | bộ kiểm soát có kế hoạch, xuất phát từ hiểu biết sản phẩm và quy trình | [N: @ichq8] |

- **Làm việc trong design space không bị coi là thay đổi**; ra ngoài là thay đổi và thường kích hoạt thủ tục thay đổi sau phê duyệt; design space do công ty đề xuất và cơ quan quản lý đánh giá. [N: @ichq8]
- Văn bản đã đọc là bản trích; câu chữ đầy đủ của từng định nghĩa **cần đối chiếu bản gốc**. [G]

## 2. Bảng CQA ↔ CPP theo dạng bào chế (cho lab)

Mỗi cột "tác động" tóm tắt nguồn ở các bài trước. Nhãn ở cuối mỗi dòng.

| Dạng | CQA điển hình | CPP/nguyên liệu chính | Nguồn |
|---|---|---|---|
| Viên nén | hàm lượng và đồng nhất, độ mài mòn ≤ 1,0%, rã, hòa tan (S1–S3), độ cứng | cỡ hạt, độ ẩm hạt, lượng dịch tạo hạt, lực nén, thời gian trộn bôi trơn, lượng chất rã | [N: @usp1216; N: @usp701; N: @usp711; N: @faure2001; N: @wang2010; N: @patel2006] |
| Nhũ tương uống/bôi | cỡ giọt, kem hóa, nhớt, pH, vi sinh | áp suất và số chu kỳ đồng hóa, HLB, tỉ lệ dầu/chất nhũ hóa, nhiệt độ, làm nguội | [N: @gupta2016; N: @hakansson2019; N: @pasquali2008] |
| Nhũ tương tiêm | MDD < 500 nm, PFAT5 ≤ 0,05%, vô trùng, nội độc tố | đồng hóa nhiều chu kỳ, lọc, tiệt trùng | [N: @usp729; N: @hippal2010] |
| Kem/mỡ/gel | lưu biến (τ0, độ nhớt), vi cấu trúc Q3, thôi nhiễm, độ phóng thích | tốc độ cắt, nhiệt độ pha, làm nguội, polymer/sáp | [N: @chang2013; N: @lee2009] |
| Liposome/LNP | cỡ hạt, PDI, hiệu suất bẫy, ổn định | số lần đùn, T trên T_m, pH, tốc độ trộn | [N: @olson1979; N: @barenholz2012; N: @albertsen2022; N: @hou2021] |
| Tinh thể nano | cỡ hạt (D90), độ ổn định hạt | công suất, số chu kỳ, chất ổn định | [N: @keck2005; N: @merisko2011] |
| Phân tán rắn | % vô định hình, kết tinh lại | T_g polymer, nhiệt độ bảo quản, ẩm | [N: @baghel2016; N: @hancock1995; N: @airaksinen2005] |
| Mọi dạng | hạn dùng, thay đổi đáng kể | bao bì (độ thấm hơi nước, ánh sáng), điều kiện bảo quản | [N: @ichq1a; N: @ichq1b] |

## 3. Scale-up: nguyên tắc có nguồn

- **Tạo hạt ướt:** theo dõi công suất tiêu thụ của máy trộn cắt cao làm cầu nối scale-up, thông qua độ bão hòa và độ đặc khối ướt; ở tầng sôi theo dõi độ ẩm lớp hạt. [N: @faure2001]
- **Đồng hóa áp lực cao:** luật tỉ lệ thực nghiệm và hiểu biết cơ bản còn hạn chế, đặc biệt khi phần thể tích pha phân tán cao. [N: @hakansson2019]
- **Tinh thể nano:** quy mô lô lâm sàng và scale-up được mô tả trong tổng quan. [N: @keck2005]
- **Thay đổi sau phê duyệt (viên giải phóng tức thì):** mức 1 đến 10 lần mẻ thí điểm; mức 2 vượt 10 lần. [N: @fdasupacir]
- **Ngoại lệ [G]:** hệ ghép nối lưu biến–nhiệt (bán rắn) dễ khác khi đổi quy mô vì tốc độ làm nguội thay đổi; cần dữ liệu SUPAC-SS (chưa đọc được).

## 4. Dùng khung QbD trong lab (đề xuất)

1. Người chơi chọn mục tiêu (ví dụ "nhũ tương uống 20% dầu, hạn dùng 24 tháng vùng IVb").
2. Trò chơi tự dựng QTPP và danh sách CQA.
3. Người chơi vặn thông số (áp suất, chu kỳ, HLB, nhiệt độ bảo quản...), mô phỏng trả CQA và vẽ **design space** hai chiều (ví dụ áp suất × số chu kỳ → cỡ giọt).
4. Phần thưởng: dữ liệu thử ổn định ảo theo bảng ICH (0, 3, 6, 9, 12, 18, 24 tháng) và quyết định hạn dùng bằng quy tắc Q1E (bài 06). [N: @ichq1a; N: @ichq1e]

## 5. Chắc chắn / giả thuyết / bước tiếp theo

- **Chắc:** định nghĩa ICH Q8, ngưỡng SUPAC-IR, các CQA từ nguồn.
- **Giả thuyết:** hình dạng design space (tính từ mô hình lab), không phải dữ liệu thật.
- **Bước tiếp theo:** thêm ICH Q9 (quản lý rủi ro) và Q10 nếu muốn mở rộng; đọc toàn văn Q8(R2) mục thiết kế thực nghiệm.
