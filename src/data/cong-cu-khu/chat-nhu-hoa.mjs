// Khu Chất nhũ hóa: hộp "Thử ngay" và "Cần biết trước". Quy tắc ở đầu src/data/cong-cu-bai.mjs.

export const CONG_CU_CHAT_NHU_HOA = {
	'nen-tang-vat-ly-hoa-be-mat': [
		{ loai: 'may-tinh', id: 'hlb', ten: 'Trộn hai chất nhũ hóa theo HLB', vi: 'Phối hai chất để đạt HLB mục tiêu, rồi đối chiếu với điều bạn vừa đọc về giới hạn của HLB.' },
		{ loai: 'may-tinh', id: 'chat-nhu-hoa-toi-thieu', ten: 'Chất nhũ hóa tối thiểu', vi: 'Đổi kích thước giọt để thấy lượng chất nhũ hóa cần để phủ kín bề mặt thay đổi ra sao.' },
	],
	'cac-nhom-chat-nhu-hoa-thuc-pham': [
		{ loai: 'may-tinh', id: 'hlb', ten: 'Trộn hai chất nhũ hóa theo HLB', vi: 'Thử phối một chất ưa dầu với một chất ưa nước, ví dụ cặp Span và Tween, để đạt HLB mong muốn.' },
		{ loai: 'lab', id: 'sua-thuc-vat', ten: 'Nhiệm vụ "Sữa hạt không tách lớp"', vi: 'Chọn trong bốn chất nhũ hóa của tủ và xem mẻ nào giữ được sữa hạt không tách lớp.' },
		{ loai: 'tra-cuu', id: 'ins', ten: 'Tra mã INS/E', vi: 'Tra nhanh mã INS và chức năng của chất nhũ hóa bạn vừa đọc.' },
	],
	'protein-nhu-hoa-va-canh-tranh-hap-phu': [
		{ loai: 'lab', id: 'whey-nong', ten: 'Nhiệm vụ "Đồ uống whey giàu đạm"', vi: 'Làm đồ uống dùng protein whey làm chất nhũ hóa, rồi xem nhiệt độ xử lý ảnh hưởng ra sao.' },
		{ loai: 'lab', id: 'sua-thuc-vat', ten: 'Nhiệm vụ "Sữa hạt không tách lớp"', vi: 'So protein đậu với chất nhũ hóa phân tử nhỏ trong cùng một công thức sữa hạt.' },
	],
	'ma-ins-quy-dinh-an-toan': [
		{ loai: 'tra-cuu', id: 'tt24', ten: 'Tra cứu mức tối đa (TT24/2019)', vi: 'Tra một chất theo mã INS hoặc theo nhóm thực phẩm để thấy mức tối đa được phép.' },
		{ loai: 'tra-cuu', id: 'ins', ten: 'Tra mã INS/E', vi: 'Đối chiếu mã INS với tên và chức năng của chất.' },
	],
	'ung-dung-theo-san-pham-va-quy-trinh-chon-chat-nhu-hoa': [
		{ loai: 'ban', id: 'kep', ten: 'Bàn nhũ tương kép', vi: 'Chọn PGPR và tỉ lệ giọt trong rồi xem công thức rơi vào miền nào trên bản đồ ổn định.' },
		{ loai: 'lab', id: 'sot-salad', ten: 'Nhiệm vụ "Sốt salad đứng yên"', vi: 'Thử đổi chất nhũ hóa và chất làm đặc để thấy chọn theo loại hệ ảnh hưởng thế nào.' },
		{ loai: 'chan-doan', ten: 'Cây chẩn đoán sự cố', vi: 'Khi mẻ thử hỏng, đi theo cây quyết định để biết nên đổi chất nhũ hóa hay đổi điều kiện.' },
	],
};

// Mặc định "Cần biết trước" là bài ngay trước trong khu; chỗ nào cần khác thì ghi đè. 'slug' = cùng khu, 'khu/slug' = khu khác.
export const CAN_BIET_CHAT_NHU_HOA = {
	'nen-tang-vat-ly-hoa-be-mat': ['nhu-tuong/nen-tang'],
	'protein-nhu-hoa-va-canh-tranh-hap-phu': ['nen-tang-vat-ly-hoa-be-mat', 'cac-nhom-chat-nhu-hoa-thuc-pham'],
	'ma-ins-quy-dinh-an-toan': ['cac-nhom-chat-nhu-hoa-thuc-pham'],
	'ung-dung-theo-san-pham-va-quy-trinh-chon-chat-nhu-hoa': ['cac-nhom-chat-nhu-hoa-thuc-pham', 'protein-nhu-hoa-va-canh-tranh-hap-phu'],
};
