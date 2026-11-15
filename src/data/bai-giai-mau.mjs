// Bài giải mẫu (gói T3): mỗi máy tính một bài, đề lấy từ tình huống phòng lab, có gợi ý 3 nấc, lời giải và nút mở máy với số của đề.
//
// CÁCH THÊM MỘT BÀI (không phải sửa chỗ nào khác ngoài ba nơi):
//   1. Thêm một mục vào mảng BAI_GIAI bên dưới. `id` PHẢI là khóa máy trong public/may-tinh.js (ví dụ 'stokes').
//      `nhap` ghi số điền sẵn cho các ô của máy (tên ô = thuộc tính name trong may-tinh.js, số viết theo kiểu Việt: 0,2).
//      `viet()` trả về chữ của bài; MỌI con số trong lời giải phải đến từ hàm tính trong public/cong-thuc.js (không gõ tay),
//      để công thức đổi thì chữ đổi theo, không bao giờ lệch.
//   2. Thêm số đối chiếu tính tay độc lập (Python hoặc bằng tay) vào bảng TAY_TINH trong scripts/kiem-bai-giai.mjs.
//   3. Chạy npm run kiem. Phép kiểm dừng nếu thiếu nấc, thiếu nhãn, ô không có trong máy, hoặc số lệch số tính tay quá 0,5%.
// Quy ước nhãn: đề bài và phép tính trong lời giải đều là [T] (số do đề dựng, không phải số đo thật); câu nói về cơ chế mang nhãn
// [K], [G] hoặc [N] như ở máy tính. Không đặt nhãn [K] lên câu có số kèm đơn vị: máy in sẽ ẩn câu đó (xem remark-nhan.mjs).
import { stokes, chatNhuHoaToiThieu, banKinhNhoNhat, laplace, lucIon, debye, ostwald } from '../../public/cong-thuc.js';

const MU = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const so = (x, n = 3) => x.toLocaleString('vi-VN', { maximumSignificantDigits: n });
// 8,72 × 10⁻⁸ (cùng cách viết với máy tính)
function kh(x, n = 3) {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	const m = x / 10 ** e;
	return `${so(m, n)} × 10${String(e).replace('-', '⁻').replace(/\d/g, (c) => MU[c])}`;
}

// Số liệu đầu vào của từng bài (đề cho). Đặt ngoài hàm viet() để nút "Mở máy" và lời giải dùng cùng một nguồn.
const OST = [[0, 0.15], [14, 0.169], [28, 0.185], [42, 0.198], [56, 0.21]];

export const BAI_GIAI = [
	{
		id: 'stokes',
		tieuDe: 'Sốt kem có kem hóa (nổi váng dầu) trong hạn dùng không?',
		may: 'Vận tốc kem hóa (Stokes)',
		bai: ['nhu-tuong', 'mat-on-dinh', 'Mất ổn định'],
		nhap: { d: '2', rc: '1000', rd: '920', eta: '2', ngay: '30' },
		viet() {
			const kq = stokes(2, 1000, 920, 2);
			const kq1 = stokes(1, 1000, 920, 2);
			const quang = kq.mmMoiNgay * 30;
			const ngayHetChai = 200 / kq.mmMoiNgay;
			return {
				de: `Bạn thử một sốt kem vị salad: pha dầu phân tán trong pha nước có chút gôm. Đề cho: tỷ trọng dầu ρ<sub>d</sub> = 920 kg/m³, tỷ trọng pha liên tục ρ<sub>c</sub> = 1000 kg/m³, độ nhớt pha liên tục η<sub>c</sub> = 2 mPa·s. Máy đo cỡ hạt cho d = 2 µm. Chai thủy tinh cao 200 mm, hạn dùng 30 ngày. [T]

**(a)** Giọt nổi bao nhiêu mm mỗi ngày, và bao nhiêu mm sau 30 ngày? Con số đó nói gì với chai cao 200 mm?
**(b)** Nếu đồng hóa lại để d còn 1 µm thì quãng đường 30 ngày còn bao nhiêu?`,
				nac1: `Hai việc đang giành nhau: chênh lệch tỷ trọng đẩy giọt dầu nổi lên, còn độ nhớt của pha nước cản giọt lại. Tự hỏi: (1) ρ<sub>c</sub> − ρ<sub>d</sub> dương hay âm thì giọt nổi? (2) Giọt lớn gấp đôi thì nổi nhanh gấp đôi, hay nhanh hơn thế? Nghĩ về diện tích giọt và thể tích giọt, cái nào tăng nhanh hơn khi giọt to ra. [G]`,
				nac2: `Công thức Stokes cho giọt cầu cứng, đơn lẻ, trong pha liên tục Newton: [K]

$$
v = \\frac{2\\, r^{2}\\,(\\rho_c-\\rho_d)\\,g}{9\\,\\eta_c}
$$

Đổi đơn vị về SI trước khi thay: r = d/2 và đổi µm thành m, η đổi mPa·s thành Pa·s, g = 9,81 m/s². Quãng đường = v × thời gian; đổi m/s thành mm/ngày bằng cách nhân 1000 × 86400. [T]`,
				nac3: `r = d/2 = 1 µm = 1×10⁻⁶ m. Δρ = 1000 − 920 = 80 kg/m³. η = 2 mPa·s = 2×10⁻³ Pa·s. [T]

v = 2 × (10⁻⁶)² × 80 × 9,81 / (9 × 2×10⁻³). Tử số 2 × 10⁻¹² × 80 × 9,81 = ${kh(2e-12 * 80 * 9.81)}; mẫu số 9 × 2×10⁻³ = 0,018. Chia ra v = ${kh(kq.v)} m/s. [T]`,
				loi: `**(a)** v = ${kh(kq.v)} m/s ≈ **${so(kq.mmMoiNgay)} mm/ngày**; sau 30 ngày giọt đi **${so(quang)} mm**. [T]

Quãng 30 ngày ${quang > 200 ? 'lớn hơn' : 'nhỏ hơn'} chiều cao chai 200 mm: về lý thuyết giọt đi hết chai sau khoảng ${so(ngayHetChai)} ngày, tức là kem hóa nhìn thấy được ngay trong hạn dùng. Công thức cho giọt đơn lẻ; ở pha dầu đậm đặc hoặc có mạng gel, giọt cản nhau nên nổi chậm hơn, vì vậy ${so(quang)} mm chỉ là ước lượng thô ở phía nhanh. [G]

**(b)** Với d = 1 µm, v chỉ còn ${so(kq1.mmMoiNgay)} mm/ngày và sau 30 ngày đi **${so(kq1.mmMoiNgay * 30)} mm**, bằng đúng 1/4 quãng của giọt 2 µm vì v tỉ lệ với d² (giọt nhỏ đi một nửa thì r² nhỏ đi bốn lần). [T]

**Rút ra:** muốn chậm kem hóa, hai đòn bẩy của công thức là giảm cỡ giọt (hiệu quả theo bình phương) và tăng độ nhớt pha liên tục (hiệu quả theo tỉ lệ nghịch). Nên nhập d₉₀ hoặc d₄₃ thay vì cỡ trung bình theo số, vì những giọt lớn nhất mới quyết định váng dầu hiện ra. [G]`,
			};
		},
	},
	{
		id: 'chat-nhu-hoa-toi-thieu',
		tieuDe: 'Cần ít nhất bao nhiêu protein để phủ kín giọt dầu?',
		may: 'Diện tích bề mặt và lượng chất nhũ hóa tối thiểu',
		bai: ['nhu-tuong', 'nen-tang', 'Nền tảng'],
		nhap: { phi: '0,2', d32: '0,5', gam: '2', cs: '3' },
		viet() {
			const a = chatNhuHoaToiThieu(0.2, 0.5, 2);
			const gioi = banKinhNhoNhat(0.2, 2, 3);
			return {
				de: `Bạn làm nhũ tương 20% dầu theo thể tích (φ = 0,2) bằng protein, mục tiêu cỡ giọt d<sub>32</sub> = 0,5 µm. Tài liệu bạn đọc cho độ phủ bề mặt bão hòa của protein là Γ = 2 mg/m² (đề cho). [T]

**(a)** Diện tích bề mặt của pha dầu trong 1 lít nhũ tương là bao nhiêu m²?
**(b)** Lượng protein tối thiểu để phủ kín bề mặt đó là bao nhiêu g/L và bao nhiêu % w/v? Nên chuẩn bị bao nhiêu nếu cần dư 1,5 đến 3 lần?
**(c)** Nếu trong thùng chỉ còn 3 g/L protein thì cỡ giọt nhỏ nhất đạt được là bao nhiêu? Kết quả có khớp với (b) không?`,
				nac1: `Protein phủ trên mặt giọt như lớp sơn trên mặt cầu: sơn cần dùng tỉ lệ với diện tích cần sơn. Hai bước: tìm tổng diện tích mặt giọt trong 1 lít (giọt càng nhỏ, tổng diện tích càng lớn, vì sao?), rồi nhân với lượng protein bám trên mỗi mét vuông. [G]`,
				nac2: `Với giọt cầu, diện tích bề mặt riêng trên một đơn vị thể tích nhũ tương và lượng chất nhũ hóa tối thiểu là: [K]

$$
A = \\frac{6\\,\\varphi}{d_{32}}, \\qquad c_{\\min} = \\Gamma \\cdot A
$$

Phần (c) dùng chiều ngược lại: biết lượng protein c<sub>S</sub> thì tính bán kính giọt nhỏ nhất theo r<sub>min</sub> = 3Γφ / c<sub>S</sub>. [N: @mcclements2016 tr.273]

Đổi đơn vị trước khi thay số: d<sub>32</sub> đổi µm thành m; Γ đổi mg/m² thành kg/m² (nhân 10⁻⁶). Lưu ý 1 m³ = 1000 L và 1 kg/m³ = 1 g/L. [T]`,
				nac3: `**(a)** A = 6 × 0,2 / (0,5×10⁻⁶ m) = ${kh(a.A)} m² trên mỗi m³, tức ${so(a.A / 1000)} m² trên mỗi lít. [T]

**(b)** c<sub>min</sub> = Γ × A = 2×10⁻⁶ kg/m² × ${kh(a.A)} m²/m³ = ${so(a.cGL)} kg/m³ = ${so(a.cGL)} g/L. [T]

**(c)** r<sub>min</sub> = 3 × (2×10⁻⁶ kg/m²) × 0,2 / (3 kg/m³), đổi ra nm rồi nhân đôi để có đường kính. [T]`,
				loi: `**(a)** A = ${kh(a.A)} m²/m³ ≈ **${so(a.A / 1000)} m² mỗi lít**: một lít nhũ tương này có bề mặt dầu cỡ một căn phòng nhỏ. [T]

**(b)** c<sub>min</sub> = **${so(a.cGL)} g/L ≈ ${so(a.phanTramWV)}% w/v**. Cần dư ${so(a.cGL * 1.5)} đến ${so(a.cGL * 3)} g/L (${so(a.phanTramWV * 1.5)} đến ${so(a.phanTramWV * 3)}% w/v), vì phần protein còn lại nằm trong pha nước, và lớp phủ thiếu dễ gây bắc cầu hay hợp giọt khi bảo quản. [G]

**(c)** r<sub>min</sub> = ${so(gioi.rNm)} nm, tức giọt nhỏ nhất **d ≈ ${so(gioi.dNm)} nm** (${so(gioi.dNm / 1000)} µm). Khớp với (b): cần ${so(a.cGL)} g/L cho giọt 0,5 µm, nên chỉ có 3 g/L thì giọt phải to ra theo tỉ lệ ${so(a.cGL)}/3 = ${so(a.cGL / 3)} lần, tức đúng 0,5 × ${so(a.cGL / 3)} = ${so((0.5 * a.cGL) / 3)} µm. [T]

**Rút ra:** công thức này chỉ đúng khi protein là thứ bị thiếu. Nếu protein dư, cỡ giọt do năng lượng đồng hóa quyết định chứ không do lượng protein. [N: @mcclements2016 tr.273–274]`,
			};
		},
	},
	{
		id: 'laplace',
		tieuDe: 'Vì sao giọt càng nhỏ càng khó bẻ nhỏ thêm?',
		may: 'Áp suất Laplace',
		bai: ['nhu-tuong', 'nen-tang', 'Nền tảng'],
		nhap: { g: '10', d: '1' },
		viet() {
			const k10 = laplace(10, 10), k1 = laplace(10, 1), k02 = laplace(10, 0.2);
			return {
				de: `Hệ dầu–nước có chất nhũ hóa, sức căng bề mặt γ = 10 mN/m (đề cho). [T]

**(a)** Tính chênh áp suất ΔP giữa trong và ngoài giọt cho ba cỡ giọt: 10 µm, 1 µm và 0,2 µm (đổi ra bar).
**(b)** Giọt nhỏ đi 5 lần (từ 1 µm xuống 0,2 µm) thì ΔP gấp mấy lần?
**(c)** ΔP của giọt 0,2 µm có phải là áp suất mà máy đồng hóa cần chỉnh không? Giải thích.`,
				nac1: `Mặt giọt như màng bóng bay căng: màng căng co lại ôm lấy khí bên trong, bóng càng nhỏ thì bên trong càng bị ép chặt. Tự hỏi: ΔP phụ thuộc vào sức căng γ theo chiều nào, và phụ thuộc vào cỡ giọt theo chiều nào (tăng d thì ΔP tăng hay giảm)? [G]`,
				nac2: `Chênh áp Laplace của giọt cầu: [K]

$$
\\Delta P = \\frac{2\\gamma}{r} = \\frac{4\\gamma}{d}
$$

Đổi γ từ mN/m thành N/m (nhân 10⁻³) và d từ µm thành m (nhân 10⁻⁶) để ra Pa; 1 bar = 10⁵ Pa. [T]`,
				nac3: `Với d = 1 µm: ΔP = 4 × (10×10⁻³ N/m) / (1×10⁻⁶ m) = ${so(k1.pa)} Pa = ${so(k1.bar)} bar. Hai cỡ còn lại làm tương tự, chỉ đổi d. [T]`,
				loi: `**(a)** d = 10 µm: ΔP = ${so(k10.pa)} Pa = **${so(k10.bar)} bar**. d = 1 µm: ${so(k1.pa)} Pa = **${so(k1.bar)} bar**. d = 0,2 µm: ${so(k02.pa)} Pa = **${so(k02.bar)} bar**. [T]

**(b)** ΔP tỉ lệ nghịch với d, nên giọt nhỏ đi 5 lần thì ΔP gấp **${so(k02.bar / k1.bar)} lần** (${so(k1.bar)} bar lên ${so(k02.bar)} bar). Giọt càng nhỏ càng "cứng", càng phải tốn nhiều năng lượng để bẻ nhỏ thêm. [T]

**(c)** Không. Máy đồng hóa tác dụng lực qua dòng chảy rối và xâm thực trong một khoảng thời gian cực ngắn; phần lớn năng lượng hóa thành nhiệt chứ không dùng để "thắng" ΔP, và sức căng lúc giọt vừa tạo ra (sức căng động) cao hơn sức căng cân bằng vì chất nhũ hóa chưa kịp bám vào. Vì vậy áp suất ghi trên máy không so thẳng với ΔP tính ở đây. [G]`,
			};
		},
	},
	{
		id: 'debye',
		tieuDe: 'Thêm muối canxi có làm nhũ tương protein dễ keo tụ không?',
		may: 'Lực ion và độ dài Debye',
		bai: ['nhu-tuong', 'mat-on-dinh', 'Mất ổn định'],
		nhap: { c11: '10', c21: '5', c12: '0' },
		viet() {
			const I0 = lucIon([[0.01, 1], [0.01, 1]]);
			const I1 = lucIon([[0.01, 1], [0.01, 1], [0.005, 2], [0.01, 1]]);
			const I2 = lucIon([[0.015, 1], [0.015, 1]]);
			return {
				de: `Nhũ tương dầu trong nước ổn định nhờ điện tích của protein. Pha nước đang có 10 mM NaCl (đề cho). Nhà cung cấp nguyên liệu đề nghị bổ sung một muối canxi, nghĩa là thêm 5 mM CaCl₂. Nước ở 25 °C. [T]

**(a)** Lực ion I và độ dài Debye κ⁻¹ ban đầu là bao nhiêu?
**(b)** Sau khi thêm 5 mM CaCl₂ thì I và κ⁻¹ là bao nhiêu?
**(c)** Nếu thay vì CaCl₂ chỉ thêm 5 mM NaCl thì κ⁻¹ là bao nhiêu? So với (b) rút ra điều gì về ion hóa trị 2?`,
				nac1: `Ion trong nước quây quanh hạt mang điện và che bớt điện tích của nó; càng nhiều ion thì lớp che càng mỏng, lực đẩy giữa hai giọt càng tầm ngắn. Hai việc cần làm: (1) gộp mọi ion thành một con số "mức độ nhiều ion" gọi là lực ion; (2) đổi con số đó thành bề dày lớp che. Để ý: ion hóa trị 2 mang điện gấp đôi ion hóa trị 1, nên có thể đóng góp nhiều hơn một ion hóa trị 1 cùng số lượng. [G]`,
				nac2: `Lực ion cộng qua mọi ion trong dung dịch (nồng độ c tính bằng mol/L, z là hóa trị), còn độ dài Debye suy từ lực ion; hằng số trong công thức chỉ đúng cho nước ở nhiệt độ phòng: [K]

$$
I = \\frac{1}{2}\\sum_i c_i z_i^{2}, \\qquad \\kappa^{-1} \\approx \\frac{0{,}304}{\\sqrt{I}}\\ \\text{nm}
$$

Mỗi muối phải được tách thành các ion: NaCl cho 1 Na⁺ và 1 Cl⁻; CaCl₂ cho 1 Ca²⁺ (z = 2) và 2 Cl⁻. [T]`,
				nac3: `**(a)** Ion: Na⁺ 10 mM và Cl⁻ 10 mM, cả hai z = 1: I = ½ × (10 + 10) mM = ${so(I0 * 1000)} mM = 0,01 mol/L. [T]

**(b)** Thêm: Ca²⁺ 5 mM (z² = 4) và Cl⁻ 10 mM (z² = 1). Cộng các số hạng c·z² với phần NaCl ban đầu rồi nhân ½. Đổi I sang mol/L trước khi lấy căn. [T]`,
				loi: `**(a)** I = ${so(I0 * 1000)} mM; κ⁻¹ = 0,304/√0,01 = **${so(debye(I0))} nm**. [T]

**(b)** I = ½ × (10 + 10 + 5×4 + 10) mM = ${so(I1 * 1000)} mM; κ⁻¹ = 0,304/√0,025 = **${so(debye(I1))} nm**. [T]

**(c)** Thêm 5 mM NaCl: I = ${so(I2 * 1000)} mM; κ⁻¹ = **${so(debye(I2))} nm**. Cùng thêm 5 mM, CaCl₂ làm lực ion tăng ${so((I1 - I0) / 0.005)} mM mỗi mM muối, còn NaCl chỉ ${so((I2 - I0) / 0.005)}; lớp che mỏng đi nhiều hơn (${so(debye(I1))} so với ${so(debye(I2))} nm). Ion hóa trị 2 che điện tích mạnh gấp ${so((I1 - I0) / (I2 - I0))} lần cùng nồng độ ion hóa trị 1. [T]

**Giới hạn:** thực phẩm thật còn có đệm, phosphat, citrat; Ca²⁺ tạo phức với chúng nên lực ion hiệu dụng khác con số tính. Ca²⁺ còn bắc cầu giữa các protein mang điện âm nên gây keo tụ mạnh hơn dự đoán chỉ từ κ⁻¹. [G]`,
			};
		},
	},
	{
		id: 'ostwald',
		tieuDe: 'Giọt to lên theo thời gian: có phải Ostwald ripening không?',
		may: 'Ostwald ripening',
		bai: ['nhu-tuong', 'mat-on-dinh', 'Mất ổn định'],
		nhap: { t0: '0', d0: '0,150', t1: '14', d1: '0,169', t2: '28', d2: '0,185', t3: '42', d3: '0,198', t4: '56', d4: '0,210', du: '90' },
		viet() {
			const k = ostwald(OST);
			const d90 = Math.cbrt(k.d3Dau + k.doDocD3 * 90);
			const bang = OST.map(([t, d]) => `| ${t} | ${so(d, 3)} | ${so(d ** 3 * 1e3, 3)} |`).join('\n');
			return {
				de: `Một nhũ tương hương liệu (tinh dầu trong nước) được đo cỡ hạt định kỳ, cùng một loại đường kính ở mọi lần đo. Số liệu dưới đây do đề dựng sẵn để tập tính, không phải số đo thật. [T]

| Ngày | d (µm) | d³ (10⁻³ µm³) |
|---|---|---|
${bang}

**(a)** Độ dốc của d³ theo thời gian và tốc độ ω = d(r³)/dt là bao nhiêu? So R² của đường d³ theo t với R² của đường d theo t.
**(b)** Kết luận gì về cơ chế? Cần thêm bằng chứng nào?
**(c)** Nếu giữ nguyên tốc độ thì d ở ngày 90 là bao nhiêu, và con số này đáng tin đến đâu?`,
				nac1: `Thuyết Ostwald ripening (LSW) nói giọt nhỏ tan dần, dầu khuếch tán qua pha nước sang giọt lớn, nên khối lượng dầu trong giọt lớn tăng đều theo thời gian. Thể tích tỉ lệ với d³. Vậy đại lượng nào nên tăng thẳng theo thời gian nếu đúng là ripening: d, d² hay d³? Hãy nhớ hợp giọt và keo tụ cho đường cong khác. [G]`,
				nac2: `Theo thuyết LSW, bán kính giọt thỏa: [K]

$$
r^{3}(t) = r^{3}(0) + \\omega\\, t
$$

Vì d³ = 8r³, vẽ d³ theo t sẽ ra đường thẳng có độ dốc bằng 8ω. Làm hồi quy tuyến tính y = d³ theo t, đọc độ dốc và R²; làm thêm hồi quy y = d theo t để so R². Ngoại suy ra ngày 90 bằng chính đường thẳng đó rồi lấy căn bậc ba. [T]`,
				nac3: `Tính d³ cho từng dòng (cột cuối bảng, đơn vị 10⁻³ µm³). Dùng 5 điểm làm hồi quy tuyến tính theo công thức bình phương tối thiểu (hoặc hàm LINEST/SLOPE trong bảng tính): độ dốc ${kh(k.doDocD3)} µm³/ngày, tung độ gốc ${kh(k.d3Dau)} µm³. [T]

Chia độ dốc cho 8 để có ω. Với phần (c), thay t = 90 vào đường thẳng để có d³ rồi lấy căn bậc ba. [T]`,
				loi: `**(a)** Độ dốc của d³ = **${kh(k.doDocD3)} µm³/ngày**, nên ω = độ dốc/8 = **${kh(k.omegaR3)} µm³/ngày**. R² của d³ theo t = **${so(k.r2D3, 4)}**; R² của d theo t = **${so(k.r2D, 4)}**. [T]

**(b)** Đường d³ thẳng hơn (R² ${so(k.r2D3, 4)} so với ${so(k.r2D, 4)}) nên số liệu phù hợp với ripening, nhưng đường d cũng khớp rất cao trong khoảng đo ngắn, vì d³ tăng không nhiều so với giá trị đầu. R² cao chưa chứng minh cơ chế. Một đối chứng nên làm: thêm một ít dầu không tan trong nước (ví dụ triglyceride chuỗi dài) vào pha dầu; nếu tốc độ tăng cỡ giọt giảm mạnh thì nghiêng hẳn về ripening, nếu không thì phải nghĩ đến hợp giọt hay keo tụ. [G]

**(c)** Giữ nguyên đường thẳng thì d³(90) = ${kh(k.d3Dau + k.doDocD3 * 90)} µm³ và **d ≈ ${so(d90)} µm**. Ngày 90 nằm ngoài khoảng đo (0 đến 56 ngày), nên đây là ngoại suy: chỉ đáng tin nếu cơ chế không đổi và tốc độ giữ nguyên, thực tế nhiệt độ, thành phần pha nước hay giai đoạn đầu và cuối của quá trình đều có thể làm tốc độ đổi. Nên đo thêm ở ngày 90 thay vì tin con số này. [G]`,
			};
		},
	},
];

const CHU_NAC = [
	['Nấc 1 · Gợi ý hướng đi', 'nac1'],
	['Nấc 2 · Gợi ý công thức', 'nac2'],
	['Nấc 3 · Gợi ý thay số', 'nac3'],
	['Lời giải đầy đủ', 'loi'],
];

/** Liên kết "Mở máy với số này": ô nào có trong `nhap` được điền sẵn; may-tinh.js đọc các tham số dạng <id>.<ô>=<giá trị>. */
export function lienKetMay(b) {
	const q = Object.entries(b.nhap)
		.map(([o, v]) => `${b.id}.${o}=${encodeURIComponent(v)}`)
		.join('&');
	return `../may-tinh/?${q}#mt-${b.id}`;
}

/** Nội dung markdown của trang /bai-giai-mau/ (máy in ghi ra src/content/docs/bai-giai-mau.md). */
export function trangBaiGiai(tongMay = 13) {
	const phan = BAI_GIAI.map((b, i) => {
		const v = b.viet();
		const [khu, slug, ten] = b.bai;
		return `<div id="bg-${b.id}"></div>

## Bài ${i + 1}. ${b.tieuDe}

<p class="bg-dong">Máy: ${b.may} · Đọc trước: <a href="../${khu}/${slug}/">${ten}</a></p>

<div class="bg-de">

**Đề bài.** ${v.de.replace(/\n\*\*\(/g, '\n\n**(')}

</div>

<p class="bg-huong-dan">Tự giải trước, rồi mở từng nấc khi bí. Mở nấc nào cũng được, nhưng mở lần lượt sẽ giữ được phần tự nghĩ.</p>

${CHU_NAC.map(([tenNac, kh2], j) => `<details class="bg-nac${j === 3 ? ' bg-loi' : ''}">
<summary>${tenNac}</summary>

${v[kh2]}

</details>`).join('\n\n')}

<p class="bg-mo-may"><a href="${lienKetMay(b)}">Mở máy "${b.may}" với số của đề →</a></p>`;
	}).join('\n\n');
	return `---
title: Bài giải mẫu
description: Mỗi máy tính một bài giải mẫu từ tình huống phòng lab, có gợi ý ba nấc (hướng đi, công thức, thay số), lời giải đầy đủ và nút mở máy với số của đề.
editUrl: false
---

Máy tính cho bạn con số; bài giải mẫu cho bạn cách nghĩ để tự ra con số đó và biết khi nào không nên tin nó. Mỗi bài có một đề lấy từ tình huống phòng lab, ba nấc gợi ý tăng dần và lời giải đầy đủ. Hãy tự giải trước, bí thì mở nấc 1 (hướng đi), chưa ra thì mở nấc 2 (công thức), vẫn chưa ra thì mở nấc 3 (thay số), cuối cùng đối chiếu với lời giải. Nút ở cuối mỗi bài mở sẵn máy tính với đúng số của đề để bạn đổi số và xem kết quả đổi theo.

**Số trong đề đều do đề dựng để tập tính ([T]), không phải số đo thật của một sản phẩm.** Phép tính trong lời giải lấy từ cùng công thức với máy tính trong trang [Máy tính](../may-tinh/), nên hai bên luôn khớp. Cách đọc các nhãn [N], [K], [T], [G] ở trang [Quy ước](../quy-uoc/).

Hiện có ${BAI_GIAI.length} bài trên ${tongMay} máy tính; các bài còn lại sẽ được bổ sung dần.

${phan}
`;
}
