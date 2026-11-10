// Đồ thị máy "arrhenius": ln t theo 1000/T, đường hồi quy của máy, ngoại suy tô xám (khung chung: ../do-thi.js).
import { arrhenius } from '../cong-thuc.js';
import { bieuDo, so, nhanN } from '../do-thi.js';

// "dich" đứng đầu để phép kiểm chung (đặt ô đầu = NaN) chạm đúng ô bắt buộc
export const macDinh = { dich: 25, c0: 90, t0: 20, c1: 100, t1: 9, c2: 110, t2: 4.2, c3: 120, t3: 2 };
const inv = (c) => 1000 / (c + 273.15);
const tuInv = (x) => 1000 / x - 273.15;

export function ve(v) {
	const diem = [0, 1, 2, 3].map((i) => [v[`c${i}`], v[`t${i}`]]).filter(([c, t]) => isFinite(c) && t > 0);
	const dich = v.dich;
	if (diem.length < 2 || new Set(diem.map(([c]) => c)).size < 2 || !isFinite(dich)) return null;
	const k = arrhenius(diem);
	if (!(k.EaKJ > 0)) return null;
	const lnT = (x) => Math.log(k.thoiGianTai(tuInv(x)));
	const xs = [...diem.map(([c]) => inv(c)), inv(dich)];
	const xlo = Math.min(...xs), xhi = Math.max(...xs), le = (xhi - xlo) * 0.06;
	const ys = [...diem.map(([, t]) => Math.log(t)), lnT(inv(dich))];
	const ylo = Math.min(...ys), yhi = Math.max(...ys), ly = (yhi - ylo) * 0.08;
	const b = bieuDo({ x: { min: xlo - le, max: xhi + le, nhan: '1000/T (1/K)' }, y: { min: ylo - ly, max: yhi + ly, nhan: 'ln t (t tính bằng giờ)' } });
	// vùng có số đo: từ nhiệt độ cao nhất đến thấp nhất đã nhập; bên ngoài (kể cả nhiệt độ bảo quản) là ngoại suy
	const xd = diem.map(([c]) => inv(c));
	b.vung(Math.max(...xd), xhi + le, 'ngoài vùng có dữ liệu').vung(xlo - le, Math.min(...xd));
	b.duong(lnT);
	diem.forEach(([c, t]) => b.cham(inv(c), Math.log(t)));
	b.diem(inv(dich), lnT(inv(dich)), `${so(dich)} °C`);
	const hang = [...diem.map(([c, t]) => [so(c), so(t), so(inv(c)), so(Math.log(t))]), [`${so(dich)} (ngoại suy)`, so(k.thoiGianTai(dich)), so(inv(dich)), so(lnT(inv(dich)))]];
	return {
		svg: b.xuat('Đồ thị Arrhenius: ln t theo 1000/T', `Các chấm là số đo bạn nhập; đường thẳng là hồi quy của máy; điểm lớn là nhiệt độ bảo quản ${so(dich)} °C nằm ở vùng ngoại suy. Đường càng dốc thì thời gian càng nhạy với nhiệt độ.`),
		bang: { cot: ['T (°C)', 't (giờ)', '1000/T', 'ln t'], hang },
		chuThich: `Chấm là số đo của bạn, đường là hồi quy ln t theo 1/T của máy (năng lượng hoạt hóa ${so(k.EaKJ)} kJ/mol). Q10 quanh ${so(dich)} °C là ${so(k.q10Tai(dich))}: mỗi lần nhiệt độ giảm 10 °C thì thời gian dài thêm chừng ấy lần; đường càng dốc, Q10 càng lớn. Vùng xám là ngoài vùng có số đo: đường kéo ra đó là ngoại suy, có thể sai rất xa ${nhanN('kochhar2009', 'Kochhar 2009')}. Đồ thị không nói hạn dùng thật của sản phẩm có nước hay bột.`,
		diem: { x: inv(dich), y: lnT(inv(dich)) },
	};
}

export const doanTruoc = {
	cauHoi: 'Thử nghiệm ở 90–120 °C cho một đường thẳng trên đồ thị ln t theo 1/T. Khi ngoại suy xuống nhiệt độ bảo quản, mỗi lần giảm 10 °C thì thời gian dài thêm theo kiểu nào?',
	lua: ['Cộng thêm cùng một số giờ', 'Nhân lên gần cùng một hệ số', 'Không đổi'],
	dung: 1,
	giaiThich: 'ln t là hàm tuyến tính của 1/T nên t đổi theo hàm mũ: mỗi 10 °C thời gian nhân lên gần cùng một hệ số (Q10), chứ không cộng thêm một số giờ cố định.',
};
