// Dấu mức đọc (4 vạch) cho liên kết nguồn do JavaScript vẽ: máy tính, đồ thị, chẩn đoán, bàn phòng lab.
// Trang tĩnh đã có dấu từ lúc dựng (src/data/muc-doc.mjs); file này chỉ thêm dấu cho liên kết `/nguon/#khóa` chưa có dấu.
// Dữ liệu: public/muc-doc.json (sinh tự động từ nguon/nguon.json, gồm cả bảng mã). Tải hỏng thì trang vẫn chạy, chỉ thiếu dấu.
// Khóa không có trong dữ liệu: không đoán, không chèn dấu.
const BASE = new URL('.', import.meta.url).pathname;

async function chay() {
	let d;
	try {
		const r = await fetch(BASE + 'muc-doc.json');
		if (!r.ok) return;
		d = await r.json();
		if (!d?.muc || !d?.nguon) return;
	} catch {
		return;
	}
	const dau = (a) => {
		if (a.dataset.mucDoc !== undefined) return;
		const khoa = decodeURIComponent((a.getAttribute('href') || '').split('/nguon/#')[1] || '');
		const ma = Object.hasOwn(d.nguon, khoa) ? d.nguon[khoa] : null;
		const m = ma && Object.hasOwn(d.muc, ma) ? d.muc[ma] : null;
		if (!m) return;
		a.dataset.mucDoc = ma;
		if (a.nextElementSibling?.classList.contains('muc-vach')) return;
		const v = document.createElement('a');
		v.className = `muc-vach muc-vach-${m.vach}`;
		v.dataset.muc = ma;
		v.dataset.pagefindIgnore = '';
		v.href = `${BASE}quy-uoc/#muc-doc-${ma}`;
		v.title = `Mức đọc nguồn này: ${m.ten}. Bấm để xem nghĩa các mức.`;
		const hinh = document.createElement('span');
		hinh.className = 'muc-vach-hinh';
		hinh.setAttribute('aria-hidden', 'true');
		const chu = document.createElement('span');
		chu.className = 'muc-vach-chu';
		chu.textContent = `(${m.ten})`;
		v.append(hinh, chu);
		a.after(v);
	};
	const quet = () => document.querySelectorAll('a[href*="/nguon/#"]').forEach(dau);
	quet();
	// máy tính, đồ thị và bàn lab vẽ lại phần của mình khi người dùng bấm: gom các lần vẽ lại thành một lượt quét
	let cho = false;
	new MutationObserver(() => {
		if (cho) return;
		cho = true;
		requestAnimationFrame(() => ((cho = false), quet()));
	}).observe(document.body, { childList: true, subtree: true });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
else chay();
