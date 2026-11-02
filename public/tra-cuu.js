// Trang Tra cứu: một ô tìm kiếm cho cả mã INS/E (thẻ .the-pg) lẫn từ điển Anh–Việt (dòng .td-hang).
// - Bỏ dấu tiếng Việt khi so ("nhu tuong" khớp "nhũ tương"); mọi từ trong ô tìm phải có mặt (không cần đúng thứ tự).
// - Nút phạm vi (Tất cả / Mã INS / Từ điển), nút lĩnh vực, nút nhóm phụ gia, nút xếp A–Z theo tiếng Anh hoặc Việt.
// - Nhớ từ khóa trên thanh địa chỉ (?q=...) để gửi liên kết cho người khác; #ins và #tu-dien mở thẳng đúng tab.
// Không có JavaScript thì trang vẫn đọc được: mọi mục đều đã nằm sẵn trong HTML.
const bo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

function khoiDong() {
	const o = document.getElementById('tk-q');
	if (!o || o.dataset.daDung) return;
	o.dataset.daDung = '1';
	const theIns = [...document.querySelectorAll('.the-pg')];
	const hangTu = [...document.querySelectorAll('.td-hang')];
	const dsTu = document.querySelector('.ds-td');
	const mucIns = document.querySelector('[data-tk-muc="ins"]');
	const mucTu = document.querySelector('[data-tk-muc="td"]');
	const dem = document.querySelector('[data-tk-dem]');
	const khong = document.querySelector('[data-tk-khong]');
	const nutTab = [...document.querySelectorAll('[data-tk-tab]')];
	const nutLv = [...document.querySelectorAll('[data-tk-lv]')];
	const nutNhom = [...document.querySelectorAll('[data-loc-nhom]')];
	const nutSx = [...document.querySelectorAll('[data-tk-sx]')];
	const ghiLv = [...document.querySelectorAll('.td-ghi-lv')];

	const chuIns = theIns.map((t) => bo(t.textContent));
	// từ điển: so theo đầu từ (không so giữa chữ) để "nhu" không khớp "nhung"; chữ cuối được phép gõ dở
	const noiDung = (t) => [...t.querySelectorAll('.td-en,.td-vi,.td-mo,.td-them,.td-lv')].map((x) => x.textContent).join(' ');
	const tu = (t) => ' ' + bo(noiDung(t)).replace(/[^a-z0-9α-ωβ]+/g, ' ') + ' ';
	const chuTu = hangTu.map(tu);
	const gocTu = hangTu.slice(); // thứ tự gốc = A–Z theo tiếng Anh
	let tab = '';
	let lv = '';
	let nhom = '';
	let sx = 'en';
	const trongTu = [...hangTu];

	const diem = (h, q, toks) => {
		// 0 trùng hẳn từ Anh hoặc Việt; 1 bắt đầu bằng; 2 mọi từ khóa nằm trong tên mục; 3 chỉ khớp ở phần giải thích
		const en = h.dataset.en, vi = h.dataset.vi;
		if (en === q || vi === q) return 0;
		if (en.startsWith(q) || vi.startsWith(q)) return 1;
		const dau = ' ' + (en + ' ' + vi).replace(/[^a-z0-9α-ωβ]+/g, ' ') + ' ';
		return toks.every((t, i) => dau.includes(' ' + t + (i < toks.length - 1 ? ' ' : ''))) ? 2 : 3;
	};

	const chay = () => {
		const q = bo(o.value.trim()).replace(/\s+/g, ' ');
		const toks = q ? q.split(' ') : [];
		const khop = (chu) => toks.every((t) => chu.includes(t)); // mã INS: khớp giữa chữ ("415" trong "E415")
		const khopTu = (chu) => toks.every((t, i) => chu.includes(' ' + t + (i < toks.length - 1 ? ' ' : '')));
		let nIns = 0, nTu = 0;
		const hienIns = tab === '' || tab === 'ins';
		const hienTu = tab === '' || tab === 'td';
		theIns.forEach((t, i) => {
			const hien = hienIns && (!nhom || t.dataset.nhom === nhom) && khop(chuIns[i]);
			t.hidden = !hien;
			if (hien) nIns++;
		});
		const dsHien = [];
		hangTu.forEach((h, i) => {
			const hien = hienTu && (!lv || h.dataset.linhVuc.split('|').includes(lv)) && khopTu(chuTu[i]);
			h.hidden = !hien;
			if (hien) { nTu++; dsHien.push(h); }
		});
		// xếp lại: có từ khóa thì mục khớp sát nhất lên đầu; không thì A–Z theo cột đã chọn
		let thuTu;
		if (q) thuTu = dsHien.map((h) => [diem(h, q, toks), gocTu.indexOf(h), h]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
		else if (sx === 'vi') thuTu = dsHien.slice().sort((a, b) => a.querySelector('.td-vi').textContent.localeCompare(b.querySelector('.td-vi').textContent, 'vi'));
		else thuTu = dsHien.slice().sort((a, b) => gocTu.indexOf(a) - gocTu.indexOf(b));
		thuTu.forEach((h) => dsTu.appendChild(h));
		if (mucIns) mucIns.hidden = !hienIns || (q !== '' && nIns === 0);
		if (mucTu) mucTu.hidden = !hienTu || (q !== '' && nTu === 0);
		ghiLv.forEach((p) => (p.hidden = !(lv && p.dataset.linhVuc === lv)));
		if (dem) {
			const p = [];
			if (hienIns) p.push(`${nIns} / ${theIns.length} phụ gia`);
			if (hienTu) p.push(`${nTu} / ${hangTu.length} thuật ngữ`);
			dem.textContent = 'Đang hiện ' + p.join(' và ');
		}
		if (khong) khong.hidden = nIns + nTu > 0;
		// nhớ từ khóa trên thanh địa chỉ
		try {
			const u = new URL(location.href);
			if (o.value.trim()) u.searchParams.set('q', o.value.trim()); else u.searchParams.delete('q');
			history.replaceState(null, '', u);
		} catch (_) { /* trình duyệt cũ: bỏ qua */ }
	};

	const nhanNut = (ds, giaTri, thuoc) => ds.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[thuoc] === giaTri)));
	const chonTab = (v) => { tab = v; nhanNut(nutTab, v, 'tkTab'); chay(); };
	nutTab.forEach((b) => b.addEventListener('click', () => chonTab(b.dataset.tkTab)));
	nutLv.forEach((b) => b.addEventListener('click', () => { lv = b.dataset.tkLv; nhanNut(nutLv, lv, 'tkLv'); chay(); }));
	nutNhom.forEach((b) => b.addEventListener('click', () => { nhom = b.dataset.locNhom; nhanNut(nutNhom, nhom, 'locNhom'); chay(); }));
	nutSx.forEach((b) => b.addEventListener('click', () => { sx = b.dataset.tkSx; nhanNut(nutSx, sx, 'tkSx'); chay(); }));
	document.querySelectorAll('[data-tk-di]').forEach((a) => a.addEventListener('click', () => chonTab(a.dataset.tkDi)));
	o.addEventListener('input', chay);

	const q0 = new URLSearchParams(location.search).get('q');
	if (q0) o.value = q0;
	if (location.hash === '#ins') chonTab('ins');
	else if (location.hash === '#tu-dien') chonTab('td');
	else chay();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
