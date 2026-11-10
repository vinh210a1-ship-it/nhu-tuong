// Đồ thị máy "hlb": HLB hỗn hợp theo phần khối lượng chất A (đường thẳng) trên nền ba dải O/W đã có nguồn trong bài. Khung chung: ../do-thi.js.
import { hlbTron, hlbPhanA } from '../cong-thuc.js';
import { bieuDo, so, nhanN } from '../do-thi.js';

export const macDinh = { a: 4, b: 15, wa: 30, muc: 12 };
// Ba dải O/W và câu chữ lấy nguyên từ bài Nền tảng vật lý hóa bề mặt, mục 1.4 (đều mang nhãn N trong bài)
const DAI = [
	[8, 18, 'Griffin', 'dải Griffin xếp loại ứng dụng nhũ hóa O/W', 'griffin1949a', 'Griffin 1949a, tr.314'],
	[10, 18, 'McClements', 'dải McClements gọi là ổn định O/W', 'mcclements2016', 'McClements 2016, tr.134–135'],
	[9, 12, 'hay dùng', 'vùng của các chất nhũ hóa O/W hay dùng', 'griffin1949a', 'Griffin 1949a, tr.313–314'],
];

const NHAN = (x, y, neo) => `<text class="dt-chu dt-chu-dam" style="paint-order:stroke;stroke:var(--hh-be-mat);stroke-width:4px;stroke-linejoin:round" x="${Math.round(x)}" y="${Math.round(y)}" text-anchor="${neo}">Của bạn</text>`; // nhãn điểm có viền màu nền, đè lên nét vẫn đọc được

export function ve(v) {
	const { a, b, muc } = v, wa = v.wa / 100;
	if (![a, b].every((x) => x >= 0 && x <= 40) || !(wa >= 0 && wa <= 1)) return null; // cùng điều kiện với máy
	const h = (pt) => hlbTron(a, b, pt / 100);
	const cao = Math.max(a, b) > 20 ? 40 : 20; // thang HLB thường dùng là 0–20; chỉ mở tới 40 khi có chất vượt 20
	const bd = bieuDo({ rong: 350, x: { min: 0, max: 100, nhan: 'Phần khối lượng chất A (%)' }, y: { min: 0, max: cao, nhan: 'HLB hỗn hợp' } });
	bd.duong([[0, b], [100, a]]);
	const p = isFinite(muc) ? hlbPhanA(a, b, muc) : null;
	if (p !== null && muc <= cao) bd.duong([[0, muc], [p * 100, muc], [p * 100, 0]], 'dt-duong-phu'); // dóng từ HLB mục tiêu sang đường trộn rồi xuống phần A cần pha
	bd.diem(wa * 100, h(wa * 100), ''); // nhãn tự đặt ở phía không có đường trộn, đường mục tiêu và nhãn dải
	// dải tô (vẽ dưới lưới) và ba dòng nhãn dải, đặt ở nửa ít bị đường trộn và đường mục tiêu đi qua hơn
	const lam = (x) => Math.round(x * 10) / 10;
	const x0 = bd.px(0), x1 = bd.px(100), day = 18 - (52 * cao) / 184; // mép dưới của khối nhãn, tính theo HLB
	const vuong = (y) => y > day && y < 18.5;
	const dung = (xs) => xs.filter((x) => vuong(h(x)) || (p !== null && x <= p * 100 && vuong(muc))).length;
	const phai = dung([56, 76, 96]) <= dung([4, 24, 44]);
	const nen = DAI.map(([lo, hi]) => `<rect style="fill:var(--sl-color-accent);fill-opacity:.13" x="${x0}" y="${lam(bd.py(hi))}" width="${x1 - x0}" height="${lam(bd.py(lo) - bd.py(hi))}"/>`).join('');
	const chu = DAI.map(([lo, hi, ten], i) => `<text class="dt-chu" x="${phai ? x1 - 6 : x0 + 6}" y="${Math.round(bd.py(18)) + 15 + i * 16}" text-anchor="${phai ? 'end' : 'start'}">${lo}–${hi}: ${ten}</text>`).join('');
	// nhãn "Của bạn": đường đi xuống thì đặt dưới bên trái, đi lên thì dưới bên phải; sát mép thì chuyển lên trên
	const cx = bd.px(wa * 100), cy = bd.py(h(wa * 100)), xuong = a < b;
	const duoi = cy < bd.py(0) - 24 && (xuong ? cx > x0 + 75 : cx < x1 - 75);
	const trai = duoi ? xuong : !xuong;
	const nhan = NHAN(cx + (trai ? -9 : 9), cy + (duoi ? 19 : -9), trai ? 'end' : 'start');
	const svg = bd
		.xuat('HLB hỗn hợp theo phần khối lượng chất A', `Đường thẳng nối HLB của chất B (${so(b)}, khi không có A) với HLB của chất A (${so(a)}, khi toàn A). Điểm của bạn: ${so(wa * 100)}% A cho HLB ${so(h(wa * 100))}. Nền tô ba dải HLB của nhũ tương dầu trong nước: 8 đến 18, 10 đến 18 và 9 đến 12.`)
		.replace('</desc>', '</desc>' + nen)
		.replace('</svg>', chu + nhan + '</svg>');
	const hang = [0, 25, 50, 75, 100].map((pt) => [so(pt), so(h(pt))]);
	hang.push([`${so(wa * 100)} (của bạn)`, so(h(wa * 100))]);
	return {
		svg,
		bang: { cot: ['Chất A (%)', 'HLB hỗn hợp'], hang },
		chuThich: `Đường thẳng là chính công thức của máy. Điểm của bạn: ${so(wa * 100)}% A cho HLB ${so(h(wa * 100))}. ${p !== null ? `Đường gạch dóng từ HLB mục tiêu ${so(muc)} sang đường trộn rồi xuống trục ngang: cần ${so(p * 100)}% A. ` : ''}Ba dải tô chồng lên nhau, chỗ đậm hơn là chỗ nhiều dải trùng nhau: ${DAI.map(([lo, hi, , mo, khoa, ten]) => `${lo}–${hi} là ${mo} ${nhanN(khoa, ten)}`).join('; ')}. Đồ thị không cho biết công thức có bền hay không: HLB là con số tĩnh, không tính đến loại dầu, nhiệt độ, muối, pH ${nhanN('abbott', 'Abbott')}.`,
		diem: { x: wa * 100, y: h(wa * 100) },
	};
}

export const doanTruoc = {
	cauHoi: 'Trộn hai chất nhũ hóa theo tỉ lệ khối lượng 50/50. Theo quy tắc cộng HLB, HLB của hỗn hợp nằm ở đâu?',
	lua: ['Bằng HLB của chất cao hơn', 'Đúng giữa hai giá trị', 'Thấp hơn cả hai chất'],
	dung: 1,
	giaiThich: 'Quy tắc cộng tuyến tính theo khối lượng: mỗi chất góp HLB theo đúng phần khối lượng của nó, nên trộn 50/50 thì ra đúng giữa. Trên đồ thị đó là một đường thẳng nối hai chất.',
};
