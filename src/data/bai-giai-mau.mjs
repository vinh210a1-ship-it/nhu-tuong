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
import { stokes, chatNhuHoaToiThieu, banKinhNhoNhat, laplace, lucIon, debye, ostwald, pickering, hlbTron, hlbPhanA, q10DoiThoiGian, arrhenius, KB, R } from '../../public/cong-thuc.js';

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
const ARR = [[90, 24], [100, 11.5], [110, 5.6], [120, 2.8]]; // (°C, giờ)

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

**(c)** Thêm 5 mM NaCl: I = ${so(I2 * 1000)} mM; κ⁻¹ = **${so(debye(I2))} nm**. Cùng thêm 5 mM, CaCl₂ làm lực ion tăng ${so((I1 - I0) / 0.005)} mM mỗi mM muối, còn NaCl chỉ ${so((I2 - I0) / 0.005)}; lớp che mỏng đi nhiều hơn (${so(debye(I1))} so với ${so(debye(I2))} nm). Vậy muối CaCl₂ (cation hóa trị 2) làm lực ion tăng gấp ${so((I1 - I0) / (I2 - I0))} lần NaCl cùng nồng độ, vì số hạng c·z² của Ca²⁺ gấp 4 lần Na⁺. [T]

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
	{
		id: 'pickering',
		tieuDe: 'Hạt rắn nào bám mặt giọt đủ chặt để làm nhũ tương Pickering?',
		may: 'Năng lượng giải hấp hạt Pickering',
		bai: ['nhu-tuong', 'he-dac-biet', 'Hệ nhũ tương đặc biệt'],
		nhap: { r: '50', g: '30', th: '60', T: '25' },
		viet() {
			const TK = 25 + 273.15;
			const A = pickering(50, 30, 60, TK), B = pickering(5, 30, 60, TK);
			const C30 = pickering(50, 30, 30, TK), C120 = pickering(50, 30, 120, TK), E90 = pickering(50, 30, 90, TK);
			const kT = A.J / A.kT;
			return {
				de: `Bạn muốn làm nhũ tương dầu trong nước ổn định bằng hạt rắn thay cho chất nhũ hóa phân tử. Nhà cung cấp chào hai cỡ hạt cầu cứng cùng vật liệu: hạt A bán kính r = 50 nm và hạt B bán kính r = 5 nm. Đề cho: sức căng dầu–nước γ = 30 mN/m; góc tiếp xúc của hạt tại mặt phân cách dầu–nước, đo qua pha nước, θ = 60°; nhiệt độ 25 °C. [T]

**(a)** Năng lượng giải hấp ΔE của một hạt A là bao nhiêu J, và gấp bao nhiêu lần kT (năng lượng chuyển động nhiệt)?
**(b)** Hạt B có ΔE bằng bao nhiêu kT? Vì sao lại kém hạt A đúng chừng đó lần?
**(c)** Hai lô hạt A khác được xử lý bề mặt nên có θ = 30° và θ = 120°. ΔE của mỗi lô là bao nhiêu kT? Lô nào còn hợp với nhũ tương dầu trong nước?
**(d)** Phòng lab gửi kết quả "θ = 60°" đo bằng giọt nước đặt trên màng hạt khô trong không khí. Có thay số này vào công thức được không?`,
				nac1: `Hạt nằm trên mặt giọt giống quả bóng nổi ngang mặt nước: nó che mất một mảng tròn của mặt phân cách dầu–nước. Muốn kéo hạt ra khỏi mặt giọt thì phải tạo lại mảng mặt phân cách đó, tức là tốn một năng lượng cỡ diện tích mảng nhân với sức căng. Tự hỏi: (1) hạt to gấp 10 lần thì mảng tròn bị che rộng gấp mấy lần? (2) Hạt nằm lệch hẳn về một pha (θ xa 90°) thì mảng bị che rộng ra hay hẹp lại? (3) Vì sao phải so ΔE với kT chứ không chỉ nhìn số J? [G]`,
				nac2: `Năng lượng giải hấp của một hạt cầu cứng nằm trên mặt phân cách dầu–nước: [N: @schroen2024]

$$
\\Delta E = \\pi\\, r^{2}\\,\\gamma\\,(1-|\\cos\\theta|)^{2}
$$

Đổi r từ nm thành m (nhân 10⁻⁹) và γ từ mN/m thành N/m (nhân 10⁻³) để ΔE ra J. Năng lượng chuyển động nhiệt kT = k<sub>B</sub> × T, với k<sub>B</sub> = ${kh(KB, 7)} J/K và T tính bằng kelvin (25 °C = 298,15 K). Tỉ số ΔE/kT cho biết chuyển động nhiệt có đủ sức bứt hạt ra khỏi mặt giọt không. [T]`,
				nac3: `πr² = π × (50×10⁻⁹ m)² = ${kh(E90.J / 0.03)} m². Nhân với γ = 30×10⁻³ N/m được ${kh(E90.J)} J: đây là ΔE lớn nhất, ứng với θ = 90°. [T]

Với θ = 60°: cos 60° = 0,5 nên (1 − 0,5)² = 0,25; nhân vào số vừa có để ra ΔE. kT = ${kh(KB, 7)} J/K × 298,15 K = ${kh(kT)} J; chia ΔE cho kT. Các phần còn lại chỉ đổi r hoặc θ; nhớ lấy giá trị tuyệt đối của cos θ khi θ lớn hơn 90°. [T]`,
				loi: `**(a)** ΔE = ${kh(E90.J)} J × 0,25 = **${kh(A.J)} J**. Với kT = ${kh(kT)} J thì ΔE ≈ **${kh(A.kT)} kT** (máy ghi ${so(A.kT)} kT). [T]

Chuyển động nhiệt chỉ có năng lượng cỡ 1 kT, nên hạt A coi như không tự rời mặt giọt: lớp hạt đứng chắn giữa hai giọt và hợp giọt rất khó xảy ra. [G]

**(b)** Hạt B: ΔE ≈ **${so(B.kT)} kT**, kém hạt A đúng ${so(A.kT / B.kT)} lần. ΔE tỉ lệ với r²: bán kính nhỏ đi 10 lần thì mảng mặt phân cách mà hạt che nhỏ đi 10² = 100 lần. [T]

Hạt B vẫn bám, nhưng yếu hơn nhiều và nhạy hơn với mọi thứ làm giảm γ hay đẩy θ ra xa 90°. [G] Bài Hệ nhũ tương đặc biệt ghi rằng hạt rất nhỏ (dưới khoảng 10 nm) hoặc γ rất thấp thì hạt không giữ được trên bề mặt. [N: @schroen2024]

**(c)** θ = 30°: (1 − cos 30°)² = (1 − ${so(Math.cos(Math.PI / 6))})² ≈ ${so(C30.J / E90.J, 2)}, nên ΔE ≈ **${kh(C30.kT)} kT**, nhỏ hơn lô θ = 60° khoảng ${so(A.kT / C30.kT)} lần. θ = 120°: |cos 120°| = 0,5, giống cos 60°, nên ΔE ≈ **${kh(C120.kT)} kT**, bằng đúng lô θ = 60°. [T]

Công thức không phân biệt θ = 60° với θ = 120°, nhưng loại nhũ tương thì có: θ đo trong pha nước nhỏ hơn 90° thuận lợi cho dầu trong nước, lớn hơn 90° thuận lợi cho nước trong dầu. [N: @li2022a] Vì vậy lô θ = 120° bám chặt ngang lô 60° nhưng kéo hệ về phía nước trong dầu, không hợp với mục tiêu của đề; lô θ = 30° đúng loại nhũ tương nhưng bám yếu hơn hẳn. ΔE lớn là điều kiện cần, chưa đủ để chọn hạt. [G]

**(d)** Không thay thẳng được. Công thức cần θ tại mặt phân cách dầu–nước, đo qua pha nước. Góc đo bằng giọt nước trên màng hạt khô trong không khí là góc của một mặt phân cách khác (nước–không khí), hai loại số đo không so trực tiếp được. Hãy hỏi lại phương pháp đo; khi chưa rõ thì chỉ coi kết quả tính là minh họa. [G]

**Giới hạn:** công thức viết cho hạt cầu cứng, đơn lẻ, giọt lớn hơn hạt rất nhiều. [N: @schroen2024] Microgel và protein là hạt mềm, đổi hình khi hấp phụ nên không có một góc tiếp xúc cố định; với chúng ΔE tính ra chỉ để minh họa. [N: @murray2019]`,
			};
		},
	},
	{
		id: 'hlb',
		tieuDe: 'Phối hai chất nhũ hóa theo tỉ lệ nào để đạt HLB mục tiêu?',
		may: 'Trộn hai chất nhũ hóa theo HLB',
		bai: ['chat-nhu-hoa', 'nen-tang-vat-ly-hoa-be-mat', 'Nền tảng hóa lý bề mặt'],
		nhap: { a: '5', b: '15', wa: '30', muc: '11' },
		viet() {
			const hA = 5, hB = 15, me = 500, tong = (me * 2) / 100;
			const h30 = hlbTron(hA, hB, 0.3);
			const w11 = hlbPhanA(hA, hB, 11), w10 = hlbPhanA(hA, hB, 10), w12 = hlbPhanA(hA, hB, 12);
			const w16 = (16 - hB) / (hA - hB); // hlbPhanA trả null vì nằm ngoài 0–1; phép kiểm QUAN_HE canh điều này
			return {
				de: `Bạn có hai chất nhũ hóa không ion. Chất A ưa dầu, tài liệu kỹ thuật (TDS) của nhà cung cấp ghi HLB = ${hA}. Chất B ưa nước, TDS ghi HLB = ${hB}. Nhà cung cấp dầu gợi ý thử quanh HLB = 11 cho nhũ tương dầu trong nước của bạn. Ba con số này do đề cho để tập tính, không phải HLB của một chất hay một loại dầu cụ thể. Mẻ thử nặng ${me} g, tổng lượng chất nhũ hóa bằng 2% khối lượng mẻ. [T]

**(a)** Trộn thử 30% A với 70% B (theo khối lượng) thì HLB hỗn hợp là bao nhiêu?
**(b)** Muốn HLB hỗn hợp bằng 11 thì cần bao nhiêu % A và bao nhiêu % B? Cân mỗi chất bao nhiêu gam cho mẻ ${me} g?
**(c)** Lập dãy sàng lọc ba điểm HLB 10, 11 và 12: mỗi điểm cần bao nhiêu % A?
**(d)** Cặp A–B này có phối ra HLB 16 được không? Vì sao?`,
				nac1: `HLB hỗn hợp là trung bình có trọng số theo khối lượng, giống pha nước nóng với nước lạnh để được nước ấm: nhiệt độ sau khi pha luôn nằm giữa hai nhiệt độ ban đầu và nghiêng về bên nào nhiều hơn. Tự hỏi: (1) thêm nhiều A thì HLB hỗn hợp tăng hay giảm? (2) Có pha ra được con số nằm ngoài khoảng giữa hai chất không? (3) Bài toán ngược (biết HLB muốn có, tìm tỉ lệ) chỉ là giải một phương trình bậc nhất với ẩn là phần khối lượng của A. [G]`,
				nac2: `Quy tắc cộng tuyến tính theo khối lượng, với w<sub>A</sub> và w<sub>B</sub> là phần khối lượng của hai chất trong hỗn hợp chất nhũ hóa (cộng lại bằng một), chỉ số hh nghĩa là hỗn hợp: [K]

$$
\\mathrm{HLB}_{hh} = w_A\\,\\mathrm{HLB}_A + w_B\\,\\mathrm{HLB}_B
$$

Thay w<sub>B</sub> = 1 − w<sub>A</sub> rồi giải ngược để tìm phần khối lượng của A khi biết HLB mục tiêu (viết tắt HLB<sub>mt</sub>): [T]

$$
w_A = \\frac{\\mathrm{HLB}_{mt}-\\mathrm{HLB}_B}{\\mathrm{HLB}_A-\\mathrm{HLB}_B}
$$

Kết quả w<sub>A</sub> chỉ có nghĩa khi nằm từ 0 đến 1. Khối lượng từng chất = phần khối lượng × tổng lượng chất nhũ hóa của mẻ. [T]`,
				nac3: `**(a)** w<sub>A</sub> = 0,3 và w<sub>B</sub> = 0,7: HLB = 0,3 × ${hA} + 0,7 × ${hB}. [T]

**(b)** w<sub>A</sub> = (11 − ${hB}) / (${hA} − ${hB}) = (−4) / (−10). Tổng chất nhũ hóa của mẻ = 2% × ${me} g = ${so(tong)} g; nhân lần lượt với w<sub>A</sub> và w<sub>B</sub>. [T]

**(c)** và **(d)** Lặp lại công thức của (b) với HLB mục tiêu 10, 12 và 16; để ý dấu của kết quả ở (d). [T]`,
				loi: `**(a)** HLB = 0,3 × ${hA} + 0,7 × ${hB} = ${so(0.3 * hA)} + ${so(0.7 * hB)} = **${so(h30)}**. [T]

**(b)** w<sub>A</sub> = ${so(w11)}: cần **${so(w11 * 100)}% A + ${so((1 - w11) * 100)}% B**. Mẻ ${me} g có ${so(tong)} g chất nhũ hóa, nên cân **${so(w11 * tong)} g chất A** và **${so((1 - w11) * tong)} g chất B**. Thử lại: ${so(w11)} × ${hA} + ${so(1 - w11)} × ${hB} = ${so(hlbTron(hA, hB, w11))}. [T]

**(c)** HLB 10 cần ${so(w10 * 100)}% A; HLB 11 cần ${so(w11 * 100)}% A; HLB 12 cần ${so(w12 * 100)}% A (phần còn lại là B). Cứ tăng 1 đơn vị HLB thì phần của A bớt ${so((w10 - w11) * 100)} điểm phần trăm, vì hai chất cách nhau ${hB - hA} đơn vị HLB. [T]

Cả ba điểm nằm trong dải HLB 10–18 mà McClements (2016) ghi là ổn định nhũ tương dầu trong nước. [N: @mcclements2016 tr.134–135]

**(d)** Không. Công thức cho w<sub>A</sub> = (16 − ${hB}) / (${hA} − ${hB}) = ${so(w16).replace('-', '−')}, tức là "âm ${so(-w16 * 100)}% A", không cân được. HLB hỗn hợp luôn nằm giữa HLB của hai chất (từ ${hA} đến ${hB}); muốn có 16 thì phải đổi chất B sang một chất có HLB cao hơn 16. [T]

**Rút ra:** tỉ lệ ${so(w11 * 100)}% A + ${so((1 - w11) * 100)}% B là điểm xuất phát để thử, không phải đáp án. Làm cả dãy ở (c) rồi đo cỡ giọt và độ bền mới biết điểm nào tốt nhất. [G] HLB là con số tĩnh, không tính đến loại dầu, nhiệt độ, muối, pH. [N: @abbott] Trong kem lạnh, khả năng gây mất ổn định mỡ của chất nhũ hóa không giải thích hết bằng HLB. [N: @goff1989] Về chính phép cộng tuyến tính: một nghiên cứu trên este sucrose thấy trộn tuyến tính theo HLB trong dải 10–16. [N: @gupta1983]`,
			};
		},
	},
	{
		id: 'q10',
		tieuDe: 'Thử cấp tốc ở 40 °C nói gì về hạn dùng ở 25 °C?',
		may: 'Quy đổi thời gian theo Q10',
		bai: ['chat-beo', 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', 'Oxy hóa và hạn dùng'],
		nhap: { t1: '21', T1: '40', T2: '25', q: '2' },
		viet() {
			const t2 = q10DoiThoiGian(21, 40, 25, 2);
			const tThap = q10DoiThoiGian(21, 40, 25, 1.5), tCao = q10DoiThoiGian(21, 40, 25, 3);
			const heSo = q10DoiThoiGian(1, 40, 25, 2); // 2^1,5
			const nguoc = q10DoiThoiGian(365, 25, 40, 2);
			return {
				de: `Bạn bảo quản cấp tốc một loại dầu ăn đóng chai ở 40 °C. Chỉ số peroxid (PV) vượt ngưỡng nội bộ của công ty sau 21 ngày. Chưa có số đo ở nhiệt độ khác, nên tạm giả định Q10 = 2 (đề cho; Q10 là số lần phản ứng nhanh lên khi tăng 10 °C). Nhiệt độ bảo quản thật là 25 °C. [T]

**(a)** Quy về 25 °C thì thời gian tới ngưỡng là bao nhiêu ngày?
**(b)** Nếu Q10 thật là 1,5 hoặc 3 thì kết quả nằm trong khoảng nào? Hai đầu khoảng chênh nhau mấy lần?
**(c)** Bài toán ngược: muốn có cơ sở cho hạn 12 tháng (365 ngày) ở 25 °C với Q10 = 2 thì mẫu ở 40 °C phải trụ ít nhất bao nhiêu ngày?
**(d)** Có nên in kết quả ở (a) lên nhãn không?`,
				nac1: `Nóng hơn thì hỏng nhanh hơn, nên mẫu ở 25 °C phải trụ lâu hơn mẫu ở 40 °C. Q10 = 2 nghĩa là cứ lạnh đi 10 °C thì thời gian dài gấp đôi. Tự hỏi: (1) từ 40 °C xuống 25 °C là mấy "bậc 10 °C"? (2) Một bậc rưỡi thì nhân đôi "một lần rưỡi" nghĩa là nhân với bao nhiêu? Gợi ý: không phải 2 × 1,5. [G]`,
				nac2: `Quy đổi thời gian theo Q10, với giả định cơ chế hỏng không đổi giữa hai nhiệt độ: [K]

$$
t_2 = t_1 \\cdot Q_{10}^{\\,(T_1 - T_2)/10}
$$

T₁ là nhiệt độ đã đo, T₂ là nhiệt độ muốn quy về, cùng tính bằng °C. Số mũ dương khi quy về nhiệt độ thấp hơn (thời gian dài ra), âm khi quy về nhiệt độ cao hơn (thời gian ngắn lại). [T]`,
				nac3: `**(a)** Số mũ = (40 − 25) / 10 = 1,5. Lũy thừa 2<sup>1,5</sup> = 2 × √2 ≈ ${so(heSo)}. Nhân với 21 ngày. [T]

**(b)** Làm lại với 1,5<sup>1,5</sup> và 3<sup>1,5</sup> (mẹo: x<sup>1,5</sup> = x × √x). [T]

**(c)** Đổi vai hai nhiệt độ: t₁ = 365 ngày ở T₁ = 25 °C, quy về T₂ = 40 °C. Số mũ = (25 − 40) / 10 = −1,5, tức là chia 365 cho 2<sup>1,5</sup>. [T]`,
				loi: `**(a)** t₂ = 21 × 2<sup>1,5</sup> = 21 × ${so(heSo)} ≈ **${so(t2)} ngày**, chưa đầy 2 tháng. [T]

**(b)** Q10 = 1,5 cho **${so(tThap)} ngày**; Q10 = 3 cho **${so(tCao)} ngày** (máy đổi thành ${so(tCao / 30.4)} tháng). Hai đầu chênh nhau ${so(tCao / tThap)} lần, dù Q10 chỉ đổi từ 1,5 lên 3. Số mũ lớn dần theo khoảng cách nhiệt độ, nên quy đổi càng xa thì sai số của Q10 càng bị khuếch đại. [T]

**(c)** t₁ = 365 / 2<sup>1,5</sup> = 365 / ${so(heSo)} ≈ **${so(nguoc)} ngày** ở 40 °C, tức hơn 4 tháng. Mẫu của đề mới trụ 21 ngày, nên với Q10 = 2 nó chưa đỡ được hạn 12 tháng. [T]

**(d)** Chưa nên. Con số ${so(t2)} ngày đứng trên hai giả định chưa kiểm: Q10 = 2 là số đề cho chứ không phải số đo của sản phẩm này, và cơ chế hỏng ở 40 °C giống ở 25 °C. Ở nhiệt độ cao, chất béo có thể nóng chảy, nhũ tương có thể vỡ, cơ chế oxy hóa có thể đổi. Việc nên làm: đo thêm ở ít nhất một nhiệt độ nữa để tính Q10 của chính sản phẩm (xem bài giải mẫu kế tiếp, máy Arrhenius), và luôn đặt song song mẫu bảo quản thực ở 25 °C. [G]`,
			};
		},
	},
	{
		id: 'arrhenius',
		tieuDe: 'Bốn điểm đo Rancimat thẳng hàng: ngoại suy về 25 °C đáng tin đến đâu?',
		may: 'Hạn dùng theo Arrhenius từ thử nghiệm tăng tốc',
		bai: ['chat-beo', 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', 'Oxy hóa và hạn dùng'],
		nhap: { c0: '90', t0: '24', c1: '100', t1: '11,5', c2: '110', t2: '5,6', c3: '120', t3: '2,8', dich: '25' },
		viet() {
			const k = arrhenius(ARR);
			const b = (k.EaKJ * 1000) / R; // độ dốc của ln t theo 1/T, đơn vị K
			const a = Math.log(k.thoiGianTai(100)) - b / (100 + 273.15);
			const t25 = k.thoiGianTai(25), t105 = k.thoiGianTai(105);
			const thapNhat = Math.min(...ARR.map(([c]) => c)), caoNhat = Math.max(...ARR.map(([c]) => c));
			const am = (x, n) => so(x, n).replace('-', '−');
			const bangDe = ARR.map(([c, t]) => `| ${c} | ${so(t)} |`).join('\n');
			const tp = (x, n) => x.toLocaleString('vi-VN', { minimumFractionDigits: n, maximumFractionDigits: n }); // giữ đủ chữ số sau dấu phẩy để các dòng bảng thẳng hàng
			const bangDoi = ARR.map(([c, t]) => `| ${c} | ${tp(c + 273.15, 2)} | ${tp(1000 / (c + 273.15), 4)} | ${tp(Math.log(t), 4)} |`).join('\n');
			return {
				de: `Bạn đo thời gian cảm ứng (thời gian tới khi dầu bắt đầu oxy hóa nhanh) của một mẫu dầu bằng máy Rancimat ở bốn nhiệt độ. Số liệu dưới đây do đề dựng sẵn để tập tính, không phải số đo của dầu nào. [T]

| Nhiệt độ (°C) | Thời gian cảm ứng (giờ) |
|---|---|
${bangDe}

**(a)** Vẽ ln t theo 1/T (T tính bằng kelvin). Độ dốc, năng lượng hoạt hóa E<sub>a</sub> và R² là bao nhiêu?
**(b)** Dùng đường vừa khớp để ước lượng thời gian cảm ứng ở 105 °C. Phép tính này khác gì về bản chất so với phép tính ở (c)?
**(c)** Kéo đường thẳng về 25 °C: được bao nhiêu giờ, đổi ra tháng? Q10 quanh 25 °C và quanh 100 °C là bao nhiêu?
**(d)** Con số ở (c) có dùng làm hạn dùng in trên nhãn được không?`,
				nac1: `Phản ứng nhanh lên theo nhiệt độ không theo đường thẳng mà theo hàm mũ. Arrhenius cho một cách "nắn thẳng" quan hệ đó: đổi trục tung thành logarit của thời gian và trục hoành thành nghịch đảo của nhiệt độ tuyệt đối thì các điểm đo nằm trên một đường thẳng. Tự hỏi: (1) vì sao phải đổi °C sang kelvin trước khi lấy nghịch đảo? (2) Đường dốc hơn nghĩa là phản ứng nhạy với nhiệt độ hơn hay kém hơn? (3) 105 °C nằm giữa các điểm đo, còn 25 °C cách điểm đo thấp nhất bao xa? [G]`,
				nac2: `Dạng đường thẳng của phương trình Arrhenius viết cho thời gian (thời gian tỉ lệ nghịch với tốc độ phản ứng): [K]

$$
\\ln t = a + \\frac{E_a}{R}\\cdot\\frac{1}{T}
$$

Đặt x = 1/T (T = °C + 273,15, đơn vị K) và y = ln t, rồi làm hồi quy tuyến tính y = a + b·x. Độ dốc b = E<sub>a</sub>/R, nên E<sub>a</sub> = b × R với R = ${so(R, 4)} J/(mol·K). Muốn có thời gian ở một nhiệt độ khác thì thay 1/T của nhiệt độ đó vào đường thẳng rồi lấy e mũ kết quả. Q10 quanh một nhiệt độ = t(T) / t(T + 10). [T]`,
				nac3: `Bảng đổi biến (cột x ghi 1000/T cho dễ đọc): [T]

| °C | T (K) | 1000/T (1/K) | ln t |
|---|---|---|---|
${bangDoi}

Dùng bốn điểm (x, y) làm hồi quy bình phương tối thiểu, hoặc dùng hàm SLOPE, INTERCEPT, RSQ trong bảng tính; nhớ dùng x = 1/T chứ không phải 1000/T. Kết quả: độ dốc b ≈ ${so(b, 4)} K, tung độ gốc a ≈ ${am(a, 4)}. [T]

Với (b) và (c): thay T = 105 + 273,15 rồi T = 25 + 273,15 vào ln t = a + b/T. [T]`,
				loi: `**(a)** Độ dốc b ≈ **${so(b, 4)} K**, nên E<sub>a</sub> = b × R ≈ **${so(k.EaKJ)} kJ/mol**. R² = **${so(k.r2, 4)}**: bốn điểm nằm rất sát đường thẳng (máy tính ghi ba chữ số nên hiện R² = ${so(k.r2, 3)}). [T]

**(b)** Ở 105 °C: t ≈ **${so(t105)} giờ**, nằm giữa ${so(ARR[1][1])} giờ (100 °C) và ${so(ARR[2][1])} giờ (110 °C) như mong đợi. Đây là nội suy: 105 °C nằm trong khoảng đã đo (${thapNhat} đến ${caoNhat} °C), nên đường thẳng khớp tốt là đủ để tin. [T]

**(c)** 25 °C nằm **ngoài khoảng có dữ liệu**, thấp hơn điểm đo thấp nhất ${thapNhat - 25} °C, nên mọi con số trong đoạn này là ngoại suy, không phải kết quả đo. Kéo dài đường thẳng về 25 °C: t ≈ ${so(t25)} giờ ≈ **${so(t25 / 24)} ngày ≈ ${so(t25 / 24 / 30.4)} tháng**, và Q10 quanh 25 °C ≈ **${so(k.q10Tai(25))}**. [G: ngoại suy ngoài khoảng đo]

Trong khoảng đo, Q10 quanh 100 °C ≈ **${so(k.q10Tai(100))}**. So với con số quanh 25 °C: cùng một E<sub>a</sub> mà Q10 đổi theo nhiệt độ, nên không có một Q10 dùng chung cho mọi khoảng nhiệt. [T]

R² cao chỉ nói bốn điểm thẳng hàng trong khoảng ${thapNhat} đến ${caoNhat} °C; nó không bảo đảm đường thẳng còn đúng khi kéo dài thêm ${thapNhat - 25} °C. Một sai lệch nhỏ của độ dốc bị khuếch đại mạnh trên quãng kéo dài đó. [G]

**(d)** Không. Ngoại suy từ thử nghiệm Rancimat có thể sai rất xa: với dầu óc chó, hạn dùng dự đoán thấp hơn hạn dùng ghi trên nhãn 15–20 lần. [N: @kochhar2009] Ở ${thapNhat}–${caoNhat} °C, độ tan oxy, cơ chế phản ứng và vai trò chất chống oxy hóa khác với ở 25 °C. [G] Nên dùng kết quả để xếp hạng các công thức với nhau trong cùng điều kiện đo, và xác nhận hạn dùng bằng mẫu bảo quản thực ở nhiệt độ mục tiêu. [G]`,
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
