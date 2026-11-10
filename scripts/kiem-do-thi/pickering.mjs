// Phép kiểm riêng đồ thị pickering: điểm khớp pickering() (< 1%), cao nhất và đối xứng quanh 90°, ví dụ trong bài.
import { pickering } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { r: 200, g: 12, th: 40, T: 5 }, { r: 8, g: 45, th: 140, T: 60 }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, pickering(v.r, v.g, v.th, v.T + 273.15).kT, `điểm tại ${JSON.stringify(v)}`);
	}
	gan(mod.ve({ r: 50, g: 30, th: 90, T: 25 }).diem.y, 5.7e4, 'ví dụ trong bài: r = 50 nm, γ = 30 mN/m, θ = 90° cho ≈ 5,7 × 10⁴ kT', 0.02);
	gan(mod.ve({ ...mod.macDinh, th: 60 }).diem.y, mod.ve({ ...mod.macDinh, th: 120 }).diem.y, 'đối xứng: θ và 180° − θ cho cùng ΔE', 1e-9);
	ok(mod.ve({ ...mod.macDinh, th: 90 }).diem.y > mod.ve({ ...mod.macDinh, th: 80 }).diem.y, 'ΔE phải cao nhất ở θ = 90°');
	ok(mod.ve({ ...mod.macDinh, th: 181 }) === null && mod.ve({ ...mod.macDinh, th: -1 }) === null, 'θ ngoài 0–180° phải trả null');
}
