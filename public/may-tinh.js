// Máy tính tương tác. Tìm mọi <div class="may-tinh" data-may-tinh="..."> trên trang và dựng biểu mẫu.
// Phép tính chạy trong trình duyệt; không gửi số liệu đi đâu.
import { stokes, chatNhuHoaToiThieu, hlbTron, hlbPhanA, q10DoiThoiGian, arrhenius, laplace, lucIon, debye, pickering, ostwald, totox, ivSv, phanChuaPhanLy, giaTriF } from './cong-thuc.js';

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
	ostwald: {
		tieuDe: 'Ostwald ripening: d³ có tăng tuyến tính theo thời gian?',
		congThuc: 'r³(t) = r³(0) + ω·t &nbsp;⇒&nbsp; vẽ d³ theo t, độ dốc = 8ω',
		o: [
			...[[0, '0,200'], [7, '0,211'], [14, '0,221'], [21, '0,230'], [28, '0,239']].map(([t, d], i) =>
				`<div class="mt-cap">${o(`t${i}`, `Thời điểm ${i + 1}`, 'ngày', String(t))}${o(`d${i}`, `Kích thước ${i + 1}`, 'µm', d, i === 0 ? 'Nên dùng cùng một loại đường kính (z-average hoặc d₄₃) cho mọi điểm' : '')}</div>`,
			),
			o('du', 'Dự đoán kích thước ở thời điểm', 'ngày', '90'),
		].join(''),
		tinh(f) {
			const diem = [0, 1, 2, 3, 4].map((i) => [doc(f[`t${i}`]), doc(f[`d${i}`])]).filter(([t, d]) => isFinite(t) && d > 0);
			if (diem.length < 3 || new Set(diem.map(([t]) => t)).size < 3)
				return '<p class="mt-loi">Cần ít nhất 3 điểm (thời điểm, kích thước) với thời điểm khác nhau. Để trống ô không dùng.</p>';
			const k = ostwald(diem);
			const du = doc(f.du);
			const d3Du = k.d3Dau + k.doDocD3 * du;
			const dDu = d3Du > 0 ? Math.cbrt(d3Du) : NaN;
			const d0 = diem[0][1];
			const gapDoi = k.doDocD3 > 0 ? (7 * d0 ** 3) / k.doDocD3 : Infinity;
			const tang = k.doDocD3 > 0;
			const ketLuan = !tang
				? 'Kích thước không tăng: chưa thấy dấu hiệu ripening trong khoảng đo.'
				: k.r2D3 >= 0.95 && k.r2D3 >= k.r2D
					? 'Dữ liệu khớp đường d³ tốt: phù hợp với Ostwald ripening (chưa đủ để kết luận, xem mục giới hạn).'
					: k.r2D3 < 0.9
						? 'Dữ liệu không thẳng trên đồ thị d³: có thể có cơ chế khác (hợp giọt, keo tụ) hoặc số đo dao động.'
						: 'Khớp d³ ở mức vừa; cần thêm điểm đo để phân biệt.';
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Tốc độ ω = d(r³)/dt</span><strong>${soKH(k.omegaR3)} µm³/ngày</strong> = ${soKH((k.omegaR3 * 1e-18) / 86400)} m³/s</div>
<div><span class="mt-kq-nhan">Độ khớp</span><strong>R² (d³ theo t) = ${so(k.r2D3, 3)}</strong> · R² (d theo t) = ${so(k.r2D, 3)}</div>
${tang ? `<div><span class="mt-kq-nhan">Ở ${so(du)} ngày</span><strong>${isFinite(dDu) ? `${so(dDu)} µm` : '—'}</strong> nếu tốc độ giữ nguyên ${G}</div>
<div><span class="mt-kq-nhan">Kích thước gấp đôi điểm đầu sau</span><strong>${thoiGianChu(gapDoi * 24)}</strong></div>` : ''}
</div>
<p class="mt-meo">${ketLuan}</p>`;
		},
		chuY: `<li>Thuyết LSW (Lifshitz và Slyozov 1961; áp dụng cho nhũ tương theo Kabalnov 1992) cho tốc độ ω tỉ lệ với độ tan của dầu trong pha nước, hệ số khuếch tán và sức căng bề mặt ${K}.</li>
<li>Ripening chỉ đáng kể khi dầu <strong>tan được chút ít</strong> trong pha nước (tinh dầu, hương liệu, dầu chuỗi ngắn); dầu triglyceride chuỗi dài gần như không tan nên hầu như không ripening ${K}.</li>
<li>Với khoảng đo ngắn, cả d³ và d đều có thể trông thẳng; R² cao chưa chứng minh cơ chế. Hãy đối chứng: thêm một ít dầu không tan (ví dụ triglyceride chuỗi dài) vào pha dầu, nếu tốc độ giảm mạnh thì nghiêng về ripening ${G}.</li>
<li>Số mặc định là dữ liệu tự dựng để thấy phép tính, không phải số đo thật ${T}.</li>`,
	},
	laplace: {
		tieuDe: 'Áp suất Laplace trong giọt',
		congThuc: 'ΔP = 2γ / r = 4γ / d',
		o: [
			o('g', 'Sức căng bề mặt γ', 'mN/m', '10', 'Dầu–nước có chất nhũ hóa thường thấp hơn dầu–nước sạch nhiều'),
			o('d', 'Đường kính giọt d', 'µm', '1'),
		].join(''),
		tinh(f) {
			const g = doc(f.g), d = doc(f.d);
			if (!(g > 0 && d > 0)) return '<p class="mt-loi">Nhập số dương cho cả hai ô.</p>';
			const { pa, bar } = laplace(g, d);
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">ΔP</span><strong>${soKH(pa)} Pa</strong> = ${soKH(pa / 1000)} kPa = ${soKH(bar)} bar</div>
<div><span class="mt-kq-nhan">Giọt nhỏ đi 10 lần</span><strong>${soKH(bar * 10)} bar</strong></div>
</div>
<p class="mt-meo">ΔP tỉ lệ nghịch với d: giọt càng nhỏ càng "cứng", càng khó bẻ tiếp. Đây là lý do đồng hóa phải tạo ứng suất lớn trong thời gian cực ngắn.</p>`;
		},
		chuY: `<li>Công thức cho giọt cầu ở trạng thái cân bằng ${K}. Trong máy đồng hóa, γ lúc giọt vừa tạo ra (γ động) cao hơn γ cân bằng vì chất nhũ hóa chưa kịp hấp phụ ${K}.</li>
<li>Áp suất ghi trên máy đồng hóa không so trực tiếp với ΔP Laplace: phần lớn năng lượng đi vào dòng chảy rối và nhiệt, không phải để "thắng" ΔP ${G}.</li>
<li>Kiểm máy tính: γ = 10 mN/m, d = 1 µm cho 0,4 bar, khớp bảng ví dụ trong bài Nền tảng ${T}.</li>`,
	},
	debye: {
		tieuDe: 'Lực ion và độ dài Debye',
		congThuc: 'I = ½ Σ c<sub>i</sub> z<sub>i</sub>² ; κ⁻¹ ≈ 0,304 / √I nm (nước, 25 °C)',
		o: [
			o('c11', 'Muối 1:1 (NaCl, KCl)', 'mM', '10'),
			o('c21', 'Muối 2:1 (CaCl₂, MgCl₂)', 'mM', '0', 'Ion hóa trị 2 làm lực ion tăng gấp 3 so với cùng nồng độ NaCl'),
			o('c12', 'Muối 1:2 (Na₂SO₄)', 'mM', '0'),
		].join(''),
		tinh(f) {
			const [a, b, c] = [f.c11, f.c21, f.c12].map((x) => (String(x.value).trim() === '' ? 0 : doc(x)));
			if (![a, b, c].every((x) => x >= 0)) return '<p class="mt-loi">Nhập nồng độ không âm (để 0 nếu không có).</p>';
			const I = lucIon([[a / 1000, 1], [a / 1000, 1], [b / 1000, 2], [(2 * b) / 1000, 1], [(2 * c) / 1000, 1], [c / 1000, 2]]);
			if (!(I > 0)) return '<p class="mt-loi">Nhập ít nhất một nồng độ dương.</p>';
			const k = debye(I);
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Lực ion I</span><strong>${so(I * 1000)} mM</strong></div>
<div><span class="mt-kq-nhan">Độ dài Debye κ⁻¹</span><strong>${so(k)} nm</strong></div>
<div><span class="mt-kq-nhan">Nếu muối tăng 10 lần</span><strong>${so(debye(I * 10))} nm</strong></div>
</div>
<p class="mt-meo">κ⁻¹ là tầm với của lực đẩy tĩnh điện. Muối tăng 100 lần thì tầm với mỏng đi 10 lần; khi κ⁻¹ chỉ còn cỡ 1 nm, lớp đẩy tĩnh điện gần như không giữ được giọt.</p>`;
		},
		chuY: `<li>Hằng số 0,304 chỉ đúng cho nước ở 25 °C ${K}. Nhiệt độ hoặc dung môi khác (nhiều đường, glycerol, ethanol) làm hằng số đổi.</li>
<li>Thực phẩm thật còn có ion của dung dịch đệm, protein, phosphat, citrat; ion có thể tạo phức (Ca²⁺ với citrat, phosphat) nên lực ion hiệu dụng khác con số tính ${G}.</li>
<li>Ion hóa trị 2 còn bắc cầu giữa các protein mang điện âm, gây keo tụ mạnh hơn dự đoán từ riêng κ⁻¹ ${G}.</li>
<li>Kiểm máy tính: 10 mM NaCl cho ≈ 3,0 nm, 150 mM cho ≈ 0,78 nm, khớp bảng trong bài Cơ chế mất ổn định ${T}.</li>`,
	},
	pickering: {
		tieuDe: 'Năng lượng giải hấp hạt Pickering',
		congThuc: 'ΔE = π r² γ (1 − |cos θ|)²',
		o: [
			o('r', 'Bán kính hạt r', 'nm', '50'),
			o('g', 'Sức căng dầu–nước γ', 'mN/m', '30'),
			o('th', 'Góc tiếp xúc θ (đo trong pha nước)', '°', '90', '90° là hạt thấm ướt như nhau bởi dầu và nước'),
			o('T', 'Nhiệt độ', '°C', '25'),
		].join(''),
		tinh(f) {
			const r = doc(f.r), g = doc(f.g), th = doc(f.th), T = doc(f.T);
			if (!(r > 0 && g > 0 && th >= 0 && th <= 180 && isFinite(T))) return '<p class="mt-loi">Nhập r và γ dương, θ từ 0 đến 180°.</p>';
			const kq = pickering(r, g, th, T + 273.15);
			const bang = [30, 60, 90, 120, 150].map((x) => `${x}°: ${soKH(pickering(r, g, x, T + 273.15).kT)} kT`).join(' · ');
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">ΔE</span><strong>${soKH(kq.kT)} kT</strong> = ${soKH(kq.J)} J</div>
<div><span class="mt-kq-nhan">Theo góc θ</span>${bang}</div>
<div><span class="mt-kq-nhan">Hạt nhỏ đi 10 lần</span><strong>${soKH(pickering(r / 10, g, th, T + 273.15).kT)} kT</strong></div>
</div>
<p class="mt-meo">kT là năng lượng chuyển động nhiệt. ΔE gấp hàng nghìn kT trở lên nghĩa là hạt gần như bám vĩnh viễn; θ lệch xa 90° hoặc hạt quá nhỏ thì ΔE tụt nhanh ${G}.</p>`;
		},
		chuY: `<li>Công thức cho hạt cầu cứng, đơn lẻ, giọt lớn hơn hạt rất nhiều ${N(['schroen2024', 'Schroën 2024'])}.</li>
<li>Nhiều hệ thực phẩm có hạt mềm, bề mặt hỗn hợp với phân tử hoạt động bề mặt sẵn có trong nguyên liệu; khi đó ổn định không chỉ do ΔE ${N(['schroen2024', 'Schroën 2024'])}.</li>
<li>Góc θ của hạt thực phẩm khó đo và thay đổi theo pH, muối; một sai số nhỏ ở θ gần 30° hoặc 150° làm ΔE đổi nhiều lần ${G}.</li>
<li>Kiểm máy tính: r = 50 nm, γ = 30 mN/m, θ = 90° cho ≈ 5,7 × 10⁴ kT, khớp bảng trong bài Hệ nhũ tương đặc biệt ${T}.</li>`,
	},
	totox: {
		tieuDe: 'Chỉ số oxy hóa tổng TOTOX',
		congThuc: 'TOTOX = 2·PV + p-AnV',
		o: [
			o('pv', 'Chỉ số peroxide PV', 'meq O₂/kg', '2', 'Sản phẩm sơ cấp (hydroperoxide)'),
			o('anv', 'Chỉ số p-anisidine p-AnV', '', '4', 'Sản phẩm thứ cấp (aldehyde)'),
		].join(''),
		tinh(f) {
			const pv = doc(f.pv), anv = doc(f.anv);
			if (!(pv >= 0 && anv >= 0)) return '<p class="mt-loi">Nhập hai số không âm.</p>';
			const t = totox(pv, anv);
			const tyLe = t > 0 ? (2 * pv) / t : 0;
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">TOTOX</span><strong>${so(t)}</strong></div>
<div><span class="mt-kq-nhan">Phần từ PV</span><strong>${so(tyLe * 100)}%</strong> · phần từ p-AnV ${so((1 - tyLe) * 100)}%</div>
</div>
<p class="mt-meo">PV thấp chưa chắc dầu còn tốt: hydroperoxide có thể đã phân hủy thành aldehyde. Luôn đọc PV cùng p-AnV, và theo dõi theo thời gian thay vì một điểm.</p>`;
		},
		chuY: `<li>Công thức TOTOX là quy ước ${K}; hệ số 2 không có ý nghĩa cơ chế chặt chẽ, chỉ để hai chỉ số cùng tầm số ${G}.</li>
<li>Bài Oxy hóa lipid viết tắt p-anisidine là "AV". Ở tài liệu khác, AV thường là <strong>chỉ số axit</strong> (acid value); đọc kỹ đơn vị trước khi nhập.</li>
<li>Web chưa đưa ngưỡng chấp nhận của TOTOX; mỗi loại dầu và khách hàng có quy định riêng, cần lấy theo tiêu chuẩn sản phẩm của bạn.</li>
<li>Số mặc định là ví dụ ${T}.</li>`,
	},
	'iv-sv': {
		tieuDe: 'Chỉ số iod (IV) và xà phòng hóa (SV) từ thành phần acid béo',
		congThuc: 'IV = Σ w<sub>i</sub> · 100 · k<sub>i</sub> · M(I₂) / M<sub>i</sub> ; SV = 3 · M(KOH) · 1000 / M(TAG)',
		o: [
			...[
				['c80', 'C8:0 (caprylic)', '0'], ['c100', 'C10:0 (capric)', '0'], ['c120', 'C12:0 (lauric)', '0'], ['c140', 'C14:0 (myristic)', '0'],
				['c160', 'C16:0 (palmitic)', '10'], ['c161', 'C16:1 (palmitoleic)', '0'], ['c180', 'C18:0 (stearic)', '4'], ['c181', 'C18:1 (oleic)', '60'],
				['c182', 'C18:2 (linoleic)', '20'], ['c183', 'C18:3 (linolenic)', '6'], ['c200', 'C20:0 (arachidic)', '0'], ['c221', 'C22:1 (erucic)', '0'],
			].map(([ten, nhan, md]) => o(ten, nhan, '%', md)),
		].join(''),
		tinh(f) {
			const tp = [[8, 0, 'c80'], [10, 0, 'c100'], [12, 0, 'c120'], [14, 0, 'c140'], [16, 0, 'c160'], [16, 1, 'c161'], [18, 0, 'c180'], [18, 1, 'c181'], [18, 2, 'c182'], [18, 3, 'c183'], [20, 0, 'c200'], [22, 1, 'c221']]
				.map(([n, k, ten]) => [n, k, String(f[ten].value).trim() === '' ? 0 : doc(f[ten])]);
			if (!tp.every(([, , w]) => w >= 0)) return '<p class="mt-loi">Nhập phần trăm không âm (để 0 nếu không có).</p>';
			const dung = tp.filter(([, , w]) => w > 0);
			if (!dung.length) return '<p class="mt-loi">Nhập ít nhất một acid béo.</p>';
			const kq = ivSv(dung);
			const lech = Math.abs(kq.tong - 100) > 2
				? `<p class="mt-loi">Tổng đang là ${so(kq.tong)}%; máy đã quy về 100%. Nếu thiếu acid béo khác, kết quả sẽ lệch.</p>`
				: '';
			return `${lech}<div class="mt-kq">
<div><span class="mt-kq-nhan">IV của dầu (dạng TAG)</span><strong>${so(kq.ivDau, 4)} g I₂/100 g</strong></div>
<div><span class="mt-kq-nhan">IV tính theo acid béo tự do</span><strong>${so(kq.iv, 4)}</strong></div>
<div><span class="mt-kq-nhan">SV</span><strong>${so(kq.sv, 4)} mg KOH/g</strong></div>
<div><span class="mt-kq-nhan">M acid béo trung bình · M(TAG)</span><strong>${so(kq.mTB, 4)} · ${so(kq.mTAG, 4)} g/mol</strong></div>
</div>
<p class="mt-meo">So IV tính được với IV đo (phương pháp Wijs): lệch nhiều thì nghi kết quả sắc ký sai, có acid béo chưa định danh, hoặc dầu đã oxy hóa.</p>`;
		},
		chuY: `<li>Tính theo tỉ lượng từ công thức phân tử, giả định mọi acid béo nằm trong triglyceride ${T}. Bỏ qua chất không xà phòng hóa, acid béo tự do, mono- và diglyceride ${G}.</li>
<li>Kết quả GC thường là % diện tích hoặc % khối lượng methyl ester (FAME); dùng trực tiếp như % khối lượng acid béo là gần đúng ${G}.</li>
<li>Đồng phân cis và trans, vị trí nối đôi không đổi IV. Nối đôi liên hợp phản ứng không hết với thuốc thử Wijs nên IV đo có thể thấp hơn tính ${K}.</li>
<li>Kiểm máy tính: acid oleic, linoleic, linolenic cho 89,9 / 181,1 / 273,5; tristearin cho SV 188,8, khớp bảng trong bài Cấu trúc triglyceride. Thành phần mặc định là ví dụ tự đặt, không phải của loại dầu nào ${T}.</li>`,
	},
	'axit-yeu': {
		tieuDe: 'Phần chất bảo quản axit yếu chưa phân ly',
		congThuc: 'f<sub>HA</sub> = 1 / (1 + 10<sup>pH − pKa</sup>)',
		o: [
			o('pH', 'pH của pha nước', '', '5'),
			o('pKa', 'pKa của axit', '', '4,5', 'Số mặc định là ví dụ; nhập pKa của chất bạn dùng từ tài liệu kỹ thuật'),
			o('c', 'Tổng nồng độ (tùy chọn)', 'mg/kg', '1000'),
		].join(''),
		tinh(f) {
			const pH = doc(f.pH), pKa = doc(f.pKa), c = doc(f.c);
			if (!isFinite(pH) || !isFinite(pKa)) return '<p class="mt-loi">Nhập pH và pKa.</p>';
			const fr = phanChuaPhanLy(pH, pKa);
			const bang = [3, 4, 5, 6, 7].map((x) => `pH ${x}: ${so(phanChuaPhanLy(x, pKa) * 100, 2)}%`).join(' · ');
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Chưa phân ly (HA)</span><strong>${so(fr * 100)}%</strong>${c > 0 ? ` ≈ ${so(fr * c)} mg/kg trên ${so(c)} mg/kg tổng` : ''}</div>
<div><span class="mt-kq-nhan">Theo pH</span>${bang}</div>
</div>
<p class="mt-meo">Mỗi khi pH tăng 1 đơn vị trên pKa, phần chưa phân ly giảm khoảng 10 lần.</p>`;
		},
		chuY: `<li>Phương trình Henderson–Hasselbalch cho dung dịch loãng ${K}. pKa thay đổi theo nhiệt độ, lực ion và lượng đường hoặc ethanol trong pha nước ${G}.</li>
<li>Dạng phân ly <strong>vẫn có tác dụng</strong>: với sorbic, ở pH trên 6 dạng phân ly còn đóng góp hơn một nửa mức ức chế với đa số vi sinh vật thử ${N(['eklund1983', 'Eklund 1983'])}. Chỉ nhìn phần HA sẽ đánh giá thấp tác dụng ở pH cao.</li>
<li>Trong nhũ tương, dạng HA tan được vào pha dầu nên nồng độ còn lại trong pha nước thấp hơn lượng cho vào ${G}.</li>
<li>Bảng pKa từng chất đang chờ đối chiếu sách nên chưa hiện trên web.</li>`,
	},
	'gia-tri-f': {
		tieuDe: 'Giá trị F ở nhiệt độ không đổi',
		congThuc: 'L = 10<sup>(T − T<sub>ref</sub>)/z</sup> ; F = t · L ; số log giảm = F / D<sub>ref</sub>',
		o: [
			o('T', 'Nhiệt độ giữ T', '°C', '115'),
			o('t', 'Thời gian giữ t', 'phút', '20'),
			o('Tref', 'Nhiệt độ chuẩn T<sub>ref</sub>', '°C', '120', 'Lấy theo quy ước của quy trình bạn đang thẩm định'),
			o('z', 'Giá trị z', '°C', '10', 'Số độ C để D giảm 10 lần; phụ thuộc vi sinh vật và môi trường'),
			o('D', 'D ở T<sub>ref</sub> (tùy chọn)', 'phút', '', 'Để trống nếu không cần số log giảm'),
		].join(''),
		tinh(f) {
			const T = doc(f.T), t = doc(f.t), Tref = doc(f.Tref), z = doc(f.z), D = doc(f.D);
			if (!(t > 0 && z > 0) || !isFinite(T) || !isFinite(Tref)) return '<p class="mt-loi">Nhập thời gian và z dương, các nhiệt độ là số.</p>';
			const kq = giaTriF(t, T, Tref, z, D > 0 ? D : 0);
			return `<div class="mt-kq">
<div><span class="mt-kq-nhan">Tốc độ gây chết L</span><strong>${soKH(kq.L)}</strong> (1 phút ở ${so(T)} °C bằng ${soKH(kq.L)} phút ở ${so(Tref)} °C)</div>
<div><span class="mt-kq-nhan">F</span><strong>${soKH(kq.F)} phút</strong> tương đương ở ${so(Tref)} °C</div>
${kq.logGiam !== null ? `<div><span class="mt-kq-nhan">Số log giảm</span><strong>${so(kq.logGiam)} log</strong></div>` : ''}
</div>
<p class="mt-meo">Thấp hơn T<sub>ref</sub> đúng z độ thì cần thời gian gấp 10 lần để đạt cùng F.</p>`;
		},
		chuY: `<li>Chỉ tính cho <strong>nhiệt độ không đổi</strong>. Quy trình thật có pha gia nhiệt và làm nguội; F phải cộng dồn theo đường nhiệt đo tại điểm chậm nóng nhất ${K}.</li>
<li>D và z khác nhau theo loài, chủng và môi trường; aw thấp làm vi sinh vật bền nhiệt hơn ${N(['tapia2020', 'Tapia 2020'])}.</li>
<li>Quy ước F₀ (nhiệt độ chuẩn và z dùng cho tiệt trùng đồ hộp) lấy theo sách nền; web chưa ghi số khi chưa đối chiếu trang ${K}. Số mặc định ở đây là ví dụ ${T}.</li>
<li><strong>Không dùng máy này để thiết kế hay phê duyệt quy trình tiệt trùng thương mại.</strong> Việc đó cần đo phân bố nhiệt, xâm nhập nhiệt và người có thẩm quyền thẩm định ${G}.</li>`,
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
