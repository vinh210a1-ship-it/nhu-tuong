// Đồ thị máy "debye": độ dài Debye κ⁻¹ theo lực ion I, trục ngang logarit. Khung chung: ../do-thi.js.
import { lucIon, debye } from '../cong-thuc.js';
import { bieuDo, so, nhanK } from '../do-thi.js';

export const macDinh = { c11: 10, c21: 0, c12: 0 };
const T = '<span class="nhan-cum"><span class="nhan nhan-T" title="Tính minh họa">T</span></span>';
const X0 = 1, X1 = 1000; // khung cố định (mM): phủ các dòng trong bảng ví dụ của bài (1 đến 150 mM) và thêm một bậc 10

const NHAN = (x, y, neo) => `<text class="dt-chu dt-chu-dam" style="paint-order:stroke;stroke:var(--hh-be-mat);stroke-width:4px;stroke-linejoin:round" x="${Math.round(x)}" y="${Math.round(y)}" text-anchor="${neo}">Của bạn</text>`; // nhãn điểm có viền màu nền, đè lên nét vẫn đọc được

/** Lực ion (mol/L) tính đúng như máy: ô để trống coi là 0. */
export function lucIonMay(v) {
	const a = v.c11, b = v.c21 || 0, c = v.c12 || 0;
	if (![a, b, c].every((x) => x >= 0)) return NaN;
	return lucIon([[a / 1000, 1], [a / 1000, 1], [b / 1000, 2], [(2 * b) / 1000, 1], [(2 * c) / 1000, 1], [c / 1000, 2]]);
}

export function ve(v) {
	const I = lucIonMay(v);
	if (!(I > 0)) return null;
	const mM = I * 1000, k = debye(I);
	const bd = bieuDo({ rong: 350, x: { min: X0, max: X1, log: true, nhan: 'Lực ion I (mM)' }, y: { min: 0, max: 10, nhan: 'Độ dài Debye κ⁻¹ (nm)' } });
	bd.duong((x) => debye(x / 1000));
	const trong = bd.diem(mM, k, '');
	const hang = [1, 3, 10, 30, 100, 300, 1000].map((x) => [so(x), so(debye(x / 1000))]);
	hang.push([`${so(mM)} (của bạn)`, so(k)]);
	let svg = bd.xuat('Độ dài Debye theo lực ion', `Đường cong đi xuống: lực ion càng lớn thì độ dài Debye càng nhỏ, từ khoảng ${so(debye(X0 / 1000))} nm ở ${X0} mM xuống khoảng ${so(debye(X1 / 1000))} nm ở ${X1} mM. Điểm của bạn: I = ${so(mM)} mM, κ⁻¹ = ${so(k)} nm.`);
	if (trong) {
		// đường đi xuống về bên phải nên nhãn đặt trên bên phải; sát mép trên thì hạ xuống, sát mép phải thì nâng lên bên trái
		const cx = bd.px(mM), cy = bd.py(k);
		svg = svg.replace('</svg>', (cy < 38 ? NHAN(cx + 24, cy + 22, 'start') : cx + 80 > bd.px(X1) ? NHAN(cx + 2, cy - 24, 'end') : NHAN(cx + 9, cy - 9, 'start')) + '</svg>');
	}
	return {
		svg,
		bang: { cot: ['I (mM)', 'κ⁻¹ (nm)'], hang },
		chuThich: `Đường là chính công thức của máy cho nước ở 25 °C ${nhanK()}, quét lực ion từ ${X0} đến ${X1} mM. Trục ngang chia theo bội số 10: muối tăng 100 lần thì κ⁻¹ mỏng đi 10 lần. ${trong ? `Điểm của bạn: I = ${so(mM)} mM, κ⁻¹ = ${so(k)} nm.` : `Điểm của bạn (I = ${so(mM)} mM, κ⁻¹ = ${so(k)} nm) nằm ngoài khung đồ thị.`} Đồ thị không có mốc thực nghiệm: bảng trong bài là số tính ${T}. Nó cũng không tính ion tạo phức hay ion hóa trị 2 bắc cầu giữa các protein.`,
		diem: { x: mM, y: k },
	};
}

export const doanTruoc = {
	cauHoi: 'Thêm muối để lực ion tăng gấp 100 lần. Tầm với của lực đẩy tĩnh điện quanh giọt (độ dài Debye) thay đổi thế nào?',
	lua: ['Mỏng đi 10 lần', 'Mỏng đi 100 lần', 'Dày lên 10 lần'],
	dung: 0,
	giaiThich: 'Độ dài Debye tỉ lệ nghịch với căn bậc hai của lực ion, nên muối tăng 100 lần thì tầm với của lực đẩy tĩnh điện mỏng đi 10 lần.',
};
