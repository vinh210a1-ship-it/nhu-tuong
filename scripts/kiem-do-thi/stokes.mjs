// Phép kiểm riêng của đồ thị stokes: điểm "của bạn" phải đúng công thức của máy, đường phải dốc bình phương.
import { stokes } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	// ba bộ đầu vào, lệch < 1% so với công thức của máy
	for (const v of [mod.macDinh, { d: 3.7, rc: 1020, rd: 910, eta: 12, ngay: 90 }, { d: 25, rc: 1000, rd: 1050, eta: 0.9, ngay: 7 }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, Math.abs(stokes(v.d, v.rc, v.rd, v.eta).mmMoiNgay), `điểm tại ${JSON.stringify(v)}`);
	}
	// v ∝ d²: gấp đôi d thì quãng gấp 4 (ở hai điểm của đồ thị)
	const a = mod.ve({ ...mod.macDinh, d: 2 }).diem.y, b = mod.ve({ ...mod.macDinh, d: 4 }).diem.y;
	gan(b / a, 4, 'gấp đôi d phải gấp 4 quãng', 1e-9);
	// bằng tỷ trọng thì v = 0, không vẽ được trên trục log
	ok(mod.ve({ ...mod.macDinh, rd: 1000 }) === null, 'Δρ = 0 phải trả null');
}
