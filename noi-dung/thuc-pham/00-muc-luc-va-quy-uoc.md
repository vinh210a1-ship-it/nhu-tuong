---
title: "Tài liệu thực phẩm: mục lục, quy ước và giới hạn"
slug: muc-luc-va-quy-uoc
khu: thuc-pham
thu_tu: 0
loai: muc-luc
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-thuc-pham/00-muc-luc-va-quy-uoc.md
---
# Tài liệu thực phẩm: mục lục, quy ước và giới hạn

Phạm vi: phần **thực phẩm** ngoài nhũ tương, chất béo, chất hoạt động bề mặt và chất ổn định (đã có trong `tai-lieu-*`). Mục đích kép: (1) thêm khu kiến thức vào web nhu-tuong; (2) cấp **biến số, công thức, khoảng thông số** cho trò chơi phòng lab ảo. Ngày tổng hợp: 01/11/2026. Người tổng hợp: Claude, đọc **tóm tắt** bài báo và trang gốc cơ sở dữ liệu quy định, **chưa đọc toàn văn bài nào**.

## Mục lục

| File | Nội dung | Cho lab |
|---|---|---|
| `01-giu-nuoc-thit-phosphat-muoi-ph.md` | Phosphat, muối, pH, WHC thịt/surimi; bốn cơ chế; liều; mô hình | pH–WHC–yield |
| `02-bao-quan-hoat-do-nuoc-va-han-su-dung.md` | aw, bảng giới hạn FDA 10 mầm bệnh, axit yếu, nitrit, sulfit, chống oxy hóa | luật vi sinh, hurdle |
| `03-maillard-caramel-acrylamide.md` | Ea, k, pH, aw, đường; acrylamide, asparaginase | nướng, chiên |
| `04-tinh-bot-ho-hoa-thoai-hoa.md` | Hồ hóa, đường/muối, thoái hóa, tinh bột biến tính | nấu hồ |
| `05-protein-bien-tinh-gel-hoa-va-enzym.md` | β-LG, myosin, muối; MTG; bảng enzym | gel, enzym |
| `06-chat-tao-ngot-mau-dieu-vi.md` | ADI chất tạo ngọt, glutamat, anthocyanin | pha chế |
| `07-qua-trinh-nhiet-lanh-say-ep-dun.md` | D, z, F; Tg′; GAB; ép đùn | máy móc lab |
| `08-thong-so-phong-lab.md` + `thong-so-phong-lab.json` | 53 tham số có nhãn và nguồn, kiểm thử hồi quy | trực tiếp |
| `09-quy-dinh-JECFA-EFSA-da-kiem.md` | ADI/MTDI đã đọc tại nguồn | cảnh báo liều |
| `99-gioi-han-va-viec-con-lai.md` | Giới hạn công cụ, chưa làm | |
| `nguon-thuc-pham.csv` | 83 nguồn, cùng cột với `web-nhu-tuong/nguon/nguon.csv` | |
| `cong-cu/` | Script sinh CSV và bảng thông số | |

## Quy ước nhãn (giống web nhu-tuong)

- `[N: @khóa]` có nguồn: dữ kiện lấy từ tóm tắt bài báo hoặc trang gốc đã đọc. Mỗi `@khóa` là một dòng trong `nguon-thuc-pham.csv`.
- `[K]` sách nền, chưa trích trang: **không đăng số lên web** cho đến khi có trang.
- `[T]` tính minh họa: hằng số của mô hình lab, phải ghi "minh họa" cạnh kết quả.
- `[G]` suy luận/giả thuyết.

Hai điểm quy ước mới so với các bộ trước: (1) khóa nguồn viết thường, có thể chứa dấu gạch (`jecfa-nitrite`); (2) cơ sở dữ liệu JECFA là một nguồn "trang gốc" (mức đọc: *Đọc một phần / trang gốc*).

## Ba kết luận cần nhớ

1. **Phosphat giữ nước thịt chủ yếu qua nâng pH + lực ion; tách actomyosin có thật ở mức phân tử nhưng không trội ở mọi loại thịt.** Cần muối đi kèm. (File 01.)
2. **Vi sinh vật có bộ giới hạn riêng (aw, pH, T, muối, oxy); axit yếu mất hiệu lực khi pH tăng; hàng rào yếu cộng gộp.** (File 02, bảng FDA.)
3. **Mọi động học (nâu hóa, mất màu, oxy hóa, bất hoạt vi sinh) là Arrhenius hoặc D–z; sức mạnh mô phỏng nằm ở việc chọn đúng Ea/z và biến aw, pH.** (File 03, 07, 08.)

## Gợi ý cách đưa lên web (đề xuất)

- Khu mới `thuc-pham` với 8 bài (01–07, 09) và trang "Bảng thông số" nội bộ (không đăng, chỉ cho lab).
- Mỗi bài có "hộp mô hình": công thức + khoảng thông số + liên kết sang màn lab tương ứng.
- Nối chéo: file 01 ↔ chất ổn định (hydrocolloid thay phosphat), file 02 ↔ tài liệu chất béo (oxy hóa lipid), file 04 ↔ chất ổn định (tinh bột biến tính).
