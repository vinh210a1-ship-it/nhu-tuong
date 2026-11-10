// Phép kiểm riêng đồ thị arrhenius: điểm ngoại suy khớp arrhenius() (< 1%), số chấm bằng số cặp hợp lệ, đường qua điểm hồi quy.
import { arrhenius } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	const bo = [mod.macDinh, { ...mod.macDinh, dich: 4, c0: 60, t0: 300, c1: 70, t1: 140, c2: 80, t2: 65, c3: 90, t3: 30 }, { ...mod.macDinh, dich: 37, c0: 50, t0: 800, c1: 65, t1: 300, c2: NaN, t2: NaN, c3: NaN, t3: NaN }];
	for (const v of bo) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (!r) continue;
		const diem = [0, 1, 2, 3].map((i) => [v[`c${i}`], v[`t${i}`]]).filter(([c, t]) => isFinite(c) && t > 0);
		const k = arrhenius(diem);
		gan(r.diem.y, Math.log(k.thoiGianTai(v.dich)), `ln t ngoại suy tại ${v.dich} °C`);
		gan(r.diem.x, 1000 / (v.dich + 273.15), 'hoành độ 1000/T');
		ok((r.svg.match(/class="dt-cham"/g) || []).length === diem.length, `số chấm số đo phải bằng ${diem.length}`);
		ok(r.bang.hang.length === diem.length + 1, 'bảng phải có một dòng mỗi cặp số đo và một dòng ngoại suy');
	}
	ok(mod.ve({ ...mod.macDinh, c1: 90 , c0: 90, c2: NaN, c3: NaN, t2: NaN, t3: NaN }) === null, 'hai nhiệt độ giống nhau thì không hồi quy được, phải trả null');
	ok(mod.ve({ ...mod.macDinh, t0: 2, t1: 4.2, t2: 9, t3: 20 }) === null, 'thời gian dài hơn khi nhiệt độ cao hơn (Ea ≤ 0) phải trả null');
}
