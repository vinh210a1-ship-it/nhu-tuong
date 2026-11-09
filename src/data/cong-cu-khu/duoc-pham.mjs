// Khu Dược phẩm: hộp "Thử ngay" và "Cần biết trước". Quy tắc ở đầu src/data/cong-cu-bai.mjs.
// Bài không có công cụ thật sự liên quan thì không có hộp "Thử ngay".

export const CONG_CU_DUOC_PHAM = {
	'ta-duoc-chuc-nang-va-tuong-ky': [
		{ loai: 'ta-duoc', ten: 'Tra cứu tá dược (FDA IID)', vi: 'Tra một tá dược theo đường dùng và dạng bào chế để thấy nó đã được dùng ở đâu và với lượng tối đa nào.' },
	],
	'hoa-tan-sinh-kha-dung-bcs': [
		{ loai: 'may-tinh', id: 'axit-yeu', ten: 'Phần chất axit yếu chưa phân ly', vi: 'Nhập pH và pKa để thấy phần không phân ly đổi theo pH, nền của độ tan phụ thuộc pH.' },
	],
	'dang-ran-vien-nen-tao-hat': [
		{ loai: 'ta-duoc', ten: 'Tra cứu tá dược (FDA IID)', vi: 'Tra mức tá dược đã có trong thuốc được duyệt, ví dụ magnesi stearat trong viên nén.' },
	],
	'dang-bao-che-long-va-ban-ran': [
		{ loai: 'may-tinh', id: 'stokes', ten: 'Vận tốc kem hóa (Stokes)', vi: 'Đổi cỡ giọt và độ nhớt để thấy vì sao hỗn dịch và nhũ tương lắng hay kem hóa nhanh chậm khác nhau.' },
		{ loai: 'may-tinh', id: 'hlb', ten: 'Trộn hai chất nhũ hóa theo HLB', vi: 'Phối hai chất nhũ hóa để đạt HLB mục tiêu, như cách chọn cặp Tween và Span ở bài.' },
	],
	'he-phan-tan-nano': [
		{ loai: 'may-tinh', id: 'ostwald', ten: 'Ostwald ripening', vi: 'Nhập kích thước giọt theo thời gian để kiểm xem d³ có tăng thẳng theo thời gian, tức có phải ripening không.' },
		{ loai: 'may-tinh', id: 'laplace', ten: 'Áp suất Laplace', vi: 'Nhập bán kính giọt và sức căng bề mặt để thấy vì sao giọt càng nhỏ càng chịu áp suất lớn.' },
	],
	'on-dinh-han-dung-ich': [
		{ loai: 'may-tinh', id: 'arrhenius', ten: 'Hạn dùng theo nhiệt độ (Arrhenius)', vi: 'Nhập các điểm đo ở nhiều nhiệt độ để thấy ngoại suy Arrhenius hoạt động ra sao, và vì sao nó chỉ là công cụ tiên đoán.' },
		{ loai: 'may-tinh', id: 'q10', ten: 'Quy đổi thời gian theo Q10', vi: 'Quy đổi thời gian giữa hai nhiệt độ bảo quản để có ước lượng thô cho kế hoạch thử.' },
	],
};

// Mặc định "Cần biết trước" là bài ngay trước trong khu; chỗ nào cần khác thì ghi đè. 'slug' = cùng khu, 'khu/slug' = khu khác.
export const CAN_BIET_DUOC_PHAM = {
	'dang-bao-che-long-va-ban-ran': ['nhu-tuong/mat-on-dinh', 'chat-nhu-hoa/nen-tang-vat-ly-hoa-be-mat'],
	'he-phan-tan-nano': ['hoa-tan-sinh-kha-dung-bcs', 'dang-bao-che-long-va-ban-ran'],
	'dang-ran-vien-nen-tao-hat': ['ta-duoc-chuc-nang-va-tuong-ky'],
	'on-dinh-han-dung-ich': ['ta-duoc-chuc-nang-va-tuong-ky'],
	'qbd-scale-up-quy-trinh': ['dang-ran-vien-nen-tao-hat', 'on-dinh-han-dung-ich'],
};
