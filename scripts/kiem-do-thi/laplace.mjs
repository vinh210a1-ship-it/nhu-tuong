// Phép kiểm riêng đồ thị laplace: điểm "của bạn" khớp laplace() của máy (< 1%), ΔP ∝ 1/d.
import { laplace } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { g: 0.5, d: 0.2 }, { g: 40, d: 35 }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, laplace(v.g, v.d).bar, `điểm tại ${JSON.stringify(v)}`);
	}
	gan(mod.ve({ ...mod.macDinh, d: 2 }).diem.y * 2, mod.ve({ ...mod.macDinh, d: 1 }).diem.y, 'gấp đôi d thì ΔP giảm một nửa', 1e-9);
	gan(mod.ve({ g: 10, d: 1 }).diem.y, 0.4, 'ví dụ trong bài: γ = 10 mN/m, d = 1 µm cho 0,4 bar');
	ok(mod.ve({ ...mod.macDinh, d: -1 }) === null && mod.ve({ ...mod.macDinh, g: 0 }) === null, 'đầu vào không dương phải trả null');
}
