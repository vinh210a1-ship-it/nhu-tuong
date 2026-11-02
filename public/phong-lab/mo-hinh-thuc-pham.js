// Bộ máy tính toán cho hai bàn mới của Phòng lab ảo: BÀN THỊT (giữ nước bằng muối, phosphat, pH)
// và BÀN BẢO QUẢN (hoạt độ nước, pH, muối, nhiệt độ, chất bảo quản axit yếu).
// Không đụng giao diện, để kiểm tự động bằng `npm run kiem`.
//
// Số liệu lấy từ bộ tài liệu thực phẩm của dự án (tai-lieu-thuc-pham/01, 02, 08):
//  - Neo đo thật [N]: Sheard 2004 (pH 5,45 → 5,75–5,97; năng suất nấu 70% → 85%),
//    Norazizi 2025 (TBARS đạt 2 mg MDA/kg: ngày 7 / 21 / 28 ở STPP 0 / 0,15 / 0,3%),
//    FDA Fish & Fishery Products Hazards Guidance, Phụ lục 4, Bảng A-1 (giới hạn mọc của 10 mầm bệnh),
//    Arroyo-López 2008 (MIC dạng chưa phân ly của sorbic/benzoic với nấm men, cộng gộp FIC),
//    Eklund 1983 (dạng phân ly cũng ức chế, yếu hơn 10–600 lần).
//  - Hằng số sách chưa trích trang [K] chỉ dùng bên trong, KHÔNG in số ra màn hình: pI, pKa, hệ số Norrish.
//  - Hằng số chọn để mô hình ra đúng chiều [T]: độ nâng pH của từng phosphat, trọng số trương nở, hệ số nhiệt.

export const NHAN_TP = {
	phPhos: { ma: 'N', chu: 'Phosphat giữ nước chủ yếu nhờ nâng pH thịt ra xa điểm đẳng điện của protein sợi cơ: tiêm muối + STPP + bicarbonat nâng pH 5,45 lên 5,75–5,97 và năng suất nấu từ 70% lên 85% (Sheard 2004; Lewis 1986)' },
	hiepLuc: { ma: 'N', chu: 'Muối và phosphat hiệp lực: muối chiết và làm trương protein sợi cơ, phosphat đứng một mình kém hiệu quả (Choi 2020; Kang 2020)' },
	pI: { ma: 'K', chu: 'Protein sợi cơ có điểm đẳng điện (pI) nằm sát pH thịt sau giết mổ, nên thịt tươi giữ nước kém nhất ở đó' },
	nhietNau: { ma: 'N', chu: 'Nấu ở nhiệt độ cao hơn làm gel thịt cứng, trắng hơn nhưng năng suất nấu thấp hơn (Kang 2021: 72 °C so với 56 °C)' },
	tbars: { ma: 'N', chu: 'STPP làm chậm oxy hóa thịt: TBARS đạt 2 mg MDA/kg ở ngày 7 (0% STPP), ngày 21 (0,15%), ngày 28 (0,3%) ở thăn trâu nấu sous-vide (Norazizi 2025)' },
	phCao: { ma: 'N', chu: 'pH không phải càng cao càng tốt: với pyrophosphat, gel protein sợi cơ tốt nhất ở pH 6–7, sụp ở pH 8–9 (Chen 2019, protein chiết)' },
	hangSoThit: { ma: 'T', chu: 'Độ nâng pH của từng loại phosphat, trọng số trương nở và hệ số nhiệt là số minh họa chọn để tái tạo đúng các neo đo thật ở trên' },
	fda: { ma: 'N', chu: 'Mỗi mầm bệnh chỉ mọc khi aw, pH, % muối pha nước, nhiệt độ và oxy cùng nằm trong khoảng cho phép (FDA, Bảng A-1, Phụ lục 4)' },
	hangRao: { ma: 'K', chu: 'Bảng FDA cho giới hạn của từng yếu tố khi các yếu tố khác tối ưu. Nhiều yếu tố cùng sát ngưỡng thì vi khuẩn khó mọc hơn (nguyên lý hàng rào), nên mô hình "có/không" ở đây là phía an toàn kém' },
	aw: { ma: 'T', chu: 'aw ước tính từ muối (hệ số thẩm thấu) và đường (phương trình Norrish), nhân với nhau (phương trình Ross). Số aw là ước tính minh họa, đo thật mới chắc' },
	axitYeu: { ma: 'N', chu: 'Sorbat, benzoat diệt khuẩn chủ yếu bằng phần axit chưa phân ly, nên pH càng thấp càng mạnh; dạng phân ly vẫn ức chế nhưng yếu hơn 10–600 lần (Eklund 1983)' },
	micMen: { ma: 'N', chu: 'MIC dạng chưa phân ly với hỗn hợp nấm men: sorbic 5,94 / 3,85 / 3,19 mM ở pH 4,5 / 4,0 / 3,5; benzoic không ức chế ở pH 4,5, 10,40 mM ở 4,0, 6,83 mM ở 3,5; hai chất cộng gộp (Arroyo-López 2008)' },
	men: { ma: 'N', chu: 'Nấm men, nấm mốc gây hỏng thắng thế ở vùng aw 0,61–0,85 vì ít đối thủ (Beuchat 1983)' },
	nhietMen: { ma: 'G', chu: 'Mô hình không tính nhiệt độ cho nấm men: ở tủ lạnh men vẫn mọc, chỉ chậm hơn' },
};

/* ================================================================== */
/* BÀN THỊT                                                            */
/* ================================================================== */

/** dpHmax: độ nâng pH tối đa khi tiêm vào thịt [T], chọn để STPP 0,3% + bicarbonat khớp neo Sheard 2004. */
export const PHOSPHAT = {
	stpp: { ten: 'Natri tripolyphosphat (STPP, E451)', ngan: 'STPP', dpHmax: 0.5 },
	tspp: { ten: 'Tetranatri pyrophosphat (TSPP, E450)', ngan: 'TSPP', dpHmax: 0.6 },
	shmp: { ten: 'Natri hexametaphosphat (SHMP, E452)', ngan: 'SHMP', dpHmax: 0.1 },
};
const BICARB_DPH = 0.3; // [T]
const PH0_MAC_DINH = 5.45; // thịt lợn đối chứng [N: Sheard 2004]
const PI_SOI_CO = 5.2; // [K] chỉ dùng nội bộ để vẽ vùng, không in số

const kep = (x, a, b) => Math.min(b, Math.max(a, x));

export function pHSauTiem({ pH0 = PH0_MAC_DINH, phosphat = null, cPhos = 0, bicarb = 0 }) {
	const p = phosphat ? PHOSPHAT[phosphat] : null;
	const dPhos = p && cPhos > 0 ? (p.dpHmax * cPhos) / (cPhos + 0.15) : 0;
	const dBic = bicarb > 0 ? (BICARB_DPH * bicarb) / (bicarb + 0.2) : 0;
	return pH0 + dPhos + dBic;
}

/** Mức trương nở do pH (0 tại pH thịt đối chứng, ~1 khi nâng 0,5 đơn vị). Có đỉnh: quá kiềm thì gel sụp [N: Chen 2019, dạng đường]. */
export function heSoPH(pH) {
	const len = kep((pH - PH0_MAC_DINH) / 0.5, 0, 1.3);
	const sup = pH > 7.5 ? kep((pH - 7.5) / 1, 0, 1) * 0.7 : 0;
	return len * (1 - sup);
}
/** Mức chiết protein do muối, bão hòa quanh 2,5% NaCl [T]. */
export const heSoMuoi = (muoi) => kep(muoi / 2, 0, 1.25);

/** TBARS: số ngày tới 2 mg MDA/kg, nội suy thẳng giữa các neo đo [N: Norazizi 2025]. Ngoài 0,3% STPP không ngoại suy. */
export function ngayTBARS(phosphat, cPhos) {
	if (!phosphat || cPhos <= 0) return { ngay: 7, coDuLieu: true };
	if (phosphat !== 'stpp') return { ngay: null, coDuLieu: false };
	const neo = [
		[0, 7],
		[0.15, 21],
		[0.3, 28],
	];
	const c = Math.min(cPhos, 0.3);
	for (let i = 1; i < neo.length; i++)
		if (c <= neo[i][0]) {
			const [x0, y0] = neo[i - 1];
			const [x1, y1] = neo[i];
			return { ngay: y0 + ((y1 - y0) * (c - x0)) / (x1 - x0), coDuLieu: true, vuotKhoang: cPhos > 0.3 };
		}
	return { ngay: 28, coDuLieu: true, vuotKhoang: cPhos > 0.3 };
}

/**
 * Mô phỏng một miếng thịt: ướp (tiêm nước muối) rồi nấu.
 * me = { pH0, muoi (% NaCl trong sản phẩm, 0–3), phosphat, cPhos (% 0–0,5), bicarb (% 0–0,5), nhietNau (°C 56–80), daUop, daNau }
 */
export function moPhongThit(me) {
	const uop = me.daUop !== false;
	const muoi = uop ? me.muoi ?? 0 : 0;
	const cPhos = uop ? me.cPhos ?? 0 : 0;
	const bicarb = uop ? me.bicarb ?? 0 : 0;
	const pH0 = me.pH0 ?? PH0_MAC_DINH;
	const pH = pHSauTiem({ pH0, phosphat: me.phosphat, cPhos, bicarb });
	const g = heSoPH(pH);
	const f = heSoMuoi(muoi);
	const diem = 0.25 * g + 0.35 * f + 0.5 * g * f; // [T]: hiệp lực = số hạng g·f
	const hao72 = 30 * (1 - diem / 2); // hao hụt nấu ở 72 °C: 30% đối chứng → 15% ở mức neo Sheard
	const T = me.nhietNau ?? 72;
	const hao = hao72 * (1 + 0.012 * (T - 72)); // [T] chiều theo Kang 2021
	const nangSuat = 100 - hao;
	const tb = ngayTBARS(me.phosphat, cPhos);
	const canhBao = [];
	if (cPhos > 0 && muoi < 0.5) canhBao.push({ ma: 'thieu-muoi', chu: 'Có phosphat mà gần như không có muối: hiệp lực thấp, protein không được chiết.' });
	if (me.phosphat === 'shmp' && cPhos > 0) canhBao.push({ ma: 'shmp', chu: 'SHMP gần trung tính nên nâng pH rất ít; giữ nước kém STPP, TSPP.' });
	if (pH > 7.5) canhBao.push({ ma: 'ph-cao', chu: 'pH quá cao: gel protein sụp, thịt có vị xà phòng.' });
	return { pH, pH0, g, f, diem, hao, nangSuat, tbars: tb, canhBao, pI: PI_SOI_CO };
}

export const NHIEM_VU_THIT = [
	{
		id: 'giam-bong',
		ten: 'Giăm bông mọng nước',
		de: 'Năng suất sau nấu từ 83% trở lên, với muối không quá 2% và phosphat không quá 0,3%.',
		tieuChi: (kq, me) => [
			{ chu: 'Năng suất nấu ≥ 83%', dat: kq.nangSuat >= 83 },
			{ chu: 'Muối ≤ 2%', dat: (me.muoi ?? 0) <= 2 + 1e-9 },
			{ chu: 'Phosphat ≤ 0,3%', dat: (me.cPhos ?? 0) <= 0.3 + 1e-9 },
		],
	},
	{
		id: 'xuc-xich-giam-muoi',
		ten: 'Xúc xích giảm muối',
		de: 'Muối chỉ được tối đa 1,2% mà năng suất nấu vẫn phải từ 80% trở lên. Gợi ý: muối ít thì phải nhờ pH.',
		tieuChi: (kq, me) => [
			{ chu: 'Muối ≤ 1,2%', dat: (me.muoi ?? 0) <= 1.2 + 1e-9 },
			{ chu: 'Năng suất nấu ≥ 80%', dat: kq.nangSuat >= 80 },
			{ chu: 'pH thịt sau ướp ≤ 6,5 (không bị vị xà phòng)', dat: kq.pH <= 6.5 },
		],
	},
	{
		id: 'thit-trau-de-lau',
		ten: 'Thịt trâu sous-vide để lâu',
		de: 'Thịt nấu sous-vide cần giữ được ít nhất 21 ngày ở 4 °C trước khi ôi (TBARS 2 mg/kg), năng suất từ 80% trở lên.',
		tieuChi: (kq) => [
			{ chu: 'TBARS chậm tới ngày ≥ 21', dat: (kq.tbars.ngay ?? 0) >= 21 - 1e-9 },
			{ chu: 'Năng suất nấu ≥ 80%', dat: kq.nangSuat >= 80 },
			{ chu: 'Nấu ở 56–65 °C (đúng kiểu sous-vide)', dat: kq.nhietNau >= 56 && kq.nhietNau <= 65 },
		],
	},
];
export function chamSaoThit(nv, kq, me) {
	const tieuChi = nv.tieuChi({ ...kq, nhietNau: me.nhietNau ?? 72 }, me);
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}

/* ================================================================== */
/* BÀN BẢO QUẢN                                                        */
/* ================================================================== */

/** FDA Fish and Fishery Products Hazards and Controls Guidance, Phụ lục 4, Bảng A-1 [N: fda-app4]. */
export const MAM_BENH = [
	{ id: 'bot-a', ten: 'C. botulinum A, B/F phân giải protein', ngan: 'C. botulinum A', awMin: 0.935, pHMin: 4.6, muoiMax: 10, tMin: 10, tMax: 48, kyKhi: true, mau: '#7a5cd6' },
	{ id: 'bot-e', ten: 'C. botulinum E, B/F không phân giải protein', ngan: 'C. botulinum E', awMin: 0.97, pHMin: 5.0, muoiMax: 5, tMin: 3.3, tMax: 45, kyKhi: true, mau: '#5a48b0' },
	{ id: 'sau', ten: 'Staphylococcus aureus (mọc)', ngan: 'S. aureus', awMin: 0.83, pHMin: 4.0, muoiMax: 20, tMin: 7, tMax: 50, kyKhi: false, mau: '#e9b949' },
	{ id: 'sau-doc', ten: 'S. aureus (sinh độc tố)', ngan: 'S. aureus độc tố', awMin: 0.85, pHMin: 4.0, muoiMax: 10, tMin: 10, tMax: 48, kyKhi: false, mau: '#d99a2b' },
	{ id: 'sal', ten: 'Salmonella spp.', ngan: 'Salmonella', awMin: 0.94, pHMin: 3.7, muoiMax: 8, tMin: 5.2, tMax: 46.2, kyKhi: false, mau: '#c4486b' },
	{ id: 'lis', ten: 'Listeria monocytogenes', ngan: 'Listeria', awMin: 0.92, pHMin: 4.4, muoiMax: 10, tMin: -0.4, tMax: 45, kyKhi: false, mau: '#2ec4b6' },
	{ id: 'bc', ten: 'Bacillus cereus', ngan: 'B. cereus', awMin: 0.92, pHMin: 4.3, muoiMax: 10, tMin: 4, tMax: 55, kyKhi: false, mau: '#e07a2f' },
	{ id: 'cp', ten: 'Clostridium perfringens', ngan: 'C. perfringens', awMin: 0.93, pHMin: 5.0, muoiMax: 7, tMin: 10, tMax: 52, kyKhi: true, mau: '#8a6d3b' },
	{ id: 'eco', ten: 'E. coli gây bệnh', ngan: 'E. coli', awMin: 0.95, pHMin: 4.0, muoiMax: 6.5, tMin: 6.5, tMax: 49.4, kyKhi: false, mau: '#3fb162' },
	{ id: 'vp', ten: 'Vibrio parahaemolyticus', ngan: 'V. parahaemolyticus', awMin: 0.94, pHMin: 4.8, muoiMax: 10, tMin: 5, tMax: 45.3, kyKhi: false, mau: '#3a8fd6' },
];

const M_NACL = 58.44;
const M_SUCROSE = 342.3;
const M_NUOC = 18.015;
const NORRISH_SUCROSE = -6.47; // [K]
const PKA = { sorbic: 4.76, benzoic: 4.2 }; // [K]
const M_AXIT = { sorbic: 112.13, benzoic: 122.12 };

/** % muối pha nước (water-phase salt), đơn vị giống cột "% muối" của bảng FDA. */
export const muoiPhaNuoc = (muoi, nuoc) => (muoi + nuoc > 0 ? (100 * muoi) / (muoi + nuoc) : 0);

/** aw ước tính cho 100 g sản phẩm gồm muối, đường và nước (phần còn lại) [T, dựa trên hằng số K]. */
export function awUocTinh({ muoi = 0, duong = 0 }) {
	const nuoc = Math.max(1, 100 - muoi - duong);
	const m = muoi / M_NACL / (nuoc / 1000); // mol/kg nước
	const phi = 0.93 + 0.035 * m;
	const awMuoi = Math.exp(-2 * m * phi * (M_NUOC / 1000));
	const ns = duong / M_SUCROSE;
	const nw = nuoc / M_NUOC;
	const xs = ns / (ns + nw);
	const awDuong = (1 - xs) * Math.exp(NORRISH_SUCROSE * xs * xs);
	return awMuoi * awDuong;
}

const phanChuaPhanLy = (pH, pKa) => 1 / (1 + 10 ** (pH - pKa));
function noiSuy(pts, x) {
	if (x <= pts[0][0]) return pts[0][1];
	for (let i = 1; i < pts.length; i++)
		if (x <= pts[i][0]) {
			const [x0, y0] = pts[i - 1];
			const [x1, y1] = pts[i];
			return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
		}
	return pts[pts.length - 1][1];
}
/** 1/MIC dạng chưa phân ly (mM⁻¹) theo pH [N: Arroyo-López 2008]; ngoài khoảng đo giữ giá trị biên (G). */
const nghichMIC = {
	sorbic: (pH) => noiSuy([[3.5, 1 / 3.19], [4.0, 1 / 3.85], [4.5, 1 / 5.94]], pH),
	// benzoic: không thấy ức chế ở pH 4,5 trong khoảng đã thử → hiệu lực về 0 tại 4,5
	benzoic: (pH) => noiSuy([[3.5, 1 / 6.83], [4.0, 1 / 10.4], [4.5, 0]], pH),
};
const TY_LE_PHAN_LY = 100; // dạng phân ly yếu hơn 100 lần [T, trong khoảng 10–600 của Eklund 1983]

/** Chỉ số ức chế nấm men (tổng FIC). ≥ 1 là ức chế. g: g/kg tính theo axit. */
export function chiSoUcChe({ pH, sorbat = 0, benzoat = 0 }) {
	let tong = 0;
	const chiTiet = {};
	for (const [k, g] of [
		['sorbic', sorbat],
		['benzoic', benzoat],
	]) {
		if (!g) continue;
		const mM = (g / M_AXIT[k]) * 1000;
		const f = phanChuaPhanLy(pH, PKA[k]);
		const inv = nghichMIC[k](pH);
		const fic = mM * f * inv + (mM * (1 - f) * inv) / TY_LE_PHAN_LY;
		chiTiet[k] = { mM, phanHA: f, fic };
		tong += fic;
	}
	return { tong, chiTiet };
}

export const AW_MEN = 0.62; // [T] trong vùng 0,61–0,85 của Beuchat 1983

/**
 * Mô phỏng lọ sản phẩm: me = { muoi g, duong g (trên 100 g), pH, sorbat g/kg, benzoat g/kg, nhietDo °C, kin (đóng kín, kỵ khí) }
 */
export function moPhongBaoQuan(me) {
	const muoi = me.muoi ?? 0;
	const duong = me.duong ?? 0;
	const nuoc = Math.max(1, 100 - muoi - duong);
	const aw = awUocTinh({ muoi, duong });
	const wps = muoiPhaNuoc(muoi, nuoc);
	const pH = me.pH ?? 6.5;
	const T = me.nhietDo ?? 25;
	const kin = !!me.kin;
	const ketQua = MAM_BENH.map((b) => {
		const chan = [];
		if (aw < b.awMin) chan.push('aw');
		if (pH < b.pHMin) chan.push('pH');
		if (wps > b.muoiMax) chan.push('muối');
		if (T < b.tMin) chan.push('lạnh');
		if (T > b.tMax) chan.push('nóng');
		if (b.kyKhi && !kin) chan.push('oxy');
		// sát ngưỡng: còn cách ngưỡng aw < 0,01 hoặc pH < 0,2 (nguyên lý hàng rào, K)
		const sat = !chan.length && (aw - b.awMin < 0.01 || pH - b.pHMin < 0.2);
		return { ...b, moc: chan.length === 0, chan, sat };
	});
	const uc = chiSoUcChe({ pH, sorbat: me.sorbat ?? 0, benzoat: me.benzoat ?? 0 });
	const menChan = [];
	if (aw < AW_MEN) menChan.push('aw');
	if (uc.tong >= 1) menChan.push('chất bảo quản');
	const men = { moc: menChan.length === 0, chan: menChan, ucChe: uc };
	return { aw, wps, pH, nhietDo: T, kin, nuoc, ketQua, men, soMoc: ketQua.filter((r) => r.moc).length };
}

export const NHIEM_VU_BQ = [
	{
		id: 'tuong-ot',
		ten: 'Tương ớt để ngoài trời',
		de: 'Lọ tương ớt đã mở nắp để trên bàn 30 °C. Không mầm bệnh nào được mọc, nấm men cũng không. Nhớ đo aw và pH trước khi ủ.',
		coDinh: { nhietDo: 30, kin: false },
		tieuChi: (kq, st) => [
			{ chu: 'Không mầm bệnh nào mọc ở 30 °C', dat: kq.soMoc === 0 },
			{ chu: 'Nấm men không mọc', dat: !kq.men.moc },
			{ chu: 'Đã đo aw và pH trước khi ủ', dat: !!(st.daDo.aw && st.daDo.pH) },
		],
	},
	{
		id: 'ca-muoi',
		ten: 'Cá muối nhẹ trong tủ lạnh',
		de: 'Cá muối đóng hộp kín (kỵ khí), giữ ở 4 °C, không được thêm chua (pH để nguyên 6,2). Chặn hết mầm bệnh với lượng muối ít nhất có thể: tối đa 12 g muối trong 100 g.',
		coDinh: { nhietDo: 4, kin: true, pH: 6.2 },
		tieuChi: (kq, st) => [
			{ chu: 'Không mầm bệnh nào mọc ở 4 °C', dat: kq.soMoc === 0 },
			{ chu: 'Muối ≤ 12 g/100 g', dat: st.me.muoi <= 12 + 1e-9 },
			{ chu: 'Đã đo aw trước khi ủ', dat: !!st.daDo.aw },
		],
	},
	{
		id: 'nuoc-trai-cay',
		ten: 'Nước trái cây vị dịu',
		de: 'Nước trái cây để tủ lạnh 4 °C, mở nắp. Phải chặn mầm bệnh và nấm men nhưng vị không được quá chua: pH từ 4,0 trở lên. Chất bảo quản tối đa 1 g/kg.',
		coDinh: { nhietDo: 4, kin: false },
		tieuChi: (kq) => [
			{ chu: 'Không mầm bệnh nào mọc ở 4 °C', dat: kq.soMoc === 0 },
			{ chu: 'Nấm men không mọc', dat: !kq.men.moc },
			{ chu: 'pH ≥ 4,0 (vị dịu)', dat: kq.pH >= 4 - 1e-9 },
		],
	},
];
export function chamSaoBQ(nv, kq, st) {
	const tieuChi = nv.tieuChi(kq, st);
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}
