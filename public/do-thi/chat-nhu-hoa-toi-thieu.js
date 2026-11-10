// Đồ thị máy "chat-nhu-hoa-toi-thieu": lượng chất nhũ hóa tối thiểu theo d32 (khung chung: ../do-thi.js).
import { chatNhuHoaToiThieu, banKinhNhoNhat } from '../cong-thuc.js';
import { bieuDo, so, nhanK, nhanN } from '../do-thi.js';

export const macDinh = { phi: 0.2, d32: 1, gam: 2, cs: NaN };

export function ve(v) {
	const { phi, d32, gam, cs } = v;
	if (![phi, d32, gam].every((x) => x > 0) || phi >= 1) return null;
	const c = (dd) => chatNhuHoaToiThieu(phi, dd, gam).cGL;
	const c0 = (dd) => chatNhuHoaToiThieu(macDinh.phi, dd, macDinh.gam).cGL;
	const lo = Math.pow(10, Math.round(Math.log10(d32)) - 1), hi = lo * 100;
	// khung trục y cố định theo giá trị mặc định (φ = 0,2; Γ = 2 mg/m²): đổi φ hoặc Γ thì đường dịch thấy được
	const b = bieuDo({
		x: { min: lo, max: hi, log: true, nhan: 'Đường kính Sauter d32 (µm)' },
		y: { min: Math.pow(10, Math.floor(Math.log10(c0(hi))) - 2), max: Math.pow(10, Math.ceil(Math.log10(c0(lo))) + 2), log: true, nhan: 'Chất nhũ hóa tối thiểu (g/L)' },
	});
	let dMin = null;
	if (cs > 0) {
		dMin = banKinhNhoNhat(phi, gam, cs).dNm / 1000; // µm; trùng điểm c(d) = c_S
		b.vung(0, dMin, 'thiếu chất nhũ hóa');
		b.duong([[lo, cs], [hi, cs]], 'dt-duong-phu');
	}
	b.duong(c);
	const trongKhung = b.diem(d32, c(d32));
	const hang = [0, 1, 2, 3, 4, 5, 6].map((k) => {
		const dd = lo * Math.pow(10, k / 3);
		return [so(dd), so(c(dd))];
	});
	const them = dMin ? `Đường đứt ngang là lượng chất nhũ hóa có sẵn (${so(cs)} g/L); giọt nhỏ nhất đạt được d ≈ ${so(dMin * 1000)} nm (vùng xám bên trái là thiếu chất nhũ hóa) ${nhanN('mcclements2016', 'McClements 2016 tr.273')}. ` : '';
	return {
		svg: b.xuat('Lượng chất nhũ hóa tối thiểu theo đường kính giọt', `Đồ thị hai trục logarit: chất nhũ hóa tối thiểu tăng khi giọt nhỏ đi, tỉ lệ nghịch với d32. Điểm của bạn: d32 = ${so(d32)} µm, ${so(c(d32))} g/L.`),
		bang: { cot: ['d32 (µm)', 'c tối thiểu (g/L)'], hang },
		chuThich: `Đường là chính công thức c = Γ·6φ/d32 của máy, với φ = ${so(phi)} và Γ = ${so(gam)} mg/m². Giọt nhỏ đi 10 lần thì cần nhiều chất nhũ hóa gấp 10 lần. ${them}${phi > 0.74 ? 'φ lớn hơn 0,74: giọt buộc phải biến dạng, công thức giọt cầu không còn đúng. ' : ''}${trongKhung ? '' : 'Điểm của bạn nằm ngoài khung đồ thị. '}Đó là mức tối thiểu lý thuyết cho giọt cầu ${nhanK()}; đồ thị không nói lượng nên dùng thực tế (cần dư).`,
		diem: { x: d32, y: c(d32) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên φ và Γ, giảm d32 đi 10 lần thì lượng chất nhũ hóa tối thiểu cần để phủ kín giọt sẽ thế nào?',
	lua: ['Tăng 10 lần', 'Tăng 100 lần', 'Không đổi'],
	dung: 0,
	giaiThich: 'Diện tích bề mặt A = 6φ/d32 tăng 10 lần khi d32 giảm 10 lần, và chất nhũ hóa cần tỉ lệ thuận với A nên cũng tăng 10 lần.',
};
