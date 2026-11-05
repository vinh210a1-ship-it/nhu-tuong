// Tham số của ba bàn lab mới (nhũ tương kép, Pickering, mayonnaise). Mô hình trong mo-hinh-ban-moi.js CHỈ đọc số từ file này.
// Mỗi tham số giữ: gia_tri, don_vi, nhan (N có nguồn, T tính minh họa, K sách nền, G suy luận), chac (mức tin cậy), nguon (khóa trong nguon/nguon.json), mien (miền áp dụng).
// Chép từ bộ dữ liệu đã kiểm: so-lieu-ban-lab.json và so-lieu-toan-van.json. Số nào không có nguồn thì KHÔNG có ở đây: phần đó làm định tính và không chấm sao.

/* ---------------- Hằng số vật lý và giả định quy đổi ---------------- */
export const CHUNG = {
	R: { gia_tri: 0.08314, don_vi: 'L·bar/(mol·K)', nhan: 'K', chac: 'Cao', nguon: [], mien: 'Hằng số khí' },
	T_K: { gia_tri: 298, don_vi: 'K', nhan: 'T', chac: 'Cao', nguon: ['mezzenga2004'], mien: 'Nhiệt độ của phép tính thẩm thấu minh họa' },
	i_NaCl: { gia_tri: 2, don_vi: '-', nhan: 'T', chac: 'Vừa', nguon: ['mezzenga2004'], mien: 'Dung dịch lý tưởng' },
	rho_dau: { gia_tri: 0.92, don_vi: 'g/mL', nhan: 'T', chac: 'Vừa', nguon: ['nollet2024', 'ho2022'], mien: 'Giả định khi quy đổi khối lượng sang thể tích' },
	rho_nuoc: { gia_tri: 1, don_vi: 'g/mL', nhan: 'T', chac: 'Vừa', nguon: [], mien: 'Pha nước trong giọt W₁, giả định khi quy đổi' },
	rho_pha_nuoc_mayo: { gia_tri: 1.03, don_vi: 'g/mL', nhan: 'T', chac: 'Vừa', nguon: ['ho2022'], mien: 'Pha không dầu của mayonnaise, giả định khi quy đổi' },
	kT_25: { gia_tri: 4.11e-21, don_vi: 'J', nhan: 'K', chac: 'Cao', nguon: [], mien: '298 K' },
};

/* ---------------- Bàn nhũ tương kép W₁/O/W₂ (hệ Nollet 2024) ---------------- */
export const KEP = {
	he: { gia_tri: 'W₁ = nước + NaCl 0,1 M; dầu hướng dương + PGPR; W₂ = gum arabic 20 wt% + NaCl 0,1 M', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Mọi số của bàn này chỉ đúng cho hệ này' },
	rpm_buoc_1: { gia_tri: 24000, don_vi: 'rpm', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Rotor-stator, 30 giây, tạo W₁/O' },
	d_trong: { gia_tri: 1.9, don_vi: 'µm', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Đường kính giọt W₁, gần như không đổi theo lượng PGPR' },
	cmc: { gia_tri: 1, don_vi: 'wt% pha dầu', nhan: 'N', chac: 'Cao', nguon: ['nollet2024', 'nollet2018'], mien: 'CMC của PGPR trong dầu hướng dương' },
	pgpr_hap_phu_40: { gia_tri: 1.28, don_vi: 'wt% pha dầu', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'PGPR hấp phụ để phủ giọt ~2 µm ở 40 wt% nước' },
	gamma_pgpr: { gia_tri: 6.1, don_vi: 'mg/m²', nhan: 'T', chac: 'Vừa', nguon: ['nollet2024'], mien: 'Suy từ CMC và diện tích đầu phân cực 100 Å²; không phải phép đo trực tiếp' },
	gamma_ngoai: { gia_tri: [1.5, 2.5], don_vi: 'mN/m', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Sức căng W₁/O–W₂: dưới 1,5 không điều chế được; 1,5–2,5 tạo được nhưng nhanh hỏng; trên 2,5 bền' },
	ee_9_thang: { gia_tri: 90, don_vi: '%', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Hiệu suất bao gói vitamin B12 suốt 9 tháng ở miền xanh' },
	tau_on_dinh: { gia_tri: 0.9, don_vi: '-', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Tỉ lệ phủ mặt globule bởi giọt trong, τ = d_G/(4 d_d)·φ_d,vol' },
	c_free: { gia_tri: [0.36, 1, 2.5, 5, 10], don_vi: 'wt% pha dầu', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Các mức PGPR tự do có trong bài' },
	phi_d: { gia_tri: [5, 10, 20, 40, 47.1], don_vi: 'wt%', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'Các mức pha nước trong globule' },
	// Bản đồ miền: chỉ những ô bài báo có. Ô không có ở đây là "ngoài vùng có dữ liệu".
	ban_do: {
		gia_tri: {
			'0.36': { 5: 'xanh', 10: 'xanh', 20: 'xanh', 40: 'xanh' },
			'2.5': { 10: 'do', 20: 'cam', 40: 'xanh' },
			5: { 20: 'do' },
			10: { 40: 'cam', 47.1: 'xanh' },
		},
		nhan: 'N',
		chac: 'Cao',
		nguon: ['nollet2024'],
		mien: 'xanh = kép ổn định 9 tháng; cam = kép, thuận, nghịch cùng tồn tại, không bền; đỏ = chỉ thu được nhũ nghịch',
	},
	nacl_w1: { gia_tri: 0.1, don_vi: 'M', nhan: 'N', chac: 'Cao', nguon: ['nollet2024'], mien: 'NaCl trong W₁' },
	nacl_w2_chon: { gia_tri: [0, 0.1, 0.2], don_vi: 'M', nhan: 'T', chac: 'Cao', nguon: [], mien: 'Các mức để thử hướng nước; chỉ 0,1 M nằm trong bản đồ' },
	// Rò rỉ chỉ để minh họa: chưa có hằng số đã kiểm (P, k). Không có trục số, không chấm sao.
	k_ro_cam_minh_hoa: { gia_tri: 0.5, don_vi: '1/tháng', nhan: 'G', chac: 'Thấp', nguon: [], mien: 'Số minh họa để vẽ hình dạng đường cong; KHÔNG in ra màn hình' },
};

/* ---------------- Bàn Pickering ---------------- */
// Phương pháp đo θ phải hiện trên màn hình; hai phương pháp khác nhau thì không so trực tiếp.
export const PP_DO = {
	'chua-kiem': 'Phương pháp đo chưa kiểm (bài chỉ đọc tóm tắt)',
	'khong-khi': 'Giọt nước 2 µL trên màng hạt khô, trong không khí (không phải θ dầu–nước)',
	'duoi-dau': 'Viên nén ngâm trong dầu, nhỏ giọt nước: θ dầu–nước',
	xrr: 'Phản xạ tia X tại mặt phân cách decan/nước: θ dầu–nước',
};
export const GAMMA_OW = { gia_tri: 30, don_vi: 'mN/m', nhan: 'N', chac: 'Vừa', nguon: ['mcclements2016'], mien: 'Triacylglycerol lỏng với nước (Table 5.1, tr.188); phụ thuộc mạnh vào loại dầu' };
export const D_THU_NM = { gia_tri: 1000, don_vi: 'nm', nhan: 'T', chac: 'Tự chọn', nguon: [], mien: 'Vị trí ban đầu của thanh trượt khi bài báo không cho cỡ hạt; người chơi tự đổi' };
export const NGUONG_BAM_KT = { gia_tri: 1000, don_vi: 'kT', nhan: 'T', chac: 'Luật chơi', nguon: [], mien: 'Ngưỡng chấm sao của trò chơi' };
// d_nm: cỡ hạt do bài báo nêu; null = chưa có trong dữ liệu, người chơi tự chọn để thử.
export const HAT = [
	{ id: 'osa-khoai-mon-thap', ten: 'Tinh bột khoai môn, mức thế OSA thấp', theta: 25.4, pp: 'chua-kiem', d_nm: null, thucPham: true, mem: false, nhan: 'N', chac: 'Vừa', nguon: ['yu2019'], ghiChu: 'Đầu thấp của dải 25,4 đến 70,1° (bài chỉ đọc tóm tắt).' },
	{ id: 'osa-khoai-mon-cao', ten: 'Tinh bột khoai môn, OSA DS 0,032', theta: 70.1, pp: 'chua-kiem', d_nm: null, thucPham: true, mem: false, nhan: 'N', chac: 'Vừa', nguon: ['yu2019'], ghiChu: 'DS từ 0,018 trở lên cho nhũ tương bền.' },
	{ id: 'osa-tigernut', ten: 'Tinh bột hạt hương cú OSA, DS 0,029', theta: 84.76, pp: 'chua-kiem', d_nm: 7710, thucPham: true, mem: false, nhan: 'N', chac: 'Vừa', nguon: ['wu2024'], ghiChu: 'Hạt khoảng 7,71 µm.' },
	{ id: 'osa-nano', ten: 'Tinh bột khoai lang nano + OSA, DS 0,0184', theta: 90, pp: 'chua-kiem', d_nm: 77, thucPham: true, mem: false, nhan: 'N', chac: 'Vừa', nguon: ['lou2025'], ghiChu: 'Hạt khoảng 77 nm.' },
	{ id: 'wpi-goc', ten: 'WPI gốc (protein whey)', theta: 24, pp: 'khong-khi', d_nm: null, thucPham: true, mem: true, nhan: 'N', chac: 'Cao', nguon: ['doprado2021'], ghiChu: 'Protein là hạt mềm.' },
	{ id: 'wpi-vi-gel', ten: 'Vi gel whey WP40', theta: 39, pp: 'khong-khi', d_nm: 1853, thucPham: true, mem: true, nhan: 'N', chac: 'Cao', nguon: ['doprado2021'], ghiChu: 'Vi gel khoảng 1 853 nm; hạt mềm.' },
	{ id: 'wpi-citric', ten: 'Vi gel whey liên kết chéo acid citric', theta: 60, pp: 'khong-khi', d_nm: null, thucPham: true, mem: true, nhan: 'N', chac: 'Cao', nguon: ['doprado2021'], ghiChu: 'Mức cao nhất trong bài; hạt mềm.' },
	{ id: 'zein', ten: 'Zein', theta: 114, pp: 'duoi-dau', d_nm: null, thucPham: true, mem: true, nhan: 'N', chac: 'Vừa', nguon: ['mat2023-zein'], ghiChu: 'Đọc qua bản tóm tắt tự động, chưa đối chiếu bảng gốc.' },
	{ id: 'zein-alginate', ten: 'Phức zein/alginate Z1S1', theta: 73.13, pp: 'duoi-dau', d_nm: 80, thucPham: true, mem: true, nhan: 'N', chac: 'Vừa', nguon: ['mat2023-zein'], ghiChu: 'Hạt dưới 80 nm; đọc qua bản tóm tắt tự động, chưa đối chiếu bảng gốc.' },
	{ id: 'silica-amin', ten: 'Silica gắn amin (APTES), 19 nm', theta: 22.26, pp: 'xrr', d_nm: 19, thucPham: false, mem: false, nhan: 'N', chac: 'Cao (bản thảo)', nguon: ['smits2022'], ghiChu: 'Bản thảo arXiv; hạt vô cơ, chỉ để so sánh, không dùng cho thực phẩm.' },
];

/* ---------------- Bàn mayonnaise ---------------- */
// Điểm tham chiếu thật: một nghiên cứu, dầu đậu nành, cone–plate 20 °C, đường kính theo thể tích (không phải d32).
export const MAYO = {
	li2012: {
		nguon: ['li2012mayo'],
		nhan: 'N',
		chac: 'Cao',
		mien: 'Một nghiên cứu, một công thức, dầu đậu nành, cone–plate 20 °C; đường kính theo thể tích, không phải d32',
		diem: {
			75: { pH: 4.37, aw: 0.92, d_tt: 3.89, tau0: 58.5, Gp: 492, Gpp: 77 },
			80: { pH: 4.36, aw: 0.89, d_tt: 3.04, tau0: 133.5, Gp: 833, Gpp: 112 },
			85: { pH: 4.33, aw: 0.86, d_tt: 3.15, tau0: 139.8, Gp: 912, Gpp: 115 },
		},
	},
	dai_dau: { gia_tri: [75, 84], don_vi: '% khối lượng', nhan: 'N', chac: 'Cao', nguon: ['mcclements2016'], mien: 'Sách, tr.567; Table 12.3 tr.565' },
	d32_tm: { gia_tri: [1.69, 6.29], don_vi: 'µm', nhan: 'N', chac: 'Cao', nguon: ['nunes2002'], mien: '7 mayo thương mại có trứng; không có φ, pH, muối' },
	Gp_tm: { gia_tri: [121.1, 948.8], don_vi: 'Pa', nhan: 'N', chac: 'Cao', nguon: ['nunes2002'], mien: '8 mẫu mayo thương mại' },
	pk: { gia_tri: { a: 1.769, phi0: 0.712 }, don_vi: 'Pa', nhan: 'N', chac: 'Cao (công thức); Thấp khi áp lên mayo', nguon: ['princen1986'], mien: 'G = a·(σ/R₃₂)·φ^(1/3)·(φ − φ₀); chỉ là đường nền' },
	sigma_nen: { gia_tri: 10, don_vi: 'mN/m', nhan: 'T', chac: 'Thấp', nguon: ['anton1999'], mien: 'Lòng đỏ loãng ở pH 6, mượn để vẽ đường nền; không phải σ của mayonnaise' },
	d32_nen: { gia_tri: 3.5, don_vi: 'µm', nhan: 'T', chac: 'Thấp', nguon: ['nunes2002'], mien: 'Giá trị giữa dải thương mại, mượn để vẽ đường nền' },
	tau0_muc_tieu: { gia_tri: 100, don_vi: 'Pa', nhan: 'T', chac: 'Luật chơi', nguon: [], mien: 'Ngưỡng chấm sao của trò chơi' },
};

/** Duyệt mọi tham số, trả về danh sách khóa nguồn đang dùng (để phép kiểm đối chiếu với nguon.json). */
export function moiKhoaNguon() {
	const ds = new Set();
	const them = (o) => (o?.nguon ?? []).forEach((k) => ds.add(k));
	[...Object.values(CHUNG), ...Object.values(KEP), GAMMA_OW, NGUONG_BAM_KT, ...HAT, MAYO.li2012, ...Object.values(MAYO).filter((x) => x !== MAYO.li2012)].forEach(them);
	return [...ds];
}
