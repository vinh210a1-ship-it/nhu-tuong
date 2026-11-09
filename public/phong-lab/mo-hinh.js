// Bộ máy tính toán của Phòng lab ảo. Không đụng giao diện, để kiểm tự động bằng `npm run kiem`.
//
// Nguyên tắc: mọi hiện tượng trong trò chơi phải đi ra từ một cơ chế có trong bài của web.
//  - Kem hóa: công thức Stokes (đã kiểm ở máy tính Stokes).
//  - Lượng chất nhũ hóa giới hạn kích thước giọt: Γ·6φ/d (đã kiểm ở máy tính lượng chất nhũ hóa).
//  - Nhiệt sinh ra khi đồng hóa: ΔT = ΔP/(ρ·cp) ≈ 2,4 K mỗi 10 MPa (bài 02 khu nhũ tương).
//  - d32 giảm theo áp suất theo quy luật mũ, độ dốc log–log −0,3 đến −0,6 (bài 02, nhãn G).
//  - Xanthan nồng độ thấp gây keo tụ do cạn kiệt, nồng độ đủ cao tạo mạng chặn kem hóa
//    (khu chất ổn định, bài 01, nguồn Gunning 1988).
// Các hằng số "cho vừa với thực tế" (vd. d32 ở 100 bar) là TÍNH MINH HỌA (nhãn T), ghi rõ ở NHAN.

import { stokes, chatNhuHoaToiThieu, q10DoiThoiGian } from '../cong-thuc.js';

/** Dòng nhãn T hiện dưới danh sách tiêu chí ✓/✗ ở mọi bàn: ngưỡng chấm sao là luật chơi, không phải tiêu chuẩn. */
export const LUAT_CHOI = 'Ngưỡng chấm sao do trò chơi đặt ra để luyện tư duy, không phải tiêu chuẩn sản phẩm.';

/** Nhãn tin cậy cho từng giả định của mô hình, hiện ra ở màn hình "Vì sao?" */
export const NHAN = {
	stokes: { ma: 'N', chu: 'Vận tốc kem hóa theo Stokes: v = 2r²Δρg/9η', bai: 'nhu-tuong/mat-on-dinh' },
	gamma: { ma: 'N', chu: 'Giọt không thể nhỏ hơn 6φΓ/c khi chất nhũ hóa không đủ phủ bề mặt (McClements 2016, Eq. 6.11, tr.273)', bai: 'nhu-tuong/nen-tang' },
	apSuat: { ma: 'G', chu: 'd32 ∝ P^−0,5 (độ dốc thực nghiệm thường −0,3 đến −0,6, tùy hệ và van)', bai: 'nhu-tuong/hinh-thanh' },
	nhiet: { ma: 'N', chu: 'Mỗi 100 bar làm mẫu nóng thêm ≈ 2,4 °C (cân bằng năng lượng ΔP/ρcp)', bai: 'nhu-tuong/hinh-thanh' },
	canKiet: { ma: 'N', chu: 'Xanthan ít: keo tụ do cạn kiệt, kem hóa nhanh hơn. Xanthan đủ: mạng yếu giữ giọt', bai: 'chat-on-dinh/co-che-nen-tang' },
	nangLuongSA: { ma: 'N', chu: 'Mật độ năng lượng siêu âm danh định E = P·t/V (cách tính ở Belgheisi 2021, bảng 1)', bai: 'nhu-tuong/hinh-thanh' },
	hieuSuatSA: { ma: 'T', chu: 'Chỉ một phần năng lượng danh định làm vỡ giọt: sách ghi hiệu suất siêu âm đầu dò là "thấp" (McClements 2016, bảng 6.1, tr.250); hệ số 0,1 là số minh họa', bai: 'nhu-tuong/hinh-thanh' },
	quaXuLy: { ma: 'N', chu: 'Ở mức năng lượng cao nhất họ thử (3.240 J/cm³), giọt to lại và phân bố rộng ra vì quá xử lý (Belgheisi 2021, nhũ tương lycopene); mô phỏng giữ cỡ giọt không nhỏ thêm', bai: 'nhu-tuong/hinh-thanh' },
	microfluidizer: { ma: 'N', chu: 'Microfluidizer cho giọt nhỏ nhất dưới 0,1 µm với hiệu suất năng lượng cao (McClements 2016, bảng 6.1, tr.250); độ rộng phân bố hẹp hơn đồng hóa van tiêu chuẩn là số minh họa', bai: 'nhu-tuong/hinh-thanh' },
	hlb: { ma: 'K', chu: 'HLB cao (như Tween 80) hợp dầu trong nước, HLB thấp (như Span 80) hợp nước trong dầu (quy tắc Bancroft)', bai: 'chat-nhu-hoa/nen-tang-vat-ly-hoa-be-mat' },
	bienTinh: { ma: 'K', chu: 'Protein whey biến tính khi nóng, lộ vùng kỵ nước, làm các giọt dính thành cụm', bai: 'nhu-tuong/mat-on-dinh' },
	khongNo: { ma: 'N', chu: 'Độ không no quy đổi U = %C18:2 + 0,08·%C18:1 + 2,08·%C18:3; tốc độ oxy hóa (100/thời gian cảm ứng) tăng theo U (Kochhar 2009)', bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung' },
	chongOxy: { ma: 'K', chu: 'Tocopherol phá chuỗi gốc tự do; EDTA bắt kim loại (Fe, Cu) trong pha nước, nơi khởi đầu oxy hóa nhũ tương', bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung' },
	anhSang: { ma: 'K', chu: 'Ánh sáng + chất nhạy sáng sinh oxy đơn tuyến, oxy hóa không cần giai đoạn khởi đầu: chai trong hỏng nhanh hơn', bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung' },
	q10: { ma: 'T', chu: 'Q10 = 2: tăng 10 °C thì oxy hóa nhanh gấp đôi (số minh họa; Q10 thật phải đo bằng nhiều nhiệt độ)', bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung' },
	pv: { ma: 'K', chu: 'Ngưỡng chỉ số peroxide 10 meq O₂/kg dầu dùng làm mốc "bắt đầu ôi" trong trò chơi', bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung' },
	hangSo: { ma: 'T', chu: 'Hằng số mô hình (d32 ở 100 bar, ngưỡng xanthan, cỡ floc...) là số minh họa, không dùng để thiết kế' },
	gammaMinhHoa: { ma: 'T', chu: 'Γ = 2,5 mg/m² của Tween 80 và Span 80 là số minh họa, chưa có nguồn đã kiểm (sách McClements 2016 chỉ nêu Γ của chất nhũ hóa thực phẩm cỡ vài mg/m², tr.193)' },
	nguongBienTinh: { ma: 'T', chu: 'Ngưỡng biến tính ~72 °C của WPI trong trò chơi là số minh họa; nhiệt độ biến tính thật phụ thuộc pH, muối, nồng độ và phải đo trên chính hệ' },
};

export const G_CP_NUOC = 4180; // J/(kg·K)

/* ------------------------------------------------------------------ */
/* Tủ nguyên liệu                                                      */
/* ------------------------------------------------------------------ */

// c181/c182/c183: % oleic / linoleic / linolenic. Giá trị điển hình chọn để mô phỏng (nhãn T), không phải số kiểm từ sách.
export const DAU = {
	'huong-duong': { ten: 'Dầu hướng dương', rho: 920, eta: 50, gia: 60, c181: 20, c182: 66, c183: 0.5 }, // gia: nghìn đồng/kg, minh họa
	'huong-duong-oleic': { ten: 'Dầu hướng dương cao oleic', rho: 915, eta: 55, gia: 80, c181: 82, c182: 9, c183: 0.3 },
	'dau-nanh': { ten: 'Dầu đậu nành', rho: 920, eta: 50, gia: 45, c181: 23, c182: 53, c183: 7 },
	cai: { ten: 'Dầu hạt cải (canola)', rho: 915, eta: 60, gia: 55, c181: 61, c182: 21, c183: 9 },
	'o-liu': { ten: 'Dầu ô liu', rho: 912, eta: 70, gia: 200, c181: 72, c182: 10, c183: 0.7 },
	'co-olein': { ten: 'Dầu cọ olein', rho: 910, eta: 60, gia: 40, c181: 42, c182: 11, c183: 0.3 },
	lanh: { ten: 'Dầu hạt lanh (giàu omega-3)', rho: 928, eta: 45, gia: 150, c181: 20, c182: 15, c183: 53 },
	mct: { ten: 'Dầu MCT', rho: 945, eta: 25, gia: 250, c181: 0, c182: 0, c183: 0 },
};

/**
 * gamma: độ phủ bề mặt Γ (mg/m²). hieuQua: phần chất nhũ hóa thật sự hòa tan và lên được bề mặt.
 * tocDo: hệ số nhân lên d32 do hấp phụ nhanh/chậm (phân tử nhỏ hấp phụ nhanh hơn protein).
 * loai: 'OW' (hợp nhũ tương dầu trong nước) hoặc 'WO'. nhayNhiet: °C bắt đầu biến tính (null nếu không).
 */
export const NHU_HOA = {
	wpi: { ten: 'Whey protein isolate (WPI)', gamma: 1.4, hieuQua: 0.9, tocDo: 1.0, loai: 'OW', nhayNhiet: 72, nhayNhietMinhHoa: true, gia: 300,
		ghiChu: 'Γ ≈ 1,4 mg/m² (Hinderink 2021). β-lactoglobulin biến tính khi nóng, protein lộ vùng kỵ nước làm giọt dính nhau.' },
	ppi: { ten: 'Protein đậu Hà Lan (PPI)', gamma: 2.5, hieuQua: 0.5, tocDo: 1.1, loai: 'OW', nhayNhiet: null, gia: 120,
		ghiChu: 'Γ ≈ 2,5 mg/m² (Hinderink 2021). Độ tan thấp: chỉ phần hòa tan mới nhũ hóa được (hiệu quả 50% là số minh họa).' },
	tween80: { ten: 'Polysorbate 80 (Tween 80, E433)', gamma: 2.5, gammaMinhHoa: true, hieuQua: 1.0, tocDo: 0.85, loai: 'OW', nhayNhiet: null, gia: 200,
		ghiChu: 'HLB cao: ưa nước, hợp dầu trong nước. Phân tử nhỏ hấp phụ nhanh nên giọt vừa vỡ đã được phủ kịp.' },
	span80: { ten: 'Sorbitan monooleate (Span 80, E494)', gamma: 2.5, gammaMinhHoa: true, hieuQua: 1.0, tocDo: 0.85, loai: 'WO', nhayNhiet: null, gia: 180,
		ghiChu: 'HLB thấp: ưa dầu, hợp nước trong dầu. Dùng cho dầu trong nước thì các giọt hợp giọt với nhau, nổi váng dầu.' },
};

/* ------------------------------------------------------------------ */
/* Công thức con                                                       */
/* ------------------------------------------------------------------ */

const kep = (x, a, b) => Math.min(b, Math.max(a, x));

/** % khối lượng dầu → phân số thể tích φ */
export function phanSoTheTich(phanTramDau, rhoDau, rhoNuoc = 1000) {
	const vD = phanTramDau / rhoDau;
	const vN = (100 - phanTramDau) / rhoNuoc;
	return vD / (vD + vN);
}

/** Máy khuấy tốc độ cao (rotor–stator): d32 tiền nhũ (µm). [T] */
export function dTienNhu(rpm, phut) {
	if (!(rpm > 0) || !(phut > 0)) return 300; // chưa trộn: dầu còn là mảng lớn
	return kep(25 * (10000 / rpm) ** 1.2 * Math.sqrt(1 + 1 / phut), 4, 300);
}

/** Máy đồng hóa áp suất cao: d32 giới hạn bởi năng lượng (µm). [G cho số mũ, T cho hằng số] */
export function dTheoApSuat(bar, soLan, etaDau, tocDo = 1) {
	if (!(bar >= 20) || !(soLan >= 1)) return Infinity;
	const D100 = 2.5; // µm ở 100 bar, 1 lần, dầu 50 mPa·s [T]
	return D100 * (bar / 100) ** -0.5 * soLan ** -0.25 * (etaDau / 50) ** 0.15 * tocDo;
}

/**
 * Máy siêu âm đầu dò (gói P3). Mật độ năng lượng danh định E = P·t/V (J/mL, định nghĩa dùng ở Belgheisi 2021, bảng 1).
 * Hiệu suất năng lượng của siêu âm đầu dò là "thấp" (McClements 2016, bảng 6.1, tr.250), nên chỉ một phần E làm vỡ giọt:
 * ETA = 0,1 là số minh họa [T]. Quy E hiệu dụng về "bar tương đương" của máy đồng hóa (1 bar = 10⁵ J/m³ = 0,1 J/mL, E_V ≈ ΔP) để dùng lại
 * đúng đường d–năng lượng của dTheoApSuat, không thêm số mũ mới. Từ E danh định 3.240 J/mL trở lên giọt không nhỏ thêm (quá xử lý, Belgheisi 2021) [T].
 */
export const SIEU_AM = { ETA: 0.1, E_QUA_XU_LY: 3240, SAN_D: 0.1, SAN_D_MF: 0.05, SIGMA_MF: 0.35, SIGMA: 0.45 };
export const J_ML_MOI_BAR = 0.1;
export const nangLuongDanhDinh = (congSuatW, phut, theTichML) => (congSuatW * phut * 60) / theTichML;

/** d32 nhỏ nhất mà lượng chất nhũ hóa cho phép: d = 6φΓ/c (đảo công thức chatNhuHoaToiThieu). */
export function dTheoChatNhuHoa(phi, gammaMgM2, cGL) {
	if (!(cGL > 0)) return Infinity;
	return ((6 * phi * gammaMgM2 * 1e-6) / cGL) * 1e6; // µm
}

/** Nhiệt độ mẫu ra khỏi máy đồng hóa. Có làm lạnh giữa các lần thì nhiệt không cộng dồn. */
export function nhietDoRa(nhietVao, bar, soLan, lamLanh, rho = 1000, cp = G_CP_NUOC) {
	if (!(bar > 0) || !(soLan >= 1)) return nhietVao;
	const dT = (bar * 1e5) / (rho * cp);
	return nhietVao + dT * (lamLanh ? 1 : soLan);
}

/** Độ nhớt thấp-cắt của pha nước có xanthan (mPa·s), trong nền có muối. [T, hình dạng theo số liệu khu chất ổn định] */
export function doNhotXanthan(phanTram) {
	if (!(phanTram > 0)) return 1;
	return 1 + 150 * (phanTram / 0.1) ** 2.85;
}

/** Chế độ của xanthan theo nồng độ (ngưỡng là số minh họa) */
export function cheDoXanthan(phanTram, phi) {
	if (!(phanTram >= 0.01)) return 'khong';
	if (phanTram < 0.15) return phi >= 0.03 ? 'can-kiet' : 'loang';
	if (phanTram < 0.25) return 'dac';
	return 'mang';
}

/** Phân bố log-chuẩn: từ d32 và độ lệch σ (ln) ra d43, dv10, dv50, dv90 */
export function dacTrungPhanBo(d32, sigma) {
	const dv50 = d32 * Math.exp(0.5 * sigma * sigma);
	return {
		d32,
		d43: d32 * Math.exp(sigma * sigma),
		dv10: dv50 * Math.exp(-1.2816 * sigma),
		dv50,
		dv90: dv50 * Math.exp(1.2816 * sigma),
	};
}

/** Chia phân bố thể tích thành các lớp kích thước (để tính kem hóa từng lớp và vẽ biểu đồ) */
export function lopKichThuoc(dv50, sigma, soLop = 41) {
	const lop = [];
	let tong = 0;
	for (let i = 0; i < soLop; i++) {
		const z = -3 + (6 * i) / (soLop - 1);
		const d = dv50 * Math.exp(z * sigma);
		const w = Math.exp(-0.5 * z * z);
		lop.push({ d, w });
		tong += w;
	}
	lop.forEach((l) => (l.w /= tong));
	return lop;
}

/* ------------------------------------------------------------------ */
/* Oxy hóa chất béo                                                    */
/* ------------------------------------------------------------------ */

/** Độ không no quy đổi theo Kochhar 2009: U = C18:2 + 0,08·C18:1 + 2,08·C18:3 */
export function doKhongNo(dau) {
	return dau.c182 + 0.08 * dau.c181 + 2.08 * dau.c183;
}

export const Q10_OXY = 2; // [T]
export const PV_NGUONG = 10; // meq O2/kg [K]

/**
 * Thời gian cảm ứng (ngày) của dầu trong nhũ tương: hết giai đoạn này thì peroxide tăng vọt.
 * Tốc độ ∝ (U + 3); chất chống oxy hóa và chai tối kéo dài; giọt mịn (nhiều bề mặt) rút ngắn. [hằng số T]
 */
export function thoiGianCamUng({ dau, d32 = 1, tocopherol = false, edta = false, nhietDo = 25, sang = false }) {
	let ip = 1500 / (doKhongNo(dau) + 3); // ngày ở 25 °C, tối, không chống oxy hóa
	if (tocopherol) ip *= 2.5;
	if (edta) ip *= 2;
	if (sang) ip /= 3;
	ip *= kep((d32 / 1) ** 0.15, 0.6, 1.6); // giọt nhỏ → nhiều bề mặt tiếp xúc kim loại/oxy
	return q10DoiThoiGian(ip, 25, nhietDo, Q10_OXY);
}

/** Chỉ số peroxide theo thời gian: thấp trong giai đoạn cảm ứng rồi tăng theo hàm mũ; PV(ip) = 10. */
export function chiSoPeroxide(ngay, ip) {
	const PV0 = 0.5;
	const x = ngay / ip;
	return PV0 + ((PV_NGUONG - PV0) * (Math.exp(3 * x) - 1)) / (Math.exp(3) - 1);
}

/* ------------------------------------------------------------------ */
/* Mô phỏng một mẻ                                                     */
/* ------------------------------------------------------------------ */

/**
 * @param {object} me công thức + quy trình
 *  dau, phanTramDau, nhuHoa (khóa NHU_HOA hoặc null), phanTramNhuHoa, phanTramXanthan,
 *  khuay: { rpm, phut }, dongHoa: { bar, soLan, lamLanh }, nhietVao (°C)
 * @returns kết quả: kích thước giọt, nhiệt, cảnh báo, và hàm ongNghiem(ngay)
 */
export function moPhongMe(me) {
	const dau = DAU[me.dau] ?? DAU['huong-duong'];
	const nh = me.nhuHoa ? NHU_HOA[me.nhuHoa] : null;
	const phi = phanSoTheTich(me.phanTramDau, dau.rho);
	const canhBao = [];

	// 1. Tiền nhũ
	const khuay = me.khuay ?? { rpm: 0, phut: 0 };
	const dPre = dTienNhu(khuay.rpm, khuay.phut);

	// 2. Đồng hóa
	// Máy làm mịn: 'dongHoa' (mặc định, giữ nguyên mẻ và mẫu cũ), 'microfluidizer' hoặc 'sieuAm'. Ba máy dùng chung đường d–năng lượng.
	const lamMin = me.lamMin ?? 'dongHoa';
	const khong = { bar: 0, soLan: 0, lamLanh: false };
	const V = me.theTichML ?? 100;
	let dh = me.dongHoa ?? khong;
	let nangLuong = null; // J/mL
	let quaXuLy = false;
	let barNhiet; // áp suất tính nhiệt: siêu âm ngâm bể đá nên không cộng nhiệt [G]
	if (lamMin === 'microfluidizer') dh = me.microfluidizer ?? khong;
	if (lamMin === 'sieuAm') {
		const su = me.sieuAm ?? { W: 0, phut: 0 };
		const eDD = su.W > 0 && su.phut > 0 ? nangLuongDanhDinh(su.W, su.phut, V) : 0;
		quaXuLy = eDD >= SIEU_AM.E_QUA_XU_LY;
		const eDung = SIEU_AM.ETA * Math.min(eDD, SIEU_AM.E_QUA_XU_LY);
		nangLuong = { danhDinh: eDD, hieuDung: SIEU_AM.ETA * eDD, barTuongDuong: eDung / J_ML_MOI_BAR };
		dh = { bar: eDung / J_ML_MOI_BAR, soLan: 1, lamLanh: true };
		barNhiet = 0;
	} else {
		barNhiet = dh.bar;
		const e = dh.bar >= 20 && dh.soLan >= 1 ? J_ML_MOI_BAR * dh.bar * dh.soLan : 0;
		nangLuong = { danhDinh: e, hieuDung: e, barTuongDuong: dh.bar };
	}
	const coDongHoa = dh.bar >= 20 && dh.soLan >= 1;
	let dE = dTheoApSuat(dh.bar, dh.soLan, dau.eta, nh ? nh.tocDo : 1);
	if (lamMin === 'sieuAm') dE = Math.max(SIEU_AM.SAN_D, dE);
	if (lamMin === 'microfluidizer') dE = Math.max(SIEU_AM.SAN_D_MF, dE);
	if (quaXuLy)
		canhBao.push({
			ma: 'qua-xu-ly',
			chu: `Một nghiên cứu thấy ở mức năng lượng cao nhất họ thử (${SIEU_AM.E_QUA_XU_LY.toLocaleString('vi-VN')} J/cm³), giọt to lại và phân bố rộng ra vì quá xử lý (Belgheisi 2021, nhũ tương lycopene). Mô phỏng giữ cỡ giọt không nhỏ thêm.`,
		});
	if (coDongHoa && dPre > 100) {
		dE *= 1.4; // không tiền nhũ: lần qua máy đầu tiên làm việc của máy khuấy [T]
		canhBao.push({ ma: 'khong-tien-nhu', chu: 'Bạn cho thẳng dầu và nước vào máy đồng hóa. Lần qua máy đầu chỉ kịp xé mảng dầu lớn, nên giọt to hơn.' });
	}
	const dCo = Math.min(dPre, dE);

	// 3. Giới hạn chất nhũ hóa
	const nhietRa = nhietDoRa(me.nhietVao ?? 25, coDongHoa ? barNhiet : 0, coDongHoa ? dh.soLan : 0, dh.lamLanh);
	let cGL = nh ? me.phanTramNhuHoa * 10 * nh.hieuQua : 0; // % khối lượng ≈ g/100 g ≈ 10 g/L
	const dGamma = nh ? dTheoChatNhuHoa(phi, nh.gamma, cGL) : Infinity;
	// Gộp mềm hai giới hạn: giọt bằng cái lớn hơn trong hai (chế độ năng lượng / chế độ thiếu chất nhũ hóa)
	let d32 = isFinite(dGamma) ? (dCo ** 4 + dGamma ** 4) ** 0.25 : Math.max(dCo, 40);
	const thieuNhuHoa = dGamma > dCo;
	if (!nh) {
		canhBao.push({ ma: 'khong-nhu-hoa', chu: 'Không có chất nhũ hóa: giọt vừa vỡ đã nhập lại ngay. Nhũ tương tách lớp trong vài phút.' });
	} else if (thieuNhuHoa) {
		canhBao.push({
			ma: 'thieu-nhu-hoa',
			chu: `Chất nhũ hóa không đủ phủ bề mặt giọt. Máy có thể xé tới ${so(dCo)} µm nhưng chỉ đủ chất để giữ giọt ${so(dGamma)} µm, phần dư hợp giọt lại.`,
		});
	}
	const nhuHoaToiThieu = nh ? chatNhuHoaToiThieu(phi, Math.min(d32, dCo), nh.gamma).cGL / 10 / nh.hieuQua : null;

	// 4. Nhiệt: protein biến tính
	let bienTinh = false;
	if (nh?.nhayNhiet && nhietRa > nh.nhayNhiet) {
		bienTinh = true;
		canhBao.push({
			ma: 'bien-tinh',
			chu: `Mẫu ra máy nóng ${so(nhietRa)} °C, quá ngưỡng biến tính của ${nh.ten.split(' (')[0]} (~${nh.nhayNhiet} °C). Protein lộ vùng kỵ nước, các giọt dính nhau thành cụm.`,
		});
	}

	// 5. Sai loại chất nhũ hóa → hợp giọt khi bảo quản
	const saiLoai = nh?.loai === 'WO';
	if (saiLoai) canhBao.push({ ma: 'sai-hlb', chu: `${nh.ten} có HLB thấp, ưa dầu. Nó ổn định nước trong dầu, không phải dầu trong nước: giọt sẽ hợp giọt dần và nổi váng dầu.` });

	const sigma = coDongHoa ? (lamMin === 'microfluidizer' ? SIEU_AM.SIGMA_MF : SIEU_AM.SIGMA) : 0.75; // độ rộng phân bố [T]; microfluidizer hẹp hơn đồng hóa van tiêu chuẩn
	const pb = dacTrungPhanBo(d32, sigma);

	// 6. Pha liên tục và xanthan
	const cheDo = cheDoXanthan(me.phanTramXanthan ?? 0, phi);
	const etaC = doNhotXanthan(me.phanTramXanthan ?? 0);
	if (cheDo === 'can-kiet')
		canhBao.push({ ma: 'can-kiet', chu: 'Xanthan ở nồng độ thấp không hấp phụ lên giọt, chen vào khe giữa các giọt rồi ép chúng thành cụm (keo tụ do cạn kiệt). Cụm to nổi nhanh hơn giọt lẻ.' });

	const ketQua = {
		phi, d32, ...pb, sigma, dPre, dE, dGamma, nhietRa, etaC, cheDo, bienTinh, saiLoai, thieuNhuHoa, nhuHoaToiThieu,
		lamMin, nangLuong, quaXuLy, tongGam: me.tongGam ?? null, conLaiGam: me.conLaiGam ?? null,
		nangLuongTongJ: nangLuong.hieuDung * V, // J, tính trên cả mẻ
		canhBao, rhoDau: dau.rho,
		chiPhi: chiPhi(me, dau, nh),
	};
	ketQua.ongNghiem = (ngay, nhietDo = 25) => ongNghiem(ketQua, ngay, nhietDo);
	/** Oxy hóa sau `ngay` ngày ở nhiệt độ và ánh sáng cho trước */
	ketQua.oxyHoa = (ngay, nhietDo = 25, sang = false) => {
		const ip = thoiGianCamUng({ dau, d32: ketQua.d32, tocopherol: !!me.tocopherol, edta: !!me.edta, nhietDo, sang });
		return { ip, pv: chiSoPeroxide(ngay, ip), U: doKhongNo(dau) };
	};
	return ketQua;
}

function so(x) {
	return x.toLocaleString('vi-VN', { maximumSignificantDigits: 2 });
}

/** Chi phí cho 1 kg sản phẩm (nghìn đồng), minh họa: nguyên liệu + điện cho máy đồng hóa */
function chiPhi(me, dau, nh) {
	const nl =
		(me.phanTramDau / 100) * dau.gia +
		(nh ? (me.phanTramNhuHoa / 100) * nh.gia : 0) +
		((me.phanTramXanthan ?? 0) / 100) * 400 +
		(me.tocopherol ? 0.6 : 0) +
		(me.edta ? 0.1 : 0);
	const lm = me.lamMin ?? 'dongHoa';
	const may = lm === 'microfluidizer' ? me.microfluidizer : me.dongHoa;
	// siêu âm: tính điện theo bar tương đương của E hiệu dụng, cùng hệ số 0,6 với máy đồng hóa (số minh họa)
	const eDD = lm === 'sieuAm' && me.sieuAm?.W > 0 ? nangLuongDanhDinh(me.sieuAm.W, me.sieuAm.phut, me.theTichML ?? 100) : 0;
	const dh = lm === 'sieuAm' ? ((SIEU_AM.ETA * Math.min(eDD, SIEU_AM.E_QUA_XU_LY)) / J_ML_MOI_BAR / 100) * 0.6 : may?.bar >= 20 ? (may.bar / 100) * may.soLan * 0.6 : 0;
	const khuay = me.khuay?.rpm > 0 ? 0.3 : 0;
	return nl + dh + khuay;
}

/* ------------------------------------------------------------------ */
/* Ống nghiệm theo thời gian                                           */
/* ------------------------------------------------------------------ */

export const CAO_ONG_MM = 100;

/** Độ nhớt của nước theo nhiệt độ (mPa·s), phương trình Vogel: 0,89 ở 25 °C, 1,57 ở 4 °C */
export function doNhotNuoc(nhietDo) {
	return 0.02939 * Math.exp(507.88 / (nhietDo + 273.15 - 149.3));
}

/**
 * Ống nghiệm cao 100 mm sau `ngay` ngày ở `nhietDo` °C.
 * Trả về chiều cao (mm) lớp váng dầu, lớp kem, vùng đục, vùng trong (serum) và chỉ số kem hóa CI = H_serum/H × 100.
 */
export function ongNghiem(kq, ngay, nhietDo = 25) {
	const H = CAO_ONG_MM;
	const giay = ngay * 86400;

	// Hợp nhất: giọt lớn dần theo thời gian (sai HLB / không chất nhũ hóa / biến tính) [T]
	let tangCo = 1;
	let vangDauPhan = 0; // phần dầu tách thành váng tự do
	if (kq.saiLoai || !isFinite(kq.dGamma)) {
		tangCo = 1 + ngay / 0.5;
		vangDauPhan = 1 - Math.exp(-ngay / (isFinite(kq.dGamma) ? 3 : 0.05));
	} else if (kq.thieuNhuHoa) {
		const thieu = kq.dGamma / Math.max(kq.d32, 1e-9);
		tangCo = 1 + (ngay / 30) * 0.3 * thieu;
	}

	// Kích thước "đơn vị nổi": giọt lẻ, hoặc cụm khi biến tính / cạn kiệt
	let heSoCum = 1;
	if (kq.bienTinh) heSoCum = Math.max(heSoCum, 3);
	const lop = lopKichThuoc(kq.dv50 * tangCo, kq.sigma);

	let etaKemHoa = kq.etaC * (doNhotNuoc(nhietDo) / doNhotNuoc(25)); // lạnh thì nước đặc hơn, kem hóa chậm hơn
	let dungYen = false;
	if (kq.cheDo === 'mang') dungYen = true; // mạng yếu, có ứng suất chảy: giọt đứng yên
	const hinder = (1 - kq.phi) ** 5; // Richardson–Zaki: giọt cản nhau khi đặc [K]

	let phanNoi = 0; // phần thể tích dầu đã lên lớp kem
	let vNhoNhat = Infinity;
	for (const l of lop) {
		let d = l.d * heSoCum;
		if (kq.cheDo === 'can-kiet') d = Math.max(d * 6, 15); // cụm do cạn kiệt [T]
		const v = dungYen ? 0 : Math.max(0, stokes(d, 1000, kq.rhoDau, etaKemHoa).v) * hinder; // m/s
		const quangDuong = v * giay * 1000; // mm
		phanNoi += l.w * Math.min(1, quangDuong / H);
		if (l.w > 0.02) vNhoNhat = Math.min(vNhoNhat, quangDuong);
	}
	phanNoi = Math.min(1, phanNoi + vangDauPhan * (1 - phanNoi));

	const vangDau = Math.min(H * kq.phi, H * kq.phi * vangDauPhan);
	// Lớp kem: dầu đã nổi (trừ phần thành váng) xếp chặt ở φ ≈ 0,6 [T]
	const kemDuong = Math.max(0, Math.min(H - vangDau, (H * kq.phi * (phanNoi - vangDauPhan)) / 0.6));
	const serum = Math.min(H - vangDau - kemDuong, isFinite(vNhoNhat) ? vNhoNhat : 0);
	const duc = Math.max(0, H - vangDau - kemDuong - serum);
	return {
		ngay,
		vangDau,
		kem: kemDuong,
		duc,
		serum,
		CI: (serum / H) * 100,
		phanNoi,
	};
}

/* ------------------------------------------------------------------ */
/* Nhiệm vụ                                                            */
/* ------------------------------------------------------------------ */

/** Ngưỡng năng lượng (J) của hai sao cuối ở nhiệm vụ it-nang-luong: luật chơi [T], đã dò lưới là đạt được. */
export const NANG_LUONG_SAO = [150000, 110000];

export const NHIEM_VU = [
	{
		id: 'sua-thuc-vat',
		ten: 'Sữa hạt không tách lớp',
		de: 'Làm sữa hạt 3% dầu hướng dương, bán trong 7 ngày. Khách mở chai ra không được thấy lớp kem hay lớp nước trong.',
		coDinh: { dau: 'huong-duong', phanTramDau: 3 },
		ngay: 7,
		nganSach: 12,
		sao: [
			{ chu: 'Chỉ số kem hóa sau 7 ngày dưới 10%', dat: (kq, o) => o.CI < 10 },
			{ chu: 'Không váng dầu, không vón cục', dat: (kq, o) => o.vangDau < 0.5 && !kq.bienTinh },
			{ chu: 'Chi phí không quá 12 nghìn đồng/kg', dat: (kq) => kq.chiPhi <= 12 },
		],
	},
	{
		id: 'whey-nong',
		ten: 'Đồ uống whey giàu đạm',
		de: 'Nhũ tương 10% dầu MCT, chất nhũ hóa bắt buộc là WPI. Giọt d43 phải dưới 1 µm và protein không được biến tính.',
		coDinh: { dau: 'mct', phanTramDau: 10, nhuHoa: 'wpi' },
		ngay: 14,
		nganSach: 60,
		sao: [
			{ chu: 'd43 dưới 1 µm', dat: (kq) => kq.d43 < 1 },
			{ chu: 'Protein không biến tính', dat: (kq) => !kq.bienTinh },
			{ chu: 'Chỉ số kem hóa sau 14 ngày dưới 5%', dat: (kq, o) => o.CI < 5 },
		],
	},
	{
		id: 'sot-salad',
		ten: 'Sốt salad đứng yên',
		de: 'Sốt 20% dầu hướng dương. Để 60 ngày không tách lớp. Gợi ý: máy đồng hóa không phải công cụ duy nhất.',
		coDinh: { dau: 'huong-duong', phanTramDau: 20 },
		ngay: 60,
		nganSach: 25,
		sao: [
			{ chu: 'Chỉ số kem hóa sau 60 ngày dưới 3%', dat: (kq, o) => o.CI < 3 },
			{ chu: 'Không váng dầu', dat: (kq, o) => o.vangDau < 0.5 },
			{ chu: 'Chi phí không quá 25 nghìn đồng/kg', dat: (kq) => kq.chiPhi <= 25 },
		],
	},
	{
		id: 'omega-3',
		ten: 'Sữa omega-3 không ôi',
		de: 'Đồ uống 5% dầu hạt lanh, bảo quản lạnh 4 °C trong 60 ngày. Không được tách lớp, và không được ôi (chỉ số peroxide dưới 10).',
		coDinh: { dau: 'lanh', phanTramDau: 5 },
		ngay: 60,
		baoQuan: { nhietDo: 4 },
		nganSach: 30,
		sao: [
			{ chu: 'Chỉ số peroxide sau 60 ngày ở 4 °C dưới 10 meq/kg', dat: (kq, o, bq) => kq.oxyHoa(60, 4, bq.sang).pv < PV_NGUONG },
			{ chu: 'Chỉ số kem hóa sau 60 ngày dưới 10%', dat: (kq, o) => o.CI < 10 },
			{ chu: 'Chi phí không quá 30 nghìn đồng/kg', dat: (kq) => kq.chiPhi <= 30 },
		],
	},
	// ---- Gói P3: máy làm mịn. Ngưỡng ở ba nhiệm vụ dưới đây là luật chơi [T]; scripts/kiem-phong-lab.mjs dò lưới để chắc có lời giải 3 sao.
	{
		id: 'ba-may',
		ten: 'Ba máy, một công thức',
		de: 'Làm cùng một công thức (10% dầu hướng dương, Tween 80) bằng cả ba máy làm mịn, mỗi mẻ 100 g, đo từng mẻ bằng máy nhiễu xạ laser. Ghi ba mẻ vào Sổ tay rồi so d₃₂, d₉₀ và năng lượng của ba máy.',
		coDinh: { dau: 'huong-duong', phanTramDau: 10, nhuHoa: 'tween80' },
		moMay: true, // bày cả ba máy làm mịn
		ngay: 7,
		nganSach: 40,
		sao: [
			{ chu: 'Sổ tay có đủ ba mẻ của ba máy làm mịn, cùng công thức (phần trăm Tween 80 lệch nhau không quá 0,5 điểm)', dat: (kq, o, bq, st) => baMayDu(st) && baMayCungCongThuc(st) },
			{ chu: 'Cả ba mẻ đều 100 g', dat: (kq, o, bq, st) => baMayMoi(st).length === 3 && baMayMoi(st).every((e) => Math.abs(e.me - 100) <= 0.5) },
			{ chu: 'Cả ba mẻ đã đo bằng máy nhiễu xạ laser', dat: (kq, o, bq, st) => baMayMoi(st).length === 3 && baMayMoi(st).every((e) => e.laser) },
		],
	},
	{
		id: 'me-lon',
		ten: 'Mẻ lớn cho khách',
		de: 'Khách cần 800 g nhũ tương 10% dầu hướng dương, giọt d₃₂ không quá 0,6 µm. Chọn máy làm mịn hợp với cỡ mẻ.',
		coDinh: { dau: 'huong-duong', phanTramDau: 10 },
		moMay: true,
		ngay: 7,
		nganSach: 40,
		sao: [
			{ chu: 'Mẻ từ 800 g trở lên', dat: (kq) => (kq.tongGam ?? 0) >= 800 - 1e-9 },
			{ chu: 'd₃₂ không quá 0,6 µm', dat: (kq) => kq.d32 <= 0.6 },
			{ chu: 'Sau khi qua máy còn ít nhất 780 g', dat: (kq) => (kq.conLaiGam ?? 0) >= 780 - 1e-9 },
		],
	},
	{
		id: 'it-nang-luong',
		ten: 'Mẻ lớn, ít năng lượng nhất',
		de: 'Vẫn là mẻ 800 g, d₃₂ không quá 0,6 µm và còn ít nhất 780 g, nhưng dùng ít năng lượng nhất. Mở sau khi bạn được 3 sao ở nhiệm vụ "Mẻ lớn cho khách".',
		coDinh: { dau: 'huong-duong', phanTramDau: 10 },
		moMay: true,
		moKhoa: { can: 'me-lon', sao: 3 },
		ngay: 7,
		nganSach: 40,
		sao: [
			{ chu: 'Đủ ba điều kiện của "Mẻ lớn cho khách" (800 g, d₃₂ ≤ 0,6 µm, còn ≥ 780 g)', dat: (kq) => (kq.tongGam ?? 0) >= 800 - 1e-9 && kq.d32 <= 0.6 && (kq.conLaiGam ?? 0) >= 780 - 1e-9 },
			{ chu: `Tổng năng lượng hiệu dụng không quá ${NANG_LUONG_SAO[0] / 1000} kJ cho cả mẻ`, dat: (kq) => kq.d32 <= 0.6 && (kq.tongGam ?? 0) >= 800 - 1e-9 && kq.nangLuongTongJ <= NANG_LUONG_SAO[0] },
			{ chu: `Tổng năng lượng hiệu dụng không quá ${NANG_LUONG_SAO[1] / 1000} kJ cho cả mẻ`, dat: (kq) => kq.d32 <= 0.6 && (kq.tongGam ?? 0) >= 800 - 1e-9 && kq.nangLuongTongJ <= NANG_LUONG_SAO[1] },
		],
	},
];

/** Ba mẻ mới nhất của nhiệm vụ ba-may, mỗi máy làm mịn một mẻ (mẻ mới hơn thay mẻ cũ cùng máy). */
export function baMayMoi(soTay = []) {
	const theo = {};
	for (const e of soTay) if (e.nvId === 'ba-may' && e.lamMin && !theo[e.lamMin]) theo[e.lamMin] = e; // soTay: mới nhất đứng đầu
	return ['dongHoa', 'microfluidizer', 'sieuAm'].filter((m) => theo[m]).map((m) => theo[m]);
}
export const baMayDu = (soTay) => baMayMoi(soTay).length === 3;
export const baMayCungCongThuc = (soTay) => {
	const ds = baMayMoi(soTay);
	if (ds.length < 3) return false;
	const p = ds.map((e) => e.pNhuHoa);
	return Math.max(...p) - Math.min(...p) <= 0.5 + 1e-9;
};

/** Chấm sao một mẻ cho một nhiệm vụ. `soTay`: các mục Sổ tay (mới nhất đứng đầu), chỉ nhiệm vụ nhiều mẻ mới dùng. */
export function chamSao(nhiemVu, kq, baoQuan = { sang: false }, soTay = []) {
	const o = kq.ongNghiem(nhiemVu.ngay, nhiemVu.baoQuan?.nhietDo ?? 25);
	const tieuChi = nhiemVu.sao.map((s) => ({ chu: s.chu, dat: !!s.dat(kq, o, baoQuan, soTay) }));
	return { tieuChi, sao: tieuChi.filter((t) => t.dat).length, ong: o };
}
