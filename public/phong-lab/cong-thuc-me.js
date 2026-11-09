// Cốc có khối lượng mẻ tự chọn (20–2.000 g): đổi từ gram ra phần trăm, kẹp giới hạn, quy đổi hiển thị
// và đọc/ghi đường dẫn chia sẻ công thức. Chỉ hàm thuần, không chạm DOM.
// Mô hình (moPhongMe trong mo-hinh.js) vẫn nhận PHẦN TRĂM nên khối lượng mẻ không làm đổi d32, nhiệt, kem hóa:
// ở máy đồng hóa áp cao, năng lượng cấp cho mỗi mL xấp xỉ bằng độ giảm áp, không phụ thuộc mẻ to hay nhỏ.
import { phanSoTheTich, DAU, NHU_HOA } from './mo-hinh.js';

export const ME = { min: 20, max: 2000, macDinh: 100 };
/** Giới hạn theo % khối lượng của TỔNG mẻ (giữ đúng giới hạn cũ của bàn, chỉ quy ra gram). */
export const PT = { gDau: [1, 40], gNhuHoa: [0.05, 3], gXanthan: [0.01, 0.5] };
export const PPM = { tocopherol: 200, edta: 50 };

export const COC_RONG = () => ({
	me: ME.macDinh, // khối lượng mẻ, g (100 g: mọi nhiệm vụ và mẫu cũ giữ nguyên kết quả)
	nuoc: false, // đã cho nước vào cốc chưa
	nuocTuBu: true, // true: nước = mẻ − phần khác (cách cũ)
	gNuoc: null, // chỉ dùng khi nuocTuBu = false
	dau: null,
	gDau: 10,
	nhuHoa: null,
	gNhuHoa: 1,
	gXanthan: 0,
	tocopherol: false,
	edta: false,
	cachNhap: 'gam', // 'gam' | 'phan-tram' | 'ty-le'
});
export const MAY_MAC_DINH = () => ({ khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: false } });
/** Dải thanh trượt của hai máy (khớp thanhTruot trong phong-lab.js). */
export const DAI_MAY = { rpm: [2000, 20000], phut: [0.5, 10], bar: [50, 1500], soLan: [1, 5] };

export const LY = {
	me: 'Phòng lab này mô phỏng quy mô bàn thí nghiệm. Dưới 20 g không còn máy nào trong phòng chạy được; trên 2 kg vượt sức chứa của máy khuấy cắt cao để bàn (2 L).',
	dauMax: 'Trên 40% dầu, nhũ tương đặc dần và mô hình độ nhớt của bàn này chưa kiểm. Muốn làm sốt đặc, dùng chế độ Mayonnaise.',
	dauMin: 'Bàn này giữ dầu từ 1% đến 40% của mẻ; dưới 1% thì mẻ gần như chỉ là nước.',
	nhuHoa: 'Chất nhũ hóa trong bàn này đi từ 0,05% đến 3% của mẻ.',
	xanthan: 'Xanthan trong bàn này đi từ 0,01% đến 0,5% của mẻ.',
	tong: 'Tổng mẻ phải trong 20–2.000 g.',
	nuoc: 'Lượng nước phải đủ để dầu, chất nhũ hóa và xanthan không vượt giới hạn phần trăm của mẻ.',
};

const lam6 = (x) => Math.round(x * 1e6) / 1e6;
const soHuuHan = (x) => typeof x === 'number' && Number.isFinite(x);

/** Đưa cốc (kể cả cốc của mẫu đã lưu từ trước gói này) về dạng đầy đủ. Thiếu `me` thì 100 g, thiếu `nuocTuBu` thì tự bù. */
export function chuanCoc(c = {}) {
	const r = { ...COC_RONG(), ...c };
	if (!soHuuHan(r.me)) r.me = ME.macDinh;
	r.nuocTuBu = c.nuocTuBu !== false;
	if (!['gam', 'phan-tram', 'ty-le'].includes(r.cachNhap)) r.cachNhap = 'gam';
	if (!soHuuHan(r.gNuoc)) r.gNuoc = null;
	for (const k of ['gDau', 'gNhuHoa', 'gXanthan']) if (!soHuuHan(r[k])) r[k] = COC_RONG()[k];
	for (const k of ['gDau', 'gNhuHoa']) if (r[k] <= 0) r[k] = 1e-6; // số âm hoặc 0: kẹp lên giới hạn dưới ở kepMe
	if (r.gXanthan < 0) r.gXanthan = 0;
	return r;
}

const coXanthan = (c) => c.gXanthan > 0;
/** Khối lượng các thành phần đang có trong cốc, trừ nước (g). */
export const khoiLuongKhac = (c) => (c.dau ? c.gDau : 0) + (c.nhuHoa ? c.gNhuHoa : 0) + (coXanthan(c) ? c.gXanthan : 0);
/** Tổng khối lượng mẻ (g): tự bù thì bằng `me`, tắt tự bù thì cộng các phần. */
export const tongMe = (c) => (c.nuocTuBu ? c.me : (c.gNuoc ?? 0) + khoiLuongKhac(c));
export const gNuocThuc = (c) => (c.nuocTuBu ? c.me - khoiLuongKhac(c) : (c.gNuoc ?? 0));

/**
 * Bảng quy đổi của cốc.
 * Với me = 100 và tự bù, phanTramDau/NhuHoa/Xanthan bằng hệt số gram cũ.
 * @returns {{tong, gNuocThuc, phanTramDau, phanTramNhuHoa, phanTramXanthan, phi, tyLeDauNuoc, tyLeNhuHoaDau, theTichML, loi:string[]}}
 */
export function quyDoiMe(coc) {
	const c = chuanCoc(coc);
	const tong = tongMe(c);
	const heSo = 100 / tong;
	const gN = gNuocThuc(c);
	const phanTramDau = c.gDau * heSo;
	const rho = (DAU[c.dau] ?? DAU['huong-duong']).rho;
	const loi = [];
	if (!(tong >= ME.min - 1e-9) || tong > ME.max + 1e-9) loi.push(LY.tong);
	if (gN < -1e-9) loi.push(LY.nuoc);
	const gD = c.dau ? c.gDau : 0;
	return {
		tong,
		gNuocThuc: gN,
		phanTramDau,
		phanTramNhuHoa: c.gNhuHoa * heSo,
		phanTramXanthan: c.gXanthan * heSo,
		phi: phanSoTheTich(phanTramDau, rho),
		tyLeDauNuoc: gD > 0 ? gN / gD : null, // dầu : nước = 1 : x
		tyLeNhuHoaDau: c.nhuHoa && c.gNhuHoa > 0 && gD > 0 ? gD / c.gNhuHoa : null, // chất nhũ hóa : dầu = 1 : x
		theTichML: (gD * 1000) / rho + Math.max(0, gN) + (c.nhuHoa ? c.gNhuHoa : 0) + (coXanthan(c) ? c.gXanthan : 0), // [T] coi chất nhũ hóa, xanthan 1 g/mL
		loi,
	};
}

/** Khối lượng sau khi qua máy đồng hóa để bàn: 15 mL nằm lại trong máy (mỗi lượt bấm "Chạy" tính một lần). */
export function khoiLuongSauDongHoa(tongG, theTichML, haoML) {
	if (!(theTichML > 0)) return tongG;
	return Math.max(0, tongG - haoML * (tongG / theTichML));
}

/* ---------------- giới hạn và kẹp ---------------- */

const KHOA_GRAM = ['gDau', 'gNhuHoa', 'gXanthan'];
const coMat = (c, k) => (k === 'gDau' ? !!c.dau : k === 'gNhuHoa' ? !!c.nhuHoa : coXanthan(c));
const LY_MAX = { gDau: LY.dauMax, gNhuHoa: LY.nhuHoa, gXanthan: LY.xanthan };
const LY_MIN = { gDau: LY.dauMin, gNhuHoa: LY.nhuHoa, gXanthan: LY.xanthan };

/** Khoảng gram cho phép của một ô (gDau, gNhuHoa, gXanthan hoặc gNuoc khi tắt tự bù). */
export function gioiHan(coc, k) {
	const c = chuanCoc(coc);
	if (k === 'gNuoc') {
		const khac = khoiLuongKhac(c);
		let lo = Math.max(0, ME.min - khac);
		let hi = ME.max - khac;
		for (const kk of KHOA_GRAM) {
			if (!coMat(c, kk)) continue;
			lo = Math.max(lo, (c[kk] * 100) / PT[kk][1] - khac);
			hi = Math.min(hi, (c[kk] * 100) / PT[kk][0] - khac);
		}
		return { min: lo, max: Math.max(lo, hi) };
	}
	const [pMin, pMax] = PT[k];
	if (c.nuocTuBu) {
		const lim = (p) => (p * c.me) / 100;
		return { min: lim(pMin), max: lim(pMax) };
	}
	const R = tongMe(c) - (coMat(c, k) ? c[k] : 0); // mọi phần còn lại (kể cả nước)
	return { min: (R * pMin) / (100 - pMin), max: Math.min((R * pMax) / (100 - pMax), ME.max - R) };
}

/** Kẹp cốc về giới hạn, trả kèm danh sách lý do đã kẹp. */
export function kepMe(coc) {
	const c = chuanCoc(coc);
	const ly = [];
	const them = (s) => ly.includes(s) || ly.push(s);
	if (c.nuocTuBu) {
		if (c.me < ME.min) (c.me = ME.min), them(LY.me);
		if (c.me > ME.max) (c.me = ME.max), them(LY.me);
	} else {
		const gh = gioiHan(c, 'gNuoc');
		const g = Math.max(0, c.gNuoc ?? 0);
		const kep = Math.min(Math.max(g, gh.min), gh.max);
		if (kep !== g) them(g < gh.min ? (ME.min - khoiLuongKhac(c) > g ? LY.tong : LY.nuoc) : LY.tong);
		c.gNuoc = lam6(kep);
	}
	for (let lan = 0; lan < 2; lan++) {
		for (const k of KHOA_GRAM) {
			if (k === 'gXanthan' && !coXanthan(c)) continue; // xanthan = 0 nghĩa là không dùng
			const gh = gioiHan(c, k);
			if (c[k] > gh.max + 1e-9) (c[k] = lam6(gh.max)), them(LY_MAX[k]);
			else if (c[k] < gh.min - 1e-9) (c[k] = lam6(gh.min)), them(LY_MIN[k]);
		}
	}
	if (!c.nuocTuBu) c.me = Math.round(tongMe(c) * 1000) / 1000;
	return { coc: c, ly };
}

/** Đổi khối lượng mẻ, GIỮ NGUYÊN phần trăm (nhân gram theo tỷ lệ). */
export function doiKhoiLuongMe(coc, meMoi) {
	const c = chuanCoc(coc);
	const ly = [];
	let m = Number(meMoi);
	if (!soHuuHan(m)) return { coc: c, ly };
	if (m < ME.min || m > ME.max) ly.push(LY.me);
	m = Math.min(ME.max, Math.max(ME.min, m));
	const f = m / tongMe(c);
	for (const k of KHOA_GRAM) c[k] = lam6(c[k] * f);
	if (!c.nuocTuBu) c.gNuoc = lam6((c.gNuoc ?? 0) * f);
	c.me = m;
	const r = kepMe(c);
	return { coc: r.coc, ly: [...ly, ...r.ly.filter((s) => !ly.includes(s))] };
}

/** Giá trị hiển thị trong ô số theo cách nhập đang chọn. */
export function hienThiO(coc, k) {
	const c = chuanCoc(coc);
	const g = k === 'gNuoc' ? gNuocThuc(c) : c[k];
	if (c.cachNhap === 'phan-tram') return (g * 100) / tongMe(c);
	if (c.cachNhap === 'ty-le' && k === 'gDau') return c.gDau > 0 ? gNuocThuc(c) / c.gDau : 0;
	if (c.cachNhap === 'ty-le' && k !== 'gNuoc') return (g * 100) / tongMe(c);
	return g;
}

/** Người dùng gõ giá trị `v` (theo cách nhập đang chọn) vào ô `k`: trả cốc mới đã kẹp. */
export function datO(coc, k, v) {
	const c = chuanCoc(coc);
	const ly = [];
	if (!soHuuHan(v) || v < 0) return { coc: c, ly: ['Số không hợp lệ, giữ giá trị cũ.'] };
	const R = k === 'gNuoc' ? tongMe(c) - gNuocThuc(c) : tongMe(c) - c[k]; // phần còn lại ngoài ô này
	let g = v;
	if (c.cachNhap === 'phan-tram' || (c.cachNhap === 'ty-le' && k !== 'gDau' && k !== 'gNuoc')) {
		const p = Math.min(v, 99.9);
		g = c.nuocTuBu && k !== 'gNuoc' ? (p * c.me) / 100 : (p * R) / (100 - p);
	} else if (c.cachNhap === 'ty-le' && k === 'gDau') {
		// dầu : nước = 1 : v, giữ tổng mẻ
		const tong = tongMe(c);
		const khac = (c.nhuHoa ? c.gNhuHoa : 0) + (coXanthan(c) ? c.gXanthan : 0);
		g = (tong - khac) / (1 + v);
		if (!c.nuocTuBu) c.gNuoc = lam6(g * v);
	}
	if (k === 'gNuoc') {
		c.gNuoc = lam6(g);
	} else {
		c[k] = lam6(g);
	}
	const r = kepMe(c);
	return { coc: r.coc, ly: [...ly, ...r.ly] };
}

/** Bật/tắt "tự bù nước". Tắt thì giữ nguyên lượng nước đang có. */
export function datTuBu(coc, bat) {
	const c = chuanCoc(coc);
	if (bat === c.nuocTuBu) return c;
	if (bat) {
		c.nuocTuBu = true;
		c.me = Math.min(ME.max, Math.max(ME.min, Math.round(tongMe(c) * 1000) / 1000));
		c.gNuoc = null;
	} else {
		c.gNuoc = lam6(Math.max(0, gNuocThuc(c)));
		c.nuocTuBu = false;
	}
	return c;
}

/* ---------------- đường dẫn chia sẻ công thức ---------------- */

const SO_HASH = ['me', 'gDau', 'gNhuHoa', 'gXanthan', 'rpm', 'phut', 'bar', 'lan'];
const so01 = (v) => (v === '1' ? true : v === '0' ? false : null);
const docSo = (v) => (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
const kepKhoang = (x, [lo, hi]) => Math.min(hi, Math.max(lo, x));

/** Phần sau dấu ? của hash: `#ban-nhu-tuong?me=250&...` → 'me=250&...'. */
export function tachHash(hash) {
	const i = String(hash ?? '').indexOf('?');
	return i < 0 ? { duong: String(hash ?? ''), chuoi: '' } : { duong: hash.slice(0, i), chuoi: hash.slice(i + 1) };
}

/** Chuỗi tham số từ trạng thái hiện tại; chỉ ghi khóa khác mặc định. */
export function taoThamSo({ coc, may }) {
	const c = chuanCoc(coc);
	const mm = may ?? MAY_MAC_DINH();
	const md = MAY_MAC_DINH();
	const p = [];
	const them = (k, v) => p.push(`${k}=${encodeURIComponent(String(v))}`);
	if (c.nuocTuBu && c.me !== ME.macDinh) them('me', lam6(c.me));
	if (c.dau) {
		them('dau', c.dau);
		them('gDau', lam6(c.gDau));
	}
	if (c.nhuHoa) {
		them('nhuHoa', c.nhuHoa);
		them('gNhuHoa', lam6(c.gNhuHoa));
	}
	if (coXanthan(c)) them('gXanthan', lam6(c.gXanthan));
	if (c.nuoc) them('nuoc', c.nuocTuBu ? 'tu-bu' : lam6(c.gNuoc ?? 0));
	if (c.tocopherol) them('toco', 1);
	if (c.edta) them('edta', 1);
	if (mm.khuay.rpm !== md.khuay.rpm) them('rpm', mm.khuay.rpm);
	if (mm.khuay.phut !== md.khuay.phut) them('phut', mm.khuay.phut);
	if (mm.dongHoa.bar !== md.dongHoa.bar) them('bar', mm.dongHoa.bar);
	if (mm.dongHoa.soLan !== md.dongHoa.soLan) them('lan', mm.dongHoa.soLan);
	if (mm.dongHoa.lamLanh) them('lamLanh', 1);
	return p.join('&');
}

/**
 * Đọc chuỗi tham số thành cốc và máy. Khóa lạ và giá trị hỏng bị bỏ qua, không ném lỗi.
 * `coDinh` là đề bài cố định của nhiệm vụ (khóa của đề bài thắng khóa trong đường dẫn).
 */
export function docThamSo(chuoi, coDinh = {}) {
	const c = COC_RONG();
	const may = MAY_MAC_DINH();
	const bo = [];
	let q;
	try {
		q = new URLSearchParams(String(chuoi ?? ''));
	} catch {
		return { coc: c, may, bo: ['không đọc được'], coGiaTri: false };
	}
	let coGiaTri = false;
	const lay = (k) => (q.has(k) ? q.get(k) : null);
	const so = {};
	for (const k of SO_HASH) {
		const v = lay(k);
		if (v === null) continue;
		const n = docSo(v);
		if (n === null) bo.push(k);
		else so[k] = n;
	}
	if (so.me !== undefined) c.me = so.me;
	const dau = lay('dau');
	if (dau !== null) {
		if (DAU[dau]) (c.dau = dau), (coGiaTri = true);
		else bo.push('dau');
	}
	const nh = lay('nhuHoa');
	if (nh !== null) {
		if (nh === 'khong') c.nhuHoa = null;
		else if (NHU_HOA[nh]) (c.nhuHoa = nh), (coGiaTri = true);
		else bo.push('nhuHoa');
	}
	if (so.gDau !== undefined) c.gDau = so.gDau;
	if (so.gNhuHoa !== undefined) c.gNhuHoa = so.gNhuHoa;
	if (so.gXanthan !== undefined) (c.gXanthan = so.gXanthan), (coGiaTri = true);
	const nuoc = lay('nuoc');
	if (nuoc !== null) {
		if (nuoc === 'tu-bu') (c.nuoc = true), (coGiaTri = true);
		else {
			const g = docSo(nuoc);
			if (g !== null && g >= 0) {
				c.nuoc = true;
				c.nuocTuBu = false;
				c.gNuoc = g;
				coGiaTri = true;
			} else bo.push('nuoc');
		}
	}
	for (const [k, ten] of [['toco', 'tocopherol'], ['edta', 'edta']]) {
		const b = so01(lay(k));
		if (lay(k) !== null && b === null) bo.push(k);
		else if (b !== null) c[ten] = b;
	}
	const lam = so01(lay('lamLanh'));
	if (lay('lamLanh') !== null && lam === null) bo.push('lamLanh');
	else if (lam !== null) may.dongHoa.lamLanh = lam;
	if (so.rpm !== undefined) may.khuay.rpm = Math.round(kepKhoang(so.rpm, DAI_MAY.rpm) / 500) * 500;
	if (so.phut !== undefined) may.khuay.phut = Math.round(kepKhoang(so.phut, DAI_MAY.phut) * 2) / 2;
	if (so.bar !== undefined) may.dongHoa.bar = Math.round(kepKhoang(so.bar, DAI_MAY.bar) / 10) * 10;
	if (so.lan !== undefined) may.dongHoa.soLan = Math.round(kepKhoang(so.lan, DAI_MAY.soLan));
	if (so.me !== undefined || so.gDau !== undefined || so.gNhuHoa !== undefined || so.gXanthan !== undefined) coGiaTri = true;
	// đề bài cố định thắng đường dẫn
	if (coDinh.dau) c.dau = coDinh.dau;
	if (coDinh.nhuHoa) c.nhuHoa = coDinh.nhuHoa;
	const k = kepMe(c);
	let coc = k.coc;
	if (coDinh.phanTramDau != null && c.nuocTuBu) {
		coc = kepMe({ ...coc, gDau: lam6((coDinh.phanTramDau * tongMe(coc)) / 100) }).coc;
	}
	return { coc, may, bo, coGiaTri, ly: k.ly };
}
