---
title: "Tài liệu chất béo / lipid thực phẩm — Mục lục và quy ước đọc"
slug: muc-luc-va-quy-uoc
khu: chat-beo
thu_tu: 0
loai: muc-luc
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-chat-beo/00-muc-luc-va-quy-uoc.md
---
# Tài liệu chất béo / lipid thực phẩm — Mục lục và quy ước đọc

Phiên bản: 2026-11-01 · Luồng "Chất béo" của dự án web kiến thức R&D thực phẩm.
Ba luồng song song (nhũ tương, chất hoạt động bề mặt, chất ổn định) chỉ được nhắc chéo ngắn ở đây.

## Kết luận trước (đọc 30 giây)

1. Bộ này gồm 6 chương nội dung + 1 thư mục nguồn. Mỗi chương đi theo trình tự: **bản chất → cơ chế → ứng dụng → cách kiểm chứng**.
2. Mọi mệnh đề đều gắn nhãn mức chắc chắn (xem bên dưới). Chỉ những mục gắn **[N]** mới có nguồn tôi đã thực sự đọc trong phiên này (tóm tắt hoặc toàn văn trên PubMed/PMC). Mục **[S]** là kiến thức nền sách giáo khoa mà tôi viết từ hiểu biết chuyên ngành, **chưa đối chiếu được trang sách** trong phiên này. Mục **[G]** là suy luận/giả thuyết.
3. Số liệu cụ thể (nhiệt độ nóng chảy, d-spacing, thông số công nghiệp) gắn **[S]** nên được kiểm lại với sách gốc hoặc dữ liệu đo của bạn trước khi đưa lên web như "sự thật". Danh sách sách gốc nên mua/mượn nằm ở `99-thu-muc-nguon.md`.

## Quy ước nhãn mức chắc chắn

| Nhãn | Nghĩa | Cách dùng khi làm web |
|---|---|---|
| **[N]** | Có nguồn: đã đọc tóm tắt hoặc toàn văn, kèm mã tham chiếu `R#` (xem `99-thu-muc-nguon.md`, đã kiểm DOI/PMID qua PubMed) | Dùng được, ghi nguồn |
| **[S]** | Kiến thức nền chuẩn sách giáo khoa; chưa kiểm được trang sách ở phiên này | Dùng sau khi đối chiếu 1 sách gốc |
| **[G]** | Suy luận hoặc giả thuyết của người viết | Ghi rõ "giả thuyết", hoặc kiểm bằng thí nghiệm |

## Mục lục

| File | Nội dung |
|---|---|
| `01-cau-truc-triglyceride-va-acid-beo.md` | Glycerol–TAG, acid béo, sn-position, ký hiệu SUS, chỉ số hóa học (IV, SV, PV, AV), liên hệ dinh dưỡng sn-2 |
| `02-da-hinh-ket-tinh-va-ban-do-pha.md` | α/β′/β, subcell, 2L/3L, tuning fork–chair, tinh thể hỗn hợp (solid solution, eutectic, molecular compound), ca cao 6 dạng, tempering, bloom |
| `03-sfc-mang-tinh-the-oleogel.md` | SFC, kỹ thuật NMR/XRD/DSC, nano-platelet → mạng tinh thể, cắt trượt, oil binding, oleogel |
| `04-phan-doan-interesterification-hydro-hoa.md` | Fractionation (khô, dung môi), interesterification (hóa học, enzyme), hydro hóa và trans, lựa chọn thay thế |
| `05-oxy-hoa-lipid-chong-oxy-hoa-han-su-dung.md` | Autoxidation, photooxidation, chất chống oxy hóa, dầu khối vs nhũ tương, đo lường, hạn sử dụng (Arrhenius/Q10) |
| `06-chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong.md` | Cocoa butter/CBE/shea, palm, lauric, sữa, MCT, PUFA; tinh thể béo trong nhũ tương, partial coalescence |
| `99-thu-muc-nguon.md` | 40 tài liệu đã kiểm DOI/PMID qua PubMed + danh sách sách gốc [S] + bảng nguồn bị chặn |

## Giới hạn của lần tìm này (nói thẳng)

- Truy cập **được**: PubMed (tóm tắt, metadata, DOI) và toàn văn các bài mở trên PMC qua công cụ PubMed.
- Truy cập **bị chặn** trong môi trường này: OpenAlex, Crossref, NCBI E-utilities trực tiếp, trang PMC qua trình duyệt (dính reCAPTCHA), Wiley Online Library. Hệ quả: tôi **không** kiểm chéo bằng Crossref/OpenAlex; DOI trong thư mục nguồn đều lấy từ bản ghi PubMed.
- Chưa mở được sách giáo khoa (Lipid Handbook, Bailey, Frankel…). Vì vậy kiến thức sách là nhãn **[S]**.
- Mới đọc **toàn văn** 2 bài (R1: Macridachis-González 2020; R2: Seilert 2025, đọc có chọn lọc); còn lại chỉ đọc **tóm tắt**. Bất cứ chi tiết nào ngoài tóm tắt của các bài đó là [S], không phải [N].

## Gợi ý cấu trúc web (để bạn quyết, không bắt buộc)

- **Trang khái niệm** (1 chương = 1 trang), mỗi mệnh đề hiện huy hiệu [N]/[S]/[G] và nút "nguồn".
- **Công cụ tương tác** dễ làm, có công thức rõ ràng, ít rủi ro sai:
  1. Tính IV, SV, khối lượng phân tử TAG từ thành phần acid béo (công thức ở chương 01).
  2. Ước lượng TOTOX = 2·PV + AV và đồ thị tăng PV theo thời gian (chương 05).
  3. Máy tính Arrhenius/Q10 từ thời gian cảm ứng Rancimat ở 3–4 nhiệt độ → ngoại suy 20–25 °C (chương 05). Ghi cảnh báo: chỉ là chỉ báo xếp hạng, R36 cho thấy dự đoán có thể thấp hơn hạn dùng thực 15–20 lần với dầu óc chó.
  4. Bảng đối chiếu dạng đa hình (α, β′, β) với XRD short spacing và DSC (chương 02), kèm cảnh báo [S].
  5. Quy trình tempering socola dạng đường cong nhiệt độ–thời gian (chương 02).
- **Bảng thuật ngữ Việt–Anh** (đã gài trong từng chương, có thể gom thành trang riêng).

## Cách dùng với 3 luồng còn lại

- Nhũ tương: chương 06 phần "tinh thể béo trong nhũ tương" chỉ đưa cơ chế liên quan pha dầu (partial coalescence, Ostwald ripening, siêu lạnh); phần hệ keo/Gibbs/hệ số Bancroft để luồng nhũ tương lo.
- Chất hoạt động bề mặt: chương 02 và 05 nhắc tác động của emulsifier lên đa hình (ví dụ lecithin/PGPR/Tween 60 trong sô-cô-la, R21) và lên oxy hóa (SDS, DTAB, Tween 20, R29). Phần HLB, CMC để luồng HĐBM viết.
- Chất ổn định: chương 03 (oleogel, ethyl cellulose, sáp) chạm sang hydrocolloid; để luồng chất ổn định viết phần polymer.
