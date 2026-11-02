---
title: "Bảng thông số cho phòng lab ảo (thực phẩm)"
slug: thong-so-phong-lab
khu: thuc-pham
thu_tu: 8
loai: bang
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-thuc-pham/cong-cu/build_thong_so.py
---
# Bảng thông số cho phòng lab ảo (thực phẩm)

File này **sinh tự động** từ `cong-cu/build_thong_so.py`; bản máy đọc là `thong-so-phong-lab.json` (có cả bảng 10 mầm bệnh đầy đủ). Sửa số: sửa script rồi chạy lại.

**Cách dùng cho mô phỏng**
- Dòng nhãn **N**: dùng được ngay làm *neo* hoặc *quy tắc*; kèm khóa nguồn.
- Dòng nhãn **K**: chỉ dùng nội bộ để mô phỏng; **không đăng số** lên web cho tới khi có số trang sách (quy ước của web nhũ tương).
- Dòng nhãn **T**: hằng số minh họa do mô hình chọn, phải hiện "minh họa" cạnh kết quả.
- "đầu ra neo" là giá trị đo thật mà mô hình nên tái tạo được (kiểm thử hồi quy cho lab).

| Mã | Tham số | Giá trị | Nhãn | Nguồn | Vai trò |
|---|---|---|---|---|---|
| `thit.pH0` | pH thịt ban đầu (pHu) | 5,4–5,6 (mẫu đối chứng thịt lợn: 5,45) (pH) | N | @sheard2004 | đầu vào |
| `thit.pI` | pI protein sợi cơ | 5,0–5,5 (dùng 5,2) (pH) | K | — | hằng số |
| `thit.stpp` | Liều STPP đã thử | 0,1–0,5 (cụ thể: 0,1; 0,2; 0,15; 0,3 trong các bài) (% khối lượng) | N | @maleki2026, @norazizi2025, @choi2020 | đầu vào |
| `thit.nacl` | NaCl trong sản phẩm | 0–3; tổ hợp 1,8% muối + 0,3% STPP cho kết cấu tốt nhất trong bài xúc xích gà (%) | N | @choi2020, @kang2020 | đầu vào |
| `thit.I_target` | Lực ion chuẩn để chiết/hòa tan protein sợi cơ | 0,6 (mol/L) | N | @shi2024, @yang2021nacl | hằng số |
| `thit.pH_sau_tiem` | pH sau tiêm muối + STPP ± bicarbonat (neo) | 5,75–5,97 so với 5,45 đối chứng; thịt bò: 5,99 (phosphat) so với 5,73 (amoniac) (pH) | N | @sheard2004, @cerruto2009 | đầu ra neo |
| `thit.nang_suat` | Năng suất sau nấu (neo) | 70% đối chứng → 85% (muối + STPP + bicarbonat) (%) | N | @sheard2004 | đầu ra neo |
| `thit.pH_sup` | Hiệu ứng pH quá cao với pyrophosphat | gel tốt ở pH 6–7; sụp ở pH 8–9; kết tủa ở pH 5,0 (pH) | N | @chen2019spp | quy tắc |
| `thit.T_gel` | Nhiệt độ gel hóa ảnh hưởng yield | 72 °C: gel cứng, trắng hơn, cooking yield thấp hơn 56 °C (°C) | N | @kang2021 | quy tắc |
| `thit.TBARS` | Thời gian TBARS đạt 2 mg MDA/kg (thịt trâu, 4 °C?) | 0% STPP: ngày 7; 0,15%: ngày 21; 0,3%: ngày 28 (ngày) | N | @norazizi2025 | đầu ra neo |
| `thit.ADI_EFSA` | ADI nhóm phosphat (EFSA 2019) | 40 (mg P/kg tt/ngày) | N | @efsa2019phos | quy định |
| `thit.MTDI_JECFA` | MTDI nhóm phosphat (JECFA 1982) | 70 (mg P/kg tt) | N | @jecfa-phosphoric | quy định |
| `thit.dpH_STPP` | Hiệu ứng nâng pH: dpH = dpH_max·c/(c+0,15) | dpH_max: STPP 0,5; TSPP 0,6; SHMP 0,1 (pH) | T | — | tham số mô hình |
| `vs.bang_FDA` | Giới hạn sinh trưởng mầm bệnh: [tên, aw_min, pH_min, %muối_max, T_min, T_max, oxy] | xem JSON (10 dòng)  | N | @fda-app4 | bộ luật |
| `vs.aw_nam` | Vùng aw nấm mốc/men gây hỏng | 0,61–0,85 (aw) | N | @beuchat1983 | quy tắc |
| `vs.aw_saureus` | aw tối thiểu S. aureus | 0,83–0,86 (khó mọc dưới 0,89 trong thực tế) (aw) | N | @troller2017, @scott1953 | quy tắc |
| `vs.pKa` | pKa axit yếu | sorbic 4,76; benzoic 4,20; propionic 4,87  | K | — | hằng số |
| `vs.MIC_HA` | MIC dạng chưa phân ly, hỗn hợp men ô liu (sorbic; benzoic) ở pH 4,5/4,0/3,5 | sorbic 5,94/3,85/3,19; benzoic không phát hiện/10,40/6,83 (mM) | N | @arroyolopez2008 | tham số mô hình |
| `vs.HA_vs_A` | Hiệu lực dạng chưa phân ly so với dạng phân ly (sorbic) | 10–600 lần; ở pH > 6 dạng phân ly vẫn gây > 50% ức chế  | N | @eklund1983 | tham số mô hình |
| `vs.FIC` | Hai chất bảo quản axit yếu | cộng gộp (ΣC/MIC ≥ 1 thì ức chế)  | N | @arroyolopez2008 | quy tắc |
| `nau.Ea_banh` | Ea hình thành acrylamide / chỉ số nâu khi nướng bánh quy | acrylamide 6,87–27,84; BI 19,54–35,36 (kJ/mol) | N | @isleroglu2012 | tham số |
| `nau.k_banh` | Hằng số bậc 1, bánh quy 165–195 °C | acrylamide 0,023–0,077; BI 0,019–0,063 (1/phút) | N | @isleroglu2012 | tham số |
| `nau.Ea_dd` | Ea nâu hóa dung dịch đường–glycin, aw 0,90 | glucose 25,7; fructose 29,3; sucrose 36,6 (kcal/mol) | N | @buera1987 | tham số |
| `nau.thu_tu_duong` | Thứ tự tốc độ màu ở pH 6 | xylose > glucose > fructose > lactose > maltose > sucrose  | N | @buera1987 | quy tắc |
| `nau.aw_dinh` | aw tại đỉnh nâu hóa (hệ glucose–lysine) | ≈ 0,89 / 0,74 / 0,67 cho ba nhiệt độ thử (aw) | N | @kim1987 | quy tắc |
| `nau.chip` | Hạ nhiệt chiên chip 190 → 160 °C (7 phút) giảm acrylamide | 84% / 67% / 78% (Atlantic / Snowden / Vigor) (%) | N | @liyanage2020 | neo |
| `nau.asparaginase` | Asparaginase giảm acrylamide | 45,6% (1 IU/mL, 37 °C, pH 7,3, 30 phút); 85% (500 U/mL, 45 °C, khoai lang); 76–93% khi phối Ca/phenol (%) | N | @pham2020, @demelo2025, @becker2026 | neo |
| `tb.duong` | Đường/polyol nâng nhiệt độ hồ hóa | ~ +8 °C; fructose ít nhất; isomalt, isomaltulose, sucrose nhiều (°C) | N | @allan2020, @li2024 | quy tắc |
| `tb.muoi` | Muối và thoái hóa | NaCl nâng Tgel hiệu quả nhất; KCl làm chậm thoái hóa hiệu quả nhất  | N | @li2023amylose | quy tắc |
| `tb.Tgel_loai` | Khoảng hồ hóa theo loại | khoai tây 58–68; lúa mì 52–64; ngô 62–72; gạo 68–78; sắn 52–65 (°C) | K | — | tham số |
| `tb.HDP` | HDP 9% trong thịt giả đùn ẩm cao (SPI–gluten) | DT 1,33 → 2,25; WHC 3,04; OHC 1,32 (g/g) | N | @wu2026hdp | neo |
| `pr.BLG` | β-lactoglobulin 70–95 °C: 2 bước (disulfide nhanh, rồi kỵ nước); bước 2 không thấy dưới 85 °C | Ca 6,6 mmol/L (°C) | N | @petit2012 | quy tắc |
| `pr.myosin_muoi` | Muối dịch đỉnh biến tính myosin lên cao và làm G′ tăng ở nhiệt thấp hơn | 1–3 g/100 g NaCl  | N | @tahergorabi2012 | quy tắc |
| `pr.Td` | Nhiệt độ biến tính đại diện | β-LG 65–70; α-La 60–65; myosin 45–60; actin 75–80; 7S 70–75; 11S 85–95; ovotransferrin 61–65; ovalbumin 80–84; gelatin tan 30–35 (°C) | K | — | tham số |
| `qt.D_z_F` | D, z, F | D(T)=D_ref·10^((Tref−T)/z); F0: Tref 121,1 °C, z 10 °C; 12D botulinum ≈ F0 2,5–3 phút; D121,1 proteolytic ≈ 0,1–0,25 phút (phút) | K | — | công thức |
| `qt.dong_lanh` | Nước không đóng băng sucrose; tỷ lệ chất tan sau đông tập trung tối đa | 0,25 g nước/g sucrose; ~80% chất tan, 20% nước  | N | @roos2021 | neo |
| `qt.Tg_prime` | Tg′ đại diện | sucrose ≈ −32; glucose ≈ −43; fructose ≈ −42; maltodextrin DE10 ≈ −20 (°C) | K | — | tham số |
| `qt.bot_sua` | Bột sữa mô hình: Tg < 0 °C ở aw | 0,43 (WPI–lactose); 0,54 (casein–whey–lactose) (aw) | N | @yan2022lactose | neo |
| `qt.dun` | Ép đùn ẩm cao đậu nành (SPI:SPC 1:9), Clextral Evolum 25, L/D 24 | nhiệt: LT 30-50-75-105-115-120; HT 30-70-95-115-125-140 °C; 300–400 rpm; ẩm 69%; khuôn 80 °C  | N | @ribeiro2024 | tham số |
| `qd.sorbat` | ADI nhóm sorbat (JECFA) | 0–25 (mg/kg tt/ngày (tính theo sorbic acid)) | N | @jecfa-sorbate | quy định |
| `qd.benzoat` | ADI nhóm benzoat (JECFA 2021) | 0–20 (mg/kg tt/ngày (tính theo benzoic acid)) | N | @jecfa-benzoic | quy định |
| `qd.nitrit` | ADI nitrit | EFSA 0,07; JECFA 0–0,07 (tính theo nitrit ion) (mg/kg tt/ngày) | N | @efsa2017nitrite, @jecfa-nitrite | quy định |
| `qd.nitrat` | ADI nitrat (EFSA giữ ADI SCF 1997) | 3,7 (mg/kg tt/ngày) | N | @efsa2017nitrate | quy định |
| `qd.sulfit` | Sulfit (EFSA 2022): rút ADI tạm 0,7; BMDL 38 mg SO2/kg tt/ngày; MOE < 80 ở hầu hết nhóm | - (mg SO2/kg tt/ngày) | N | @efsa2022sulfite | quy định |
| `qd.aspartame` | ADI aspartame | 0–40 (mg/kg tt/ngày) | N | @jecfa-aspartame | quy định |
| `qd.acek` | ADI acesulfame K | 0–15 (mg/kg tt/ngày) | N | @jecfa-acek | quy định |
| `qd.sucralose` | ADI sucralose | 0–15 (mg/kg tt/ngày) | N | @jecfa-sucralose | quy định |
| `qd.stevia` | ADI steviol glycosid | 0–4 (tính theo steviol) (mg/kg tt/ngày) | N | @jecfa-stevia | quy định |
| `qd.MSG` | ADI nhóm glutamat (EFSA 2017) | 30 (tính theo glutamic acid) (mg/kg tt/ngày) | N | @efsa2017glu | quy định |
| `qd.BHA_BHT` | ADI BHA; BHT (JECFA) | 0–0,5 (1988); 0–0,3 (1995) (mg/kg tt/ngày) | N | @jecfa-bha, @jecfa-bht | quy định |
| `qd.tinh_bot_bt` | Tinh bột biến tính E 1404–1452 (EFSA 2017) | không cần ADI số  | N | @efsa2017starch | quy định |
| `qd.ascorbic` | Ascorbic acid (JECFA 1981) | ADI không quy định (nhóm)  | N | @jecfa-ascorbic | quy định |
| `mau.antho` | Anthocyanin: đỏ (axit) → xanh khi pH tăng; bốn dạng flavylium / carbinol / quinoidal / chalcone | pH < 2–3; 4–5; 6–8; cao (pH) | N | @alappat2020, @khoo2017 | quy tắc |

## Công thức đề xuất (tóm tắt; chi tiết ở các file 01–07)

```
Arrhenius      k(T)=k_ref·exp[−Ea/R·(1/T−1/T_ref)]          # nâu hóa, mất màu, oxy hóa lipid (K)
Phần chưa phân ly   f=1/(1+10^(pH−pKa))                      # chất bảo quản axit yếu (K) + hiệu ứng dạng phân ly (N)
Hàng rào cộng gộp   Σ c_i/MIC_i ≥ 1 → ức chế                 # (N: arroyolopez2008)
Luật cardinal       mọc nếu aw≥aw_min và pH≥pH_min và T_min≤T≤T_max và %muối≤max   # (N: fda-app4)
Thanh trùng         D(T)=D_ref·10^((T_ref−T)/z); F=∫10^((T−T_ref)/z)dt                # (K)
Hồ hóa tinh bột     Tgel=Tgel0+a_đường·C_đường+a_NaCl·C_NaCl                          # xu hướng (N), hằng số (T)
GAB                 M=M0·C·K·aw/[(1−K·aw)(1−K·aw+C·K·aw)]                            # (K)
```

Kiểm thử hồi quy (nên có trong lab): (1) pH thịt 5,45 + muối + STPP + bicarbonat → pH ≈ 5,75–5,97 và yield ≈ 85% `@sheard2004`; (2) bánh quy 165 → 195 °C phải làm acrylamide và BI tăng bậc 1 với k trong khoảng đã nêu `@isleroglu2012`; (3) chip 190 → 160 °C giảm acrylamide 67–84% `@liyanage2020`; (4) *S. aureus* tại aw 0,80 không mọc, tại aw 0,90 mọc `@fda-app4`.
