// Mô hình tính của ba bàn lab mới. Không có số rời: mọi tham số đọc từ so-lieu-ban-moi.js.
// Ngoài miền dữ liệu thì trả về null / "ngoài vùng có dữ liệu", không ngoại suy. Không dự đoán hạn sử dụng hay an toàn vi sinh.
import { pickering } from '../cong-thuc.js';
import { CHUNG, KEP, HAT, PP_DO, GAMMA_OW, NGUONG_BAM_KT, MAYO } from './so-lieu-ban-moi.js';

/** Nhãn hiện ở "Vì sao?". */
export const NHAN_MOI = {
	banDo: { ma: 'N', chu: 'Bản đồ miền ổn định theo PGPR tự do và tỉ lệ giọt trong (Nollet 2024)' },
	sucCang: { ma: 'N', chu: 'Ngưỡng sức căng ngoài 1,5 và 2,5 mN/m (Nollet 2024)' },
	buoc2: { ma: 'N', chu: 'Bước hai phải ít mãnh liệt hơn bước một (McClements 2016, tr.588)' },
	phiHD: { ma: 'N', chu: 'φ hiệu dụng của giọt kép = φ_O + φ_W₁ (McClements 2016, tr.589–590)' },
	thamThau: { ma: 'N', chu: 'Nước đi theo chênh chất tan giữa W₁ và W₂ (McClements 2016, tr.587–588)' },
	gammaPgpr: { ma: 'T', chu: 'Γ PGPR ≈ 6,1 mg/m² là số suy ra, không phải phép đo trực tiếp' },
	roMinhHoa: { ma: 'G', chu: 'Đường rò rỉ chỉ minh họa hình dạng: chưa có hệ số thấm đã kiểm' },
	deltaE: { ma: 'N', chu: 'ΔE = πr²γ(1 − |cos θ|)² (Murray 2019; Schroën 2024)' },
	loaiNhu: { ma: 'N', chu: 'θ dưới 90° thuận lợi O/W, trên 90° thuận lợi W/O (Li 2022)' },
	hatMem: { ma: 'N', chu: 'Microgel và protein không có góc tiếp xúc cố định (Murray 2019)' },
	hatVoCo: { ma: 'N', chu: 'Hạt vô cơ như silica không phù hợp thực phẩm (Li 2022)' },
	quyTrinhMayo: { ma: 'N', chu: 'Cho dầu từng phần, kiểm soát tốc độ để tránh đảo pha, rồi qua máy nghiền keo (McClements 2016, tr.569)' },
	li2012: { ma: 'N', chu: MAYO.li2012.mien },
	nunes: { ma: 'N', chu: 'Dải mayo thương mại: d₃₂ 1,69–6,29 µm, G′ 121–949 Pa (Nunes 2002)' },
	duongNen: { ma: 'T', chu: 'Đường nền Princen–Kiss, mức tin cậy Thấp: σ và d₃₂ là số mượn, không phải đo trên mayonnaise' },
};

/* ================ Nhũ tương kép ================ */
export const mienKep = (cFree, phiD) => KEP.ban_do.gia_tri[String(cFree)]?.[phiD] ?? null;

/** Phần thể tích từ phần khối lượng nước (giả định khối lượng riêng ghi trong so-lieu-ban-moi.js). */
export function phiTheTich(phiDwt) {
	const w = phiDwt / 100;
	const n = w / CHUNG.rho_nuoc.gia_tri, d = (1 - w) / CHUNG.rho_dau.gia_tri;
	return n / (n + d);
}

/** PGPR cần hấp phụ để phủ giọt trong (wt% so với pha dầu): 6Γφ_w / (d·ρ_dầu·(1 − φ_w)) [T]. */
export function pgprHapPhu(phiDwt, dUm = KEP.d_trong.gia_tri) {
	const f = phiTheTich(phiDwt);
	const gamma = KEP.gamma_pgpr.gia_tri * 1e-3; // g/m²
	const rho = CHUNG.rho_dau.gia_tri * 1e6; // g/m³
	return ((6 * gamma * f) / (dUm * 1e-6 * rho * (1 - f))) * 100;
}

/** Áp suất thẩm thấu chênh giữa hai pha nước (bar), Π = i·Δc·R·T, dung dịch lý tưởng [T]. Dương: W₁ đậm hơn. */
export const chenhThamThau = (cW1, cW2) => CHUNG.i_NaCl.gia_tri * (cW1 - cW2) * CHUNG.R.gia_tri * CHUNG.T_K.gia_tri;

/** φ hiệu dụng của giọt kép: φ_O + φ_W₁. phiO: phần thể tích dầu trong toàn hệ (0–1). */
export function phiHieuDung(phiO, phiDwt) {
	const f = phiTheTich(phiDwt);
	return phiO + (phiO * f) / (1 - f);
}

export function moPhongKep({ cFree, phiD, buoc2 = 'nhe', cW2 = KEP.nacl_w1.gia_tri, phiO = 0.1 }) {
	const coDinhMuoi = cW2 === KEP.nacl_w1.gia_tri;
	const mien = coDinhMuoi ? mienKep(cFree, phiD) : null;
	const dPi = chenhThamThau(KEP.nacl_w1.gia_tri, cW2);
	const huongNuoc = dPi > 0 ? 'vao' : dPi < 0 ? 'ra' : 'can-bang';
	const hapPhu = pgprHapPhu(phiD);
	return {
		mien,
		ngoaiVung: mien === null,
		lyDoNgoaiVung: !coDinhMuoi ? 'muoi' : mien === null ? 'o-trong' : null,
		biPha: buoc2 !== 'nhe', // định tính: bước hai mạnh bằng bước một thì phá hoặc đẩy giọt W₁ ra (tr.588)
		huongNuoc,
		dPi,
		hapPhu,
		tongPgpr: cFree + hapPhu,
		phiHD: phiHieuDung(phiO, phiD),
		phiO,
	};
}

/** Đường minh họa rò rỉ (chỉ hình dạng, không in số). t01: 0–1 của trục thời gian. Miền xanh neo theo EE ≈ 90% ở cuối trục. */
export function roMinhHoa(mien, t01, biPha = false) {
	if (mien === 'do') return 0;
	const e9 = KEP.ee_9_thang.gia_tri / 100;
	if (mien === 'xanh' && !biPha) return Math.pow(e9, t01);
	return Math.exp(-KEP.k_ro_cam_minh_hoa.gia_tri * 9 * t01);
}

export const NHIEM_VU_KEP = [
	{
		id: 'kep-b12',
		ten: 'Bao vitamin B12 chín tháng',
		de: 'Đưa vitamin B12 vào giọt nước trong (W₁) và giữ được 9 tháng. Chọn PGPR tự do và tỉ lệ giọt trong sao cho rơi vào miền ổn định của bản đồ.',
		tieuChi: [
			{ chu: 'Công thức nằm trong miền xanh của bản đồ', dat: (kq) => kq.mien === 'xanh' },
			{ chu: 'Bước hai nhẹ hơn bước một', dat: (kq) => !kq.biPha },
			{ chu: 'Hai pha nước cân bằng thẩm thấu (cùng 0,1 M NaCl)', dat: (kq) => kq.huongNuoc === 'can-bang' },
		],
	},
	{
		id: 'kep-giam-beo',
		ten: 'Giảm béo nhờ nhiều nước trong',
		de: 'Muốn giọt chứa nhiều nước để giảm béo: tỉ lệ giọt trong từ 40 wt% trở lên, vẫn bền, và tổng PGPR không quá 3 wt% pha dầu.',
		tieuChi: [
			{ chu: 'Công thức nằm trong miền xanh của bản đồ', dat: (kq) => kq.mien === 'xanh' },
			{ chu: 'Tỉ lệ giọt trong từ 40 wt% trở lên', dat: (kq, me) => me.phiD >= 40 },
			{ chu: 'Tổng PGPR không quá 3 wt% pha dầu', dat: (kq) => kq.tongPgpr <= 3 },
		],
	},
];
export function chamSaoKep(nv, kq, me) {
	const tieuChi = nv.tieuChi.map((t) => ({ chu: t.chu, dat: !!t.dat(kq, me) }));
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}

/* ================ Pickering ================ */
export const hatTheoId = (id) => HAT.find((h) => h.id === id);
/** Hai hạt đo θ khác phương pháp thì không so trực tiếp. "Chưa kiểm" cũng không so được với ai. */
export const soSanhTheta = (a, b) => a.pp === b.pp && a.pp !== 'chua-kiem';
export const laThetaDauNuoc = (h) => h.pp === 'duoi-dau' || h.pp === 'xrr';

export function moPhongPickering({ hat, dNm, gamma = GAMMA_OW.gia_tri, nhietC = 25 }) {
	const h = typeof hat === 'string' ? hatTheoId(hat) : hat;
	const r = dNm / 2;
	const { J, kT } = pickering(r, gamma, h.theta, nhietC + 273.15);
	return {
		hat: h,
		rNm: r,
		J,
		kT,
		loai: h.theta < 90 ? 'O/W' : h.theta > 90 ? 'W/O' : 'trung gian',
		bamChac: kT >= NGUONG_BAM_KT.gia_tri,
		minhHoa: h.mem || !laThetaDauNuoc(h), // hạt mềm hoặc θ không phải dầu–nước: ΔE chỉ minh họa
		pp: PP_DO[h.pp],
	};
}

export const NHIEM_VU_PICKERING = [
	{
		id: 'pick-thuc-pham',
		ten: 'Sốt O/W bằng hạt thực phẩm',
		de: 'Chọn hạt thực phẩm để làm sốt dầu trong nước, hạt phải bám chặt trên bề mặt giọt.',
		tieuChi: [
			{ chu: 'Hạt dùng được trong thực phẩm', dat: (kq) => kq.hat.thucPham },
			{ chu: 'Góc tiếp xúc thuận lợi cho O/W (θ dưới 90°)', dat: (kq) => kq.hat.theta < 90 },
			{ chu: `Năng lượng giải hấp từ ${NGUONG_BAM_KT.gia_tri.toLocaleString('vi-VN')} kT trở lên`, dat: (kq) => kq.bamChac },
		],
	},
	{
		id: 'pick-so-dang-tin',
		ten: 'Chọn số đáng tin',
		de: 'Báo cáo cho sếp cần θ đo đúng tại mặt phân cách dầu–nước, không phải đo trong không khí. Tìm hạt thực phẩm có số đó và thuận lợi cho O/W.',
		tieuChi: [
			{ chu: 'θ đo tại mặt phân cách dầu–nước', dat: (kq) => laThetaDauNuoc(kq.hat) },
			{ chu: 'Hạt dùng được trong thực phẩm', dat: (kq) => kq.hat.thucPham },
			{ chu: 'Góc tiếp xúc thuận lợi cho O/W (θ dưới 90°)', dat: (kq) => kq.hat.theta < 90 },
		],
	},
];
export function chamSaoPickering(nv, kq) {
	const tieuChi = nv.tieuChi.map((t) => ({ chu: t.chu, dat: !!t.dat(kq) }));
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}

/* ================ Mayonnaise (khung minh họa) ================ */
/** Phần thể tích dầu từ % khối lượng dầu (quy đổi [T], giả định khối lượng riêng ở so-lieu-ban-moi.js). */
export function phiMayo(dauPct) {
	const w = dauPct / 100;
	const d = w / CHUNG.rho_dau.gia_tri, n = (1 - w) / CHUNG.rho_pha_nuoc_mayo.gia_tri;
	return d / (d + n);
}
/** Đường nền Princen–Kiss (Pa), nhãn T mức Thấp. G = 0 khi φ ≤ φ₀. */
export function gNen(phi, sigmaMN = MAYO.sigma_nen.gia_tri, d32Um = MAYO.d32_nen.gia_tri) {
	const { a, phi0 } = MAYO.pk.gia_tri;
	if (phi <= phi0) return 0;
	return a * ((sigmaMN * 1e-3) / ((d32Um / 2) * 1e-6)) * Math.cbrt(phi) * (phi - phi0);
}

/** Không tính số cho điểm ngoài bảng Li 2012: trả về duLieu = null. Không dự đoán hạn sử dụng, không dự đoán vi sinh. */
export function moPhongMayo({ dauPct, tocDo = 'cham', coLongDo = true, coGiam = true, quaNghien = false }) {
	let trangThai = 'tot';
	if (!coLongDo) trangThai = 'khong-nhu-hoa';
	else if (tocDo === 'nhanh') trangThai = 'dao-pha'; // định tính: đổ dầu quá nhanh dễ đảo pha hoặc vỡ
	const tot = trangThai === 'tot';
	const duLieu = tot && coGiam ? MAYO.li2012.diem[dauPct] ?? null : null; // thiếu giấm là công thức khác với bảng đo
	const [lo, hi] = MAYO.dai_dau.gia_tri;
	return {
		trangThai,
		dauPct,
		coGiam,
		quaNghien,
		duLieu,
		ngoaiVung: tot && !duLieu,
		trongDaiSach: dauPct >= lo && dauPct <= hi,
		phi: phiMayo(dauPct),
		gNen: gNen(phiMayo(dauPct)),
	};
}

export const NHIEM_VU_MAYO = [
	{
		id: 'mayo-chuan',
		ten: 'Mayonnaise đúng quy trình',
		de: 'Làm mẻ mayonnaise đúng quy trình, hàm lượng dầu nằm trong dải thường gặp của sách.',
		tieuChi: [
			{ chu: 'Dầu cho từng phần, không đổ nhanh', dat: (kq) => kq.trangThai === 'tot' },
			{ chu: 'Hàm lượng dầu trong dải 75–84% khối lượng', dat: (kq) => kq.trongDaiSach },
			{ chu: 'Qua máy nghiền keo sau bước nhũ thô', dat: (kq) => kq.quaNghien },
		],
	},
	{
		id: 'mayo-dac',
		ten: 'Sốt đặc, đứng trên thìa',
		de: `Cần ứng suất chảy từ ${MAYO.tau0_muc_tieu.gia_tri} Pa trở lên theo bảng đo Li 2012, nhưng dầu vẫn nằm trong dải 75–84%.`,
		tieuChi: [
			{ chu: 'Dầu cho từng phần, không đổ nhanh', dat: (kq) => kq.trangThai === 'tot' },
			{ chu: 'Hàm lượng dầu trong dải 75–84% khối lượng', dat: (kq) => kq.trongDaiSach },
			{ chu: `Ứng suất chảy đo được từ ${MAYO.tau0_muc_tieu.gia_tri} Pa trở lên`, dat: (kq) => (kq.duLieu?.tau0 ?? 0) >= MAYO.tau0_muc_tieu.gia_tri },
		],
	},
];
export function chamSaoMayo(nv, kq) {
	const tieuChi = nv.tieuChi.map((t) => ({ chu: t.chu, dat: !!t.dat(kq) }));
	return { sao: tieuChi.filter((t) => t.dat).length, tieuChi };
}
