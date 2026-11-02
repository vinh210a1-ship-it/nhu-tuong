// Kiểm máy tính với các bảng ví dụ [T] trong bài (nhũ tương 01 mục 2.2 và 03 mục kem hóa).
// Chạy: npm run kiem
import { stokes, chatNhuHoaToiThieu, hlbTron, hlbPhanA, q10DoiThoiGian, arrhenius, laplace, lucIon, debye, pickering, ostwald, totox, ivSv, mAcidBeo, phanChuaPhanLy, giaTriF } from '../public/cong-thuc.js';

let loi = 0;
function gan(ten, thuc, mong, saiSo = 0.05) {
	const ok = Math.abs(thuc - mong) / Math.abs(mong) <= saiSo;
	if (!ok) loi++;
	console.log(`${ok ? 'ĐẠT ' : 'SAI '} ${ten}: tính ${thuc.toPrecision(3)}, bảng ${mong}`);
}

// Bảng Stokes: Δρ = 80 kg/m³, η = 1 mPa·s (bài 03). Cột "quãng đường mỗi ngày" (mm).
for (const [d, v, mm] of [
	[0.1, 4.4e-10, 0.04],
	[0.5, 1.1e-8, 0.94],
	[1, 4.4e-8, 3.8],
	[2, 1.7e-7, 15],
	[5, 1.1e-6, 94],
	[10, 4.4e-6, 377],
	[20, 1.7e-5, 1500],
]) {
	const kq = stokes(d, 1000, 920, 1);
	gan(`Stokes v, d=${d} µm`, kq.v, v, 0.06);
	gan(`Stokes mm/ngày, d=${d} µm`, kq.mmMoiNgay, mm, 0.06);
}
// Nhận xét trong bài: d = 1 µm, η = 10 mPa·s ≈ 0,38 mm/ngày; 100 mPa·s ≈ 0,04 mm/ngày
gan('Stokes η=10', stokes(1, 1000, 920, 10).mmMoiNgay, 0.38);
gan('Stokes η=100', stokes(1, 1000, 920, 100).mmMoiNgay, 0.038, 0.06);

// Bảng diện tích (φ = 0,2) và lượng chất nhũ hóa (Γ = 2 mg/m²) (bài 01)
for (const [d, A] of [[10, 1.2e5], [1, 1.2e6], [0.2, 6.0e6]]) gan(`A, d32=${d}`, chatNhuHoaToiThieu(0.2, d, 2).A, A);
for (const [d, c] of [[5, 0.5], [1, 2.4], [0.3, 8]]) gan(`c_min, d32=${d}`, chatNhuHoaToiThieu(0.2, d, 2).cGL, c, 0.05);

// HLB trộn: phép tính số học, kiểm bằng ví dụ tự đặt (không phải số của chất thật)
gan('HLB 50:50 của 4 và 15', hlbTron(4, 15, 0.5), 9.5, 1e-9);
gan('HLB 30% A (4) + 70% B (15)', hlbTron(4, 15, 0.3), 11.7, 1e-9);
gan('Phần A để đạt HLB 11,7', hlbPhanA(4, 15, 11.7), 0.3, 1e-9);
if (hlbPhanA(4, 15, 16) !== null) { loi++; console.log('SAI  HLB mục tiêu ngoài khoảng phải trả null'); } else console.log('ĐẠT  HLB mục tiêu ngoài khoảng trả null');

// Q10: 10 ngày ở 45 °C, Q10 = 2 -> 25 °C: 10·2² = 40 ngày
gan('Q10 = 2, 45→25 °C', q10DoiThoiGian(10, 45, 25, 2), 40, 1e-9);
// Arrhenius: dựng dữ liệu đúng từ Ea = 80 kJ/mol rồi khớp lại phải ra đúng Ea, R² = 1, ngoại suy đúng
{
	const Ea = 80000, A = 1e-11;
	const t = (c) => A * Math.exp(Ea / (8.314 * (c + 273.15)));
	const k = arrhenius([90, 100, 110, 120].map((c) => [c, t(c)]));
	gan('Arrhenius Ea khớp lại', k.EaKJ, 80, 1e-6);
	gan('Arrhenius R²', k.r2, 1, 1e-9);
	gan('Arrhenius ngoại suy 25 °C', k.thoiGianTai(25), t(25), 1e-6);
	gan('Q10 quanh 25 °C từ Ea 80', k.q10Tai(25), t(25) / t(35), 1e-6);
}

// ---- Đợt 3: đối chiếu bảng ví dụ [T] trong bài
// Laplace (nhũ tương 01 mục 3.1): ΔP = 4γ/d
for (const [d, g, bar] of [[10, 10, 0.04], [1, 10, 0.4], [0.2, 10, 2], [0.1, 5, 2]]) gan(`Laplace d=${d} γ=${g}`, laplace(g, d).bar, bar);
// Debye (nhũ tương 03): 1 mM 9,6 nm; 10 mM 3,0; 100 mM 0,96; 150 mM 0,78
for (const [I, k] of [[0.001, 9.6], [0.01, 3.0], [0.1, 0.96], [0.15, 0.78]]) gan(`Debye I=${I}`, debye(I), k);
gan('Lực ion CaCl₂ 0,01 M = 0,03', lucIon([[0.01, 2], [0.02, 1]]), 0.03, 0.001);
// Pickering (nhũ tương 05, công thức [N: schroen2024], bảng [T]): r 50 nm, γ 30 mN/m
gan('Pickering θ=90°', pickering(50, 30, 90).kT, 5.7e4);
gan('Pickering θ=30°', pickering(50, 30, 30).kT, 1.0e3, 0.06);
// Ostwald: dữ liệu dựng sẵn d³ tuyến tính tuyệt đối -> R² = 1, độ dốc đúng
{
	const diem = [0, 1, 2, 3, 4].map((t) => [t, Math.cbrt(0.008 + 0.002 * t)]);
	const k = ostwald(diem);
	gan('Ostwald R² d³ = 1', k.r2D3, 1, 1e-9);
	gan('Ostwald độ dốc d³', k.doDocD3, 0.002, 1e-6);
	gan('Ostwald ω = độ dốc/8', k.omegaR3, 0.00025, 1e-6);
}
gan('TOTOX 2·5 + 10 = 20', totox(5, 10), 20, 0);
// IV, SV theo tỉ lượng: khớp số trong bài chất béo 01 (oleic 89,9; linoleic 181,1; linolenic 273,5; tristearin SV 188,8)
gan('IV acid oleic', ivSv([[18, 1, 100]]).iv, 89.9, 0.002);
gan('IV acid linoleic', ivSv([[18, 2, 100]]).iv, 181.1, 0.002);
gan('IV acid linolenic', ivSv([[18, 3, 100]]).iv, 273.5, 0.002);
gan('SV tristearin', ivSv([[18, 0, 100]]).sv, 188.8, 0.002);
gan('IV triolein (dạng dầu)', ivSv([[18, 1, 100]]).ivDau, 86.0, 0.002);
gan('M(TAG) tristearin', ivSv([[18, 0, 100]]).mTAG, 891.5, 0.002);
gan('M acid stearic', mAcidBeo(18, 0), 284.48, 0.001);
// Axit yếu: pH = pKa -> 50%; pH = pKa + 1 -> 1/11
gan('Axit yếu pH = pKa', phanChuaPhanLy(4, 4), 0.5, 1e-9);
gan('Axit yếu pH = pKa + 1', phanChuaPhanLy(5, 4), 1 / 11, 1e-9);
// F: ở T = T_ref, F = t; giảm z độ thì F giảm 10 lần
gan('F tại T_ref', giaTriF(10, 121.1, 121.1, 10, 0.2).F, 10, 1e-9);
gan('F giảm z độ', giaTriF(10, 111.1, 121.1, 10, 0.2).F, 1, 1e-9);
gan('Số log giảm = F/D', giaTriF(10, 121.1, 121.1, 10, 0.2).logGiam, 50, 1e-9);

console.log(loi ? `\n${loi} phép kiểm SAI` : '\nTất cả phép kiểm ĐẠT');
process.exit(loi ? 1 : 0);
