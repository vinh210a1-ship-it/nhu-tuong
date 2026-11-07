// Hộp "Thử ngay" ở cuối mỗi bài khu Nhũ tương: bài nào ghép với công cụ nào.
// "Máy in" (scripts/chuan-bi-noi-dung.mjs) đặt hộp ngay TRƯỚC hộp "Đọc xong bài này?".
// Quy tắc (máy in và scripts/kiem-sau-build.mjs đều kiểm): mỗi bài tối đa 3 dòng; mỗi dòng có một câu "vì sao nên thử";
// mô tả chỉ nói công cụ làm gì, không đưa số liệu khoa học.
//
// Mỗi dòng: { loai, id?, ten, vi }
//   loai 'may-tinh' : id = mã máy trên trang Máy tính (data-may-tinh), liên kết tới /may-tinh/#mt-<id>
//   loai 'lab'      : id = mã nhiệm vụ trong NHIEM_VU (public/phong-lab/mo-hinh.js) hoặc 'tu-do' (phòng lab tự do),
//                     liên kết tới /phong-lab/#nv-<id>; không có id thì mở /phong-lab/
//   loai 'ban'      : id = 'kep' | 'pickering' | 'mayo'; liên kết tới /phong-lab/#ban-<id>
//   loai 'so-tay'   : /phong-lab/#so-tay (Sổ tay thí nghiệm)
//   loai 'tra-cuu'  : id = 'ins' | 'tt24'; liên kết tới /tra-cuu/#<id>
//   loai 'chan-doan': /chan-doan/

export const NHAN_LOAI = { 'may-tinh': 'Máy tính', lab: 'Phòng lab', ban: 'Phòng lab', 'so-tay': 'Phòng lab', 'tra-cuu': 'Tra cứu', 'chan-doan': 'Chẩn đoán' };

export const CONG_CU_BAI = {
	'nen-tang': [
		{ loai: 'may-tinh', id: 'laplace', ten: 'Áp suất Laplace', vi: 'Nhập bán kính giọt và sức căng bề mặt để thấy vì sao giọt càng nhỏ càng khó bẻ tiếp.' },
		{ loai: 'may-tinh', id: 'chat-nhu-hoa-toi-thieu', ten: 'Chất nhũ hóa tối thiểu', vi: 'Đổi kích thước giọt để thấy lượng chất nhũ hóa cần phủ tăng thế nào khi giọt nhỏ đi.' },
		{ loai: 'lab', id: 'sua-thuc-vat', ten: 'Nhiệm vụ "Sữa hạt không tách lớp"', vi: 'Tự làm một mẻ sữa hạt: chọn chất nhũ hóa và đồng hóa rồi xem giọt có đủ nhỏ để không tách lớp không.' },
	],
	'hinh-thanh': [
		{ loai: 'may-tinh', id: 'chat-nhu-hoa-toi-thieu', ten: 'Chất nhũ hóa tối thiểu', vi: 'Đặt kích thước giọt mục tiêu và xem cần tối thiểu bao nhiêu chất nhũ hóa để phủ hết bề mặt, trước khi nghĩ đến chọn máy.' },
		{ loai: 'lab', id: 'whey-nong', ten: 'Nhiệm vụ "Đồ uống whey giàu đạm"', vi: 'Tìm mức đồng hóa đủ mạnh để giọt nhỏ mà protein không bị biến tính.' },
	],
	'mat-on-dinh': [
		{ loai: 'may-tinh', id: 'stokes', ten: 'Vận tốc kem hóa (Stokes)', vi: 'Đổi kích thước giọt và độ nhớt để thấy vì sao kem hóa do giọt lớn chi phối.' },
		{ loai: 'may-tinh', id: 'debye', ten: 'Lực ion và độ dài Debye', vi: 'Thêm muối và xem tầm đẩy tĩnh điện bị che chắn đến đâu.' },
		{ loai: 'lab', id: 'sot-salad', ten: 'Nhiệm vụ "Sốt salad đứng yên"', vi: 'Thử từng cách chặn kem hóa rồi xem ống nghiệm tua nhanh để thấy kết quả sau nhiều ngày.' },
	],
	'chat-on-dinh': [
		{ loai: 'may-tinh', id: 'hlb', ten: 'Trộn hai chất nhũ hóa theo HLB', vi: 'Phối hai chất để đạt HLB mục tiêu rồi đối chiếu với điều bạn vừa đọc về giới hạn của HLB.' },
		{ loai: 'lab', id: 'sot-salad', ten: 'Nhiệm vụ "Sốt salad đứng yên"', vi: 'Thử đổi chất nhũ hóa và thêm chất làm đặc xem cách nào giữ sốt đứng yên.' },
		{ loai: 'lab', id: 'omega-3', ten: 'Nhiệm vụ "Sữa omega-3 không ôi"', vi: 'Bài toán vừa chống tách lớp vừa chống ôi dầu: buộc bạn chọn cả chất nhũ hóa lẫn chất chống oxy hóa.' },
	],
	'he-dac-biet': [
		{ loai: 'may-tinh', id: 'pickering', ten: 'Năng lượng giải hấp hạt Pickering', vi: 'Đổi góc tiếp xúc và kích thước hạt để thấy hạt rắn bám giọt chặt hơn chất nhũ hóa phân tử thế nào.' },
		{ loai: 'ban', id: 'kep', ten: 'Bàn nhũ tương kép', vi: 'Chọn PGPR và tỉ lệ giọt trong rồi xem công thức rơi vào miền nào trên bản đồ ổn định.' },
		{ loai: 'ban', id: 'pickering', ten: 'Bàn Pickering', vi: 'So các loại hạt và tập đọc số góc tiếp xúc kèm cách đo.' },
	],
	'do-luong': [
		{ loai: 'may-tinh', id: 'stokes', ten: 'Vận tốc kem hóa (Stokes)', vi: 'Từ kích thước giọt đo được, ước tính tốc độ kem hóa để biết số đo có báo trước sự tách lớp không.' },
		{ loai: 'may-tinh', id: 'ostwald', ten: 'Ostwald ripening', vi: 'Nhập kích thước giọt theo thời gian để kiểm xem d³ có tăng thẳng theo thời gian, tức có phải ripening không.' },
		{ loai: 'so-tay', ten: 'Sổ tay thí nghiệm trong Phòng lab', vi: 'Chạy vài mẻ rồi so kích thước giọt, chỉ số kem hóa và peroxide giữa các mẻ để tập đọc kết quả đo.' },
	],
	'san-pham': [
		{ loai: 'tra-cuu', id: 'tt24', ten: 'Tra cứu mã INS và mức tối đa (TT24/2019)', vi: 'Kiểm phụ gia bạn định dùng trong sản phẩm có được phép và ở mức nào.' },
		{ loai: 'lab', ten: 'Bàn nhũ tương: bốn nhiệm vụ sản phẩm', vi: 'Sữa hạt, đồ uống whey, sốt salad, sữa omega-3: mỗi nhiệm vụ là một sản phẩm với ràng buộc riêng.' },
		{ loai: 'ban', id: 'mayo', ten: 'Bàn mayonnaise', vi: 'Thử đổ dầu nhanh và chậm, rồi so mẻ của bạn với bảng đo theo hàm lượng dầu.' },
	],
	'su-co-thiet-ke': [
		{ loai: 'chan-doan', ten: 'Cây chẩn đoán sự cố', vi: 'Chọn triệu chứng của mẫu hỏng và đi theo cây quyết định để biết nên kiểm gì trước.' },
		{ loai: 'lab', id: 'tu-do', ten: 'Phòng lab tự do và Sổ tay thí nghiệm', vi: 'Gây ra một sự cố (tách lớp, ôi dầu) rồi dùng Sổ tay để dò nguyên nhân.' },
	],
};

/** Liên kết tương đối từ trang bài (nằm ở /<khu>/<slug>/) tới công cụ. */
export function hrefCongCu(d) {
	if (d.loai === 'may-tinh') return `../../may-tinh/#mt-${d.id}`;
	if (d.loai === 'lab') return d.id ? `../../phong-lab/#nv-${d.id}` : '../../phong-lab/';
	if (d.loai === 'ban') return `../../phong-lab/#ban-${d.id}`;
	if (d.loai === 'so-tay') return '../../phong-lab/#so-tay';
	if (d.loai === 'tra-cuu') return `../../tra-cuu/#${d.id}`;
	if (d.loai === 'chan-doan') return '../../chan-doan/';
	throw new Error(`cong-cu-bai: loại lạ "${d.loai}"`);
}

/** Dựng HTML hộp "Thử ngay" (một khối HTML liền, không dòng trống, để Markdown không cắt đôi). */
export function htmlThuNgay(slug) {
	const ds = CONG_CU_BAI[slug];
	if (!ds) return '';
	if (ds.length > 3) throw new Error(`cong-cu-bai: bài "${slug}" có ${ds.length} dòng, tối đa 3`);
	const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	const li = ds.map((d) => {
		if (!d.vi || !d.ten) throw new Error(`cong-cu-bai: bài "${slug}" có dòng thiếu tên hoặc câu "vì sao nên thử"`);
		return `<li><span class="tn-loai">${NHAN_LOAI[d.loai]}</span><a class="tn-ten" href="${hrefCongCu(d)}">${esc(d.ten)}</a><span class="tn-vi">${esc(d.vi)}</span></li>`;
	});
	return `<div class="thu-ngay not-content" data-thu-ngay="${slug}"><b class="tn-tieu-de">Thử ngay</b><ul class="tn-ds">${li.join('')}</ul></div>`;
}

// ---------------------------------------------------------------------------------------------
// Gói 6: nhãn mức độ và "Cần biết trước" (hai dòng ở đầu bài, hiện cạnh dòng "Cập nhật").
// Trục chính vẫn là 6 chặng; mức độ chỉ là nhãn phụ lấy từ trường `level` trong front-matter của bài gốc.
// Quyết định (vinh giao tự quyết, 2026-11-04): 1-nen-tang và 2-co-che đều là "Nền tảng", vì cơ chế (Hình thành, Mất ổn định)
// là nền cho mọi chặng sau; 3-ung-dung-co-che là "Chuyên sâu"; 4-thuc-hanh là "R&D".
// ---------------------------------------------------------------------------------------------
import { CHANG, MO_RONG } from './chang.mjs';

export const MUC_DO = {
	'1-nen-tang': ['nen-tang', 'Nền tảng'],
	'2-co-che': ['nen-tang', 'Nền tảng'],
	'3-ung-dung-co-che': ['chuyen-sau', 'Chuyên sâu'],
	'4-thuc-hanh': ['rnd', 'R&D'],
};

export function htmlMucDo(level) {
	const m = MUC_DO[level];
	if (!m) throw new Error(`cong-cu-bai: trường level "${level}" chưa có trong MUC_DO`);
	return `<span class="muc-do muc-do-${m[0]}" title="Nhãn mức độ phụ; trục chính của khu là 6 chặng">Mức: ${m[1]}</span>`;
}

// "Cần biết trước": mặc định là chặng ngay trước; chỗ nào cần khác thì ghi đè ở đây. Chặng 1 không có mục này.
const CAN_BIET_TRUOC = {
	'mat-on-dinh': ['nen-tang'],
	'chat-on-dinh': ['nen-tang', 'mat-on-dinh'],
	'do-luong': ['nen-tang', 'mat-on-dinh'],
	'san-pham': ['mat-on-dinh', 'chat-on-dinh'],
	'he-dac-biet': ['nen-tang', 'mat-on-dinh', 'chat-on-dinh'],
	'su-co-thiet-ke': ['mat-on-dinh', 'chat-on-dinh', 'do-luong'],
};

export function canBietTruoc(slug) {
	if (CAN_BIET_TRUOC[slug]) return CAN_BIET_TRUOC[slug];
	const i = CHANG.findIndex((c) => c.slug === slug);
	if (i < 0) throw new Error(`cong-cu-bai: bài "${slug}" không có trong CHANG/MO_RONG và không có mục ghi đè CAN_BIET_TRUOC`);
	return i === 0 ? [] : [CHANG[i - 1].slug];
}

export function htmlCanBietTruoc(slug) {
	const ds = canBietTruoc(slug);
	if (!ds.length) return '';
	const ten = (s) => {
		const c = CHANG.find((x) => x.slug === s);
		if (c) return `Chặng ${c.so} · ${c.ten}`;
		const m = MO_RONG.find((x) => x.slug === s);
		if (m) return m.ten;
		throw new Error(`cong-cu-bai: "Cần biết trước" trỏ tới bài lạ "${s}"`);
	};
	return `<p class="can-biet-truoc"><b>Cần biết trước:</b> ${ds.map((s) => `<a href="../${s}/">${ten(s)}</a>`).join(' · ')}</p>`;
}
