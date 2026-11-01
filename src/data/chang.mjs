// Sáu chặng đọc của khu nhũ tương + hai bài mở rộng. Dùng cho trang chủ (bản đồ lộ trình) và dải chặng đầu bài.
// cauHoi lấy từ trang lộ trình (trang/nhu-tuong.md).
export const CHANG = [
	{ so: 1, slug: 'nen-tang', ten: 'Nền tảng', cauHoi: 'Nhũ tương là gì, vì sao luôn "muốn" tách, cần bao nhiêu chất nhũ hóa', bieuTuong: 'giot' },
	{ so: 2, slug: 'hinh-thanh', ten: 'Hình thành', cauHoi: 'Giọt vỡ ra thế nào trong máy đồng hóa, chọn thiết bị và điều kiện, scale-up', bieuTuong: 'vo-giot' },
	{ so: 3, slug: 'mat-on-dinh', ten: 'Mất ổn định', cauHoi: 'Kem hóa, keo tụ, hợp giọt, Ostwald, đảo pha, oxy hóa: cơ chế và dấu hiệu', bieuTuong: 'tach-lop' },
	{ so: 4, slug: 'chat-on-dinh', ten: 'Ổn định', cauHoi: 'Mỗi cơ chế hỏng thì chặn bằng công cụ nào', bieuTuong: 'mang' },
	{ so: 5, slug: 'do-luong', ten: 'Đo lường', cauHoi: 'Đo kích thước giọt, zeta, lưu biến, độ ổn định; đọc kết quả cho đúng', bieuTuong: 'phan-bo' },
	{ so: 6, slug: 'san-pham', ten: 'Sản phẩm', cauHoi: 'Sữa, kem, kem lạnh, mayonnaise, bơ, đồ uống, sữa thực vật', bieuTuong: 'chai' },
];
export const MO_RONG = [
	{ slug: 'he-dac-biet', ten: 'Chuyên sâu: hệ đặc biệt', cauHoi: 'Nano, Pickering, nhũ tương kép, HIPE, W/O, emulgel' },
	{ slug: 'su-co-thiet-ke', ten: 'Thực hành: xử lý sự cố', cauHoi: 'Bảng chẩn đoán, sơ đồ quyết định, phiếu thí nghiệm' },
];
