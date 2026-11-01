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
