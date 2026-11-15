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
