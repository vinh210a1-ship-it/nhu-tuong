// Khu Chất béo: hộp "Thử ngay" và "Cần biết trước". Quy tắc ở đầu src/data/cong-cu-bai.mjs.
// Bài không có công cụ thật sự liên quan thì không có hộp "Thử ngay" (không gắn công cụ cho có).

export const CONG_CU_CHAT_BEO = {
	'cau-truc-triglyceride-va-acid-beo': [
		{ loai: 'may-tinh', id: 'iv-sv', ten: 'IV và SV từ thành phần acid béo', vi: 'Nhập thành phần acid béo để tự tính IV và SV, rồi đối chiếu với số đo của mẻ dầu bạn đang có.' },
	],
	'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung': [
		{ loai: 'may-tinh', id: 'totox', ten: 'TOTOX', vi: 'Nhập chỉ số peroxide và p-anisidine để gộp thành một con số oxy hóa tổng, và xem hai chỉ số đóng góp ra sao.' },
		{ loai: 'may-tinh', id: 'arrhenius', ten: 'Hạn dùng theo nhiệt độ (Arrhenius)', vi: 'Nhập các điểm đo ở nhiều nhiệt độ để xem hạn dùng ngoại suy thay đổi thế nào, và vì sao con số luôn cần đi kèm điều kiện.' },
		{ loai: 'lab', id: 'omega-3', ten: 'Nhiệm vụ "Sữa omega-3 không ôi"', vi: 'Chọn chất nhũ hóa và chất chống oxy hóa cho dầu dễ ôi rồi xem peroxide của mẻ sau thời gian bảo quản.' },
	],
	'phan-doan-interesterification-hydro-hoa': [
		{ loai: 'may-tinh', id: 'iv-sv', ten: 'IV và SV từ thành phần acid béo', vi: 'Nhập thành phần acid béo trước và sau hydro hóa để thấy IV giảm khi nối đôi mất đi.' },
	],
	'chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong': [
		{ loai: 'lab', id: 'omega-3', ten: 'Nhiệm vụ "Sữa omega-3 không ôi"', vi: 'Dầu giàu PUFA dễ oxy hóa: thử xem cách nhũ hóa và chất chống oxy hóa thay đổi kết quả thế nào.' },
		{ loai: 'ban', id: 'mayo', ten: 'Bàn nhũ tương, chế độ mayonnaise', vi: 'Thử đổ dầu nhanh và chậm, rồi so mẻ của bạn với bảng đo theo hàm lượng dầu.' },
	],
};

// Mặc định "Cần biết trước" là bài ngay trước trong khu; chỗ nào cần khác thì ghi đè. 'slug' = cùng khu, 'khu/slug' = khu khác.
export const CAN_BIET_CHAT_BEO = {
	'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung': ['cau-truc-triglyceride-va-acid-beo'],
	'phan-doan-interesterification-hydro-hoa': ['da-hinh-ket-tinh-va-ban-do-pha', 'sfc-mang-tinh-the-oleogel'],
	'chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong': ['sfc-mang-tinh-the-oleogel', 'nhu-tuong/mat-on-dinh'],
};
