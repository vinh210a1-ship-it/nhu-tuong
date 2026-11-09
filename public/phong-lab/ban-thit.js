// BÀN THỊT: pha nước muối (muối, phosphat, bicarbonat), tiêm vào miếng thịt, đo pH, nấu, cân năng suất.
import { taoBan, h, so, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong, chai } from './ban-chung.js';
import { moPhongThit, PHOSPHAT, NHAN_TP, NHIEM_VU_THIT, chamSaoThit } from './mo-hinh-thuc-pham.js';

const TU = {
	'tu-thit': {
		ten: 'Tủ phụ gia thịt',
		moTa: 'Muối chiết protein sợi cơ; phosphat và bicarbonat nâng pH thịt ra xa điểm đẳng điện. Chỉ được chọn một loại phosphat mỗi mẻ.',
		mon: [
			{ id: 'muoi', ten: 'Muối ăn (NaCl)', nhan: 'NaCl', mau: '#f4f4f4' },
			{ id: 'stpp', ten: PHOSPHAT.stpp.ten, nhan: 'STPP', mau: '#e6eef7' },
			{ id: 'tspp', ten: PHOSPHAT.tspp.ten, nhan: 'TSPP', mau: '#dfe9e1' },
			{ id: 'shmp', ten: PHOSPHAT.shmp.ten, nhan: 'SHMP', mau: '#efe6f5' },
			{ id: 'bicarb', ten: 'Natri bicarbonat (E500ii)', nhan: 'HCO₃', mau: '#f3efe2' },
			{ id: 'khoa:tg', ten: 'Transglutaminase', nhan: 'TG', mau: '#e0d6f0', khoaMo: 'Enzyme nối protein bằng liên kết ε-(γ-Glu)-Lys. Có bằng chứng giảm hao hụt nấu (Santhi 2017) nhưng chưa có số liều–đáp ứng để mô phỏng.' },
			{ id: 'khoa:nitrit', ten: 'Natri nitrit (E250)', nhan: 'NO₂', mau: '#f5d9d9', khoaMo: 'Giữ màu hồng thịt ướp (nitrosyl hemochrome). Sẽ mở cùng trạm màu thịt.' },
		],
	},
};
const MO_TA = {
	muoi: `Muối chiết và làm trương protein sợi cơ (myosin). Hiệp lực với phosphat: phosphat một mình kém hiệu quả ${nhanHTML(NHAN_TP.hiepLuc)}.`,
	stpp: `Phosphat phổ biến nhất trong thịt. Dung dịch kiềm, nâng pH thịt ra xa điểm đẳng điện nên sợi cơ tích điện, đẩy nhau và giữ nước ${nhanHTML(NHAN_TP.phPhos)}. Cũng làm chậm thịt bị ôi ${nhanHTML(NHAN_TP.tbars)}.`,
	tspp: `Pyrophosphat: kiềm mạnh, nâng pH nhiều nhất trong ba loại. Ở mức phân tử, gắn vào vùng gắn ATP của myosin và giúp tách actomyosin.`,
	shmp: `Polyphosphat mạch dài, dung dịch gần trung tính nên nâng pH rất ít: giữ nước kém STPP, TSPP cùng liều.`,
	bicarb: `Baking soda. Nâng pH thịt, được dùng cùng STPP trong nghiên cứu của Sheard 2004 (pH 5,45 lên 5,75–5,97) ${nhanHTML(NHAN_TP.phPhos)}.`,
};

const MAC_DINH = () => ({ pH0: 5.45, muoi: 0, phosphat: null, cPhos: 0, bicarb: 0, nhietNau: 72 });
const coTrong = (st, mon) =>
	(mon.id === 'muoi' && st.me.muoi > 0) || (PHOSPHAT[mon.id] && st.me.phosphat === mon.id) || (mon.id === 'bicarb' && st.me.bicarb > 0);
const tinh = (st) => moPhongThit({ ...st.me, daUop: st.daUop });

function doiCongThuc(st, api, chu) {
	const daLam = st.daUop || st.daNau;
	Object.assign(st, { daUop: false, daDoPH: false, daNau: false, daCan: false });
	if (st.viTri !== 'khay') st.viTri = 'khay';
	if (daLam) api.noi(`${chu ?? ''} Nước muối đã đổi nên lấy <b>miếng thịt mới</b>: thịt quay về khay.`);
	else if (chu) api.noi(chu);
}

function veDoThi(st, kq) {
	// Năng suất theo pH ở mức muối hiện tại: thấy đường tăng khi pH xa vùng pI
	const W = 300, H = 140, L = 34, B = 112, R = 290, T = 12;
	const X = (p) => L + ((p - 5.0) / 2.5) * (R - L);
	const Y = (y) => B - ((y - 65) / 30) * (B - T);
	const diem = [];
	for (let p = 5.0; p <= 7.5001; p += 0.05) diem.push([p, moPhongThit({ pH0: p, muoi: st.me.muoi, nhietNau: st.me.nhietNau }).nangSuat]);
	const pts = diem.map(([p, y]) => `${X(p).toFixed(1)},${Y(Math.max(65, y)).toFixed(1)}`).join(' ');
	return `<svg class="pl-bieu-do" viewBox="0 0 ${W} ${H}" role="img" aria-label="Năng suất nấu theo pH thịt">
<rect x="${X(5.0)}" y="${T}" width="${X(5.5) - X(5.0)}" height="${B - T}" class="pl-vung-pi"/><text x="${(X(5.0) + X(5.5)) / 2}" y="${T + 12}" text-anchor="middle" class="pl-truc">vùng pI</text>
<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="pl-truc-duong"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="pl-truc-duong"/>
${[5, 5.5, 6, 6.5, 7, 7.5].map((p) => `<text x="${X(p)}" y="${B + 14}" text-anchor="middle" class="pl-truc">${soCD(p)}</text>`).join('')}
${[70, 80, 90].map((y) => `<text x="${L - 4}" y="${Y(y) + 4}" text-anchor="end" class="pl-truc">${y}%</text>`).join('')}
<polyline points="${pts}" class="pl-duong-thit"/>
<circle cx="${X(Math.min(7.5, Math.max(5, kq.pH)))}" cy="${Y(Math.max(65, kq.nangSuat))}" r="5" class="pl-diem-thit"/>
<text x="${R}" y="${B + 28}" text-anchor="end" class="pl-truc">pH thịt sau ướp →</text></svg>
<p class="pl-meo">Đường cong: năng suất nếu chỉ đổi pH, giữ ${soCD(st.me.muoi)}% muối và ${st.me.nhietNau} °C. Chấm: miếng thịt của bạn (tính cả phosphat). Vùng pI ${nhanHTML(NHAN_TP.pI)} là nơi thịt giữ nước kém nhất.</p>`;
}

function viSao(st, kq) {
	const ly = [];
	ly.push([NHAN_TP.phPhos, `pH thịt từ ${soCD(kq.pH0, 2)} lên ${soCD(kq.pH, 2)}. Càng xa vùng điểm đẳng điện, protein sợi cơ càng tích điện âm, đẩy nhau ra và giữ nước trong khe giữa các sợi.`]);
	ly.push([NHAN_TP.hiepLuc, st.me.muoi < 0.5 ? 'Gần như không có muối nên protein sợi cơ không được chiết ra: phosphat một mình chỉ giúp được rất ít.' : `${soCD(st.me.muoi)}% muối chiết myosin ra, tạo mạng gel giữ nước khi nấu. Muối và pH cao cùng lúc mạnh hơn tổng từng thứ riêng.`]);
	ly.push([NHAN_TP.nhietNau, `Nấu ${st.me.nhietNau} °C: nhiệt càng cao, protein co càng mạnh và ép nước ra.`]);
	if (kq.tbars.coDuLieu) ly.push([NHAN_TP.tbars, `Thịt chạm ngưỡng ôi (TBARS 2 mg/kg ở 4 °C) vào khoảng ngày ${soCD(kq.tbars.ngay, 0)}${kq.tbars.vuotKhoang ? ' (trên 0,3% STPP không có dữ liệu, lấy giá trị ở 0,3%)' : ''}.`]);
	else ly.push([NHAN_TP.tbars, `Chỉ có số liệu TBARS cho STPP; với ${h(PHOSPHAT[st.me.phosphat].ngan)} chưa có dữ liệu nên không dự đoán.`]);
	for (const c of kq.canhBao) ly.push([c.ma === 'ph-cao' ? NHAN_TP.phCao : NHAN_TP.hangSoThit, c.chu]);
	ly.push([NHAN_TP.hangSoThit, 'Các hằng số mô hình là số minh họa, chọn để khớp các số đo thật ở trên. Muốn dùng cho sản phẩm thật phải đo trên chính nguyên liệu của bạn.']);
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-thit', 18, 40, 200, 'Tủ phụ gia thịt', TU['tu-thit'].mon);
	const xo = `<g class="pl-xo" data-bam="moTu" tabindex="0" role="button" aria-label="Xô nước muối: bấm để mở tủ phụ gia">
<path d="M240 250 h70 l-8 72 h-54 z" class="may"/><rect x="246" y="262" width="58" height="10" class="pl-nuoc-muoi"/><text x="275" y="300" text-anchor="middle" class="nho">nước muối</text></g>`;
	const khay = tram('khay', '1 · Khay thịt', `<rect x="70" y="312" width="140" height="13" rx="4" class="may-toi"/><rect x="64" y="306" width="152" height="8" rx="4" class="may"/>`, 70, 354);
	const tiem = tram(
		'tiem',
		'2 · Máy tiêm',
		`<g class="pl-rung"><rect x="340" y="190" width="120" height="135" rx="10" class="may"/><rect x="340" y="190" width="120" height="24" rx="10" class="may-dau"/>
${Array.from({ length: 6 }, (_, i) => `<line x1="${356 + i * 18}" y1="214" x2="${356 + i * 18}" y2="262" class="pl-kim-tiem"/>`).join('')}
<rect x="350" y="290" width="100" height="10" rx="3" class="may-toi"/><circle cx="440" cy="203" r="5" class="den"/></g>`,
		340,
		354,
	);
	const ph = tram(
		'ph',
		'3 · Máy đo pH',
		`<rect x="490" y="250" width="86" height="75" rx="8" class="may"/><rect x="500" y="262" width="66" height="28" rx="4" class="man-hinh"/><text x="533" y="282" text-anchor="middle" class="man-chu" data-man="ph">--</text>
<path d="M560 250 q30 -40 40 -10" class="pl-day"/><rect x="594" y="232" width="8" height="70" rx="3" class="may-toi"/>`,
		490,
		354,
	);
	const noi = tram(
		'noi',
		'4 · Nồi sous-vide',
		`<g class="pl-rung"><rect x="630" y="220" width="150" height="105" rx="10" class="may"/><rect x="640" y="232" width="130" height="62" rx="5" class="tu-trong"/>
<g class="pl-bong-nuoc">${Array.from({ length: 6 }, (_, i) => `<circle cx="${656 + i * 20}" cy="${284 - (i % 3) * 14}" r="3"/>`).join('')}</g>
<rect x="700" y="300" width="70" height="18" rx="3" class="man-hinh"/><text x="735" y="314" text-anchor="middle" class="man-chu" data-man="noi">72 °C</text><circle cx="650" cy="309" r="6" class="den"/></g>`,
		630,
		354,
	);
	const can = tram(
		'can',
		'5 · Cân',
		`<rect x="820" y="300" width="110" height="25" rx="4" class="may"/><rect x="830" y="292" width="90" height="8" rx="2" class="may-toi"/><rect x="842" y="306" width="66" height="14" rx="2" class="man-hinh"/><text x="875" y="317" text-anchor="middle" class="so-can" data-man="can">0,0 g</text>`,
		820,
		354,
	);
	return `${nenPhong('BÀN THỊT')}${tu}${xo}${chai(222, 318, '#f4f4f4', 'NaCl', 40)}${khay}${tiem}${ph}${noi}${can}`;
};
const vatSVG = () => `<g class="pl-coc pl-thit" tabindex="0" role="button" aria-label="Miếng thịt: kéo thả sang máy"><g class="pl-coc-trong">
<rect x="-46" y="-46" width="92" height="56" fill="transparent"/>
<path d="M-34 -2 C-40 -20 -22 -36 0 -34 C22 -36 40 -22 34 -4 C30 6 -28 8 -34 -2 z" class="thit-than"/>
<path d="M-20 -22 C-8 -28 10 -26 22 -18" class="thit-mo"/><path d="M-24 -10 C-10 -16 12 -14 26 -8" class="thit-mo"/>
<g class="thit-uop">${Array.from({ length: 7 }, (_, i) => `<circle cx="${-24 + i * 8}" cy="${-16 + (i % 2) * 8}" r="1.6"/>`).join('')}</g>
<text x="0" y="-40" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;

const TRAM_THIT = [
	{ id: 'khay', ten: 'Nước muối', so: 1, viTri: [140, 302], vung: [40, 140, 320, 330] },
	{ id: 'tiem', ten: 'Tiêm', so: 2, viTri: [400, 284], vung: [330, 170, 470, 330] },
	{ id: 'ph', ten: 'Đo pH', so: 3, viTri: [533, 246], vung: [480, 200, 615, 330] },
	{ id: 'noi', ten: 'Nấu', so: 4, viTri: [705, 270], vung: [620, 200, 790, 330] },
	{ id: 'can', ten: 'Cân', so: 5, viTri: [875, 290], vung: [810, 200, 940, 330] },
];

export function khoiDongBanThit(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-thit',
		tt: (st) => {
			const kq = tinh(st);
			const ds = [];
			if (st.me.muoi > 0) ds.push({ k: 'muoi', ten: 'Muối ướp', v: st.me.muoi, dv: '% khối lượng thịt', nhan: 'T' });
			ds.push({ k: 'pH', ten: st.daUop ? 'pH sau ướp (tính)' : 'pH thịt (chưa ướp)', v: Math.round(kq.pH * 100) / 100, dv: '', nhan: 'T' });
			if (st.daNau) ds.push({ k: 'nangSuat', ten: 'Năng suất sau nấu (tính)', v: Math.round(kq.nangSuat * 10) / 10, dv: '%', nhan: 'T' });
			return ds;
		},
		nhiemVu: NHIEM_VU_THIT,
		nha: 'khay',
		tram: TRAM_THIT,
		tu: TU,
		tenVat: 'Xô nước muối',
		nhanCanh: 'Bàn thịt. Bấm tủ để lấy phụ gia, kéo miếng thịt sang các máy',
		huongDan: 'Mẹo: mở <b>tủ phụ gia thịt</b>, kéo chai thả vào xô nước muối; rồi <b>kéo miếng thịt</b> qua máy tiêm → đo pH → nồi → cân. Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn thịt đây! Câu hỏi hôm nay: <b>vì sao phosphat làm thịt mọng nước?</b> Mở tủ phụ gia, pha nước muối rồi tiêm vào thịt thử xem.',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => ({ me: cu ? cu.me : MAC_DINH(), daUop: false, daDoPH: false, daNau: false, daCan: false }),
		daXong: (st) => ({ khay: st.me.muoi > 0 || st.me.cPhos > 0 || st.me.bicarb > 0, tiem: st.daUop, ph: st.daDoPH, noi: st.daNau, can: st.daCan }),
		coTrong,
		cho(st, mon, api) {
			const me = st.me;
			if (mon.id === 'muoi') me.muoi = me.muoi || 2;
			else if (PHOSPHAT[mon.id]) {
				const cu = me.phosphat;
				me.phosphat = mon.id;
				me.cPhos = me.cPhos || 0.3;
				if (cu && cu !== mon.id) api.noi(`Đổi ${PHOSPHAT[cu].ngan} sang ${PHOSPHAT[mon.id].ngan}: mỗi mẻ chỉ một loại phosphat.`);
			} else if (mon.id === 'bicarb') me.bicarb = me.bicarb || 0.3;
			doiCongThuc(st, api, `Đã cho <b>${h(mon.ten.split(' (')[0])}</b> vào xô nước muối.`);
			return true;
		},
		bo(st, mon, api) {
			if (mon.id === 'muoi') st.me.muoi = 0;
			else if (PHOSPHAT[mon.id]) Object.assign(st.me, { phosphat: null, cPhos: 0 });
			else if (mon.id === 'bicarb') st.me.bicarb = 0;
			doiCongThuc(st, api);
		},
		theMon: (st, mon) => `<p class="pl-meo">${MO_TA[mon.id] ?? ''}</p>`,
		dich: (st) => {
			const me = st.me;
			const ds = [me.muoi && `${soCD(me.muoi)}% muối`, me.phosphat && `${soCD(me.cPhos, 2)}% ${PHOSPHAT[me.phosphat].ngan}`, me.bicarb && `${soCD(me.bicarb, 2)}% bicarbonat`].filter(Boolean);
			return `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><path d="M10 14 h70 l-8 60 h-54 z" class="xo-vien"/><rect x="14" y="30" width="62" height="40" class="xo-nuoc"/></svg><small>${ds.length ? ds.join(' · ') : 'Xô đang chỉ có nước. Kéo chai thả vào đây.'}</small>`;
		},
		choToi(st, id) {
			if (id === 'can' && !st.daNau) return 'Cân để tính năng suất <b>sau khi nấu</b>. Đưa thịt vào nồi trước nhé.';
			if (id === 'tiem' && st.daNau) return 'Thịt đã chín rồi, không tiêm được nữa. Bấm "Làm miếng mới" ở bảng cân.';
			return null;
		},
		khiToi(st, id, api) {
			if (id === 'tiem') {
				const coGi = st.me.muoi > 0 || st.me.cPhos > 0 || st.me.bicarb > 0;
				api.chay('tiem', 1400, () => {
					st.daUop = true;
					st.daDoPH = false;
					api.ve();
					api.noi(coGi ? 'Phập phập! Nước muối đã vào thớ thịt. Kéo thịt sang <b>máy đo pH</b> xem pH đổi thế nào.' : 'Tiêm toàn nước thôi, không có muối hay phosphat. Đây sẽ là <b>mẫu đối chứng</b>.', coGi ? 'vui' : '');
				});
			} else if (id === 'ph') {
				st.daDoPH = true;
				const kq = tinh(st);
				api.ve();
				const d = kq.pH - kq.pH0;
				api.noi(d > 0.05 ? `pH lên <b>${soCD(kq.pH, 2)}</b> (từ ${soCD(kq.pH0, 2)}). Xa vùng đẳng điện hơn, sợi cơ sẽ giữ nước tốt hơn.` : `pH vẫn <b>${soCD(kq.pH, 2)}</b>, sát vùng đẳng điện: thịt sẽ mất nhiều nước khi nấu.`, d > 0.05 ? 'vui' : 'lo');
			} else if (id === 'can') {
				st.daCan = true;
				api.ve();
				const kq = tinh(st);
				if (st.nv) api.ghiSao(chamSaoThit(st.nv, kq, st.me));
				else api.noi(`Năng suất <b>${soCD(kq.nangSuat)}%</b>: 100 g thịt sống còn ${soCD(kq.nangSuat)} g sau nấu.`, kq.nangSuat >= 83 ? 'vui' : '');
			}
		},
		bang: {
			khay(st) {
				const me = st.me;
				const khoaPH = !!st.nv;
				const ds = [];
				if (me.muoi) ds.push(`<li class="pl-dong-coc"><div class="pl-dong-dau"><span class="pl-cham" style="background:#f4f4f4"></span><b>Muối NaCl</b><button type="button" class="pl-bo" data-lam="boMuoi" aria-label="Bỏ muối">✕</button></div>${thanhTruot('muoi', 'Muối trong sản phẩm', 0.1, 3, 0.1, me.muoi, '%', (v) => soCD(v))}</li>`);
				if (me.phosphat) ds.push(`<li class="pl-dong-coc"><div class="pl-dong-dau"><span class="pl-cham" style="background:#e6eef7"></span><b>${h(PHOSPHAT[me.phosphat].ten.split(' (')[0])}</b><button type="button" class="pl-bo" data-lam="boPhos" aria-label="Bỏ phosphat">✕</button></div>${thanhTruot('cPhos', 'Phosphat', 0.05, 0.5, 0.05, me.cPhos, '%')}</li>`);
				if (me.bicarb) ds.push(`<li class="pl-dong-coc"><div class="pl-dong-dau"><span class="pl-cham" style="background:#f3efe2"></span><b>Natri bicarbonat</b><button type="button" class="pl-bo" data-lam="boBic" aria-label="Bỏ bicarbonat">✕</button></div>${thanhTruot('bicarb', 'Bicarbonat', 0.05, 0.5, 0.05, me.bicarb, '%')}</li>`);
				return (
					dauBang('Xô nước muối & miếng thịt', 'Mở tủ, kéo chai thả vào xô. Lượng tính theo % khối lượng thịt sau khi tiêm. Khoảng liều trong các nghiên cứu: muối 0–3%, phosphat 0,1–0,5%.', '🥩') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-thit">🧂 Tủ phụ gia thịt</button></div>` +
					(ds.length ? `<ul class="pl-ds-coc">${ds.join('')}</ul>` : `<p class="pl-meo">Xô đang chỉ có nước. Nếu tiêm luôn, bạn có mẫu đối chứng.</p>`) +
					thanhTruot('pH0', 'pH thịt tươi ban đầu', 5.3, 6.4, 0.05, me.pH0, '', (v) => soCD(v, 2), khoaPH) +
					`<p class="pl-meo">Thịt lợn bình thường pH ≈ 5,45 (Sheard 2004). Thịt pH cao (thịt sẫm, khô) tự giữ nước tốt hơn.</p>` +
					`<p class="pl-ok">Kéo miếng thịt sang máy tiêm, hoặc <button type="button" class="pl-link" data-dua="tiem">mang thịt sang máy tiêm</button>.</p>`
				);
			},
			tiem(st) {
				return dauBang('Máy tiêm nước muối', 'Kim tiêm bơm nước muối vào sâu trong thớ thịt cho thấm đều, nhanh hơn ngâm.', '💉') +
					(st.viTri !== 'tiem' ? `<p class="pl-canh-bao">Thịt chưa ở máy. <button type="button" class="pl-link" data-dua="tiem">Mang thịt tới đây</button>.</p>` : st.daUop ? `<p class="pl-ok">Đã tiêm xong. Kéo thịt sang <button type="button" class="pl-link" data-dua="ph">máy đo pH</button>.</p>` : '<p class="pl-meo">Đang tiêm…</p>');
			},
			ph(st) {
				const kq = tinh(st);
				return dauBang('Máy đo pH', 'Cắm điện cực vào thịt. pH quyết định protein sợi cơ tích điện nhiều hay ít.', '🧪') +
					(st.daDoPH ? `<div class="pl-so-to"><span>${soCD(kq.pH, 2)}</span><small>pH thịt ${st.daUop ? 'sau ướp' : 'chưa ướp'}</small></div>${veDoThi(st, kq)}<p class="pl-ok">Kéo thịt sang <button type="button" class="pl-link" data-dua="noi">nồi sous-vide</button>.</p>` : `<p class="pl-canh-bao">Kéo miếng thịt thả vào máy đo, hoặc <button type="button" class="pl-link" data-dua="ph">mang thịt tới đây</button>.</p>`);
			},
			noi(st) {
				return dauBang('Nồi sous-vide', 'Nấu trong túi kín ở nhiệt độ chính xác. Nhiệt cao làm protein co mạnh và ép nước ra.', '♨️') +
					thanhTruot('nhietNau', 'Nhiệt độ nấu', 56, 80, 1, st.me.nhietNau, '°C', (v) => String(v)) +
					(st.viTri !== 'noi' ? `<p class="pl-canh-bao">Thịt chưa ở nồi. <button type="button" class="pl-link" data-dua="noi">Mang thịt tới đây</button>.</p>` : st.daNau ? `<p class="pl-ok">Chín rồi! Kéo thịt sang <button type="button" class="pl-link" data-dua="can">cân</button>.</p>` : `<button type="button" class="pl-nut" data-lam="nau">♨️ Nấu</button>`);
			},
			can(st, api) {
				if (!st.daCan) return dauBang('Cân', 'Cân thịt sau nấu để tính năng suất.', '⚖️') + `<p class="pl-canh-bao">Kéo thịt đã nấu vào cân.</p>`;
				const kq = tinh(st);
				const dc = moPhongThit({ pH0: st.me.pH0, nhietNau: st.me.nhietNau, daUop: false });
				const sao = st.nv ? api.saoHTML(chamSaoThit(st.nv, kq, st.me)) : '';
				return dauBang('Kết quả', '100 g thịt sống sau ướp và nấu còn lại bao nhiêu?', '⚖️') + sao +
					`<div class="pl-so-to"><span>${soCD(kq.nangSuat)}%</span><small>năng suất nấu · mẫu không ướp cùng nhiệt: ${soCD(dc.nangSuat)}%</small></div>
<div class="pl-so-lon"><div><span>pH</span><b>${soCD(kq.pH, 2)}</b></div><div><span>Nước mất</span><b>${soCD(kq.hao)} g</b></div><div><span>Tới lúc ôi</span><b>${kq.tbars.coDuLieu ? '≈ ' + soCD(kq.tbars.ngay, 0) : '?'}</b><small>ngày ở 4 °C</small></div></div>` +
					veDoThi(st, kq) + viSao(st, kq) + `<button type="button" class="pl-nut" data-lam="lamMoi">Làm miếng mới</button>`;
			},
		},
		doi(st, k, v, api) {
			st.me[k] = v;
			if (k === 'nhietNau') {
				if (st.daNau) {
					Object.assign(st, { daNau: false, daCan: false, viTri: 'noi', tram: 'noi', canVeLai: true });
					api.noi('Đổi nhiệt độ thì phải nấu lại miếng khác cùng công thức. Bấm <b>Nấu</b>.');
				}
				return;
			}
			if (st.daUop || st.daNau) {
				doiCongThuc(st, api, 'Nước muối đã đổi.');
				st.canVeLai = true;
			}
		},
		hienO: (st, k) => ({ muoi: `${soCD(st.me.muoi)} %`, cPhos: `${soCD(st.me.cPhos, 2)} %`, bicarb: `${soCD(st.me.bicarb, 2)} %`, pH0: soCD(st.me.pH0, 2), nhietNau: `${st.me.nhietNau} °C` })[k],
		lam: {
			moTu: (st, api) => api.moTu('tu-thit'),
			boMuoi: (st, api) => { st.me.muoi = 0; doiCongThuc(st, api); api.ve(); },
			boPhos: (st, api) => { Object.assign(st.me, { phosphat: null, cPhos: 0 }); doiCongThuc(st, api); api.ve(); },
			boBic: (st, api) => { st.me.bicarb = 0; doiCongThuc(st, api); api.ve(); },
			nau: (st, api) =>
				api.chay('noi', 1800, () => {
					st.daNau = true;
					api.ve();
					api.noi(`Xèo… Thịt đã chín ở ${st.me.nhietNau} °C. Kéo sang <b>cân</b> xem còn bao nhiêu gam.`);
				}),
			lamMoi: (st, api) => {
				api.lamMoi(true);
				api.noi('Miếng thịt mới! Nước muối vẫn giữ công thức cũ, bạn chỉnh rồi tiêm lại nhé.');
			},
		},
		capNhatCanh(st, svg) {
			const kq = tinh(st);
			const vat = svg.querySelector('.pl-thit');
			vat.classList.toggle('da-uop', st.daUop);
			vat.classList.toggle('chin', st.daNau);
			vat.classList.toggle('trong-tu', false);
			const s = st.daNau ? Math.cbrt(kq.nangSuat / 100) : 1;
			vat.querySelector('.thit-than').style.transform = `scale(${s.toFixed(3)})`;
			svg.querySelector('[data-man="ph"]').textContent = st.daDoPH && st.viTri === 'ph' ? soCD(kq.pH, 2) : '--';
			svg.querySelector('[data-man="noi"]').textContent = `${st.me.nhietNau} °C`;
			svg.querySelector('[data-man="can"]').textContent = st.viTri === 'can' && st.daCan ? `${soCD(kq.nangSuat)} g` : '0,0 g';
			svg.querySelector('.pl-nuoc-muoi').style.opacity = st.me.muoi || st.me.cPhos || st.me.bicarb ? 1 : 0.35;
		},
	});
}
