// Bộ máy tính toán của Phòng lab ảo. Không đụng giao diện, để kiểm tự động bằng `npm run kiem`.
//
// Nguyên tắc: mọi hiện tượng trong trò chơi phải đi ra từ một cơ chế có trong bài của web.
//  - Kem hóa: công thức Stokes (đã kiểm ở máy tính Stokes).
//  - Lượng chất nhũ hóa giới hạn kích thước giọt: Γ·6φ/d (đã kiểm ở máy tính lượng chất nhũ hóa).
//  - Nhiệt sinh ra khi đồng hóa: ΔT = ΔP/(ρ·cp) ≈ 2,4 K mỗi 10 MPa (bài 02 khu nhũ tương).
//  - d32 giảm theo áp suất theo quy luật mũ, độ dốc log–log −0,3 đến −0,6 (bài 02, nhãn G).
//  - Xanthan nồng độ thấp gây kết bông do cạn kiệt, nồng độ đủ cao tạo mạng chặn kem hóa
//    (khu chất ổn định, bài 01, nguồn Gunning 1988).
// Các hằng số "cho vừa với thực tế" (vd. d32 ở 100 bar) là TÍNH MINH HỌA (nhãn T), ghi rõ ở NHAN.

import { stokes, chatNhuHoaToiThieu } from '../cong-thuc.js';

/** Nhãn tin cậy cho từng giả định của mô hình, hiện ra ở màn hình "Vì sao?" */
export const NHAN = {
	stokes: { ma: 'N', chu: 'Vận tốc kem hóa theo Stokes: v = 2r²Δρg/9η', bai: 'nhu-tuong/03-co-che-mat-on-dinh' },
	gamma: { ma: 'N', chu: 'Giọt không thể nhỏ hơn 6φΓ/c khi chất nhũ hóa không đủ phủ bề mặt', bai: 'nhu-tuong/01-nen-tang-nhu-tuong' },
	apSuat: { ma: 'G', chu: 'd32 ∝ P^−0,5 (độ dốc thực nghiệm thường −0,3 đến −0,6, tùy hệ và van)', bai: 'nhu-tuong/02-hinh-thanh-nhu-tuong' },
	nhiet: { ma: 'N', chu: 'Mỗi 100 bar làm mẫu nóng thêm ≈ 2,4 °C (cân bằng năng lượng ΔP/ρcp)', bai: 'nhu-tuong/02-hinh-thanh-nhu-tuong' },
	canKiet: { ma: 'N', chu: 'Xanthan ít: kết bông do cạn kiệt, kem hóa nhanh hơn. Xanthan đủ: mạng yếu giữ giọt', bai: 'chat-on-dinh/01-co-che-nen-tang' },
	hangSo: { ma: 'T', chu: 'Hằng số mô hình (d32 ở 100 bar, ngưỡng xanthan, cỡ floc...) là số minh họa, không dùng để thiết kế' },
};

export const G_CP_NUOC = 4180; // J/(kg·K)

/* ------------------------------------------------------------------ */
/* Tủ nguyên liệu                                                      */
/* ------------------------------------------------------------------ */

export const DAU = {
	'huong-duong': { ten: 'Dầu hướng dương', rho: 920, eta: 50, gia: 60 }, // gia: nghìn đồng/kg, minh họa
	mct: { ten: 'Dầu MCT', rho: 945, eta: 25, gia: 250 },
};

/**
 * gamma: độ phủ bề mặt Γ (mg/m²). hieuQua: phần chất nhũ hóa thật sự hòa tan và lên được bề mặt.
 * tocDo: hệ số nhân lên d32 do hấp phụ nhanh/chậm (phân tử nhỏ hấp phụ nhanh hơn protein).
 * loai: 'OW' (hợp nhũ tương dầu trong nước) hoặc 'WO'. nhayNhiet: °C bắt đầu biến tính (null nếu không).
 */
export const NHU_HOA = {
	wpi: { ten: 'Whey protein isolate (WPI)', gamma: 1.4, hieuQua: 0.9, tocDo: 1.0, loai: 'OW', nhayNhiet: 72, gia: 300,
		ghiChu: 'Γ ≈ 1,4 mg/m² (Hinderink 2021). β-lactoglobulin biến tính khi nóng, protein lộ vùng kỵ nước làm giọt dính nhau.' },
	ppi: { ten: 'Protein đậu Hà Lan (PPI)', gamma: 2.5, hieuQua: 0.5, tocDo: 1.1, loai: 'OW', nhayNhiet: null, gia: 120,
		ghiChu: 'Γ ≈ 2,5 mg/m² (Hinderink 2021). Độ tan thấp: chỉ phần hòa tan mới nhũ hóa được (hiệu quả 50% là số minh họa).' },
	tween80: { ten: 'Polysorbate 80 (Tween 80, E433)', gamma: 2.5, hieuQua: 1.0, tocDo: 0.85, loai: 'OW', nhayNhiet: null, gia: 200, hlb: 15,
		ghiChu: 'HLB ≈ 15: ưa nước, hợp dầu trong nước. Phân tử nhỏ hấp phụ nhanh nên giọt vừa vỡ đã được phủ kịp.' },
	span80: { ten: 'Sorbitan monooleate (Span 80, E494)', gamma: 2.5, hieuQua: 1.0, tocDo: 0.85, loai: 'WO', nhayNhiet: null, gia: 180, hlb: 4.3,
		ghiChu: 'HLB ≈ 4,3: ưa dầu, hợp nước trong dầu. Dùng cho dầu trong nước thì giọt hợp nhất, nổi váng dầu.' },
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
	const dh = me.dongHoa ?? { bar: 0, soLan: 0, lamLanh: false };
	const coDongHoa = dh.bar >= 20 && dh.soLan >= 1;
	let dE = dTheoApSuat(dh.bar, dh.soLan, dau.eta, nh ? nh.tocDo : 1);
	if (coDongHoa && dPre > 100) {
		dE *= 1.4; // không tiền nhũ: lần qua máy đầu tiên làm việc của máy khuấy [T]
		canhBao.push({ ma: 'khong-tien-nhu', chu: 'Bạn cho thẳng dầu và nước vào máy đồng hóa. Lần qua máy đầu chỉ kịp xé mảng dầu lớn, nên giọt to hơn.' });
	}
	const dCo = Math.min(dPre, dE);

	// 3. Giới hạn chất nhũ hóa
	const nhietRa = nhietDoRa(me.nhietVao ?? 25, coDongHoa ? dh.bar : 0, coDongHoa ? dh.soLan : 0, dh.lamLanh);
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
			chu: `Chất nhũ hóa không đủ phủ bề mặt giọt. Máy có thể xé tới ${so(dCo)} µm nhưng chỉ đủ chất để giữ giọt ${so(dGamma)} µm, phần dư hợp nhất lại.`,
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

	// 5. Sai loại chất nhũ hóa → hợp nhất khi bảo quản
	const saiLoai = nh?.loai === 'WO';
	if (saiLoai) canhBao.push({ ma: 'sai-hlb', chu: `${nh.ten} có HLB thấp, ưa dầu. Nó ổn định nước trong dầu, không phải dầu trong nước: giọt sẽ hợp nhất dần và nổi váng dầu.` });

	const sigma = coDongHoa ? 0.45 : 0.75; // độ rộng phân bố [T]
	const pb = dacTrungPhanBo(d32, sigma);

	// 6. Pha liên tục và xanthan
	const cheDo = cheDoXanthan(me.phanTramXanthan ?? 0, phi);
	const etaC = doNhotXanthan(me.phanTramXanthan ?? 0);
	if (cheDo === 'can-kiet')
		canhBao.push({ ma: 'can-kiet', chu: 'Xanthan ở nồng độ thấp không hấp phụ lên giọt, chen vào khe giữa các giọt rồi ép chúng thành cụm (kết bông do cạn kiệt). Cụm to nổi nhanh hơn giọt lẻ.' });

	const ketQua = {
		phi, d32, ...pb, sigma, dPre, dE, dGamma, nhietRa, etaC, cheDo, bienTinh, saiLoai, thieuNhuHoa, nhuHoaToiThieu,
		canhBao, rhoDau: dau.rho,
		chiPhi: chiPhi(me, dau, nh),
	};
	ketQua.ongNghiem = (ngay) => ongNghiem(ketQua, ngay);
	return ketQua;
}

function so(x) {
	return x.toLocaleString('vi-VN', { maximumSignificantDigits: 2 });
}

/** Chi phí cho 1 kg sản phẩm (nghìn đồng), minh họa: nguyên liệu + điện cho máy đồng hóa */
function chiPhi(me, dau, nh) {
	const nl = (me.phanTramDau / 100) * dau.gia + (nh ? (me.phanTramNhuHoa / 100) * nh.gia : 0) + ((me.phanTramXanthan ?? 0) / 100) * 400;
	const dh = me.dongHoa?.bar >= 20 ? (me.dongHoa.bar / 100) * me.dongHoa.soLan * 0.6 : 0;
	const khuay = me.khuay?.rpm > 0 ? 0.3 : 0;
	return nl + dh + khuay;
}

/* ------------------------------------------------------------------ */
/* Ống nghiệm theo thời gian                                           */
/* ------------------------------------------------------------------ */

export const CAO_ONG_MM = 100;

/**
 * Ống nghiệm cao 100 mm sau `ngay` ngày.
 * Trả về chiều cao (mm) lớp váng dầu, lớp kem, vùng đục, vùng trong (serum) và chỉ số kem hóa CI = H_serum/H × 100.
 */
export function ongNghiem(kq, ngay) {
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

	let etaKemHoa = kq.etaC;
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
];

/** Chấm sao một mẻ cho một nhiệm vụ */
export function chamSao(nhiemVu, kq) {
	const o = kq.ongNghiem(nhiemVu.ngay);
	const tieuChi = nhiemVu.sao.map((s) => ({ chu: s.chu, dat: !!s.dat(kq, o) }));
	return { tieuChi, sao: tieuChi.filter((t) => t.dat).length, ong: o };
}
