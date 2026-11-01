// Tương tác của web (chạy hoàn toàn trên máy người xem, không gửi dữ liệu đi đâu):
//  1. Ống nghiệm nhũ tương ở trang chủ: giọt nổi theo định luật Stokes, kéo thanh trượt đổi cỡ giọt.
//  2. Tiến độ đọc: nút "Đánh dấu đã đọc" cuối bài, bản đồ lộ trình, thẻ "Tiếp tục đọc", dấu ✓ ở thanh bên.
//  3. Thẻ "Khái niệm hôm nay" đổi theo ngày.
import { stokes } from './cong-thuc.js';

const KHOA_DA_DOC = 'nt:da-doc';
const KHOA_GAN_NHAT = 'nt:gan-nhat';
const TONG_BAI = 8;

function doc(khoa, macDinh) {
	try {
		const v = localStorage.getItem(khoa);
		return v ? JSON.parse(v) : macDinh;
	} catch {
		return macDinh;
	}
}
function ghi(khoa, v) {
	try {
		localStorage.setItem(khoa, JSON.stringify(v));
	} catch {
		/* chế độ riêng tư: bỏ qua */
	}
}
const daDoc = () => new Set(doc(KHOA_DA_DOC, []));
const so = (x, n = 2) => x.toLocaleString('vi-VN', { maximumSignificantDigits: n });

// ---------------------------------------------------------------- 1. Ống nghiệm
function ongNghiem(goc) {
	const cv = goc.querySelector('canvas');
	const ctx = cv.getContext('2d');
	const truot = goc.querySelector('[data-thanh-truot]');
	const oD = goc.querySelector('[data-d]');
	const oKq = goc.querySelector('[data-ket-qua]');
	const oNgay = goc.querySelector('[data-ngay]');
	const tinh = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const dpr = Math.min(2, devicePixelRatio || 1);
	const W = 240, H = 330;
	cv.width = W * dpr;
	cv.height = H * dpr;
	ctx.scale(dpr, dpr);

	// Lòng ống: x từ 30 đến 210, miệng ở y=18, đáy tròn bán kính 90 tại y=240
	const T = 30, P = 210, MIENG = 26, DAY = 238, R = (P - T) / 2;
	const CAO_MM = 100; // ống cao 10 cm
	const pxMoiMm = (DAY + R - MIENG) / CAO_MM;
	const trongOng = (x, y, r) => {
		if (x - r < T || x + r > P || y - r < MIENG) return false;
		if (y <= DAY) return true;
		return Math.hypot(x - (T + R), y - DAY) <= R - r;
	};

	let d = 1, giot = [], kem = 0, ngay = 0, truoc = 0;
	const dTuTruot = (v) => 0.2 * Math.pow(100, v / 100); // 0,2 → 20 µm, thang log
	const bkPx = (dd) => Math.max(1.4, Math.min(8, 1.4 + 1.5 * Math.log2(dd / 0.2)));

	function lac() {
		giot = [];
		kem = 0;
		ngay = 0;
		for (let i = 0; i < 900 && giot.length < 150; i++) {
			const dd = d * Math.exp((Math.random() - 0.5) * 0.6); // phân bố cỡ giọt ±30%
			const r = bkPx(dd);
			const x = T + r + Math.random() * (P - T - 2 * r);
			const y = MIENG + 30 + Math.random() * (DAY + R - MIENG - 34);
			if (trongOng(x, y, r)) giot.push({ x, y, r, dd, len: false });
		}
	}

	function capNhatChu() {
		const kq = stokes(d, 1000, 920, 1);
		oD.textContent = `${so(d)} µm`;
		const ngayTach = CAO_MM / kq.mmMoiNgay;
		let khi;
		if (ngayTach < 1 / 24) khi = `chưa tới 1 giờ`;
		else if (ngayTach < 1) khi = `khoảng ${so(ngayTach * 24)} giờ`;
		else if (ngayTach < 60) khi = `khoảng ${so(ngayTach)} ngày`;
		else if (ngayTach < 730) khi = `khoảng ${so(ngayTach / 30)} tháng`;
		else khi = `hơn ${so(ngayTach / 365)} năm`;
		oKq.innerHTML = `Giọt nổi <strong>${so(kq.mmMoiNgay)} mm/ngày</strong>. Ống 10 cm tách lớp kem sau ${khi}.`;
	}

	function ve() {
		ctx.clearRect(0, 0, W, H);
		const css = getComputedStyle(document.documentElement);
		const mauDau = css.getPropertyValue('--hh-dau').trim() || '#e29a30';
		const mauDauSang = css.getPropertyValue('--hh-dau-sang').trim() || '#fde7b8';
		// lòng ống
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(T, MIENG);
		ctx.lineTo(T, DAY);
		ctx.arc(T + R, DAY, R, Math.PI, 0, true);
		ctx.lineTo(P, MIENG);
		ctx.closePath();
		ctx.clip();
		const g = ctx.createLinearGradient(0, MIENG, 0, DAY + R);
		g.addColorStop(0, 'rgba(255,255,255,0.20)');
		g.addColorStop(1, 'rgba(255,255,255,0.10)');
		ctx.fillStyle = g;
		ctx.fillRect(T, MIENG, P - T, DAY + R);
		// độ đục: nhiều giọt còn lơ lửng thì nước trông như sữa
		const conLo = giot.filter((q) => !q.len).length / Math.max(1, giot.length);
		ctx.fillStyle = `rgba(255,248,232,${0.06 + 0.4 * conLo * (d < 1 ? 1 : 0.5)})`;
		ctx.fillRect(T, MIENG + kem, P - T, DAY + R);
		// lớp kem
		if (kem > 0) {
			const gk = ctx.createLinearGradient(0, MIENG, 0, MIENG + kem);
			gk.addColorStop(0, mauDau);
			gk.addColorStop(1, mauDauSang);
			ctx.fillStyle = gk;
			ctx.fillRect(T, MIENG, P - T, kem);
		}
		// giọt
		for (const q of giot) {
			if (q.len) continue;
			const rg = ctx.createRadialGradient(q.x - q.r * 0.35, q.y - q.r * 0.35, q.r * 0.1, q.x, q.y, q.r);
			rg.addColorStop(0, mauDauSang);
			rg.addColorStop(1, mauDau);
			ctx.fillStyle = rg;
			ctx.beginPath();
			ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
		// vạch chia trên thành ống
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.fillStyle = 'rgba(255,255,255,0.75)';
		ctx.font = '10px "JetBrains Mono", monospace';
		ctx.lineWidth = 1;
		for (let mm = 0; mm <= 100; mm += 10) {
			const y = DAY + R - mm * pxMoiMm;
			if (y > DAY + 4) continue; // phần đáy tròn: không kẻ vạch
			const dai = mm % 50 === 0 ? 14 : 8;
			ctx.beginPath();
			ctx.moveTo(P - dai, y);
			ctx.lineTo(P, y);
			ctx.stroke();
			if (mm % 50 === 0 && mm > 0) ctx.fillText(`${mm / 10} cm`, P - 48, y + 3.5);
		}
		// thành ống thủy tinh
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.moveTo(T - 1.5, MIENG - 12);
		ctx.lineTo(T - 1.5, DAY);
		ctx.arc(T + R, DAY, R + 1.5, Math.PI, 0, true);
		ctx.lineTo(P + 1.5, MIENG - 12);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(T - 9, MIENG - 12);
		ctx.lineTo(P + 9, MIENG - 12);
		ctx.stroke();
		// ánh phản quang
		ctx.strokeStyle = 'rgba(255,255,255,0.35)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(T + 12, MIENG + 10);
		ctx.lineTo(T + 12, DAY - 10);
		ctx.stroke();
	}

	function buoc(t) {
		const dt = truoc ? Math.min(0.05, (t - truoc) / 1000) : 0;
		truoc = t;
		ngay += dt; // 1 giây = 1 ngày
		const dienTichKem = (P - T) * 1.0;
		for (const q of giot) {
			if (q.len) continue;
			const v = stokes(q.dd, 1000, 920, 1).mmMoiNgay * pxMoiMm; // px mỗi giây
			// chuyển động Brown: giọt càng nhỏ càng rung
			const rung = 9 / Math.max(1, q.dd * 3);
			q.x += (Math.random() - 0.5) * rung * dt * 6;
			q.y += (Math.random() - 0.5) * rung * dt * 6 - v * dt;
			q.x = Math.min(P - q.r, Math.max(T + q.r, q.x));
			if (q.y - q.r <= MIENG + kem) {
				q.len = true;
				kem = Math.min(120, kem + (Math.PI * q.r * q.r) / dienTichKem / 0.64); // giọt xếp chặt ~64%
			}
			if (!trongOng(q.x, q.y, q.r) && q.y > DAY) q.y -= 1;
		}
		oNgay.textContent = ngay < 1 ? `${so(ngay * 24, 2)} giờ` : `Ngày ${Math.floor(ngay)}`;
		ve();
		requestAnimationFrame(buoc);
	}

	const doiCo = () => {
		d = dTuTruot(Number(truot.value));
		capNhatChu();
		lac();
		if (tinh) ve();
	};
	truot.addEventListener('input', doiCo);
	goc.querySelector('[data-lac]').addEventListener('click', () => {
		lac();
		if (tinh) ve();
	});
	doiCo();
	if (tinh) {
		oNgay.textContent = 'Đã tắt chuyển động';
		ve();
	} else requestAnimationFrame(buoc);
}

// ---------------------------------------------------------------- 2. Tiến độ đọc
function veTienDo() {
	const ds = daDoc();
	document.querySelectorAll('[data-slug]').forEach((a) => {
		const xong = ds.has(a.dataset.slug);
		a.classList.toggle('da-doc', xong);
		const tt = a.querySelector('[data-trang-thai]');
		if (tt) tt.textContent = xong ? 'Đã đọc ✓' : 'Chưa đọc';
	});
	// đếm theo khu: bài nhũ tương lưu slug trần, khu khác lưu "khu/slug"
	const demKhu = (khu) => [...ds].filter((s) => (khu === 'nhu-tuong' ? !s.includes('/') : s.startsWith(khu + '/'))).length;
	const n = Math.min(demKhu('nhu-tuong'), TONG_BAI);
	document.querySelectorAll('[data-tong-tien-do]').forEach((e) => (e.textContent = `Đã đọc ${n}/${TONG_BAI} bài`));
	document.querySelectorAll('[data-thanh-tien-do]').forEach((e) => (e.style.width = `${(100 * n) / TONG_BAI}%`));
	document.querySelectorAll('[data-tien-do-khu]').forEach((e) => {
		const k = demKhu(e.dataset.tienDoKhu);
		e.textContent = k ? `Đã đọc ${k}/${e.dataset.tong}` : `${e.dataset.tong} bài`;
	});
	// dấu ✓ ở thanh bên (mọi khu)
	document.querySelectorAll('.sidebar-content a[href]').forEach((a) => {
		const m = a.getAttribute('href').match(/\/(nhu-tuong|chat-beo|chat-nhu-hoa|chat-on-dinh|thuc-pham|duoc-pham)\/([^/]+)\/?$/);
		if (!m) return;
		a.classList.toggle('da-doc', ds.has(m[1] === 'nhu-tuong' ? m[2] : `${m[1]}/${m[2]}`));
	});
	// hộp cuối bài
	const kb = document.querySelector('[data-ket-bai]');
	if (kb) {
		const xong = ds.has(kb.dataset.ketBai);
		const k = demKhu(kb.dataset.khu);
		kb.classList.toggle('xong', xong);
		kb.querySelector('[data-danh-dau]').textContent = xong ? 'Đã đọc ✓ (bấm để bỏ)' : 'Đánh dấu đã đọc';
		kb.querySelector('[data-tien-do]').textContent = xong
			? `Bạn đã đọc ${k}/${kb.dataset.tong} bài của khu ${kb.dataset.tenKhu}. Dữ liệu chỉ lưu trên máy này.`
			: 'Đánh dấu để theo dõi tiến độ của bạn. Dữ liệu chỉ lưu trên máy này.';
	}
	// thẻ "Tiếp tục đọc"
	const tiep = document.querySelector('[data-tiep-tuc]');
	const gan = doc(KHOA_GAN_NHAT, null);
	if (tiep && gan) {
		tiep.href = gan.href;
		tiep.querySelector('[data-tiep-tuc-tieu-de]').textContent = 'Đọc tiếp';
		tiep.querySelector('[data-tiep-tuc-mo]').textContent = gan.ten;
	}
}

function ghiBaiDangDoc() {
	const kb = document.querySelector('[data-ket-bai]');
	if (!kb) return;
	const dai = document.querySelector('.dai-chang .dc-nhan');
	const h1 = document.querySelector('h1#_top');
	const nhan = dai ? dai.firstChild.textContent.trim().split(' · ')[0] : '';
	ghi(KHOA_GAN_NHAT, { href: location.pathname, ten: `${nhan ? nhan + ' · ' : ''}${h1 ? h1.textContent.split(' – ')[0] : ''}` });
	kb.querySelector('[data-danh-dau]').addEventListener('click', () => {
		const ds = daDoc();
		const s = kb.dataset.ketBai;
		ds.has(s) ? ds.delete(s) : ds.add(s);
		ghi(KHOA_DA_DOC, [...ds]);
		veTienDo();
	});
}

// ---------------------------------------------------------------- 3. Khái niệm hôm nay
function khaiNiem() {
	const the = document.querySelector('[data-khai-niem]');
	const dl = document.getElementById('du-lieu-thuat-ngu');
	if (!the || !dl) return;
	const ds = JSON.parse(dl.textContent);
	if (!ds.length) return;
	const hom = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
	const k = ds[hom % ds.length];
	the.querySelector('[data-kn-vi]').textContent = k.vi;
	the.querySelector('[data-kn-en]').textContent = k.en;
	the.querySelector('[data-kn-mo]').textContent = k.mo;
	if (k.bai) {
		const a = the.querySelector('[data-kn-link]');
		a.href = a.href.replace(/thuat-ngu\/$/, `${k.bai}/`);
		a.textContent = 'Đọc trong bài';
	}
}

function chay() {
	const ong = document.querySelector('[data-ong-nghiem]');
	if (ong) ongNghiem(ong);
	ghiBaiDangDoc();
	khaiNiem();
	veTienDo();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
else chay();
