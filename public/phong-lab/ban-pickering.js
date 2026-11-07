// BÀN PICKERING: chọn hạt → đọc θ kèm phương pháp đo → tính năng lượng giải hấp → xem loại nhũ tương.
// Dùng lại công thức của máy tính Pickering (cong-thuc.js). Mọi θ lấy từ so-lieu-ban-moi.js, luôn hiện kèm phương pháp đo.
import { taoBan, h, so, soCD, nhanHTML, thanhTruot, dauBang, tram, tuTreo, nenPhong } from './ban-chung.js';
import { moPhongPickering, hatTheoId, soSanhTheta, laThetaDauNuoc, chamSaoPickering, NHIEM_VU_PICKERING, NHAN_MOI } from './mo-hinh-ban-moi.js';
import { HAT, PP_DO, GAMMA_OW, NGUONG_BAM_KT, D_THU_NM } from './so-lieu-ban-moi.js';

const MAU_HAT = { 'chua-kiem': '#e9dfc6', 'khong-khi': '#f3e3a5', 'duoi-dau': '#d8c28a', xrr: '#c9d4dd' };
const TU = {
	'tu-hat': {
		ten: 'Tủ hạt',
		moTa: 'Mỗi hạt có một số θ từ bài báo. Đọc kỹ phương pháp đo: θ đo trong không khí không phải θ dầu–nước.',
		mon: [
			...HAT.map((x) => ({ id: x.id, ten: x.ten, nhan: x.id.startsWith('osa') ? 'OSA' : x.id.startsWith('wpi') ? 'WPI' : x.id.startsWith('zein') ? 'Zein' : 'SiO₂', mau: MAU_HAT[x.pp] })),
			{ id: 'khoa:silica', ten: 'Silica trần, silica silane hóa', nhan: 'SiO₂', mau: '#e6e6e6', khoaMo: 'Chưa có số θ theo %SiOH đã kiểm (Binks & Lumsdon 2000 cần toàn văn). Silica trần còn không hấp phụ vào mặt phân cách trong nghiên cứu Smits 2022.' },
			{ id: 'khoa:cellulose', ten: 'Nano-cellulose, chitin', nhan: 'CNC', mau: '#eef0dc', khoaMo: 'Chưa có số θ đã kiểm.' },
		],
	},
};
const D_MAC_DINH = D_THU_NM.gia_tri;
const moi = () => ({ hat: null, dNm: D_MAC_DINH, soVoi: null });
const tinh = (st) => (st.me.hat ? moPhongPickering({ hat: st.me.hat, dNm: st.me.dNm }) : null);
const nguonLK = (x) => x.nguon.map((k) => `<a href="/nhu-tuong/nguon/#${k}">${h(k)}</a>`).join(', ');
const CANH_BAO_MEM = `${nhanHTML(NHAN_MOI.hatMem)} <b>Microgel và protein không có góc tiếp xúc cố định</b>: hạt mềm đổi hình khi hấp phụ, nên ΔE chỉ để minh họa.`;

function theTheta(x) {
	return `<div class="pl-so-to"><span>${soCD(x.theta, 2)}°</span><small>θ của ${h(x.ten)}</small></div>
<p class="pick-pp ${laThetaDauNuoc(x) ? 'dung' : 'luu-y'}"><b>Cách đo:</b> ${h(PP_DO[x.pp])}</p>
<p class="pl-meo">${nhanHTML({ ma: x.nhan })} Mức tin cậy: ${h(x.chac)}. Nguồn: ${nguonLK(x)}. ${h(x.ghiChu)}</p>
${x.mem ? `<p class="pl-luu-y">${CANH_BAO_MEM}</p>` : ''}`;
}

function viSao(st, kq) {
	const x = kq.hat;
	const ly = [];
	ly.push([NHAN_MOI.deltaE, `Với r = ${so(kq.rNm, 3)} nm, γ = ${GAMMA_OW.gia_tri} mN/m, θ = ${soCD(x.theta, 2)}°: ΔE ≈ ${so(kq.kT, 3)} kT. θ càng gần 90° và hạt càng to thì càng khó bứt ra.`]);
	ly.push([NHAN_MOI.loaiNhu, kq.loai === 'trung gian' ? 'θ = 90°: hạt thấm ướt như nhau bởi dầu và nước, không nghiêng về loại nào.' : `θ ${x.theta < 90 ? 'dưới' : 'trên'} 90° nên thuận lợi cho nhũ tương ${kq.loai}.`]);
	if (x.mem) ly.push([NHAN_MOI.hatMem, 'Murray 2019 chỉ xem là "Pickering thật" các vật liệu có mô đun cắt hoặc Young trên khoảng 0,1 MPa.']);
	if (!laThetaDauNuoc(x)) ly.push([{ ma: 'G' }, 'θ này không đo tại mặt phân cách dầu–nước (hoặc chưa rõ cách đo), nên ΔE chỉ cho thấy xu hướng.']);
	if (!x.thucPham) ly.push([NHAN_MOI.hatVoCo, 'Silica gắn amin không dùng được cho thực phẩm. Hạt 19 nm θ 22° có ΔE chỉ cỡ chục kT: chuyển động nhiệt có thể bứt nó ra.']);
	return `<h4>Vì sao?</h4><ul class="pl-vi-sao">${ly.map(([n, t]) => `<li>${nhanHTML(n)} ${t}</li>`).join('')}</ul>`;
}

const canhSVG = () => {
	const tu = tuTreo('tu-hat', 18, 40, 200, 'Tủ hạt', TU['tu-hat'].mon);
	const chon = tram('ke', '1 · Khay hạt', `<rect x="70" y="300" width="130" height="25" rx="4" class="may"/><g>${Array.from({ length: 9 }, (_, i) => `<circle cx="${84 + i * 13}" cy="${293 - (i % 2) * 6}" r="5" class="pick-hat"/>`).join('')}</g>`, 66, 354);
	const goc = tram('goc', '2 · Máy đo góc', `<rect x="290" y="220" width="130" height="105" rx="10" class="may"/><rect x="304" y="232" width="102" height="52" rx="4" class="man-hinh"/><path d="M318 270 h74" class="pick-mat"/><path d="M336 270 a20 20 0 0 1 38 0" class="pick-giot"/><text x="355" y="312" text-anchor="middle" class="so-can" data-man="theta">--</text>`, 286, 354);
	const tinhMay = tram('tinh', '3 · Tính ΔE', `<rect x="510" y="230" width="130" height="95" rx="10" class="may"/><rect x="524" y="242" width="102" height="34" rx="4" class="man-hinh"/><text x="575" y="264" text-anchor="middle" class="man-chu" data-man="de">-- kT</text><circle cx="540" cy="302" r="6" class="den"/>`, 506, 354);
	const ong = tram('ong', '4 · Nhũ tương', `<rect x="750" y="195" width="100" height="130" rx="10" class="may"/><rect x="764" y="207" width="72" height="104" rx="6" class="tu-trong"/><rect x="772" y="225" width="56" height="78" rx="4" class="pick-nhu"/>`, 736, 354);
	return `${nenPhong('PICKERING')}${tu}${chon}${goc}${tinhMay}${ong}`;
};
const vatSVG = () => `<g class="pl-coc pl-coc-pick" tabindex="0" role="button" aria-label="Lọ hạt: kéo thả sang máy"><g class="pl-coc-trong"><rect x="-30" y="-56" width="60" height="62" fill="transparent"/><rect x="-16" y="-40" width="32" height="42" rx="5" class="coc-vien"/><rect x="-12" y="-48" width="24" height="9" rx="2" class="may-toi"/><g>${[-8, 0, 8, -4, 4].map((x, i) => `<circle cx="${x}" cy="${-6 - (i > 2 ? 8 : 0)}" r="3.5" class="pick-hat"/>`).join('')}</g><text x="0" y="-52" text-anchor="middle" class="coc-goi-y">kéo tôi</text></g></g>`;
const TRAM = [
	{ id: 'ke', ten: 'Chọn hạt', so: 1, viTri: [135, 270], vung: [50, 180, 225, 335] },
	{ id: 'goc', ten: 'Đo góc', so: 2, viTri: [355, 212], vung: [270, 170, 440, 335] },
	{ id: 'tinh', ten: 'Tính ΔE', so: 3, viTri: [575, 222], vung: [490, 170, 660, 335] },
	{ id: 'ong', ten: 'Nhũ tương', so: 4, viTri: [800, 300], vung: [720, 170, 880, 335] },
];

export function khoiDongBanPickering(goc) {
	return taoBan(goc, {
		khoaSao: 'pl:sao-pick',
		nhiemVu: NHIEM_VU_PICKERING,
		nha: 'ke',
		tram: TRAM,
		tu: TU,
		tenVat: 'Lọ hạt',
		nhanCanh: 'Bàn Pickering. Bấm tủ để chọn hạt, kéo lọ hạt sang các máy',
		huongDan: 'Mẹo: mở <b>tủ hạt</b> chọn một loại; kéo lọ qua <b>máy đo góc</b> → <b>tính ΔE</b> → <b>nhũ tương</b>. Luôn đọc dòng "Cách đo". Trên điện thoại có thể bấm thay vì kéo.',
		chao: 'Bàn Pickering đây! Hạt rắn bám vào giọt thay chất nhũ hóa. <b>Hạt nào bám chặt, và số θ của nó đo bằng cách nào?</b>',
		canh: canhSVG,
		vat: vatSVG,
		moi: (nv, cu) => ({ me: cu ? cu.me : moi(), daDoGoc: false, daTinh: false, daXem: false }),
		daXong: (st) => ({ ke: !!st.me.hat, goc: st.daDoGoc, tinh: st.daTinh, ong: st.daXem }),
		coTrong: (st, mon) => st.me.hat === mon.id,
		cho(st, mon, api) {
			const x = hatTheoId(mon.id);
			if (st.me.hat && st.me.hat !== mon.id) st.me.soVoi = st.me.hat;
			st.me.hat = mon.id;
			st.me.dNm = x.d_nm ?? D_MAC_DINH;
			Object.assign(st, { daDoGoc: false, daTinh: false, daXem: false, viTri: 'ke' });
			api.noi(`Đã chọn <b>${h(x.ten)}</b>. Kéo lọ sang máy đo góc.`);
			return true;
		},
		bo(st) {
			st.me.hat = null;
			Object.assign(st, { daDoGoc: false, daTinh: false, daXem: false, viTri: 'ke' });
		},
		theMon: (st, mon) => {
			const x = hatTheoId(mon.id);
			return x ? `<p class="pl-meo">θ = ${soCD(x.theta, 2)}°. ${h(PP_DO[x.pp])}.</p><p class="pl-meo">${h(x.ghiChu)}</p>` : '';
		},
		dich: (st) => `<svg viewBox="0 0 90 80" class="pl-coc-nho" aria-hidden="true"><rect x="22" y="14" width="46" height="60" rx="6" class="xo-vien"/></svg><small>${st.me.hat ? h(hatTheoId(st.me.hat).ten) : 'Chưa chọn hạt. Kéo chai thả vào đây.'}</small>`,
		choToi(st, id) {
			if (id !== 'ke' && !st.me.hat) return 'Chọn một loại hạt trong tủ trước đã.';
			if (id === 'tinh' && !st.daDoGoc) return 'Đọc <b>góc tiếp xúc</b> trước đã.';
			if (id === 'ong' && !st.daTinh) return 'Tính <b>ΔE</b> trước đã.';
			return null;
		},
		khiToi(st, id, api) {
			if (id === 'goc') {
				st.daDoGoc = true;
				api.ve();
				const x = hatTheoId(st.me.hat);
				api.noi(laThetaDauNuoc(x) ? `θ = ${soCD(x.theta, 2)}°, đo tại mặt phân cách dầu–nước.` : `θ = ${soCD(x.theta, 2)}°, nhưng <b>chưa phải θ dầu–nước</b>. Đọc dòng "Cách đo".`, laThetaDauNuoc(x) ? 'vui' : 'lo');
			} else if (id === 'tinh') {
				st.daTinh = true;
				api.ve();
			} else if (id === 'ong') {
				st.daXem = true;
				api.ve();
				if (st.nv) api.ghiSao(chamSaoPickering(st.nv, tinh(st)));
			}
		},
		bang: {
			ke(st) {
				return dauBang('Khay hạt', 'Chọn một loại hạt. Số θ đều lấy từ bài báo, không nội suy theo mức thế.', '🧂') +
					`<div class="pl-nut-tu"><button type="button" class="pl-nut-tu-1" data-mo-tu="tu-hat">🧂 Tủ hạt</button></div>` +
					(st.me.hat ? `<p class="pl-ok">Đang dùng: <b>${h(hatTheoId(st.me.hat).ten)}</b>. <button type="button" class="pl-link" data-dua="goc">Mang sang máy đo góc</button>.</p>` : `<p class="pl-canh-bao">Chưa chọn hạt.</p>`);
			},
			goc(st) {
				if (!st.me.hat || !st.daDoGoc) return dauBang('Máy đo góc', 'Đọc θ của hạt kèm cách đo.', '📐') + `<p class="pl-canh-bao">Kéo lọ hạt thả vào máy, hoặc <button type="button" class="pl-link" data-dua="goc">mang lọ tới đây</button>.</p>`;
				const x = hatTheoId(st.me.hat);
				let soVoi = '';
				if (st.me.soVoi && st.me.soVoi !== st.me.hat) {
					const y = hatTheoId(st.me.soVoi);
					soVoi = soSanhTheta(x, y) ? `<p class="pl-ok">Cùng cách đo với ${h(y.ten)} (θ ${soCD(y.theta, 2)}°): so sánh được.</p>` : `<p class="pl-canh-bao"><b>Không so sánh trực tiếp</b> với ${h(y.ten)} (θ ${soCD(y.theta, 2)}°): khác cách đo hoặc chưa rõ cách đo.</p>`;
				}
				return dauBang('Máy đo góc', 'θ quyết định hạt nằm ở đâu trên mặt phân cách.', '📐') + theTheta(x) + soVoi + `<p class="pl-ok"><button type="button" class="pl-link" data-dua="tinh">Mang sang tính ΔE</button>.</p>`;
			},
			tinh(st) {
				if (!st.daTinh) return dauBang('Tính năng lượng giải hấp', 'ΔE = πr²γ(1 − |cos θ|)²', '🧮') + `<p class="pl-canh-bao">Kéo lọ hạt thả vào đây.</p>`;
				const kq = tinh(st);
				const x = kq.hat;
				return dauBang('Tính năng lượng giải hấp', 'ΔE = πr²γ(1 − |cos θ|)²', '🧮') +
					thanhTruot('dNm', x.d_nm ? 'Cỡ hạt (bài báo nêu, chỉnh để thử)' : 'Cỡ hạt (bài chưa cho số, tự chọn để thử)', 10, 10000, 1, st.me.dNm, 'nm', (v) => so(v, 4)) +
					`<div class="pl-so-to"><span data-so="kT">${so(kq.kT, 3)}</span><small>kT${kq.minhHoa ? ' · chỉ minh họa' : ''}</small></div>
<p class="pl-meo">γ = ${GAMMA_OW.gia_tri} mN/m ${nhanHTML({ ma: GAMMA_OW.nhan })} (TAG lỏng với nước, McClements 2016, Table 5.1, tr.188; phụ thuộc mạnh vào loại dầu).</p>
<p class="pick-pp ${laThetaDauNuoc(x) ? 'dung' : 'luu-y'}"><b>Cách đo θ:</b> ${h(PP_DO[x.pp])}</p>${x.mem ? `<p class="pl-luu-y">${CANH_BAO_MEM}</p>` : ''}` +
					`<p class="pl-ok"><button type="button" class="pl-link" data-dua="ong">Mang sang tạo nhũ tương</button>.</p>`;
			},
			ong(st, api) {
				if (!st.daXem) return dauBang('Nhũ tương', 'Hạt thuận lợi cho loại nhũ tương nào?', '🧪') + `<p class="pl-canh-bao">Kéo lọ hạt thả vào đây.</p>`;
				const kq = tinh(st);
				return dauBang('Kết quả', 'Chỉ nói xu hướng theo θ và ΔE; không dự đoán cỡ giọt hay thời gian bền.', '🧪') +
					(st.nv ? api.saoHTML(chamSaoPickering(st.nv, kq)) : '') +
					`<div class="pl-so-lon"><div><span>Loại thuận lợi</span><b>${kq.loai}</b></div><div><span>ΔE</span><b>${so(kq.kT, 2)}</b><small>kT${kq.minhHoa ? ', minh họa' : ''}</small></div><div><span>Mốc luật chơi</span><b>${NGUONG_BAM_KT.gia_tri.toLocaleString('vi-VN')}</b><small>kT</small></div></div>` +
					viSao(st, kq) + `<button type="button" class="pl-nut" data-lam="lamMoi">Thử hạt khác</button>`;
			},
		},
		doi(st, k, v) {
			st.me[k] = v;
			if (st.daXem) { st.daXem = false; st.canVeLai = true; }
		},
		hienO: (st, k) => (k === 'dNm' ? `${so(st.me.dNm, 4)} nm` : ''),
		lam: {
			lamMoi: (st, api) => { api.lamMoi(true); api.moTu('tu-hat'); },
		},
		capNhatCanh(st, svg) {
			const kq = tinh(st);
			svg.querySelector('[data-man="theta"]').textContent = st.daDoGoc && st.me.hat ? `${soCD(hatTheoId(st.me.hat).theta, 1)}°` : '--';
			svg.querySelector('[data-man="de"]').textContent = st.daTinh && kq ? `${so(kq.kT, 2)} kT` : '-- kT';
			const so1 = document.querySelector('[data-so="kT"]');
			if (so1 && kq) so1.textContent = so(kq.kT, 3);
		},
	});
}
