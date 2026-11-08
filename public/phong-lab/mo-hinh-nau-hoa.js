// MÔ HÌNH BÀN NÂU HÓA (Maillard–acrylamide). Mức tin cậy: bàn học nguyên lý, KHÔNG dự báo cho sản phẩm thật.
//  - Bánh quy: đường cong tiến độ bậc 1, f = 1 − exp(−k·t), k nội suy theo ln k giữa hai đầu khoảng đã công bố. [T]
//    Giả định (nhãn T): đầu thấp của khoảng k ứng với 165 °C, đầu cao ứng với 195 °C. Không ngoại suy ngoài 165–195 °C.
//  - Thứ tự đường, vùng aw đỉnh, hạ nhiệt chiên chip, asparaginase: đúng như số/ quy tắc đã công bố (N), không nội suy.
import { NAU } from './so-lieu-nau-hoa.js';

export const NHAN_NAU = {
	k: { ma: 'T', chu: 'k nội suy ln k giữa hai đầu khoảng đã công bố (giả định đầu thấp ứng 165 °C, đầu cao ứng 195 °C); phản ứng bậc 1, bỏ qua phân hủy' },
	thuTu: { ma: 'N', chu: 'Thứ tự tốc độ lên màu ở pH 6: xylose > glucose > fructose > lactose > maltose > sucrose (Buera 1987, hệ lỏng đường–glycin; tóm tắt)' },
	awDinh: { ma: 'N', chu: 'aw tại đỉnh nâu hóa ≈ 0,89 / 0,74 / 0,67 cho ba nhiệt độ thử, hệ glucose–lysine (Kim 1987; tóm tắt, không biết nhiệt độ nào ứng số nào)' },
	chip: { ma: 'N', chu: 'Hạ nhiệt chiên chip 190 → 160 °C (7 phút) giảm acrylamide 84% / 67% / 78% theo giống Atlantic / Snowden / Vigor (Liyanage 2020; tóm tắt)' },
	enzyme: { ma: 'N', chu: 'Asparaginase giảm acrylamide 45,6% (1 IU/mL, 37 °C, pH 7,3, 30 phút) hoặc 85% (500 U/mL, 45 °C, khoai lang); số của đúng điều kiện đó, không ngoại suy (Pham 2020; de Melo 2025; Becker 2026; tóm tắt)' },
	banhQuy: { ma: 'N', chu: 'Khoảng k bậc 1 của bánh quy 165–195 °C: BI 0,019–0,063 /phút, acrylamide 0,023–0,077 /phút (Isleroglu 2012; tóm tắt)' },
	khongKhop: { ma: 'T', chu: 'Ea suy ngược từ hai đầu khoảng k lớn hơn nhiều so với Ea trong tóm tắt, nên đường cong không dùng Ea' },
};

const R = 8.314e-3; // kJ/(mol·K)
const { T: [T1, T2] } = NAU.banhQuy;

/** k (1/phút) nội suy theo ln k tuyến tính theo nhiệt độ giữa hai đầu khoảng; null nếu ngoài 165–195 °C. */
export function kNoiSuy([k1, k2], T) {
	if (T < T1 - 1e-9 || T > T2 + 1e-9) return null;
	const s = (T - T1) / (T2 - T1);
	return Math.exp(Math.log(k1) + s * (Math.log(k2) - Math.log(k1)));
}
/** Ea (kJ/mol) suy từ hai đầu khoảng k nếu coi đó là hai điểm Arrhenius. */
export function eaSuyRa([k1, k2]) {
	return (R * Math.log(k2 / k1)) / (1 / (T1 + 273.15) - 1 / (T2 + 273.15));
}
export const tienDo = (k, phut) => (k == null ? null : 1 - Math.exp(-k * phut));

const THU_TU = NAU.thuTuDuong.ds;
export const hangDuong = (d) => THU_TU.indexOf(d); // 0 = nhanh nhất
export const AW_DAI = [Math.min(...NAU.awDinh.gia_tri), Math.max(...NAU.awDinh.gia_tri)];
export const trongDaiAw = (aw) => aw >= AW_DAI[0] - 1e-9 && aw <= AW_DAI[1] + 1e-9;

/**
 * me = { loai: 'banh-quy'|'chip', duong, aw, T, phut, giong, enzyme: null|'khoai-tay'|'khoai-lang', haNhiet }
 */
export function moPhongNau(me) {
	const loai = me.loai ?? 'banh-quy';
	const hang = hangDuong(me.duong ?? 'glucose');
	if (loai === 'chip') {
		const goc = NAU.chip.giam[me.giong ?? 'Atlantic'];
		let giam = null; // phần trăm acrylamide giảm so với chiên 190 °C, null = không có số cho cấu hình này
		let ngoaiVung = false;
		const co = [];
		if (me.haNhiet) {
			giam = goc;
			co.push('hạ nhiệt 190 → 160 °C');
		}
		if (me.enzyme) {
			const e = NAU.enzyme.ds[me.enzyme];
			// hai can thiệp khác nhau không có số kết hợp trong dữ liệu: không nhân, không cộng
			if (me.haNhiet) {
				giam = null;
				ngoaiVung = true;
			} else giam = e.giam;
			co.push(e.ten);
		}
		return { loai, giong: me.giong ?? 'Atlantic', giam, ngoaiVung, can: co, hang };
	}
	const T = me.T ?? 180;
	const kB = kNoiSuy(NAU.banhQuy.kBI, T);
	const kA = kNoiSuy(NAU.banhQuy.kAcryl, T);
	const phut = me.phut ?? 10;
	return {
		loai, T, phut, hang, aw: me.aw ?? 0.6,
		ngoaiVung: kB == null,
		kBI: kB, kAcryl: kA,
		BI: tienDo(kB, phut), acryl: tienDo(kA, phut),
		trongDaiAw: trongDaiAw(me.aw ?? 0.6),
		duongChamNhat: (me.duong ?? 'glucose') === THU_TU[THU_TU.length - 1],
	};
}

export const NHIEM_VU_NAU = [
	{
		id: 'chip-it-acrylamide',
		ten: 'Chip giòn, ít acrylamide',
		de: 'Chiên chip bằng cách hạ nhiệt từ 190 xuống 160 °C. Chọn giống khoai sao cho acrylamide giảm từ 75% trở lên theo số đo đã công bố. Nhớ đo.',
		tieuChi: [
			{ chu: 'Hạ nhiệt chiên 190 → 160 °C', dat: (kq) => kq.loai === 'chip' && kq.can.includes('hạ nhiệt 190 → 160 °C') },
			{ chu: 'Acrylamide giảm từ 75% trở lên', dat: (kq) => (kq.giam ?? 0) >= 75 },
			{ chu: 'Đã đo acrylamide', dat: (kq, st) => !!st.daDo },
		],
	},
	{
		id: 'khoai-lang-enzyme',
		ten: 'Khoai lang chiên với asparaginase',
		de: 'Xử lý khoai lang bằng asparaginase theo đúng điều kiện đã công bố, để acrylamide giảm từ 80% trở lên. Không ghép với hạ nhiệt, vì chưa có số kết hợp.',
		tieuChi: [
			{ chu: 'Dùng asparaginase điều kiện khoai lang', dat: (kq) => kq.can?.some((c) => c.includes('500 U/mL')) },
			{ chu: 'Acrylamide giảm từ 80% trở lên', dat: (kq) => (kq.giam ?? 0) >= 80 },
			{ chu: 'Đã đo acrylamide', dat: (kq, st) => !!st.daDo },
		],
	},
	{
		id: 'banh-quy-nau-cham',
		ten: 'Bánh quy nâu chậm',
		de: 'Bánh quy nướng ở đầu thấp của khoảng đã đo (165 °C), dùng đường làm màu lên chậm nhất trong sáu đường, và giữ aw ngoài dải đỉnh nâu hóa 0,67–0,89.',
		tieuChi: [
			{ chu: 'Nướng ở 165 °C', dat: (kq) => kq.loai === 'banh-quy' && kq.T === 165 },
			{ chu: 'Đường làm màu lên chậm nhất (sucrose)', dat: (kq) => !!kq.duongChamNhat },
			{ chu: 'aw ngoài dải 0,67–0,89', dat: (kq) => kq.loai === 'banh-quy' && !kq.trongDaiAw },
			{ chu: 'Đã đo', dat: (kq, st) => !!st.daDo },
		],
	},
];
export function chamSaoNau(nv, kq, st) {
	const tieuChi = nv.tieuChi.map((t) => ({ chu: t.chu, dat: !!t.dat(kq, st) }));
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}
