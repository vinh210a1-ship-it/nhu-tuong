// Phép kiểm riêng của đồ thị axit-yeu: điểm "của bạn" đúng công thức của máy, pH = pKa cho đúng 50%.
import { phanChuaPhanLy } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { pH: 3.8, pKa: 4.76, c: 500 }, { pH: 6.5, pKa: 4.2, c: NaN }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, phanChuaPhanLy(v.pH, v.pKa) * 100, `điểm tại ${JSON.stringify(v)}`);
	}
	// pH = pKa cho đúng một nửa (đáp án của câu đoán trước); cao hơn pKa 2 đơn vị còn dưới 1%
	gan(mod.ve({ pH: 4.5, pKa: 4.5, c: 0 }).diem.y, 50, 'pH = pKa phải cho 50%', 1e-9);
	ok(mod.doanTruoc.dung === 1, 'đáp án đoán trước phải là "Đúng một nửa"');
	gan(mod.ve({ pH: 6.5, pKa: 4.5, c: 0 }).diem.y, 100 / 101, 'pH = pKa + 2 phải cho 100/101 %', 1e-9);
	// mốc pH = pKa chỉ vẽ khi pKa nằm trong khung pH 2–8
	ok(mod.ve({ ...mod.macDinh }).svg.includes('pH = pKa'), 'thiếu nhãn mốc pH = pKa');
	ok(!mod.ve({ pH: 5, pKa: 9.5, c: 0 }).svg.includes('pH = pKa'), 'pKa ngoài khung thì không vẽ mốc');
	ok(mod.ve({ pH: 5, pKa: NaN, c: 0 }) === null, 'pKa là NaN phải trả null');
	const ngoai = mod.ve({ pH: 9, pKa: 4.5, c: 0 });
	ok(ngoai && !ngoai.svg.includes('class="dt-diem"') && ngoai.chuThich.includes('ngoài khung'), 'pH ngoài khung phải được báo trong chú thích và không vẽ chấm');
}
