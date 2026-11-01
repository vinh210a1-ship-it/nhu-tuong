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
