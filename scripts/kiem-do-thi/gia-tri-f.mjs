// Phép kiểm riêng đồ thị gia-tri-f: điểm khớp giaTriF() (< 1%), F = t tại Tref, mỗi z độ F gấp 10 lần.
import { giaTriF } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { T: 100, t: 3, Tref: 121.1, z: 7, D: 1.5 }, { T: 135, t: 0.5, Tref: 110, z: 15, D: NaN }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, giaTriF(v.t, v.T, v.Tref, v.z, 0).F, `điểm tại ${JSON.stringify(v)}`);
	}
	gan(mod.ve({ ...mod.macDinh, T: 120, Tref: 120 }).diem.y, mod.macDinh.t, 'tại T = Tref thì F = t', 1e-9);
	gan(mod.ve({ ...mod.macDinh, T: 130 }).diem.y / mod.ve({ ...mod.macDinh, T: 120 }).diem.y, 10, 'lên z độ thì F gấp 10 lần', 1e-9);
	ok(mod.ve({ ...mod.macDinh, t: 0 }) === null && mod.ve({ ...mod.macDinh, z: 0 }) === null, 't hoặc z không dương phải trả null');
}
