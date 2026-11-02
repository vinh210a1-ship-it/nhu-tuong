// Công thức thuần (không đụng giao diện) để kiểm tự động bằng `npm run kiem`.
// Đơn vị SI bên trong; hàm nhận/trả đơn vị thường dùng trong lab (µm, mPa·s, mg/m²).

export const G = 9.81; // m/s²

/**
 * Vận tốc Stokes của một giọt cầu cứng, đơn lẻ, trong pha liên tục Newton:
 * v = 2 r² (ρc − ρd) g / (9 ηc). Dương = nổi lên (kem hóa), âm = lắng.
 * @param {number} dUm đường kính giọt (µm)
 * @param {number} rhoC tỷ trọng pha liên tục (kg/m³)
 * @param {number} rhoD tỷ trọng pha phân tán (kg/m³)
 * @param {number} etaMPas độ nhớt pha liên tục (mPa·s)
 */
export function stokes(dUm, rhoC, rhoD, etaMPas) {
	const r = (dUm * 1e-6) / 2;
	const eta = etaMPas * 1e-3;
	const v = (2 * r * r * (rhoC - rhoD) * G) / (9 * eta); // m/s
	return { v, mmMoiNgay: v * 1000 * 86400 };
}

/**
 * Diện tích bề mặt riêng A = 6φ/d32 (m²/m³ nhũ tương) và lượng chất nhũ hóa tối thiểu c = Γ·A.
 * @param {number} phi phân số thể tích pha phân tán (0–1)
 * @param {number} d32Um đường kính Sauter (µm)
 * @param {number} gammaMgM2 độ phủ bề mặt Γ (mg/m²)
 */
export function chatNhuHoaToiThieu(phi, d32Um, gammaMgM2) {
	const A = (6 * phi) / (d32Um * 1e-6); // m²/m³
	const cGL = A * gammaMgM2 * 1e-6; // kg/m³ = g/L
	return { A, cGL, phanTramWV: cGL / 10 };
}

/**
 * HLB của hỗn hợp hai chất nhũ hóa, trung bình theo khối lượng: HLB = wA·HLB_A + (1−wA)·HLB_B.
 * @param {number} hlbA HLB chất A
 * @param {number} hlbB HLB chất B
 * @param {number} wA phần khối lượng chất A (0–1)
 */
export function hlbTron(hlbA, hlbB, wA) {
	return wA * hlbA + (1 - wA) * hlbB;
}

/**
 * Phần khối lượng chất A cần để hỗn hợp A + B đạt HLB mục tiêu. Trả null nếu mục tiêu nằm ngoài khoảng [HLB_A, HLB_B].
 */
export function hlbPhanA(hlbA, hlbB, hlbMucTieu) {
	if (hlbA === hlbB) return null;
	const wA = (hlbMucTieu - hlbB) / (hlbA - hlbB);
	return wA >= 0 && wA <= 1 ? wA : null;
}

/**
 * Quy đổi thời gian theo Q10: thời gian ở nhiệt độ T2 = t1 · Q10^((T1 − T2)/10).
 * (phản ứng chậm đi Q10 lần mỗi khi giảm 10 °C)
 */
export function q10DoiThoiGian(t1, T1, T2, q10) {
	return t1 * Math.pow(q10, (T1 - T2) / 10);
}

export const R = 8.314; // J/(mol·K)

/**
 * Khớp Arrhenius từ các cặp (nhiệt độ °C, thời gian cảm ứng hoặc hạn dùng): ln t = a + b/T (T theo K).
 * Thời gian tỉ lệ nghịch với hằng số tốc độ k nên Ea = b·R. Trả về hàm ngoại suy, Ea (kJ/mol), Q10 quanh nhiệt độ đích, R².
 * @param {Array<[number, number]>} diem [[°C, thời gian], ...] (ít nhất 2 điểm, nhiệt độ khác nhau)
 */
export function arrhenius(diem) {
	const x = diem.map(([c]) => 1 / (c + 273.15));
	const y = diem.map(([, t]) => Math.log(t));
	const n = x.length;
	const mx = x.reduce((s, v) => s + v, 0) / n;
	const my = y.reduce((s, v) => s + v, 0) / n;
	let sxy = 0, sxx = 0, syy = 0;
	for (let i = 0; i < n; i++) {
		sxy += (x[i] - mx) * (y[i] - my);
		sxx += (x[i] - mx) ** 2;
		syy += (y[i] - my) ** 2;
	}
	const b = sxy / sxx;
	const a = my - b * mx;
	const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
	const thoiGianTai = (c) => Math.exp(a + b / (c + 273.15));
	const EaKJ = (b * R) / 1000;
	const q10Tai = (c) => thoiGianTai(c) / thoiGianTai(c + 10);
	return { thoiGianTai, EaKJ, q10Tai, r2 };
}

// ---------------------------------------------------------------- Đợt máy tính thứ ba (2026-11-02)
export const KB = 1.380649e-23; // J/K, hằng số Boltzmann

/** Áp suất Laplace của giọt cầu: ΔP = 4γ/d (= 2γ/r). γ mN/m, d µm → Pa và bar. */
export function laplace(gammaMNm, dUm) {
	const pa = (4 * gammaMNm * 1e-3) / (dUm * 1e-6);
	return { pa, bar: pa / 1e5 };
}

/** Lực ion I = ½ Σ cᵢ zᵢ² (mol/L) từ danh sách [nồng độ mol/L, hóa trị]. */
export function lucIon(ion) {
	return 0.5 * ion.reduce((s, [c, z]) => s + c * z * z, 0);
}

/** Độ dài Debye trong nước 25 °C, chất điện ly bất kỳ đã quy về lực ion I (mol/L): κ⁻¹ ≈ 0,304/√I nm. */
export function debye(I) {
	return 0.304 / Math.sqrt(I);
}

/** Năng lượng giải hấp hạt Pickering: ΔE = π r² γ (1 − |cos θ|)². r nm, γ mN/m, θ độ, T K → J và bội số kT. */
export function pickering(rNm, gammaMNm, thetaDo, TK = 298.15) {
	const r = rNm * 1e-9;
	const J = Math.PI * r * r * gammaMNm * 1e-3 * (1 - Math.abs(Math.cos((thetaDo * Math.PI) / 180))) ** 2;
	return { J, kT: J / (KB * TK) };
}

/** Hồi quy tuyến tính y = a + b·x; trả về {a, b, r2}. */
export function hoiQuy(x, y) {
	const n = x.length;
	const mx = x.reduce((s, v) => s + v, 0) / n;
	const my = y.reduce((s, v) => s + v, 0) / n;
	let sxy = 0, sxx = 0, syy = 0;
	for (let i = 0; i < n; i++) {
		sxy += (x[i] - mx) * (y[i] - my);
		sxx += (x[i] - mx) ** 2;
		syy += (y[i] - my) ** 2;
	}
	const b = sxy / sxx;
	return { a: my - b * mx, b, r2: syy === 0 ? 1 : (sxy * sxy) / (sxx * syy) };
}

/**
 * Kiểm Ostwald ripening: d³ có tuyến tính theo thời gian không (LSW), so với d tuyến tính.
 * @param {Array<[number, number]>} diem [[thời gian, d (µm)], ...]
 * Trả về tốc độ ω = d(r³)/dt (µm³ / đơn vị thời gian) và R² của hai cách vẽ.
 */
export function ostwald(diem) {
	const t = diem.map(([x]) => x);
	const d3 = diem.map(([, d]) => d ** 3);
	const lap3 = hoiQuy(t, d3);
	const lap1 = hoiQuy(t, diem.map(([, d]) => d));
	return { omegaR3: lap3.b / 8, doDocD3: lap3.b, r2D3: lap3.r2, r2D: lap1.r2, d3Dau: lap3.a };
}

/** TOTOX = 2·PV + AnV (PV meq O₂/kg, AnV p-anisidine). */
export function totox(pv, anv) {
	return 2 * pv + anv;
}

// Khối lượng nguyên tử (IUPAC, làm tròn) để tính IV, SV theo tỉ lượng
const M_C = 12.011, M_H = 1.008, M_O = 15.999, M_I2 = 253.809, M_KOH = 56.106;
/** Khối lượng mol acid béo CₙH₂ₙ₋₂ₖO₂ (n cacbon, k nối đôi). */
export function mAcidBeo(n, k) {
	return n * M_C + (2 * n - 2 * k) * M_H + 2 * M_O;
}
/**
 * IV và SV của chất béo từ thành phần acid béo (% khối lượng, tính như acid béo tự do):
 * IV = Σ wᵢ · 100 · kᵢ · M(I₂) / Mᵢ / 100 ; SV của TAG = 3 · M(KOH) · 1000 / M(TAG), M(TAG) = 3·M̄ + M(glycerol) − 3·M(H₂O).
 * @param {Array<[number, number, number]>} tp [[n, k, %], ...]
 */
export function ivSv(tp) {
	const tong = tp.reduce((s, [, , w]) => s + w, 0);
	const iv = tp.reduce((s, [n, k, w]) => s + (w / tong) * (100 * k * M_I2) / mAcidBeo(n, k), 0);
	// M̄ trung bình theo số mol: 1 / Σ(wᵢ/Mᵢ)
	const mTB = 1 / tp.reduce((s, [n, k, w]) => s + w / tong / mAcidBeo(n, k), 0);
	const mGlycerol = 3 * M_C + 8 * M_H + 3 * M_O, mNuoc = 2 * M_H + M_O;
	const mTAG = 3 * mTB + mGlycerol - 3 * mNuoc;
	// IV tính theo acid béo tự do; dầu thật ở dạng TAG nên nhân thêm phần khối lượng gốc acyl 3·M̄/M(TAG)
	return { iv, ivDau: (iv * 3 * mTB) / mTAG, sv: (3 * M_KOH * 1000) / mTAG, mTB, mTAG, tong };
}

/** Phần axit yếu chưa phân ly: f = 1 / (1 + 10^(pH − pKa)). */
export function phanChuaPhanLy(pH, pKa) {
	return 1 / (1 + 10 ** (pH - pKa));
}

/**
 * Giá trị gây chết F ở nhiệt độ không đổi: F = t · 10^((T − T_ref)/z) (phút tương đương ở T_ref);
 * số log giảm = F / D_ref.
 */
export function giaTriF(tPhut, T, Tref, z, Dref) {
	const F = tPhut * 10 ** ((T - Tref) / z);
	return { F, logGiam: Dref > 0 ? F / Dref : null, L: 10 ** ((T - Tref) / z) };
}
