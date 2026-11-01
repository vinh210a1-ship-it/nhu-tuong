---
title: "Giới hạn của đợt này và việc còn lại"
slug: gioi-han-va-viec-con-lai
khu: thuc-pham
thu_tu: 99
loai: nguon
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-thuc-pham/99-gioi-han-va-viec-con-lai.md
---
# Giới hạn của đợt này và việc còn lại

## Nói thẳng về mức độ chắc chắn

1. **Chưa đọc toàn văn bài nào.** 83 nguồn: 14 trang gốc (JECFA, FDA, MDPI), 68 đọc tóm tắt, 1 chỉ thấy tiêu đề (chương sách Tapia 2020). 34 nguồn có DOI, 32 có PMID. Số liệu lấy từ tóm tắt; cần đối chiếu toàn văn trước khi đăng con số quan trọng.
2. **Nhiều số trong mô hình là `[K]` hoặc `[T]`** (pKa, Tgel theo loại, Td theo protein, D/z/F, Tg′, bảng enzym, độ ngọt tương đối). Chúng đúng bậc độ lớn theo sách nền nhưng **chưa trích trang**; web phải ẩn.
3. **Liên kết Consensus** (`consensus.app/papers/details/...`) lấy từ kết quả công cụ, **chưa mở kiểm từng liên kết** (proxy chặn consensus.app, giống ghi chú của luồng chất ổn định). Nguồn có DOI/PMID đã được xác nhận qua PubMed.
4. **Cơ sở dữ liệu JECFA** ghi họp 102 (2026) cho steviol glycosid; chưa đọc báo cáo họp đó.
5. Một số tổng quan 2026 trong danh mục là bài rất mới (PubMed đánh chỉ mục 2026-09/10); đã giữ vì khớp chủ đề, nhưng ưu tiên bài cũ hơn nếu cần trích ổn định.

## Môi trường: cái gì bị chặn, cái gì dùng được

| Dịch vụ | Trạng thái | Cách thay |
|---|---|---|
| PubMed MCP | Dùng được (siêu dữ liệu, tóm tắt, DOI) | — |
| Consensus MCP | Dùng được nhưng **hạn mức tháng 11 sắp hết** (còn 3 lượt khi kết thúc đợt này; reset 1/12) | PubMed, WebSearch |
| Cơ sở dữ liệu JECFA (apps.who.int), inchem.org | Mở được qua WebFetch | — |
| FDA (fda.gov/media/...) | Mở được qua WebFetch | — |
| MDPI | Mở được qua WebFetch | — |
| EFSA (efsa.europa.eu), Codex/FAO, EUR-Lex, OpenAlex, Crossref, Europe PMC, NCBI Bookshelf, Wikipedia | **Bị proxy chặn** (HTTP 403 khi CONNECT) | Dùng bản EFSA Journal qua PubMed |
| curl trực tiếp | Mọi host bị chặn trừ qua công cụ | WebFetch |

## Việc còn lại, theo thứ tự ưu tiên

1. **Lấy toàn văn và trích số trang** cho 10 chủ đề lõi: Lewis 1986 (phosphat), Sheard 2004, Eklund 1983/1985, Buera 1987, Kim 1987, Isleroglu 2012, Roos 2021, Petit 2012, Allan 2020, Li 2023.
2. **Quy định**: TT 24/2019/TT-BYT (phụ lục mức tối đa), Codex GSFA cho phosphat, nitrit, benzoat, sorbat. Cần người dùng cung cấp file hoặc cho phép tải từ máy cá nhân (thuvienphapluat.vn từng mở được ở luồng chất hoạt động bề mặt).
3. **Sách giáo khoa** để chuyển nhãn `[K]` → `[N]`: Fennema's *Food Chemistry* (Damodaran & Parkin), Belitz *Food Chemistry*, Toldrá *Handbook of Meat Processing*, Barbosa-Cánovas *Water Activity in Foods*, Heldman & Lund *Handbook of Food Engineering*.
4. **Chủ đề chưa làm** (xếp theo giá trị cho lab): enzyme thực phẩm ngoài MTG/asparaginase (amylase, lactase, pectinase) có GRAS/EFSA; chất nhũ hóa-lecithin trong bánh; hương và chất điều vị (5′-nucleotid); chất màu carotenoid/curcumin/chlorophyll với ADI; đường nghịch đảo; lên men (men bánh mì, sữa chua); mô hình dự đoán vi sinh (ComBase/Baranyi) để thay luật cardinal; dầu chiên (polar compounds); sốc nhiệt rã đông; vi bao.
5. **Mảng dược**: dữ liệu thuộc luồng riêng (đối tượng bào chế/tá dược, không liều dùng).
