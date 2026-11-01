// Máy tính tương tác. Tìm mọi <div class="may-tinh" data-may-tinh="..."> trên trang và dựng biểu mẫu.
// Phép tính chạy trong trình duyệt; không gửi số liệu đi đâu.
import { stokes, chatNhuHoaToiThieu } from './cong-thuc.js';

const MU = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const so = (x, chuSo = 3) => x.toLocaleString('vi-VN', { maximumSignificantDigits: chuSo });
function soKH(x, chuSo = 2) {
	// 4,4 × 10⁻⁸ cho số rất nhỏ / rất lớn; còn lại ghi thường
	if (x === 0 || !isFinite(x)) return String(x);
	const a = Math.abs(x);
	if (a >= 1e-3 && a < 1e5) return so(x, chuSo + 1);
	const e = Math.floor(Math.log10(a));
	const m = x / 10 ** e;
	const mu = String(e).replace('-', '⁻').replace(/\d/g, (c) => MU[c]);
	return `${so(m, chuSo)} × 10${mu}`;
}
const doc = (o) => parseFloat(String(o.value).replace(',', '.'));

function o(ten, nhan, donVi, macDinh, goiY = '') {
	return `<label class="mt-o"><span class="mt-nhan">${nhan}</span>
<span class="mt-nhap"><input name="${ten}" inputmode="decimal" value="${macDinh}" autocomplete="off" /><span class="mt-dv">${donVi}</span></span>
${goiY ? `<span class="mt-goi-y">${goiY}</span>` : ''}</label>`;
}
const K = '<span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span>';
const T = '<span class="nhan nhan-T" title="Tính minh họa">T</span>';
const G = '<span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span>';

const MAY = {
	stokes: {
		tieuDe: 'Máy tính vận tốc kem hóa (Stokes)',
		congThuc: 'v = 2 r² (ρ<sub>c</sub> − ρ<sub>d</sub>) g / (9 η<sub>c</sub>)',
		o: [
			o('d', 'Đường kính giọt d', 'µm', '1', 'Nên nhập d₉₀ hoặc d₄₃, không phải trung bình số'),
			o('rc', 'Tỷ trọng pha liên tục ρ<sub>c</sub>', 'kg/m³', '1000', 'Nước ≈ 1000'),
			o('rd', 'Tỷ trọng pha phân tán ρ<sub>d</sub>', 'kg/m³', '920', 'Dầu thực vật ≈ 910–930'),
			o('eta', 'Độ nhớt pha liên tục η<sub>c</sub>', 'mPa·s', '1', 'Nước 25 °C ≈ 0,89'),
			o('ngay', 'Thời gian bảo quản', 'ngày', '30'),
		].join(''),
		tinh(f) {
			const d = doc(f.d), rc = doc(f.rc), rd = doc(f.rd), eta = doc(f.eta), ngay = doc(f.ngay);
			if (![d, rc, rd, eta, ngay].every((x) => x > 0)) return '<p class="mt-loi">Nhập số dương cho tất cả các ô.</p>';
			const { v, mmMoiNgay } = stokes(d, rc, rd, eta);
			const huong = v > 0 ? 'nổi lên (kem hóa)' : v < 0 ? 'lắng xuống' : 'đứng yên (tỷ trọng bằng nhau)';
			const quang = Math.abs(mmMoiNgay) * ngay;
			const quangChu = quang >= 1000 ? `${so(quang / 1000)} m` : `${so(quang)} mm`;
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Vận tốc</span><strong>${soKH(Math.abs(v))} m/s</strong> · giọt ${huong}</div>
<div><span class="mt-kq-nhan">Mỗi ngày</span><strong>${so(Math.abs(mmMoiNgay))} mm</strong></div>
<div><span class="mt-kq-nhan">Sau ${so(ngay)} ngày</span><strong>${quangChu}</strong> (nếu không có gì cản)</div>
</div>
<p class="mt-meo">Giọt gấp đôi thì nổi nhanh gấp 4 (v ∝ d²); độ nhớt gấp 10 thì chậm 10 lần (v ∝ 1/η).</p>`;
		},
		chuY: `<li>Công thức cho giọt cầu cứng, đơn lẻ, pha liên tục Newton. ${K}</li>
<li>Giọt <strong>keo tụ</strong> thành cụm sẽ nổi <strong>nhanh hơn</strong> dự đoán; φ cao, mạng gel hoặc ngưỡng chảy làm <strong>chậm hơn</strong> hoặc dừng hẳn. ${G}</li>
<li>Giọt dưới ~1 µm chịu chuyển động Brown, kem hóa thực tế chậm hơn tính toán. ${K}</li>
<li>Kiểm máy tính: d = 1 µm, Δρ = 80 kg/m³, η = 1 mPa·s cho ≈ 3,8 mm/ngày, khớp bảng ví dụ trong bài. ${T}</li>`,
	},
	'chat-nhu-hoa-toi-thieu': {
		tieuDe: 'Diện tích bề mặt và lượng chất nhũ hóa tối thiểu',
		congThuc: 'A = 6φ / d<sub>32</sub> ; c<sub>min</sub> = Γ · A',
		o: [
			o('phi', 'Phân số thể tích pha phân tán φ', '', '0,2', 'Ví dụ 20% dầu thể tích → 0,2'),
			o('d32', 'Đường kính Sauter d<sub>32</sub>', 'µm', '1'),
			o('gam', 'Độ phủ bề mặt Γ', 'mg/m²', '2', 'Protein cầu: cỡ vài mg/m². Nhập theo số liệu của chất bạn dùng'),
		].join(''),
		tinh(f) {
			const phi = doc(f.phi), d32 = doc(f.d32), gam = doc(f.gam);
			if (![phi, d32, gam].every((x) => x > 0)) return '<p class="mt-loi">Nhập số dương cho tất cả các ô.</p>';
			if (phi >= 1) return '<p class="mt-loi">φ là phân số (0–1), ví dụ 0,2 cho 20%.</p>';
			const { A, cGL, phanTramWV } = chatNhuHoaToiThieu(phi, d32, gam);
			const canhBao =
				phi > 0.74
					? '<p class="mt-loi">φ > 0,74: giọt buộc phải biến dạng (HIPE), công thức giọt cầu không còn đúng.</p>'
					: '';
			return `${canhBao}<div class="mt-kq">
<div><span class="mt-kq-nhan">Diện tích bề mặt</span><strong>${soKH(A)} m²</strong> trên 1 m³ nhũ tương (= ${soKH(A / 1000)} m² mỗi lít)</div>
<div><span class="mt-kq-nhan">Tối thiểu lý thuyết</span><strong>${so(cGL)} g/L</strong> ≈ ${so(phanTramWV)}% w/v</div>
<div><span class="mt-kq-nhan">Dư 1,5–3 lần</span><strong>${so(cGL * 1.5)}–${so(cGL * 3)} g/L</strong> ≈ ${so(phanTramWV * 1.5)}–${so(phanTramWV * 3)}% w/v ${G}</div>
</div>
<p class="mt-meo">Giảm d<sub>32</sub> 10 lần thì diện tích và lượng chất nhũ hóa cần tăng 10 lần.</p>`;
		},
		chuY: `<li>Giọt cầu; tính cho thể tích nhũ tương, Γ là độ phủ khi bão hòa. ${K}</li>
<li>Thực tế cần dư 1,5–3 lần để bù phần không nằm trên bề mặt, tránh bắc cầu khi thiếu phủ và bù giải hấp khi bảo quản. ${G}</li>
<li>Kiểm máy tính: φ = 0,2, d<sub>32</sub> = 1 µm, Γ = 2 mg/m² cho ≈ 2,4 g/L, khớp bảng ví dụ trong bài. ${T}</li>`,
	},
};

function dung(el) {
	const m = MAY[el.dataset.mayTinh];
	if (!m || el.dataset.daDung) return;
	el.dataset.daDung = '1';
	el.innerHTML = `<div class="mt-dau"><span class="mt-the">Máy tính</span><strong>${m.tieuDe}</strong></div>
<div class="mt-cong-thuc">${m.congThuc}</div>
<form class="mt-form" onsubmit="return false">${m.o}</form>
<div class="mt-ket-qua" aria-live="polite"></div>
<details class="mt-chu-y"><summary>Giả thiết và giới hạn</summary><ul>${m.chuY}</ul></details>`;
	const form = el.querySelector('form');
	const kq = el.querySelector('.mt-ket-qua');
	const chay = () => (kq.innerHTML = m.tinh(form.elements));
	form.addEventListener('input', chay);
	chay();
}

function khoiDong() {
	document.querySelectorAll('[data-may-tinh]').forEach(dung);
	// lọc trên trang Nguồn
	const loc = document.getElementById('loc-nguon');
	if (loc && !loc.dataset.daDung) {
		loc.dataset.daDung = '1';
		const the = [...document.querySelectorAll('.the-nguon')];
		const bo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
		const chu = the.map((t) => bo(t.textContent));
		loc.addEventListener('input', () => {
			const q = bo(loc.value.trim());
			the.forEach((t, i) => (t.hidden = q && !chu[i].includes(q)));
		});
	}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
