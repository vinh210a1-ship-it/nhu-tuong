// Phòng lab ảo: giao diện. Mọi con số đều lấy từ mo-hinh.js (đã có phép kiểm).
// Cách chơi: bấm tủ để mở, kéo chai thả vào cốc trên cân; kéo cốc sang từng máy.
import { stokes } from '../cong-thuc.js';
import { doNhotNuoc, moPhongMe, chamSao, LUAT_CHOI, NHIEM_VU, NHU_HOA, DAU, NHAN, lopKichThuoc, CAO_ONG_MM, doKhongNo, thoiGianCamUng } from './mo-hinh.js';
import { TU } from './tu.js';

const BASE = '/nhu-tuong/';
const goc = dungVo(document.getElementById('phong-lab'));

/* Ba bàn thí nghiệm: nhũ tương (bàn gốc), thịt, bảo quản. Bàn mới chỉ tải khi được chọn. */
function dungVo(vo) {
	if (!vo) return null;
	const BAN = [
		{ id: 'nhu-tuong', ten: 'Bàn nhũ tương', bt: '🥛', de: 'Dầu, chất nhũ hóa, đồng hóa, tách lớp, ôi dầu' },
		{ id: 'thit', ten: 'Bàn thịt', bt: '🥩', de: 'Muối, phosphat, pH: vì sao thịt mọng nước?' },
		{ id: 'bao-quan', ten: 'Bàn bảo quản', bt: '🧫', de: 'aw, pH, muối, lạnh, chất bảo quản: vi khuẩn có mọc?' },
		{ id: 'kep', ten: 'Bàn nhũ tương kép', bt: '🫧', de: 'PGPR, giọt trong, bước hai: giọt kép có bền?' },
		{ id: 'pickering', ten: 'Bàn Pickering', bt: '⚪', de: 'Hạt, góc tiếp xúc, năng lượng giải hấp' },
		{ id: 'mayo', ten: 'Bàn mayonnaise', bt: '🥚', de: 'Khung minh họa: thêm dầu, bảng đo theo hàm lượng dầu' },
	];
	vo.innerHTML = `<nav class="pl-chon-ban" aria-label="Chọn bàn thí nghiệm">${BAN.map((b) => `<button type="button" class="pl-ban-nut" data-ban="${b.id}" aria-pressed="false"><span class="bt" aria-hidden="true">${b.bt}</span><b>${b.ten}</b><small>${b.de}</small></button>`).join('')}</nav>
${BAN.map((b) => `<div class="pl-ban" data-ban-vung="${b.id}"${b.id === 'nhu-tuong' ? '' : ' hidden'}></div>`).join('')}`;
	const daMo = new Set(['nhu-tuong']);
	const chon = async (id, cuon) => {
		vo.querySelectorAll('[data-ban]').forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.ban === id)));
		vo.querySelectorAll('[data-ban-vung]').forEach((v) => (v.hidden = v.dataset.banVung !== id));
		const vung = vo.querySelector(`[data-ban-vung="${id}"]`);
		if (!daMo.has(id)) {
			daMo.add(id);
			if (id === 'thit') (await import('./ban-thit.js')).khoiDongBanThit(vung);
			if (id === 'bao-quan') (await import('./ban-bao-quan.js')).khoiDongBanBaoQuan(vung);
			if (id === 'kep') (await import('./ban-kep.js')).khoiDongBanKep(vung);
			if (id === 'pickering') (await import('./ban-pickering.js')).khoiDongBanPickering(vung);
			if (id === 'mayo') (await import('./ban-mayo.js')).khoiDongBanMayo(vung);
		}
		try {
			history.replaceState(null, '', id === 'nhu-tuong' ? location.pathname : `#ban-${id}`);
		} catch {}
		if (cuon) vo.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
	vo.querySelectorAll('[data-ban]').forEach((n) => n.addEventListener('click', () => chon(n.dataset.ban, false)));
	const tuHash = location.hash.match(/^#ban-(thit|bao-quan|kep|pickering|mayo)$/)?.[1];
	setTimeout(() => chon(tuHash ?? 'nhu-tuong', !!tuHash), 0);
	return vo.querySelector('[data-ban-vung="nhu-tuong"]');
}
const GIAM_CHUYEN_DONG = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- tiện ích ---------------- */
const so = (x, c = 2) => (!isFinite(x) ? '∞' : x.toLocaleString('vi-VN', { maximumSignificantDigits: c }));
const soCD = (x, c = 1) => x.toLocaleString('vi-VN', { maximumFractionDigits: c });
const h = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function docLS(k, md) {
	try {
		const v = localStorage.getItem(k);
		return v ? JSON.parse(v) : md;
	} catch {
		return md;
	}
}
function ghiLS(k, v) {
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {}
}
const nhanHTML = (n) =>
	`<span class="nhan nhan-${n.ma}" title="${{ N: 'Có nguồn', T: 'Tính minh họa', K: 'Sách nền, chờ đối chiếu trang', G: 'Suy luận hoặc giả thuyết' }[n.ma]}">${n.ma}</span>`;
const lienKet = (n) => (n.bai ? ` <a href="${BASE}${n.bai}/">Đọc bài</a>` : '');

/* ---------------- trạng thái ---------------- */
const COC_RONG = () => ({ nuoc: false, dau: null, gDau: 10, nhuHoa: null, gNhuHoa: 1, gXanthan: 0, tocopherol: false, edta: false });
const MAY_MAC_DINH = () => ({ khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: false } });
const XONG_RONG = () => ({ khuay: false, dongHoa: false, do: false, tua: false });

const S = {
	nv: null,
	coc: COC_RONG(),
	may: MAY_MAC_DINH(),
	me: null,
	xong: XONG_RONG(),
	viTri: 'can',
	tram: 'can',
	ngay: 0,
	kq: null,
	dangChay: false,
	tab: 'tach',
	bq: { nhietDo: 25, sang: false },
};

const coMau = () => S.coc.nuoc && !!S.coc.dau;
function dongBo() {
	const c = S.coc;
	S.me = {
		dau: c.dau ?? 'huong-duong',
		phanTramDau: c.gDau,
		nhuHoa: c.nhuHoa,
		phanTramNhuHoa: c.gNhuHoa,
		phanTramXanthan: c.gXanthan,
		tocopherol: c.tocopherol,
		edta: c.edta,
		khuay: S.may.khuay,
		dongHoa: S.may.dongHoa,
		nhietVao: 25,
	};
}
function meThuc() {
	dongBo();
	const m = structuredClone(S.me);
	if (!S.xong.khuay) m.khuay = { rpm: 0, phut: 0 };
	if (!S.xong.dongHoa) m.dongHoa = { bar: 0, soLan: 0, lamLanh: false };
	return m;
}
function tinh() {
	S.kq = coMau() ? moPhongMe(meThuc()) : null;
}
function veLai() {
	tinh();
	veBuoc();
	veBang();
	capNhatCanh();
}

/* ---------------- linh vật "Giọt" ---------------- */
let hetGio = null;
function noi(chu, kieu = '') {
	const b = goc.querySelector('.pl-giot');
	if (!b) return;
	b.className = `pl-giot hien ${kieu}`;
	b.querySelector('.pl-giot-chu').innerHTML = chu;
	clearTimeout(hetGio);
	hetGio = setTimeout(() => b.classList.remove('moi'), 1200);
	b.classList.add('moi');
}

/* ---------------- khung trang ---------------- */
function khoiDong(el) {
	el.innerHTML = `
<section class="pl-nv" aria-label="Chọn nhiệm vụ"></section>
<div class="pl-khung">
  <div class="pl-canh-wrap">
    <div class="pl-giot" role="status" aria-live="polite"><svg viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2 C20 2 4 22 4 30 a16 16 0 0 0 32 0 C36 22 20 2 20 2z" class="than"/><circle cx="14" cy="30" r="2.6" class="mat"/><circle cx="26" cy="30" r="2.6" class="mat"/><path d="M14 37 q6 5 12 0" class="mieng"/><circle cx="11" cy="24" r="3" class="bong"/></svg><p class="pl-giot-chu"></p></div>
    <svg class="pl-canh" viewBox="0 10 1000 360" role="group" aria-label="Phòng thí nghiệm. Bấm tủ để mở, kéo cốc sang các máy">${veCanh()}</svg>
    <nav class="pl-buoc" aria-label="Các bước"></nav>
    <p class="pl-huong-dan">Mẹo: bấm vào tủ để mở, <b>kéo chai thả vào cốc</b>; rồi <b>kéo cốc</b> sang từng máy. Trên điện thoại có thể bấm thay vì kéo.</p>
  </div>
  <aside class="pl-bang" aria-live="polite"></aside>
</div>
<section class="pl-so-tay-wrap"></section>`;
	// Hộp tủ mở nằm thẳng dưới <body> để không bị thanh đầu trang che
	tuMoEl = document.createElement('div');
	tuMoEl.className = 'pl-tu-mo';
	tuMoEl.hidden = true;
	document.body.appendChild(tuMoEl);
	const svg = el.querySelector('.pl-canh');
	svg.addEventListener('click', (e) => {
		if (keoXong) return; // vừa kéo xong, không tính là bấm
		const tu = e.target.closest('[data-tu]');
		if (tu) return moTu(tu.dataset.tu);
		if (e.target.closest('[data-nuoc]')) return themNuoc();
		const t = e.target.closest('[data-tram]');
		if (t) moTram(t.dataset.tram);
	});
	svg.addEventListener('keydown', (e) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		const g = e.target.closest('[data-tu],[data-nuoc],[data-tram]');
		if (!g) return;
		e.preventDefault();
		if (g.dataset.tu) moTu(g.dataset.tu);
		else if (g.dataset.nuoc !== undefined) themNuoc();
		else moTram(g.dataset.tram);
	});
	ganKeoCoc(svg);
	veNhiemVu();
	dongBo();
	veLai();
	veSoTay();
	setTimeout(() => noi('Chào bạn, mình là <b>Giọt</b>! Bấm vào <b>tủ dầu béo</b> để chọn dầu, rồi kéo chai thả vào cốc trên cân nhé.'), 400);
}

const TRAM = [
	{ id: 'can', ten: 'Nguyên liệu', so: 1 },
	{ id: 'khuay', ten: 'Khuấy', so: 2 },
	{ id: 'dongHoa', ten: 'Đồng hóa', so: 3 },
	{ id: 'do', ten: 'Đo hạt', so: 4 },
	{ id: 'tua', ten: 'Bảo quản', so: 5 },
];
const TEN_TRAM = { can: 'cân', khuay: 'máy khuấy', dongHoa: 'máy đồng hóa', do: 'máy đo hạt', tua: 'tủ bảo quản' };

function moTram(id) {
	if (S.dangChay) return;
	S.tram = id;
	veBuoc();
	veBang();
	capNhatCanh();
	if (matchMedia('(max-width: 60rem)').matches) goc.querySelector('.pl-bang').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function veBuoc() {
	const daXong = { can: coMau(), ...S.xong };
	goc.querySelector('.pl-buoc').innerHTML = TRAM.map(
		(t) => `<button type="button" class="pl-chip${S.tram === t.id ? ' dang' : ''}${daXong[t.id] ? ' xong' : ''}" data-chip="${t.id}"><span>${daXong[t.id] ? '✓' : t.so}</span>${t.ten}</button>`,
	).join('');
	goc.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('click', () => moTram(b.dataset.chip)));
}

/* ---------------- nhiệm vụ ---------------- */
function veNhiemVu() {
	const sao = docLS('pl:sao', {});
	const the = (id, ten, de, s) =>
		`<button type="button" class="pl-the-nv${(S.nv?.id ?? 'tu-do') === id ? ' chon' : ''}" data-nv="${id}">
  <span class="pl-nv-ten">${ten}</span><span class="pl-nv-de">${de}</span>
  ${s === null ? '<span class="pl-nv-sao tu-do">Thử gì cũng được</span>' : `<span class="pl-nv-sao" aria-label="${s} trên 3 sao">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</span>`}
</button>`;
	goc.querySelector('.pl-nv').innerHTML =
		`<h2 class="pl-h">Chọn nhiệm vụ</h2><div class="pl-ds-nv">` +
		NHIEM_VU.map((n) => the(n.id, n.ten, n.de, sao[n.id] ?? 0)).join('') +
		the('tu-do', 'Phòng lab tự do', 'Không đề bài, không chấm điểm. Thử mọi công thức và xem chuyện gì xảy ra.', null) +
		`</div>`;
	goc.querySelectorAll('[data-nv]').forEach((b) => b.addEventListener('click', () => chonNhiemVu(NHIEM_VU.find((n) => n.id === b.dataset.nv) ?? null)));
}
function chonNhiemVu(nv) {
	S.nv = nv;
	S.coc = COC_RONG();
	S.may = MAY_MAC_DINH();
	S.xong = XONG_RONG();
	S.viTri = 'can';
	S.tram = 'can';
	S.ngay = 0;
	S.tab = nv?.id === 'omega-3' ? 'oxy' : 'tach';
	S.bq = { nhietDo: nv?.baoQuan?.nhietDo ?? 25, sang: false };
	veNhiemVu();
	veLai();
	const can = nv?.coDinh ?? {};
	noi(nv ? `Nhiệm vụ mới! Đề bài cần <b>${soCD(can.phanTramDau)}% ${h(DAU[can.dau].ten.toLowerCase())}</b>${can.nhuHoa ? ` và <b>${h(NHU_HOA[can.nhuHoa].ten.split(' (')[0])}</b>` : ''}. Mở tủ lấy nguyên liệu nhé.` : 'Phòng lab tự do: muốn thử gì cũng được!');
}

/* ---------------- cốc: thêm, bớt nguyên liệu ---------------- */
function doiMe(chu) {
	const coMayDaChay = S.xong.khuay || S.xong.dongHoa || S.xong.do || S.xong.tua;
	S.xong = XONG_RONG();
	if (S.viTri !== 'can') S.viTri = 'can';
	if (coMayDaChay) noi(`${chu} Công thức đã đổi nên đây là <b>mẻ mới</b>: cốc quay về cân, các máy phải chạy lại.`);
	else if (chu) noi(chu);
}

/** Thêm một món vào cốc. Trả về false nếu đề bài không cho phép. */
function themVaoCoc(mon) {
	const c = S.coc;
	const cd = S.nv?.coDinh ?? {};
	if (S.viTri !== 'can') {
		S.viTri = 'can';
	}
	if (mon.loai === 'dau') {
		if (cd.dau && cd.dau !== mon.khoa) {
			noi(`Đề bài yêu cầu <b>${h(DAU[cd.dau].ten.toLowerCase())}</b>, không phải ${h(mon.ten.toLowerCase())}.`, 'lo');
			return false;
		}
		const doi = c.dau && c.dau !== mon.khoa;
		c.dau = mon.khoa;
		c.gDau = cd.phanTramDau ?? c.gDau;
		const U = doKhongNo(DAU[mon.khoa]);
		doiMe(doi ? `Đã đổi sang ${h(mon.ten.toLowerCase())} (mỗi mẻ chỉ một loại dầu).` : `${h(mon.ten)}: độ không no U ≈ ${soCD(U)}. ${U > 60 ? 'Khá dễ ôi đấy!' : U < 20 ? 'Rất bền oxy hóa.' : 'Bền vừa phải.'}${c.nuoc ? '' : ' Nhớ thêm <b>nước cất</b> từ bình trên tường.'}`);
	} else if (mon.loai === 'nhuHoa') {
		if (cd.nhuHoa && cd.nhuHoa !== mon.khoa) {
			noi(`Đề bài bắt buộc dùng <b>${h(NHU_HOA[cd.nhuHoa].ten.split(' (')[0])}</b>.`, 'lo');
			return false;
		}
		const nh = NHU_HOA[mon.khoa];
		const doi = c.nhuHoa && c.nhuHoa !== mon.khoa;
		c.nhuHoa = mon.khoa;
		doiMe(doi ? `Đã đổi chất nhũ hóa sang ${h(nh.ten.split(' (')[0])}.` : nh.loai === 'WO' ? `Hmm, ${h(nh.ten.split(' (')[0])} có HLB thấp, ưa dầu… bạn chắc chứ?` : `${h(nh.ten.split(' (')[0])} vào cốc rồi.`);
	} else if (mon.loai === 'xanthan') {
		c.gXanthan = c.gXanthan || 0.2;
		doiMe('Xanthan làm đặc pha nước. Nhưng cẩn thận: dùng ít quá có khi còn tệ hơn không dùng!');
	} else if (mon.loai === 'tocopherol') {
		c.tocopherol = true;
		doiMe('Tocopherol (200 ppm) sẽ bắt gốc tự do, làm chậm dầu bị ôi.');
	} else if (mon.loai === 'edta') {
		c.edta = true;
		doiMe('EDTA (50 ppm) khóa ion sắt và đồng trong nước, là thứ châm ngòi cho oxy hóa.');
	}
	return true;
}
function boKhoiCoc(loai) {
	const c = S.coc;
	const cd = S.nv?.coDinh ?? {};
	if ((loai === 'dau' && cd.dau) || (loai === 'nhuHoa' && cd.nhuHoa)) return noi('Thành phần này là đề bài cố định, không bỏ được.', 'lo');
	if (loai === 'dau') c.dau = null;
	if (loai === 'nuoc') c.nuoc = false;
	if (loai === 'nhuHoa') c.nhuHoa = null;
	if (loai === 'xanthan') c.gXanthan = 0;
	if (loai === 'tocopherol') c.tocopherol = false;
	if (loai === 'edta') c.edta = false;
	doiMe('');
	veLai();
	veTuMo();
}
function themNuoc() {
	if (S.coc.nuoc) return noi('Cốc đã có nước cất rồi. Lượng nước tự bù cho đủ 100 g.');
	S.coc.nuoc = true;
	S.viTri = 'can';
	doiMe(S.coc.dau ? 'Nước vào rồi! Dầu nổi thành lớp trên mặt nước. Giờ kéo cốc sang <b>máy khuấy</b>.' : 'Nước vào rồi! Giờ mở <b>tủ dầu béo</b> lấy dầu.');
	const coc = goc.querySelector('.pl-coc');
	coc?.classList.add('rot');
	setTimeout(() => coc?.classList.remove('rot'), 900);
	veLai();
	veTuMo();
}

/* ---------------- bảng điều khiển từng trạm ---------------- */
function veBang() {
	const b = goc.querySelector('.pl-bang');
	const ham = { can: bangCan, khuay: bangKhuay, dongHoa: bangDongHoa, do: bangDo, tua: bangTua, 'so-tay': bangSoTayNgan }[S.tram];
	b.innerHTML = (S.nv ? `<div class="pl-de"><b>Nhiệm vụ:</b> ${h(S.nv.de)}</div>` : '') + ham();
	b.querySelectorAll('[data-o]').forEach((o) => o.addEventListener('input', () => doiThongSo(o)));
	b.querySelectorAll('[data-lam]').forEach((n) => n.addEventListener('click', () => LAM[n.dataset.lam](n)));
	b.querySelectorAll('[data-bo]').forEach((n) => n.addEventListener('click', () => boKhoiCoc(n.dataset.bo)));
	b.querySelectorAll('[data-mo-tu]').forEach((n) => n.addEventListener('click', () => moTu(n.dataset.moTu)));
	b.querySelectorAll('[data-dua]').forEach((n) => n.addEventListener('click', () => duaCocToi(n.dataset.dua)));
	b.querySelectorAll('[data-tab]').forEach((n) =>
		n.addEventListener('click', () => {
			S.tab = n.dataset.tab;
			veBang();
		}),
	);
	b.querySelectorAll('[data-bq]').forEach((n) =>
		n.addEventListener('click', () => {
			S.bq[n.dataset.bq] = n.dataset.bq === 'sang' ? n.dataset.v === '1' : +n.dataset.v;
			veBang();
			capNhatCanh();
		}),
	);
	b.querySelectorAll('[data-ngay]').forEach((n) =>
		n.addEventListener('click', () => {
			S.ngay = +n.dataset.ngay;
			veBang();
			capNhatCanh();
		}),
	);
}

function thanhTruot(k, nhan, min, max, buoc, giaTri, donVi, hien = (v) => soCD(v), khoa = false) {
	return `<label class="pl-o${khoa ? ' khoa' : ''}"><span class="pl-o-nhan">${nhan}${khoa ? ' <small>🔒 đề bài cố định</small>' : ''}</span>
<span class="pl-o-dong"><input type="range" data-o="${k}" min="${min}" max="${max}" step="${buoc}" value="${giaTri}" ${khoa ? 'disabled' : ''}/>
<output>${hien(giaTri)} ${donVi}</output></span></label>`;
}
const dauBang = (tieuDe, moTa, bieuTuong) =>
	`<header class="pl-bang-dau"><span class="pl-bt" aria-hidden="true">${bieuTuong}</span><div><h3>${tieuDe}</h3><p>${moTa}</p></div></header>`;

function canCoc(tram) {
	if (!coMau()) return `<p class="pl-canh-bao">Cốc chưa sẵn sàng: cần có <b>nước cất</b> và <b>dầu</b>. <button type="button" class="pl-link" data-lam="toiCan">Về bàn cân</button></p>`;
	if (S.viTri !== tram) return `<p class="pl-canh-bao">Cốc đang ở ${TEN_TRAM[S.viTri]}. Kéo cốc trong hình thả vào ${TEN_TRAM[tram]}, hoặc <button type="button" class="pl-link" data-dua="${tram}">mang cốc tới đây</button>.</p>`;
	return '';
}

function dongCoc(loai, ten, chiTiet, thanh = '') {
	return `<li class="pl-dong-coc"><div class="pl-dong-dau"><span class="pl-cham pl-cham-${loai}"></span><b>${ten}</b><span class="pl-dong-ct">${chiTiet}</span><button type="button" class="pl-bo" data-bo="${loai}" aria-label="Bỏ ${h(ten)} khỏi cốc">✕</button></div>${thanh}</li>`;
}
function bangCan() {
	const c = S.coc;
	const cd = S.nv?.coDinh ?? {};
	const ds = [];
	if (c.dau) ds.push(dongCoc('dau', DAU[c.dau].ten, '', thanhTruot('gDau', 'Lượng dầu', 1, 40, 1, c.gDau, 'g', undefined, cd.phanTramDau != null)));
	if (c.nhuHoa) ds.push(dongCoc('nhuHoa', NHU_HOA[c.nhuHoa].ten.split(' (')[0], '', thanhTruot('gNhuHoa', 'Lượng chất nhũ hóa', 0.05, 3, 0.05, c.gNhuHoa, 'g', (v) => soCD(v, 2))));
	if (c.gXanthan) ds.push(dongCoc('xanthan', 'Xanthan gum', '', thanhTruot('gXanthan', 'Lượng xanthan', 0.01, 0.5, 0.01, c.gXanthan, 'g', (v) => soCD(v, 2))));
	if (c.tocopherol) ds.push(dongCoc('tocopherol', 'Tocopherol', '200 ppm'));
	if (c.edta) ds.push(dongCoc('edta', 'EDTA', '50 ppm'));
	const gKhac = (c.dau ? c.gDau : 0) + (c.nhuHoa ? c.gNhuHoa : 0) + c.gXanthan;
	if (c.nuoc) ds.push(dongCoc('nuoc', 'Nước cất', `${soCD(100 - gKhac)} g (tự bù đủ 100 g)`));
	const thieu = [!c.nuoc && 'nước cất (bấm bình trên tường)', !c.dau && 'dầu (tủ dầu béo)'].filter(Boolean);
	return (
		dauBang('Cốc trên cân', 'Mở tủ, kéo chai thả vào cốc (hoặc bấm chai rồi bấm “Cho vào cốc”). Cốc luôn là 100 g, nước tự bù phần còn lại.', '⚖️') +
		`<div class="pl-nut-tu">
  <button type="button" class="pl-nut-tu-1" data-mo-tu="tu-dau">🛢️ Tủ dầu béo</button>
  <button type="button" class="pl-nut-tu-1" data-mo-tu="tu-nhu-hoa">🧴 Tủ nhũ hóa & ổn định</button>
  <button type="button" class="pl-nut-tu-1" data-mo-tu="tu-phu-gia">🧪 Tủ phụ gia</button>
  <button type="button" class="pl-nut-tu-1" data-lam="nuoc">💧 Nước cất</button>
</div>` +
		(ds.length ? `<ul class="pl-ds-coc">${ds.join('')}</ul>` : `<p class="pl-meo">Cốc đang trống.</p>`) +
		(thieu.length
			? `<p class="pl-meo">Còn thiếu: ${thieu.join(', ')}.</p>`
			: `<p class="pl-ok">Cốc sẵn sàng. ${c.nhuHoa ? '' : '<b>Chưa có chất nhũ hóa</b>, cứ thử nếu bạn tò mò. '}Kéo cốc sang máy khuấy, hoặc <button type="button" class="pl-link" data-dua="khuay">mang cốc sang máy khuấy</button>.</p>`)
	);
}

function bangKhuay() {
	const k = S.may.khuay;
	return (
		dauBang('Máy khuấy tốc độ cao (rotor–stator)', 'Đầu rotor quay trong lồng stator, xé dầu thành giọt cỡ vài chục µm: đây là bước tạo <b>tiền nhũ</b>. Giọt còn to, nhưng giúp máy đồng hóa làm việc hiệu quả hơn.', '🌀') +
		canCoc('khuay') +
		`<div class="pl-luoi">` +
		thanhTruot('khuay.rpm', 'Tốc độ', 2000, 20000, 500, k.rpm, 'vòng/phút', (v) => v.toLocaleString('vi-VN')) +
		thanhTruot('khuay.phut', 'Thời gian', 0.5, 10, 0.5, k.phut, 'phút') +
		`</div><button type="button" class="pl-nut" data-lam="khuay" ${coMau() && S.viTri === 'khuay' ? '' : 'disabled'}>▶ Chạy máy khuấy</button>` +
		(S.xong.khuay && S.kq ? `<p class="pl-ok">Tiền nhũ xong: giọt cỡ ${so(S.kq.dPre)} µm. Mẫu đục, nhưng để yên vài phút là tách. Kéo cốc sang máy đồng hóa.</p>` : '') +
		`<p class="pl-meo">Có thể bỏ qua bước này và cho thẳng vào máy đồng hóa, nhưng hãy xem chuyện gì xảy ra.</p>`
	);
}

function bangDongHoa() {
	const d = S.may.dongHoa;
	const kq = S.kq;
	return (
		dauBang('Máy đồng hóa áp suất cao', 'Bơm piston ép mẫu qua khe van rất hẹp. Dòng chảy rối, lực cắt và cavitation xé giọt xuống dưới 1 µm. Áp suất càng cao, giọt càng nhỏ, và mẫu càng nóng.', '🔩') +
		canCoc('dongHoa') +
		`<div class="pl-luoi">` +
		thanhTruot('dongHoa.bar', 'Áp suất', 50, 1500, 10, d.bar, 'bar', (v) => v.toLocaleString('vi-VN')) +
		thanhTruot('dongHoa.soLan', 'Số lần qua máy', 1, 5, 1, d.soLan, 'lần') +
		`<label class="pl-o pl-tick"><input type="checkbox" data-o="dongHoa.lamLanh" ${d.lamLanh ? 'checked' : ''}/> Làm lạnh mẫu về 25 °C giữa các lần qua máy</label>` +
		`</div><button type="button" class="pl-nut" data-lam="dongHoa" ${coMau() && S.viTri === 'dongHoa' ? '' : 'disabled'}>▶ Chạy máy đồng hóa</button>` +
		(S.xong.dongHoa && kq ? `<p class="pl-ok">Xong ${d.soLan} lần ở ${d.bar.toLocaleString('vi-VN')} bar. Nhiệt độ mẫu ra: <b>${soCD(kq.nhietRa)} °C</b>. Kéo cốc sang máy đo hạt.</p>` : '') +
		`<p class="pl-meo">Mỗi 100 bar làm mẫu nóng thêm khoảng 2,4 °C ${nhanHTML(NHAN.nhiet)}. Áp suất được biến gần hết thành nhiệt.</p>`
	);
}

function bangDo() {
	const dau = dauBang('Máy đo kích thước hạt', 'Chiếu laser qua mẫu, đo ánh sáng tán xạ để suy ra phân bố kích thước giọt.', '🔬');
	if (!S.xong.do) return dau + (canCoc('do') || `<p class="pl-meo">Đặt cốc vào máy là máy tự đo.</p>`);
	const kq = S.kq;
	const giaiHan = kq.thieuNhuHoa ? 'chất nhũ hóa' : S.xong.dongHoa ? 'năng lượng máy đồng hóa' : S.xong.khuay ? 'máy khuấy' : 'chưa trộn';
	return (
		dau +
		`<div class="pl-so-lon">
  <div><span>d₃₂</span><b>${so(kq.d32)} µm</b><small>trung bình theo diện tích</small></div>
  <div><span>d₄₃</span><b>${so(kq.d43)} µm</b><small>trung bình theo thể tích</small></div>
  <div><span>d₉₀</span><b>${so(kq.dv90)} µm</b><small>90% thể tích nhỏ hơn</small></div>
</div>
<div class="pl-hai-cot">
  <figure class="pl-bieu-do">${veBieuDo(kq)}<figcaption>Phân bố theo thể tích (trục ngang chia log)</figcaption></figure>
  <figure class="pl-kinh">${veKinh(kq)}<figcaption>Dưới kính hiển vi (minh họa)</figcaption></figure>
</div>
<p class="pl-meo">Kích thước giọt đang bị giới hạn bởi: <b>${giaiHan}</b>.${kq.nhuHoaToiThieu ? ` Để phủ hết bề mặt giọt cỡ này cần tối thiểu ≈ ${so(kq.nhuHoaToiThieu)}% chất nhũ hóa ${nhanHTML(NHAN.gamma)}.` : ''}</p>
<p class="pl-ok">Kéo cốc vào <b>tủ bảo quản</b> để tua nhanh thời gian, hoặc <button type="button" class="pl-link" data-dua="tua">mang cốc tới đó</button>.</p>`
	);
}

function bangTua() {
	const dau0 = dauBang('Tủ bảo quản tua nhanh', 'Rót mẫu vào ống nghiệm, để yên, rồi tua nhanh nhiều ngày.', '⏳');
	if (!S.xong.tua) return dau0 + (canCoc('tua') || '');
	const kq = S.kq;
	const max = Math.max(90, (S.nv?.ngay ?? 30) * 2);
	const o = kq.ongNghiem(S.ngay, S.bq.nhietDo);
	const moc = [0, 1, 7, 14, 30, 60, 90].filter((x) => x <= max);
	const khoaNhiet = !!S.nv?.baoQuan;
	const dieuKien = `<div class="pl-dk">
  <div class="pl-moc" role="group" aria-label="Nhiệt độ bảo quản"><span>Nhiệt độ${khoaNhiet ? ' 🔒' : ''}:</span>${[4, 25, 35, 45].map((t) => `<button type="button" data-bq="nhietDo" data-v="${t}" class="${S.bq.nhietDo === t ? 'dang' : ''}" ${khoaNhiet ? 'disabled' : ''}>${t} °C</button>`).join('')}</div>
  <div class="pl-moc" role="group" aria-label="Loại chai"><span>Chai:</span><button type="button" data-bq="sang" data-v="0" class="${!S.bq.sang ? 'dang' : ''}">Chai tối màu</button><button type="button" data-bq="sang" data-v="1" class="${S.bq.sang ? 'dang' : ''}">Chai trong, để dưới đèn</button></div>
</div>`;
	const thoiGian = `<label class="pl-o"><span class="pl-o-nhan">Thời gian: <b>${S.ngay} ngày</b></span>
      <input type="range" min="0" max="${max}" step="1" value="${S.ngay}" data-o="ngay"/></label>
    <div class="pl-moc">${moc.map((x) => `<button type="button" data-ngay="${x}" class="${x === S.ngay ? 'dang' : ''}">${x === 0 ? 'Ngay sau' : x + ' ngày'}</button>`).join('')}</div>`;
	const tabs = `<div class="pl-tabs" role="tablist"><button type="button" role="tab" data-tab="tach" aria-selected="${S.tab === 'tach'}">🧪 Tách lớp</button><button type="button" role="tab" data-tab="oxy" aria-selected="${S.tab === 'oxy'}">🔥 Oxy hóa (ôi dầu)</button></div>`;
	const nut =
		(S.nv
			? `<button type="button" class="pl-nut chinh" data-lam="nop">Nộp mẻ để chấm (${S.nv.ngay} ngày${S.nv.baoQuan ? ', ' + S.nv.baoQuan.nhietDo + ' °C' : ''})</button>`
			: `<button type="button" class="pl-nut chinh" data-lam="nop">Ghi mẻ vào sổ tay</button>`) + `<div class="pl-ket-qua"></div>`;
	if (S.tab === 'oxy') {
		const ox = kq.oxyHoa(S.ngay, S.bq.nhietDo, S.bq.sang);
		return (
			dauBang('Tủ bảo quản tua nhanh', 'Dầu trong giọt bị oxy tấn công ở nối đôi. Lúc đầu gần như không đổi (giai đoạn cảm ứng), sau đó peroxide tăng vọt và dầu bắt đầu có mùi ôi.', '⏳') +
			tabs +
			dieuKien +
			`<div class="pl-tua-phai">${thoiGian}</div>
<figure class="pl-bieu-do">${veDoThiPV(kq, max)}<figcaption>Chỉ số peroxide (meq O₂/kg dầu) theo ngày</figcaption></figure>
<div class="pl-so-lon">
  <div><span>Peroxide ngày ${S.ngay}</span><b>${soCD(ox.pv)}</b><small>${ox.pv < 10 ? 'chưa ôi' : 'đã ôi'}</small></div>
  <div><span>Giai đoạn cảm ứng</span><b>${so(ox.ip, 3)} ngày</b><small>ở ${S.bq.nhietDo} °C</small></div>
  <div><span>Độ không no U</span><b>${soCD(ox.U)}</b><small>càng cao càng dễ ôi</small></div>
</div>
<p class="pl-meo">Muốn biết hạn dùng nhanh, người ta ủ ở 35–45 °C rồi ngoại suy về nhiệt độ thường bằng Q10 ${nhanHTML(NHAN.q10)}. Thử bấm 45 °C rồi 25 °C để thấy thời gian cảm ứng thay đổi thế nào. Ngoài đời, ngoại suy kiểu này có thể sai nhiều lần.</p>` +
			nut
		);
	}
	return (
		dauBang('Tủ bảo quản tua nhanh', `Ống nghiệm cao 100 mm đứng yên ở ${S.bq.nhietDo} °C. Giọt dầu nhẹ hơn nước nên nổi lên theo định luật Stokes.`, '⏳') +
		tabs +
		dieuKien +
		`<div class="pl-tua">
  <div class="pl-ong-lon">${veOng(o, kq, 120, 300)}</div>
  <div class="pl-tua-phai">
    ${thoiGian}
    <dl class="pl-lop">
      ${o.vangDau > 0.05 ? `<div><dt><i class="vang"></i>Váng dầu</dt><dd>${soCD(o.vangDau)} mm</dd></div>` : ''}
      <div><dt><i class="kem"></i>Lớp kem</dt><dd>${soCD(o.kem)} mm</dd></div>
      <div><dt><i class="duc"></i>Vùng còn đục đều</dt><dd>${soCD(o.duc)} mm</dd></div>
      <div><dt><i class="serum"></i>Lớp nước trong (serum)</dt><dd>${soCD(o.serum)} mm</dd></div>
    </dl>
    <p class="pl-ci">Chỉ số kem hóa <abbr title="Chiều cao lớp serum / chiều cao ống × 100">CI</abbr> = <b>${soCD(o.CI)}%</b></p>
  </div>
</div>` +
		nut
	);
}
function bangSoTayNgan() {
	return dauBang('Sổ tay thí nghiệm', 'Mọi mẻ bạn đã ghi nằm ở bảng bên dưới phòng lab, lưu trên máy này.', '📓') + `<button type="button" class="pl-nut" data-lam="cuonSoTay">Xem sổ tay</button>`;
}

/* ---------------- hành động ---------------- */
function doiThongSo(o) {
	const k = o.dataset.o;
	const v = o.type === 'checkbox' ? o.checked : parseFloat(o.value);
	if (k === 'ngay') {
		S.ngay = v;
		veBang();
		capNhatCanh();
		goc.querySelector('[data-o="ngay"]')?.focus();
		return;
	}
	if (['gDau', 'gNhuHoa', 'gXanthan'].includes(k)) {
		S.coc[k] = v;
		if (S.xong.khuay || S.xong.dongHoa || S.xong.do || S.xong.tua) {
			doiMe('Đổi lượng cân.');
			veBuoc();
		}
	} else {
		const [may, ts] = k.split('.');
		S.may[may][ts] = v;
		if (may === 'khuay' && S.xong.khuay) S.xong = { ...S.xong, khuay: false, dongHoa: false, do: false, tua: false };
		if (may === 'dongHoa' && S.xong.dongHoa) S.xong = { ...S.xong, dongHoa: false, do: false, tua: false };
		veBuoc();
	}
	tinh();
	if (o.type === 'range') {
		const out = o.closest('.pl-o')?.querySelector('output');
		if (out) {
			const dv = out.textContent.split(' ').slice(1).join(' ');
			out.textContent = `${k.includes('rpm') || k.includes('bar') ? v.toLocaleString('vi-VN') : soCD(v, 2)} ${dv}`;
		}
		goc.querySelectorAll('.pl-bang .pl-ok').forEach((p) => p.remove());
		capNhatCanh();
	} else {
		veBang();
		capNhatCanh();
	}
}

function chay(tenMay, ms, xong) {
	S.dangChay = true;
	const may = goc.querySelector(`[data-may="${tenMay}"]`);
	may?.classList.add('chay');
	goc.querySelector('.pl-coc')?.classList.add('lac');
	goc.querySelectorAll('.pl-bang .pl-nut').forEach((n) => (n.disabled = true));
	setTimeout(() => {
		may?.classList.remove('chay');
		goc.querySelector('.pl-coc')?.classList.remove('lac');
		S.dangChay = false;
		xong();
	}, GIAM_CHUYEN_DONG ? 50 : ms);
}

/** Đặt cốc vào một trạm (sau khi kéo thả hoặc bấm "mang cốc tới đây") */
function duaCocToi(tram) {
	if (S.dangChay) return;
	if (tram !== 'can' && !coMau()) {
		noi('Cốc còn thiếu ' + [!S.coc.nuoc && '<b>nước cất</b>', !S.coc.dau && '<b>dầu</b>'].filter(Boolean).join(' và ') + '. Chuẩn bị ở bàn cân trước nhé.', 'lo');
		S.viTri = 'can';
		capNhatCanh();
		return;
	}
	S.viTri = tram;
	if (tram === 'do') {
		S.xong.do = true;
		tinh();
		const kq = S.kq;
		noi(
			kq.d43 < 1
				? `Giọt mịn quá! d₄₃ ≈ <b>${so(kq.d43)} µm</b>. Giờ đặt cốc vào tủ bảo quản xem có giữ được không.`
				: kq.d43 < 5
					? `d₄₃ ≈ <b>${so(kq.d43)} µm</b>. Tạm được, nhưng giọt cỡ này nổi khá nhanh đấy.`
					: `Ối, d₄₃ ≈ <b>${so(kq.d43)} µm</b>, giọt to như hạt cát nhỏ! ${S.xong.dongHoa ? 'Thử áp suất cao hơn?' : 'Bạn chưa qua máy đồng hóa mà.'}`,
			kq.d43 < 1 ? 'vui' : kq.d43 < 5 ? '' : 'lo',
		);
	} else if (tram === 'tua') {
		if (!S.xong.do) noi('Bạn chưa đo kích thước hạt, nhưng không sao, cứ xem mẻ này để lâu thế nào.');
		S.xong.tua = true;
		S.ngay = S.nv?.ngay ?? 30;
		tinh();
		const o = S.kq.ongNghiem(S.ngay, S.bq.nhietDo);
		if (!S.xong.do) {
		} else if (o.vangDau > 1) noi('Có <b>váng dầu</b> nổi trên cùng: giọt đã hợp nhất lại. Xem phần "Vì sao?" khi nộp mẻ.', 'lo');
		else if (o.CI > 10) noi(`Sau ${S.ngay} ngày, lớp nước trong ở đáy cao ${soCD(o.serum)} mm. Tách lớp rồi!`, 'lo');
		else noi(`Sau ${S.ngay} ngày ống nghiệm vẫn khá đều. Kéo thanh thời gian để xem tiếp, hoặc chuyển sang tab Oxy hóa.`, 'vui');
	} else if (tram === 'khuay' && !S.xong.khuay) noi('Đặt thông số rồi bấm <b>Chạy máy khuấy</b>.');
	else if (tram === 'dongHoa' && !S.xong.dongHoa) noi(S.xong.khuay ? 'Chọn áp suất và số lần qua máy. Nhớ để ý nhiệt độ!' : 'Chưa khuấy tiền nhũ mà cho thẳng vào máy đồng hóa à? Được thôi, xem chuyện gì xảy ra nhé.');
	S.tram = tram;
	veBuoc();
	veBang();
	capNhatCanh();
}

const LAM = {
	toiCan: () => duaCocToi('can'),
	nuoc: () => themNuoc(),
	khuay: () =>
		chay('khuay', 1500, () => {
			S.xong = { ...S.xong, khuay: true, dongHoa: false, do: false, tua: false };
			tinh();
			veLai();
			noi(`Vù vù! Tiền nhũ xong, giọt cỡ <b>${so(S.kq.dPre)} µm</b>. Vẫn to lắm, kéo cốc sang <b>máy đồng hóa</b> nhé.`);
		}),
	dongHoa: () => {
		const kim = goc.querySelector('.pl-kim');
		if (kim) kim.style.transform = `rotate(${-120 + (240 * S.may.dongHoa.bar) / 1500}deg)`;
		chay('dongHoa', 1100 + 500 * S.may.dongHoa.soLan, () => {
			S.xong = { ...S.xong, dongHoa: true, do: false, tua: false };
			tinh();
			veLai();
			const kq = S.kq;
			if (kq.bienTinh) noi(`Nóng quá! Mẫu ra <b>${soCD(kq.nhietRa)} °C</b>, protein bị biến tính rồi. Lần sau thử làm lạnh giữa các lần qua máy.`, 'lo');
			else if (kq.thieuNhuHoa) noi('Máy chạy ngon, nhưng hình như chất nhũ hóa không đủ phủ hết các giọt mới…', 'lo');
			else noi(`Xong! Mẫu ra ${soCD(kq.nhietRa)} °C. Kéo cốc sang <b>máy đo hạt</b> xem giọt nhỏ cỡ nào.`, 'vui');
		});
	},
	nop: () => {
		const kq = S.kq;
		const m = meThuc();
		let kqSao = null;
		if (S.nv) {
			kqSao = chamSao(S.nv, kq, S.bq);
			const sao = docLS('pl:sao', {});
			sao[S.nv.id] = Math.max(sao[S.nv.id] ?? 0, kqSao.sao);
			ghiLS('pl:sao', sao);
			S.ngay = S.nv.ngay;
		}
		const ngayGhi = S.nv?.ngay ?? S.ngay;
		const nhietGhi = S.nv?.baoQuan?.nhietDo ?? S.bq.nhietDo;
		const o = kq.ongNghiem(ngayGhi, nhietGhi);
		const pv = kq.oxyHoa(ngayGhi, nhietGhi, S.bq.sang).pv;
		const st = docLS('pl:so-tay', []);
		st.unshift({
			luc: Date.now(),
			nv: S.nv?.ten ?? 'Tự do',
			ct: `${soCD(m.phanTramDau)}% ${DAU[m.dau].ten.replace('Dầu ', '')} · ${m.nhuHoa ? soCD(m.phanTramNhuHoa, 2) + '% ' + NHU_HOA[m.nhuHoa].ten.split(' (')[0] : 'không nhũ hóa'}${m.phanTramXanthan ? ' · xanthan ' + soCD(m.phanTramXanthan, 2) + '%' : ''}${m.tocopherol ? ' · tocopherol' : ''}${m.edta ? ' · EDTA' : ''}`,
			qt: `${m.khuay.rpm ? (m.khuay.rpm / 1000).toLocaleString('vi-VN') + 'k vòng ' + soCD(m.khuay.phut) + "'" : 'không khuấy'} · ${m.dongHoa.bar ? m.dongHoa.bar + ' bar × ' + m.dongHoa.soLan + (m.dongHoa.lamLanh ? ' (làm lạnh)' : '') : 'không đồng hóa'}`,
			d43: kq.d43,
			ngay: ngayGhi,
			ci: o.CI,
			pv,
			nhiet: nhietGhi,
			sao: kqSao?.sao ?? null,
		});
		ghiLS('pl:so-tay', st.slice(0, SO_MAU_TOI_DA));
		veBang();
		capNhatCanh();
		veSoTay();
		veNhiemVu();
		const kqEl = goc.querySelector('.pl-ket-qua');
		kqEl.innerHTML = veKetQua(kq, kqSao, ngayGhi);
		kqEl.querySelector('[data-lam="lamLai"]')?.addEventListener('click', LAM.lamLai);
		kqEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		if (kqSao) {
			noi(['Chưa được sao nào… đọc phần "Vì sao?" rồi thử lại nhé!', 'Một sao! Đọc "Vì sao?" để biết cần sửa gì.', 'Hai sao rồi, sắp hoàn hảo!', '🎉 Ba sao! Bạn đúng là dân R&D thực thụ!'][kqSao.sao], kqSao.sao === 3 ? 'vui' : kqSao.sao ? '' : 'lo');
			if (kqSao.sao === 3) phaoHoa();
		}
	},
	lamLai: () => {
		S.xong = XONG_RONG();
		S.viTri = 'can';
		S.ngay = 0;
		veLai();
		moTram('can');
		noi('Mẻ mới! Cốc vẫn giữ công thức cũ, bạn chỉnh lại hoặc chạy lại các máy nhé.');
	},
	cuonSoTay: () => goc.querySelector('.pl-so-tay-wrap').scrollIntoView({ behavior: 'smooth' }),
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

/* ---------------- tủ mở: kệ chai, kéo chai thả vào cốc ---------------- */
let tuDangMo = null;
let tuMoEl = null;
let monChon = null;
function moTu(id) {
	if (S.dangChay) return;
	tuDangMo = id;
	monChon = null;
	const el = tuMoEl;
	el.hidden = false;
	el.innerHTML = `<div class="pl-tu-nen" data-dong></div>
<div class="pl-tu-hop" role="dialog" aria-modal="true" aria-label="${h(TU[id].ten)}">
  <header class="pl-tu-dau"><div><h3>${h(TU[id].ten)}</h3><p>${h(TU[id].moTa)}</p></div><button type="button" class="pl-tu-dong" data-dong aria-label="Đóng tủ">✕</button></header>
  <div class="pl-tu-than">
    <div class="pl-tu-ke-wrap">
      <div class="pl-tu-ke"></div>
      <div class="pl-cua trai" aria-hidden="true"></div><div class="pl-cua phai" aria-hidden="true"></div>
    </div>
    <div class="pl-tu-ban">
      <div class="pl-dich" aria-label="Cốc trên cân: thả chai vào đây"></div>
      <div class="pl-the-mon"></div>
    </div>
  </div>
</div>`;
	el.querySelectorAll('[data-dong]').forEach((n) => n.addEventListener('click', dongTu));
	el.addEventListener('keydown', phimTu);
	veTuMo();
	setTimeout(() => el.querySelector('.pl-chai-nut:not([disabled])')?.focus(), GIAM_CHUYEN_DONG ? 0 : 500);
	if (id === 'tu-duoc') noi('Tủ dược đang khóa: mảng dược còn đang soạn tài liệu có nguồn.', 'lo');
}
function phimTu(e) {
	if (e.key === 'Escape') dongTu();
}
function dongTu() {
	const el = tuMoEl;
	el.hidden = true;
	el.innerHTML = '';
	el.removeEventListener('keydown', phimTu);
	tuDangMo = null;
	goc.querySelector(`[data-tu]`)?.focus?.();
}
const trongCoc = (mon) =>
	(mon.loai === 'dau' && S.coc.dau === mon.khoa) ||
	(mon.loai === 'nhuHoa' && S.coc.nhuHoa === mon.khoa) ||
	(mon.loai === 'xanthan' && S.coc.gXanthan > 0) ||
	(mon.loai === 'tocopherol' && S.coc.tocopherol) ||
	(mon.loai === 'edta' && S.coc.edta);

function chaiHTML(mon) {
	const khoa = !!mon.khoaMo;
	const de = S.nv?.coDinh && ((mon.loai === 'dau' && S.nv.coDinh.dau === mon.khoa) || (mon.loai === 'nhuHoa' && S.nv.coDinh.nhuHoa === mon.khoa));
	return `<button type="button" class="pl-chai-nut${khoa ? ' khoa' : ''}${trongCoc(mon) ? ' da-dung' : ''}${monChon === mon.id ? ' chon' : ''}${de ? ' de-bai' : ''}" data-mon="${mon.id}" aria-label="${h(mon.ten)}${khoa ? ' (đang khóa)' : ''}">
  <span class="pl-chai-hinh" style="--mau:${mon.mau}"><i class="nap"></i><i class="than"><em>${h(mon.nhan)}</em></i>${khoa ? '<i class="o-khoa">🔒</i>' : ''}${de ? '<i class="sao-de">★</i>' : ''}</span>
  <span class="pl-chai-ten">${h(mon.ten.replace(/ \(.*\)$/, ''))}</span>
</button>`;
}
function veTuMo() {
	if (!tuDangMo) return;
	const el = tuMoEl;
	const tu = TU[tuDangMo];
	el.querySelector('.pl-tu-ke').innerHTML = tu.mon.map(chaiHTML).join('');
	const c = S.coc;
	const gCan = c.nuoc ? 100 : (c.dau ? c.gDau : 0) + (c.nhuHoa ? c.gNhuHoa : 0) + c.gXanthan;
	el.querySelector('.pl-dich').innerHTML = `${veCocNho()}<div class="pl-can-so"><span>${soCD(gCan, 1)}</span> g</div><small>${c.nuoc ? 'Kéo chai thả vào cốc' : 'Kéo chai thả vào cốc. Nhớ thêm nước cất (bình trên tường)'}</small>`;
	const mon = tu.mon.find((m) => m.id === monChon);
	el.querySelector('.pl-the-mon').innerHTML = mon ? theMon(mon) : `<p class="pl-meo">Bấm vào một chai để xem thông tin. Kéo chai thả vào cốc để cho vào mẻ.</p>`;
	el.querySelectorAll('.pl-chai-nut').forEach((n) => ganKeoChai(n));
	el.querySelector('[data-cho]')?.addEventListener('click', () => {
		if (themVaoCoc(mon)) hieuUngRot(mon);
		veLai();
		veTuMo();
	});
	el.querySelector('[data-bo-mon]')?.addEventListener('click', () => boKhoiCoc(mon.loai));
	el.querySelectorAll('.pl-the-mon [data-o]').forEach((o) => o.addEventListener('input', () => doiThongSo(o)));
}

function thanhDo(nhan, gt, max, mau) {
	return `<div class="pl-thanh"><span>${nhan}</span><i style="--w:${Math.min(100, (gt / max) * 100)}%;--mau:${mau}"></i><b>${soCD(gt)}</b></div>`;
}
function theMon(mon) {
	if (mon.khoaMo) return `<h4>🔒 ${h(mon.ten)}</h4><p class="pl-meo">${h(mon.khoaMo)}</p>`;
	let noiDung = '';
	if (mon.loai === 'dau') {
		const d = DAU[mon.khoa];
		const U = doKhongNo(d);
		const ip = thoiGianCamUng({ dau: d });
		noiDung = `<p class="pl-meo">Giá trị điển hình dùng để mô phỏng ${nhanHTML({ ma: 'T' })}: ρ ${d.rho} kg/m³ · η ≈ ${d.eta} mPa·s</p>
${thanhDo('Oleic C18:1', d.c181, 100, '#e9b949')}${thanhDo('Linoleic C18:2', d.c182, 100, '#e07a2f')}${thanhDo('Linolenic C18:3', d.c183, 100, '#c4486b')}
<p class="pl-meo">Độ không no U = <b>${soCD(U)}</b> ${nhanHTML(NHAN.khongNo)} → bền oxy hóa ước tính ${so(ip, 2)} ngày ở 25 °C (trong nhũ tương, minh họa).</p>`;
	} else if (mon.loai === 'nhuHoa') {
		const n = NHU_HOA[mon.khoa];
		noiDung = `<p class="pl-meo">${h(n.ghiChu)}</p><p class="pl-meo">Độ phủ bề mặt Γ ≈ ${soCD(n.gamma)} mg/m²${n.gammaMinhHoa ? ` ${nhanHTML(NHAN.gammaMinhHoa)} số minh họa, chưa có nguồn` : ''}${n.nhayNhiet ? ` · trong mô phỏng bắt đầu biến tính từ ~${n.nhayNhiet} °C${n.nhayNhietMinhHoa ? ` ${nhanHTML(NHAN.nguongBienTinh)} số minh họa` : ''}` : ''}</p>`;
	} else if (mon.loai === 'xanthan')
		noiDung = `<p class="pl-meo">Polysaccharide chuỗi cứng, làm pha nước đặc lên rất mạnh dù chỉ dùng vài phần nghìn. Ít quá thì gây keo tụ do cạn kiệt; đủ nhiều thì tạo mạng giữ giọt đứng yên ${nhanHTML(NHAN.canKiet)}.</p>`;
	else if (mon.loai === 'tocopherol') noiDung = `<p class="pl-meo">Chất chống oxy hóa phá chuỗi: cho nguyên tử H để dập gốc peroxyl ${nhanHTML(NHAN.chongOxy)}.</p>`;
	else if (mon.loai === 'edta') noiDung = `<p class="pl-meo">Chất chống oxy hóa phòng ngừa: bắt ion Fe, Cu trong pha nước, nơi oxy hóa nhũ tương bắt đầu ${nhanHTML(NHAN.chongOxy)}.</p>`;
	const daCo = trongCoc(mon);
	return `<h4>${h(mon.ten)}</h4>${noiDung}${daCo ? `<p class="pl-ok">Đã có trong cốc. Chỉnh lượng ở bảng “Cốc trên cân”.</p><button type="button" class="pl-link" data-bo-mon>Bỏ khỏi cốc</button>` : `<button type="button" class="pl-nut" data-cho>Cho vào cốc</button>`}`;
}

/* Kéo chai: bấm giữ rồi kéo; nhả trên cốc thì cho vào. Bấm nhanh = chọn xem thông tin. */
function ganKeoChai(nut) {
	const mon = TU[tuDangMo].mon.find((m) => m.id === nut.dataset.mon);
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
			if (tren && ev.type === 'pointerup') {
				if (themVaoCoc(mon)) hieuUngRot(mon);
				monChon = mon.id;
				veLai();
				veTuMo();
			}
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
function veCocNho() {
	const c = S.coc;
	const dau = c.dau ? Math.max(4, c.gDau * 0.9) : 0;
	const nuoc = c.nuoc ? 52 - dau : 0;
	return `<svg viewBox="0 0 80 90" class="pl-coc-nho" aria-hidden="true">
<defs><clipPath id="pl-coc-nho-cat"><path d="M14 10 h52 l-4 68 a5 5 0 0 1 -5 5 h-34 a5 5 0 0 1 -5 -5 z"/></clipPath></defs>
<g clip-path="url(#pl-coc-nho-cat)">
${nuoc ? `<rect x="0" y="${83 - nuoc}" width="80" height="${nuoc}" class="coc-nuoc"/>` : ''}
${dau ? `<rect x="0" y="${83 - nuoc - dau}" width="80" height="${dau}" style="fill:${TU['tu-dau'].mon.find((m) => m.khoa === c.dau)?.mau}"/>` : ''}
${c.gXanthan ? `<g class="xanthan-soi">${[20, 34, 48, 58].map((x) => `<path d="M${x} 80 q4 -10 0 -18 q-4 -8 0 -16"/>`).join('')}</g>` : ''}
${c.nhuHoa ? `<g class="nh-cham">${[18, 30, 44, 56, 62, 26, 50].map((x, i) => `<circle cx="${x}" cy="${83 - nuoc - dau + 2 + (i % 3) * 3}" r="1.6"/>`).join('')}</g>` : ''}
</g>
<path d="M12 8 h56 l-4 70 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 z" class="coc-vien"/>
${[30, 45, 60].map((y) => `<line x1="56" y1="${y}" x2="62" y2="${y}" class="vach"/>`).join('')}
</svg>`;
}

/* ---------------- kết quả + "vì sao" ---------------- */
function veKetQua(kq, kqSao, ngay) {
	const nhiet = S.nv?.baoQuan?.nhietDo ?? S.bq.nhietDo;
	const o = kq.ongNghiem(ngay, nhiet);
	const ly = [];
	const dongHoa = S.xong.dongHoa ? S.me.dongHoa : null;
	if (kq.thieuNhuHoa)
		ly.push([NHAN.gamma, `Máy xé được tới ${so(Math.min(kq.dPre, kq.dE))} µm nhưng lượng chất nhũ hóa chỉ đủ phủ giọt cỡ ${so(kq.dGamma)} µm (d = 6φΓ/c). Tăng áp suất thêm cũng vô ích, phải tăng chất nhũ hóa.`]);
	else if (dongHoa)
		ly.push([NHAN.apSuat, `Ở ${dongHoa.bar.toLocaleString('vi-VN')} bar × ${dongHoa.soLan} lần, giọt xuống d₃₂ ≈ ${so(kq.d32)} µm. Muốn giọt nhỏ đi một nửa phải tăng áp suất khoảng 4 lần.`]);
	else ly.push([NHAN.hangSo, `Không qua máy đồng hóa nên giọt còn rất to (d₃₂ ≈ ${so(kq.d32)} µm). Máy khuấy chỉ tạo được tiền nhũ.`]);
	const etaNay = kq.etaC * (doNhotNuoc(nhiet) / doNhotNuoc(25));
	const vMm = stokes(kq.dv10, 1000, kq.rhoDau, etaNay).mmMoiNgay;
	ly.push([NHAN.stokes, `Giọt cỡ d₁₀ = ${so(kq.dv10)} µm (10% thể tích dầu nằm ở giọt nhỏ hơn cỡ này) nổi khoảng ${so(vMm)} mm/ngày trong ống cao 100 mm. Giọt to gấp đôi nổi nhanh gấp 4 lần vì v tỷ lệ với d². Độ nhớt pha nước ở ${nhiet} °C là ${so(etaNay)} mPa·s.`]);
	if (kq.cheDo === 'can-kiet') ly.push([NHAN.canKiet, 'Xanthan ở 0,01–0,15% chưa đủ đặc để giữ giọt, lại ép giọt thành cụm do cạn kiệt. Cụm to nên nổi nhanh hơn cả khi không có xanthan.']);
	if (kq.cheDo === 'mang') ly.push([NHAN.canKiet, 'Xanthan đủ nhiều tạo mạng yếu có ứng suất chảy. Lực nổi của giọt không thắng nổi mạng nên giọt đứng yên.']);
	if (kq.bienTinh) ly.push([NHAN.bienTinh, `Mẫu nóng tới ${soCD(kq.nhietRa)} °C. Whey biến tính, giọt dính thành cụm và nổi nhanh. Thử làm lạnh giữa các lần qua máy.`]);
	if (kq.saiLoai) ly.push([NHAN.hlb, 'Span 80 ưa dầu, thích hợp cho nước trong dầu (bơ thực vật), không giữ được giọt dầu trong nước.']);
	if (kq.bienTinh) ly.push([NHAN.nguongBienTinh, NHAN.nguongBienTinh.chu]);
	if (S.me.nhuHoa === 'tween80' || S.me.nhuHoa === 'span80') ly.push([NHAN.gammaMinhHoa, NHAN.gammaMinhHoa.chu]);
	if (kq.canhBao.some((c) => c.ma === 'khong-tien-nhu')) ly.push([NHAN.hangSo, 'Không có tiền nhũ, lần qua máy đầu chỉ kịp xé mảng dầu lớn.']);
	if (S.tab === 'oxy' || S.nv?.id === 'omega-3') {
		const ox = kq.oxyHoa(ngay, nhiet, S.bq.sang);
		ly.push([NHAN.khongNo, `${DAU[S.me.dau].ten} có U ≈ ${soCD(ox.U)}. Ở ${nhiet} °C, giai đoạn cảm ứng ≈ ${so(ox.ip, 3)} ngày; sau ${ngay} ngày peroxide ≈ ${soCD(ox.pv)} meq/kg.`]);
		ly.push([NHAN.chongOxy, S.me.tocopherol || S.me.edta ? `Bạn đã dùng ${[S.me.tocopherol && 'tocopherol', S.me.edta && 'EDTA'].filter(Boolean).join(' và ')}: mỗi chất chặn một khâu khác nhau của phản ứng dây chuyền.` : 'Chưa dùng chất chống oxy hóa. Tocopherol chặn chuỗi gốc tự do, EDTA khóa kim loại xúc tác.']);
		if (S.bq.sang) ly.push([NHAN.anhSang, 'Chai trong dưới đèn: oxy đơn tuyến tấn công trực tiếp nối đôi, rút ngắn giai đoạn cảm ứng khoảng 3 lần trong mô hình.']);
		ly.push([NHAN.q10, `Mỗi khi lạnh hơn 10 °C, oxy hóa chậm đi một nửa.`]);
	}
	if (kqSao && kqSao.sao < 3 && dongHoa && dongHoa.bar < 1000 && !kq.thieuNhuHoa) {
		const barThu = Math.min(1500, dongHoa.bar * 4);
		const thu = moPhongMe({ ...meThuc(), dongHoa: { ...dongHoa, bar: barThu } });
		let goiY = `Gợi ý: cùng công thức nhưng chạy ${barThu.toLocaleString('vi-VN')} bar thì d₃₂ còn ≈ ${so(thu.d32)} µm và CI sau ${ngay} ngày ≈ ${soCD(thu.ongNghiem(ngay, nhiet).CI)}%.`;
		if (thu.ongNghiem(ngay, nhiet).CI > 3 && !(S.me.phanTramXanthan >= 0.25)) goiY += ' Nếu vẫn chưa đủ, giảm kích thước giọt không phải con đường duy nhất: hãy nghĩ tới pha liên tục.';
		ly.push([NHAN.apSuat, goiY + ' Nhớ để ý nhiệt và chi phí.']);
	}
	ly.push([NHAN.hangSo, 'Các hằng số của mô hình là số minh họa để thấy đúng chiều hiện tượng. Thiết kế thật cần đo trên chính hệ của bạn.']);

	const dau = kqSao
		? `<div class="pl-sao-kq"><span class="pl-sao-to" aria-label="${kqSao.sao} trên 3 sao">${'★'.repeat(kqSao.sao)}<i>${'☆'.repeat(3 - kqSao.sao)}</i></span><b>${['Chưa đạt, thử lại nhé!', 'Được 1 sao, còn cải thiện được.', 'Tốt! Còn một tiêu chí nữa.', 'Xuất sắc! Mẻ hoàn hảo.'][kqSao.sao]}</b></div>
<ul class="pl-tieu-chi">${kqSao.tieuChi.map((t) => `<li class="${t.dat ? 'dat' : 'truot'}">${t.dat ? '✓' : '✗'} ${h(t.chu)}</li>`).join('')}</ul>
<p class="pl-luat">${nhanHTML({ ma: 'T' })} <b>Luật chơi:</b> ${LUAT_CHOI}</p>
<p class="pl-meo">Chi phí mẻ này ≈ ${soCD(kq.chiPhi)} nghìn đồng/kg (minh họa).</p>`
		: `<p class="pl-ok">Đã ghi mẻ vào sổ tay.</p>`;
	return `${dau}<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}${lienKet(n)}</li>`).join('')}</ul>
<button type="button" class="pl-nut" data-lam="lamLai">Làm mẻ mới</button>`;
}

/* ---------------- sổ tay ---------------- */
function veSoTay() {
	const st = docLS('pl:so-tay', []);
	const w = goc.querySelector('.pl-so-tay-wrap');
	w.innerHTML = `<h2 class="pl-h">📓 Sổ tay thí nghiệm</h2>` +
		(st.length
			? `<div class="pl-bang-cuon"><table class="pl-so-tay"><thead><tr><th>Nhiệm vụ</th><th>Công thức</th><th>Quy trình</th><th>d₄₃</th><th>CI</th><th>Peroxide</th><th>Sao</th></tr></thead><tbody>${st
					.map(
						(r) =>
							`<tr><td>${h(r.nv)}</td><td>${h(r.ct)}</td><td>${h(r.qt)}</td><td>${so(r.d43)} µm</td><td>${soCD(r.ci)}% <small>sau ${r.ngay} ngày${r.nhiet != null ? ', ' + r.nhiet + ' °C' : ''}</small></td><td>${r.pv != null ? soCD(r.pv) : '–'}</td><td>${r.sao === null ? '–' : '★'.repeat(r.sao) + '☆'.repeat(3 - r.sao)}</td></tr>`,
					)
					.join('')}</tbody></table></div>`
			: `<p class="pl-meo">Chưa có mẻ nào. Mỗi lần bạn nộp mẻ ở tủ tua nhanh, kết quả sẽ được ghi vào đây (lưu trên máy này) để so sánh.</p>`) +
		`<div class="pl-so-tay-nut"><button type="button" class="pl-link pl-xuat"${st.length ? '' : ' disabled'}>Xuất file (.json)</button> <label class="pl-link pl-nhap-nhan">Nhập file<input type="file" accept=".json,application/json" class="pl-nhap" hidden></label>${st.length ? ' <button type="button" class="pl-link pl-xoa">Xóa sổ tay</button>' : ''}<span class="pl-so-tay-tb" role="status" aria-live="polite"></span></div><p class="pl-meo">Sổ tay chỉ lưu trong trình duyệt này; xóa dữ liệu trình duyệt là mất. Hãy xuất file để giữ lại hoặc chuyển sang máy khác.</p>`;
	const tb = (t) => {
		const e = w.querySelector('.pl-so-tay-tb');
		if (e) e.textContent = t;
	};
	w.querySelector('.pl-xoa')?.addEventListener('click', () => {
		ghiLS('pl:so-tay', []);
		veSoTay();
	});
	w.querySelector('.pl-xuat')?.addEventListener('click', () => {
		try {
			const goi = { loai: 'so-tay-phong-lab', phienBan: 1, xuatLuc: new Date().toISOString(), mau: st };
			const url = URL.createObjectURL(new Blob([JSON.stringify(goi, null, 2)], { type: 'application/json' }));
			const a = document.createElement('a');
			a.href = url;
			a.download = `so-tay-phong-lab-${new Date().toISOString().slice(0, 10)}.json`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
			tb(`Đã xuất ${st.length} mẻ.`);
		} catch {
			tb('Không xuất được file trên trình duyệt này.');
		}
	});
	w.querySelector('.pl-nhap')?.addEventListener('change', async (ev) => {
		const f = ev.target.files?.[0];
		if (!f) return;
		try {
			if (f.size > 1_000_000) throw new Error('quá lớn');
			const goi = JSON.parse(await f.text());
			const ds = Array.isArray(goi) ? goi : goi?.loai === 'so-tay-phong-lab' ? goi.mau : null;
			if (!Array.isArray(ds)) throw new Error('sai định dạng');
			const hop = ds.map(lamSachMau).filter(Boolean);
			if (!hop.length) throw new Error('không có mẻ hợp lệ');
			const co = new Set(st.map((r) => r.luc));
			const moi = hop.filter((r) => !co.has(r.luc));
			const gop = [...st, ...moi].sort((a, b) => b.luc - a.luc).slice(0, SO_MAU_TOI_DA);
			ghiLS('pl:so-tay', gop);
			veSoTay();
			goc.querySelector('.pl-so-tay-tb').textContent = `Đã nhập ${moi.length} mẻ mới (bỏ ${ds.length - moi.length} mẻ trùng hoặc không hợp lệ).`;
		} catch {
			tb('File không đọc được hoặc không phải sổ tay phòng lab.');
		}
		ev.target.value = '';
	});
}

const SO_MAU_TOI_DA = 100;
/* Chỉ nhận đúng các trường đã biết, đúng kiểu; trường lạ bị bỏ (dữ liệu nhập từ file là dữ liệu không tin cậy). */
function lamSachMau(r) {
	if (!r || typeof r !== 'object') return null;
	const so = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
	const chu = (x) => (typeof x === 'string' ? x.slice(0, 300) : null);
	const luc = so(r.luc), d43 = so(r.d43), ci = so(r.ci), ngay = so(r.ngay);
	const nv = chu(r.nv), ct = chu(r.ct), qt = chu(r.qt);
	if (luc === null || d43 === null || ci === null || ngay === null || nv === null || ct === null || qt === null) return null;
	const sao = so(r.sao);
	return { luc, nv, ct, qt, d43, ngay, ci, pv: so(r.pv), nhiet: so(r.nhiet), sao: sao === null ? null : Math.min(3, Math.max(0, Math.round(sao))) };
}

/* ---------------- hình vẽ: biểu đồ, kính hiển vi, ống nghiệm ---------------- */
function veBieuDo(kq) {
	const W = 320, H = 150, L = 8, B = 128;
	const xMin = Math.log10(0.05), xMax = Math.log10(500);
	const X = (d) => L + ((Math.log10(d) - xMin) / (xMax - xMin)) * (W - 2 * L);
	const lop = lopKichThuoc(kq.dv50, kq.sigma, 61);
	const wMax = Math.max(...lop.map((l) => l.w));
	const diem = lop.filter((l) => l.d > 0.05 && l.d < 500).map((l) => `${X(l.d).toFixed(1)},${(B - (l.w / wMax) * 100).toFixed(1)}`);
	const moc = [0.1, 1, 10, 100];
	return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Phân bố kích thước giọt, đỉnh quanh ${so(kq.dv50)} µm">
<line x1="${L}" y1="${B}" x2="${W - L}" y2="${B}" class="truc"/>
${moc.map((m) => `<line x1="${X(m)}" y1="${B}" x2="${X(m)}" y2="${B - 104}" class="luoi"/><text x="${X(m)}" y="${B + 14}" text-anchor="middle">${m.toLocaleString('vi-VN')} µm</text>`).join('')}
${diem.length ? `<polygon points="${X(lop.find((l) => l.d > 0.05)?.d ?? 0.05)},${B} ${diem.join(' ')} ${X(lop.filter((l) => l.d < 500).at(-1)?.d ?? 500)},${B}" class="vung"/>` : ''}
<line x1="${X(kq.d43)}" y1="${B}" x2="${X(kq.d43)}" y2="${B - 110}" class="d43"/><text x="${X(kq.d43) + 4}" y="${B - 100}" class="d43-chu">d₄₃</text>
</svg>`;
}

function veDoThiPV(kq, max) {
	const W = 320, H = 150, L = 26, B = 128, T = 10;
	const pvMax = 30;
	const X = (t) => L + (t / max) * (W - L - 8);
	const Y = (pv) => B - (Math.min(pv, pvMax) / pvMax) * (B - T);
	const pts = [];
	for (let i = 0; i <= 80; i++) {
		const t = (max * i) / 80;
		pts.push(`${X(t).toFixed(1)},${Y(kq.oxyHoa(t, S.bq.nhietDo, S.bq.sang).pv).toFixed(1)}`);
	}
	const hien = kq.oxyHoa(S.ngay, S.bq.nhietDo, S.bq.sang).pv;
	return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Đồ thị peroxide theo ngày">
<line x1="${L}" y1="${B}" x2="${W - 8}" y2="${B}" class="truc"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="truc"/>
${[0, 10, 20, 30].map((v) => `<text x="${L - 4}" y="${Y(v) + 3}" text-anchor="end">${v}</text>`).join('')}
${[0, 0.25, 0.5, 0.75, 1].map((f) => `<text x="${X(f * max)}" y="${B + 13}" text-anchor="middle">${Math.round(f * max)}</text>`).join('')}
<line x1="${L}" y1="${Y(10)}" x2="${W - 8}" y2="${Y(10)}" class="nguong"/><text x="${W - 10}" y="${Y(10) - 4}" text-anchor="end" class="nguong-chu">ngưỡng ôi 10</text>
<polyline points="${pts.join(' ')}" class="duong-pv"/>
<circle cx="${X(S.ngay)}" cy="${Y(hien)}" r="4.5" class="diem-pv"/>
</svg>`;
}

function rng(seed) {
	let s = seed >>> 0;
	return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function veKinh(kq) {
	const R = 70;
	const fov = Math.max(6 * kq.d43, 4); // µm ngang
	const k = (2 * R) / fov;
	const r = rng(Math.round(kq.d32 * 1000) + 7);
	const dn = kq.dv50 * Math.exp(-3 * kq.sigma * kq.sigma);
	const cum = kq.cheDo === 'can-kiet' || kq.bienTinh;
	const tron = [];
	let tam = [R, R];
	for (let i = 0; i < 160; i++) {
		const z = Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
		const d = dn * Math.exp(kq.sigma * z);
		const rr = Math.max(0.6, (d * k) / 2);
		if (cum && i % 8 === 0) tam = [r() * 2 * R, r() * 2 * R];
		const [x, y] = cum ? [tam[0] + (r() - 0.5) * 22, tam[1] + (r() - 0.5) * 22] : [r() * 2 * R, r() * 2 * R];
		tron.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}"/>`);
	}
	const thuoc = fov / 4;
	return `<svg viewBox="0 0 ${2 * R} ${2 * R + 16}" role="img" aria-label="Hình kính hiển vi minh họa các giọt dầu">
<defs><clipPath id="pl-kinh-cat"><circle cx="${R}" cy="${R}" r="${R - 2}"/></clipPath></defs>
<circle cx="${R}" cy="${R}" r="${R - 1}" class="kinh-nen"/>
<g clip-path="url(#pl-kinh-cat)" class="giot">${tron.join('')}</g>
<circle cx="${R}" cy="${R}" r="${R - 1}" class="kinh-vien"/>
<line x1="${R - (thuoc * k) / 2}" y1="${2 * R + 8}" x2="${R + (thuoc * k) / 2}" y2="${2 * R + 8}" class="thuoc"/>
<text x="${R}" y="${2 * R + 4}" text-anchor="middle" class="thuoc-chu">${so(thuoc)} µm</text>
</svg>`;
}

function veOng(o, kq, w, hPx) {
	const H = CAO_ONG_MM;
	const top = 14, cao = hPx - 34, x0 = w * 0.28, rong = w * 0.44;
	const y = (mm) => top + (mm / H) * cao;
	const lop = [
		['vang', o.vangDau],
		['kem', o.kem],
		['duc', o.duc],
		['serum', o.serum],
	];
	let acc = 0;
	const rects = lop
		.map(([c, mm]) => {
			const r = mm > 0.01 ? `<rect x="${x0}" y="${y(acc)}" width="${rong}" height="${Math.max(0, y(acc + mm) - y(acc))}" class="lop-${c}"/>` : '';
			acc += mm;
			return r;
		})
		.join('');
	const ducDo = kq ? Math.min(1, 0.35 + kq.phi * 4) : 0.5;
	return `<svg viewBox="0 0 ${w} ${hPx}" role="img" aria-label="Ống nghiệm: kem ${soCD(o.kem)} mm, serum ${soCD(o.serum)} mm">
<defs><clipPath id="pl-ong-cat-${w}"><path d="M${x0} ${top} h${rong} v${cao - rong / 2} a${rong / 2} ${rong / 2} 0 0 1 ${-rong} 0 z"/></clipPath></defs>
<g clip-path="url(#pl-ong-cat-${w})" style="--duc:${ducDo}">${rects}<rect x="${x0}" y="${y(H)}" width="${rong}" height="${rong}" class="lop-serum"/></g>
<path d="M${x0} ${top - 6} v${cao + 6 - rong / 2} a${rong / 2} ${rong / 2} 0 0 0 ${rong} 0 v${-(cao + 6 - rong / 2)}" class="ong-vien"/>
<line x1="${x0 - 4}" y1="${top - 6}" x2="${x0 + rong + 4}" y2="${top - 6}" class="ong-vien"/>
<rect x="${x0 + 3}" y="${top}" width="3" height="${cao * 0.8}" class="ong-bong"/>
</svg>`;
}

/* ---------------- cảnh phòng lab (SVG) ---------------- */
function chai(x, y, mau, nhan, cao = 46) {
	return `<g class="chai"><rect x="${x + 5}" y="${y - cao - 8}" width="10" height="9" rx="2" class="nap"/><rect x="${x}" y="${y - cao}" width="20" height="${cao}" rx="4" style="fill:${mau}"/><rect x="${x + 2}" y="${y - cao * 0.62}" width="16" height="${cao * 0.34}" rx="1.5" class="nhan-chai"/>${nhan ? `<text x="${x + 10}" y="${y - cao * 0.39}" text-anchor="middle" class="chai-chu">${nhan}</text>` : ''}</g>`;
}
function nhanTram(ten, x, y) {
	return `<g class="pl-nhan-tram"><rect x="${x - 4}" y="${y - 16}" rx="11" height="24" width="${ten.length * 8 + 16}"/><text x="${x + 4}" y="${y + 1}">${ten}</text></g>`;
}
function tram(id, ten, noiDung, nhanX, nhanY) {
	return `<g class="pl-tram" data-tram="${id}" data-may="${id}" tabindex="0" role="button" aria-label="${ten}">${noiDung}${nhanTram(ten, nhanX, nhanY)}</g>`;
}
function tuTreo(id, x, ten, mon, khoa) {
	const ds = mon.slice(0, 8);
	return `<g class="pl-tu${khoa ? ' khoa' : ''}" data-tu="${id}" tabindex="0" role="button" aria-label="Mở ${ten}">
<rect x="${x}" y="34" width="140" height="104" rx="8" class="tu"/><g class="ruot"><rect x="${x + 10}" y="42" width="120" height="88" rx="4" class="tu-trong"/>
<line x1="${x + 10}" y1="88" x2="${x + 130}" y2="88" class="ke"/>${ds.slice(0, 4).map((m, i) => chai(x + 16 + i * 28, 86, m.mau, '', 34)).join('')}${ds.slice(4, 8).map((m, i) => chai(x + 16 + i * 28, 128, m.mau, '', 30)).join('')}</g>
<rect x="${x + 10}" y="42" width="60" height="88" rx="3" class="cua-kinh trai"/><rect x="${x + 70}" y="42" width="60" height="88" rx="3" class="cua-kinh phai"/>
<circle cx="${x + 66}" cy="86" r="2.5" class="tay-nam"/><circle cx="${x + 74}" cy="86" r="2.5" class="tay-nam"/>
${khoa ? `<g class="o-khoa"><rect x="${x + 55}" y="80" width="30" height="24" rx="4"/><path d="M${x + 61} 80 v-8 a9 9 0 0 1 18 0 v8"/></g>` : ''}
${nhanTram(ten, x + 4, 28)}</g>`;
}

function veCanh() {
	const tuong = `<rect x="0" y="0" width="1000" height="470" class="tuong"/>
<g class="gach">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 28}" x2="1000" y2="${i * 28}"/>`).join('')}</g>
<rect x="0" y="335" width="1000" height="135" class="ban-than"/><rect x="0" y="325" width="1000" height="14" class="ban-mat"/>
<g class="bien"><rect x="712" y="28" width="160" height="40" rx="8"/><text x="792" y="54" text-anchor="middle">PHÒNG LAB ẢO</text></g>
<g class="dong-ho"><circle cx="920" cy="50" r="22"/><line x1="920" y1="50" x2="920" y2="35" class="kim-gio"/><line x1="920" y1="50" x2="931" y2="56" class="kim-phut"/></g>`;

	const dsDau = TU['tu-dau'].mon;
	const tuDau = `<g class="pl-tu" data-tu="tu-dau" tabindex="0" role="button" aria-label="Mở tủ dầu béo">
<rect x="14" y="40" width="172" height="285" rx="8" class="tu"/><g class="ruot"><rect x="24" y="52" width="152" height="262" rx="4" class="tu-trong"/>
<line x1="24" y1="140" x2="176" y2="140" class="ke"/><line x1="24" y1="228" x2="176" y2="228" class="ke"/>
${dsDau.slice(0, 5).map((m, i) => chai(30 + i * 29, 138, m.mau, m.nhan.length <= 4 ? m.nhan : '')).join('')}
${dsDau.slice(5, 10).map((m, i) => chai(30 + i * 29, 226, m.mau, m.nhan.length <= 4 ? m.nhan : '', 44)).join('')}
<rect x="34" y="256" width="130" height="50" rx="4" class="hop"/><text x="99" y="286" text-anchor="middle" class="chu-hop">DẦU BÉO</text></g>
<rect x="24" y="52" width="76" height="262" rx="3" class="cua-kinh trai"/><rect x="100" y="52" width="76" height="262" rx="3" class="cua-kinh phai"/>
<rect x="94" y="170" width="4" height="30" rx="2" class="tay-nam"/><rect x="102" y="170" width="4" height="30" rx="2" class="tay-nam"/>
${nhanTram('Tủ dầu béo', 18, 28)}</g>`;

	const binhNuoc = `<g class="pl-binh-nuoc" data-nuoc tabindex="0" role="button" aria-label="Bình nước cất: bấm để thêm nước vào cốc">
<rect x="198" y="150" width="46" height="70" rx="8" class="binh"/><rect x="202" y="164" width="38" height="52" rx="5" class="binh-nuoc"/>
<text x="221" y="196" text-anchor="middle" class="chu-binh">H₂O</text><rect x="214" y="220" width="14" height="10" class="voi"/><rect x="218" y="230" width="6" height="12" rx="2" class="voi"/>
<path class="dong-nuoc" d="M221 242 v40"/></g>`;
	const can = tram('can', 'Cân', `<rect x="192" y="300" width="60" height="25" rx="4" class="may"/><rect x="198" y="292" width="48" height="8" rx="2" class="may-toi"/><rect x="200" y="308" width="40" height="11" rx="2" class="man-hinh"/><text x="220" y="317" text-anchor="middle" class="so-can" data-man="can">0,0</text>`, 192, 354);

	const khuay = tram(
		'khuay',
		'2 · Máy khuấy',
		`<rect x="268" y="312" width="90" height="13" rx="3" class="may"/><rect x="280" y="150" width="10" height="165" class="may-toi"/>
<g class="pl-rung"><rect x="276" y="152" width="78" height="56" rx="10" class="may"/><rect x="288" y="164" width="40" height="12" rx="3" class="man-hinh"/><circle cx="340" cy="170" r="6" class="den"/>
<rect x="310" y="208" width="8" height="76" class="may-toi"/><rect x="304" y="278" width="20" height="14" rx="3" class="may-toi"/></g>`,
		268,
		354,
	);
	const dongHoa = tram(
		'dongHoa',
		'3 · Máy đồng hóa',
		`<g class="pl-rung"><rect x="410" y="170" width="200" height="155" rx="10" class="may"/><rect x="410" y="170" width="200" height="26" rx="10" class="may-dau"/>
<circle cx="470" cy="250" r="36" class="dong-ho-ap"/><g class="vach">${Array.from({ length: 9 }, (_, i) => {
			const a = ((-120 + i * 30) * Math.PI) / 180;
			return `<line x1="${470 + 28 * Math.sin(a)}" y1="${250 - 28 * Math.cos(a)}" x2="${470 + 33 * Math.sin(a)}" y2="${250 - 33 * Math.cos(a)}"/>`;
		}).join('')}</g>
<g class="pl-kim" style="transform-origin:470px 250px;transform:rotate(-120deg)"><line x1="470" y1="250" x2="470" y2="222"/></g><circle cx="470" cy="250" r="4" class="tam"/>
<text x="470" y="276" text-anchor="middle" class="nho">bar</text>
<rect x="525" y="214" width="70" height="30" rx="4" class="man-hinh"/><text x="560" y="234" text-anchor="middle" class="man-chu" data-man="dongHoa">--</text>
<rect x="525" y="256" width="70" height="14" rx="3" class="may-toi"/><rect x="530" y="290" width="18" height="18" rx="9" class="den"/><rect x="558" y="292" width="34" height="14" rx="3" class="nut-may"/>
<path d="M420 170 l-6 -24 h44 l-6 24 z" class="pheu"/></g>`,
		410,
		354,
	);
	const doHat = tram(
		'do',
		'4 · Máy đo hạt',
		`<rect x="646" y="220" width="140" height="105" rx="10" class="may"/><rect x="658" y="232" width="116" height="62" rx="5" class="man-hinh"/>
<polyline data-man="do" points="" class="man-duong"/><rect x="664" y="302" width="40" height="12" rx="3" class="may-toi"/><circle cx="762" cy="308" r="6" class="den"/>
<g class="tia"><line x1="646" y1="300" x2="612" y2="300"/></g>`,
		646,
		354,
	);
	const tuBaoQuan = tram(
		'tua',
		'5 · Tủ bảo quản',
		`<rect x="806" y="120" width="122" height="205" rx="10" class="tu"/><rect x="818" y="138" width="98" height="140" rx="6" class="tu-trong sang"/>
<g data-man="tua" transform="translate(837,140)"></g>
<rect x="818" y="286" width="98" height="28" rx="4" class="man-hinh"/><text x="867" y="305" text-anchor="middle" class="man-chu" data-man="ngay">—</text>`,
		804,
		354,
	);
	const soTay = `<g class="pl-tram" data-tram="so-tay" tabindex="0" role="button" aria-label="Sổ tay"><g class="so-tay"><rect x="940" y="300" width="50" height="24" rx="3" transform="rotate(-6 965 312)"/><line x1="946" y1="306" x2="980" y2="302" class="dong"/><line x1="946" y1="312" x2="976" y2="308" class="dong"/></g></g>`;

	const coc = `<g class="pl-coc" tabindex="0" role="button" aria-label="Cốc mẫu: kéo thả sang máy"><g class="pl-coc-trong">
<rect x="-42" y="-74" width="84" height="84" fill="transparent"/>
<path d="M-17 -44 h34 l-3 42 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 z" class="coc-vien"/>
<clipPath id="pl-coc-cat"><path d="M-16 -40 h32 l-3 38 a2 2 0 0 1 -2 2 h-22 a2 2 0 0 1 -2 -2 z"/></clipPath>
<g clip-path="url(#pl-coc-cat)"><rect class="coc-nuoc" x="-20" y="-30" width="40" height="32"/><rect class="coc-dau" x="-20" y="-38" width="40" height="8"/><rect class="coc-nhu" x="-20" y="-38" width="40" height="40"/></g>
<text x="0" y="-48" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;
	return `${tuong}${tuDau}${tuTreo('tu-nhu-hoa', 252, 'Tủ nhũ hóa', TU['tu-nhu-hoa'].mon)}${tuTreo('tu-phu-gia', 402, 'Tủ phụ gia', TU['tu-phu-gia'].mon)}${tuTreo('tu-duoc', 552, 'Tủ dược 🔒', TU['tu-duoc'].mon, true)}${binhNuoc}${can}${khuay}${dongHoa}${doHat}${tuBaoQuan}${soTay}${coc}`;
}

// Chỗ đặt cốc ở từng trạm và vùng thả (tọa độ SVG)
const VI_TRI_COC = { can: [220, 294], khuay: [314, 312], dongHoa: [384, 324], do: [628, 324], tua: [867, 262] };
const VUNG_THA = {
	can: [186, 140, 258, 330],
	khuay: [262, 140, 364, 330],
	dongHoa: [364, 140, 616, 330],
	do: [604, 200, 792, 330],
	tua: [800, 110, 934, 330],
};

/* Kéo cốc trong SVG bằng pointer events (chuột, cảm ứng, bút) */
let keoXong = false;
function ganKeoCoc(svg) {
	const coc = svg.querySelector('.pl-coc');
	const toaDo = (ev) => {
		const p = svg.createSVGPoint();
		p.x = ev.clientX;
		p.y = ev.clientY;
		return p.matrixTransform(svg.getScreenCTM().inverse());
	};
	const vungTai = (x, y) => Object.entries(VUNG_THA).find(([, [x1, y1, x2, y2]]) => x >= x1 && x <= x2 && y >= y1 && y <= y2)?.[0];
	coc.addEventListener('pointerdown', (e) => {
		if (S.dangChay || e.button !== 0) return;
		e.preventDefault();
		coc.setPointerCapture(e.pointerId);
		const bd = toaDo(e);
		const [cx, cy] = VI_TRI_COC[S.viTri];
		const lech = [bd.x - cx, bd.y - cy];
		let daKeo = false;
		const diChuyen = (ev) => {
			const p = toaDo(ev);
			if (!daKeo && Math.hypot(p.x - bd.x, p.y - bd.y) < 5) return;
			daKeo = true;
			coc.classList.add('dang-keo');
			coc.style.transform = `translate(${p.x - lech[0]}px, ${p.y - lech[1]}px)`;
			const v = vungTai(p.x, p.y);
			svg.querySelectorAll('[data-tram]').forEach((g) => g.classList.toggle('sap-tha', g.dataset.tram === v));
		};
		const tha = (ev) => {
			coc.removeEventListener('pointermove', diChuyen);
			coc.removeEventListener('pointerup', tha);
			coc.removeEventListener('pointercancel', tha);
			coc.classList.remove('dang-keo');
			svg.querySelectorAll('.sap-tha').forEach((g) => g.classList.remove('sap-tha'));
			if (!daKeo) {
				moTram(S.viTri);
				return;
			}
			keoXong = true;
			setTimeout(() => (keoXong = false), 50);
			const p = toaDo(ev);
			const v = ev.type === 'pointerup' ? vungTai(p.x, p.y) : null;
			if (v && v !== S.viTri) duaCocToi(v);
			else capNhatCanh();
		};
		coc.addEventListener('pointermove', diChuyen);
		coc.addEventListener('pointerup', tha);
		coc.addEventListener('pointercancel', tha);
	});
	coc.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			moTram(S.viTri);
		}
	});
}

function capNhatCanh() {
	const svg = goc.querySelector('.pl-canh');
	svg.querySelectorAll('[data-tram]').forEach((g) => g.classList.toggle('dang', g.dataset.tram === S.tram));
	const coc = svg.querySelector('.pl-coc');
	const [x, y] = VI_TRI_COC[S.viTri];
	coc.style.transform = `translate(${x}px, ${y}px)`;
	coc.classList.toggle('trong-tu', S.viTri === 'tua');
	coc.classList.toggle('rong', !S.coc.nuoc && !S.coc.dau);
	coc.classList.toggle('chua-du', !coMau());
	const daTron = S.xong.khuay || S.xong.dongHoa;
	coc.classList.toggle('da-tron', daTron);
	const dDay = S.coc.dau ? Math.max(2, (S.coc.gDau / 100) * 34) : 0;
	const nuocCao = S.coc.nuoc ? 32 : 0;
	const dau = coc.querySelector('.coc-dau');
	dau.setAttribute('y', String(2 - nuocCao - dDay));
	dau.setAttribute('height', String(dDay));
	dau.style.fill = S.coc.dau ? TU['tu-dau'].mon.find((m) => m.khoa === S.coc.dau)?.mau : '';
	const nuoc = coc.querySelector('.coc-nuoc');
	nuoc.setAttribute('y', String(2 - nuocCao));
	nuoc.setAttribute('height', String(nuocCao));
	if (S.kq && daTron) {
		// giọt nhỏ tán xạ mạnh → trắng như sữa; giọt to → vàng ngà, trong hơn
		const t = Math.min(1, Math.max(0, Math.log10(S.kq.d32 / 0.3) / 2));
		coc.querySelector('.coc-nhu').style.fill = `color-mix(in srgb, var(--pl-nhu-to) ${Math.round(t * 100)}%, var(--pl-nhu-nho))`;
	}
	svg.querySelector('[data-man="can"]').textContent = S.viTri === 'can' && (S.coc.nuoc || S.coc.dau) ? (S.coc.nuoc ? '100,0' : soCD(S.coc.gDau, 1)) : '0,0';
	const manDH = svg.querySelector('[data-man="dongHoa"]');
	manDH.textContent = S.xong.dongHoa && S.kq ? `${soCD(S.kq.nhietRa, 0)} °C` : `${S.may.dongHoa.bar} bar`;
	const kim = svg.querySelector('.pl-kim');
	if (!S.dangChay) kim.style.transform = `rotate(${S.xong.dongHoa ? -120 + (240 * S.may.dongHoa.bar) / 1500 : -120}deg)`;
	const duong = svg.querySelector('[data-man="do"]');
	if (S.kq && S.xong.do) {
		const lop = lopKichThuoc(S.kq.dv50, S.kq.sigma, 31);
		const wMax = Math.max(...lop.map((l) => l.w));
		const X = (d) => 662 + ((Math.log10(d) + 1.3) / 4) * 108;
		duong.setAttribute('points', lop.filter((l) => l.d > 0.05 && l.d < 500).map((l) => `${X(l.d).toFixed(1)},${(288 - (l.w / wMax) * 48).toFixed(1)}`).join(' '));
	} else duong.setAttribute('points', '');
	const ongNho = svg.querySelector('[data-man="tua"]');
	ongNho.innerHTML = S.kq && S.xong.tua ? veOng(S.kq.ongNghiem(S.ngay, S.bq.nhietDo), S.kq, 60, 138).replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/pl-ong-cat-60/g, 'pl-ong-nho') : '';
	svg.querySelector('[data-man="ngay"]').textContent = S.xong.tua ? `${S.ngay} ngày · ${S.bq.nhietDo}°C` : '—';
}

if (goc) khoiDong(goc);

/* Liên kết từ bài học:
   /phong-lab/#nv-<mã nhiệm vụ>  mở bàn nhũ tương và chọn sẵn nhiệm vụ ("tu-do" = phòng lab tự do)
   /phong-lab/#so-tay            cuộn tới Sổ tay thí nghiệm
   (#ban-thit và #ban-bao-quan do dungVo xử lý). Mã nhiệm vụ lạ thì bỏ qua, trang vẫn mở bình thường. */
function theoHash() {
	if (!goc) return;
	const nv = location.hash.match(/^#nv-([a-z0-9-]+)$/);
	if (nv) {
		const nhiemVu = nv[1] === 'tu-do' ? null : NHIEM_VU.find((n) => n.id === nv[1]);
		if (nv[1] !== 'tu-do' && !nhiemVu) return;
		document.querySelector('[data-ban="nhu-tuong"]')?.click();
		chonNhiemVu(nhiemVu);
		document.getElementById('phong-lab')?.scrollIntoView({ behavior: GIAM_CHUYEN_DONG ? 'auto' : 'smooth', block: 'start' });
	} else if (location.hash === '#so-tay') {
		document.querySelector('[data-ban="nhu-tuong"]')?.click();
		// chờ một nhịp để bố cục (chọn bàn, vẽ Sổ tay) ổn định rồi mới cuộn
		setTimeout(() => goc.querySelector('.pl-so-tay-wrap')?.scrollIntoView({ behavior: GIAM_CHUYEN_DONG ? 'auto' : 'smooth', block: 'start' }), 350);
	}
}
theoHash();
addEventListener('hashchange', theoHash);
