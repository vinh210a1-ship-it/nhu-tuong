// Dấu mức đọc (4 vạch) cho liên kết nguồn do JavaScript vẽ: máy tính, đồ thị, chẩn đoán, bàn phòng lab.
// Trang tĩnh đã có dấu từ lúc dựng (src/data/muc-doc.mjs); file này chỉ thêm dấu cho liên kết `/nguon/#khóa` chưa có dấu.
// Dữ liệu: public/muc-doc.json (sinh tự động từ nguon/nguon.json, gồm cả bảng mã). Tải hỏng thì trang vẫn chạy, chỉ thiếu dấu.
// Khóa không có trong dữ liệu: không đoán, không chèn dấu.
// T4-4: bấm vào dấu thì hiện hộp giải thích ngay tại chỗ (thuộc tính `popover`), không rời bài. Đường lui: trình duyệt
// không có `popover`, dữ liệu thiếu lời giải nghĩa, hoặc bấm kèm Ctrl/Cmd/Shift (mở tab mới) thì dấu vẫn là liên kết cũ.
const BASE = new URL('.', import.meta.url).pathname;

// Hộp giải thích dùng chung cho mọi dấu trong trang: tạo một lần, mở ở cạnh dấu vừa bấm.
function taoHop(d) {
	if (typeof HTMLElement.prototype.showPopover !== 'function') return null;
	const hop = document.createElement('div');
	hop.id = 'muc-doc-hop';
	hop.setAttribute('popover', 'auto');
	hop.setAttribute('role', 'dialog');
	hop.setAttribute('aria-label', 'Mức đọc nguồn');
	hop.tabIndex = -1;
	hop.dataset.pagefindIgnore = '';
	document.body.append(hop);
	let goc = null; // dấu đang mở hộp
	let vuaDong = { goc: null, luc: 0 };
	let taDong = false; // hộp do chính file này đóng (nút Đóng, bấm lần hai), khác với tự đóng khi bấm ra ngoài
	const dong = () => ((taDong = true), hop.hidePopover());
	const dat = () => {
		if (!goc || !hop.matches(':popover-open')) return;
		const r = goc.getBoundingClientRect();
		const rong = document.documentElement.clientWidth;
		const cao = window.innerHeight;
		const trai = Math.min(Math.max(8, r.left), Math.max(8, rong - hop.offsetWidth - 8));
		let tren = r.bottom + 6;
		if (tren + hop.offsetHeight > cao - 8 && r.top - hop.offsetHeight - 6 >= 8) tren = r.top - hop.offsetHeight - 6;
		hop.style.left = `${trai}px`;
		hop.style.top = `${Math.max(8, tren)}px`;
	};
	const mo = (a) => {
		const ma = a.dataset.muc;
		const m = d.muc[ma];
		goc = a;
		hop.replaceChildren();
		const chuNghia = document.createElement('p');
		chuNghia.className = 'mdh-nghia';
		const vach = document.createElement('span');
		vach.className = `muc-vach muc-vach-${m.vach}`;
		const hinh = document.createElement('span');
		hinh.className = 'muc-vach-hinh';
		hinh.setAttribute('aria-hidden', 'true');
		vach.append(hinh);
		chuNghia.append(vach, ' ', m.nghia);
		const duoi = document.createElement('p');
		duoi.className = 'mdh-duoi';
		const lk = document.createElement('a');
		lk.href = `${BASE}quy-uoc/#muc-doc-${ma}`;
		lk.textContent = 'Xem cả bảng các mức đọc';
		const dongNut = document.createElement('button');
		dongNut.type = 'button';
		dongNut.textContent = 'Đóng';
		dongNut.addEventListener('click', dong);
		duoi.append(lk, dongNut);
		hop.append(chuNghia, duoi);
		hop.showPopover();
		dat();
		hop.focus({ preventScroll: true });
	};
	hop.addEventListener('beforetoggle', (e) => {
		if (e.newState !== 'closed') return;
		if (!taDong) vuaDong = { goc, luc: performance.now() };
		taDong = false;
	});
	hop.addEventListener('toggle', (e) => {
		if (e.newState !== 'closed') return;
		const dang = document.activeElement;
		if (goc && (!dang || dang === document.body || hop.contains(dang))) goc.focus({ preventScroll: true });
		goc = null;
	});
	addEventListener('scroll', dat, { capture: true, passive: true });
	addEventListener('resize', dat);
	document.addEventListener('click', (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		const a = e.target instanceof Element ? e.target.closest('a.muc-vach[data-muc]') : null;
		if (!a || !d.muc[a.dataset.muc]?.nghia) return;
		e.preventDefault();
		if (hop.matches(':popover-open') && goc === a) return dong(); // bấm lần nữa (bàn phím) thì đóng
		if (e.detail > 0 && vuaDong.goc === a && performance.now() - vuaDong.luc < 300) return; // chuột: lần bấm này vừa làm hộp tự đóng (bàn phím có detail = 0)
		mo(a);
	});
	return hop;
}

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
	const hop = taoHop(d);
	const quet = () => {
		document.querySelectorAll('a[href*="/nguon/#"]').forEach(dau);
		if (hop) document.querySelectorAll('a.muc-vach[data-muc]:not([aria-haspopup])').forEach((a) => d.muc[a.dataset.muc]?.nghia && a.setAttribute('aria-haspopup', 'dialog'));
	};
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
