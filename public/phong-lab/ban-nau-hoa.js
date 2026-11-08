// BÀN NÂU HÓA: Maillard và acrylamide. Bàn học nguyên lý, không dự báo cho sản phẩm thật.
// Phần số có nguồn (N) giữ nguyên như đã công bố; đường cong bánh quy là nội suy nhãn T giữa hai đầu khoảng, chỉ trong 165–195 °C.
import { taoBan, h, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong } from './ban-chung.js';
import { moPhongNau, NHAN_NAU, NHIEM_VU_NAU, chamSaoNau, kNoiSuy, eaSuyRa, tienDo, AW_DAI } from './mo-hinh-nau-hoa.js';
import { NAU } from './so-lieu-nau-hoa.js';

const vn = (a) => a.map((x) => String(x).replace('.', ',')).join('–');
const TEN_DUONG = { xylose: 'Xylose', glucose: 'Glucose', fructose: 'Fructose', lactose: 'Lactose', maltose: 'Maltose', sucrose: 'Sucrose' };
const MAU_DUONG = { xylose: '#f3e3c3', glucose: '#f6efe0', fructose: '#f8e6b8', lactose: '#efe9e0', maltose: '#f2ead2', sucrose: '#fbf7ee' };
const TU = {
	'tu-nau': {
		ten: 'Tủ nâu hóa',
		moTa: 'Sáu loại đường (thứ tự tốc độ lên màu theo Buera 1987) và hai điều kiện asparaginase đã công bố. Điều kiện khác đang khóa vì chưa có số.',
		mon: [
			...NAU.thuTuDuong.ds.map((d) => ({ id: `d:${d}`, ten: TEN_DUONG[d], nhan: TEN_DUONG[d].slice(0, 4), mau: MAU_DUONG[d] })),
			{ id: 'e:khoai-tay', ten: 'Asparaginase 1 IU/mL', nhan: 'Asn 1', mau: '#cfe3c4' },
			{ id: 'e:khoai-lang', ten: 'Asparaginase 500 U/mL', nhan: 'Asn 500', mau: '#b9d9b0' },
			{ id: 'khoa:phoi', ten: 'Asparaginase + canxi/phenol', nhan: 'Asn+', mau: '#dfe9d8', khoaMo: 'Tóm tắt cho khoảng giảm 76–93% khi phối canxi hoặc phenol, nhưng không đọc được điều kiện từng số, nên chưa đưa vào bàn.' },
		],
	},
};
const MO_TA = {
	duong: `Đường khử tham gia Maillard với nhóm amin. Ở pH 6, hệ lỏng đường–glycin: xylose lên màu nhanh nhất, sucrose chậm nhất ${nhanHTML(NHAN_NAU.thuTu)}. Bàn này chỉ dùng thứ tự, không có hệ số nhân.`,
	enzyme: `Asparaginase phân hủy asparagine, tiền chất của acrylamide. Mỗi thẻ là đúng một điều kiện đã công bố ${nhanHTML(NHAN_NAU.enzyme)}.`,
};
const moiMe = () => ({ loai: 'banh-quy', duong: 'glucose', aw: 0.6, T: 180, phut: 10, giong: 'Atlantic', enzyme: null, haNhiet: false });
const tinh = (st) => moPhongNau(st.me);
const coTrong = (st, mon) => (mon.id.startsWith('d:') ? st.me.duong === mon.id.slice(2) : mon.id.startsWith('e:') ? st.me.enzyme === mon.id.slice(2) : false);

function datLai(st) {
	Object.assign(st, { daNau: false, daDo: false });
	st.viTri = 'pha';
}

function doThiTienDo(me) {
	const W = 300, H = 150, L = 34, R = 292, T = 10, B = 120;
	const tMax = 30;
	const X = (t) => L + (t / tMax) * (R - L);
	const Y = (f) => B - f * (B - T);
	const kB = kNoiSuy(NAU.banhQuy.kBI, me.T), kA = kNoiSuy(NAU.banhQuy.kAcryl, me.T);
	if (kB == null) return '';
	const duong = (k) => Array.from({ length: 61 }, (_, i) => `${X((i / 60) * tMax).toFixed(1)},${Y(tienDo(k, (i / 60) * tMax)).toFixed(1)}`).join(' ');
	return `<svg class="pl-bieu-do" viewBox="0 0 ${W} ${H}" role="img" aria-label="Độ tiến phản ứng theo thời gian nướng">
<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="pl-truc-duong"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="pl-truc-duong"/>
<polyline points="${duong(kB)}" class="nau-bi"/><polyline points="${duong(kA)}" class="nau-acr"/>
<line x1="${X(me.phut)}" y1="${T}" x2="${X(me.phut)}" y2="${B}" class="pl-vach"/>
${[0, 10, 20, 30].map((t) => `<text x="${X(t)}" y="${B + 13}" text-anchor="middle" class="pl-truc">${t}</text>`).join('')}
${[0, 0.5, 1].map((f) => `<text x="${L - 4}" y="${Y(f) + 3}" text-anchor="end" class="pl-truc">${f}</text>`).join('')}
<text x="${R}" y="${B + 27}" text-anchor="end" class="pl-truc">phút nướng →</text><text x="${L + 3}" y="${T + 8}" class="pl-truc">độ tiến f</text></svg>
<p class="pl-meo"><b class="nau-chu-bi">Chỉ số nâu</b> và <b class="nau-chu-acr">acrylamide</b> ở ${me.T} °C ${nhanHTML(NHAN_NAU.k)}. Vạch: thời gian bạn chọn. f là độ tiến phản ứng bậc 1 (0 → 1), không phải nồng độ.</p>`;
}
function thangAw(aw) {
	const X = (a) => 10 + ((a - 0.3) / 0.7) * 280;
	return `<svg class="pl-bieu-do" viewBox="0 0 300 62" role="img" aria-label="aw so với dải đỉnh nâu hóa">
<rect x="10" y="20" width="280" height="12" rx="6" class="pl-thang"/>
<rect x="${X(AW_DAI[0])}" y="18" width="${X(AW_DAI[1]) - X(AW_DAI[0])}" height="16" class="nau-dai-aw"/>
<path d="M${X(Math.min(1, Math.max(0.3, aw)))} 14 l-6 -9 h12 z" class="pl-chi"/>
${[0.3, 0.5, 0.7, 0.9, 1].map((a) => `<text x="${X(a)}" y="48" text-anchor="middle" class="pl-truc">${soCD(a, 1)}</text>`).join('')}
<text x="${X((AW_DAI[0] + AW_DAI[1]) / 2)}" y="60" text-anchor="middle" class="pl-truc">dải đỉnh nâu hóa ${soCD(AW_DAI[0], 2)}–${soCD(AW_DAI[1], 2)}</text></svg>`;
}
function thangDuong(duong) {
	return `<ol class="nau-thu-tu" aria-label="Thứ tự lên màu từ nhanh đến chậm">${NAU.thuTuDuong.ds.map((d) => `<li class="${d === duong ? 'dang' : ''}">${TEN_DUONG[d]}</li>`).join('')}</ol>
<p class="pl-meo">Nhanh → chậm ${nhanHTML(NHAN_NAU.thuTu)}. Chỉ là thứ tự: bàn không có hệ số nhân cho từng đường.</p>`;
}

function viSao(st, kq) {
	const ly = [];
	if (kq.loai === 'chip') {
		ly.push([NHAN_NAU.chip.ma ? NHAN_NAU.chip : {}, `Hạ nhiệt 190 → 160 °C (7 phút) giảm acrylamide ${Object.entries(NAU.chip.giam).map(([g, v]) => `${v}% (${g})`).join(', ')}. Cùng một cách làm nhưng giống khoai khác nhau cho kết quả khác nhau.`]);
		if (kq.can.some((c) => c.includes('U/mL') || c.includes('IU/mL'))) ly.push([NHAN_NAU.enzyme, 'Mỗi điều kiện enzyme chỉ có một số đã công bố, gắn với đúng điều kiện đó.']);
		if (kq.ngoaiVung) ly.push([{ ma: 'G' }, 'Hạ nhiệt cộng enzyme: <b>ngoài vùng có dữ liệu</b>. Hai số không được cộng hay nhân vì chưa có phép đo kết hợp.']);
	} else {
		ly.push([NHAN_NAU.banhQuy, `Khoảng k đã công bố: chỉ số nâu ${vn(NAU.banhQuy.kBI)} /phút, acrylamide ${vn(NAU.banhQuy.kAcryl)} /phút, trong 165–195 °C.`]);
		ly.push([NHAN_NAU.khongKhop, `Hai đầu khoảng k ngụ ý Ea khoảng ${soCD(eaSuyRa(NAU.banhQuy.kBI), 0)} kJ/mol, còn tóm tắt ghi Ea ${vn(NAU.banhQuy.EaBI)} kJ/mol cho chỉ số nâu. Hai con số không khớp, nên khoảng này có lẽ gộp nhiều điều kiện; vì vậy đường cong chỉ nội suy giữa hai đầu và không dùng Ea.`]);
		ly.push([NHAN_NAU.awDinh, `Đỉnh nâu hóa nằm ở aw trung gian (${vn(AW_DAI)} tùy nhiệt độ thử), không phải khô hẳn hay quá ướt. Bàn không biết số nào ứng với nhiệt độ nào.`]);
		if (kq.trongDaiAw) ly.push([NHAN_NAU.awDinh, `aw ${soCD(kq.aw, 2)} đang nằm trong dải đỉnh.`]);
		ly.push([NHAN_NAU.thuTu, 'Thứ tự đường chỉ ảnh hưởng thông điệp, không làm đường cong dịch chuyển, vì chưa có hệ số nhân đã công bố cho bánh quy.']);
	}
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>
<p class="pl-luu-y"><b>Lưu ý:</b> bàn học nguyên lý. Số của từng nghiên cứu gắn với đúng điều kiện của nghiên cứu đó; không dùng để dự báo acrylamide của sản phẩm thật, việc đó cần đo thật.</p>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-nau', 18, 40, 228, 'Tủ nâu hóa', TU['tu-nau'].mon);
	const pha = tram('pha', '1 · Bàn pha', `<rect x="60" y="312" width="190" height="13" rx="4" class="may-toi"/><rect x="54" y="306" width="202" height="8" rx="4" class="may"/>`, 60, 354);
	const nau = tram('nau', '2 · Lò / chảo', `<rect x="330" y="150" width="210" height="175" rx="12" class="tu"/><rect x="346" y="168" width="178" height="110" rx="6" class="tu-trong sang"/><line x1="346" y1="222" x2="524" y2="222" class="ke"/><rect x="346" y="288" width="178" height="26" rx="4" class="man-hinh"/><text x="435" y="306" text-anchor="middle" class="man-chu" data-man="nau">-- °C</text>`, 330, 354);
	const lab = tram('do', '3 · Máy đo', `<rect x="620" y="205" width="150" height="120" rx="10" class="may"/><rect x="634" y="217" width="122" height="44" rx="4" class="man-hinh"/><text x="695" y="245" text-anchor="middle" class="man-chu" data-man="do">--</text>`, 620, 354);
	return `${nenPhong('BÀN NÂU HÓA')}${tu}${pha}${nau}${lab}`;
};
const vatSVG = () => `<g class="pl-coc pl-lo" tabindex="0" role="button" aria-label="Mẫu: kéo thả sang máy"><g class="pl-coc-trong">
<rect x="-40" y="-70" width="80" height="80" fill="transparent"/>
<path d="M-24 -30 h48 l-6 30 h-36 z" class="coc-vien"/><rect x="-20" y="-26" width="40" height="18" rx="3" class="lo-ruot"/>
<text x="0" y="-40" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;
const TRAM_NAU = [
	{ id: 'pha', ten: 'Pha', so: 1, viTri: [155, 304], vung: [40, 150, 270, 330] },
	{ id: 'nau', ten: 'Nướng', so: 2, viTri: [435, 222], vung: [315, 140, 555, 330] },
	{ id: 'do', ten: 'Đo', so: 3, viTri: [695, 280], vung: [605, 190, 785, 330] },
];

export function khoiDongBanNauHoa(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-nau',
		tt: (st) => {
			const kq = tinh(st);
			if (kq.loai === 'chip') return kq.giam != null && st.daDo ? [{ k: 'giamAcryl', ten: 'Acrylamide giảm so với chiên 190 °C', v: kq.giam, dv: '%', nhan: 'N' }] : [];
			const ds = [{ k: 'aw', ten: 'aw (bạn đặt cho bột)', v: Math.round(kq.aw * 100) / 100, dv: '', nhan: 'G' }];
			if (st.daNau && !kq.ngoaiVung) {
				ds.push({ k: 'nhietNuong', ten: 'Nhiệt độ nướng', v: kq.T, dv: '°C', nhan: 'T' });
				ds.push({ k: 'chiSoNau', ten: 'Độ tiến chỉ số nâu f', v: Math.round(kq.BI * 100) / 100, dv: '', nhan: 'T' });
			}
			return ds;
		},
		nhiemVu: NHIEM_VU_NAU,
		nha: 'pha',
		tram: TRAM_NAU,
		tu: TU,
		tenVat: 'Mẫu',
		nhanCanh: 'Bàn nâu hóa. Bấm tủ để lấy đường hoặc enzyme, kéo mẫu sang lò rồi sang máy đo',
		huongDan: 'Mẹo: chọn <b>bánh quy</b> hoặc <b>chip</b> ở bàn pha, mở <b>tủ</b> lấy đường hoặc asparaginase, kéo mẫu sang <b>lò</b>, rồi sang <b>máy đo</b>. Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn nâu hóa đây! Mỗi số ở đây gắn với <b>đúng điều kiện của nghiên cứu</b> đã đo nó. Số không có thì bàn nói thẳng là <b>ngoài vùng có dữ liệu</b>.',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => {
			const me = cu ? cu.me : moiMe();
			if (!cu && nv) {
				if (nv.id === 'chip-it-acrylamide' || nv.id === 'khoai-lang-enzyme') me.loai = 'chip';
				if (nv.id === 'chip-it-acrylamide') me.haNhiet = false;
			}
			return { me, daNau: false, daDo: false };
		},
		daXong: (st) => ({ pha: true, nau: st.daNau, do: st.daDo }),
		coTrong,
		cho(st, mon, api) {
			if (mon.id.startsWith('d:')) {
				if (st.me.loai === 'chip') api.noi('Chip chiên ở đây không đổi đường: số có nguồn chỉ cho hạ nhiệt và enzyme. Chuyển sang <b>bánh quy</b> để thử đường.', 'lo');
				st.me.duong = mon.id.slice(2);
			} else {
				if (st.me.loai !== 'chip') st.me.loai = 'chip';
				st.me.enzyme = mon.id.slice(2);
			}
			datLai(st);
			api.noi(`Đã lấy <b>${h(mon.ten)}</b>.`);
			return true;
		},
		bo(st, mon) {
			if (mon.id.startsWith('d:')) st.me.duong = 'glucose';
			else st.me.enzyme = null;
			datLai(st);
		},
		theMon: (st, mon) => `<p class="pl-meo">${mon.id.startsWith('d:') ? MO_TA.duong : MO_TA.enzyme}${mon.id.startsWith('e:') ? ` Điều kiện đã công bố: ${NAU.enzyme.ds[mon.id.slice(2)].dk}; giảm ${soCD(NAU.enzyme.ds[mon.id.slice(2)].giam, 1)}%.` : ''}</p>`,
		dich: (st) => {
			const me = st.me;
			const ds = [me.loai === 'chip' ? `chip ${me.giong}` : `bánh quy, ${TEN_DUONG[me.duong]}, aw ${soCD(me.aw, 2)}`, me.enzyme && NAU.enzyme.ds[me.enzyme].ten, me.haNhiet && 'hạ nhiệt'].filter(Boolean);
			return `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><path d="M14 30 h62 l-8 40 h-46 z" class="xo-vien"/><rect x="20" y="42" width="50" height="22" class="xo-nuoc"/></svg><small>${ds.join(' · ')}</small>`;
		},
		choToi(st, id) {
			if (id === 'do' && !st.daNau) return 'Chưa có gì để đo. Sang <b>lò</b> trước đã.';
			return null;
		},
		khiToi(st, id, api) {
			if (id === 'do') {
				st.daDo = true;
				api.ve();
				const kq = tinh(st);
				if (st.nv) api.ghiSao(chamSaoNau(st.nv, kq, st));
				else if (kq.ngoaiVung) api.noi('Cấu hình này <b>ngoài vùng có dữ liệu</b>, bàn không đoán.', 'lo');
			}
		},
		bang: {
			pha(st) {
				const me = st.me;
				const khoa = st.nv ? 'Đề bài đã chọn loại mẫu; bạn vẫn đổi được nếu muốn thử.' : '';
				const loai = `<div class="pl-moc" role="group" aria-label="Loại mẫu"><span>Mẫu:</span><button type="button" class="${me.loai === 'banh-quy' ? 'dang' : ''}" data-lam="loaiBanhQuy">🍪 Bánh quy</button><button type="button" class="${me.loai === 'chip' ? 'dang' : ''}" data-lam="loaiChip">🥔 Chip chiên</button></div>`;
				const rieng = me.loai === 'chip'
					? `<div class="pl-moc" role="group" aria-label="Giống khoai"><span>Giống:</span>${Object.keys(NAU.chip.giam).map((g) => `<button type="button" class="${me.giong === g ? 'dang' : ''}" data-lam="giong${g}">${g}</button>`).join('')}</div>
<p class="pl-meo">Giống ảnh hưởng mức giảm đã đo ${nhanHTML(NHAN_NAU.chip)}. ${me.enzyme ? `Đã lấy ${h(NAU.enzyme.ds[me.enzyme].ten)} (${NAU.enzyme.ds[me.enzyme].dk}).` : 'Chưa lấy enzyme.'}</p>`
					: thanhTruot('aw', 'Hoạt độ nước aw của bột', 0.3, 0.95, 0.01, me.aw, '', (v) => soCD(v, 2)) + `<p class="pl-meo">Đường đang dùng: <b>${TEN_DUONG[me.duong]}</b>. Mở tủ để đổi.</p>`;
				return (
					dauBang('Bàn pha', 'Chọn loại mẫu, lấy đường hoặc enzyme từ tủ. ' + khoa, '🍪') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-nau">🧂 Tủ nâu hóa</button></div>` +
					loai + rieng +
					`<p class="pl-ok">Kéo mẫu sang lò, hoặc <button type="button" class="pl-link" data-dua="nau">mang mẫu sang lò</button>.</p>`
				);
			},
			nau(st, api) {
				const me = st.me;
				let dk;
				if (me.loai === 'chip') {
					dk = `<div class="pl-moc" role="group" aria-label="Cách chiên"><span>Chiên:</span><button type="button" class="${!me.haNhiet ? 'dang' : ''}" data-lam="chien190">Giữ 190 °C (mốc so sánh)</button><button type="button" class="${me.haNhiet ? 'dang' : ''}" data-lam="chienHa">Hạ nhiệt 190 → 160 °C, 7 phút</button></div>`;
				} else {
					dk = thanhTruot('T', 'Nhiệt độ lò', 160, 200, 5, me.T, '°C', (v) => String(v)) + thanhTruot('phut', 'Thời gian nướng', 2, 30, 1, me.phut, 'phút', (v) => String(v)) +
						`<p class="pl-meo">Số k chỉ có trong 165–195 °C; ngoài khoảng đó bàn báo <b>ngoài vùng có dữ liệu</b> ${nhanHTML(NHAN_NAU.banhQuy)}.</p>`;
				}
				let nd;
				if (st.viTri !== 'nau') nd = `<p class="pl-canh-bao">Mẫu chưa ở lò. <button type="button" class="pl-link" data-dua="nau">Mang mẫu tới đây</button>.</p>`;
				else if (!st.daNau) nd = `<button type="button" class="pl-nut" data-lam="nau">🔥 ${me.loai === 'chip' ? 'Chiên' : 'Nướng'}</button>`;
				else nd = `<p class="pl-ok">Xong. Kéo mẫu sang <button type="button" class="pl-link" data-dua="do">máy đo</button>.</p>`;
				return dauBang('Lò / chảo', 'Nhiệt độ và thời gian quyết định độ tiến của phản ứng nâu hóa.', '🔥') + dk + nd;
			},
			do(st, api) {
				if (!st.daDo) return dauBang('Máy đo', 'Đọc chỉ số nâu và acrylamide của mẫu.', '📈') + `<p class="pl-canh-bao">Kéo mẫu thả vào máy đo.</p>`;
				const kq = tinh(st);
				const sao = st.nv ? api.saoHTML(chamSaoNau(st.nv, kq, st)) : '';
				let nd;
				if (kq.loai === 'chip') {
					nd = kq.giam != null
						? `<div class="pl-so-to"><span>−${soCD(kq.giam, 1)}%</span><small>acrylamide so với chiên 190 °C ${nhanHTML(kq.can.some((c) => c.includes('hạ nhiệt')) ? NHAN_NAU.chip : NHAN_NAU.enzyme)}</small></div><p class="pl-meo">Cách làm: ${kq.can.join(' + ')}${kq.can.some((c) => c.includes('hạ nhiệt')) ? `, giống ${kq.giong}` : ''}.</p>`
						: kq.ngoaiVung
							? `<p class="pl-canh-bao"><b>Ngoài vùng có dữ liệu.</b> Hạ nhiệt cộng enzyme chưa có phép đo kết hợp, bàn không cộng hay nhân hai số.</p>`
							: `<div class="pl-so-to"><span>0%</span><small>Chiên 190 °C là mốc so sánh, chưa có can thiệp nào</small></div>`;
				} else if (kq.ngoaiVung) {
					nd = `<p class="pl-canh-bao"><b>Ngoài vùng có dữ liệu:</b> số k chỉ có trong ${NAU.banhQuy.T.join('–')} °C, bạn chọn ${kq.T} °C. Bàn không ngoại suy.</p>`;
				} else {
					nd = `<div class="pl-so-lon"><div><span>Chỉ số nâu f</span><b>${soCD(kq.BI, 2)}</b></div><div><span>Acrylamide f</span><b>${soCD(kq.acryl, 2)}</b></div><div><span>k chỉ số nâu</span><b>${soCD(kq.kBI, 3)}</b><small>/phút</small></div></div>
<p class="pl-meo">f là độ tiến phản ứng bậc 1 ${nhanHTML(NHAN_NAU.k)}. Ở ${kq.T} °C, ${kq.phut} phút. Không phải nồng độ acrylamide thật.</p>${doThiTienDo(st.me)}${thangAw(kq.aw)}${thangDuong(st.me.duong)}`;
				}
				return dauBang('Kết quả', 'Số có nguồn giữ nguyên điều kiện đã công bố.', '📈') + sao + nd + viSao(st, kq) + `<button type="button" class="pl-nut" data-lam="lamMoi">Làm mẫu mới</button>`;
			},
		},
		doi(st, k, v, api) {
			st.me[k] = v;
			if (st.daNau || st.daDo) {
				datLai(st);
				st.canVeLai = true;
				api.noi('Điều kiện đổi nên làm <b>mẫu mới</b>.');
			}
		},
		hienO: (st, k) => ({ aw: soCD(st.me.aw, 2), T: `${st.me.T} °C`, phut: `${st.me.phut} phút` })[k],
		lam: {
			loaiBanhQuy: (st, api) => { Object.assign(st.me, { loai: 'banh-quy', enzyme: null, haNhiet: false }); datLai(st); api.ve(); },
			loaiChip: (st, api) => { st.me.loai = 'chip'; datLai(st); api.ve(); },
			...Object.fromEntries(Object.keys(NAU.chip.giam).map((g) => [`giong${g}`, (st, api) => { st.me.giong = g; datLai(st); api.ve(); }])),
			chien190: (st, api) => { st.me.haNhiet = false; datLai(st); api.ve(); },
			chienHa: (st, api) => { st.me.haNhiet = true; datLai(st); api.ve(); },
			nau: (st, api) => api.chay('nau', 1500, () => {
				st.daNau = true;
				api.ve();
				api.noi(st.me.loai === 'chip' ? 'Chiên xong! Kéo sang <b>máy đo</b>.' : 'Nướng xong! Kéo sang <b>máy đo</b>.', 'vui');
			}),
			lamMoi: (st, api) => { api.lamMoi(true); api.noi('Mẫu mới. Điều kiện vẫn giữ, bạn chỉnh rồi làm lại nhé.'); },
		},
		capNhatCanh(st, svg) {
			const kq = tinh(st);
			const lo = svg.querySelector('.pl-lo');
			lo.classList.toggle('trong-tu', st.viTri === 'nau' && st.daNau);
			lo.querySelector('.lo-ruot').style.fill = !st.daNau ? '#f0dcae' : kq.loai === 'chip' ? '#c58d3a' : `hsl(30 ${50 + (kq.BI ?? 0) * 30}% ${72 - (kq.BI ?? 0) * 42}%)`;
			svg.querySelector('[data-man="nau"]').textContent = st.me.loai === 'chip' ? (st.me.haNhiet ? '190→160 °C' : '190 °C') : `${st.me.T} °C`;
			svg.querySelector('[data-man="do"]').textContent = st.daDo ? (kq.loai === 'chip' ? (kq.giam != null ? `−${soCD(kq.giam, 0)}%` : '--') : kq.ngoaiVung ? 'ngoài vùng' : `f ${soCD(kq.BI, 2)}`) : '--';
		},
	});
}
