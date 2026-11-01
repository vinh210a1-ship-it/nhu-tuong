// Phòng lab ảo: giao diện. Mọi con số đều lấy từ mo-hinh.js (đã có phép kiểm).
import { stokes } from '../cong-thuc.js';
import { doNhotNuoc, moPhongMe, chamSao, NHIEM_VU, NHU_HOA, DAU, NHAN, lopKichThuoc, CAO_ONG_MM } from './mo-hinh.js';

const BASE = '/nhu-tuong/';
const goc = document.getElementById('phong-lab');

/* ---------------- tiện ích ---------------- */
const so = (x, c = 2) =>
	!isFinite(x) ? '∞' : x.toLocaleString('vi-VN', { maximumSignificantDigits: c });
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
const MAC_DINH = () => ({
	dau: 'huong-duong',
	phanTramDau: 10,
	nhuHoa: 'tween80',
	phanTramNhuHoa: 1,
	phanTramXanthan: 0,
	khuay: { rpm: 10000, phut: 2 },
	dongHoa: { bar: 300, soLan: 1, lamLanh: false },
	nhietVao: 25,
});
const S = {
	nv: null,
	me: MAC_DINH(),
	xong: { can: false, khuay: false, dongHoa: false, do: false },
	tram: 'can',
	ngay: 0,
	kq: null,
	dangChay: false,
	tab: 'tach',
	bq: { nhietDo: 25, sang: false },
};

function meThuc() {
	const m = structuredClone(S.me);
	if (!S.xong.khuay) m.khuay = { rpm: 0, phut: 0 };
	if (!S.xong.dongHoa) m.dongHoa = { bar: 0, soLan: 0, lamLanh: false };
	return m;
}
function tinh() {
	S.kq = S.xong.can ? moPhongMe(meThuc()) : null;
}

/* ---------------- khung trang ---------------- */
function khoiDong(el) {
	el.innerHTML = `
<section class="pl-nv" aria-label="Chọn nhiệm vụ"></section>
<div class="pl-khung">
  <div class="pl-canh-wrap">
    <svg class="pl-canh" viewBox="0 10 1000 360" role="img" aria-label="Phòng thí nghiệm: tủ nguyên liệu, máy khuấy, máy đồng hóa, máy đo kích thước hạt, tủ tua nhanh thời gian">${veCanh()}</svg>
    <nav class="pl-buoc" aria-label="Các trạm"></nav>
  </div>
  <aside class="pl-bang" aria-live="polite"></aside>
</div>
<section class="pl-so-tay-wrap"></section>`;
	el.querySelector('.pl-canh').addEventListener('click', (e) => {
		const t = e.target.closest('[data-tram]');
		if (t) moTram(t.dataset.tram);
	});
	el.querySelector('.pl-canh').addEventListener('keydown', (e) => {
		const t = e.target.closest('[data-tram]');
		if (t && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			moTram(t.dataset.tram);
		}
	});
	veNhiemVu();
	veBuoc();
	veBang();
	veSoTay();
	capNhatCanh();
}

const TRAM = [
	{ id: 'can', ten: 'Tủ nguyên liệu & cân', so: 1 },
	{ id: 'khuay', ten: 'Máy khuấy tốc độ cao', so: 2 },
	{ id: 'dongHoa', ten: 'Máy đồng hóa', so: 3 },
	{ id: 'do', ten: 'Máy đo kích thước hạt', so: 4 },
	{ id: 'tua', ten: 'Tủ bảo quản tua nhanh', so: 5 },
];

function moTram(id) {
	if (S.dangChay) return;
	S.tram = id;
	veBuoc();
	veBang();
	capNhatCanh();
	if (matchMedia('(max-width: 60rem)').matches) goc.querySelector('.pl-bang').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function veBuoc() {
	goc.querySelector('.pl-buoc').innerHTML = TRAM.map(
		(t) =>
			`<button type="button" class="pl-chip${S.tram === t.id ? ' dang' : ''}${S.xong[t.id] ? ' xong' : ''}" data-chip="${t.id}"><span>${S.xong[t.id] ? '✓' : t.so}</span>${t.ten}</button>`,
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
	goc.querySelectorAll('[data-nv]').forEach((b) =>
		b.addEventListener('click', () => {
			const nv = NHIEM_VU.find((n) => n.id === b.dataset.nv) ?? null;
			chonNhiemVu(nv);
		}),
	);
}
function chonNhiemVu(nv) {
	S.nv = nv;
	S.me = { ...MAC_DINH(), ...(nv?.coDinh ?? {}) };
	if (nv && !nv.coDinh.nhuHoa) S.me.nhuHoa = 'tween80';
	S.xong = { can: false, khuay: false, dongHoa: false, do: false };
	S.tram = 'can';
	S.ngay = 0;
	S.tab = nv?.id === 'omega-3' ? 'oxy' : 'tach';
	S.bq = { nhietDo: nv?.baoQuan?.nhietDo ?? 25, sang: false };
	tinh();
	veNhiemVu();
	veBuoc();
	veBang();
	capNhatCanh();
}

/* ---------------- bảng điều khiển từng trạm ---------------- */
function veBang() {
	const b = goc.querySelector('.pl-bang');
	const ham = { can: bangCan, khuay: bangKhuay, dongHoa: bangDongHoa, do: bangDo, tua: bangTua, 'tu-phu-gia': bangKhoa, 'tu-duoc': bangKhoa, 'so-tay': bangSoTayNgan }[S.tram];
	b.innerHTML = (S.nv ? `<div class="pl-de"><b>Nhiệm vụ:</b> ${h(S.nv.de)}</div>` : '') + ham();
	b.querySelectorAll('[data-o]').forEach((o) => o.addEventListener('input', () => doiThongSo(o)));
	b.querySelectorAll('[data-lam]').forEach((n) => n.addEventListener('click', () => LAM[n.dataset.lam](n)));
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

const khoaO = (k) => S.nv?.coDinh && k in S.nv.coDinh;
function thanhTruot(k, nhan, min, max, buoc, giaTri, donVi, hien = (v) => soCD(v)) {
	const khoa = khoaO(k);
	return `<label class="pl-o${khoa ? ' khoa' : ''}"><span class="pl-o-nhan">${nhan}${khoa ? ' <small>🔒 đề bài cố định</small>' : ''}</span>
<span class="pl-o-dong"><input type="range" data-o="${k}" min="${min}" max="${max}" step="${buoc}" value="${giaTri}" ${khoa ? 'disabled' : ''}/>
<output data-ra="${k}">${hien(giaTri)} ${donVi}</output></span></label>`;
}
function chon(k, nhan, ds, giaTri) {
	const khoa = khoaO(k);
	return `<label class="pl-o${khoa ? ' khoa' : ''}"><span class="pl-o-nhan">${nhan}${khoa ? ' <small>🔒 đề bài cố định</small>' : ''}</span>
<select data-o="${k}" ${khoa ? 'disabled' : ''}>${ds.map(([v, t]) => `<option value="${v}"${v === giaTri ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`;
}

function dauBang(tieuDe, moTa, bieuTuong) {
	return `<header class="pl-bang-dau"><span class="pl-bt" aria-hidden="true">${bieuTuong}</span><div><h3>${tieuDe}</h3><p>${moTa}</p></div></header>`;
}

function bangCan() {
	const m = S.me;
	const nh = m.nhuHoa ? NHU_HOA[m.nhuHoa] : null;
	return (
		dauBang('Tủ nguyên liệu & cân', 'Chọn dầu, chất nhũ hóa, chất ổn định rồi cân vào cốc 100 g. Phần còn lại là nước.', '⚖️') +
		`<div class="pl-luoi">` +
		chon('dau', 'Dầu', Object.entries(DAU).map(([k, d]) => [k, `${d.ten} (ρ ${d.rho} kg/m³)`]), m.dau) +
		thanhTruot('phanTramDau', 'Lượng dầu', 1, 40, 1, m.phanTramDau, '%') +
		chon('nhuHoa', 'Chất nhũ hóa', [['', 'Không dùng'], ...Object.entries(NHU_HOA).map(([k, d]) => [k, d.ten])], m.nhuHoa ?? '') +
		thanhTruot('phanTramNhuHoa', 'Lượng chất nhũ hóa', 0.05, 3, 0.05, m.phanTramNhuHoa, '%', (v) => soCD(v, 2)) +
		thanhTruot('phanTramXanthan', 'Xanthan gum (chất ổn định)', 0, 0.5, 0.01, m.phanTramXanthan, '%', (v) => soCD(v, 2)) +
		`<fieldset class="pl-o pl-nhom"><legend class="pl-o-nhan">Chất chống oxy hóa</legend>
<label class="pl-tick"><input type="checkbox" data-o="tocopherol" ${m.tocopherol ? 'checked' : ''}/> Tocopherol (vitamin E) 200 ppm, phá chuỗi gốc tự do</label>
<label class="pl-tick"><input type="checkbox" data-o="edta" ${m.edta ? 'checked' : ''}/> EDTA 50 ppm, bắt ion sắt, đồng trong pha nước</label></fieldset>` +
		`</div>` +
		`<p class="pl-ghi-chu"><b>${h(DAU[m.dau].ten)}:</b> oleic ${soCD(DAU[m.dau].c181)}%, linoleic ${soCD(DAU[m.dau].c182)}%, linolenic ${soCD(DAU[m.dau].c183)}% ${nhanHTML({ ma: 'K' })}. Càng nhiều nối đôi càng dễ ôi.</p>` +
		(nh ? `<p class="pl-ghi-chu"><b>${h(nh.ten)}:</b> ${h(nh.ghiChu)}</p>` : `<p class="pl-ghi-chu canh">Không có chất nhũ hóa thì giọt vừa vỡ đã nhập lại ngay.</p>`) +
		`<button type="button" class="pl-nut" data-lam="can">${S.xong.can ? 'Cân lại mẻ mới' : 'Cân và đổ vào cốc'}</button>` +
		(S.xong.can ? `<p class="pl-ok">Đã có cốc: ${soCD(m.phanTramDau)}% dầu, ${m.nhuHoa ? soCD(m.phanTramNhuHoa, 2) + '% ' + NHU_HOA[m.nhuHoa].ten.split(' (')[0] : 'không chất nhũ hóa'}${m.phanTramXanthan ? ', ' + soCD(m.phanTramXanthan, 2) + '% xanthan' : ''}. Dầu đang nổi thành lớp trên mặt nước. Mang cốc sang máy khuấy.</p>` : '')
	);
}

function canCoc() {
	return S.xong.can ? '' : `<p class="pl-canh-bao">Chưa có cốc mẫu. Hãy đến <button type="button" class="pl-link" data-lam="toiCan">tủ nguyên liệu</button> trước.</p>`;
}

function bangKhuay() {
	const k = S.me.khuay;
	return (
		dauBang('Máy khuấy tốc độ cao (rotor–stator)', 'Đầu rotor quay trong lồng stator, xé dầu thành giọt cỡ vài chục µm: đây là bước tạo <b>tiền nhũ</b>. Giọt còn to, nhưng giúp máy đồng hóa làm việc hiệu quả hơn.', '🌀') +
		canCoc() +
		`<div class="pl-luoi">` +
		thanhTruot('khuay.rpm', 'Tốc độ', 2000, 20000, 500, k.rpm, 'vòng/phút', (v) => v.toLocaleString('vi-VN')) +
		thanhTruot('khuay.phut', 'Thời gian', 0.5, 10, 0.5, k.phut, 'phút') +
		`</div><button type="button" class="pl-nut" data-lam="khuay" ${S.xong.can ? '' : 'disabled'}>Chạy máy khuấy</button>` +
		(S.xong.khuay && S.kq ? `<p class="pl-ok">Tiền nhũ xong: giọt cỡ ${so(S.kq.dPre)} µm. Mẫu đục, nhưng để yên vài phút là tách. Mang sang máy đồng hóa.</p>` : '') +
		`<p class="pl-meo">Có thể bỏ qua bước này và cho thẳng vào máy đồng hóa, nhưng hãy xem chuyện gì xảy ra.</p>`
	);
}

function bangDongHoa() {
	const d = S.me.dongHoa;
	const kq = S.kq;
	return (
		dauBang('Máy đồng hóa áp suất cao', 'Bơm piston ép mẫu qua khe van rất hẹp. Dòng chảy rối, lực cắt và cavitation xé giọt xuống dưới 1 µm. Áp suất càng cao, giọt càng nhỏ, và mẫu càng nóng.', '🔩') +
		canCoc() +
		`<div class="pl-luoi">` +
		thanhTruot('dongHoa.bar', 'Áp suất', 50, 1500, 10, d.bar, 'bar', (v) => v.toLocaleString('vi-VN')) +
		thanhTruot('dongHoa.soLan', 'Số lần qua máy', 1, 5, 1, d.soLan, 'lần') +
		`<label class="pl-o pl-tick"><input type="checkbox" data-o="dongHoa.lamLanh" ${d.lamLanh ? 'checked' : ''}/> Làm lạnh mẫu về 25 °C giữa các lần qua máy</label>` +
		`</div><button type="button" class="pl-nut" data-lam="dongHoa" ${S.xong.can ? '' : 'disabled'}>Chạy máy đồng hóa</button>` +
		(S.xong.dongHoa && kq
			? `<p class="pl-ok">Xong ${d.soLan} lần ở ${d.bar.toLocaleString('vi-VN')} bar. Nhiệt độ mẫu ra: <b>${soCD(kq.nhietRa)} °C</b>. Mang sang máy đo kích thước hạt.</p>`
			: '') +
		`<p class="pl-meo">Mỗi 100 bar làm mẫu nóng thêm khoảng 2,4 °C ${nhanHTML(NHAN.nhiet)}. Áp suất được biến gần hết thành nhiệt.</p>`
	);
}

function bangDo() {
	if (!S.xong.can) return dauBang('Máy đo kích thước hạt', 'Chiếu laser qua mẫu, đo ánh sáng tán xạ để suy ra phân bố kích thước giọt.', '🔬') + canCoc();
	const kq = S.kq;
	const giaiHan = kq.thieuNhuHoa ? 'chất nhũ hóa' : S.xong.dongHoa ? 'năng lượng máy đồng hóa' : S.xong.khuay ? 'máy khuấy' : 'chưa trộn';
	return (
		dauBang('Máy đo kích thước hạt', 'Chiếu laser qua mẫu, đo ánh sáng tán xạ để suy ra phân bố kích thước giọt.', '🔬') +
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
<button type="button" class="pl-nut" data-lam="do">Mang mẫu vào tủ tua nhanh thời gian</button>`
	);
}

function bangTua() {
	if (!S.xong.can) return dauBang('Tủ tua nhanh thời gian', 'Để ống nghiệm đứng yên và tua nhanh nhiều ngày.', '⏳') + canCoc();
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
	const nut = (S.nv ? `<button type="button" class="pl-nut chinh" data-lam="nop">Nộp mẻ để chấm (${S.nv.ngay} ngày${S.nv.baoQuan ? ', ' + S.nv.baoQuan.nhietDo + ' °C' : ''})</button>` : `<button type="button" class="pl-nut chinh" data-lam="nop">Ghi mẻ vào sổ tay</button>`) + `<div class="pl-ket-qua"></div>`;
	if (S.tab === 'oxy') {
		const ox = kq.oxyHoa(S.ngay, S.bq.nhietDo, S.bq.sang);
		return (
			dauBang('Tủ bảo quản tua nhanh', 'Dầu trong giọt bị oxy tấn công ở nối đôi. Lúc đầu gần như không đổi (giai đoạn cảm ứng), sau đó peroxide tăng vọt và dầu bắt đầu có mùi ôi.', '⏳') +
			tabs + dieuKien +
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
		tabs + dieuKien +
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
</div>` + nut
	);
}

function bangKhoa() {
	const phuGia = S.tram === 'tu-phu-gia';
	return (
		dauBang(phuGia ? 'Tủ phụ gia thực phẩm' : 'Tủ dược chất', 'Tủ đang khóa. Sẽ mở ở giai đoạn sau, khi tài liệu nguồn cho mảng này đã được soạn và kiểm.', '🔒') +
		(phuGia
			? `<p>Sẽ có: phosphat và muối cho thịt (giữ nước, hao hụt khi nấu), chất chống oxy hóa, chất bảo quản, enzyme transglutaminase, chất điều chỉnh độ acid. Mỗi chất có trang riêng: làm gì, cơ chế, mã INS, giới hạn.</p>`
			: `<p>Sẽ có: phần bào chế và tá dược mang tính giáo dục, như nhũ tương lipid, kem và thuốc mỡ, hệ tự nhũ hóa. Không có liều dùng hay hướng dẫn điều trị.</p>`)
	);
}
function bangSoTayNgan() {
	return dauBang('Sổ tay thí nghiệm', 'Mọi mẻ bạn đã ghi nằm ở bảng bên dưới phòng lab, lưu trên máy này.', '📓') + `<button type="button" class="pl-nut" data-lam="cuonSoTay">Xem sổ tay</button>`;
}

/* ---------------- hành động ---------------- */
function datGiaTri(duongDan, v) {
	if (duongDan === 'ngay') return (S.ngay = v);
	const p = duongDan.split('.');
	let o = S.me;
	while (p.length > 1) o = o[p.shift()];
	o[p[0]] = v;
}
function doiThongSo(o) {
	const k = o.dataset.o;
	let v = o.type === 'checkbox' ? o.checked : o.tagName === 'SELECT' ? o.value || null : parseFloat(o.value);
	datGiaTri(k, v);
	if (k === 'ngay') {
		veBang();
		capNhatCanh();
		goc.querySelector('[data-o="ngay"]')?.focus();
		return;
	}
	// Đổi công thức sau khi đã cân → mẻ mới (bước sau phải làm lại)
	if (k === 'bq.nhietDo' || k === 'bq.sang') return;
	const truocCan = ['dau', 'phanTramDau', 'nhuHoa', 'phanTramNhuHoa', 'phanTramXanthan', 'tocopherol', 'edta'].includes(k);
	if (truocCan && S.xong.can) S.xong = { can: false, khuay: false, dongHoa: false, do: false };
	if (k.startsWith('khuay') && S.xong.khuay) S.xong = { ...S.xong, khuay: false, dongHoa: false, do: false };
	if (k.startsWith('dongHoa') && S.xong.dongHoa) S.xong = { ...S.xong, dongHoa: false, do: false };
	tinh();
	if (o.type === 'range') {
		const dong = o.closest('.pl-o');
		const out = dong?.querySelector('output');
		if (out) {
			const dv = out.textContent.split(' ').slice(1).join(' ');
			out.textContent = `${k.includes('rpm') || k.includes('bar') ? v.toLocaleString('vi-VN') : soCD(v, 2)} ${dv}`;
		}
		veBuoc();
		capNhatCanh();
		const nut = goc.querySelector('.pl-bang [data-lam="can"]');
		if (nut && truocCan) nut.textContent = 'Cân và đổ vào cốc';
		goc.querySelectorAll('.pl-bang .pl-ok').forEach((p) => p.remove());
	} else {
		veBang();
		veBuoc();
		capNhatCanh();
	}
}

function chay(tenMay, ms, xong) {
	S.dangChay = true;
	const may = goc.querySelector(`[data-may="${tenMay}"]`);
	may?.classList.add('chay');
	goc.querySelectorAll('.pl-bang .pl-nut').forEach((n) => (n.disabled = true));
	const giam = matchMedia('(prefers-reduced-motion: reduce)').matches;
	setTimeout(() => {
		may?.classList.remove('chay');
		S.dangChay = false;
		xong();
	}, giam ? 50 : ms);
}

const LAM = {
	toiCan: () => moTram('can'),
	can: () => {
		S.xong = { can: true, khuay: false, dongHoa: false, do: false };
		S.ngay = 0;
		tinh();
		veBuoc();
		veBang();
		capNhatCanh();
	},
	khuay: () =>
		chay('khuay', 1400, () => {
			S.xong = { ...S.xong, khuay: true, dongHoa: false, do: false };
			tinh();
			S.tram = 'dongHoa';
			veBuoc();
			veBang();
			capNhatCanh();
			goc.querySelector('.pl-bang').insertAdjacentHTML('afterbegin', `<p class="pl-ok">Tiền nhũ xong: giọt cỡ ${so(S.kq.dPre)} µm.</p>`);
		}),
	dongHoa: () => {
		const kim = goc.querySelector('.pl-kim');
		if (kim) kim.style.transform = `rotate(${-120 + (240 * S.me.dongHoa.bar) / 1500}deg)`;
		chay('dongHoa', 1100 + 500 * S.me.dongHoa.soLan, () => {
			S.xong = { ...S.xong, dongHoa: true, do: false };
			tinh();
			veBuoc();
			veBang();
			capNhatCanh();
		});
	},
	do: () => {
		S.xong = { ...S.xong, do: true };
		S.tram = 'tua';
		S.ngay = S.nv?.ngay ?? 30;
		veBuoc();
		veBang();
		capNhatCanh();
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
		ghiLS('pl:so-tay', st.slice(0, 30));
		veBang();
		capNhatCanh();
		veSoTay();
		veNhiemVu();
		goc.querySelector('.pl-ket-qua').innerHTML = veKetQua(kq, kqSao, ngayGhi);
		goc.querySelector('.pl-ket-qua').querySelector('[data-lam="lamLai"]')?.addEventListener('click', LAM.lamLai);
		goc.querySelector('.pl-ket-qua').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	},
	lamLai: () => {
		S.xong = { can: false, khuay: false, dongHoa: false, do: false };
		S.ngay = 0;
		tinh();
		moTram('can');
	},
	cuonSoTay: () => goc.querySelector('.pl-so-tay-wrap').scrollIntoView({ behavior: 'smooth' }),
};

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
					.join('')}</tbody></table></div><button type="button" class="pl-link pl-xoa">Xóa sổ tay</button>`
			: `<p class="pl-meo">Chưa có mẻ nào. Mỗi lần bạn nộp mẻ ở tủ tua nhanh, kết quả sẽ được ghi vào đây (lưu trên máy này) để so sánh.</p>`);
	w.querySelector('.pl-xoa')?.addEventListener('click', () => {
		ghiLS('pl:so-tay', []);
		veSoTay();
	});
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
	return `<g class="chai"><rect x="${x + 5}" y="${y - cao - 8}" width="10" height="9" rx="2" class="nap"/><rect x="${x}" y="${y - cao}" width="20" height="${cao}" rx="4" style="fill:${mau}"/><rect x="${x + 2}" y="${y - cao * 0.62}" width="16" height="${cao * 0.34}" rx="1.5" class="nhan-chai"/><text x="${x + 10}" y="${y - cao * 0.39}" text-anchor="middle" class="chai-chu">${nhan}</text></g>`;
}
function tram(id, ten, noiDung, nhanX, nhanY) {
	return `<g class="pl-tram" data-tram="${id}" data-may="${id}" tabindex="0" role="button" aria-label="${ten}">${noiDung}<g class="pl-nhan-tram"><rect x="${nhanX - 4}" y="${nhanY - 16}" rx="11" height="24" width="${ten.length * 8 + 16}"/><text x="${nhanX + 4}" y="${nhanY + 1}">${ten}</text></g></g>`;
}
function veCanh() {
	const tuong = `<rect width="1000" height="470" class="tuong"/>
<g class="gach">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 28}" x2="1000" y2="${i * 28}"/>`).join('')}</g>
<rect x="0" y="335" width="1000" height="135" class="ban-than"/><rect x="0" y="325" width="1000" height="14" class="ban-mat"/>
<g class="bien"><rect x="545" y="26" width="200" height="44" rx="8"/><text x="645" y="54" text-anchor="middle">PHÒNG LAB ẢO</text></g>
<g class="dong-ho"><circle cx="790" cy="60" r="24"/><line x1="790" y1="60" x2="790" y2="44"/><line x1="790" y1="60" x2="802" y2="66"/></g>`;

	const tuNguyenLieu = tram(
		'can',
		'1 · Nguyên liệu & cân',
		`<rect x="18" y="40" width="190" height="285" rx="8" class="tu"/><rect x="28" y="52" width="170" height="262" rx="4" class="tu-kinh"/>
<line x1="28" y1="140" x2="198" y2="140" class="ke"/><line x1="28" y1="228" x2="198" y2="228" class="ke"/>
${chai(36, 138, 'var(--hh-dau)', 'Dầu')}${chai(62, 138, '#d9b44a', 'MCT')}${chai(92, 138, '#9ec8e0', 'H₂O', 52)}${chai(120, 138, '#ecd9b0', 'WPI')}${chai(148, 138, '#b9c98d', 'PPI')}
${chai(40, 226, '#c7a6e6', 'T80')}${chai(68, 226, '#e0a3a3', 'S80')}${chai(98, 226, '#e8e2cf', 'XG', 40)}
<g class="can"><rect x="128" y="290" width="62" height="20" rx="3"/><rect x="138" y="282" width="42" height="8" rx="2" class="dia"/><rect x="138" y="296" width="30" height="9" rx="2" class="man"/><text x="153" y="303.5" text-anchor="middle" class="so-can">100,0</text></g>
<rect x="34" y="252" width="80" height="60" rx="4" class="tu-kinh"/>`,
		22,
		28,
	);
	const tuKhoa = (id, x, ten, mau) =>
		tram(
			id,
			ten,
			`<g class="khoa-mo"><rect x="${x}" y="34" width="140" height="104" rx="8" class="tu"/><rect x="${x + 10}" y="42" width="120" height="88" rx="4" class="tu-kinh"/>
<line x1="${x + 10}" y1="88" x2="${x + 130}" y2="88" class="ke"/>${[0, 1, 2, 3].map((i) => chai(x + 16 + i * 28, 86, mau[i % mau.length], '', 34)).join('')}${[0, 1, 2, 3].map((i) => chai(x + 16 + i * 28, 128, mau[(i + 1) % mau.length], '', 30)).join('')}</g>
<g class="o-khoa"><rect x="${x + 55}" y="80" width="30" height="24" rx="4"/><path d="M${x + 61} 80 v-8 a9 9 0 0 1 18 0 v8" /></g>`,
			x + 4,
			28,
		);
	const khuay = tram(
		'khuay',
		'2 · Máy khuấy',
		`<rect x="250" y="312" width="90" height="13" rx="3" class="may"/><rect x="262" y="140" width="10" height="175" class="may-toi"/>
<g class="pl-rung"><rect x="258" y="150" width="78" height="56" rx="10" class="may"/><rect x="270" y="162" width="40" height="12" rx="3" class="man-hinh"/><circle cx="322" cy="168" r="6" class="den"/>
<rect x="292" y="206" width="8" height="78" class="may-toi"/><rect x="286" y="278" width="20" height="14" rx="3" class="may-toi"/></g>`,
		246,
		354,
	);
	const dongHoa = tram(
		'dongHoa',
		'3 · Máy đồng hóa',
		`<g class="pl-rung"><rect x="380" y="170" width="200" height="155" rx="10" class="may"/><rect x="380" y="170" width="200" height="26" rx="10" class="may-dau"/>
<circle cx="440" cy="250" r="36" class="dong-ho-ap"/><g class="vach">${Array.from({ length: 9 }, (_, i) => { const a = ((-120 + i * 30) * Math.PI) / 180; return `<line x1="${440 + 28 * Math.sin(a)}" y1="${250 - 28 * Math.cos(a)}" x2="${440 + 33 * Math.sin(a)}" y2="${250 - 33 * Math.cos(a)}"/>`; }).join('')}</g>
<g class="pl-kim" style="transform-origin:440px 250px;transform:rotate(-120deg)"><line x1="440" y1="250" x2="440" y2="222"/></g><circle cx="440" cy="250" r="4" class="tam"/>
<text x="440" y="276" text-anchor="middle" class="nho">bar</text>
<rect x="495" y="214" width="70" height="30" rx="4" class="man-hinh"/><text x="530" y="234" text-anchor="middle" class="man-chu" data-man="dongHoa">--</text>
<rect x="495" y="256" width="70" height="14" rx="3" class="may-toi"/><rect x="500" y="290" width="18" height="18" rx="9" class="den"/><rect x="528" y="292" width="34" height="14" rx="3" class="nut-may"/>
<rect x="560" y="140" width="22" height="34" rx="4" class="may-toi"/><path d="M571 140 v-14 h-26" class="ong-dan"/></g>`,
		386,
		354,
	);
	const doHat = tram(
		'do',
		'4 · Máy đo hạt',
		`<rect x="612" y="220" width="140" height="105" rx="10" class="may"/><rect x="624" y="232" width="116" height="62" rx="5" class="man-hinh"/>
<polyline data-man="do" points="" class="man-duong"/><rect x="630" y="302" width="40" height="12" rx="3" class="may-toi"/><circle cx="728" cy="308" r="6" class="den"/>
<g class="tia"><line x1="612" y1="300" x2="600" y2="300"/></g>`,
		618,
		354,
	);
	const tuThoiGian = tram(
		'tua',
		'5 · Tủ tua nhanh',
		`<rect x="782" y="120" width="130" height="205" rx="10" class="tu"/><rect x="796" y="138" width="102" height="140" rx="6" class="tu-kinh sang"/>
<g data-man="tua" transform="translate(817,140)"></g>
<rect x="796" y="286" width="102" height="28" rx="4" class="man-hinh"/><text x="847" y="305" text-anchor="middle" class="man-chu" data-man="ngay">0 ngày</text>`,
		786,
		354,
	);
	const soTay = tram(
		'so-tay',
		'Sổ tay',
		`<g class="so-tay"><rect x="930" y="300" width="56" height="24" rx="3" transform="rotate(-6 958 312)"/><line x1="938" y1="306" x2="976" y2="302" class="dong"/><line x1="938" y1="312" x2="972" y2="308" class="dong"/></g>`,
		934,
		354,
	);
	const coc = `<g class="pl-coc" aria-hidden="true"><path d="M-17 -44 h34 l-3 42 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 z" class="coc-vien"/>
<clipPath id="pl-coc-cat"><path d="M-16 -40 h32 l-3 38 a2 2 0 0 1 -2 2 h-22 a2 2 0 0 1 -2 -2 z"/></clipPath>
<g clip-path="url(#pl-coc-cat)"><rect class="coc-nuoc" x="-20" y="-30" width="40" height="32"/><rect class="coc-dau" x="-20" y="-38" width="40" height="8"/><rect class="coc-nhu" x="-20" y="-38" width="40" height="40"/></g></g>`;
	return `<defs><linearGradient id="pl-kinh-gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
${tuong}${tuKhoa('tu-phu-gia', 222, 'Tủ phụ gia 🔒', ['#e8c8a0', '#c9dbe8', '#e7b8b8'])}${tuKhoa('tu-duoc', 372, 'Tủ dược chất 🔒', ['#cfe3cf', '#e3d4f0', '#f0e3c0'])}${tuNguyenLieu}${khuay}${dongHoa}${doHat}${tuThoiGian}${soTay}${coc}`;
}

const VI_TRI_COC = { can: [76, 312], khuay: [296, 312], dongHoa: [355, 324], do: [600, 324], tua: [940, 285] };

function capNhatCanh() {
	const svg = goc.querySelector('.pl-canh');
	svg.querySelectorAll('[data-tram]').forEach((g) => g.classList.toggle('dang', g.dataset.tram === S.tram));
	// Cốc
	const coc = svg.querySelector('.pl-coc');
	const viTri = S.xong.do ? 'do' : S.xong.dongHoa ? 'dongHoa' : S.xong.khuay ? 'khuay' : 'can';
	const [x, y] = VI_TRI_COC[S.tram === 'tua' && S.xong.do ? 'do' : viTri];
	coc.style.transform = `translate(${x}px, ${y}px)`;
	coc.classList.toggle('rong', !S.xong.can);
	const daTron = S.xong.khuay || S.xong.dongHoa;
	coc.classList.toggle('da-tron', daTron);
	const dau = coc.querySelector('.coc-dau');
	const dDay = Math.max(2, (S.me.phanTramDau / 100) * 34);
	dau.setAttribute('y', String(-38));
	dau.setAttribute('height', String(dDay));
	coc.querySelector('.coc-nuoc').setAttribute('y', String(-38 + dDay));
	if (S.kq && daTron) {
		// giọt nhỏ tán xạ mạnh → trắng như sữa; giọt to → vàng ngà, trong hơn
		const t = Math.min(1, Math.max(0, Math.log10(S.kq.d32 / 0.3) / 2));
		coc.querySelector('.coc-nhu').style.fill = `color-mix(in srgb, var(--pl-nhu-to) ${Math.round(t * 100)}%, var(--pl-nhu-nho))`;
	}
	// Màn hình máy
	const manDH = svg.querySelector('[data-man="dongHoa"]');
	manDH.textContent = S.xong.dongHoa && S.kq ? `${soCD(S.kq.nhietRa, 0)} °C` : `${S.me.dongHoa.bar} bar`;
	const kim = svg.querySelector('.pl-kim');
	if (!S.dangChay) kim.style.transform = `rotate(${S.xong.dongHoa ? -120 + (240 * S.me.dongHoa.bar) / 1500 : -120}deg)`;
	const duong = svg.querySelector('[data-man="do"]');
	if (S.kq && S.xong.do) {
		const lop = lopKichThuoc(S.kq.dv50, S.kq.sigma, 31);
		const wMax = Math.max(...lop.map((l) => l.w));
		const X = (d) => 628 + ((Math.log10(d) + 1.3) / 4) * 108;
		duong.setAttribute('points', lop.filter((l) => l.d > 0.05 && l.d < 500).map((l) => `${X(l.d).toFixed(1)},${(288 - (l.w / wMax) * 48).toFixed(1)}`).join(' '));
	} else duong.setAttribute('points', '');
	const ongNho = svg.querySelector('[data-man="tua"]');
	ongNho.innerHTML = S.kq && S.xong.do ? veOng(S.kq.ongNghiem(S.ngay, S.bq.nhietDo), S.kq, 60, 138).replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/pl-ong-cat-60/g, 'pl-ong-nho') : '';
	svg.querySelector('[data-man="ngay"]').textContent = S.xong.do ? `${S.ngay} ngày` : '—';
}

if (goc) khoiDong(goc);
