// Khu Chất ổn định: hộp "Thử ngay" và "Cần biết trước". Quy tắc ở đầu src/data/cong-cu-bai.mjs.
// Bài không có công cụ thật sự liên quan thì không có hộp "Thử ngay".

export const CONG_CU_CHAT_ON_DINH = {
	'co-che-nen-tang': [
		{ loai: 'may-tinh', id: 'stokes', ten: 'Vận tốc kem hóa (Stokes)', vi: 'Đổi độ nhớt pha liên tục để thấy vì sao tăng độ nhớt làm kem hóa chậm lại.' },
		{ loai: 'lab', id: 'sot-salad', ten: 'Nhiệm vụ "Sốt salad đứng yên"', vi: 'Thử thêm chất làm đặc ở các mức khác nhau và xem ống nghiệm tua nhanh để thấy kem hóa bị chặn hay không.' },
	],
	'xanthan-va-galactomannan': [
		{ loai: 'lab', id: 'sot-salad', ten: 'Nhiệm vụ "Sốt salad đứng yên"', vi: 'Thử đổi chất nhũ hóa và thêm chất làm đặc xem cách nào giữ sốt đứng yên.' },
	],
	'gum-arabic-gelatin-tinh-bot-cellulose': [
		{ loai: 'ban', id: 'pickering', ten: 'Bàn Pickering', vi: 'So các loại hạt và tập đọc số góc tiếp xúc kèm cách đo.' },
	],
	'quy-dinh-ins-e': [
		{ loai: 'tra-cuu', id: 'ins', ten: 'Tra mã INS/E', vi: 'Đối chiếu mã INS với tên và chức năng của chất.' },
		{ loai: 'tra-cuu', id: 'tt24', ten: 'Tra cứu mức tối đa (TT24/2019)', vi: 'Tra một chất theo mã INS hoặc theo nhóm thực phẩm để thấy mức tối đa được phép.' },
	],
};

// Mặc định "Cần biết trước" là bài ngay trước trong khu; chỗ nào cần khác thì ghi đè. 'slug' = cùng khu, 'khu/slug' = khu khác.
export const CAN_BIET_CHAT_ON_DINH = {
	'co-che-nen-tang': ['nhu-tuong/mat-on-dinh'],
	'carrageenan-va-he-sua': ['co-che-nen-tang'],
	'alginate-pectin-gellan': ['co-che-nen-tang'],
	'gum-arabic-gelatin-tinh-bot-cellulose': ['co-che-nen-tang'],
	'quy-dinh-ins-e': ['chat-nhu-hoa/ma-ins-quy-dinh-an-toan'],
};
