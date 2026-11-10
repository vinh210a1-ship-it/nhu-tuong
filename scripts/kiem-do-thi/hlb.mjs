// Phép kiểm riêng của đồ thị hlb: điểm "của bạn" đúng công thức của máy, ba dải O/W đúng số trong bài.
import fs from 'node:fs';
import { hlbTron, hlbPhanA } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { a: 4.3, b: 15, wa: 62, muc: 10 }, { a: 16.7, b: 1.8, wa: 12.5, muc: NaN }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, hlbTron(v.a, v.b, v.wa / 100), `điểm tại ${JSON.stringify(v)}`);
	}
	// trộn 50/50 ra đúng giữa (đáp án của câu đoán trước)
	gan(mod.ve({ a: 4, b: 15, wa: 50, muc: NaN }).diem.y, 9.5, 'trộn 50/50 phải ra trung bình cộng', 1e-9);
	ok(mod.doanTruoc.dung === 1, 'đáp án đoán trước phải là "Đúng giữa hai giá trị"');
	// đường mục tiêu: có khi mục tiêu nằm giữa hai chất (và chú thích ghi đúng phần A của máy), không có khi mục tiêu ngoài khoảng
	const r = mod.ve({ ...mod.macDinh });
	ok(r.svg.includes('dt-duong-phu') && r.chuThich.includes(`${(hlbPhanA(4, 15, 12) * 100).toLocaleString('vi-VN', { maximumSignificantDigits: 3 })}% A`), 'thiếu đường HLB mục tiêu hoặc phần A cần pha');
	ok(!mod.ve({ ...mod.macDinh, muc: 18 }).svg.includes('dt-duong-phu'), 'mục tiêu ngoài khoảng A–B thì không vẽ đường mục tiêu');
	// ba dải lấy từ bài: số trong đồ thị phải còn nguyên trong bài nguồn, kèm đúng khóa nguồn
	const bai = fs.readFileSync('noi-dung/chat-nhu-hoa/01-nen-tang-vat-ly-hoa-be-mat.md', 'utf8');
	for (const [dai, khoa] of [['8–18', '@griffin1949a tr.314'], ['10–18', '@mcclements2016 tr.134–135'], ['9–12', '@griffin1949a tr.313–314']]) {
		ok(r.svg.includes(`>${dai}: `) && r.chuThich.includes(`${dai} là `), `đồ thị thiếu dải ${dai}`);
		ok(bai.includes(dai) && bai.includes(khoa), `bài nguồn không còn dải ${dai} hoặc khóa ${khoa}: phải sửa đồ thị theo bài`);
	}
	ok(mod.ve({ ...mod.macDinh, a: 41 }) === null && mod.ve({ ...mod.macDinh, wa: 120 }) === null, 'HLB ngoài 0–40 hoặc phần khối lượng ngoài 0–100% phải trả null như máy');
	ok(mod.ve({ ...mod.macDinh, a: 38 })?.svg.includes('>40<'), 'chất có HLB trên 20 thì trục phải mở tới 40');
}
