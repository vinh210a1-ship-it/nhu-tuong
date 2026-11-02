// Khung dùng chung cho các bàn thí nghiệm mới (bàn thịt, bàn bảo quản):
// cảnh SVG có tủ bấm mở, vật mẫu kéo thả giữa các trạm, bảng điều khiển bên cạnh,
// linh vật "Giọt", nhiệm vụ có sao. Mỗi bàn chỉ cần khai báo cấu hình.

export const GIAM_CHUYEN_DONG = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const so = (x, c = 2) => (!isFinite(x) ? '∞' : x.toLocaleString('vi-VN', { maximumSignificantDigits: c }));
export const soCD = (x, c = 1) => x.toLocaleString('vi-VN', { maximumFractionDigits: c });
export const h = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export function docLS(k, md) {
	try {
		const v = localStorage.getItem(k);
		return v ? JSON.parse(v) : md;
	} catch {
		return md;
	}
}
export function ghiLS(k, v) {
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {}
}
export const nhanHTML = (n) =>
	`<span class="nhan nhan-${n.ma}" title="${{ N: 'Có nguồn', T: 'Tính minh họa', K: 'Sách nền, chờ đối chiếu trang', G: 'Suy luận hoặc giả thuyết' }[n.ma]}">${n.ma}</span>`;

export function thanhTruot(k, nhan, min, max, buoc, giaTri, donVi, hien = (v) => soCD(v, 2), khoa = false) {
	return `<label class="pl-o${khoa ? ' khoa' : ''}"><span class="pl-o-nhan">${nhan}${khoa ? ' <small>🔒 đề bài cố định</small>' : ''}</span>
<span class="pl-o-dong"><input type="range" data-o="${k}" min="${min}" max="${max}" step="${buoc}" value="${giaTri}" ${khoa ? 'disabled' : ''}/>
<output>${hien(giaTri)} ${donVi}</output></span></label>`;
}
export const dauBang = (tieuDe, moTa, bieuTuong) =>
	`<header class="pl-bang-dau"><span class="pl-bt" aria-hidden="true">${bieuTuong}</span><div><h3>${tieuDe}</h3><p>${moTa}</p></div></header>`;
export function chai(x, y, mau, nhan, cao = 46) {
	return `<g class="chai"><rect x="${x + 5}" y="${y - cao - 8}" width="10" height="9" rx="2" class="nap"/><rect x="${x}" y="${y - cao}" width="20" height="${cao}" rx="4" style="fill:${mau}"/><rect x="${x + 2}" y="${y - cao * 0.62}" width="16" height="${cao * 0.34}" rx="1.5" class="nhan-chai"/>${nhan ? `<text x="${x + 10}" y="${y - cao * 0.39}" text-anchor="middle" class="chai-chu">${nhan}</text>` : ''}</g>`;
}
export function nhanTram(ten, x, y) {
	return `<g class="pl-nhan-tram"><rect x="${x - 4}" y="${y - 16}" rx="11" height="24" width="${ten.length * 8 + 16}"/><text x="${x + 4}" y="${y + 1}">${ten}</text></g>`;
}
export function tram(id, ten, noiDung, nhanX, nhanY) {
	return `<g class="pl-tram" data-tram="${id}" data-may="${id}" tabindex="0" role="button" aria-label="${ten}">${noiDung}${nhanTram(ten, nhanX, nhanY)}</g>`;
}
/** Tủ treo tường: cửa kính mở khi rê chuột, bấm để mở bảng chọn. */
export function tuTreo(id, x, y, w, ten, mon) {
	const n = Math.max(1, Math.floor((w - 20) / 28));
	return `<g class="pl-tu" data-tu="${id}" tabindex="0" role="button" aria-label="Mở ${ten}">
<rect x="${x}" y="${y}" width="${w}" height="104" rx="8" class="tu"/><g class="ruot"><rect x="${x + 10}" y="${y + 8}" width="${w - 20}" height="88" rx="4" class="tu-trong"/>
<line x1="${x + 10}" y1="${y + 54}" x2="${x + w - 10}" y2="${y + 54}" class="ke"/>${mon.slice(0, n).map((m, i) => chai(x + 16 + i * 28, y + 52, m.mau, '', 34)).join('')}${mon.slice(n, 2 * n).map((m, i) => chai(x + 16 + i * 28, y + 94, m.mau, '', 30)).join('')}</g>
<rect x="${x + 10}" y="${y + 8}" width="${(w - 20) / 2}" height="88" rx="3" class="cua-kinh trai"/><rect x="${x + w / 2}" y="${y + 8}" width="${(w - 20) / 2}" height="88" rx="3" class="cua-kinh phai"/>
<circle cx="${x + w / 2 - 4}" cy="${y + 52}" r="2.5" class="tay-nam"/><circle cx="${x + w / 2 + 4}" cy="${y + 52}" r="2.5" class="tay-nam"/>
${nhanTram(ten, x + 4, y - 6)}</g>`;
}
export const nenPhong = (bien) => `<rect x="0" y="0" width="1000" height="470" class="tuong"/>
<g class="gach">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 28}" x2="1000" y2="${i * 28}"/>`).join('')}</g>
<rect x="0" y="335" width="1000" height="135" class="ban-than"/><rect x="0" y="325" width="1000" height="14" class="ban-mat"/>
<g class="bien"><rect x="712" y="28" width="160" height="40" rx="8"/><text x="792" y="54" text-anchor="middle">${bien}</text></g>`;

const GIOT_SVG = `<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2 C20 2 4 22 4 30 a16 16 0 0 0 32 0 C36 22 20 2 20 2z" class="than"/><circle cx="14" cy="30" r="2.6" class="mat"/><circle cx="26" cy="30" r="2.6" class="mat"/><path d="M14 37 q6 5 12 0" class="mieng"/><circle cx="11" cy="24" r="3" class="bong"/></svg>`;

/**
 * Dựng một bàn thí nghiệm.
 * cfg: {
 *   khoaSao, nhiemVu[], moi(nv) → trạng thái riêng, nha (trạm xuất phát), tram[{id, ten, so, viTri:[x,y], vung:[x1,y1,x2,y2]}],
 *   canh() → SVG, vat() → SVG của vật kéo được (g.pl-coc), tu{id:{ten,moTa,mon[]}},
 *   dich(st), coTrong(st,mon), cho(st,mon,api) → bool, bo(st,mon,api), theMon(st,mon),
 *   choToi(st,tram) → chuỗi lý do nếu chưa cho đặt, khiToi(st,tram,api), bang{tram: (st,api)→html},
 *   doi(st,k,v,api), lam{ten:(st,api,nut)}, capNhatCanh(st,svg), chao, huongDan, tenVat
 * }
 */
export function taoBan(goc, cfg) {
	const st = { nv: null, viTri: cfg.nha, tram: cfg.nha, dangChay: false, ...cfg.moi(null) };
	let hetGio = null;
	let keoXong = false;
	let tuMoEl = null;
	let tuDangMo = null;
	let monChon = null;
	const TRAM = Object.fromEntries(cfg.tram.map((t) => [t.id, t]));

	const api = {
		st,
		noi(chu, kieu = '') {
			const b = goc.querySelector('.pl-giot');
			if (!b) return;
			b.className = `pl-giot hien ${kieu}`;
			b.querySelector('.pl-giot-chu').innerHTML = chu;
			clearTimeout(hetGio);
			hetGio = setTimeout(() => b.classList.remove('moi'), 1200);
			b.classList.add('moi');
		},
		ve,
		veBang,
		moTram,
		moTu,
		duaToi,
		chay(tenMay, ms, xong) {
			st.dangChay = true;
			const may = goc.querySelector(`[data-may="${tenMay}"]`);
			may?.classList.add('chay');
			goc.querySelector('.pl-coc')?.classList.add('lac');
			goc.querySelectorAll('.pl-bang .pl-nut').forEach((n) => (n.disabled = true));
			setTimeout(() => {
				may?.classList.remove('chay');
				goc.querySelector('.pl-coc')?.classList.remove('lac');
				st.dangChay = false;
				xong();
			}, GIAM_CHUYEN_DONG ? 50 : ms);
		},
		ghiSao(kqSao) {
			if (!st.nv) return;
			const sao = docLS(cfg.khoaSao, {});
			sao[st.nv.id] = Math.max(sao[st.nv.id] ?? 0, kqSao.sao);
			ghiLS(cfg.khoaSao, sao);
			veNhiemVu();
			api.noi(['Chưa được sao nào… đọc phần "Vì sao?" rồi thử lại nhé!', 'Một sao! Đọc "Vì sao?" để biết cần sửa gì.', 'Hai sao rồi, sắp hoàn hảo!', '🎉 Ba sao! Bạn đúng là dân R&D thực thụ!'][kqSao.sao], kqSao.sao === 3 ? 'vui' : kqSao.sao ? '' : 'lo');
			if (kqSao.sao === 3) phaoHoa();
		},
		saoHTML(kqSao) {
			return `<div class="pl-sao-kq"><span class="pl-sao-to" aria-label="${kqSao.sao} trên 3 sao">${'★'.repeat(kqSao.sao)}<i>${'☆'.repeat(3 - kqSao.sao)}</i></span><b>${['Chưa đạt, thử lại nhé!', 'Được 1 sao, còn cải thiện được.', 'Tốt! Còn một tiêu chí nữa.', 'Xuất sắc! Hoàn hảo.'][kqSao.sao]}</b></div>
<ul class="pl-tieu-chi">${kqSao.tieuChi.map((t) => `<li class="${t.dat ? 'dat' : 'truot'}">${t.dat ? '✓' : '✗'} ${h(t.chu)}</li>`).join('')}</ul>`;
		},
		lamMoi(giuCongThuc = true) {
			Object.assign(st, cfg.moi(st.nv, giuCongThuc ? st : null), { viTri: cfg.nha, tram: cfg.nha });
			ve();
		},
	};

	function phaoHoa() {
		if (GIAM_CHUYEN_DONG) return;
		const w = goc.querySelector('.pl-canh-wrap');
		const mau = ['#f0b14a', '#2ec4b6', '#c4486b', '#7a5cd6', '#3fb162'];
		for (let i = 0; i < 40; i++) {
			const p = document.createElement('i');
			p.className = 'pl-hoa';
			p.style.cssText = `left:${50 + (Math.random() - 0.5) * 30}%;background:${mau[i % 5]};--dx:${(Math.random() - 0.5) * 360}px;--dy:${-120 - Math.random() * 200}px;--r:${Math.random() * 720}deg`;
			w.appendChild(p);
			setTimeout(() => p.remove(), 1500);
		}
	}

	/* ---------- khung ---------- */
	goc.innerHTML = `
<section class="pl-nv" aria-label="Chọn nhiệm vụ"></section>
<div class="pl-khung">
  <div class="pl-canh-wrap">
    <div class="pl-giot" role="status" aria-live="polite">${GIOT_SVG}<p class="pl-giot-chu"></p></div>
    <svg class="pl-canh" viewBox="0 10 1000 360" role="group" aria-label="${h(cfg.nhanCanh)}">${cfg.canh()}${cfg.vat()}</svg>
    <nav class="pl-buoc" aria-label="Các bước"></nav>
    <p class="pl-huong-dan">${cfg.huongDan}</p>
  </div>
  <aside class="pl-bang" aria-live="polite"></aside>
</div>`;
	tuMoEl = document.createElement('div');
	tuMoEl.className = 'pl-tu-mo';
	tuMoEl.hidden = true;
	document.body.appendChild(tuMoEl);
	const svg = goc.querySelector('.pl-canh');
	svg.addEventListener('click', (e) => {
		if (keoXong) return;
		const tu = e.target.closest('[data-tu]');
		if (tu) return moTu(tu.dataset.tu);
		const nut = e.target.closest('[data-bam]');
		if (nut) return cfg.lam[nut.dataset.bam]?.(st, api, nut);
		const t = e.target.closest('[data-tram]');
		if (t) moTram(t.dataset.tram);
	});
	svg.addEventListener('keydown', (e) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		const g = e.target.closest('[data-tu],[data-bam],[data-tram]');
		if (!g) return;
		e.preventDefault();
		g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
	ganKeo();

	function veNhiemVu() {
		const sao = docLS(cfg.khoaSao, {});
		const the = (id, ten, de, s) =>
			`<button type="button" class="pl-the-nv${(st.nv?.id ?? 'tu-do') === id ? ' chon' : ''}" data-nv="${id}">
  <span class="pl-nv-ten">${h(ten)}</span><span class="pl-nv-de">${h(de)}</span>
  ${s === null ? '<span class="pl-nv-sao tu-do">Thử gì cũng được</span>' : `<span class="pl-nv-sao" aria-label="${s} trên 3 sao">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</span>`}
</button>`;
		goc.querySelector('.pl-nv').innerHTML =
			`<h2 class="pl-h">Chọn nhiệm vụ</h2><div class="pl-ds-nv">` +
			cfg.nhiemVu.map((n) => the(n.id, n.ten, n.de, sao[n.id] ?? 0)).join('') +
			the('tu-do', 'Tự do', 'Không đề bài, không chấm điểm. Thử mọi công thức và xem chuyện gì xảy ra.', null) +
			`</div>`;
		goc.querySelectorAll('[data-nv]').forEach((b) =>
			b.addEventListener('click', () => {
				st.nv = cfg.nhiemVu.find((n) => n.id === b.dataset.nv) ?? null;
				Object.assign(st, cfg.moi(st.nv), { viTri: cfg.nha, tram: cfg.nha });
				veNhiemVu();
				ve();
				api.noi(st.nv ? `Nhiệm vụ mới: <b>${h(st.nv.ten)}</b>. ${h(st.nv.de)}` : 'Chế độ tự do: muốn thử gì cũng được!');
			}),
		);
	}

	function moTram(id) {
		if (st.dangChay) return;
		st.tram = id;
		veBuoc();
		veBang();
		capNhat();
		if (matchMedia('(max-width: 60rem)').matches) goc.querySelector('.pl-bang').scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	function duaToi(id) {
		if (st.dangChay) return;
		const lyDo = cfg.choToi?.(st, id);
		if (lyDo) {
			api.noi(lyDo, 'lo');
			capNhat();
			return;
		}
		st.viTri = id;
		st.tram = id;
		ve();
		cfg.khiToi?.(st, id, api);
	}
	function veBuoc() {
		const xong = cfg.daXong?.(st) ?? {};
		goc.querySelector('.pl-buoc').innerHTML = cfg.tram
			.filter((t) => t.so)
			.map((t) => `<button type="button" class="pl-chip${st.tram === t.id ? ' dang' : ''}${xong[t.id] ? ' xong' : ''}" data-chip="${t.id}"><span>${xong[t.id] ? '✓' : t.so}</span>${t.ten}</button>`)
			.join('');
		goc.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('click', () => moTram(b.dataset.chip)));
	}
	function veBang() {
		const b = goc.querySelector('.pl-bang');
		const ham = cfg.bang[st.tram] ?? cfg.bang[cfg.nha];
		b.innerHTML = (st.nv ? `<div class="pl-de"><b>Nhiệm vụ:</b> ${h(st.nv.de)}</div>` : '') + ham(st, api);
		b.querySelectorAll('[data-o]').forEach((o) =>
			o.addEventListener('input', () => {
				cfg.doi(st, o.dataset.o, +o.value, api);
				const out = o.parentElement.querySelector('output');
				if (out && cfg.hienO) out.textContent = cfg.hienO(st, o.dataset.o);
				capNhat();
			}),
		);
		b.querySelectorAll('[data-o]').forEach((o) =>
			o.addEventListener('change', () => {
				if (st.canVeLai) {
					st.canVeLai = false;
					ve();
				}
			}),
		);
		b.querySelectorAll('[data-lam]').forEach((n) => n.addEventListener('click', () => cfg.lam[n.dataset.lam]?.(st, api, n)));
		b.querySelectorAll('[data-mo-tu]').forEach((n) => n.addEventListener('click', () => moTu(n.dataset.moTu)));
		b.querySelectorAll('[data-dua]').forEach((n) => n.addEventListener('click', () => duaToi(n.dataset.dua)));
	}
	function capNhat() {
		svg.querySelectorAll('[data-tram]').forEach((g) => g.classList.toggle('dang', g.dataset.tram === st.tram));
		const vat = svg.querySelector('.pl-coc');
		const [x, y] = TRAM[st.viTri].viTri;
		vat.style.transform = `translate(${x}px, ${y}px)`;
		cfg.capNhatCanh(st, svg);
	}
	function ve() {
		veBuoc();
		veBang();
		capNhat();
		if (tuDangMo) veTuMo();
	}

	/* ---------- kéo vật mẫu ---------- */
	function ganKeo() {
		const vat = svg.querySelector('.pl-coc');
		const toaDo = (ev) => {
			const p = svg.createSVGPoint();
			p.x = ev.clientX;
			p.y = ev.clientY;
			return p.matrixTransform(svg.getScreenCTM().inverse());
		};
		const vungTai = (x, y) => cfg.tram.find((t) => t.vung && x >= t.vung[0] && x <= t.vung[2] && y >= t.vung[1] && y <= t.vung[3])?.id;
		vat.addEventListener('pointerdown', (e) => {
			if (st.dangChay || e.button !== 0) return;
			e.preventDefault();
			vat.setPointerCapture(e.pointerId);
			const bd = toaDo(e);
			const [cx, cy] = TRAM[st.viTri].viTri;
			const lech = [bd.x - cx, bd.y - cy];
			let daKeo = false;
			const diChuyen = (ev) => {
				const p = toaDo(ev);
				if (!daKeo && Math.hypot(p.x - bd.x, p.y - bd.y) < 5) return;
				daKeo = true;
				vat.classList.add('dang-keo');
				vat.style.transform = `translate(${p.x - lech[0]}px, ${p.y - lech[1]}px)`;
				const v = vungTai(p.x, p.y);
				svg.querySelectorAll('[data-tram]').forEach((g) => g.classList.toggle('sap-tha', g.dataset.tram === v));
			};
			const tha = (ev) => {
				vat.removeEventListener('pointermove', diChuyen);
				vat.removeEventListener('pointerup', tha);
				vat.removeEventListener('pointercancel', tha);
				vat.classList.remove('dang-keo');
				svg.querySelectorAll('.sap-tha').forEach((g) => g.classList.remove('sap-tha'));
				if (!daKeo) return moTram(st.viTri);
				keoXong = true;
				setTimeout(() => (keoXong = false), 50);
				const p = toaDo(ev);
				const v = ev.type === 'pointerup' ? vungTai(p.x, p.y) : null;
				if (v && v !== st.viTri) duaToi(v);
				else capNhat();
			};
			vat.addEventListener('pointermove', diChuyen);
			vat.addEventListener('pointerup', tha);
			vat.addEventListener('pointercancel', tha);
		});
		vat.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				moTram(st.viTri);
			}
		});
	}

	/* ---------- tủ mở ---------- */
	function moTu(id) {
		if (st.dangChay) return;
		tuDangMo = id;
		monChon = null;
		const tu = cfg.tu[id];
		tuMoEl.hidden = false;
		tuMoEl.innerHTML = `<div class="pl-tu-nen" data-dong></div>
<div class="pl-tu-hop" role="dialog" aria-modal="true" aria-label="${h(tu.ten)}">
  <header class="pl-tu-dau"><div><h3>${h(tu.ten)}</h3><p>${h(tu.moTa)}</p></div><button type="button" class="pl-tu-dong" data-dong aria-label="Đóng tủ">✕</button></header>
  <div class="pl-tu-than">
    <div class="pl-tu-ke-wrap"><div class="pl-tu-ke"></div><div class="pl-cua trai" aria-hidden="true"></div><div class="pl-cua phai" aria-hidden="true"></div></div>
    <div class="pl-tu-ban"><div class="pl-dich" aria-label="${h(cfg.tenVat)}: thả chai vào đây"></div><div class="pl-the-mon"></div></div>
  </div>
</div>`;
		tuMoEl.querySelectorAll('[data-dong]').forEach((n) => n.addEventListener('click', dongTu));
		tuMoEl.addEventListener('keydown', phimTu);
		veTuMo();
		setTimeout(() => tuMoEl.querySelector('.pl-chai-nut:not(.khoa)')?.focus(), GIAM_CHUYEN_DONG ? 0 : 500);
	}
	function phimTu(e) {
		if (e.key === 'Escape') dongTu();
	}
	function dongTu() {
		tuMoEl.hidden = true;
		tuMoEl.innerHTML = '';
		tuMoEl.removeEventListener('keydown', phimTu);
		tuDangMo = null;
	}
	function chaiHTML(mon) {
		const khoa = !!mon.khoaMo;
		return `<button type="button" class="pl-chai-nut${khoa ? ' khoa' : ''}${cfg.coTrong(st, mon) ? ' da-dung' : ''}${monChon === mon.id ? ' chon' : ''}" data-mon="${mon.id}" aria-label="${h(mon.ten)}${khoa ? ' (đang khóa)' : ''}">
  <span class="pl-chai-hinh" style="--mau:${mon.mau}"><i class="nap"></i><i class="than"><em>${h(mon.nhan)}</em></i>${khoa ? '<i class="o-khoa">🔒</i>' : ''}</span>
  <span class="pl-chai-ten">${h(mon.ten.replace(/ \(.*\)$/, ''))}</span>
</button>`;
	}
	function choVao(mon) {
		if (cfg.cho(st, mon, api)) hieuUngRot(mon);
		monChon = mon.id;
		ve();
	}
	function veTuMo() {
		if (!tuDangMo) return;
		const tu = cfg.tu[tuDangMo];
		tuMoEl.querySelector('.pl-tu-ke').innerHTML = tu.mon.map(chaiHTML).join('');
		tuMoEl.querySelector('.pl-dich').innerHTML = cfg.dich(st);
		const mon = tu.mon.find((m) => m.id === monChon);
		const daCo = mon && cfg.coTrong(st, mon);
		tuMoEl.querySelector('.pl-the-mon').innerHTML = mon
			? mon.khoaMo
				? `<h4>🔒 ${h(mon.ten)}</h4><p class="pl-meo">${h(mon.khoaMo)}</p>`
				: `<h4>${h(mon.ten)}</h4>${cfg.theMon(st, mon)}${daCo ? `<p class="pl-ok">Đã có. Chỉnh lượng ở bảng bên cạnh cảnh phòng lab.</p><button type="button" class="pl-link" data-bo-mon>Bỏ ra</button>` : `<button type="button" class="pl-nut" data-cho>Cho vào</button>`}`
			: `<p class="pl-meo">Bấm vào một chai để xem thông tin. Kéo chai thả vào ${h(cfg.tenVat.toLowerCase())} để dùng.</p>`;
		tuMoEl.querySelectorAll('.pl-chai-nut').forEach((n) => ganKeoChai(n, tu));
		tuMoEl.querySelector('[data-cho]')?.addEventListener('click', () => choVao(mon));
		tuMoEl.querySelector('[data-bo-mon]')?.addEventListener('click', () => {
			cfg.bo(st, mon, api);
			ve();
		});
	}
	function ganKeoChai(nut, tu) {
		const mon = tu.mon.find((m) => m.id === nut.dataset.mon);
		nut.addEventListener('pointerdown', (e) => {
			if (e.button !== 0) return;
			const x0 = e.clientX, y0 = e.clientY;
			let bong = null;
			const dich = tuMoEl.querySelector('.pl-dich');
			const diChuyen = (ev) => {
				if (!bong && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) {
					if (mon.khoaMo) return;
					bong = nut.querySelector('.pl-chai-hinh').cloneNode(true);
					bong.classList.add('pl-bong-keo');
					document.body.appendChild(bong);
					nut.classList.add('dang-keo');
				}
				if (bong) {
					bong.style.transform = `translate(${ev.clientX - 22}px, ${ev.clientY - 40}px) rotate(${Math.max(-40, Math.min(40, (ev.clientX - x0) / 6))}deg)`;
					const r = dich.getBoundingClientRect();
					dich.classList.toggle('tren', ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom);
				}
			};
			const tha = (ev) => {
				window.removeEventListener('pointermove', diChuyen);
				window.removeEventListener('pointerup', tha);
				window.removeEventListener('pointercancel', tha);
				nut.classList.remove('dang-keo');
				if (!bong) {
					monChon = mon.id;
					veTuMo();
					return;
				}
				const tren = dich.classList.contains('tren');
				dich.classList.remove('tren');
				bong.remove();
				if (tren && ev.type === 'pointerup') choVao(mon);
			};
			window.addEventListener('pointermove', diChuyen);
			window.addEventListener('pointerup', tha);
			window.addEventListener('pointercancel', tha);
		});
	}
	function hieuUngRot(mon) {
		const dich = tuMoEl.querySelector('.pl-dich');
		if (!dich || GIAM_CHUYEN_DONG) return;
		const r = document.createElement('div');
		r.className = 'pl-rot';
		r.style.setProperty('--mau', mon.mau);
		dich.appendChild(r);
		setTimeout(() => r.remove(), 900);
	}

	veNhiemVu();
	ve();
	setTimeout(() => api.noi(cfg.chao), 300);
	return api;
}
