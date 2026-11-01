// Kiểm máy tính với các bảng ví dụ [T] trong bài (nhũ tương 01 mục 2.2 và 03 mục kem hóa).
// Chạy: npm run kiem
import { stokes, chatNhuHoaToiThieu } from '../public/cong-thuc.js';

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

console.log(loi ? `\n${loi} phép kiểm SAI` : '\nTất cả phép kiểm ĐẠT');
process.exit(loi ? 1 : 0);
