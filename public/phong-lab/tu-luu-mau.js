// TỦ LƯU MẪU: kho mẫu dùng chung cho mọi bàn trong phòng lab. Lưu trong trình duyệt (localStorage, khóa 'pl:tu-mau').
// Quy tắc: mẫu chỉ bị xóa khi người dùng bấm Xóa (hai bước). Không tự dọn, không giới hạn số mẫu.
// Mẫu = { id, luc, ten, ban (mã bàn gốc), tom (mô tả ngắn), goc (ảnh chụp trạng thái, chỉ bàn gốc đọc), tt: [{k, ten, v, dv, nhan}] }.
// Mang sang bàn khác: bàn nhận chỉ đọc những thuộc tính tt mà nó tính được, nói rõ phần chưa đọc được; không đoán số.
import { doHat, chuDai } from './may-do-hat.js';
import { THIET_BI } from './thiet-bi.js';

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
/* Số đo chung: người dùng ghi số họ đo được (như đọc từ máy pH, máy aw ngoài đời) vào mẫu. Mang nhãn G và cờ nhap.
   Đặt đầu danh sách để bàn nhận (dùng find) lấy số bạn nhập trước số bàn gốc tự tính. Xóa ô thì bỏ số đã nhập, số gốc còn nguyên. */
export const SO_DO = [
	{ k: 'pH', ten: 'pH', min: 0, max: 14, dv: '' },
	{ k: 'aw', ten: 'aw', min: 0.01, max: 1, dv: '' },
	{ k: 'muoi', ten: 'Muối', min: 0, max: 30, dv: 'g/100 g' },
];
export function datSoDo(id, k, chu) {
	const def = SO_DO.find((s) => s.k === k);
	const ds = docMau();
	const m = ds.find((x) => x.id === id);
	if (!m || !def) return { ok: false, ly: 'không tìm thấy mẫu.' };
	const s = String(chu ?? '').trim().replace(',', '.');
	m.tt = (m.tt ?? []).filter((t) => !(t.k === k && t.nhap));
	if (s !== '') {
		const v = Number(s);
		if (!Number.isFinite(v) || v < def.min || v > def.max) return { ok: false, ly: `${def.ten} phải nằm trong khoảng ${def.min} đến ${def.max}.` };
		m.tt.unshift({ k, ten: `${def.ten} (bạn nhập)`, v, dv: def.dv, nhan: 'G', nhap: true });
	}
	if (!ghi(ds)) return { ok: false, ly: 'bộ nhớ trình duyệt đầy hoặc bị chặn.' };
	phat();
	return { ok: true };
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
	const trangThai = { xacNhanXoa: null, tb: '', moSoDo: null, moDo: null }; // moDo: { id, may } mẫu đang mở hộp đo cỡ hạt
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
${soDo(m)}
${doHatHTML(m)}
<div class="pl-mau-nut"><button type="button" class="pl-nut" data-lay="${h(m.id)}">${cungBan ? 'Lấy ra ở bàn này' : `Mang sang bàn đang mở (${h(tenDang)})`}</button>
<button type="button" class="pl-link pl-xoa${xoa ? ' sap-xoa' : ''}" data-xoa="${h(m.id)}">${xoa ? 'Bấm lần nữa để xóa hẳn' : 'Xóa'}</button></div></li>`;
	}
	/** Hộp "Đo cỡ hạt" của một mẫu: dùng cùng doHat với bàn gốc. Chỉ hiện khi mẫu có d32 + σ hoặc đường kính TB theo thể tích. */
	function doHatHTML(m) {
		const lay = (k) => (m.tt ?? []).find((x) => x.k === k);
		const d32 = lay('d32')?.v;
		const sigma = lay('sigma')?.v;
		const dTT = lay('dTheTich')?.v;
		const coPhanBo = Number.isFinite(d32) && Number.isFinite(sigma);
		if (!coPhanBo && !Number.isFinite(dTT)) {
			const d43 = lay('d43')?.v;
			return Number.isFinite(d43) ? `<p class="pl-meo">Mẫu lưu trước bản cập nhật, chỉ có d₄₃ ≈ ${h(dinhDang(d43))} µm; lấy ra ở bàn gốc rồi lưu lại để đo đủ.</p>` : '';
		}
		const mo = trangThai.moDo?.id === m.id;
		const nut = `<button type="button" class="pl-link" data-do-hat="${h(m.id)}" aria-expanded="${mo}">🔬 Đo cỡ hạt</button>`;
		if (!mo) return `<div class="pl-do-hat">${nut}</div>`;
		const may = trangThai.moDo.may;
		const mau = coPhanBo ? { d32, sigma, nhan: lay('d32').nhan ?? 'T' } : { dTheTich: dTT, nhan: lay('dTheTich').nhan ?? 'N' };
		const dh = doHat(mau, may);
		const chon = ['nhieuXaLaser', 'dls'].map((id) => `<button type="button" class="pl-nut${may === id ? ' chon' : ''}" data-do-may="${id}" data-mau-do="${h(m.id)}" aria-pressed="${may === id}">${id === 'dls' ? 'DLS' : 'Nhiễu xạ laser'}</button>`).join('');
		const canh = dh.canhBao.map((w) => `<p class="${w.muc === 'vang' ? 'pl-canh-bao' : 'pl-canh-xam'}">${w.muc === 'vang' ? '⚠ ' : ''}${h(w.chu)}</p>`).join('');
		const so = dh.so.d32 != null
			? `<ul class="pl-mau-tt"><li><span>d₃₂</span> <b>${h(dinhDang(dh.so.d32))} µm</b></li><li><span>d₄₃</span> <b>${h(dinhDang(dh.so.d43))} µm</b></li><li><span>d₉₀</span> <b>${h(dinhDang(dh.so.dv90))} µm</b></li><li><span>span</span> <b>${h(dinhDang(dh.so.span))}</b></li></ul>`
			: dh.so.dTheTich != null
				? `<ul class="pl-mau-tt"><li><span>Đường kính TB theo thể tích</span> <b>${h(dinhDang(dh.so.dTheTich))} µm</b> <small>(không phải d₃₂)</small></li></ul>`
				: '';
		return `<div class="pl-do-hat mo">${nut}<div class="pl-chon-may" role="group" aria-label="Chọn máy đo">${chon}</div>
<p class="pl-meo"><b>${h(THIET_BI[may].ten)}</b> · dải máy ${chuDai(THIET_BI[may].daiMay)} · tin cậy ~${chuDai(THIET_BI[may].daiTinCay)}</p>${so}${canh}${dh.ghiChu.map((g) => `<p class="pl-meo">${h(g)}</p>`).join('')}</div>`;
	}
	function soDo(m) {
		const o = SO_DO.map((s) => {
			const cu = (m.tt ?? []).find((t) => t.k === s.k && t.nhap)?.v;
			return `<label>${h(s.ten)}${s.dv ? ` (${h(s.dv)})` : ''} <input type="text" inputmode="decimal" size="5" value="${cu ?? ''}" data-so-do="${s.k}" data-mau-so="${h(m.id)}" aria-label="${h(s.ten)} bạn đo cho mẫu ${h(m.ten)}"></label>`;
		}).join('');
		return `<details class="pl-so-do"${trangThai.moSoDo === m.id ? ' open' : ''}><summary>Số đo của bạn (pH, aw, muối)</summary><p class="pl-meo">Ghi số bạn đo được bằng máy ngoài đời. Bàn bảo quản đọc được các số này từ mọi bàn khác. Số bạn nhập mang nhãn G (do bạn cung cấp), phòng lab không tự đoán.</p><div class="pl-so-do-o">${o}</div></details>`;
	}
	function noi(t) {
		trangThai.tb = t;
		const e = vung.querySelector('.pl-tu-mau-tb');
		if (e) e.textContent = t;
	}
	vung.addEventListener('click', (ev) => {
		const doBtn = ev.target.closest('[data-do-hat]');
		if (doBtn) {
			const id = doBtn.dataset.doHat;
			trangThai.moDo = trangThai.moDo?.id === id ? null : { id, may: 'nhieuXaLaser' };
			ve();
			return;
		}
		const doMay = ev.target.closest('[data-do-may]');
		if (doMay) {
			trangThai.moDo = { id: doMay.dataset.mauDo, may: doMay.dataset.doMay };
			ve();
			return;
		}
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
		const sd = ev.target.closest('[data-so-do]');
		if (sd) {
			trangThai.moSoDo = sd.dataset.mauSo; // đặt trước để lần vẽ lại do lưu vẫn giữ ô đang mở
			const kq = datSoDo(sd.dataset.mauSo, sd.dataset.soDo, sd.value);
			if (!kq.ok) {
				noi(`Chưa ghi được: ${kq.ly}`);
				return;
			}
			trangThai.tb = 'Đã ghi số đo vào mẫu.';
			return;
		}
		const it = ev.target.closest('[data-doi-ten]');
		if (it) doiTenMau(it.dataset.doiTen, it.value);
	});
	document.addEventListener(SU_KIEN, ve);
	return { ve };
}
