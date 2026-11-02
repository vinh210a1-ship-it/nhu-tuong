// Tab "Mức tối đa (TT24)" trên trang Tra cứu: bảng ML theo Thông tư 24/2019/TT-BYT (hợp nhất 09/VBHN-BYT 2024).
// Danh sách 400 chất đã nằm sẵn trong HTML; dữ liệu ML (public/du-lieu/tt24.json) chỉ nạp khi người xem mở một chất
// hoặc chọn một nhóm thực phẩm. Không gửi gì đi đâu.
const BASE = new URL('.', import.meta.url).pathname; // '/nhu-tuong/'
let duLieu = null;
let dangNap = null;
const napDuLieu = () => {
	if (duLieu) return Promise.resolve(duLieu);
	if (!dangNap) {
		dangNap = fetch(`${BASE}du-lieu/tt24.json`)
			.then((r) => {
				if (!r.ok) throw new Error(r.status);
				return r.json();
			})
			.then((d) => {
				// chỉ mục phụ: INS -> tên Việt; INS -> các khối 2A/2B chứa nó
				d.tenVi = new Map(d.pl1.map(([ins, vi]) => [ins, vi]));
				d.gmpSet = new Set(d.gmp);
				d.gmpNhom = new Map(d.gmp_nhom.map(([ma, ten]) => [ma, ten]));
				const chiMuc = (ds) => {
					const m = new Map();
					ds.forEach((k, i) => k[1].forEach(([ins]) => m.set(ins, [...(m.get(ins) || []), i])));
					return m;
				};
				d.khoi2a = chiMuc(d.a2);
				d.khoi2b = chiMuc(d.b2);
				duLieu = d;
				return d;
			});
	}
	return dangNap;
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const soML = (ml) => (ml === 'GMP' ? '<b>GMP</b>' : `<b>${esc(Number(ml.replace(',', '.')).toLocaleString('vi-VN'))}</b>`);
// "38, XS167 & 52" -> các mã ghi chú
const maGhiChu = (gc) => (gc || '').split(/[,&]/).map((x) => x.trim()).filter(Boolean);
function giaiGhiChu(d, ma) {
	if (/^\d+$/.test(ma)) return d.gc[ma] || '(không thấy trong bảng giải thích ghi chú)';
	const xs = /^XS(\d+R?)$/.exec(ma);
	if (xs) return `Không bao gồm các sản phẩm quy định trong tiêu chuẩn Codex Stan ${xs[1]}`;
	return ma; // ghi chú viết bằng chữ (Phụ lục 2B)
}
function oGhiChu(d, gc, gom) {
	return maGhiChu(gc)
		.map((m) => {
			const giai = giaiGhiChu(d, m);
			if (giai !== m) gom.set(m, giai);
			return giai === m ? esc(m) : `<abbr title="${esc(giai)}">${esc(m)}</abbr>`;
		})
		.join(', ');
}
const bangGhiChu = (gom) =>
	gom.size
		? `<details class="tt-gc"><summary>Giải thích ${gom.size} ghi chú</summary><dl>${[...gom]
				.sort((a, b) => (parseInt(a[0]) || 1e9) - (parseInt(b[0]) || 1e9) || a[0].localeCompare(b[0]))
				.map(([m, g]) => `<div><dt>${esc(m)}</dt><dd>${esc(g)}</dd></div>`)
				.join('')}</dl></details>`
		: '';
const tenThanhVien = (ins) => ins.map(([m, t]) => `INS ${esc(m)} ${esc(t)}`).join('; ');

function thanChat(d, ins) {
	const gom = new Map();
	let html = '';
	if (d.gmpSet.has(ins))
		html += `<p class="tt-gmp-dong"><b>Phụ lục 3:</b> dùng theo GMP trong các nhóm thực phẩm ở Phụ lục 3 mục 2 (${d.gmp_nhom.length} nhóm, chọn nhóm ở ô “Tra theo nhóm thực phẩm” để xem).</p>`;
	for (const i of d.khoi2a.get(ins) || []) {
		const [nhom, tv, dong] = d.a2[i];
		html += `<h4 class="tt-h4">Phụ lục 2A · ${esc(nhom)}</h4>${tv.length > 1 ? `<p class="tt-chung">Khối này gồm ${tv.length} chất dùng chung ML: ${tenThanhVien(tv)}</p>` : ''}
<div class="tt-cuon"><table class="tt-bang"><thead><tr><th>Mã nhóm</th><th>Nhóm thực phẩm</th><th>ML (mg/kg)</th><th>Ghi chú</th></tr></thead><tbody>${dong
			.map(([ma, ml, gc]) => `<tr><td>${esc(ma)}</td><td>${esc(d.nhom_tp[ma] || '')}</td><td>${soML(ml)}</td><td>${oGhiChu(d, gc, gom)}</td></tr>`)
			.join('')}</tbody></table></div>`;
	}
	for (const i of d.khoi2b.get(ins) || []) {
		const [nhom, tv, dong] = d.b2[i];
		html += `<h4 class="tt-h4">Phụ lục 2B (thực phẩm chưa có trong Codex GSFA) · ${esc(nhom)}</h4>${tv.length > 1 ? `<p class="tt-chung">${tenThanhVien(tv)}</p>` : ''}
<div class="tt-cuon"><table class="tt-bang"><thead><tr><th>Nhóm thực phẩm</th><th>ML (mg/kg)</th><th>Ghi chú</th></tr></thead><tbody>${dong
			.map(([ten, ml, gc]) => `<tr><td>${esc(ten)}</td><td>${soML(ml)}</td><td>${oGhiChu(d, gc, gom)}</td></tr>`)
			.join('')}</tbody></table></div>`;
	}
	if (!d.khoi2a.has(ins) && !d.khoi2b.has(ins) && !d.gmpSet.has(ins))
		html += '<p>Chất có trong danh mục được phép (Phụ lục 1) nhưng không có dòng ML riêng ở Phụ lục 2A, 2B và không nằm trong danh sách GMP của Phụ lục 3. Xem Điều 5: có thể dùng theo tiêu chuẩn sản phẩm của Codex nếu tiêu chuẩn đó cho phép.</p>';
	return html + bangGhiChu(gom);
}

// nhóm cha theo Điều 6: 12.6.1 -> 12.6 -> 12.0
function nhomCha(ma) {
	const p = ma.split('.');
	const ds = [];
	while (p.length > 2) {
		p.pop();
		ds.push(p.join('.'));
	}
	if (p[1] !== '0') ds.push(`${p[0]}.0`);
	return ds;
}
const soINS = (s) => {
	const m = /^E?(\d+)([a-z]?)/.exec(s);
	return m ? Number(m[1]) + (m[2] ? (m[2].charCodeAt(0) - 96) / 100 : 0) : 1e9;
};

function thanNhom(d, ma) {
	const cha = nhomCha(ma);
	const hop = new Set([ma, ...cha]);
	const dongs = [];
	d.a2.forEach(([nhom, tv, dong]) => {
		for (const [m, ml, gc] of dong) if (hop.has(m)) dongs.push({ tv, nhom, m, ml, gc });
	});
	dongs.sort((a, b) => soINS(a.tv[0][0]) - soINS(b.tv[0][0]));
	const con = [];
	d.a2.forEach(([, tv, dong]) => {
		for (const [m] of dong) if (m.startsWith(ma + '.') ) con.push(tv[0][0]);
	});
	const gom = new Map();
	const gmpMa = [ma, ...cha].find((x) => d.gmpNhom.has(x));
	const dongGmp = gmpMa
		? `<p class="tt-gmp-dong"><b>Phụ lục 3:</b> nhóm ${esc(gmpMa)}${gmpMa !== ma ? ' (nhóm cha)' : ''} nằm trong danh sách nhóm thực phẩm của Phụ lục 3 mục 2, nên ${d.gmp.length} chất ở Phụ lục 3 mục 1 dùng được theo GMP. ${/Chỉ áp dụng/.test(d.gmpNhom.get(gmpMa)) ? `Điều kiện ghi kèm: ${esc(d.gmpNhom.get(gmpMa).replace(/^.*?\((Chỉ áp dụng[^)]*)\).*$/, '$1'))}.` : ''}</p>`
		: `<p class="tt-gmp-dong"><b>Phụ lục 3:</b> nhóm này và các nhóm cha không có trong danh sách nhóm thực phẩm của Phụ lục 3 mục 2.</p>`;
	return `<p><b>${esc(ma)} ${esc(d.nhom_tp[ma] || '')}</b>${cha.length ? ` · tính cả nhóm cha ${cha.map(esc).join(', ')}` : ''}: <b>${dongs.length}</b> dòng ML ở Phụ lục 2A.</p>${dongGmp}
<div class="tt-cuon"><table class="tt-bang"><thead><tr><th>INS</th><th>Phụ gia</th><th>ML (mg/kg)</th><th>Từ nhóm</th><th>Ghi chú</th></tr></thead><tbody>${dongs
		.map(
			(x) =>
				`<tr><td>${x.tv.map(([m]) => esc(m)).join(', ')}</td><td>${esc(x.tv.length > 1 ? x.nhom : d.tenVi.get(x.tv[0][0]) || x.tv[0][1])}</td><td>${soML(x.ml)}</td><td>${x.m === ma ? 'chính nhóm này' : esc(x.m)}</td><td>${oGhiChu(d, x.gc, gom)}</td></tr>`,
		)
		.join('')}</tbody></table></div><p class="tt-chung">Một chất có thể có dòng ở cả nhóm cha lẫn chính nhóm này; hãy đọc cả hai cùng ghi chú.</p>${con.length ? `<p class="tt-chung">Ngoài ra có ${con.length} dòng ML quy định riêng cho các phân nhóm nhỏ hơn của ${esc(ma)}; chọn đúng phân nhóm để xem.</p>` : ''}${bangGhiChu(gom)}`;
}

function khoiDong() {
	const muc = document.querySelector('[data-tk-muc="tt24"]');
	if (!muc || muc.dataset.daDung) return;
	muc.dataset.daDung = '1';
	const loi = (el) => (el.innerHTML = '<p class="mt-loi">Không nạp được dữ liệu. Kiểm tra kết nối mạng rồi mở lại.</p>');
	muc.querySelectorAll('.tt-hang details').forEach((det) =>
		det.addEventListener('toggle', () => {
			if (!det.open) return;
			const than = det.querySelector('[data-tt-than]');
			if (than.dataset.xong) return;
			than.innerHTML = '<p>Đang nạp…</p>';
			napDuLieu()
				.then((d) => {
					than.innerHTML = thanChat(d, det.closest('.tt-hang').dataset.ins);
					than.dataset.xong = '1';
				})
				.catch(() => loi(than));
		}),
	);
	const chon = document.getElementById('tt-chon-nhom');
	const kq = muc.querySelector('[data-tt-kq-nhom]');
	if (chon && kq)
		chon.addEventListener('change', () => {
			if (!chon.value) return (kq.innerHTML = '');
			kq.innerHTML = '<p>Đang nạp…</p>';
			napDuLieu()
				.then((d) => (kq.innerHTML = thanNhom(d, chon.value)))
				.catch(() => loi(kq));
		});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
