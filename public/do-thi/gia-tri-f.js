// Đồ thị máy "gia-tri-f": F theo nhiệt độ giữ T, trục y logarit (khung chung: ../do-thi.js).
// Chọn F theo T (không chọn log số sống theo thời gian) vì D là ô tùy chọn: F theo T luôn vẽ được, và cho thấy ý nghĩa của z.
import { giaTriF } from '../cong-thuc.js';
import { bieuDo, so, nhanG } from '../do-thi.js';

export const macDinh = { T: 115, t: 20, Tref: 120, z: 10, D: NaN };

export function ve(v) {
	const { T, t, Tref, z, D } = v;
	if (!(t > 0 && z > 0) || !isFinite(T) || !isFinite(Tref)) return null;
	const F = (x) => giaTriF(t, x, Tref, z, 0).F;
	// trục x: Tref ± 30 °C cố định (không theo z) để đổi z thì độ dốc đổi thấy được; trục y cố định theo t mặc định
	const b = bieuDo({ x: { min: Tref - 30, max: Tref + 30, nhan: 'Nhiệt độ giữ T (°C)' }, y: { min: 1e-2, max: 1e5, log: true, nhan: 'F (phút ở Tref)' } });
	b.duong([[Tref, 1e-2], [Tref, 1e5]], 'dt-duong-phu');
	b.duong(F);
	const trongKhung = b.diem(T, F(T));
	const hang = [-30, -20, -10, 0, 10, 20, 30].map((d) => [so(Tref + d), so(F(Tref + d))]);
	const logGiam = D > 0 ? ` Số log giảm với D = ${so(D)} phút: ${so(F(T) / D)}.` : '';
	return {
		svg: b.xuat('Giá trị F theo nhiệt độ giữ', `Đồ thị trục y logarit: F tăng theo hàm mũ với nhiệt độ, mỗi z độ tăng 10 lần. Điểm của bạn: T = ${so(T)} °C, F = ${so(F(T))} phút.`),
		bang: { cot: ['T (°C)', 'F (phút ở Tref)'], hang },
		chuThich: `Đường là chính công thức F = t·10^((T − Tref)/z) của máy với t = ${so(t)} phút, z = ${so(z)} °C; trục y logarit nên đường gần thẳng, và cứ lên z độ thì F gấp 10 lần. Nét đứt dọc là Tref, nơi F bằng đúng t.${logGiam} ${trongKhung ? '' : 'Điểm của bạn nằm ngoài khung đồ thị. '}Chỉ cho nhiệt độ không đổi ${nhanG()}; đồ thị không nói gì về pha gia nhiệt, làm nguội, và không dùng để thiết kế hay phê duyệt quy trình tiệt trùng thương mại.`,
		diem: { x: T, y: F(T) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên thời gian giữ, hạ nhiệt độ xuống đúng z độ (ví dụ 10 °C khi z = 10 °C) thì F tương đương ở nhiệt độ chuẩn sẽ thế nào?',
	lua: ['Giảm còn một nửa', 'Giảm còn một phần mười', 'Không đổi'],
	dung: 1,
	giaiThich: 'Theo định nghĩa z, thấp hơn z độ thì tốc độ gây chết L giảm 10 lần, nên cùng thời gian giữ cho F nhỏ đi 10 lần.',
};
