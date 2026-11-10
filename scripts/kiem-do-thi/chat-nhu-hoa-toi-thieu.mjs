// Phép kiểm riêng đồ thị chat-nhu-hoa-toi-thieu: điểm khớp chatNhuHoaToiThieu() (< 1%), c ∝ 1/d32, giao điểm với c_S khớp Eq. 6.11.
import { chatNhuHoaToiThieu, banKinhNhoNhat } from '../../public/cong-thuc.js';

export default function (mod, ok) {
	const gan = (a, b, tn, sai = 0.01) => ok(Math.abs(a - b) / Math.abs(b) <= sai, `${tn}: đồ thị ${a} ≠ công thức ${b}`);
	for (const v of [mod.macDinh, { phi: 0.05, d32: 0.3, gam: 4, cs: NaN }, { phi: 0.5, d32: 12, gam: 1.5, cs: NaN }]) {
		const r = mod.ve({ ...v });
		ok(r !== null, `ve trả null với đầu vào hợp lệ ${JSON.stringify(v)}`);
		if (r) gan(r.diem.y, chatNhuHoaToiThieu(v.phi, v.d32, v.gam).cGL, `điểm tại ${JSON.stringify(v)}`);
	}
	gan(mod.ve({ ...mod.macDinh, d32: 0.1 }).diem.y / mod.ve({ ...mod.macDinh, d32: 1 }).diem.y, 10, 'd32 nhỏ đi 10 lần thì c tăng 10 lần', 1e-9);
	gan(mod.ve({ phi: 0.2, d32: 1, gam: 2, cs: NaN }).diem.y, 2.4, 'ví dụ trong bài: φ = 0,2, d32 = 1 µm, Γ = 2 mg/m² cho ≈ 2,4 g/L', 0.02);
	// có c_S: vẽ đường c_S và vùng thiếu; ví dụ sách tr.273 (φ = 0,1, Γ = 2, c_S = 10) cho d ≈ 120 nm
	const r = mod.ve({ phi: 0.1, d32: 0.5, gam: 2, cs: 10 });
	ok(r.svg.includes('dt-duong-phu') && r.svg.includes('dt-ngoai'), 'có c_S thì phải vẽ đường c_S và vùng xám thiếu chất nhũ hóa');
	gan(banKinhNhoNhat(0.1, 2, 10).dNm, 120, 'khớp ví dụ sách (r_min = 60 nm)', 0.01);
	ok(mod.ve({ ...mod.macDinh, phi: 1 }) === null, 'φ ≥ 1 phải trả null');
}
