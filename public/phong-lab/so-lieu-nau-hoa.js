// Số liệu bàn nâu hóa. Mọi số lấy từ nguon/nguon.json (mức đọc: tóm tắt) qua thong-so-phong-lab.json, nhóm "Nâu hóa".
// Số nào là khoảng thì giữ nguyên là khoảng. Không có số nào ở đây là của riêng bàn này, trừ cặp k gán đầu thấp/đầu cao (nhãn T, xem mo-hinh-nau-hoa.js).
export const NAU = {
	banhQuy: {
		khoa: ['isleroglu2012'],
		T: [165, 195], // °C, khoảng nhiệt độ của số k
		kBI: [0.019, 0.063], // 1/phút, chỉ số nâu (BI)
		kAcryl: [0.023, 0.077], // 1/phút, acrylamide
		EaBI: [19.54, 35.36], // kJ/mol như tóm tắt báo cáo
		EaAcryl: [6.87, 27.84], // kJ/mol
	},
	// thứ tự tốc độ lên màu ở pH 6, hệ lỏng đường–glycin (Buera 1987): nhanh → chậm
	thuTuDuong: { khoa: ['buera1987'], ds: ['xylose', 'glucose', 'fructose', 'lactose', 'maltose', 'sucrose'] },
	// aw tại đỉnh nâu hóa, hệ trung gian glucose–lysine (Kim 1987): ba nhiệt độ thử; nhiệt độ cụ thể không đọc được trong tóm tắt
	awDinh: { khoa: ['kim1987'], gia_tri: [0.67, 0.74, 0.89] },
	// chiên chip, hạ nhiệt 190 → 160 °C trong 7 phút (Liyanage 2020), phần trăm acrylamide giảm theo giống
	chip: { khoa: ['liyanage2020'], tu: 190, den: 160, phut: 7, giam: { Atlantic: 84, Snowden: 67, Vigor: 78 } },
	// asparaginase: mỗi mục là đúng một điều kiện đã công bố, không nội suy giữa các mục
	enzyme: {
		khoa: ['pham2020', 'demelo2025', 'becker2026'],
		ds: {
			'khoai-tay': { ten: 'Asparaginase 1 IU/mL', dk: '37 °C, pH 7,3, 30 phút', giam: 45.6 },
			'khoai-lang': { ten: 'Asparaginase 500 U/mL', dk: '45 °C, khoai lang', giam: 85 },
		},
	},
};
