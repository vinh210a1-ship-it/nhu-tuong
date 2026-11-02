// Các tủ trong phòng lab: chai nào nằm ở tủ nào, chai nào còn khóa (chờ trạm hoặc tài liệu sau).
import { DAU, NHU_HOA } from './mo-hinh.js';

const mauDau = {
	'huong-duong': '#f2c14e',
	'huong-duong-oleic': '#e8b440',
	'dau-nanh': '#e9c46a',
	cai: '#d9c24a',
	'o-liu': '#9aa83a',
	'co-olein': '#e07a2f',
	lanh: '#c99a2e',
	mct: '#f4e3a1',
};
const vietTat = {
	'huong-duong': 'HD',
	'huong-duong-oleic': 'HD-O',
	'dau-nanh': 'ĐN',
	cai: 'Cải',
	'o-liu': 'Ô liu',
	'co-olein': 'Cọ',
	lanh: 'Lanh',
	mct: 'MCT',
};

export const TU = {
	'tu-dau': {
		ten: 'Tủ dầu béo',
		moTa: 'Mỗi loại dầu khác nhau ở thành phần acid béo, tỷ trọng và độ nhớt. Nối đôi càng nhiều, dầu càng dễ ôi.',
		mon: [
			...Object.entries(DAU).map(([k, d]) => ({ id: `dau:${k}`, loai: 'dau', khoa: k, ten: d.ten, nhan: vietTat[k], mau: mauDau[k] ?? '#e9b949' })),
			{ id: 'khoa:dua', ten: 'Dầu dừa', nhan: 'Dừa', mau: '#f6f1e4', khoaMo: 'Dầu dừa đông đặc khi trời mát (nóng chảy khoảng 24 °C). Sẽ mở cùng trạm kết tinh chất béo.' },
			{ id: 'khoa:ca', ten: 'Dầu cá', nhan: 'Cá', mau: '#d8a04a', khoaMo: 'EPA và DHA có 5 đến 6 nối đôi, công thức độ không no hiện chỉ tính tới C18:3. Sẽ mở khi có số liệu kiểm.' },
		],
	},
	'tu-nhu-hoa': {
		ten: 'Tủ chất nhũ hóa & chất ổn định',
		moTa: 'Chất nhũ hóa phủ lên bề mặt giọt để giọt không nhập lại. Chất ổn định làm đặc pha nước để giọt khó nổi.',
		mon: [
			...Object.entries(NHU_HOA).map(([k, d]) => ({ id: `nh:${k}`, loai: 'nhuHoa', khoa: k, ten: d.ten, nhan: { wpi: 'WPI', ppi: 'PPI', tween80: 'T80', span80: 'S80' }[k], mau: { wpi: '#f3e6c4', ppi: '#c9d79a', tween80: '#c9b0ea', span80: '#eab0b0' }[k] })),
			{ id: 'xanthan', loai: 'xanthan', ten: 'Xanthan gum (E415)', nhan: 'XG', mau: '#ece6d2' },
			{ id: 'khoa:lecithin', ten: 'Lecithin đậu nành (E322)', nhan: 'Lec', mau: '#d9a85a', khoaMo: 'Chờ số liệu độ phủ bề mặt đã kiểm.' },
			{ id: 'khoa:caseinat', ten: 'Natri caseinat', nhan: 'Cas', mau: '#f5efe0', khoaMo: 'Chờ số liệu độ phủ bề mặt đã kiểm.' },
			{ id: 'khoa:gellan', ten: 'Gellan gum (E418)', nhan: 'GG', mau: '#e3e9d8', khoaMo: 'Sẽ mở cùng trạm gel.' },
		],
	},
	'tu-phu-gia': {
		ten: 'Tủ phụ gia',
		moTa: 'Hiện mở được hai chất chống oxy hóa. Các phụ gia còn lại sẽ mở cùng các trạm mới.',
		mon: [
			{ id: 'tocopherol', loai: 'tocopherol', ten: 'Tocopherol (vitamin E, E306)', nhan: 'Toco', mau: '#e6b75c' },
			{ id: 'edta', loai: 'edta', ten: 'EDTA canxi dinatri (E385)', nhan: 'EDTA', mau: '#dfe7ef' },
			{ id: 'khoa:stpp', ten: 'Natri tripolyphosphat (E451)', nhan: 'STPP', mau: '#ffffff', khoaMo: 'Giữ nước cho thịt. Dùng được ở Bàn thịt (nút chọn bàn phía trên).' },
			{ id: 'khoa:sorbat', ten: 'Kali sorbat (E202)', nhan: 'Sorb', mau: '#f0f0f0', khoaMo: 'Chất bảo quản chống nấm men. Dùng được ở Bàn bảo quản (nút chọn bàn phía trên).' },
			{ id: 'khoa:tg', ten: 'Transglutaminase', nhan: 'TG', mau: '#e0d6f0', khoaMo: 'Enzyme nối protein. Sẽ mở cùng trạm protein.' },
		],
	},
	'tu-duoc': {
		ten: 'Tủ dược chất',
		moTa: 'Mảng dược (bào chế, tá dược) đang được soạn tài liệu có nguồn. Tủ sẽ mở sau.',
		mon: [
			{ id: 'khoa:glycerol', ten: 'Glycerol', nhan: 'Gly', mau: '#eef6fb', khoaMo: 'Mảng dược đang soạn.' },
			{ id: 'khoa:vaselin', ten: 'Vaselin', nhan: 'Vas', mau: '#f7f3e6', khoaMo: 'Mảng dược đang soạn.' },
			{ id: 'khoa:carbomer', ten: 'Carbomer', nhan: 'Carb', mau: '#f1f1f7', khoaMo: 'Mảng dược đang soạn.' },
			{ id: 'khoa:lecithin-tiem', ten: 'Lecithin trứng tinh chế', nhan: 'Lec', mau: '#f3dfa8', khoaMo: 'Mảng dược đang soạn.' },
		],
	},
};
