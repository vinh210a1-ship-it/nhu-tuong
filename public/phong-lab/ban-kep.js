// BÀN NHŨ TƯƠNG KÉP W₁/O/W₂: pha W₁/O với PGPR → đưa vào W₂ bước hai → xem bản đồ miền ổn định → theo dõi theo thời gian.
// Mọi số lấy từ so-lieu-ban-moi.js qua mo-hinh-ban-moi.js. Ô không có trong bài báo thì báo "ngoài vùng có dữ liệu".
import { taoBan, h, so, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong } from './ban-chung.js';
import { moPhongKep, mienKep, chamSaoKep, NHIEM_VU_KEP, NHAN_MOI, roMinhHoa } from './mo-hinh-ban-moi.js';
import { KEP } from './so-lieu-ban-moi.js';

const KHOA_CAS = 'Caseinat cho một bản đồ khác (Nollet 2018) nhưng chưa có đủ số ở dạng bảng để mô phỏng.';
const TU = {
	'tu-kep': {
		ten: 'Tủ nhũ tương kép',
		moTa: 'Hệ của bàn này theo đúng nghiên cứu Nollet 2024. Đổi nguyên liệu khác thì bản đồ không còn đúng, nên các chai khác đang khóa.',
		mon: [
			{ id: 'dau', ten: 'Dầu hướng dương', nhan: 'Dầu', mau: '#e9c84a' },
			{ id: 'pgpr', ten: 'PGPR (E476)', nhan: 'PGPR', mau: '#c98f3c' },
			{ id: 'w1', ten: 'Nước W₁ (NaCl 0,1 M + vitamin B12)', nhan: 'W₁', mau: '#e88a9a' },
			{ id: 'ga', ten: 'Gum arabic 20 wt% (pha ngoài W₂)', nhan: 'GA', mau: '#f0e2c0' },
			{ id: 'khoa:cas', ten: 'Natri caseinat', nhan: 'Cas', mau: '#f5efe0', khoaMo: KHOA_CAS },
			{ id: 'khoa:dau-khac', ten: 'Dầu khác', nhan: 'Dầu?', mau: '#d8d0a8', khoaMo: 'Bản đồ chỉ đo với dầu hướng dương. Loại dầu ảnh hưởng tốc độ rò rỉ (Bonnet 2009), nhưng chưa có số.' },
		],
	},
};
const MO_TA = {
	dau: 'Pha dầu ở giữa, ngăn giọt W₁ với pha ngoài W₂.',
	pgpr: 'Chất nhũ hóa tan trong dầu, giữ giọt nước trong. CMC trong dầu hướng dương khoảng 1 wt%. PGPR dư có thể sang mặt ngoài và phá bước hai.',
	w1: 'Pha nước chứa hoạt chất. Giọt W₁ khoảng 1,9 µm khi khuấy 24 000 rpm trong 30 giây.',
	ga: 'Chất nhũ hóa tan trong nước cho mặt ngoài giọt dầu. Đổi chất nhũ hóa ngoài thì bản đồ đổi.',
};
const MAU_MIEN = { xanh: '#3fb162', cam: '#e8963c', do: '#d65a7a' };
const TEN_MIEN = {
	xanh: 'Miền xanh: nhũ tương kép ổn định',
	cam: 'Miền cam: kép, thuận và nghịch cùng tồn tại, không bền',
	do: 'Miền đỏ: chỉ thu được nhũ tương nghịch, không có giọt kép',
};
const moiMe = () => ({ coDau: false, coPgpr: false, coW1: false, coGa: false, cFree: 2.5, phiD: 10, buoc2: 'nhe', cW2: KEP.nacl_w1.gia_tri, phiO: 0.1 });
const tinh = (st) => moPhongKep(st.me);
const duPha1 = (me) => me.coDau && me.coPgpr && me.coW1;
const coTrong = (st, mon) => ({ dau: st.me.coDau, pgpr: st.me.coPgpr, w1: st.me.coW1, ga: st.me.coGa })[mon.id] ?? false;
const nguonLK = (k, ten) => `<a href="/nhu-tuong/nguon/#${k}">${ten}</a>`;

function datLai(st) {
	Object.assign(st, { daB1: false, daB2: false, daDo: false, daXem: false });
	st.viTri = 'pha';
}

/* Bản đồ: chỉ tô ô có trong bài báo; ô còn lại xám "không có dữ liệu". */
function banDoHTML(me, kq) {
	const CF = KEP.c_free.gia_tri, PD = KEP.phi_d.gia_tri;
	const dau = PD.map((p) => `<th>${soCD(p)}</th>`).join('');
	const hang = CF.map((c) => {
		const o = PD.map((p) => {
			const m = mienKep(c, p);
			const dang = c === me.cFree && p === me.phiD;
			return `<td class="kep-o ${m ?? 'trong'}${dang ? ' dang' : ''}" title="${m ? TEN_MIEN[m] : 'Ngoài vùng có dữ liệu'}">${dang ? '●' : m ? '' : '·'}</td>`;
		}).join('');
		return `<tr><th>${soCD(c, 2)}</th>${o}</tr>`;
	}).join('');
	return `<div class="kep-ban-do"><table aria-label="Bản đồ miền ổn định"><thead><tr><th class="goc">PGPR tự do ↓ · giọt trong →</th>${dau}</tr></thead><tbody>${hang}</tbody></table>
<p class="pl-meo">${nhanHTML(NHAN_MOI.banDo)} Hai trục tính theo wt%. Xanh: bền 9 tháng. Cam: không bền. Đỏ: chỉ có nhũ nghịch. Xám: ${nguonLK('nollet2024', 'Nollet 2024')} không có ô này, trò chơi không đoán. ● là công thức của bạn.</p></div>`;
}

function viSao(st, kq) {
	const ly = [];
	if (kq.lyDoNgoaiVung === 'muoi') ly.push([NHAN_MOI.banDo, 'Bản đồ chỉ đo khi cả hai pha nước đều có NaCl 0,1 M. Bạn đổi muối ở W₂ nên công thức nằm ngoài vùng có dữ liệu.']);
	else if (kq.lyDoNgoaiVung === 'o-trong') ly.push([NHAN_MOI.banDo, 'Ô này không có trong bài báo. Với PGPR tự do từ 1 wt% trở lên, bài cho biết tỉ lệ giọt trong thấp thì khó tạo được nhũ tương đồng nhất, nhưng không cho kết quả từng ô.']);
	else ly.push([NHAN_MOI.banDo, TEN_MIEN[kq.mien] + '.']);
	if (kq.mien) ly.push([NHAN_MOI.sucCang, 'Sức căng giữa W₁/O và W₂ quyết định: dưới 1,5 mN/m không điều chế được kép, 1,5 đến 2,5 tạo được nhưng nhanh hỏng, trên 2,5 thì bền. PGPR tự do nhiều làm sức căng này tụt; giọt W₁ áp vào mặt trong globule che bớt PGPR khỏi mặt ngoài.']);
	if (st.me.cFree === 10) ly.push([NHAN_MOI.banDo, 'Ở PGPR tự do 10 wt%: 40 wt% giọt trong cho tỉ lệ phủ τ = 0,77 và không bền; 47,1 wt% thì bền. Bài báo nêu cần τ ≈ 0,9.']);
	ly.push([NHAN_MOI.gammaPgpr, `PGPR phủ giọt W₁ ở mức giọt trong này ≈ ${soCD(kq.hapPhu, 2)} wt% pha dầu (giọt 1,9 µm), nên tổng PGPR ≈ ${soCD(kq.tongPgpr, 2)} wt%. Số suy từ Γ ≈ 6,1 mg/m²; bài báo nêu ${soCD(KEP.pgpr_hap_phu_40.gia_tri, 2)} wt% ở 40 wt% nước.`]);
	ly.push([NHAN_MOI.buoc2, kq.biPha ? 'Bước hai mạnh bằng bước một nên phá hoặc đẩy giọt W₁ ra ngoài: mất hoạt chất dù công thức đúng.' : 'Bước hai nhẹ hơn bước một nên giữ được giọt W₁.']);
	ly.push([NHAN_MOI.thamThau, kq.huongNuoc === 'can-bang' ? 'W₁ và W₂ cùng nồng độ muối: không có chênh thẩm thấu.' : kq.huongNuoc === 'vao' ? `W₁ đậm hơn W₂ (chênh ≈ ${soCD(Math.abs(kq.dPi))} bar, tính lý tưởng): nước đi vào giọt, giọt dầu trương.` : `W₂ đậm hơn W₁ (chênh ≈ ${soCD(Math.abs(kq.dPi))} bar, tính lý tưởng): nước rời giọt, giọt dầu co.`]);
	ly.push([NHAN_MOI.phiHD, `Với ${soCD(kq.phiO * 100, 0)}% dầu, thể tích hạt hiệu dụng là ${soCD(kq.phiHD * 100, 0)}% (dầu + nước trong). Vì thế cùng lượng béo, giọt kép đặc hơn O/W thường.`]);
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>`;
}

/* Đường rò rỉ: chỉ hình dạng, không có trục số. */
function duongRo(kq) {
	if (kq.ngoaiVung) return '<p class="pl-canh-bao">Ngoài vùng có dữ liệu: không vẽ đường theo thời gian.</p>';
	const W = 300, H = 110, L = 18, R = 290, T = 10, B = 92;
	const pts = Array.from({ length: 41 }, (_, i) => {
		const t = i / 40;
		return `${(L + t * (R - L)).toFixed(1)},${(B - roMinhHoa(kq.mien, t, kq.biPha) * (B - T)).toFixed(1)}`;
	}).join(' ');
	return `<svg class="pl-bieu-do" viewBox="0 0 ${W} ${H}" role="img" aria-label="Đường minh họa phần hoạt chất còn lại theo thời gian">
<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="pl-truc-duong"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="pl-truc-duong"/>
<polyline points="${pts}" class="pl-duong-thit"/><text x="${R}" y="${B + 13}" text-anchor="end" class="pl-truc">thời gian →</text><text x="${L + 4}" y="${T + 9}" class="pl-truc">phần còn lại</text></svg>
<p class="pl-meo">${nhanHTML(NHAN_MOI.roMinhHoa)} Chỉ minh họa hình dạng, không có trục số: chưa có hệ số thấm đã kiểm. ${kq.mien === 'xanh' && !kq.biPha ? `Số đo thật duy nhất: hiệu suất bao gói ≈ ${KEP.ee_9_thang.gia_tri}% suốt 9 tháng ở miền xanh ${nhanHTML(NHAN_MOI.banDo)}.` : ''}</p>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-kep', 18, 40, 200, 'Tủ nhũ tương kép', TU['tu-kep'].mon);
	const b1 = tram('pha', '1 · Bước 1: W₁/O', `<g class="pl-rung"><rect x="70" y="210" width="130" height="115" rx="10" class="may"/><rect x="70" y="210" width="130" height="24" rx="10" class="may-dau"/><rect x="132" y="234" width="6" height="50" class="may-toi"/><rect x="84" y="296" width="102" height="20" rx="3" class="man-hinh"/><text x="135" y="311" text-anchor="middle" class="man-chu">24.000 rpm</text></g>`, 66, 354);
	const b2 = tram('buoc2', '2 · Bước 2: vào W₂', `<g class="pl-rung"><rect x="300" y="230" width="130" height="95" rx="10" class="may"/><rect x="300" y="230" width="130" height="22" rx="10" class="may-dau"/><rect x="362" y="252" width="6" height="34" class="may-toi"/><rect x="314" y="296" width="102" height="20" rx="3" class="man-hinh"/><text x="365" y="311" text-anchor="middle" class="man-chu" data-man="b2">--</text></g>`, 296, 354);
	const kinh = tram('do', '3 · Hiển vi & bản đồ', `<rect x="530" y="220" width="110" height="105" rx="10" class="may"/><rect x="544" y="234" width="82" height="50" rx="4" class="man-hinh"/><circle cx="585" cy="259" r="20" class="kep-ngoai"/><circle cx="578" cy="254" r="5" class="kep-trong"/><circle cx="592" cy="264" r="5" class="kep-trong"/><circle cx="592" cy="250" r="3.5" class="kep-trong"/><circle cx="550" cy="306" r="6" class="den"/>`, 526, 354);
	const tu9 = tram('xem', '4 · Theo dõi', `<rect x="740" y="190" width="130" height="135" rx="10" class="may"/><rect x="752" y="202" width="106" height="90" rx="5" class="tu-trong"/><rect x="752" y="298" width="106" height="20" rx="3" class="man-hinh"/><text x="805" y="313" text-anchor="middle" class="man-chu">thời gian →</text>`, 736, 354);
	return `${nenPhong('NHŨ TƯƠNG KÉP')}${tu}${b1}${b2}${kinh}${tu9}`;
};
const vatSVG = () => `<g class="pl-coc pl-coc-kep" tabindex="0" role="button" aria-label="Cốc mẫu: kéo thả sang máy"><g class="pl-coc-trong">
<rect x="-34" y="-58" width="68" height="70" fill="transparent"/><path d="M-22 -44 h44 l-4 50 a4 4 0 0 1 -4 4 h-28 a4 4 0 0 1 -4 -4 z" class="coc-vien"/>
<path d="M-20 -24 h40 l-3 28 a3 3 0 0 1 -3 3 h-28 a3 3 0 0 1 -3 -3 z" class="kep-dich"/><text x="0" y="-50" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;
const TRAM = [
	{ id: 'pha', ten: 'Bước 1', so: 1, viTri: [135, 200], vung: [50, 150, 225, 335] },
	{ id: 'buoc2', ten: 'Bước 2', so: 2, viTri: [365, 222], vung: [280, 170, 450, 335] },
	{ id: 'do', ten: 'Bản đồ', so: 3, viTri: [585, 212], vung: [510, 170, 660, 335] },
	{ id: 'xem', ten: 'Theo dõi', so: 4, viTri: [805, 290], vung: [720, 170, 890, 335] },
];

export function khoiDongBanKep(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-kep',
		nhiemVu: NHIEM_VU_KEP,
		nha: 'pha',
		tram: TRAM,
		tu: TU,
		tenVat: 'Cốc mẫu',
		nhanCanh: 'Bàn nhũ tương kép. Bấm tủ để lấy nguyên liệu, kéo cốc sang các máy',
		huongDan: 'Mẹo: mở <b>tủ nhũ tương kép</b>, cho dầu, PGPR và nước W₁; chạy <b>bước 1</b>; kéo cốc sang <b>bước 2</b> với gum arabic; rồi xem <b>bản đồ</b>. Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn nhũ tương kép đây! Giọt nước trong giọt dầu trong nước. <b>PGPR bao nhiêu thì đủ mà không quá tay?</b> Mở tủ thử xem.',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => ({ me: cu ? cu.me : moiMe(), daB1: false, daB2: false, daDo: false, daXem: false }),
		daXong: (st) => ({ pha: st.daB1, buoc2: st.daB2, do: st.daDo, xem: st.daXem }),
		coTrong,
		cho(st, mon, api) {
			const k = { dau: 'coDau', pgpr: 'coPgpr', w1: 'coW1', ga: 'coGa' }[mon.id];
			if (k) st.me[k] = true;
			if (mon.id === 'ga') st.daB2 = st.daDo = st.daXem = false;
			else datLai(st);
			api.noi(`Đã lấy <b>${h(mon.ten.split(' (')[0])}</b>.`);
			return true;
		},
		bo(st, mon) {
			const k = { dau: 'coDau', pgpr: 'coPgpr', w1: 'coW1', ga: 'coGa' }[mon.id];
			if (k) st.me[k] = false;
			if (mon.id === 'ga') st.daB2 = st.daDo = st.daXem = false;
			else datLai(st);
		},
		theMon: (st, mon) => `<p class="pl-meo">${MO_TA[mon.id] ?? ''}</p>`,
		dich: (st) => {
			const me = st.me;
			const ds = [me.coDau && 'dầu', me.coPgpr && 'PGPR', me.coW1 && 'nước W₁', me.coGa && 'gum arabic'].filter(Boolean);
			return `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><path d="M10 14 h70 l-8 60 h-54 z" class="xo-vien"/><rect x="14" y="30" width="62" height="40" class="xo-nuoc"/></svg><small>${ds.length ? ds.join(' · ') : 'Cốc đang trống. Kéo chai thả vào đây.'}</small>`;
		},
		choToi(st, id) {
			if (id === 'buoc2' && !st.daB1) return 'Chạy <b>bước 1</b> trước để có W₁/O.';
			if (id === 'do' && !st.daB2) return 'Chưa có giọt kép để soi. Làm <b>bước 2</b> trước.';
			if (id === 'xem' && !st.daDo) return 'Xem <b>bản đồ</b> trước đã.';
			return null;
		},
		khiToi(st, id, api) {
			if (id === 'do') {
				st.daDo = true;
				api.ve();
				const kq = tinh(st);
				api.noi(kq.ngoaiVung ? 'Công thức này <b>ngoài vùng có dữ liệu</b>: trò chơi không đoán.' : TEN_MIEN[kq.mien] + '.', kq.mien === 'xanh' ? 'vui' : 'lo');
			} else if (id === 'xem') {
				st.daXem = true;
				api.ve();
				const kq = tinh(st);
				if (st.nv) api.ghiSao(chamSaoKep(st.nv, kq, st.me));
			}
		},
		bang: {
			pha(st) {
				const me = st.me;
				const CF = KEP.c_free.gia_tri, PD = KEP.phi_d.gia_tri;
				const nut = (nhom, ds, gt, hien) => `<div class="pl-moc" role="group"><span>${nhom}</span>${ds.map((v, i) => `<button type="button" class="${v === gt ? 'dang' : ''}" data-lam="${nhom === 'PGPR tự do:' ? 'cf' : 'pd'}${i}">${hien(v)}</button>`).join('')}</div>`;
				const kq = tinh(st);
				return dauBang('Bước 1: nhũ tương nghịch W₁/O', 'Khuấy mạnh để giọt nước W₁ tan vào dầu có PGPR. Chỉ chọn được những mức có trong nghiên cứu.', '🥣') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-kep">🧴 Tủ nhũ tương kép</button></div>` +
					nut('PGPR tự do:', CF, me.cFree, (v) => `${soCD(v, 2)} wt%`) +
					nut('Giọt trong:', PD, me.phiD, (v) => `${soCD(v)} wt%`) +
					`<p class="pl-meo">PGPR hấp phụ ≈ ${soCD(kq.hapPhu, 2)} wt% pha dầu, tổng ≈ <b>${soCD(kq.tongPgpr, 2)} wt%</b> ${nhanHTML(NHAN_MOI.gammaPgpr)}.</p>` +
					(!duPha1(me) ? `<p class="pl-canh-bao">Cần dầu, PGPR và nước W₁.</p>` : st.daB1 ? `<p class="pl-ok">Xong bước 1. <button type="button" class="pl-link" data-dua="buoc2">Mang cốc sang bước 2</button>.</p>` : `<button type="button" class="pl-nut" data-lam="chayB1">▶ Khuấy ${KEP.rpm_buoc_1.gia_tri.toLocaleString('vi-VN')} rpm, 30 giây</button>`);
			},
			buoc2(st) {
				const me = st.me;
				return dauBang('Bước 2: đưa W₁/O vào W₂', 'Bước này tạo giọt dầu lớn chứa giọt nước. Phải nhẹ tay hơn bước 1, nếu không giọt W₁ bị phá.', '🌀') +
					`<div class="pl-moc" role="group"><span>Cường độ:</span><button type="button" class="${me.buoc2 === 'nhe' ? 'dang' : ''}" data-lam="nhe">Nhẹ hơn bước 1</button><button type="button" class="${me.buoc2 === 'manh' ? 'dang' : ''}" data-lam="manh">Mạnh bằng bước 1</button></div>` +
					`<div class="pl-moc" role="group"><span>NaCl ở W₂:</span>${KEP.nacl_w2_chon.gia_tri.map((v, i) => `<button type="button" class="${v === me.cW2 ? 'dang' : ''}" data-lam="w2${i}">${soCD(v)} M</button>`).join('')}</div>` +
					`<p class="pl-meo">Chỉ 0,1 M nằm trong bản đồ. Mức khác để xem nước đi hướng nào.</p>` +
					thanhTruot('phiO', 'Dầu trong toàn hệ', 0.05, 0.3, 0.01, me.phiO, '', (v) => `${soCD(v * 100, 0)} %`) +
					(st.viTri !== 'buoc2' ? `<p class="pl-canh-bao">Cốc chưa ở máy. <button type="button" class="pl-link" data-dua="buoc2">Mang cốc tới đây</button>.</p>` : !me.coGa ? `<p class="pl-canh-bao">Cần gum arabic cho pha ngoài. <button type="button" class="pl-link" data-mo-tu="tu-kep">Mở tủ</button>.</p>` : st.daB2 ? `<p class="pl-ok">Xong bước 2. <button type="button" class="pl-link" data-dua="do">Soi và xem bản đồ</button>.</p>` : `<button type="button" class="pl-nut" data-lam="chayB2">▶ Chạy bước 2</button>`);
			},
			do(st) {
				if (!st.daDo) return dauBang('Hiển vi & bản đồ', 'Soi xem có giọt kép không và công thức nằm ở đâu trên bản đồ.', '🔬') + `<p class="pl-canh-bao">Kéo cốc thả vào kính hiển vi.</p>`;
				const kq = tinh(st);
				return dauBang('Hiển vi & bản đồ', 'Bản đồ theo Nollet 2024: dầu hướng dương, gum arabic 20 wt%, NaCl 0,1 M.', '🔬') +
					(kq.ngoaiVung ? `<p class="pl-canh-bao"><b>Ngoài vùng có dữ liệu.</b> ${kq.lyDoNgoaiVung === 'muoi' ? 'Bản đồ chỉ đúng khi W₂ có NaCl 0,1 M.' : 'Bài báo không có ô này.'}</p>` : `<p class="pl-ok" style="color:${MAU_MIEN[kq.mien]}"><b>${TEN_MIEN[kq.mien]}</b></p>`) +
					banDoHTML(st.me, kq) +
					`<div class="pl-so-lon"><div><span>Tổng PGPR</span><b>${soCD(kq.tongPgpr, 2)}</b><small>wt% pha dầu</small></div><div><span>φ dầu</span><b>${soCD(kq.phiO * 100, 0)}%</b><small>đã chọn</small></div><div><span>φ hiệu dụng</span><b>${soCD(kq.phiHD * 100, 0)}%</b><small>dầu + nước trong</small></div></div>` +
					`<p class="pl-ok"><button type="button" class="pl-link" data-dua="xem">Mang cốc đi theo dõi</button>.</p>`;
			},
			xem(st, api) {
				if (!st.daXem) return dauBang('Theo dõi', 'Giọt kép giữ hoạt chất được bao lâu?', '⏳') + `<p class="pl-canh-bao">Kéo cốc thả vào tủ theo dõi.</p>`;
				const kq = tinh(st);
				return dauBang('Kết quả', 'Rò rỉ theo thời gian chỉ là hình minh họa.', '⏳') + (st.nv ? api.saoHTML(chamSaoKep(st.nv, kq, st.me)) : '') + duongRo(kq) + viSao(st, kq) + `<button type="button" class="pl-nut" data-lam="lamMoi">Làm mẻ mới</button>`;
			},
		},
		doi(st, k, v) {
			st.me[k] = v;
			st.canVeLai = true;
		},
		hienO: (st, k) => (k === 'phiO' ? `${soCD(st.me.phiO * 100, 0)} %` : ''),
		lam: {
			...Object.fromEntries(KEP.c_free.gia_tri.map((v, i) => [`cf${i}`, (st, api) => { st.me.cFree = v; datLai(st); api.ve(); }])),
			...Object.fromEntries(KEP.phi_d.gia_tri.map((v, i) => [`pd${i}`, (st, api) => { st.me.phiD = v; datLai(st); api.ve(); }])),
			...Object.fromEntries(KEP.nacl_w2_chon.gia_tri.map((v, i) => [`w2${i}`, (st, api) => { st.me.cW2 = v; st.daDo = st.daXem = false; api.ve(); }])),
			nhe: (st, api) => { st.me.buoc2 = 'nhe'; st.daB2 = st.daDo = st.daXem = false; api.ve(); },
			manh: (st, api) => { st.me.buoc2 = 'manh'; st.daB2 = st.daDo = st.daXem = false; api.ve(); },
			chayB1: (st, api) => api.chay('pha', 1400, () => { st.daB1 = true; api.ve(); api.noi('Giọt W₁ đã vào dầu. Kéo cốc sang <b>bước 2</b>.', 'vui'); }),
			chayB2: (st, api) => api.chay('buoc2', 1400, () => { st.daB2 = true; api.ve(); api.noi(st.me.buoc2 === 'nhe' ? 'Xong! Giờ soi xem có giọt kép không.' : 'Bước 2 mạnh quá, nhiều giọt W₁ bị phá. Soi thử xem.', st.me.buoc2 === 'nhe' ? 'vui' : 'lo'); }),
			lamMoi: (st, api) => { api.lamMoi(true); api.noi('Mẻ mới. Công thức vẫn giữ, bạn chỉnh rồi làm lại nhé.'); },
		},
		capNhatCanh(st, svg) {
			const b2 = svg.querySelector('[data-man="b2"]');
			if (b2) b2.textContent = st.me.buoc2 === 'nhe' ? 'nhẹ' : 'mạnh';
			const m = st.daDo ? tinh(st).mien : null;
			svg.querySelector('.kep-dich').style.fill = m ? MAU_MIEN[m] : st.daB1 ? '#e8d9a0' : '#cfe4ee';
		},
	});
}
