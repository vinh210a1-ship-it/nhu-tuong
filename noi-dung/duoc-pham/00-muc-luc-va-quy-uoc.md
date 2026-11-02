---
title: "Tài liệu mảng dược phẩm (bào chế và công nghệ dược) cho web kiến thức nhũ tương"
slug: muc-luc-va-quy-uoc
khu: duoc-pham
thu_tu: 0
loai: muc-luc
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-duoc-pham/00-muc-luc-va-quy-uoc.md
---
# Tài liệu mảng dược phẩm (bào chế và công nghệ dược) cho web kiến thức nhũ tương

Ngày tổng hợp: 01/11/2026. Người tổng hợp: Claude. Phạm vi do người dùng và điều phối viên chốt: **bào chế, tá dược, công nghệ dược**. Không có hướng dẫn điều trị, không có liều dùng cho bệnh nhân.

## Kết luận trước

- Bộ này gồm 9 bài và 1 bảng nguồn (80 nguồn, mỗi nguồn có DOI/PMID hoặc đường dẫn văn bản gốc). Trọng tâm là những gì **đo được và đặt số được**, để vừa viết bài vừa nuôi được logic phòng lab: BCS, hòa tan, hệ phân tán nano, tạo hạt và dập viên, độ ổn định ICH, QbD.
- Phần chắc nhất (nhãn N) là các **văn bản quy định đã đọc trang gốc** (ICH Q1A/Q1B/Q1E/Q8/M9, hướng dẫn FDA về BCS và hòa tan, SUPAC-IR, WHO TRS 1010, hướng dẫn ổn định ASEAN, chương chung dược điển về dòng chảy bột/rã/mài mòn/hòa tan/kích thước giọt) và **59 bài báo PubMed đã kiểm tra siêu dữ liệu và tóm tắt**.
- Phần yếu nhất: **chưa tiếp cận Handbook of Pharmaceutical Excipients, USP–NF/Ph. Eur. đầy đủ, Dược điển Việt Nam V** (các sách này trả phí hoặc không mở được từ môi trường làm việc). Mọi con số lấy từ sách nền được gắn **K** và không nên đưa lên web khi chưa có số trang (cùng quy tắc đã chốt cho các khu khác).
- Tên sản phẩm thuốc có thật (Doxil, Norvir, Onpattro...) chỉ xuất hiện như **ví dụ công nghệ bào chế** có trong nguồn, không bàn chỉ định hay hiệu quả điều trị.

## Mục lục

| File | Nội dung |
|---|---|
| `01-ta-duoc-chuc-nang-va-tuong-ky.md` | Phân loại tá dược theo chức năng; cơ sở dữ liệu IID của FDA; an toàn tá dược; tương kỵ thật (Maillard lactose, peroxide trong polysorbate); khung pháp lý Việt Nam |
| `02-hoa-tan-sinh-kha-dung-bcs.md` | Noyes–Whitney, BCS, ICH M9 và FDA; môi trường tiêu hóa; hòa tan; f2; mô hình giải phóng; làm tăng độ tan |
| `03-dang-bao-che-long-va-ban-ran.md` | Nhũ tương/kem/mỡ, hỗn dịch, HLB yêu cầu, lưu biến bán rắn, nhũ tương tiêm truyền (USP 729), Q1/Q2/Q3 |
| `04-he-phan-tan-nano.md` | Nanoemulsion, SEDDS và phân loại lipid LFCS, liposome, LNP, tinh thể nano, cyclodextrin, phân tán rắn vô định hình, đồng hóa áp lực cao |
| `05-dang-ran-vien-nen-tao-hat.md` | Tạo hạt ướt, dập viên, bôi trơn, rã, bột (Carr/Hausner), mài mòn, bao phim, SUPAC-IR |
| `06-on-dinh-han-dung-ich.md` | ICH Q1A/B/E, vùng khí hậu và vùng IVb của Việt Nam, Arrhenius và ASAP, các đường phân hủy, vô định hình, độ ẩm |
| `07-qbd-scale-up-quy-trinh.md` | QTPP, CQA, CPP, design space (ICH Q8); scale-up; bảng CQA–CPP cho từng dạng bào chế |
| `08-thong-so-cho-phong-lab.md` | **Bảng thông số và quy tắc "nếu–thì" cho trò chơi phòng lab**, mỗi dòng gắn nhãn tin cậy |
| `09-thuat-ngu-duoc-bao-che.md` | Thuật ngữ Việt–Anh |
| `10-nguon-va-khoang-trong.md` | Danh mục nguồn đọc theo mức; **những gì chưa kiểm được**; việc cần làm trên máy người dùng |
| `nguon-duoc-pham.csv` | 80 nguồn, cột giống `web-nhu-tuong/nguon/nguon.csv` (dễ gộp). Khóa dạng chữ + tối đa 4 chữ số + 1 chữ (khớp quy tắc `@khoa` của plugin nhãn trên web) |
| `phong-lab-thong-so.json` | 86 thông số cho phòng lab, bản máy đọc được của bài 08 |

## Quy ước nhãn (giống `web-nhu-tuong/BAO-CAO-CHUAN-HOA.md`)

- **[N: @khóa]**: có nguồn; `@khóa` là dòng trong `nguon-duoc-pham.csv`. "Có nguồn" nghĩa là **đã đọc tóm tắt bài báo hoặc đoạn trích của văn bản quy định**, chưa đọc toàn văn từng bài.
- **[T]**: tính minh họa. Con số do tôi **tính từ công thức** hoặc chọn làm mặc định cho mô phỏng, không phải số đo của một nghiên cứu. Ghi rõ công thức hoặc giả định.
- **[K]**: sách nền hoặc kiến thức giáo khoa phổ biến, chưa có số trang. Có thể ghép: `[K; N: @pouton2006]` nghĩa là khái niệm là sách nền, nguồn nêu hỗ trợ một phần.
- **[G]**: suy luận hoặc giả thuyết của người tổng hợp.

Mỗi dòng "Mức đọc" trong bảng nguồn: *Đọc một phần / trang gốc* (văn bản quy định, đọc qua công cụ trích trang web, **bản trích do mô hình nhỏ tóm lược, cần đối chiếu bản gốc trước khi đăng**), *Đọc tóm tắt* (PubMed: siêu dữ liệu và tóm tắt), *Chỉ thấy tiêu đề* (chỉ thấy qua Consensus).

## Cách dùng cho web

1. Bài 01–07 là bài đọc; mỗi bài mở đầu bằng "Kết luận trước" để dựng thẻ mở bài.
2. Bài 08 là nguồn dữ liệu cho phòng lab; bảng trong đó đã tách cột "nhãn" để lab hiển thị huy hiệu tin cậy cho từng hằng số.
3. Bài 09 và 10 vào trang Thuật ngữ và trang Nguồn.
4. Những chỗ ghi **[K]** có con số: **ẩn số trên web** cho đến khi đối chiếu sách (ví dụ HLB yêu cầu của từng loại dầu, nồng độ điển hình của tá dược).

## Giới hạn của đợt này (nói thẳng)

1. Đã đọc tóm tắt, chưa đọc toàn văn bài báo. Số liệu trong bảng quy định được trích qua công cụ web; đối chiếu bản PDF gốc trước khi đăng.
2. Chưa có Handbook of Pharmaceutical Excipients, USP–NF hiện hành, Dược điển Việt Nam V. Chương chung USP lấy từ **bản lưu USP 38 (2015)** trên một trang tổng hợp, có thể đã sửa đổi.
3. Chưa lấy được file IID của FDA (chỉ đọc trang mô tả); cần tải trên máy người dùng nếu muốn bảng khoảng nồng độ tá dược thật.
4. Hướng dẫn SUPAC-SS (bán rắn) và EMA về tá dược trên nhãn chưa mở được nội dung; ghi trong bài 10.
5. Việt Nam: chưa tìm được văn bản trực tiếp nêu điều kiện thử ổn định bắt buộc. Xem bài 06 mục 3.
