// BÀN BẢO QUẢN: pha lọ sản phẩm (muối, đường, axit, chất bảo quản), đo aw và pH, ủ ở nhiệt độ chọn,
// rồi xem 10 mầm bệnh trong bảng FDA và nấm men có mọc trên đĩa thạch không.
import { tenBan } from './tu-luu-mau.js';
import { taoBan, h, so, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong } from './ban-chung.js';
import { moPhongBaoQuan, MAM_BENH, NHAN_TP, NHIEM_VU_BQ, chamSaoBQ, AW_MEN } from './mo-hinh-thuc-pham.js';

const TU = {
	'tu-bq': {
		ten: 'Tủ gia vị & chất bảo quản',
		moTa: 'Muối và đường hút nước, hạ hoạt độ nước (aw). Axit hạ pH. Sorbat, benzoat chặn nấm men, mạnh nhất khi pH thấp.',
		mon: [
			{ id: 'muoi', ten: 'Muối ăn (NaCl)', nhan: 'NaCl', mau: '#f4f4f4' },
			{ id: 'duong', ten: 'Đường saccarose', nhan: 'Đường', mau: '#fbf3df' },
			{ id: 'axit', ten: 'Axit citric (E330)', nhan: 'Citric', mau: '#f6ef9a' },
			{ id: 'sorbat', ten: 'Kali sorbat (E202)', nhan: 'Sorb', mau: '#e8f0f6' },
			{ id: 'benzoat', ten: 'Natri benzoat (E211)', nhan: 'Benz', mau: '#f0e8f6' },
			{ id: 'khoa:nisin', ten: 'Nisin (E234)', nhan: 'Nisin', mau: '#e3f1e0', khoaMo: 'Bacteriocin chặn vi khuẩn Gram dương. Chưa tra được ADI và số liều–đáp ứng có nguồn.' },
			{ id: 'khoa:natamycin', ten: 'Natamycin (E235)', nhan: 'Nata', mau: '#f1e7d6', khoaMo: 'Chống nấm mốc bề mặt (phô mai, xúc xích). Chưa tra được số liệu có nguồn.' },
		],
	},
};
const MO_TA = {
	muoi: `Muối hòa vào pha nước, hạ aw và tạo áp suất thẩm thấu. Bảng FDA tính theo <b>% muối pha nước</b> = muối / (muối + nước) ${nhanHTML(NHAN_TP.fda)}.`,
	duong: `Đường giữ nước, hạ aw nhưng yếu hơn muối tính theo khối lượng vì phân tử to (342 g/mol so với 58 g/mol). Mứt, siro bền nhờ đường ${nhanHTML(NHAN_TP.aw)}.`,
	axit: `Hạ pH. Nhiều vi khuẩn gây bệnh dừng mọc dưới pH 4,0–5,0 (Salmonella thấp nhất trong bảng FDA: 3,7). pH thấp còn làm sorbat, benzoat mạnh lên ${nhanHTML(NHAN_TP.axitYeu)}.`,
	sorbat: `Axit yếu. Phần chưa phân ly đi qua màng tế bào, vào trong thì phân ly làm chua nội bào. Hiệu lực tính theo sorbic acid ${nhanHTML(NHAN_TP.micMen)}. ADI nhóm JECFA: 0–25 mg/kg thể trọng/ngày.`,
	benzoat: `Axit yếu mạnh hơn sorbic nên ở pH 4,5 hầu như đã phân ly hết và mất tác dụng với nấm men ${nhanHTML(NHAN_TP.micMen)}. ADI nhóm JECFA (2021): 0–20 mg/kg thể trọng/ngày.`,
};

const MAC_DINH = () => ({ muoi: 0, duong: 0, coAxit: false, pH: 6.5, sorbat: 0, benzoat: 0, nhietDo: 25, kin: false });
const PH_NEN = 6.5;
const meThuc = (st) => {
	const cd = st.nv?.coDinh ?? {};
	return { ...st.me, pH: cd.pH ?? (st.me.coAxit ? st.me.pH : (st.me.pHMau ?? PH_NEN)), nhietDo: cd.nhietDo ?? st.me.nhietDo, kin: cd.kin ?? st.me.kin };
};
const tinh = (st) => moPhongBaoQuan(meThuc(st));
const coTrong = (st, mon) =>
	(mon.id === 'muoi' && st.me.muoi > 0) || (mon.id === 'duong' && st.me.duong > 0) || (mon.id === 'axit' && st.me.coAxit) || (mon.id === 'sorbat' && st.me.sorbat > 0) || (mon.id === 'benzoat' && st.me.benzoat > 0);

function doiMe(st, api, chu) {
	const daLam = st.daU || st.daDo.aw || st.daDo.pH;
	Object.assign(st, { daU: false, daDo: { aw: false, pH: false } });
	st.viTri = 'ban';
	if (daLam && chu !== false) api.noi(`${chu ?? ''} Công thức đổi nên đây là <b>lọ mới</b>, phải đo và ủ lại.`);
	else if (chu) api.noi(chu);
}

const TEN_CHAN = { aw: 'aw thấp', pH: 'pH thấp', 'muối': 'muối cao', 'lạnh': 'quá lạnh', 'nóng': 'quá nóng', oxy: 'có oxy', 'chất bảo quản': 'chất bảo quản' };
function diaHTML(ten, moc, chan, mau, sat, seed) {
	let s = seed;
	const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
	const kh = moc ? Array.from({ length: 14 }, () => `<circle cx="${(30 + (r() - 0.5) * 38).toFixed(1)}" cy="${(30 + (r() - 0.5) * 38).toFixed(1)}" r="${(2 + r() * 3.5).toFixed(1)}" style="fill:${mau}"/>`).join('') : '';
	return `<li class="pl-dia${moc ? ' moc' : ''}"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="27" class="dia-vien"/><circle cx="30" cy="30" r="24" class="dia-thach"/>${kh}</svg>
<b>${h(ten)}</b><small>${moc ? (sat ? '⚠ mọc (sát ngưỡng)' : '● mọc') : '✓ chặn: ' + chan.map((c) => TEN_CHAN[c] ?? c).join(', ')}</small></li>`;
}

function viSao(st, kq) {
	const ly = [];
	const moc = kq.ketQua.filter((r) => r.moc);
	ly.push([NHAN_TP.fda, moc.length ? `Còn ${moc.length} mầm bệnh mọc: ${moc.map((r) => r.ngan).join(', ')}. Mỗi loài chỉ cần thiếu một điều kiện là dừng; muốn chặn hết phải chặn được loài khó nhất.` : 'Không mầm bệnh nào mọc: mỗi loài đều bị ít nhất một hàng rào chặn lại.']);
	const lis = kq.ketQua.find((r) => r.id === 'lis');
	if (kq.nhietDo <= 5 && lis.moc) ly.push([NHAN_TP.fda, 'Listeria mọc được cả ở nhiệt độ tủ lạnh (tối thiểu −0,4 °C). Tủ lạnh một mình không đủ: cần thêm muối, aw thấp hoặc pH dưới 4,4.']);
	if (!kq.kin && kq.ketQua.some((r) => r.kyKhi)) ly.push([NHAN_TP.fda, 'Lọ để hở có oxy nên các Clostridium (kỵ khí) không mọc. Đóng hộp kín thì phải tính tới C. botulinum.']);
	ly.push([NHAN_TP.aw, `${kq.awTuMau ? 'aw lấy từ mẫu mang sang' : 'aw ước tính'} ${soCD(kq.aw, 3)}, muối pha nước ${soCD(kq.wps)}%.`]);
	const uc = kq.men.ucChe;
	if (st.me.sorbat || st.me.benzoat) {
		const ct = Object.entries(uc.chiTiet).map(([k, v]) => `${k === 'sorbic' ? 'sorbic' : 'benzoic'}: ${soCD(v.phanHA * 100, 0)}% ở dạng chưa phân ly`).join('; ');
		ly.push([NHAN_TP.axitYeu, `Ở pH ${soCD(kq.pH, 2)}: ${ct}. Chỉ số ức chế nấm men ${soCD(uc.tong, 2)} (từ 1 trở lên là chặn).`]);
		ly.push([NHAN_TP.micMen, 'Hai chất bảo quản dùng chung thì cộng gộp tác dụng (tổng các tỷ lệ nồng độ/MIC).']);
	}
	ly.push([NHAN_TP.men, kq.men.moc ? `Nấm men mọc: aw ${soCD(kq.aw, 2)} vẫn cao hơn ngưỡng ${soCD(AW_MEN, 2)} của mô hình và chưa đủ chất bảo quản.` : `Nấm men bị chặn bởi ${kq.men.chan.join(' và ')}.`]);
	if (kq.ketQua.some((r) => r.sat)) ly.push([NHAN_TP.hangRao, 'Có loài mọc ở sát ngưỡng. Thực tế nhiều yếu tố cùng sát ngưỡng thì vi khuẩn mọc khó hơn, nhưng thiết kế an toàn thì đừng dựa vào điều đó.']);
	ly.push([NHAN_TP.nhietMen, 'Đĩa thạch chỉ cho biết mọc hay không, không cho biết mọc nhanh hay chậm.']);
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-bq', 18, 40, 228, 'Tủ gia vị & bảo quản', TU['tu-bq'].mon);
	const ban = tram('ban', '1 · Bàn pha', `<rect x="60" y="312" width="190" height="13" rx="4" class="may-toi"/><rect x="54" y="306" width="202" height="8" rx="4" class="may"/>`, 60, 354);
	const aw = tram(
		'aw',
		'2 · Máy đo aw',
		`<rect x="300" y="230" width="120" height="95" rx="10" class="may"/><rect x="312" y="242" width="96" height="30" rx="4" class="man-hinh"/><text x="360" y="263" text-anchor="middle" class="man-chu" data-man="aw">aw --</text>
<rect x="330" y="282" width="60" height="30" rx="15" class="may-toi"/><circle cx="404" cy="300" r="5" class="den"/>`,
		300,
		354,
	);
	const ph = tram(
		'ph',
		'3 · Máy đo pH',
		`<rect x="460" y="250" width="86" height="75" rx="8" class="may"/><rect x="470" y="262" width="66" height="28" rx="4" class="man-hinh"/><text x="503" y="282" text-anchor="middle" class="man-chu" data-man="ph">--</text>
<path d="M530 250 q30 -40 40 -10" class="pl-day"/><rect x="564" y="232" width="8" height="70" rx="3" class="may-toi"/>`,
		460,
		354,
	);
	const u = tram(
		'u',
		'4 · Tủ ấm',
		`<rect x="640" y="110" width="200" height="215" rx="10" class="tu"/><rect x="654" y="126" width="172" height="150" rx="6" class="tu-trong sang"/>
<line x1="654" y1="200" x2="826" y2="200" class="ke"/><g data-man="dia"></g>
<rect x="654" y="284" width="172" height="30" rx="4" class="man-hinh"/><text x="740" y="304" text-anchor="middle" class="man-chu" data-man="u">25 °C</text>`,
		640,
		354,
	);
	return `${nenPhong('BÀN BẢO QUẢN')}${tu}${ban}${aw}${ph}${u}`;
};
const vatSVG = () => `<g class="pl-coc pl-lo" tabindex="0" role="button" aria-label="Lọ sản phẩm: kéo thả sang máy"><g class="pl-coc-trong">
<rect x="-40" y="-70" width="80" height="80" fill="transparent"/>
<rect x="-18" y="-56" width="36" height="9" rx="2" class="lo-nap"/>
<path d="M-20 -46 h40 v42 a5 5 0 0 1 -5 5 h-30 a5 5 0 0 1 -5 -5 z" class="coc-vien"/>
<rect x="-18" y="-30" width="36" height="28" rx="3" class="lo-ruot"/>
<rect x="-14" y="-24" width="28" height="12" rx="2" class="nhan-chai"/>
<text x="0" y="-62" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;

const TRAM_BQ = [
	{ id: 'ban', ten: 'Pha lọ', so: 1, viTri: [155, 304], vung: [40, 150, 270, 330] },
	{ id: 'aw', ten: 'Đo aw', so: 2, viTri: [360, 280], vung: [285, 180, 435, 330] },
	{ id: 'ph', ten: 'Đo pH', so: 3, viTri: [503, 246], vung: [450, 180, 600, 330] },
	{ id: 'u', ten: 'Ủ 7 ngày', so: 4, viTri: [740, 196], vung: [630, 100, 850, 330] },
];

export function khoiDongBanBaoQuan(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-bq',
		tt: (st) => {
			const kq = tinh(st);
			const ds = [];
			if (st.me.muoi > 0) ds.push({ k: 'muoi', ten: 'Muối', v: st.me.muoi, dv: 'g/100 g', nhan: 'T' });
			if (st.me.duong > 0) ds.push({ k: 'duong', ten: 'Đường', v: st.me.duong, dv: 'g/100 g', nhan: 'T' });
			ds.push({ k: 'pH', ten: 'pH', v: Math.round(kq.pH * 100) / 100, dv: '', nhan: 'T' });
			ds.push({ k: 'aw', ten: kq.awTuMau ? 'aw (lấy từ mẫu trước)' : 'aw (ước tính)', v: Math.round(kq.aw * 1000) / 1000, dv: '', nhan: 'T' });
			return ds;
		},
		/* Bàn bảo quản đánh giá "hàng rào" cho bất kỳ sản phẩm nào, nên đọc được mọi mẫu có số đo chung (pH, aw, muối),
		   dù mẫu đến từ bàn nhũ tương, mayonnaise, Pickering hay nhũ tương kép. Số do người dùng ghi vào mẫu mang nhãn G. */
		nhanChung(tt, st, mau) {
			const lay = (k) => { const v = tt.find((x) => x.k === k)?.v; return typeof v === 'number' && Number.isFinite(v) ? v : null; };
			const pH = lay('pH'), aw = lay('aw'), muoi = lay('muoi');
			if (pH === null && aw === null && muoi === null)
				return { ok: false, ly: `mẫu từ ${tenBan(mau.ban)} chưa có số đo nào bàn này dùng được. Mở tủ lưu mẫu, ghi pH, aw hoặc muối vào ô “Số đo của bạn” (số thật bạn đo bằng máy ngoài đời), rồi mang sang lại.` };
			const me = MAC_DINH();
			const da = [], chua = [];
			if (muoi !== null) { me.muoi = Math.min(25, Math.max(0, muoi)); da.push(`muối ${soCD(me.muoi)} g/100 g`); }
			if (pH !== null) { me.pHMau = Math.min(7, Math.max(3, pH)); da.push(`pH ${soCD(me.pHMau, 2)}${me.pHMau !== pH ? ` (bàn chỉ nhận pH 3 đến 7; số gốc ${soCD(pH, 2)})` : ''}`); }
			if (aw !== null && aw > 0 && aw <= 1) { me.awDo = aw; da.push(`aw ${soCD(aw, 2)}`); }
			else if (aw !== null) chua.push('aw ngoài khoảng 0 đến 1');
			if (pH === null) chua.push('pH (bàn dùng 6,5 mặc định)');
			if (aw === null) chua.push('aw (bàn tự ước tính từ muối và đường)');
			Object.assign(st, { me, daDo: { aw: false, pH: false }, daU: false });
			return { ok: true, ghiChu: [`Đã đọc: ${da.join(', ')}.`, chua.length ? `Chưa có: ${chua.join('; ')}.` : '', 'Chưa đọc được: đường, chất bảo quản, nhiệt độ trữ; hãy đặt tiếp ở bàn này.'].filter(Boolean) };
		},
		nhanTu: {
			thit(tt, st) {
				const muoi = tt.find((t) => t.k === 'muoi')?.v ?? 0;
				const pH = tt.find((t) => t.k === 'pH')?.v;
				if (typeof pH !== 'number') return { ok: false, ly: 'mẫu thịt không có pH.' };
				Object.assign(st, { me: { ...MAC_DINH(), muoi: Math.min(25, muoi), pHMau: Math.min(7, Math.max(3, pH)) }, daDo: { aw: false, pH: false }, daU: false });
				return {
					ok: true,
					ghiChu: [
						`Đã đọc muối ${soCD(muoi)} g/100 g và pH ${soCD(pH, 2)}.`,
						'Chưa đọc được: phosphat, nitrit và lượng nước thật của thịt (bàn này coi phần còn lại của 100 g là nước, nên muối trong pha nước ở đây thấp hơn thịt thật). Chỉ để học nguyên lý hàng rào.',
					],
				};
			},
			'nau-hoa'(tt, st) {
				const aw = tt.find((t) => t.k === 'aw')?.v;
				if (typeof aw !== 'number') return { ok: false, ly: 'mẫu nâu hóa này không có aw (mẫu chip chỉ có mức giảm acrylamide, bàn này không đọc được).' };
				Object.assign(st, { me: { ...MAC_DINH(), awDo: aw }, daDo: { aw: false, pH: false }, daU: false });
				return {
					ok: true,
					ghiChu: [
						`Đã đọc aw ${soCD(aw, 2)} (số bạn đặt ở bàn nâu hóa, nhãn G).`,
						'Chưa đọc được: pH, muối, đường của bánh quy; bàn dùng pH 6,5 mặc định và muối, đường bằng 0. Hãy đo pH thật nếu có. Đổi muối hoặc đường thì aw mang sang sẽ bị bỏ và tính lại.',
					],
				};
			},
		},
		nhiemVu: NHIEM_VU_BQ,
		nha: 'ban',
		tram: TRAM_BQ,
		tu: TU,
		tenVat: 'Lọ sản phẩm',
		nhanCanh: 'Bàn bảo quản. Bấm tủ để lấy nguyên liệu, kéo lọ sang các máy',
		huongDan: 'Mẹo: mở <b>tủ gia vị & bảo quản</b>, kéo chai thả vào lọ; rồi <b>kéo lọ</b> qua máy đo aw → máy đo pH → tủ ấm. Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn bảo quản đây! Vi khuẩn chỉ mọc khi <b>mọi điều kiện</b> đều vừa ý nó. Thử dựng hàng rào: muối, đường, axit, lạnh, chất bảo quản.',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => {
			const me = cu ? cu.me : MAC_DINH();
			if (!cu && nv?.coDinh?.nhietDo != null) me.nhietDo = nv.coDinh.nhietDo;
			return { me, daDo: { aw: false, pH: false }, daU: false };
		},
		daXong: (st) => ({ ban: coTrong(st, { id: 'muoi' }) || st.me.duong > 0 || st.me.coAxit || st.me.sorbat > 0 || st.me.benzoat > 0, aw: st.daDo.aw, ph: st.daDo.pH, u: st.daU }),
		coTrong,
		cho(st, mon, api) {
			const me = st.me;
			if (mon.id === 'axit' && st.nv?.coDinh?.pH != null) {
				api.noi(`Đề bài không cho thêm chua: pH cố định ${soCD(st.nv.coDinh.pH, 1)}.`, 'lo');
				return false;
			}
			if (mon.id === 'muoi' || mon.id === 'duong') me.awDo = null;
			if (mon.id === 'muoi') me.muoi = me.muoi || 5;
			else if (mon.id === 'duong') me.duong = me.duong || 30;
			else if (mon.id === 'axit') Object.assign(me, { coAxit: true, pH: me.coAxit ? me.pH : 4.5 });
			else if (mon.id === 'sorbat') me.sorbat = me.sorbat || 0.5;
			else if (mon.id === 'benzoat') me.benzoat = me.benzoat || 0.5;
			doiMe(st, api, `Đã cho <b>${h(mon.ten.split(' (')[0])}</b> vào lọ.`);
			return true;
		},
		bo(st, mon, api) {
			const me = st.me;
			if (mon.id === 'axit') Object.assign(me, { coAxit: false, pH: PH_NEN });
			else me[mon.id] = 0;
			if (mon.id === 'muoi' || mon.id === 'duong') me.awDo = null;
			doiMe(st, api);
		},
		theMon: (st, mon) => `<p class="pl-meo">${MO_TA[mon.id] ?? ''}</p>`,
		dich: (st) => {
			const me = meThuc(st);
			const ds = [st.me.muoi && `${soCD(st.me.muoi)} g muối`, st.me.duong && `${soCD(st.me.duong)} g đường`, st.me.coAxit && `axit → pH ${soCD(me.pH, 1)}`, st.me.sorbat && `sorbat ${soCD(st.me.sorbat, 2)} g/kg`, st.me.benzoat && `benzoat ${soCD(st.me.benzoat, 2)} g/kg`].filter(Boolean);
			return `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><rect x="24" y="6" width="42" height="10" rx="2" class="lo-nap"/><path d="M20 16 h50 v54 a6 6 0 0 1 -6 6 h-38 a6 6 0 0 1 -6 -6 z" class="xo-vien"/><rect x="23" y="36" width="44" height="37" rx="4" class="lo-ruot"/></svg><small>${ds.length ? ds.join(' · ') : 'Lọ nền: nước sốt pH 6,5, chưa có gì. Kéo chai thả vào đây.'}</small>`;
		},
		khiToi(st, id, api) {
			const kq = tinh(st);
			if (id === 'aw') {
				api.chay('aw', 900, () => {
					st.daDo.aw = true;
					api.ve();
					api.noi(kq.aw < 0.85 ? `aw = <b>${soCD(kq.aw, 3)}</b>. Khá khô với vi khuẩn rồi đấy!` : `aw = <b>${soCD(kq.aw, 3)}</b>. Vẫn rất "ướt" với vi khuẩn: phần lớn mầm bệnh cần aw từ 0,92 trở lên.`, kq.aw < 0.85 ? 'vui' : '');
				});
			} else if (id === 'ph') {
				st.daDo.pH = true;
				api.ve();
				api.noi(kq.pH < 3.7 ? `pH <b>${soCD(kq.pH, 2)}</b>: thấp hơn mức tối thiểu của mọi mầm bệnh trong bảng FDA.` : kq.pH < 4.6 ? `pH <b>${soCD(kq.pH, 2)}</b>: đã dưới 4,6 nên C. botulinum A không mọc, nhưng vài loài khác vẫn chịu được.` : `pH <b>${soCD(kq.pH, 2)}</b>: gần trung tính, vi khuẩn rất thích.`);
			}
		},
		bang: {
			ban(st) {
				const me = st.me;
				const cd = st.nv?.coDinh ?? {};
				const dong = (mau, ten, lam, thanh) => `<li class="pl-dong-coc"><div class="pl-dong-dau"><span class="pl-cham" style="background:${mau}"></span><b>${ten}</b><button type="button" class="pl-bo" data-lam="${lam}" aria-label="Bỏ ${ten}">✕</button></div>${thanh}</li>`;
				const ds = [];
				if (me.muoi) ds.push(dong('#f4f4f4', 'Muối', 'boMuoi', thanhTruot('muoi', 'Muối trong 100 g', 0.5, 25, 0.5, me.muoi, 'g', (v) => soCD(v))));
				if (me.duong) ds.push(dong('#fbf3df', 'Đường', 'boDuong', thanhTruot('duong', 'Đường trong 100 g', 5, 65, 1, me.duong, 'g', (v) => soCD(v))));
				if (me.coAxit) ds.push(dong('#f6ef9a', 'Axit citric', 'boAxit', thanhTruot('pH', 'Thêm axit tới pH', 3, 6.5, 0.1, me.pH, '', (v) => soCD(v, 1))));
				if (me.sorbat) ds.push(dong('#e8f0f6', 'Kali sorbat', 'boSorbat', thanhTruot('sorbat', 'Sorbat (tính theo sorbic acid)', 0.1, 1, 0.05, me.sorbat, 'g/kg')));
				if (me.benzoat) ds.push(dong('#f0e8f6', 'Natri benzoat', 'boBenzoat', thanhTruot('benzoat', 'Benzoat (tính theo benzoic acid)', 0.1, 1, 0.05, me.benzoat, 'g/kg')));
				return (
					dauBang('Pha lọ sản phẩm', `Lọ nền là nước sốt pH ${soCD(cd.pH ?? me.pHMau ?? PH_NEN, 1)}. Mở tủ, kéo chai thả vào lọ. Chất bảo quản tối đa 1 g/kg trong trò chơi (giới hạn pháp lý theo từng nhóm thực phẩm chưa tra).`, '🫙') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-bq">🧂 Tủ gia vị & bảo quản</button></div>` +
					(ds.length ? `<ul class="pl-ds-coc">${ds.join('')}</ul>` : `<p class="pl-meo">Lọ chưa có gì thêm.</p>`) +
					(cd.kin != null ? `<p class="pl-meo">🔒 Đề bài: lọ ${cd.kin ? 'đóng kín, không có oxy' : 'đã mở nắp, có oxy'}.</p>` : `<label class="pl-chon"><input type="checkbox" data-lam="kin" ${me.kin ? 'checked' : ''}/> Đóng hộp kín (không có oxy, như đồ hộp, túi hút chân không)</label>`) +
					`<p class="pl-ok">Kéo lọ sang máy đo aw, hoặc <button type="button" class="pl-link" data-dua="aw">mang lọ sang máy đo aw</button>.</p>`
				);
			},
			aw(st) {
				const kq = tinh(st);
				return dauBang('Máy đo hoạt độ nước', 'aw = áp suất hơi của mẫu chia cho của nước nguyên chất. Nước cất = 1. aw đo lượng nước vi sinh vật dùng được, khác với độ ẩm.', '💧') +
					(st.daDo.aw
						? `<div class="pl-so-to"><span>${soCD(kq.aw, 3)}</span><small>${kq.awTuMau ? 'aw lấy từ mẫu mang sang' : 'aw ước tính'} ${nhanHTML(NHAN_TP.aw)} · muối pha nước ${soCD(kq.wps)}%</small></div>${thangAw(kq.aw)}<p class="pl-ok">Kéo lọ sang <button type="button" class="pl-link" data-dua="ph">máy đo pH</button>.</p>`
						: `<p class="pl-canh-bao">Kéo lọ thả vào máy, hoặc <button type="button" class="pl-link" data-dua="aw">mang lọ tới đây</button>.</p>`);
			},
			ph(st) {
				const kq = tinh(st);
				return dauBang('Máy đo pH', 'pH càng thấp, càng nhiều vi khuẩn dừng mọc, và chất bảo quản axit yếu càng mạnh.', '🧪') +
					(st.daDo.pH
						? `<div class="pl-so-to"><span>${soCD(kq.pH, 2)}</span><small>pH lọ sản phẩm</small></div>${thangPH(kq)}<p class="pl-ok">Kéo lọ sang <button type="button" class="pl-link" data-dua="u">tủ ấm</button>.</p>`
						: `<p class="pl-canh-bao">Kéo lọ thả vào máy, hoặc <button type="button" class="pl-link" data-dua="ph">mang lọ tới đây</button>.</p>`);
			},
			u(st, api) {
				const kq = tinh(st);
				const cd = st.nv?.coDinh ?? {};
				const T = cd.nhietDo ?? st.me.nhietDo;
				const nutT = cd.nhietDo != null ? `<p class="pl-meo">🔒 Đề bài: ủ ở ${T} °C.</p>` : `<div class="pl-moc" role="group" aria-label="Nhiệt độ ủ"><span>Nhiệt độ:</span>${[4, 10, 25, 30, 37].map((t) => `<button type="button" class="${t === T ? 'dang' : ''}" data-lam="T${t}">${t} °C</button>`).join('')}</div>`;
				let noiDung = '';
				if (st.viTri !== 'u') noiDung = `<p class="pl-canh-bao">Lọ chưa ở tủ ấm. <button type="button" class="pl-link" data-dua="u">Mang lọ tới đây</button>.</p>`;
				else if (!st.daU) noiDung = `<button type="button" class="pl-nut" data-lam="u">🧫 Cấy lên đĩa thạch và ủ 7 ngày</button>`;
				else {
					const sao = st.nv ? api.saoHTML(chamSaoBQ(st.nv, kq, { me: st.me, daDo: st.daDoLucU ?? st.daDo })) : '';
					noiDung = `${sao}<p class="pl-meo">Sau 7 ngày ở ${T} °C, ${kq.kin ? 'đóng kín' : 'có oxy'}: <b>${kq.soMoc}</b>/10 mầm bệnh mọc, nấm men ${kq.men.moc ? '<b>mọc</b>' : 'không mọc'}.</p>
<ul class="pl-ds-dia">${kq.ketQua.map((r, i) => diaHTML(r.ngan, r.moc, r.chan, r.mau, r.sat, 17 + i * 31)).join('')}${diaHTML('Nấm men gây hỏng', kq.men.moc, kq.men.chan, '#f1e4c8', false, 999)}</ul>
<p class="pl-luu-y"><b>Lưu ý:</b> Kết quả chỉ để học nguyên lý hàng rào; aw ở đây là ước tính. Không dùng để quyết định an toàn của sản phẩm thật; việc đó cần đo thật và thử thách vi sinh (challenge test).</p>
${viSao(st, kq)}<button type="button" class="pl-nut" data-lam="lamMoi">Làm lọ mới</button>`;
				}
				return dauBang('Tủ ấm & đĩa thạch', 'Cấy mẫu lên đĩa thạch có từng loài vi khuẩn trong bảng FDA, ủ 7 ngày rồi xem loài nào mọc.', '🧫') + nutT + noiDung;
			},
		},
		doi(st, k, v, api) {
			st.me[k] = v;
			if (k === 'muoi' || k === 'duong') st.me.awDo = null;
			if (st.me.muoi + st.me.duong > 75) st.me[k === 'muoi' ? 'duong' : 'muoi'] = Math.max(0, 75 - v);
			if (st.daU || st.daDo.aw || st.daDo.pH) {
				doiMe(st, api, 'Công thức đã đổi.');
				st.canVeLai = true;
			}
		},
		hienO: (st, k) => ({ muoi: `${soCD(st.me.muoi)} g`, duong: `${soCD(st.me.duong)} g`, pH: soCD(st.me.pH, 1), sorbat: `${soCD(st.me.sorbat, 2)} g/kg`, benzoat: `${soCD(st.me.benzoat, 2)} g/kg` })[k],
		lam: {
			boMuoi: (st, api) => { st.me.muoi = 0; st.me.awDo = null; doiMe(st, api); api.ve(); },
			boDuong: (st, api) => { st.me.duong = 0; st.me.awDo = null; doiMe(st, api); api.ve(); },
			boAxit: (st, api) => { Object.assign(st.me, { coAxit: false, pH: PH_NEN }); doiMe(st, api); api.ve(); },
			boSorbat: (st, api) => { st.me.sorbat = 0; doiMe(st, api); api.ve(); },
			boBenzoat: (st, api) => { st.me.benzoat = 0; doiMe(st, api); api.ve(); },
			kin: (st, api, n) => { st.me.kin = n.checked; doiMe(st, api, false); api.ve(); },
			...Object.fromEntries([4, 10, 25, 30, 37].map((t) => [`T${t}`, (st, api) => { st.me.nhietDo = t; st.daU = false; api.ve(); }])),
			u: (st, api) =>
				api.chay('u', 1800, () => {
					st.daU = true;
					st.daDoLucU = { ...st.daDo };
					api.ve();
					const kq = tinh(st);
					if (st.nv) api.ghiSao(chamSaoBQ(st.nv, kq, { me: st.me, daDo: st.daDoLucU }));
					else api.noi(kq.soMoc || kq.men.moc ? `Ôi, đĩa nổi khuẩn lạc! ${kq.soMoc} mầm bệnh mọc${kq.men.moc ? ', cả nấm men nữa' : ''}. Xem bảng bên cạnh.` : 'Sạch bong! Không có gì mọc cả.', kq.soMoc || kq.men.moc ? 'lo' : 'vui');
				}),
			lamMoi: (st, api) => {
				api.lamMoi(true);
				api.noi('Lọ mới! Công thức giữ nguyên, bạn chỉnh rồi đo và ủ lại nhé.');
			},
		},
		capNhatCanh(st, svg) {
			const kq = tinh(st);
			const lo = svg.querySelector('.pl-lo');
			lo.classList.toggle('trong-tu', st.viTri === 'u' && st.daU);
			lo.querySelector('.lo-ruot').style.fill = st.me.duong > 30 ? '#c4486b' : st.me.coAxit ? '#e0703a' : '#d9a35a';
			svg.querySelector('[data-man="aw"]').textContent = st.daDo.aw && st.viTri === 'aw' ? `aw ${soCD(kq.aw, 3)}` : 'aw --';
			svg.querySelector('[data-man="ph"]').textContent = st.daDo.pH && st.viTri === 'ph' ? soCD(kq.pH, 2) : '--';
			svg.querySelector('[data-man="u"]').textContent = st.daU ? `${kq.nhietDo} °C · 7 ngày` : `${meThuc(st).nhietDo} °C`;
			const dia = svg.querySelector('[data-man="dia"]');
			const ds = st.daU ? [...kq.ketQua.map((r) => [r.moc, r.mau]), [kq.men.moc, '#f1e4c8']] : [];
			dia.innerHTML = ds
				.map(([moc, mau], i) => {
					const x = 672 + (i % 6) * 28, y = i < 6 ? 182 : 256;
					return `<ellipse cx="${x}" cy="${y}" rx="12" ry="5" class="dia-nho"/>${moc ? `<circle cx="${x - 3}" cy="${y - 1}" r="2" style="fill:${mau}"/><circle cx="${x + 4}" cy="${y}" r="1.6" style="fill:${mau}"/>` : ''}`;
				})
				.join('');
		},
	});
}

function thangAw(aw) {
	// thước aw 0,6–1,0 với vạch ngưỡng của từng loài
	const X = (a) => 10 + ((a - 0.6) / 0.4) * 280;
	const vach = [...new Set(MAM_BENH.map((b) => b.awMin))].sort();
	return `<svg class="pl-bieu-do" viewBox="0 0 300 70" role="img" aria-label="aw so với ngưỡng mọc của vi khuẩn">
<rect x="10" y="22" width="280" height="12" rx="6" class="pl-thang"/>
${vach.map((a) => `<line x1="${X(a)}" y1="18" x2="${X(a)}" y2="38" class="pl-vach"/>`).join('')}
<line x1="${X(AW_MEN)}" y1="18" x2="${X(AW_MEN)}" y2="38" class="pl-vach men"/>
<path d="M${X(Math.max(0.6, aw))} 16 l-6 -9 h12 z" class="pl-chi"/>
${[0.6, 0.7, 0.8, 0.9, 1].map((a) => `<text x="${X(a)}" y="52" text-anchor="middle" class="pl-truc">${soCD(a, 1)}</text>`).join('')}
<text x="${X(0.885)}" y="66" text-anchor="middle" class="pl-truc">vạch: ngưỡng aw thấp nhất của từng mầm bệnh (FDA) · vạch vàng: nấm men</text></svg>`;
}
function thangPH(kq) {
	const X = (p) => 10 + ((p - 3) / 4) * 280;
	return `<svg class="pl-bieu-do" viewBox="0 0 300 70" role="img" aria-label="pH so với ngưỡng mọc của vi khuẩn">
<rect x="10" y="22" width="280" height="12" rx="6" class="pl-thang ph"/>
${[...new Set(MAM_BENH.map((b) => b.pHMin))].map((p) => `<line x1="${X(p)}" y1="18" x2="${X(p)}" y2="38" class="pl-vach"/>`).join('')}
<path d="M${X(Math.min(7, Math.max(3, kq.pH)))} 16 l-6 -9 h12 z" class="pl-chi"/>
${[3, 4, 5, 6, 7].map((p) => `<text x="${X(p)}" y="52" text-anchor="middle" class="pl-truc">${p}</text>`).join('')}
<text x="150" y="66" text-anchor="middle" class="pl-truc">vạch: pH thấp nhất mỗi mầm bệnh còn mọc được (FDA)</text></svg>`;
}
