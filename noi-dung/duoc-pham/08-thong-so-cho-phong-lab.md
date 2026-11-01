---
title: "Thông số và quy tắc cho phòng lab ảo (mảng dược)"
slug: thong-so-cho-phong-lab
khu: duoc-pham
thu_tu: 8
loai: bang
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-duoc-pham/08-thong-so-cho-phong-lab.md
---
# 08. Thông số và quy tắc cho phòng lab ảo (mảng dược)

> Dành cho luồng làm trò chơi phòng lab. Mọi hằng số có **nhãn tin cậy** để lab hiển thị huy hiệu: **N** có nguồn, **T** tính minh họa (có công thức/giả định), **K** sách nền (ẩn số trên web), **G** giả thuyết. Bản máy đọc được: `phong-lab-thong-so.json` (cùng nội dung; có trường `nguon` trỏ khóa trong `nguon-duoc-pham.csv`).

## Kết luận trước

- Có **86 thông số**: 74 có nguồn (N), 8 tính minh họa (T), 4 sách nền (K). Chưa có thông số G nào được đưa vào bảng; mọi suy luận ở bài 01–07 có nhãn G trong bài.
- Ba nhóm quy tắc dựng được ngay từ số đã kiểm: **(1) BCS và hòa tan**, **(2) tủ ổn định ICH**, **(3) bàn nén viên và bàn nhũ tương** (cỡ giọt, HLB, USP 729).
- Nên tái dùng công thức đã có trong lab nhũ tương: Stokes, Γ·6φ/d (lượng chất nhũ hóa), HLB hỗn hợp, Arrhenius/Q10.

## 1. Mô-đun lab gợi ý và thông số cần

| Mô-đun | Thao tác người chơi | Đầu ra | Thông số (id) |
|---|---|---|---|
| Máy thử hòa tan | chọn pH (1.2/4.5/6.8), tốc độ cánh khuấy, thể tích, số đơn vị | biểu đồ % tan theo thời gian, nhãn "rất nhanh/nhanh", S1/S2/S3, f2 giữa hai mẻ | `bcs.*`, `usp711.*`, `fda1997.mot_diem` |
| Phân loại BCS | nhập độ tan ở ba pH và liều đơn; nhập hấp thu | lớp I–IV, đường đi gợi ý (biowaiver hay chiến lược tăng tan) | `bcs.the_tich_tan_cao`, `bcs.tham_cao` |
| Bàn nén viên | lượng dịch tạo hạt, thời gian trộn magnesi stearat, lực nén, tỉ lệ chất rã | Carr/Hausner, độ cứng, mài mòn, thời gian rã, hòa tan | `ran.*`, `su_kien.boi_tron_qua_muc` |
| Máy đồng hóa | áp suất, số chu kỳ, HLB, tỉ lệ dầu:chất nhũ hóa | cỡ giọt, PFAT5, kem hóa (Stokes), cảnh báo ripening | `nano.*`, `hlb.*`, `usp729.*` |
| Tủ ổn định | chọn buồng (25/60, 30/65, 30/75, 40/75), mẻ, thời điểm | mất hàm lượng theo Arrhenius, thay đổi đáng kể, hạn dùng theo Q1E | `on_dinh.*`, `su_kien.*` |
| Tủ lạnh/ánh sáng | chọn bao bì | quang phân theo Q1B | `on_dinh.quang` |

## 2. Quy tắc "nếu–thì" (đã nối nguồn)

1. **Hòa tan chậm khi tan thấp hoặc hạt to.** Tốc độ ∝ `A·(Cs−C)/h` (Noyes–Whitney). Nếu độ tan < 100 µg/mL hoặc dùng liều làm thể tích cần để hòa tan > 1 lít → cờ "hạn chế hòa tan". [N: @horter2001]
2. **Phân lớp BCS.** Tan cao nếu liều đơn cao nhất tan trong ≤ 250 mL ở mọi pH trong 1.2–6.8; thấm cao nếu hấp thu ≥ 85%. [N: @ichm9]
3. **Biowaiver.** Lớp I: rất nhanh, hoặc nhanh + f2 ≥ 50; lớp III: rất nhanh. [N: @ichm9]
4. **Hòa tan chấp nhận S1–S3.** (bảng ở bài 02). [N: @usp711]
5. **Bôi trơn quá mức.** Thời gian trộn với magnesi stearat tăng → độ cứng giảm, hòa tan chậm. [N: @wang2010]
6. **Tạo hạt.** Độ bão hòa chất lỏng và độ đặc khối ướt quyết định cỡ hạt; quá ướt → vón. [N: @faure2001]
7. **Chảy bột.** Carr/Hausner tra thang Ph. Eur. [N: @pheur2936]
8. **Đồng hóa.** Cỡ giọt giảm theo áp suất và số chu kỳ rồi chạm sàn; không đủ chất nhũ hóa → kết hợp lại. [T] (hệ số mũ giả định); nguồn xác nhận phụ thuộc vào công suất/số chu kỳ. [N: @keck2005; N: @hakansson2019]
9. **Nhũ tương tiêm.** Đạt khi MDD < 500 nm **và** PFAT5 ≤ 0,05%. [N: @usp729]
10. **Ripening.** Pha dầu có ≥ 50% triglycerid không tan → hầu như không ripening; hexadecan/tinh dầu → ripening. [N: @wooster2008]
11. **HLB.** Chọn hỗn hợp chất nhũ hóa HLB gần rHLB của dầu; nhưng bảng rHLB chỉ gần đúng, nên nhũ tương "tốt nhất" có thể lệch ±1–2 đơn vị. [N: @pasquali2008]; mức lệch ±1–2 là [G].
12. **Vô định hình.** Bảo quản trên T_g − 50 K hoặc ẩm cao → nguy cơ kết tinh lại. [N: @hancock1995; N: @airaksinen2005]
13. **Ổn định.** Mất hàm lượng ≥ 5% ở buồng cấp tốc = thay đổi đáng kể → thêm buồng trung gian. [N: @ichq1a]
14. **Hạn dùng.** Ngoại suy theo Q1E: tối đa 2X (không quá X + 12 tháng) nếu ít thay đổi; 1,5X (không quá X + 6) nếu thay đổi mà không dùng thống kê. [N: @ichq1e]
15. **Tương kỵ.** Lactose + hoạt chất amin + ẩm + nhiệt → nâu hóa (Maillard). [N: @wirth1998]
16. **Chất nhũ hóa tự oxy hóa.** PS80 tạo peroxide; hoạt chất nhạy oxy hóa mất nhanh hơn. [N: @kishore2011]
17. **Sự kiện hiếm.** Dạng đa hình bền ít tan xuất hiện muộn (ritonavir); hòa tan tụt dù công thức không đổi. [N: @bauer2001]

## 3. Cách dùng nhãn trong lab

- Huy hiệu **N**: hiện nguồn khi bấm (khóa → thẻ nguồn).
- **T**: hiện "giá trị mô phỏng" và công thức.
- **K**: hiển thị khái niệm, ẩn con số (ví dụ HLB riêng của Tween 80).
- Hằng số mặc định chưa có nguồn nào (hệ số mũ của đồng hóa, Ea mặc định, B hiệu chỉnh ẩm) phải ghi **T**, đừng hiện như số liệu đo.

## 4. Toàn bộ bảng thông số

| id | Nhóm | Tên | Giá trị | Đơn vị | Nhãn | Nguồn |
|---|---|---|---|---|---|---|
| `gi.ph_da_day` | Môi trường tiêu hóa | pH dạ dày lúc đói | min = 1.0; max = 2.5 | pH | N | @evans1988 |
| `gi.ph_ruot_non_dau` | Môi trường tiêu hóa | pH ruột non đoạn đầu (giờ đầu) | mean = 6.6; sd = 0.5 | pH | N | @evans1988 |
| `gi.ph_hoi_trang_cuoi` | Môi trường tiêu hóa | pH hồi tràng cuối | mean = 7.5; sd = 0.4 | pH | N | @evans1988 |
| `gi.ph_manh_trang` | Môi trường tiêu hóa | pH manh tràng | mean = 6.4; sd = 0.4 | pH | N | @evans1988 |
| `gi.ph_dai_trang_trai` | Môi trường tiêu hóa | pH đại tràng trái (cuối) | mean = 7.0; sd = 0.7 | pH | N | @evans1988 |
| `gi.thoi_gian_ruot_non` | Môi trường tiêu hóa | Thời gian qua ruột non | mean = 3; sem = 1 | giờ | N | @davis1986 |
| `gi.thai_da_day_don_vi_lon` | Môi trường tiêu hóa | Thải dạ dày của đơn vị lớn (viên nền) so với pellet/dung dịch | mo_ta = đơn vị lớn bị giữ lâu theo cỡ bữa ăn; pellet và dung dịch thoát được |  | N | @davis1986 |
| `bcs.the_tich_tan_cao` | BCS và hòa tan | Thể tích ngưỡng cho 'tan cao' | 250 | mL | N | @ichm9, @fdabcs2017 |
| `bcs.ph_ich_m9` | BCS và hòa tan | Khoảng pH thử độ tan (ICH M9) | min = 1.2; max = 6.8; thu_it_nhat = [1.2, 4.5, 6.8] | pH | N | @ichm9 |
| `bcs.ph_fda` | BCS và hòa tan | Khoảng pH thử độ tan (FDA 2017) | min = 1.0; max = 6.8 | pH | N | @fdabcs2017 |
| `bcs.nhiet_do` | BCS và hòa tan | Nhiệt độ thử độ tan | mean = 37; tol = 1 | °C | N | @ichm9, @fdabcs2017 |
| `bcs.tham_cao` | BCS và hòa tan | Ngưỡng 'thấm cao' (mức hấp thu) | 85 | % | N | @ichm9, @fdabcs2017 |
| `bcs.phan_huy_toi_da` | BCS và hòa tan | Phân hủy tối đa khi thử độ tan/ổn định dạ dày–ruột để vẫn phân loại được | 10 | % | N | @ichm9 |
| `bcs.tan_rat_nhanh` | BCS và hòa tan | Hòa tan rất nhanh | phan_tram = 85; phut = 15 |  | N | @ichm9, @fdabcs2017 |
| `bcs.tan_nhanh` | BCS và hòa tan | Hòa tan nhanh | phan_tram = 85; phut = 30 |  | N | @ichm9, @fdabcs2017 |
| `bcs.so_don_vi` | BCS và hòa tan | Số đơn vị tối thiểu mỗi biểu đồ | 12 | đơn vị | N | @ichm9, @fdadissol1997 |
| `bcs.thiet_bi` | BCS và hòa tan | Thiết bị và tốc độ | canh_khuay_rpm = 50; gio_rpm = 100; the_tich_toi_da_mL = 900 |  | N | @ichm9, @fdabcs2017 |
| `bcs.f2` | BCS và hòa tan | Ngưỡng tương đồng f2 | min = 50 |  | N | @ichm9, @fdadissol1997 |
| `bcs.tan_thap_nong_do` | BCS và hòa tan | Ngưỡng độ tan thường gây hạn chế hòa tan | 100 | µg/mL | N | @horter2001 |
| `bcs.the_tich_lieu_tan` | BCS và hòa tan | Thể tích dịch để hòa tan liều đơn gây khó khăn | 1 | lít | N | @horter2001 |
| `usp711.nhiet_bo` | BCS và hòa tan | Nhiệt độ bể thử hòa tan (USP 711, bản 38) | mean = 37; tol = 0.5 | °C | N | @usp711 |
| `usp711.s1` | BCS và hòa tan | Bảng chấp nhận S1 | so_don_vi = 6; dieu_kien = mỗi đơn vị ≥ Q + 5% |  | N | @usp711 |
| `usp711.s2` | BCS và hòa tan | Bảng chấp nhận S2 | so_don_vi_tong = 12; dieu_kien = TB ≥ Q, không đơn vị nào < Q − 15% |  | N | @usp711 |
| `usp711.s3` | BCS và hòa tan | Bảng chấp nhận S3 | so_don_vi_tong = 24; dieu_kien = TB ≥ Q, ≤ 2 đơn vị < Q − 15%, không đơn vị nào < Q − 25% |  | N | @usp711 |
| `fda1997.mot_diem` | BCS và hòa tan | Chỉ tiêu một điểm cho lớp 1 và 3 (QC thường quy) | phan_tram = 85; Q = 80; phut_toi_da = 60 |  | N | @fdadissol1997 |
| `usp729.mdd` | Nhũ tương và hệ nano | Đường kính giọt trung bình nhũ tương lipid tiêm (USP 729, bản 38) | max = 500 | nm | N | @usp729 |
| `usp729.pfat5` | Nhũ tương và hệ nano | PFAT5: % chất béo trong giọt > 5 µm theo thể tích | max = 0.05 | % | N | @usp729 |
| `hlb.rhlb_olive_bo` | Nhũ tương và hệ nano | HLB yêu cầu của dầu olive/dầu bơ (O/W), cặp Tween 80/Span 80 | 11.1 | HLB | N | @binarjo2025 |
| `hlb.rhlb_luu_y` | Nhũ tương và hệ nano | Lưu ý: HLB yêu cầu chỉ gần đúng và đổi theo nguồn dầu | mo_ta = Griffin chỉ là hướng dẫn; dầu nguyên bản biến thiên; chất tan trong dầu đổi rHLB |  | N | @pasquali2008, @smejkal2024 |
| `hlb.tween80` | Nhũ tương và hệ nano | HLB Tween 80 (polysorbat 80) | 15.0 | HLB | K | — |
| `hlb.span80` | Nhũ tương và hệ nano | HLB Span 80 (sorbitan monooleat) | 4.3 | HLB | K | @binarjo2025 |
| `hlb.cong_thuc` | Nhũ tương và hệ nano | Công thức HLB hỗn hợp | cong_thuc = HLB = fA·HLB_A + (1−fA)·HLB_B |  | K | — |
| `nano.wooster_lct` | Nhũ tương và hệ nano | Đường kính nanoemulsion dầu LCT so với hexadecan (cùng điều kiện) | LCT = 120; hexadecan = 80 | nm | N | @wooster2008 |
| `nano.ostwald_trigliceride` | Nhũ tương và hệ nano | Tỉ lệ triglycerid không tan trong pha dầu để chống Ostwald ripening | min_phan_tram = 50 | % | N | @wooster2008 |
| `nano.snedds_kich_thuoc` | Nhũ tương và hệ nano | Kích thước giọt SNEDDS sau pha loãng | max = 200 | nm | N | @date2010 |
| `nano.nanoemulsion_kich_thuoc` | Nhũ tương và hệ nano | Kích thước nanoemulsion điển hình | xap_xi = 100 | nm | N | @gupta2016 |
| `nano.dun_liposome` | Nhũ tương và hệ nano | Đùn qua màng 0,2 µm cho đường kính trung bình túi liposome | lo_mang = 0.2; dk_tb = 0.27 | µm | N | @olson1979 |
| `nano.hspc_tm` | Nhũ tương và hệ nano | Nhiệt độ chuyển pha T_m của phosphatidylcholin (HSPC) trong liposome kiểu Doxil | 53 | °C | N | @barenholz2012 |
| `nano.nghien_uot` | Nhũ tương và hệ nano | Nghiền bi ướt: kích thước, nồng độ, tỉ lệ hoạt chất:chất ổn định | d_tb_max_nm = 200; d90_max_nm = 400; nong_do_mg_g = [300, 400]; ti_le_hoat_chat_chat_on_dinh = [2, 20] |  | N | @merisko2011 |
| `nano.tg_tru_50` | Nhũ tương và hệ nano | Bảo quản chất vô định hình dưới T_g | K_duoi_Tg = 50 | K | N | @hancock1995 |
| `nano.luat_ti_le_ap_suat` | Nhũ tương và hệ nano | Luật tỉ lệ cỡ giọt theo áp suất đồng hóa | d_ti_le = P^-0,4 đến P^-0,6; so_chu_ky_san = 3 đến 5 |  | T | @hakansson2019 |
| `nano.stokes_mac_dinh` | Nhũ tương và hệ nano | Mặc định tính Stokes | delta_rho_kg_m3 = 80; eta_mPa_s = 1.0; d_um_vs_mm_ngay = 10 = 377; 1 = 3.8; 0.2 = 0.15 |  | T | — |
| `nano.ostwald_freundlich` | Nhũ tương và hệ nano | Tăng độ tan theo bán kính hạt (γ = 0,02 N/m, Vm = 2,3×10⁻⁴ m³/mol, 298 K) | r_1um = 1.004; r_200nm = 1.019; r_100nm = 1.038; r_50nm = 1.077 | S(r)/S∞ | T | — |
| `nano.dien_tich_rieng` | Nhũ tương và hệ nano | Diện tích riêng hạt cầu đặc ρ = 1,3 g/cm³ | d_100um = 0.046; d_10um = 0.46; d_1um = 4.6; d_200nm = 23.1 | m²/g | T | — |
| `ran.carr_hausner` | Dạng rắn | Thang chảy theo chỉ số Carr và Hausner | rat_tot = [1, 10, 1.0, 1.11]; tot = [11, 15, 1.12, 1.18]; kha = [16, 20, 1.19, 1.25]; chap_nhan = [21, 25, 1.26, 1.34]; kem = [26, 31, 1.35, 1.45]; rat_kem = [32, 37, 1.46, 1.59]; cuc_kem = [38, —, 1.6, —] | [Carr% min, max, Hausner min, max] | N | @pheur2936 |
| `ran.goc_nghi` | Dạng rắn | Thang chảy theo góc nghỉ | rat_tot = [25, 30]; tot = [31, 35]; kha = [36, 40]; chap_nhan = [41, 45]; kem = [46, 55]; rat_kem = [56, 65]; cuc_kem = [66, —] | độ | N | @pheur2936 |
| `ran.mai_mon` | Dạng rắn | Độ mài mòn viên (USP 1216, bản 38) | toc_do_rpm = 25; so_vong = 100; khoi_luong_mau_g = 6.5; gioi_han_phan_tram = 1.0 |  | N | @usp1216 |
| `ran.ra` | Dạng rắn | Thử rã (USP 701, bản 38) | nhiet_do_C = 37; tol_C = 2; chu_ky_phut = [29, 32]; hanh_trinh_mm = [53, 57]; so_don_vi = 6; quy_tac_mo_rong = ≥ 16/18 |  | N | @usp701 |
| `ran.supac_ir_chat_doc` | Dạng rắn | SUPAC-IR: ngưỡng thay đổi chất độn (% w/w tổng khối lượng) | muc1 = 5; muc2 = 10 | % | N | @fdasupacir |
| `ran.supac_ir_ra_tinh_bot` | Dạng rắn | SUPAC-IR: chất rã tinh bột | muc1 = 3; muc2 = 6 | % | N | @fdasupacir |
| `ran.supac_ir_ra_khac` | Dạng rắn | SUPAC-IR: chất rã khác | muc1 = 1; muc2 = 2 | % | N | @fdasupacir |
| `ran.supac_ir_dinh` | Dạng rắn | SUPAC-IR: chất dính | muc1 = 0.5; muc2 = 1 | % | N | @fdasupacir |
| `ran.supac_ir_stearat` | Dạng rắn | SUPAC-IR: bôi trơn Ca/Mg stearat | muc1 = 0.25; muc2 = 0.5 | % | N | @fdasupacir |
| `ran.supac_ir_boi_tron_khac` | Dạng rắn | SUPAC-IR: bôi trơn khác | muc1 = 1; muc2 = 2 | % | N | @fdasupacir |
| `ran.supac_ir_talc` | Dạng rắn | SUPAC-IR: trơn chảy talc | muc1 = 1; muc2 = 2 | % | N | @fdasupacir |
| `ran.supac_ir_tron_chay_khac` | Dạng rắn | SUPAC-IR: trơn chảy khác | muc1 = 0.1; muc2 = 0.2 | % | N | @fdasupacir |
| `ran.supac_ir_lop_bao` | Dạng rắn | SUPAC-IR: lớp bao phim | muc1 = 1; muc2 = 2 | % | N | @fdasupacir |
| `ran.supac_ir_tong` | Dạng rắn | SUPAC-IR: tổng cộng dồn mọi thay đổi tá dược | muc1 = 5; muc2 = 10 | % | N | @fdasupacir |
| `ran.supac_ir_quy_mo` | Dạng rắn | SUPAC-IR: mức 1 cho tăng quy mô mẻ | he_so_toi_da = 10 | lần mẻ thí điểm | N | @fdasupacir |
| `ran.ich_m9_ty_le_loai_iii` | Dạng rắn | ICH M9, biowaiver lớp III: thay đổi tương đối tá dược so với khối lượng nhân | chat_doc = 10; ra_tinh_bot = 6; ra_khac = 2; chat_dinh = 1; stearat = 0.5; boi_tron_khac = 2; talc = 2; tron_chay_khac = 0.2; tong = 10 | % | N | @ichm9 |
| `on_dinh.dai_han_ich` | Ổn định | Điều kiện dài hạn ICH (vùng I/II) | lua_chon = [T = 25; RH = 60, T = 30; RH = 65]; tol_T = 2; tol_RH = 5; thang_toi_thieu_nop = 12 | °C/%RH | N | @ichq1a |
| `on_dinh.trung_gian` | Ổn định | Điều kiện trung gian | T = 30; RH = 65; thang = 6; so_diem_toi_thieu = 4 |  | N | @ichq1a |
| `on_dinh.cap_toc` | Ổn định | Điều kiện cấp tốc | T = 40; RH = 75; thang = 6; so_diem_toi_thieu = 3 |  | N | @ichq1a |
| `on_dinh.vung_ivb` | Ổn định | Điều kiện dài hạn vùng IVb (ASEAN) | T = 30; RH = 75; co_trung_gian = không |  | N | @aseanstab, @whotrs1010 |
| `on_dinh.so_me` | Ổn định | Số mẻ chính tối thiểu | tong = 3; it_nhat_quy_mo_thi_diem = 2 | mẻ | N | @ichq1a |
| `on_dinh.tan_suat` | Ổn định | Tần suất thử dài hạn (hạn dùng ≥ 12 tháng) | nam_1 = mỗi 3 tháng; nam_2 = mỗi 6 tháng; sau_do = hằng năm |  | N | @ichq1a |
| `on_dinh.thay_doi_dang_ke` | Ổn định | Thay đổi đáng kể: ngưỡng hàm lượng | 5 | % | N | @ichq1a, @whotrs1010 |
| `on_dinh.quang` | Ổn định | Quang ổn định xác nhận | lux_gio_min = 1200000; can_uv_Wh_m2_min = 200 |  | N | @ichq1b |
| `on_dinh.ngoai_suy_it_thay_doi` | Ổn định | Ngoại suy khi ít thay đổi (nhiệt độ phòng) | he_so = 2; cong_toi_da_thang = 12 |  | N | @ichq1e |
| `on_dinh.ngoai_suy_co_thong_ke` | Ổn định | Ngoại suy khi có thay đổi và có phân tích thống kê | he_so = 2; cong_toi_da_thang = 12 |  | N | @ichq1e |
| `on_dinh.ngoai_suy_khong_thong_ke` | Ổn định | Ngoại suy khi có thay đổi, không dùng thống kê | he_so = 1.5; cong_toi_da_thang = 6 |  | N | @ichq1e |
| `on_dinh.gioi_han_tin_cay` | Ổn định | Giới hạn tin cậy xác định hạn dùng | muc_tin_cay = 95; mot_phia = có; muc_y_nghia_gop_me = 0.25 |  | N | @ichq1e |
| `on_dinh.in_use` | Ổn định | Thời gian sử dụng thông thường chấp nhận không cần dữ liệu bổ sung | 30 | ngày | N | @whotrs1010 |
| `on_dinh.ban_tham` | Ổn định | Bao bì bán thấm | dai_han = [T = 25; RH = 40, T = 30; RH = 35]; cap_toc = T = 40; RH_max = 25 |  | N | @whotrs1010 |
| `on_dinh.ea_mac_dinh` | Ổn định | Khoảng Ea mặc định cho phản ứng hóa học | min = 50; max = 110 | kJ/mol | T | — |
| `on_dinh.q10` | Ổn định | Q10 (30→40 °C) theo Ea | 40 = 1.66; 50 = 1.88; 60 = 2.14; 83 = 2.86; 100 = 3.55; 110 = 4.03; 125 = 4.87 |  | T | — |
| `on_dinh.af_40_25` | Ổn định | Hệ số tăng tốc 40 °C so với 25 °C | Ea50 = 2.6; Ea83 = 5.0; Ea110 = 8.4 |  | T | — |
| `on_dinh.af_40_30` | Ổn định | Hệ số tăng tốc 40 °C so với 30 °C | Ea50 = 1.9; Ea83 = 2.9; Ea110 = 4.0 |  | T | — |
| `on_dinh.asap` | Ổn định | ASAP: khoảng ví dụ nhiệt độ, ẩm và thời gian | T = [50, 80]; RH = [0, 63]; ngay_toi_da = 21 |  | N | @waterman2016 |
| `on_dinh.polysorbat_thuy_phan` | Ổn định | Nửa đời thủy phân polysorbat trong chế phẩm khảo sát, 40 °C | thang = 5 | tháng | N | @kishore2011 |
| `on_dinh.t90` | Ổn định | Công thức t90 | bac_0 = 0,1·C0/k; bac_1 = 0,105/k |  | K | — |
| `su_kien.maillard` | Sự kiện lab | Maillard lactose + amin bậc hai | mo_ta = chế phẩm lactose kém bền hơn chế phẩm tinh bột; nước, bôi trơn, nhiệt thúc đẩy; N-formyl là dấu ấn |  | N | @wirth1998 |
| `su_kien.polysorbat_peroxide` | Sự kiện lab | Polysorbat tự oxy hóa tạo peroxide | mo_ta = peroxide tăng vọt trong dung dịch PS; PS80 nhiều hơn PS20 |  | N | @kishore2011 |
| `su_kien.dang_hinh_muon` | Sự kiện lab | Dạng đa hình bền, ít tan xuất hiện muộn | mo_ta = ritonavir 1998: dạng II ít tan hơn nhiều, tạo nhân khó nhưng đã xảy ra |  | N | @bauer2001 |
| `su_kien.boi_tron_qua_muc` | Sự kiện lab | Bôi trơn quá mức | mo_ta = magnesi stearat tạo màng quanh hạt, viên mềm, hòa tan chậm |  | N | @wang2010 |
| `su_kien.ket_tinh_lai` | Sự kiện lab | Kết tinh lại phân tán rắn vô định hình | mo_ta = kết tinh khi bảo quản gần/ trên T_g − 50 K hoặc ẩm cao |  | N | @baghel2016, @airaksinen2005 |
