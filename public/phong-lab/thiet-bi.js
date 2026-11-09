// Bảng thông số máy của phòng lab, dùng chung cho cốc (P1), máy đo cỡ hạt (P2) và các gói sau.
// Mỗi số lấy từ tài liệu hãng (khoaNguon có trong nguon/nguon.json) hoặc từ tổng quan ghi ở nguonTinCay.
// Chỉ hàm thuần, không chạm DOM, để scripts/kiem-phong-lab.mjs kiểm được.

export const THIET_BI = {
	khuay: {
		ten: 'Máy khuấy cắt cao (rotor–stator)',
		vd: 'IKA T 25 digital Ultra-Turrax',
		theTichML: [1, 2000],
		nhotToiDaMPas: 5000,
		rpm: [3000, 25000],
		khoaNguon: 'ika-t25-2026',
		nhan: 'N',
	},
	dongHoa: {
		ten: 'Máy đồng hóa áp cao để bàn',
		vd: 'GEA PandaPLUS 2000',
		theTichToiThieuML: 30,
		theTichNamLaiML: 15, // hãng ghi "internal volume 15 ml" [N]; việc 15 mL nằm lại sau mỗi lượt là suy luận [G]
		khoaNguon: 'gea-pandaplus2000-2025',
		ghiChu: 'Hãng ghi: thể tích tối thiểu có thể thay đổi theo sản phẩm.',
		nhan: 'N',
	},
	nhieuXaLaser: {
		ten: 'Máy nhiễu xạ laser',
		vd: 'Malvern Mastersizer 3000+ Ultra',
		daiMay: [0.01, 3500], // µm, theo hãng
		daiTinCay: [0.1, 1000], // µm, vùng các tổng quan khuyên dùng
		khoaNguon: 'malvern-mastersizer-2026',
		khoaNguonTinCay: 'kupikowskastobba2024',
		nhan: 'N',
	},
	dls: {
		ten: 'Máy tán xạ ánh sáng động (DLS)',
		vd: 'Malvern Zetasizer Ultra',
		daiMay: [0.0003, 10], // µm (= 0,3 nm–10 µm), theo tài liệu dòng Zetasizer Advance
		daiTinCay: [0.003, 5], // µm (= 3 nm–5 µm)
		theTichMauUL: 3,
		khoaNguon: 'malvern-zetasizer-advance',
		khoaNguonTinCay: 'kupikowskastobba2024',
		khoaNguonZ: ['farkas2021', 'malvern-dls-thuat-ngu'],
		nhan: 'N',
	},
};

/** Mọi khóa nguồn mà bảng máy dùng (để phép kiểm đối chiếu với nguon.json). */
export function khoaNguonThietBi() {
	const ds = new Set();
	for (const m of Object.values(THIET_BI)) {
		for (const k of [m.khoaNguon, m.khoaNguonTinCay, ...(m.khoaNguonZ ?? [])]) if (k) ds.add(k);
	}
	return [...ds];
}

/**
 * Máy có chạy được với mẻ này không?
 * @param {'khuay'|'dongHoa'} idMay
 * @param {{theTichML:number, nhotMPas?:number}} mau thể tích mẻ (mL) và độ nhớt pha liên tục (mPa·s)
 * @returns {{chay:boolean, ly:string|null, haoML:number}} haoML: thể tích nằm lại trong máy sau một lượt chạy
 */
export function kiemMay(idMay, { theTichML, nhotMPas = 1 }) {
	const m = THIET_BI[idMay];
	if (!m) return { chay: false, ly: 'Máy không có trong bảng thông số.', haoML: 0 };
	if (idMay === 'khuay') {
		const [lo, hi] = m.theTichML;
		if (!(theTichML >= lo) || theTichML > hi) {
			return { chay: false, ly: `Máy khuấy cắt cao chỉ xử lý được mẫu từ ${lo} mL đến ${hi.toLocaleString('vi-VN')} mL (theo bảng thông số của hãng). Mẻ này ≈ ${Math.round(theTichML).toLocaleString('vi-VN')} mL.`, haoML: 0 };
		}
		if (nhotMPas > m.nhotToiDaMPas) {
			return { chay: false, ly: `Máy khuấy cắt cao xử lý mẫu tới ${m.nhotToiDaMPas.toLocaleString('vi-VN')} mPa·s (theo hãng); pha nước của mẻ này đặc hơn.`, haoML: 0 };
		}
		return { chay: true, ly: null, haoML: 0 };
	}
	if (idMay === 'dongHoa') {
		if (!(theTichML >= m.theTichToiThieuML)) {
			return {
				chay: false,
				ly: `Máy đồng hóa để bàn cần tối thiểu ${m.theTichToiThieuML} mL mẫu để bơm piston hút được (theo bảng thông số của hãng). Mẻ này ≈ ${Math.round(theTichML).toLocaleString('vi-VN')} mL.`,
				haoML: m.theTichNamLaiML,
			};
		}
		return { chay: true, ly: null, haoML: m.theTichNamLaiML };
	}
	return { chay: false, ly: 'Máy này chưa có quy tắc kiểm.', haoML: 0 };
}
