// Phép kiểm riêng của đồ thị debye: điểm "của bạn" phải đúng lực ion và độ dài Debye mà máy tính ra.
import { lucIon, debye } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	// lực ion tính lại độc lập theo định nghĩa I = ½ Σ c z² (mM): 1:1 góp c, 2:1 và 1:2 góp 3c
	for (const v of [mod.macDinh, { c11: 150, c21: 0, c12: 0 }, { c11: 20, c21: 5, c12: 2.5 }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (!r) continue;
		const mM = v.c11 + 3 * v.c21 + 3 * v.c12;
		gan(r.diem.x, mM, `lực ion tại ${JSON.stringify(v)}`, 1e-9);
		gan(r.diem.y, debye(mM / 1000), `κ⁻¹ tại ${JSON.stringify(v)}`);
		gan(r.diem.x / 1000, lucIon([[v.c11 / 1000, 1], [v.c11 / 1000, 1], [v.c21 / 1000, 2], [(2 * v.c21) / 1000, 1], [(2 * v.c12) / 1000, 1], [v.c12 / 1000, 2]]), 'lực ion theo hàm của máy', 1e-9);
	}
	// muối tăng 100 lần thì κ⁻¹ mỏng đi 10 lần (đáp án của câu đoán trước)
	gan(mod.ve({ c11: 1, c21: 0, c12: 0 }).diem.y / mod.ve({ c11: 100, c21: 0, c12: 0 }).diem.y, 10, 'muối ×100 thì κ⁻¹ phải ÷10', 1e-9);
	ok(mod.doanTruoc.dung === 0, 'đáp án đoán trước phải là "Mỏng đi 10 lần"');
	// ô 2:1 và 1:2 để trống (NaN) thì coi là 0 như máy; không có muối nào hoặc nồng độ âm thì không vẽ
	ok(mod.ve({ c11: 10, c21: NaN, c12: NaN })?.diem.x === 10, 'ô muối 2:1, 1:2 để trống phải coi là 0 như máy');
	ok(mod.ve({ c11: 0, c21: 0, c12: 0 }) === null, 'I = 0 phải trả null');
	ok(mod.ve({ c11: 10, c21: -1, c12: 0 }) === null, 'nồng độ âm phải trả null');
	// điểm ngoài khung 1–1000 mM: vẫn trả kết quả, không vẽ chấm, chú thích báo rõ
	const ngoai = mod.ve({ c11: 0.1, c21: 0, c12: 0 });
	ok(ngoai && !ngoai.svg.includes('class="dt-diem"') && ngoai.chuThich.includes('ngoài khung'), 'điểm ngoài khung phải được báo trong chú thích và không vẽ chấm');
}
