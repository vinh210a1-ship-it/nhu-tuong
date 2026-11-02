// Trang "Tra cứu tá dược (FDA IID)": tìm tá dược theo tên hoặc số CAS, lọc theo đường dùng.
// Dữ liệu public/du-lieu/fda-iid.json (gói từ tệp IIR_OCOMM.xlsx của FDA bằng cong-cu/fda-iid/dong_goi_iid.py) nạp khi mở trang.
const BASE = new URL('.', import.meta.url).pathname;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// tên đường dùng tiếng Việt cho các đường hay gặp; còn lại giữ nguyên tiếng Anh
const DUONG = {
	ORAL: 'Uống', TOPICAL: 'Dùng ngoài da', INTRAVENOUS: 'Tiêm tĩnh mạch', OPHTHALMIC: 'Nhỏ mắt', INTRAMUSCULAR: 'Tiêm bắp',
	SUBCUTANEOUS: 'Tiêm dưới da', VAGINAL: 'Đặt âm đạo', TRANSDERMAL: 'Qua da (miếng dán)', BUCCAL: 'Niêm mạc má', NASAL: 'Nhỏ, xịt mũi',
	SUBLINGUAL: 'Ngậm dưới lưỡi', RECTAL: 'Đặt trực tràng', 'RESPIRATORY (INHALATION)': 'Hít', DENTAL: 'Nha khoa', 'AURICULAR (OTIC)': 'Nhỏ tai',
};
const tenDuong = (d) => (DUONG[d] ? `${DUONG[d]} <small>${esc(d)}</small>` : esc(d));
const so = (x) => (typeof x === 'number' ? x.toLocaleString('vi-VN', { maximumSignificantDigits: 6 }) : esc(x));
const ham = (x, dv) => (x === null || x === undefined ? (dv === 'NA' ? '<span class="tt-na">NA</span>' : '—') : `${so(x)} ${esc(dv)}`);

function khoiDong() {
	const goc = document.getElementById('ta-duoc');
	if (!goc || goc.dataset.daDung) return;
	goc.dataset.daDung = '1';
	const o = goc.querySelector('#td-q');
	const chonDuong = goc.querySelector('#td-duong');
	const dem = goc.querySelector('[data-td-dem]');
	const ds = goc.querySelector('[data-td-ds]');
	ds.innerHTML = '<p>Đang nạp dữ liệu FDA IID…</p>';
	fetch(`${BASE}du-lieu/fda-iid.json`)
		.then((r) => {
			if (!r.ok) throw new Error(r.status);
			return r.json();
		})
		.then((d) => {
			const chat = d.chat.map(([ten, cas, unii, dong]) => ({ ten, cas, unii, dong, chu: bo(`${ten} ${cas || ''} ${unii || ''}`) }));
			const demDuong = {};
			for (const c of chat) for (const r of c.dong) demDuong[r[0]] = (demDuong[r[0]] || 0) + 1;
			chonDuong.innerHTML =
				'<option value="">Mọi đường dùng</option>' +
				Object.entries(demDuong)
					.sort((a, b) => b[1] - a[1])
					.map(([k, n]) => `<option value="${esc(k)}">${DUONG[k] ? `${DUONG[k]} (${k})` : k} · ${n}</option>`)
					.join('');
			const TOI_DA = 60;
			const chay = () => {
				const q = bo(o.value.trim());
				const toks = q.split(/\s+/).filter(Boolean);
				const duong = chonDuong.value;
				let khop = chat.filter((c) => toks.every((t) => c.chu.includes(t)) && (!duong || c.dong.some((r) => r[0] === duong)));
				// tên bắt đầu bằng từ khóa lên đầu
				if (q) khop = khop.map((c, i) => [bo(c.ten).startsWith(q) ? 0 : 1, i, c]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
				const tong = khop.length;
				dem.textContent = q || duong ? `${tong.toLocaleString('vi-VN')} / ${chat.length.toLocaleString('vi-VN')} tá dược khớp${tong > TOI_DA ? `; hiện ${TOI_DA} chất đầu, gõ cụ thể hơn để thu hẹp` : ''}` : `${chat.length.toLocaleString('vi-VN')} tá dược, ${d.so_dong.toLocaleString('vi-VN')} dòng (bản ${d.phien_ban}). Gõ tên để tìm.`;
				if (!q && !duong) return (ds.innerHTML = '');
				ds.innerHTML = khop
					.slice(0, TOI_DA)
					.map((c) => {
						const dong = duong ? c.dong.filter((r) => r[0] === duong) : c.dong;
						return `<details class="td-chat"${tong <= 3 ? ' open' : ''}><summary><b>${esc(c.ten)}</b>${c.cas ? `<span class="td-cas">CAS ${esc(c.cas)}</span>` : ''}<span class="tt-co">${dong.length} dòng</span></summary>
<div class="tt-cuon"><table class="tt-bang"><thead><tr><th>Đường dùng</th><th>Dạng bào chế</th><th>Hàm lượng tối đa mỗi đơn vị liều</th><th>Lượng tối đa mỗi ngày</th></tr></thead><tbody>${dong
							.map(([dg, dang, p, pu, m, mu]) => `<tr><td>${tenDuong(dg)}</td><td>${esc(dang)}</td><td>${ham(p, pu)}</td><td>${ham(m, mu)}</td></tr>`)
							.join('')}</tbody></table></div></details>`;
					})
					.join('');
			};
			o.addEventListener('input', chay);
			chonDuong.addEventListener('change', chay);
			const q0 = new URLSearchParams(location.search).get('q');
			if (q0) o.value = q0;
			chay();
		})
		.catch(() => (ds.innerHTML = '<p class="mt-loi">Không nạp được dữ liệu. Kiểm tra kết nối mạng rồi tải lại trang.</p>'));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
