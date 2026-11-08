// TỦ LƯU MẪU: kho mẫu dùng chung cho mọi bàn trong phòng lab. Lưu trong trình duyệt (localStorage, khóa 'pl:tu-mau').
// Quy tắc: mẫu chỉ bị xóa khi người dùng bấm Xóa (hai bước). Không tự dọn, không giới hạn số mẫu.
// Mẫu = { id, luc, ten, ban (mã bàn gốc), tom (mô tả ngắn), goc (ảnh chụp trạng thái, chỉ bàn gốc đọc), tt: [{k, ten, v, dv, nhan}] }.
// Mang sang bàn khác: bàn nhận chỉ đọc những thuộc tính tt mà nó tính được, nói rõ phần chưa đọc được; không đoán số.
const KHOA = 'pl:tu-mau';
const SU_KIEN = 'pl-tu-mau-doi';
const BAN_HOP_LE = new Set();
const dangKy = new Map(); // mã bàn -> { ten, nhan(mau) → {ok, ly?, ghiChu?[]} }
const TEN_SAN = {}; // tên hiển thị do trang đặt (mã bàn/chế độ -> tên)
export const datTenBan = (o) => Object.assign(TEN_SAN, o);

const h = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function docMau() {
	try {
		const v = JSON.parse(localStorage.getItem(KHOA) || '[]');
		return Array.isArray(v) ? v.filter((m) => m && typeof m.id === 'string') : [];
	} catch {
		return [];
	}
}
function ghi(ds) {
	try {
		localStorage.setItem(KHOA, JSON.stringify(ds));
		return true;
	} catch {
		return false; // bộ nhớ đầy hoặc bị chặn
	}
}
const phat = () => document.dispatchEvent(new CustomEvent(SU_KIEN));

export function luuMau({ ban, tom, goc, tt, ten }) {
	const ds = docMau();
	const mau = {
		id: `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
		luc: Date.now(),
		ten: ten || `${tenBan(ban)} · ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
		ban,
		tom: String(tom ?? '').slice(0, 300),
		goc,
		tt: Array.isArray(tt) ? tt : [],
	};
	ds.unshift(mau);
	if (!ghi(ds)) return { ok: false, ly: 'Bộ nhớ trình duyệt đầy hoặc bị chặn, nên chưa lưu được mẫu. Mẫu cũ vẫn còn nguyên; hãy xóa bớt mẫu không cần rồi lưu lại.' };
	phat();
	return { ok: true, mau };
}
export function xoaMau(id) {
	const ds = docMau().filter((m) => m.id !== id);
	const ok = ghi(ds);
	if (ok) phat();
	return ok;
}
export function doiTenMau(id, ten) {
	const ds = docMau();
	const m = ds.find((x) => x.id === id);
	if (!m) return false;
	m.ten = String(ten).trim().slice(0, 60) || m.ten;
	const ok = ghi(ds);
	if (ok) phat();
	return ok;
}
export const dangKyBan = (id, ten, nhan) => {
	dangKy.set(id, { ten, nhan });
	BAN_HOP_LE.add(id);
};
export const tenBan = (id) => TEN_SAN[id] ?? dangKy.get(id)?.ten ?? id;

const dinhDang = (x) => (typeof x === 'number' ? x.toLocaleString('vi-VN', { maximumSignificantDigits: 4 }) : String(x));
const NHAN_CHU = { N: 'Có nguồn', T: 'Tính minh họa', K: 'Sách nền, chờ đối chiếu trang', G: 'Suy luận hoặc giả thuyết' };

/** Dựng bảng Tủ lưu mẫu vào phần tử vung. banDangMo() trả về mã bàn đang mở. */
export function ganTuMau(vung, { banDangMo, tenBanDe }) {
	const trangThai = { xacNhanXoa: null, tb: '' };
	let hetGio = null;
	function ve() {
		const ds = docMau();
		const dang = banDangMo();
		const tenDang = tenBanDe(dang);
		vung.innerHTML = `<h2 class="pl-h">🗄️ Tủ lưu mẫu</h2>
<p class="pl-meo">Mẫu lưu ở đây dùng chung cho mọi bàn và <b>chỉ mất khi bạn bấm Xóa</b> (hoặc xóa dữ liệu trình duyệt). Bấm <b>Lưu mẫu</b> ở bàn đang làm, rồi sang bàn khác và bấm <b>Mang sang bàn đang mở</b>. Bàn nhận chỉ đọc phần nó tính được và nói rõ phần chưa đọc được.</p>
<p class="pl-tu-mau-tb" role="status" aria-live="polite">${h(trangThai.tb)}</p>
${ds.length ? `<ul class="pl-ds-mau">${ds.map((m) => hang(m, dang, tenDang)).join('')}</ul>` : '<p class="pl-meo">Tủ trống. Làm một mẫu ở bất kỳ bàn nào rồi bấm “Lưu mẫu vào tủ”.</p>'}`;
	}
	function hang(m, dang, tenDang) {
		const cungBan = m.ban === dang;
		const tt = (m.tt ?? []).map((t) => `<li><span>${h(t.ten)}</span> <b>${h(dinhDang(t.v))}${t.dv ? ' ' + h(t.dv) : ''}</b> ${t.nhan ? `<span class="nhan nhan-${h(t.nhan)}" title="${h(NHAN_CHU[t.nhan] ?? '')}">${h(t.nhan)}</span>` : ''}</li>`).join('');
		const xoa = trangThai.xacNhanXoa === m.id;
		return `<li class="pl-mau" data-mau="${h(m.id)}">
<div class="pl-mau-dau"><input class="pl-mau-ten" value="${h(m.ten)}" maxlength="60" aria-label="Tên mẫu" data-doi-ten="${h(m.id)}"><span class="pl-mau-ban">${h(tenBanDe(m.ban))}</span><small>${h(new Date(m.luc).toLocaleString('vi-VN'))}</small></div>
<p class="pl-mau-tom">${h(m.tom)}</p>
${tt ? `<ul class="pl-mau-tt">${tt}</ul>` : '<p class="pl-meo">Mẫu này chưa có thuộc tính chung để mang sang bàn khác; chỉ mở lại được ở bàn gốc.</p>'}
<div class="pl-mau-nut"><button type="button" class="pl-nut" data-lay="${h(m.id)}">${cungBan ? 'Lấy ra ở bàn này' : `Mang sang bàn đang mở (${h(tenDang)})`}</button>
<button type="button" class="pl-link pl-xoa${xoa ? ' sap-xoa' : ''}" data-xoa="${h(m.id)}">${xoa ? 'Bấm lần nữa để xóa hẳn' : 'Xóa'}</button></div></li>`;
	}
	function noi(t) {
		trangThai.tb = t;
		const e = vung.querySelector('.pl-tu-mau-tb');
		if (e) e.textContent = t;
	}
	vung.addEventListener('click', (ev) => {
		const lay = ev.target.closest('[data-lay]');
		if (lay) {
			const m = docMau().find((x) => x.id === lay.dataset.lay);
			const dang = banDangMo();
			const nhan = dangKy.get(dang)?.nhan;
			if (!m || !nhan) return noi('Bàn này chưa sẵn sàng nhận mẫu. Mở bàn lên rồi thử lại.');
			const kq = nhan(m);
			noi(kq.ok ? `Đã mang “${m.ten}” sang ${tenBanDe(dang)}.${(kq.ghiChu ?? []).length ? ' ' + kq.ghiChu.join(' ') : ''}` : `${tenBanDe(dang)} chưa nhận được mẫu này: ${kq.ly ?? 'không đọc được.'}`);
			return;
		}
		const xoa = ev.target.closest('[data-xoa]');
		if (xoa) {
			const id = xoa.dataset.xoa;
			if (trangThai.xacNhanXoa === id) {
				trangThai.xacNhanXoa = null;
				clearTimeout(hetGio);
				xoaMau(id);
				trangThai.tb = 'Đã xóa mẫu.';
			} else {
				trangThai.xacNhanXoa = id;
				clearTimeout(hetGio);
				hetGio = setTimeout(() => {
					trangThai.xacNhanXoa = null;
					ve();
				}, 5000);
				ve();
			}
		}
	});
	vung.addEventListener('change', (ev) => {
		const it = ev.target.closest('[data-doi-ten]');
		if (it) doiTenMau(it.dataset.doiTen, it.value);
	});
	document.addEventListener(SU_KIEN, ve);
	return { ve };
}
