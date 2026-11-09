// Khu Thực phẩm: hộp "Thử ngay" và "Cần biết trước". Quy tắc ở đầu src/data/cong-cu-bai.mjs.
// Bài không có công cụ thật sự liên quan thì không có hộp "Thử ngay".

export const CONG_CU_THUC_PHAM = {
	'giu-nuoc-thit-phosphat-muoi-ph': [
		{ loai: 'ban', id: 'thit', ten: 'Bàn thịt', vi: 'Đổi muối, phosphat và pH rồi xem thịt giữ nước hay chảy nước; kiểm trực tiếp điều bài vừa nói về nâng pH.' },
	],
	'bao-quan-hoat-do-nuoc-va-han-su-dung': [
		{ loai: 'ban', id: 'bao-quan', ten: 'Bàn bảo quản', vi: 'Chỉnh aw, pH, muối, nhiệt độ và chất bảo quản để xem vi khuẩn có mọc không.' },
		{ loai: 'may-tinh', id: 'axit-yeu', ten: 'Phần chất bảo quản axit yếu chưa phân ly', vi: 'Nhập pH và pKa để thấy vì sao sorbat, benzoat mạnh yếu theo pH.' },
		{ loai: 'may-tinh', id: 'arrhenius', ten: 'Hạn dùng theo nhiệt độ (Arrhenius)', vi: 'Nhập các điểm đo ở nhiều nhiệt độ để xem hạn dùng ngoại suy thay đổi thế nào.' },
	],
	'maillard-caramel-acrylamide': [
		{ loai: 'ban', id: 'nau-hoa', ten: 'Bàn nâu hóa', vi: 'Thử hạ nhiệt chiên, asparaginase, đường và aw để thấy yếu tố nào làm acrylamide và màu thay đổi; số nào không có thì bàn nói ngoài vùng có dữ liệu.' },
	],
	'protein-bien-tinh-gel-hoa-va-enzym': [
		{ loai: 'ban', id: 'thit', ten: 'Bàn thịt', vi: 'Thử muối và phosphat trên khối thịt để thấy protein sợi cơ giữ nước ra sao.' },
	],
	'tinh-bot-ho-hoa-thoai-hoa': [
		{ loai: 'tra-cuu', id: 'ins', q: 'tinh bột biến tính', ten: 'Tra cứu mã INS: tinh bột biến tính', vi: 'Tra mã INS của các tinh bột biến tính (nhóm 14xx).' },
	],
	'chat-tao-ngot-mau-dieu-vi': [
		{ loai: 'tra-cuu', id: 'tt24', q: 'acesulfam', ten: 'Tra cứu mức tối đa (TT24/2019): chất tạo ngọt', vi: 'Tra mức tối đa của chất tạo ngọt theo nhóm thực phẩm.' },
	],
	'qua-trinh-nhiet-lanh-say-ep-dun': [
		{ loai: 'may-tinh', id: 'gia-tri-f', ten: 'Giá trị F ở nhiệt độ không đổi', vi: 'Quy một bước gia nhiệt về số phút tương đương ở nhiệt độ chuẩn để so các chế độ thanh trùng.' },
	],
	'quy-dinh-jecfa-efsa-da-kiem': [
		{ loai: 'tra-cuu', id: 'tt24', ten: 'Tra cứu mức tối đa (TT24/2019)', vi: 'ADI chỉ là mức sức khỏe tham chiếu; mức được phép dùng trong sản phẩm tra ở đây.' },
	],
};

// Mặc định "Cần biết trước" là bài ngay trước trong khu; chỗ nào cần khác thì ghi đè. 'slug' = cùng khu, 'khu/slug' = khu khác.
export const CAN_BIET_THUC_PHAM = {
	'giu-nuoc-thit-phosphat-muoi-ph': ['chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu'], // bài dựa trên điện tích protein so với điểm đẳng điện
	'bao-quan-hoat-do-nuoc-va-han-su-dung': [], // chưa có bài nền về aw trên web: hiện "đọc độc lập", không gắn cho có
	'maillard-caramel-acrylamide': ['bao-quan-hoat-do-nuoc-va-han-su-dung'], // tốc độ nâu hóa phụ thuộc aw
	'tinh-bot-ho-hoa-thoai-hoa': ['chat-on-dinh/co-che-nen-tang'], // độ nhớt, mạng gel
	'protein-bien-tinh-gel-hoa-va-enzym': ['giu-nuoc-thit-phosphat-muoi-ph'],
	'chat-tao-ngot-mau-dieu-vi': ['chat-nhu-hoa/ma-ins-quy-dinh-an-toan'], // cách đọc mã INS và ADI
	'qua-trinh-nhiet-lanh-say-ep-dun': ['bao-quan-hoat-do-nuoc-va-han-su-dung'],
	'quy-dinh-jecfa-efsa-da-kiem': ['chat-nhu-hoa/ma-ins-quy-dinh-an-toan'],
};
