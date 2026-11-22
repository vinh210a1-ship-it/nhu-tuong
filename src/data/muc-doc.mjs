// Mức đọc nguồn (gói T4): bảng dùng chung cho huy hiệu N trong bài, thẻ ở trang Nguồn và các phép kiểm.
// Mã (khóa) trùng trường muc_doc của nguon/nguon.json; `csv` trùng từng chữ cột "Mức đọc" của nguon/nguon.csv.
// `vach` = số vạch đặc trong dấu 4 vạch đặt sau tên nguồn (4 = đã đọc hết, 0 = chưa đọc gì).
// Mức đọc chỉ nói NGƯỜI SOẠN đã đọc nguồn tới đâu, không nói nguồn đó tốt hay xấu.
export const MUC_DOC = {
	'toan-van': { csv: 'Đọc toàn văn', ten: 'đọc toàn văn', vach: 4 },
	'mot-phan': { csv: 'Đọc một phần / trang gốc', ten: 'đọc một phần hoặc trang gốc', vach: 3 },
	'tom-tat': { csv: 'Đọc tóm tắt', ten: 'đọc tóm tắt', vach: 2 },
	'tieu-de': { csv: 'Chỉ thấy tiêu đề', ten: 'chỉ thấy tiêu đề', vach: 1 },
	'tri-nho': { csv: 'Ghi từ trí nhớ, chưa kiểm', ten: 'ghi từ trí nhớ, chưa kiểm', vach: 0 },
};
// Nguồn không ghi mức đọc, hoặc ghi một mã lạ: xếp vào mức thấp nhất, không đoán.
export const CHUA_RO = 'chua-ro';
const MUC_CHUA_RO = { ten: 'chưa xác định mức đọc', vach: 0 };

export const mucCua = (ma) => (Object.hasOwn(MUC_DOC, ma) ? { ma, ...MUC_DOC[ma] } : { ma: CHUA_RO, ...MUC_CHUA_RO });

// Hình 4 vạch (không kèm liên kết): dùng trong bảng chú giải và thẻ trang Nguồn.
export const htmlVach = (ma) => {
	const m = mucCua(ma);
	return `<span class="muc-vach muc-vach-${m.vach}"><span class="muc-vach-hinh" aria-hidden="true"></span></span>`;
};

// Dấu mức đọc đặt ngay sau tên một nguồn: bấm vào thì tới dòng giải thích mức đó ở trang Cách đọc nhãn.
// data-pagefind-ignore: chữ "đọc tóm tắt" lặp cả nghìn lần, không cho vào chỉ mục tìm kiếm.
export const htmlMucDoc = (ma, base = '') => {
	const m = mucCua(ma);
	return (
		`<a class="muc-vach muc-vach-${m.vach}" data-muc="${m.ma}" href="${base}/quy-uoc/#muc-doc-${m.ma}" ` +
		`title="Mức đọc nguồn này: ${m.ten}. Bấm để xem nghĩa các mức." data-pagefind-ignore>` +
		`<span class="muc-vach-hinh" aria-hidden="true"></span><span class="muc-vach-chu">(${m.ten})</span></a>`
	);
};

// Lời giải nghĩa từng mức cho hộp bấm-ra-tại-chỗ (T4-4): lấy NGUYÊN VĂN từ danh sách có neo `muc-doc-<mã>` ở trang
// Cách đọc nhãn (src/content/docs/quy-uoc.md), để chỉ có MỘT nơi viết nghĩa của mức, không chép tay sang file JS.
// Trả về { mã: chữ thuần }; mã nào trang không có neo thì không có mục (hộp sẽ không mở, dấu vẫn là liên kết như cũ).
export const nghiaTuTrang = (md) => {
	const kq = {};
	for (const m of md.matchAll(/<li id="muc-doc-([a-z-]+)">([\s\S]*?)<\/li>/g)) {
		const chu = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
		if (chu) kq[m[1]] = chu;
	}
	return kq;
};

// Dữ liệu cho public/muc-doc.js (dấu mức đọc do JavaScript chèn sau liên kết nguồn trong máy tính, đồ thị, chẩn đoán, bàn lab).
// { muc: {mã: {ten, vach, nghia?}}, nguon: {khóa: mã} }: bảng mã lấy từ MUC_DOC ở đây, không chép tay sang file JS.
// `nghia` (có khi truyền nội dung trang quy-uoc.md vào `mdQuyUoc`) dùng cho hộp giải thích tại chỗ.
export const jsonMucDoc = (dsNguon, mdQuyUoc = '') => {
	const nghia = nghiaTuTrang(mdQuyUoc);
	const mot = (ma, m) => ({ ten: m.ten, vach: m.vach, ...(nghia[ma] ? { nghia: nghia[ma] } : {}) });
	return {
		muc: Object.fromEntries([...Object.entries(MUC_DOC).map(([ma, m]) => [ma, mot(ma, m)]), [CHUA_RO, mot(CHUA_RO, MUC_CHUA_RO)]]),
		nguon: Object.fromEntries(dsNguon.filter((e) => e.khoa).map((e) => [e.khoa, mucCua(e.muc_doc).ma])),
	};
};
