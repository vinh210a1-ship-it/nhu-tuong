---
title: "Tài liệu sâu về nhũ tương thực phẩm – Mục lục và hướng dẫn sử dụng"
slug: muc-luc
khu: nhu-tuong
thu_tu: 0
loai: muc-luc
hien_tren_web: true
updated: 2026-11-01
nguon_goc: tai-lieu-nhu-tuong/00-muc-luc-va-huong-dan.md
---
# Tài liệu sâu về nhũ tương thực phẩm

Bộ tài liệu Markdown để dựng web kiến thức (tách khỏi web cờ vua). Viết cho người làm R&D thực phẩm: đi từ **bản chất ⇒ cơ chế ⇒ ứng dụng**, nêu kết luận trước, có công thức và ví dụ tính, và **phân biệt rõ mức độ chắc chắn** của từng khẳng định.

## 1. Mục lục

| File | Nội dung | Đối tượng |
|---|---|---|
| [01-nen-tang-nhu-tuong.md](01-nen-tang-nhu-tuong.md) | Định nghĩa, phân loại, nhiệt động, diện tích bề mặt, Laplace, HLB, lượng chất nhũ hóa tối thiểu | Nền tảng |
| [02-hinh-thanh-nhu-tuong.md](02-hinh-thanh-nhu-tuong.md) | Vỡ giọt (Capillary, Kolmogorov), hai chế độ giới hạn, thiết bị, PIT/EIP, **scale-up** | Cơ chế + thực hành |
| [03-co-che-mat-on-dinh.md](03-co-che-mat-on-dinh.md) | Kem hóa (Stokes), keo tụ (DLVO, cạn kiệt), hợp giọt, hợp giọt một phần, Ostwald, đảo pha, oxy hóa | Cơ chế |
| [04-chat-on-dinh-va-lop-giao-dien.md](04-chat-on-dinh-va-lop-giao-dien.md) | Cơ chế ⇒ công cụ ổn định; liên kết 3 luồng còn lại | Quyết định |
| [05-he-nhu-tuong-dac-biet.md](05-he-nhu-tuong-dac-biet.md) | Nano/micro, **Pickering**, nhũ tương kép, HIPE, W/O, emulgel | Chuyên sâu |
| [06-do-luong-va-dac-trung.md](06-do-luong-va-dac-trung.md) | Kích thước giọt, zeta, lưu biến, thử ổn định, SOP | Thực hành |
| [07-san-pham-thuc-pham-nhu-tuong.md](07-san-pham-thuc-pham-nhu-tuong.md) | Sữa, kem, kem lạnh, mayonnaise, bơ, đồ uống, sữa thực vật, nano | Ứng dụng |
| [08-xu-ly-su-co-va-quy-trinh-thiet-ke.md](08-xu-ly-su-co-va-quy-trinh-thiet-ke.md) | Bảng chẩn đoán, sơ đồ quyết định, DoE, phiếu thí nghiệm | Thực hành |
| [09-thuat-ngu.md](09-thuat-ngu.md) | Thuật ngữ Việt–Anh (~60 mục) | Tra cứu |
| [10-tai-lieu-tham-khao.md](10-tai-lieu-tham-khao.md) | Danh mục nguồn, phân hạng kiểm chứng | Tham chiếu |

**Lộ trình đọc gợi ý:** 01 ⇒ 03 ⇒ 02 ⇒ 06 ⇒ 08 (nền ⇒ cơ chế ⇒ tạo ⇒ đo ⇒ xử lý); sau đó 05 và 07 theo nhu cầu.

## 2. Quy ước độ tin cậy (dùng trong mọi file)

| Nhãn | Nghĩa |
|---|---|
| **[N: Rxx]** | Có nguồn đã kiểm (mã ở file 10): đã đọc metadata/tóm tắt trên PubMed hoặc đọc trang bài báo |
| **[K]** | Kiến thức nền từ sách giáo khoa (T01–T07), **chưa trích số trang** trong phiên này |
| **[T]** | Tôi tự tính minh họa; giả thiết ghi kèm (kiểm lại bằng Python trong phiên) |
| **[G]** | Giả thuyết/suy luận/khuyến nghị thực hành, cần kiểm bằng thí nghiệm |

**Nguyên tắc dựng web:** chỉ hiển thị nhãn **[N]** và **[T]** như "dữ kiện"; nội dung **[K]** nên có số trang sách trước khi công bố; nội dung **[G]** hiển thị dưới dạng "gợi ý/giả thuyết".

## 3. Phạm vi và giới hạn (nói thẳng)

1. **Nguồn kiểm được:** 27 bài tổng quan/nghiên cứu (2007–2026) qua PubMed và đọc trực tiếp 4 trang bài báo/tài liệu mở. Tất cả có mã R01–R27.
2. **Không truy cập được:** OpenAlex, Crossref, doi.org, Europe PMC, Wikipedia, MDPI (qua curl) bị proxy chặn; PMC yêu cầu xác minh trình duyệt. Hệ quả: công cụ kiểm tra tham chiếu **không chạy**; toàn văn nhiều bài trả phí **chưa đọc**; chỉ đọc tóm tắt.
3. **Sách giáo khoa** (McClements, Walstra, Dickinson, Tadros, Binks…) không mở được toàn văn. Công thức và khái niệm kinh điển (Stokes, DLVO, LSW, Griffin, Laplace, Kolmogorov–Hinze…) là chuẩn trong lĩnh vực nhưng nhãn **[K]**.
4. **Các con số điển hình về sản phẩm và thiết bị** (file 02 mục 4, file 07) là khoảng thường gặp, **không** phải tiêu chuẩn. Chưa có số liệu quy chuẩn Việt Nam (TCVN/QCVN) hay Codex được tra cứu trong phiên này.
5. **Chưa đọc số liệu của một số bài** chỉ liệt kê trong PubMed (ví dụ PubMed 33548306, 39662540, 38571750, 36436597, 33412906, 37367124): chỉ dùng như gợi ý đọc thêm.
6. **Chủ đề chuyên sâu nên bổ sung ở vòng sau:** (a) lưu biến bề mặt của protein và giãn nở; (b) mô hình hóa HPH (CFD); (c) bọt/nhũ tương sục khí; (d) emulsifier "clean-label" so sánh định lượng; (e) quy định pháp lý và an toàn nano.

## 4. Gợi ý cấu trúc web và công cụ tương tác

**Trang chính:** 6 chặng (Nền tảng ⇒ Hình thành ⇒ Mất ổn định ⇒ Ổn định ⇒ Đo lường ⇒ Sản phẩm) + trang "Chẩn đoán sự cố" + "Thuật ngữ" + "Nguồn".

**Máy tính tương tác (tất cả đã có công thức trong tài liệu):**
1. **Máy tính Stokes:** nhập d, Δρ, η_c ⇒ vận tốc và quãng đường kem hóa/ngày (file 03).
2. **Máy tính diện tích bề mặt & lượng chất nhũ hóa tối thiểu:** φ, d₃₂, Γ ⇒ A và nồng độ (file 01).
3. **Máy tính Laplace và Debye:** γ, d / lực ion (file 01, 03).
4. **Máy tính HLB hỗn hợp:** chọn 2 chất, tỷ lệ ⇒ HLB (file 01).
5. **Máy tính năng lượng giải hấp Pickering:** r, γ, θ ⇒ ΔE/kT (file 05).
6. **Sơ đồ chẩn đoán sự cố:** cây quyết định trong file 08.
7. **Vẽ d³ theo thời gian:** nhập số liệu đo ⇒ kiểm tra tuyến tính ⇒ gợi ý ripening (file 03, 06).

**Định dạng gợi ý:** mỗi file Markdown có front-matter (title, slug, level, tags) để dựng trang tự động; công thức dùng LaTeX (KaTeX).

## 5. Liên kết với 3 luồng còn lại

| Luồng | Nội dung nên nối | Điểm nối |
|---|---|---|
| Chất béo | Kết tinh, SFC, đa hình, oleogel | File 03 mục 4 (hợp giọt một phần), file 05 mục 4–5 |
| Chất hoạt động bề mặt | HLB chi tiết, loại chất nhũ hóa, lecithin, polysorbate | File 01 mục 4, file 04 |
| Chất ổn định | Gum, protein–polysaccharide, chất tạo đặc | File 03 mục 1–2, file 04 mục 2 |
