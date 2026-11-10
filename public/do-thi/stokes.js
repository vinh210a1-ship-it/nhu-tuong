// Đồ thị máy "stokes": quãng giọt nổi hoặc lắng mỗi ngày theo đường kính giọt, hai trục logarit. Khung chung: ../do-thi.js.
import { stokes } from '../cong-thuc.js';
import { bieuDo, so, nhanK } from '../do-thi.js';

export const macDinh = { d: 1, rc: 1000, rd: 920, eta: 1, ngay: 30 };
const G = '<span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span>';

const NHAN = (x, y, neo) => `<text class="dt-chu dt-chu-dam" style="paint-order:stroke;stroke:var(--hh-be-mat);stroke-width:4px;stroke-linejoin:round" x="${Math.round(x)}" y="${Math.round(y)}" text-anchor="${neo}">Của bạn</text>`; // nhãn điểm có viền màu nền, đè lên nét vẫn đọc được

export function ve(v) {
	const { d, rc, rd, eta } = v;
	if (![d, rc, rd, eta, v.ngay].every((t) => t > 0)) return null; // cùng điều kiện với máy: mọi ô phải dương
	const mm = (dd) => Math.abs(stokes(dd, rc, rd, eta).mmMoiNgay);
	if (!(mm(d) > 0)) return null; // tỷ trọng bằng nhau: v = 0, không vẽ được trên trục log
	const lo = Math.pow(10, Math.round(Math.log10(d)) - 1), hi = lo * 100;
	// Khung trục y cố định theo giá trị mặc định của máy (không co giãn theo đường), để đổi ô nhập thì điểm và đường dịch chuyển thấy được
	const mm0 = (dd) => Math.abs(stokes(dd, macDinh.rc, macDinh.rd, macDinh.eta).mmMoiNgay);
	const ymin = Math.pow(10, Math.floor(Math.log10(mm0(lo))) - 3), ymax = Math.pow(10, Math.ceil(Math.log10(mm0(hi))) + 1);
	const noi = stokes(d, rc, rd, eta).v > 0;
	const b = bieuDo({
		rong: 350,
		x: { min: lo, max: hi, log: true, nhan: 'Đường kính giọt d (µm)' },
		y: { min: ymin, max: ymax, log: true, nhan: noi ? 'Quãng nổi (mm/ngày)' : 'Quãng lắng (mm/ngày)' },
	});
	b.vung(0, 1, 'dưới ~1 µm: Brown');
	b.duong(mm);
	const trongKhung = b.diem(d, mm(d), ''); // nhãn tự đặt ở phía trên bên trái, vì đường đi lên về bên phải
	const hang = [0, 1, 2, 3, 4, 5, 6].map((k) => {
		const dd = lo * Math.pow(10, k / 3);
		return [so(dd), so(mm(dd))];
	});
	const huong = noi ? 'nổi lên' : 'lắng xuống';
	// vạch trục y dưới 0,001 ghi dạng 10⁻⁴, 10⁻⁵… cho khỏi đè lên tên trục (khung đã ghi 10³, 10⁴ theo cùng cách)
	let svg = b
		.xuat('Vận tốc kem hóa theo đường kính giọt', `Đồ thị hai trục logarit: quãng giọt ${huong} mỗi ngày tăng theo bình phương đường kính giọt. Điểm của bạn: d = ${so(d)} µm, ${so(mm(d))} mm/ngày.`)
		.replace(/>0,(0{3,8})1</g, (m, z) => `>10⁻${'⁴⁵⁶⁷⁸⁹'[z.length - 3]}<`);
	if (trongKhung) svg = svg.replace('</svg>', NHAN(b.px(d) - 9, b.py(mm(d)) - 9, 'end') + '</svg>');
	return {
		svg,
		bang: { cot: ['d (µm)', 'Quãng (mm/ngày)'], hang },
		chuThich: `Đường là chính công thức của máy, các ô khác giữ nguyên. Hai trục logarit nên đường là một đường thẳng dốc: d gấp 10 thì nhanh gấp 100. ${trongKhung ? `Điểm của bạn: d = ${so(d)} µm, ${so(mm(d))} mm/ngày. ` : 'Điểm của bạn nằm ngoài khung đồ thị. '}${lo < 1 ? `Vùng xám: giọt dưới khoảng 1 µm chịu chuyển động Brown, kem hóa thực tế chậm hơn tính toán ${nhanK()}. ` : ''}Giới hạn Stokes: công thức cho giọt cầu cứng, đơn lẻ, pha liên tục Newton ${nhanK()}. Đồ thị không tính giọt keo tụ thành cụm (nổi nhanh hơn) hay hệ có φ cao, mạng gel hoặc ngưỡng chảy (chậm hơn hoặc dừng hẳn) ${G}.`,
		diem: { x: d, y: mm(d) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên mọi thứ khác, giảm đường kính giọt đi một nửa thì vận tốc nổi lên sẽ thế nào?',
	lua: ['Giảm còn một nửa', 'Giảm còn một phần tư', 'Giảm còn một phần tám'],
	dung: 1,
	giaiThich: 'Vận tốc tỉ lệ với bình phương đường kính (v ∝ d²), nên giọt nhỏ đi một nửa thì nổi chậm còn một phần tư.',
};
