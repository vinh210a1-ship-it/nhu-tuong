// BÀN MAYONNAISE: khung minh họa. Điểm tham chiếu thật là bảng Li 2012 (dầu 75/80/85%). Ngoài các điểm đó báo "ngoài vùng có dữ liệu".
// Princen–Kiss chỉ là đường nền nhãn T mức Thấp; không in σ hiệu dụng. Không dự đoán hạn sử dụng hay an toàn vi sinh.
import { taoBan, h, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong } from './ban-chung.js';
import { moPhongMayo, gNen, phiMayo, chamSaoMayo, NHIEM_VU_MAYO, NHAN_MOI } from './mo-hinh-ban-moi.js';
import { MAYO } from './so-lieu-ban-moi.js';

const TU = {
	'tu-mayo': {
		ten: 'Tủ mayonnaise',
		moTa: 'Công thức theo Li 2012: dầu đậu nành, lòng đỏ có muối, đường, giấm. Nguyên liệu khác đang khóa vì chưa có số đo.',
		mon: [
			{ id: 'longDo', ten: 'Lòng đỏ trứng (10% muối)', nhan: 'Trứng', mau: '#f2c14e' },
			{ id: 'giam', ten: 'Giấm', nhan: 'Giấm', mau: '#e9e4c8' },
			{ id: 'dau', ten: 'Dầu đậu nành', nhan: 'Dầu', mau: '#e7cf6a' },
			{ id: 'khoa:ppi', ten: 'Vi gel đậu Hà Lan (không trứng)', nhan: 'Đậu', mau: '#cfd9a8', khoaMo: 'Có một nghiên cứu (Li 2022) nhưng giọt 47–76 µm, khác xa mayo trứng và chưa có đủ số lưu biến để mô phỏng.' },
			{ id: 'khoa:dau-khac', ten: 'Dầu khác', nhan: 'Dầu?', mau: '#d8d0a8', khoaMo: 'Bảng đo chỉ có dầu đậu nành.' },
		],
	},
};
const MO_TA = {
	longDo: 'Chất nhũ hóa chính của mayonnaise: protein và lipoprotein–lecithin. Thiếu nó thì không có gì giữ giọt.',
	giam: 'Hạ pH. Các mẫu đo được có pH khoảng 3,7–4,4 (Li 2012; Paananen 2017). Bàn này không dự đoán vi sinh hay hạn dùng.',
	dau: 'Pha phân tán, chiếm phần lớn mayonnaise: 75–84% khối lượng theo sách McClements.',
};
const moiMe = () => ({ coLongDo: false, coGiam: false, coDau: false, dauPct: 75, tocDo: 'cham', quaNghien: false });
const tinh = (st) => moPhongMayo(st.me);
const coTrong = (st, mon) => ({ longDo: st.me.coLongDo, giam: st.me.coGiam, dau: st.me.coDau })[mon.id] ?? false;
const KHOA = { longDo: 'coLongDo', giam: 'coGiam', dau: 'coDau' };

function datLai(st) {
	Object.assign(st, { daTron: false, daDo: false });
	st.viTri = 'pha';
}

/* G′ theo φ: đường nền Princen–Kiss (T, Thấp), ba điểm đo Li 2012 (N), dải thương mại Nunes 2002 (N). */
function doThi(kq) {
	const W = 300, H = 170, L = 38, R = 292, T = 10, B = 136;
	const X = (p) => L + ((p - 0.68) / 0.22) * (R - L);
	const Y = (g) => B - (Math.min(g, 1500) / 1500) * (B - T);
	const pts = [];
	for (let p = 0.68; p <= 0.9001; p += 0.005) pts.push(`${X(p).toFixed(1)},${Y(gNen(p)).toFixed(1)}`);
	const [lo, hi] = MAYO.Gp_tm.gia_tri;
	const diem = Object.entries(MAYO.li2012.diem).map(([d, v]) => `<circle cx="${X(phiMayo(+d)).toFixed(1)}" cy="${Y(v.Gp).toFixed(1)}" r="4.5" class="mayo-diem${+d === kq.dauPct ? ' dang' : ''}"><title>Dầu ${d}%: G′ ${v.Gp} Pa</title></circle>`).join('');
	return `<svg class="pl-bieu-do" viewBox="0 0 ${W} ${H}" role="img" aria-label="G phẩy theo phần thể tích dầu">
<rect x="${L}" y="${Y(hi)}" width="${R - L}" height="${Y(lo) - Y(hi)}" class="mayo-dai"/>
<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="pl-truc-duong"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="pl-truc-duong"/>
${[0.7, 0.75, 0.8, 0.85, 0.9].map((p) => `<text x="${X(p)}" y="${B + 13}" text-anchor="middle" class="pl-truc">${soCD(p, 2)}</text>`).join('')}
${[0, 500, 1000, 1500].map((g) => `<text x="${L - 4}" y="${Y(g) + 3}" text-anchor="end" class="pl-truc">${g}</text>`).join('')}
<polyline points="${pts.join(' ')}" class="mayo-nen"/>${diem}
<text x="${R}" y="${B + 27}" text-anchor="end" class="pl-truc">φ thể tích dầu (quy đổi từ % khối lượng) →</text><text x="${L + 3}" y="${T + 8}" class="pl-truc">G′ (Pa)</text></svg>
<p class="pl-meo">Chấm: số đo Li 2012 ${nhanHTML(NHAN_MOI.li2012)}. Dải màu: mayo thương mại ${nhanHTML(NHAN_MOI.nunes)}. Đường: Princen–Kiss ${nhanHTML(NHAN_MOI.duongNen)} với số mượn, chỉ làm nền, không phải dự đoán. Quy đổi φ dùng khối lượng riêng giả định ${nhanHTML({ ma: 'T' })}.</p>`;
}

function bangDo(d) {
	return `<div class="pl-so-lon"><div><span>τ₀ (Casson)</span><b>${soCD(d.tau0)}</b><small>Pa</small></div><div><span>G′ ở 10 rad/s</span><b>${d.Gp}</b><small>Pa</small></div><div><span>Đường kính</span><b>${soCD(d.d_tt, 2)}</b><small>µm, theo thể tích</small></div></div>
<div class="pl-so-lon"><div><span>pH</span><b>${soCD(d.pH, 2)}</b></div><div><span>aw</span><b>${soCD(d.aw, 2)}</b></div><div><span>G″ ở 10 rad/s</span><b>${d.Gpp}</b><small>Pa</small></div></div>
<p class="pl-meo">${nhanHTML(NHAN_MOI.li2012)} Số đo thật của một nghiên cứu (Li, Kim, Yoon 2012), không phải dự đoán cho mẻ của bạn. Đường kính theo thể tích, không phải d₃₂.</p>`;
}

function viSao(st, kq) {
	const ly = [];
	if (kq.trangThai === 'khong-nhu-hoa') ly.push([NHAN_MOI.quyTrinhMayo, 'Không có lòng đỏ nên không có chất nhũ hóa giữ giọt: dầu tách ra.']);
	if (kq.trangThai === 'dao-pha') ly.push([NHAN_MOI.quyTrinhMayo, 'Đổ dầu quá nhanh dễ đảo pha hoặc vỡ nhũ. Sách dặn cho dầu từng phần nhỏ và kiểm soát tốc độ thêm dầu. Đây là bài học định tính, trò chơi không tính lượng dầu tách.']);
	if (kq.trangThai === 'tot') {
		ly.push([NHAN_MOI.quyTrinhMayo, 'Cho dầu từng phần và kiểm soát tốc độ đúng quy trình trong sách để tránh đảo pha.' + (kq.quaNghien ? ' Sau đó đồng hóa bằng máy nghiền keo.' : ' Chưa qua máy nghiền keo: sách dùng bước này sau nhũ thô.')]);
		if (kq.duLieu) ly.push([NHAN_MOI.li2012, `Dầu ${kq.dauPct}%: τ₀ ${soCD(kq.duLieu.tau0)} Pa, G′ ${kq.duLieu.Gp} Pa theo bảng đo. Trong bảng này, dầu càng nhiều thì τ₀ và G′ càng cao.`]);
		else ly.push([NHAN_MOI.li2012, st.me.coGiam ? `Dầu ${kq.dauPct}% không có trong bảng đo (chỉ có 75, 80, 85%): ngoài vùng có dữ liệu, trò chơi không đoán.` : 'Mẻ không có giấm là công thức khác với bảng đo: ngoài vùng có dữ liệu, trò chơi không đoán.']);
		if (!kq.trongDaiSach) ly.push([{ ma: 'N' }, `Dải thường gặp theo sách là ${MAYO.dai_dau.gia_tri.join('–')}% khối lượng (McClements 2016, tr.567).`]);
	}
	if (!st.me.coGiam) ly.push([{ ma: 'G' }, 'Chưa có giấm: công thức này khác công thức của bảng đo.']);
	ly.push([NHAN_MOI.duongNen, 'Đường nền Princen–Kiss có ngưỡng φ₀ = 0,712 nằm ngay trong dải φ của mayonnaise, nên rất nhạy. Đừng đọc nó như số đo.']);
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>
<p class="pl-luu-y"><b>Lưu ý:</b> bàn này là khung minh họa. Không dự đoán hạn sử dụng hay an toàn vi sinh; sản phẩm thật cần đo thật.</p>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-mayo', 18, 40, 200, 'Tủ mayonnaise', TU['tu-mayo'].mon);
	const pha = tram('pha', '1 · Bát trộn', `<path d="M70 260 h130 l-16 60 a8 8 0 0 1 -8 6 h-82 a8 8 0 0 1 -8 -6 z" class="may"/><path d="M78 270 h114 l-8 30 h-98 z" class="mayo-nen-bat"/>`, 66, 354);
	const tron = tram('tron', '2 · Máy trộn', `<g class="pl-rung"><rect x="290" y="200" width="120" height="125" rx="10" class="may"/><rect x="290" y="200" width="120" height="24" rx="10" class="may-dau"/><rect x="346" y="224" width="8" height="50" class="may-toi"/><path d="M325 280 h50 l-6 34 h-38 z" class="tu-trong"/></g><path d="M420 170 q-20 30 -60 50" class="mayo-rot" data-man="rot"/>`, 286, 354);
	const nghien = tram('nghien', '3 · Máy nghiền keo', `<g class="pl-rung"><rect x="500" y="230" width="130" height="95" rx="10" class="may"/><circle cx="565" cy="272" r="26" class="may-toi"/><circle cx="565" cy="272" r="12" class="tu-trong"/></g>`, 496, 354);
	const lb = tram('do', '4 · Đo lưu biến', `<rect x="730" y="205" width="120" height="120" rx="10" class="may"/><rect x="744" y="217" width="92" height="40" rx="4" class="man-hinh"/><text x="790" y="242" text-anchor="middle" class="man-chu" data-man="g">--</text><path d="M770 275 h40 l-20 14 z" class="may-toi"/><rect x="765" y="292" width="50" height="8" rx="2" class="may-toi"/>`, 726, 354);
	return `${nenPhong('MAYONNAISE')}${tu}${pha}${tron}${nghien}${lb}`;
};
const vatSVG = () => `<g class="pl-coc pl-coc-mayo" tabindex="0" role="button" aria-label="Bát mẫu: kéo thả sang máy"><g class="pl-coc-trong"><rect x="-34" y="-44" width="68" height="50" fill="transparent"/><path d="M-26 -22 h52 l-8 24 a4 4 0 0 1 -4 3 h-28 a4 4 0 0 1 -4 -3 z" class="coc-vien"/><path d="M-22 -16 h44 l-5 17 h-34 z" class="mayo-dich"/><text x="0" y="-30" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;
const TRAM = [
	{ id: 'pha', ten: 'Pha', so: 1, viTri: [135, 250], vung: [50, 180, 225, 335] },
	{ id: 'tron', ten: 'Thêm dầu', so: 2, viTri: [350, 300], vung: [270, 170, 440, 335] },
	{ id: 'nghien', ten: 'Nghiền keo', so: 3, viTri: [565, 222], vung: [480, 170, 650, 335] },
	{ id: 'do', ten: 'Đo', so: 4, viTri: [790, 300], vung: [710, 170, 870, 335] },
];

export function khoiDongBanMayo(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-mayo',
		nhiemVu: NHIEM_VU_MAYO,
		nha: 'pha',
		tram: TRAM,
		tu: TU,
		tenVat: 'Bát mẫu',
		nhanCanh: 'Bàn mayonnaise. Bấm tủ để lấy nguyên liệu, kéo bát mẫu sang các máy',
		huongDan: 'Mẹo: mở <b>tủ</b> lấy lòng đỏ, giấm, dầu; kéo bát sang <b>máy trộn</b> thêm dầu, qua <b>máy nghiền keo</b>, rồi <b>đo</b>. Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn mayonnaise đây! Đây là <b>khung minh họa</b>: số thật lấy từ một bảng đo ở dầu 75, 80, 85%. <b>Đổ dầu nhanh quá thì sao?</b> Thử xem.',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => ({ me: cu ? cu.me : moiMe(), daTron: false, daDo: false }),
		daXong: (st) => ({ pha: st.me.coLongDo && st.me.coDau, tron: st.daTron, nghien: st.me.quaNghien, do: st.daDo }),
		coTrong,
		cho(st, mon, api) {
			if (KHOA[mon.id]) st.me[KHOA[mon.id]] = true;
			st.me.quaNghien = false;
			datLai(st);
			api.noi(`Đã lấy <b>${h(mon.ten.split(' (')[0])}</b>.`);
			return true;
		},
		bo(st, mon) {
			if (KHOA[mon.id]) st.me[KHOA[mon.id]] = false;
			st.me.quaNghien = false;
			datLai(st);
		},
		theMon: (st, mon) => `<p class="pl-meo">${MO_TA[mon.id] ?? ''}</p>`,
		dich: (st) => {
			const me = st.me;
			const ds = [me.coLongDo && 'lòng đỏ', me.coGiam && 'giấm', me.coDau && 'dầu'].filter(Boolean);
			return `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><path d="M10 20 h70 l-10 46 h-50 z" class="xo-vien"/><rect x="18" y="36" width="54" height="26" class="xo-nuoc"/></svg><small>${ds.length ? ds.join(' · ') : 'Bát đang trống. Kéo chai thả vào đây.'}</small>`;
		},
		choToi(st, id) {
			if (id === 'tron' && !st.me.coDau) return 'Cần <b>dầu</b> để thêm vào. Mở tủ trước đã.';
			if (id === 'nghien' && !st.daTron) return 'Tạo nhũ thô ở <b>máy trộn</b> trước đã.';
			if (id === 'do' && !st.daTron) return 'Chưa có gì để đo. Sang <b>máy trộn</b> trước đã.';
			return null;
		},
		khiToi(st, id, api) {
			if (id === 'nghien' && tinh(st).trangThai === 'tot' && !st.me.quaNghien) {
				api.chay('nghien', 1400, () => {
					st.me.quaNghien = true;
					api.ve();
					api.noi('Đã qua máy nghiền keo. Kéo bát sang <b>đo lưu biến</b>.', 'vui');
				});
			} else if (id === 'do') {
				st.daDo = true;
				api.ve();
				const kq = tinh(st);
				if (st.nv) api.ghiSao(chamSaoMayo(st.nv, kq));
				else if (kq.ngoaiVung) api.noi(`Dầu ${kq.dauPct}% <b>ngoài vùng có dữ liệu</b>: bảng chỉ có 75, 80, 85%.`, 'lo');
			}
		},
		bang: {
			pha(st) {
				const me = st.me;
				return dauBang('Bát trộn', 'Lòng đỏ và giấm trước, dầu đưa vào ở máy trộn. Công thức theo Li 2012: lòng đỏ 8, đường 1, giấm 2 (% khối lượng), còn lại là dầu và nước.', '🥣') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-mayo">🥚 Tủ mayonnaise</button></div>` +
					thanhTruot('dauPct', 'Dầu (% khối lượng)', 65, 90, 5, me.dauPct, '%', (v) => String(v)) +
					`<p class="pl-meo">Chỉ 75, 80 và 85% có số đo. Mức khác vẫn thử được nhưng sẽ báo ngoài vùng có dữ liệu.</p>` +
					(me.coDau ? `<p class="pl-ok"><button type="button" class="pl-link" data-dua="tron">Mang bát sang máy trộn</button>.</p>` : `<p class="pl-canh-bao">Bát chưa có dầu.</p>`);
			},
			tron(st) {
				const me = st.me;
				return dauBang('Máy trộn: thêm dầu', 'Cho dầu vào máy trộn cao tốc để tạo nhũ thô.', '🌀') +
					`<div class="pl-moc" role="group"><span>Cách thêm dầu:</span><button type="button" class="${me.tocDo === 'cham' ? 'dang' : ''}" data-lam="cham">Từng phần nhỏ</button><button type="button" class="${me.tocDo === 'nhanh' ? 'dang' : ''}" data-lam="nhanh">Đổ nhanh một lần</button></div>` +
					(st.viTri !== 'tron' ? `<p class="pl-canh-bao">Bát chưa ở máy. <button type="button" class="pl-link" data-dua="tron">Mang bát tới đây</button>.</p>` : st.daTron ? (tinh(st).trangThai === 'tot' ? `<p class="pl-ok">Có nhũ thô. <button type="button" class="pl-link" data-dua="nghien">Sang máy nghiền keo</button> hoặc <button type="button" class="pl-link" data-dua="do">đo luôn</button>.</p>` : `<p class="pl-canh-bao"><b>Hỏng rồi!</b> ${!me.coLongDo ? 'Không có lòng đỏ, dầu nổi thành lớp.' : 'Đổ dầu quá nhanh nên đảo pha hoặc vỡ nhũ.'} <button type="button" class="pl-link" data-dua="do">Xem vì sao</button>.</p>`) : `<button type="button" class="pl-nut" data-lam="chayTron">▶ Trộn</button>`);
			},
			nghien(st) {
				const kq = tinh(st);
				return dauBang('Máy nghiền keo', 'Sách dùng máy nghiền keo sau bước nhũ thô. Bàn này không tính cỡ giọt theo máy vì chưa có số.', '⚙️') +
					(kq.trangThai !== 'tot' ? `<p class="pl-canh-bao">Nhũ đã hỏng, nghiền cũng không cứu được.</p>` : st.me.quaNghien ? `<p class="pl-ok">Đã nghiền. <button type="button" class="pl-link" data-dua="do">Mang đi đo</button>.</p>` : `<p class="pl-canh-bao">Kéo bát thả vào máy, hoặc <button type="button" class="pl-link" data-dua="nghien">mang bát tới đây</button>.</p>`);
			},
			do(st, api) {
				if (!st.daDo) return dauBang('Đo lưu biến', 'So mẻ của bạn với bảng đo thật.', '📈') + `<p class="pl-canh-bao">Kéo bát thả vào máy đo.</p>`;
				const kq = tinh(st);
				const dau = kq.trangThai !== 'tot' ? `<p class="pl-canh-bao"><b>Nhũ hỏng:</b> không đo được. Bàn này không tính lượng dầu tách.</p>` : kq.duLieu ? bangDo(kq.duLieu) : `<p class="pl-canh-bao"><b>Ngoài vùng có dữ liệu.</b> ${st.me.coGiam ? `Bảng đo chỉ có dầu 75, 80, 85%, nên không có số cho ${kq.dauPct}%.` : 'Mẻ không có giấm, khác công thức của bảng đo.'}</p>`;
				return dauBang('Kết quả', 'Số thật từ bảng đo, đường nền chỉ để tham khảo.', '📈') + (st.nv ? api.saoHTML(chamSaoMayo(st.nv, kq)) : '') + dau + doThi(kq) + viSao(st, kq) + `<button type="button" class="pl-nut" data-lam="lamMoi">Làm mẻ mới</button>`;
			},
		},
		doi(st, k, v, api) {
			st.me[k] = v;
			st.me.quaNghien = false;
			if (st.daTron || st.daDo) {
				datLai(st);
				st.canVeLai = true;
				api.noi('Công thức đổi nên làm <b>mẻ mới</b>.');
			}
		},
		hienO: (st, k) => (k === 'dauPct' ? `${st.me.dauPct} %` : ''),
		lam: {
			cham: (st, api) => { st.me.tocDo = 'cham'; st.me.quaNghien = false; st.daTron = st.daDo = false; api.ve(); },
			nhanh: (st, api) => { st.me.tocDo = 'nhanh'; st.me.quaNghien = false; st.daTron = st.daDo = false; api.ve(); },
			chayTron: (st, api) => api.chay('tron', 1600, () => {
				st.daTron = true;
				api.ve();
				const t = tinh(st).trangThai;
				api.noi(t === 'tot' ? 'Hỗn hợp đặc dần. Có nhũ thô rồi!' : t === 'dao-pha' ? 'Ối, <b>vỡ nhũ</b>! Đổ dầu nhanh quá.' : 'Dầu nổi thành lớp: thiếu chất nhũ hóa.', t === 'tot' ? 'vui' : 'lo');
			}),
			lamMoi: (st, api) => { st.me.quaNghien = false; api.lamMoi(true); api.noi('Mẻ mới. Công thức vẫn giữ, bạn chỉnh rồi làm lại nhé.'); },
		},
		capNhatCanh(st, svg) {
			const kq = tinh(st);
			svg.querySelector('[data-man="g"]').textContent = st.daDo && kq.duLieu ? `G′ ${kq.duLieu.Gp}` : '--';
			svg.querySelector('.mayo-dich').style.fill = st.daTron ? (kq.trangThai === 'tot' ? '#f4e6a8' : '#d7b04a') : st.me.coLongDo ? '#f2c14e' : '#ece6d2';
		},
	});
}
