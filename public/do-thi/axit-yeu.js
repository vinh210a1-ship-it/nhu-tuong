// Đồ thị máy "axit-yeu": phần axit chưa phân ly theo pH (đường chữ S), đánh dấu pH = pKa. Khung chung: ../do-thi.js.
import { phanChuaPhanLy } from '../cong-thuc.js';
import { bieuDo, so, nhanN } from '../do-thi.js';

export const macDinh = { pH: 5, pKa: 4.5, c: 1000 };
const X0 = 2, X1 = 8; // khung pH cố định: đổi pKa thì thấy cả đường chữ S dịch ngang

const NHAN = (x, y, neo) => `<text class="dt-chu dt-chu-dam" style="paint-order:stroke;stroke:var(--hh-be-mat);stroke-width:4px;stroke-linejoin:round" x="${Math.round(x)}" y="${Math.round(y)}" text-anchor="${neo}">Của bạn</text>`; // nhãn điểm có viền màu nền, đè lên nét vẫn đọc được

export function ve(v) {
	const { pH, pKa } = v;
	if (!isFinite(pH) || !isFinite(pKa)) return null;
	const f = (x) => phanChuaPhanLy(x, pKa) * 100;
	const bd = bieuDo({ rong: 350, x: { min: X0, max: X1, nhan: 'pH của pha nước' }, y: { min: 0, max: 100, nhan: 'Chưa phân ly, HA (%)' } });
	bd.duong(f);
	const coMoc = bd.trong(pKa, 50);
	if (coMoc) bd.duong([[pKa, 0], [pKa, 100]], 'dt-duong-phu');
	const trong = bd.diem(pH, f(pH), '');
	let svg = bd.xuat('Phần axit chưa phân ly theo pH', `Đường chữ S đi xuống: pH thấp hơn pKa thì gần hết axit ở dạng chưa phân ly, pH bằng pKa (${so(pKa)}) thì còn một nửa, pH cao hơn thì giảm nhanh. Điểm của bạn: pH ${so(pH)}, ${so(f(pH))}% chưa phân ly.`);
	if (coMoc) {
		const x = bd.px(pKa), phai = pKa < (X0 + X1) / 2;
		svg = svg.replace('</svg>', `<text class="dt-chu" x="${Math.round(x) + (phai ? 6 : -6)}" y="${bd.py(100) + 15}" text-anchor="${phai ? 'start' : 'end'}">pH = pKa</text></svg>`);
	}
	if (trong) {
		// đường chữ S đi xuống về bên phải: nhãn đặt trên bên phải; sát mép trên thì đặt xuống dưới, sát mép phải thì nâng lên bên trái
		const cx = bd.px(pH), cy = bd.py(f(pH));
		svg = svg.replace('</svg>', (cy < 38 ? (cx - 80 >= bd.px(X0) ? NHAN(cx - 9, cy + 20, 'end') : NHAN(cx + 9, cy + 22, 'start')) : cx + 80 > bd.px(X1) ? NHAN(cx + 2, cy - 24, 'end') : NHAN(cx + 9, cy - 9, 'start')) + '</svg>');
	}
	const hang = [2, 3, 4, 5, 6, 7, 8].map((x) => [so(x), so(f(x))]);
	hang.push([`${so(pH)} (của bạn)`, so(f(pH))]);
	return {
		svg,
		bang: { cot: ['pH', 'Chưa phân ly (%)'], hang },
		chuThich: `Đường chữ S là chính công thức của máy với pKa = ${so(pKa)}. ${coMoc ? 'Đường gạch đứng đánh dấu pH = pKa: ở đó đúng một nửa axit chưa phân ly. ' : ''}Khi pH đã cao hơn pKa từ 1 đơn vị, mỗi đơn vị pH thêm làm phần chưa phân ly giảm gần 10 lần. ${trong ? `Điểm của bạn: pH ${so(pH)}, ${so(f(pH))}%.` : `Điểm của bạn (pH ${so(pH)}, ${so(f(pH))}%) nằm ngoài khung đồ thị.`} Đồ thị không cho biết hiệu lực bảo quản: với sorbic, ở pH trên 6 dạng phân ly còn đóng góp hơn một nửa mức ức chế với đa số vi sinh vật thử ${nhanN('eklund1983', 'Eklund 1983')}.`,
		diem: { x: pH, y: f(pH) },
	};
}

export const doanTruoc = {
	cauHoi: 'Khi pH của pha nước đúng bằng pKa của axit bảo quản, bao nhiêu phần axit còn ở dạng chưa phân ly (HA)?',
	lua: ['Gần như toàn bộ', 'Đúng một nửa', 'Gần như không còn'],
	dung: 1,
	giaiThich: 'Khi pH = pKa thì 10 mũ (pH − pKa) bằng 1, nên phần chưa phân ly là 1/(1 + 1), tức một nửa. pH càng cao hơn pKa thì dạng chưa phân ly càng ít.',
};
