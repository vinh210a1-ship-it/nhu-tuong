// Đồ thị máy "ostwald": d³ theo thời gian, chấm là số đo người dùng nhập, đường thẳng là đường khớp của máy (độ dốc = 8ω). Khung chung: ../do-thi.js.
import { ostwald } from '../cong-thuc.js';
import { bieuDo, so } from '../do-thi.js';

export const macDinh = { t0: 0, d0: 0.2, t1: 7, d1: 0.211, t2: 14, d2: 0.221, t3: 21, d3: 0.23, t4: 28, d4: 0.239, du: 90 };
const G = '<span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span>';

/** Các cặp (ngày, µm) hợp lệ, lọc như máy: ô để trống thì bỏ qua. Riêng điểm đầu phải có (hợp đồng của khung: ô đầu là NaN thì không vẽ). */
export function diemDo(v) {
	if (!isFinite(v.t0) || !(v.d0 > 0)) return null;
	const ds = [0, 1, 2, 3, 4].map((i) => [v[`t${i}`], v[`d${i}`]]).filter(([t, d]) => isFinite(t) && d > 0);
	return ds.length < 3 || new Set(ds.map(([t]) => t)).size < 3 ? null : ds;
}

export function ve(v) {
	const ds = diemDo(v);
	if (!ds) return null;
	const k = ostwald(ds);
	const ts = ds.map(([t]) => t), ta = Math.min(...ts), tb = Math.max(...ts);
	const khop = (t) => k.d3Dau + k.doDocD3 * t;
	const d3 = ds.map(([t, d]) => [t, d ** 3]);
	// Trục y bắt đầu từ 0 để độ dốc nhìn thấy đúng bằng mức lớn lên tương đối; trục x chừa 30% sau lần đo cuối và tô xám, không kéo dài đường khớp
	const xmin = Math.min(0, ta), xmax = tb + (tb - xmin) * 0.3;
	const bd = bieuDo({ rong: 350, x: { min: xmin, max: xmax, nhan: 'Thời gian (ngày)' }, y: { min: 0, max: Math.max(...d3.map(([, y]) => y), khop(ta), khop(tb)) * 1.3, nhan: 'd³ (µm³)' } });
	bd.vung(tb, xmax, 'chưa đo');
	bd.duong([[ta, khop(ta)], [tb, khop(tb)]]);
	const cham = d3.filter(([t, y]) => bd.trong(t, y)).map(([t, y]) => `<circle class="dt-diem" cx="${Math.round(bd.px(t) * 10) / 10}" cy="${Math.round(bd.py(y) * 10) / 10}" r="4.5"/>`).join('');
	const x = bd.px(xmin) + 12, y = 28;
	const chuGiai = `<circle class="dt-diem" cx="${x}" cy="${y - 5}" r="4.5"/><text class="dt-chu" x="${x + 10}" y="${y}">số đo của bạn</text><path class="dt-duong" d="M${x - 6} ${y + 13}h12"/><text class="dt-chu" x="${x + 10}" y="${y + 18}">đường khớp của máy</text>`;
	const svg = bd
		.xuat('d³ theo thời gian và đường khớp của máy', `${ds.length} số đo của bạn, đổi sang d³, và đường thẳng khớp qua chúng từ ngày ${so(ta)} đến ngày ${so(tb)}. Độ dốc ${so(k.doDocD3)} µm³ mỗi ngày, R² = ${so(k.r2D3)}. Phần sau lần đo cuối tô xám, không vẽ đường.`)
		.replace('</svg>', cham + chuGiai + '</svg>');
	return {
		svg,
		bang: { cot: ['Ngày', 'd (µm)', 'd³ đo (µm³)', 'd³ theo đường khớp (µm³)'], hang: ds.map(([t, d]) => [so(t), so(d), so(d ** 3), so(khop(t))]) },
		chuThich: `Chấm là số đo của bạn, đổi sang d³. Đường thẳng là đường khớp của máy: độ dốc ${so(k.doDocD3)} µm³/ngày, bằng 8ω; R² = ${so(k.r2D3)}. Chấm càng sát đường thì số đo càng hợp với kiểu lớn lên của Ostwald ripening (d³ tăng đều theo thời gian), nhưng với khoảng đo ngắn, R² cao chưa chứng minh cơ chế ${G}. Vùng xám là ngoài vùng có dữ liệu (sau lần đo cuối): đồ thị không kéo dài đường thẳng ra đó.`,
		diem: { x: tb, y: khop(tb) },
		doDoc: k.doDocD3,
		duong: [[ta, khop(ta)], [tb, khop(tb)]],
	};
}

export const doanTruoc = {
	cauHoi: 'Nếu giọt lớn lên do Ostwald ripening, đại lượng nào tăng đều theo thời gian (vẽ ra thành đường thẳng)?',
	lua: ['Đường kính d', 'Bình phương đường kính d²', 'Lập phương đường kính d³'],
	dung: 2,
	giaiThich: 'Công thức của máy là r³(t) = r³(0) + ω·t: thể tích giọt tăng đều theo thời gian, nên vẽ d³ theo t sẽ ra đường thẳng và độ dốc cho tốc độ ripening. Đường kính d thì tăng chậm dần.',
};
