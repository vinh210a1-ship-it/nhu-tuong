// Máy tính tương tác. Tìm mọi <div class="may-tinh" data-may-tinh="..."> trên trang và dựng biểu mẫu.
// Phép tính chạy trong trình duyệt; không gửi số liệu đi đâu.
import { stokes, chatNhuHoaToiThieu, hlbTron, hlbPhanA, q10DoiThoiGian, arrhenius } from './cong-thuc.js';

const BASE = new URL('.', import.meta.url).pathname; // '/nhu-tuong/'
// huy hiệu N có liên kết tới thẻ nguồn (giống nhãn trong bài)
const N = (...ds) =>
	`<span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan">${ds
		.map(([khoa, ten]) => `<a class="nhan-nguon" href="${BASE}nguon/#${khoa}">${ten}</a>`)
		.join(', ')}</span></span>`;
// đổi số giờ ra cách đọc dễ hiểu
function thoiGianChu(gio) {
	if (!isFinite(gio)) return '—';
	if (gio < 48) return `${so(gio)} giờ`;
	const ngay = gio / 24;
	if (ngay < 90) return `${so(ngay)} ngày`;
	if (ngay < 730) return `${so(ngay / 30.4)} tháng`;
	return `${so(ngay / 365)} năm`;
}

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
	hlb: {
		tieuDe: 'Trộn hai chất nhũ hóa theo HLB',
		congThuc: 'HLB<sub>hỗn hợp</sub> = w<sub>A</sub>·HLB<sub>A</sub> + w<sub>B</sub>·HLB<sub>B</sub>',
		o: [
			o('a', 'HLB chất A', '', '4', 'Lấy từ tài liệu kỹ thuật (TDS) của nhà cung cấp'),
			o('b', 'HLB chất B', '', '15', 'Số mặc định là ví dụ, không phải của chất cụ thể nào'),
			o('wa', 'Phần khối lượng chất A', '%', '30'),
			o('muc', 'HLB mục tiêu (tùy chọn)', '', '12', 'Để trống nếu chỉ muốn tính HLB hỗn hợp'),
		].join(''),
		tinh(f) {
			const a = doc(f.a), b = doc(f.b), wa = doc(f.wa) / 100, muc = doc(f.muc);
			if (![a, b].every((x) => x >= 0 && x <= 40) || !(wa >= 0 && wa <= 1))
				return '<p class="mt-loi">Nhập HLB từ 0 đến 40 và phần khối lượng từ 0 đến 100%.</p>';
			const h = hlbTron(a, b, wa);
			let dongMuc = '';
			if (isFinite(muc)) {
				const p = hlbPhanA(a, b, muc);
				dongMuc =
					p === null
						? `<div><span class="mt-kq-nhan">HLB ${so(muc)}</span><strong>không đạt được</strong> · mục tiêu phải nằm giữa HLB của A và B</div>`
						: `<div><span class="mt-kq-nhan">Để đạt HLB ${so(muc)}</span><strong>${so(p * 100)}% A + ${so((1 - p) * 100)}% B</strong> (theo khối lượng)</div>`;
			}
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">HLB hỗn hợp</span><strong>${so(h)}</strong> với ${so(wa * 100)}% A + ${so((1 - wa) * 100)}% B</div>
${dongMuc}</div>
<p class="mt-meo">Đây là điểm xuất phát để thử, không phải đáp án: làm một dãy quanh HLB tính được rồi đo kích thước giọt và độ bền.</p>`;
		},
		chuY: `<li>Cộng tuyến tính theo khối lượng là quy tắc giáo khoa ${K}; với este sucrose, một nghiên cứu thấy trộn tuyến tính theo HLB trong dải 10–16 ${N(['gupta1983', 'Gupta 1983'])}.</li>
<li>HLB là con số tĩnh, không tính đến loại dầu, nhiệt độ, muối, pH ${N(['abbott', 'Abbott'])}. Trong kem lạnh, HLB không giải thích hết khả năng gây mất ổn định mỡ ${N(['goff1989', 'Goff 1989'])}.</li>
<li>Chất không ion dạng polyethoxy đổi HLB theo nhiệt độ; cần chính xác thì dùng PIT hoặc HLD ${K}.</li>
<li>Số mặc định (4 và 15) chỉ là ví dụ để thấy phép tính ${T}. Bảng HLB từng chất trên web chưa được kiểm với tài liệu nhà sản xuất.</li>`,
	},
	q10: {
		tieuDe: 'Quy đổi thời gian theo Q10',
		congThuc: 't<sub>2</sub> = t<sub>1</sub> · Q10<sup>(T<sub>1</sub> − T<sub>2</sub>)/10</sup>',
		o: [
			o('t1', 'Thời gian đo được t<sub>1</sub>', 'ngày', '30', 'Ví dụ: số ngày tới khi PV vượt ngưỡng'),
			o('T1', 'ở nhiệt độ T<sub>1</sub>', '°C', '45'),
			o('T2', 'Quy về nhiệt độ T<sub>2</sub>', '°C', '25'),
			o('q', 'Hệ số Q10', '', '2', 'Phản ứng nhanh lên Q10 lần khi tăng 10 °C'),
		].join(''),
		tinh(f) {
			const t1 = doc(f.t1), T1 = doc(f.T1), T2 = doc(f.T2), q = doc(f.q);
			if (!(t1 > 0 && q > 0) || !isFinite(T1) || !isFinite(T2)) return '<p class="mt-loi">Nhập thời gian và Q10 dương, nhiệt độ là số.</p>';
			const t2 = q10DoiThoiGian(t1, T1, T2, q);
			const bien = [1.5, 3].map((qq) => q10DoiThoiGian(t1, T1, T2, qq));
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Ở ${so(T2)} °C</span><strong>${thoiGianChu(t2 * 24)}</strong> (Q10 = ${so(q)})</div>
<div><span class="mt-kq-nhan">Nếu Q10 = 1,5 hoặc 3</span><strong>${thoiGianChu(bien[0] * 24)} – ${thoiGianChu(bien[1] * 24)}</strong></div>
</div>
<p class="mt-meo">Q10 thay đổi một chút là kết quả đổi rất nhiều; hãy xem dòng thứ hai trước khi tin con số ở dòng đầu.</p>`;
		},
		chuY: `<li>Q10 giả định cơ chế hỏng không đổi giữa hai nhiệt độ ${K}. Ở nhiệt độ cao, chất béo có thể nóng chảy, nhũ tương có thể vỡ, cơ chế oxy hóa có thể đổi ${G}.</li>
<li>Q10 không phải hằng số chung; nên tính từ dữ liệu của chính sản phẩm (máy Arrhenius bên dưới cho Q10 từ số đo).</li>
<li>Luôn xác nhận bằng mẫu bảo quản thực ở nhiệt độ mục tiêu ${G}.</li>`,
	},
	arrhenius: {
		tieuDe: 'Hạn dùng theo Arrhenius từ thử nghiệm tăng tốc',
		congThuc: 'ln t = a + E<sub>a</sub> / (R·T)',
		o: [
			...[[90, 20], [100, 9], [110, 4.2], [120, 2]].map(([c, t], i) =>
				`<div class="mt-cap">${o(`c${i}`, `Nhiệt độ ${i + 1}`, '°C', String(c))}${o(`t${i}`, `Thời gian ${i + 1}`, 'giờ', String(t).replace('.', ','), i === 0 ? 'Ví dụ: thời gian cảm ứng Rancimat' : '')}</div>`,
			),
			o('dich', 'Nhiệt độ bảo quản', '°C', '25'),
		].join(''),
		tinh(f) {
			const diem = [0, 1, 2, 3].map((i) => [doc(f[`c${i}`]), doc(f[`t${i}`])]).filter(([c, t]) => isFinite(c) && t > 0);
			const dich = doc(f.dich);
			if (diem.length < 2 || new Set(diem.map(([c]) => c)).size < 2 || !isFinite(dich))
				return '<p class="mt-loi">Cần ít nhất 2 cặp (nhiệt độ, thời gian) với nhiệt độ khác nhau. Để trống ô không dùng.</p>';
			const k = arrhenius(diem);
			if (!(k.EaKJ > 0)) return '<p class="mt-loi">Thời gian phải ngắn lại khi nhiệt độ tăng; kiểm tra lại số liệu.</p>';
			const nhieu = diem.length >= 3 ? `R² = ${so(k.r2, 3)}` : 'chỉ 2 điểm, không đánh giá được độ khớp';
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Ngoại suy ở ${so(dich)} °C</span><strong>${thoiGianChu(k.thoiGianTai(dich))}</strong></div>
<div><span class="mt-kq-nhan">Năng lượng hoạt hóa</span><strong>${so(k.EaKJ)} kJ/mol</strong> · ${nhieu}</div>
<div><span class="mt-kq-nhan">Q10 quanh ${so(dich)} °C</span><strong>${so(k.q10Tai(dich))}</strong></div>
</div>
<p class="mt-meo">Dùng để <strong>xếp hạng</strong> các công thức với nhau; đừng in con số ngoại suy lên nhãn khi chưa có mẫu bảo quản thực.</p>`;
		},
		chuY: `<li>Số mặc định là ví dụ tự đặt để thấy phép tính, không phải số đo của dầu nào ${T}.</li>
<li>Ngoại suy từ thử nghiệm Rancimat có thể sai rất xa: với dầu óc chó, hạn dùng dự đoán thấp hơn hạn dùng ghi trên nhãn 15–20 lần ${N(['kochhar2009', 'Kochhar 2009'])}.</li>
<li>Ở 90–120 °C, độ tan oxy, cơ chế phản ứng và vai trò chất chống oxy hóa khác với 25 °C; kết quả không đại diện cho nhũ tương, bột hay sản phẩm có nước ${G}. Với nhũ tương và bột nên thử ở nhiệt độ thấp hơn (ví dụ 35–55 °C) và nhiều điểm thời gian ${G}.</li>
<li>Phương pháp: đo ở 3–4 nhiệt độ, vẽ ln(thời gian) theo 1/T, ngoại suy ${K}; ví dụ áp dụng cho dầu bơ ${N(['aktar2019', 'Aktar 2019'])}.</li>`,
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
	// lọc trên trang Tra cứu phụ gia: ô chữ + nút nhóm + đếm số thẻ đang hiện
	const locPg = document.getElementById('loc-phu-gia');
	if (locPg && !locPg.dataset.daDung) {
		locPg.dataset.daDung = '1';
		const the = [...document.querySelectorAll('.the-pg')];
		const nut = [...document.querySelectorAll('[data-loc-nhom]')];
		const dem = document.querySelector('[data-dem-phu-gia]');
		const bo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
		// mã trong thẻ viết "E471"; người dùng hay gõ "471" hoặc "e 471" -> so trên chữ đã bỏ khoảng trắng
		const chu = the.map((t) => bo(t.textContent).replace(/\s+/g, ''));
		let nhom = '';
		const chay = () => {
			const q = bo(locPg.value).replace(/\s+/g, '');
			let n = 0;
			the.forEach((t, i) => {
				const hien = (!nhom || t.dataset.nhom === nhom) && (!q || chu[i].includes(q));
				t.hidden = !hien;
				if (hien) n++;
			});
			if (dem) dem.textContent = n ? `Đang hiện ${n} / ${the.length} chất` : 'Không thấy chất nào khớp. Thử gõ chỉ phần số của mã, ví dụ 471.';
		};
		nut.forEach((b) =>
			b.addEventListener('click', () => {
				nhom = b.dataset.locNhom;
				nut.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
				chay();
			}),
		);
		locPg.addEventListener('input', chay);
		chay();
	}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
