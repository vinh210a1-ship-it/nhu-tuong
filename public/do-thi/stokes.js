// Đồ thị MẪU cho máy "stokes" (khung chung: ../do-thi.js). Nửa A có thể sửa file này cho đúng thiết kế.
import { stokes } from '../cong-thuc.js';
import { bieuDo, so, nhanK } from '../do-thi.js';

export const macDinh = { d: 1, rc: 1000, rd: 920, eta: 1, ngay: 30 };

export function ve(v) {
	const { d, rc, rd, eta } = v;
	if (![d, rc, eta].every((t) => t > 0) || !(rd > 0)) return null;
	const mm = (dd) => Math.abs(stokes(dd, rc, rd, eta).mmMoiNgay);
	if (!(mm(d) > 0)) return null; // tỷ trọng bằng nhau: v = 0, không vẽ được trên trục log
	const lo = Math.pow(10, Math.round(Math.log10(d)) - 1), hi = lo * 100;
	// Khung trục y cố định theo giá trị mặc định của máy (không co giãn theo đường), để đổi ô nhập thì điểm và đường dịch chuyển thấy được
	const mm0 = (dd) => Math.abs(stokes(dd, macDinh.rc, macDinh.rd, macDinh.eta).mmMoiNgay);
	const ymin = Math.pow(10, Math.floor(Math.log10(mm0(lo))) - 3), ymax = Math.pow(10, Math.ceil(Math.log10(mm0(hi))) + 1);
	const noi = stokes(d, rc, rd, eta).v > 0;
	const b = bieuDo({
		x: { min: lo, max: hi, log: true, nhan: 'Đường kính giọt d (µm)' },
		y: { min: ymin, max: ymax, log: true, nhan: noi ? 'Quãng nổi (mm/ngày)' : 'Quãng lắng (mm/ngày)' },
	});
	b.vung(0, 1, 'dưới ~1 µm: Brown');
	b.duong(mm);
	const trongKhung = b.diem(d, mm(d));
	const hang = [0, 1, 2, 3, 4, 5, 6].map((k) => {
		const dd = lo * Math.pow(10, k / 3);
		return [so(dd), so(mm(dd))];
	});
	const huong = noi ? 'nổi lên' : 'lắng xuống';
	return {
		svg: b.xuat('Vận tốc kem hóa theo đường kính giọt', `Đồ thị hai trục logarit: quãng giọt ${huong} mỗi ngày tăng theo bình phương đường kính giọt. Điểm của bạn: d = ${so(d)} µm, ${so(mm(d))} mm/ngày.`),
		bang: { cot: ['d (µm)', 'Quãng (mm/ngày)'], hang },
		chuThich: `Đường là chính công thức của máy, các ô khác giữ nguyên. Hai trục logarit nên đường là một đường thẳng dốc: gấp 10 lần d thì nhanh gấp 100 lần. ${lo < 1 ? `Vùng xám: giọt dưới khoảng 1 µm chịu chuyển động Brown, công thức kém tin cậy ${nhanK()}. ` : ''}${trongKhung ? '' : 'Điểm của bạn nằm ngoài khung đồ thị. '}Đồ thị không nói gì về giọt keo tụ hay hệ có ngưỡng chảy.`,
		diem: { x: d, y: mm(d) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên mọi thứ khác, giảm đường kính giọt đi một nửa thì vận tốc nổi lên sẽ thế nào?',
	lua: ['Giảm còn một nửa', 'Giảm còn một phần tư', 'Giảm còn một phần tám'],
	dung: 1,
	giaiThich: 'Vận tốc tỉ lệ với bình phương đường kính (v ∝ d²), nên giọt nhỏ đi một nửa thì nổi chậm còn một phần tư.',
};
