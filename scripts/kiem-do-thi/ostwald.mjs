// Phép kiểm riêng của đồ thị ostwald: đường khớp phải là đúng hồi quy d³ theo t của máy.
import { ostwald } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) <= sai * Math.abs(b), `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	const bo = [
		mod.macDinh,
		{ t0: 0, d0: 1.2, t1: 3, d1: 1.31, t2: 6, d2: 1.4, t3: 10, d3: 1.52, t4: 14, d4: 1.6, du: 30 },
		{ t0: 1, d0: 0.15, t1: 5, d1: 0.18, t2: 9, d2: 0.2, t3: NaN, d3: NaN, t4: NaN, d4: NaN, du: 60 }, // chỉ ba lần đo, hai dòng để trống
	];
	for (const v of bo) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (!r) continue;
		const ds = [0, 1, 2, 3, 4].map((i) => [v[`t${i}`], v[`d${i}`]]).filter(([t, d]) => isFinite(t) && d > 0);
		const k = ostwald(ds);
		const [[xa, ya], [xb, yb]] = r.duong;
		gan(r.doDoc, k.doDocD3, 'độ dốc');
		gan((yb - ya) / (xb - xa), k.doDocD3, 'độ dốc của đoạn thẳng đã vẽ');
		gan(ya, k.d3Dau + k.doDocD3 * xa, 'đầu đường khớp');
		gan(r.diem.y, k.d3Dau + k.doDocD3 * r.diem.x, 'điểm cuối đường khớp');
		ok(xb === Math.max(...ds.map(([t]) => t)), 'đường khớp không được kéo quá lần đo cuối (không ngoại suy)');
		ok((r.svg.match(/class="dt-diem"/g) || []).length === ds.length + 1, 'số chấm phải bằng số lần đo (cộng một chấm ở chú giải)');
		ok(r.bang.hang.length === ds.length, 'bảng phải có một dòng cho mỗi lần đo');
	}
	ok(mod.ve({ ...mod.macDinh }).svg.includes('dt-ngoai') && mod.ve({ ...mod.macDinh }).chuThich.includes('ngoài vùng có dữ liệu'), 'phải tô xám và ghi "ngoài vùng có dữ liệu" sau lần đo cuối');
	ok(mod.doanTruoc.dung === 2, 'đáp án đoán trước phải là d³');
	// dưới 3 lần đo hoặc trùng thời điểm thì máy báo lỗi, đồ thị không vẽ
	ok(mod.ve({ t0: 0, d0: 0.2, t1: 7, d1: 0.21, t2: NaN, d2: NaN, t3: NaN, d3: NaN, t4: NaN, d4: NaN, du: 90 }) === null, 'hai lần đo phải trả null');
	ok(mod.ve({ ...mod.macDinh, t1: 0, t2: 0, t3: 0 }) === null, 'dưới 3 thời điểm khác nhau phải trả null');
}
