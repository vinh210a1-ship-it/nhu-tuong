---
title: "Kế hoạch đưa nội dung lên web và những khoảng trống cần lấp"
slug: ke-hoach-web-va-khoang-trong
khu: chat-nhu-hoa
thu_tu: 7
loai: ke-hoach
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-chat-hoat-dong-be-mat/07-ke-hoach-web-va-khoang-trong.md
---
# 07. Kế hoạch đưa nội dung lên web và những khoảng trống cần lấp

> Phần lớn là **đề xuất** (`[S]`), dựa trên nội dung đã gom ở file 01–06.

---

## Kết luận trước

1. Nội dung luồng này đủ để làm **4 trang chủ đề + 1 bảng tra + 3 công cụ tương tác nhỏ**. Phần "tra cứu INS và ML Việt Nam" là phần **chưa làm được** vì chưa đọc phụ lục Thông tư 24/2019.
2. Mỗi khẳng định trên web nên có **thẻ nguồn** (tác giả, năm, DOI hoặc PMID) và **mức bằng chứng** (đã đọc toàn văn/ tóm tắt/ kiến thức nền). Tôi đã đánh nhãn `[N]`, `[K]`, `[S]` trong file 01–05 để làm cơ sở.
3. Các chủ đề còn thiếu nguồn mạnh: **bánh mì cơ chế gluten/amylose**, **PGPR trong sô-cô-la**, **HLB từng chất theo nhà sản xuất**, **ADI của E473 và E491–495**, **Phụ lục 1/2 của Thông tư 24/2019**.

---

## 7.1 Cấu trúc trang đề xuất (cho web kiến thức nhũ tương)

```
/chat-hoat-dong-be-mat/
  1. nen-tang         ← file 01
     - Sức căng bề mặt, hấp phụ Gibbs, CMC
     - HLB (có công cụ trộn)
     - Packing parameter (có hoạt cảnh hình dạng phân tử)
     - Giới hạn của HLB và CPP (hộp "Đừng tin quá")
  2. cac-nhom-chat    ← file 02
     - Thẻ từng chất: cấu trúc, INS, HLB, cơ chế, ứng dụng, an toàn
     - Lọc theo: O/W, W/O, thực vật/ tổng hợp, nhãn sạch
  3. protein-va-canh-tranh ← file 03
     - Cơ chế orogenic displacement (hoạt cảnh)
     - Bảng tra "cạnh tranh / hiệp đồng / đồng hấp phụ"
  4. ung-dung         ← file 05
     - Kem, bánh mì, W/O, kép, đồ uống
  5. quy-dinh-an-toan ← file 04
     - Bảng INS, EFSA, VN (khi có), thảo luận bằng chứng
```

Mỗi trang kết thúc bằng khối **"Chắc / còn là giả thuyết / bước tiếp theo"** như trong file (hợp tinh thần người dùng).

---

## 7.2 Ba công cụ tương tác nhỏ

### a) Máy trộn HLB
- Đầu vào: hai chất (từ bảng), tỉ lệ khối lượng. Đầu ra: HLB_mix = w_A·HLB_A + w_B·HLB_B. `[K, file 01]`
- Cảnh báo hiển thị: "Giá trị HLB của nhà sản xuất có thể khác; HLB không tính đến dầu, muối, nhiệt."
- Dữ liệu: chỉ đưa HLB đã kiểm (Tween/Span bằng nhà sản xuất; este sucrose theo từng loại).

### b) Hình dạng phân tử và CPP
- Kéo thanh trượt "thể tích đuôi, diện tích đầu, chiều dài đuôi" → hiển thị mixen cầu/ trụ/ lớp đôi/ đảo. `[N: Abbott]`
- Hộp cảnh báo của Abbott: CPP hợp với chất hoạt động nguyên chất trong nước, ít liên quan khi có dầu. `[N]`

### c) Mô phỏng "Tween đẩy protein"
- Cột bên trái: màng protein (chấm), cột bên phải: miền CHĐBM lớn dần; áp suất bề mặt π tăng. Khi π ≥ π_c, mạng vỡ.
- Giá trị π_c lấy làm ví dụ (HSA ở mặt không khí–nước): 21,5 mN/m (1 mg/mL) và 36 mN/m (20 mg/mL) — ghi "ví dụ minh họa, không áp dụng cho mọi hệ". `[N: Rabe 2020]`
- Lựa chọn: "protein mềm dẻo" (miền tròn) và "protein cầu" (miền bất quy tắc). `[N: Mackie 1999]`

---

## 7.3 Lược đồ dữ liệu gợi ý (JSON) cho bảng tra chất nhũ hóa

```json
{
  "ins": "471",
  "e_number": "E471",
  "ten_vi": "Mono- và diglyceride của axit béo",
  "ten_en": "Mono- and diglycerides of fatty acids",
  "chuc_nang": ["nhũ hóa"],
  "nhom_hoa_hoc": "este glycerol",
  "hlb": {"gia_tri": null, "khoang": null, "nguon": null, "phuong_phap": null},
  "he_phu_hop": ["O/W", "W/O", "bột nhào", "kem"],
  "co_che": "...",
  "efsa": {"nam": 2017, "adi_mg_kg_bw": "khong can ADI so", "doi": "10.2903/j.efsa.2017.5045"},
  "viet_nam": {"van_ban": "TT 24/2019/TT-BYT", "ml": null, "cap_nhat": null},
  "an_toan_khac": ["NutriNet-Santé 2024 (quan sát)"],
  "nguon": ["PMID 32625340"],
  "muc_bang_chung": "N"
}
```

---

## 7.4 Khoảng trống và cách lấp

| Khoảng trống | Vì sao quan trọng | Cách lấp | Ưu tiên |
|---|---|---|---|
| Phụ lục 1/2A/2B Thông tư 24/2019 (INS, ML Việt Nam) | tra cứu pháp lý trên web | tải PDF Công báo/ VBPL, trích bảng; xác nhận hiệu lực 08/VBHN-BYT | Cao |
| HLB từng chất (số kiểm) | công cụ trộn HLB cần số tin cậy | datasheet nhà cung cấp: Palsgaard, DuPont-Danisco, Mitsubishi Chemical Foods, Croda, BASF; sách Becher | Cao |
| EFSA E473/E474, E475, E491–495 | hoàn chỉnh bảng an toàn | PubMed: các DOI 10.2903/j.efsa.20XX.xxxx (xem file 06 mục E9–E10) | Trung bình |
| Cơ chế DATEM/SSL–gluten; MDG–amylose | nội dung giải thích có chiều sâu | tìm review (Stampfli, Eliasson, Gómez...), đọc toàn văn | Trung bình |
| Lecithin phân đoạn, lysolecithin, chế phẩm enzyme | cải biến đặc tính | review lecithin (list, Szuhaj); PubMed lần tìm đầu không ra do cú pháp, cần tìm lại | Trung bình |
| PGPR trong sô-cô-la | ứng dụng quan trọng | review chocolate rheology (Afoakwa...) | Thấp |
| Saponin khác (trà, yucca, soapnut), glycolipid sinh học (rhamnolipid, sophorolipid), protein | "chất hoạt động bề mặt sinh học" | McClements & Gumus 2016, mục biosurfactants | Trung bình |
| Quy định Việt Nam về nhãn (ghi INS, nhóm chức năng) | trang quy định | Điều 11–13 TT 24/2019, Nghị định 15/2018 | Thấp |
| Cập nhật EFSA sau 2023 (NutriNet-Santé) | tính cập nhật | PubMed EFSA 2024–2026; ANSES | Trung bình |

---

## 7.5 Việc tôi sẽ làm tiếp nếu bạn đồng ý

1. Soạn một **bảng Excel/CSV** các chất nhũ hóa (khoảng 20 hàng) theo lược đồ 7.3, chỉ điền ô đã có nguồn; ô thiếu để trống và gắn cờ.
2. Nếu bạn cho phép truy cập PDF Công báo (hoặc đưa tôi tệp), trích **Phụ lục 1 và 2** của Thông tư 24/2019 cho nhóm chất nhũ hóa.
3. Soạn bản nháp **trang 1 (nền tảng)** dạng HTML theo giao diện của web, để bạn duyệt.

Việc nào cũng không đụng tới code trong kho hay ghi đè tệp có sẵn, nên có thể làm ngay khi bạn gật đầu.
