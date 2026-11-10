// Đồ thị máy "laplace": ΔP = 4γ/d theo d, hai trục logarit (khung chung: ../do-thi.js).
import { laplace } from '../cong-thuc.js';
import { bieuDo, so, nhanK } from '../do-thi.js';

export const macDinh = { g: 10, d: 1 };

export function ve(v) {
	const { g, d } = v;
	if (!(g > 0 && d > 0)) return null;
	const bar = (dd) => laplace(g, dd).bar;
	const bar0 = (dd) => laplace(macDinh.g, dd).bar;
	const lo = Math.pow(10, Math.round(Math.log10(d)) - 1), hi = lo * 100;
	// khung trục y cố định theo giá trị mặc định (γ = 10 mN/m): đổi γ thì đường dịch lên xuống thấy được
	const b = bieuDo({
		x: { min: lo, max: hi, log: true, nhan: 'Đường kính giọt d (µm)' },
		y: { min: Math.pow(10, Math.floor(Math.log10(bar0(hi))) - 2), max: Math.pow(10, Math.ceil(Math.log10(bar0(lo))) + 1), log: true, nhan: 'ΔP Laplace (bar)' },
	});
	b.duong(bar);
	const trongKhung = b.diem(d, bar(d));
	const hang = [0, 1, 2, 3, 4, 5, 6].map((k) => {
		const dd = lo * Math.pow(10, k / 3);
		return [so(dd), so(bar(dd))];
	});
	return {
		svg: b.xuat('Áp suất Laplace theo đường kính giọt', `Đồ thị hai trục logarit: áp suất Laplace trong giọt giảm khi giọt to ra, tỉ lệ nghịch với d. Điểm của bạn: d = ${so(d)} µm, ΔP = ${so(bar(d))} bar.`),
		bang: { cot: ['d (µm)', 'ΔP (bar)'], hang },
		chuThich: `Đường là chính công thức của máy với γ = ${so(g)} mN/m, quét d. Trên hai trục logarit đường dốc xuống: giọt nhỏ đi 10 lần thì ΔP tăng 10 lần. ${trongKhung ? '' : 'Điểm của bạn nằm ngoài khung đồ thị. '}Đồ thị là giá trị cân bằng ${nhanK()}: lúc giọt vừa tạo ra γ động cao hơn nên ΔP thực cao hơn; nó cũng không nói áp suất cần đặt lên máy đồng hóa.`,
		diem: { x: d, y: bar(d) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên sức căng bề mặt γ, giọt nhỏ đi một nửa thì áp suất Laplace trong giọt sẽ thế nào?',
	lua: ['Giảm một nửa', 'Không đổi', 'Tăng gấp đôi'],
	dung: 2,
	giaiThich: 'ΔP = 4γ/d tỉ lệ nghịch với d: giọt nhỏ đi một nửa thì ΔP gấp đôi. Giọt càng nhỏ càng khó bẻ tiếp.',
};
