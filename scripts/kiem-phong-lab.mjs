// Kiểm bộ máy tính toán của Phòng lab ảo: công thức con khớp với bài, và các hiện tượng
// hóa học đi đúng chiều (áp suất thấp → giọt to → kem hóa nhanh, v.v.).
// Chạy: npm run kiem
import fs from 'node:fs';
import { chatNhuHoaToiThieu, stokes } from '../public/cong-thuc.js';
import { KEP, CHUNG, HAT, PP_DO, MAYO, moiKhoaNguon } from '../public/phong-lab/so-lieu-ban-moi.js';
import { moPhongNau, NHIEM_VU_NAU, chamSaoNau, kNoiSuy, hangDuong, eaSuyRa } from '../public/phong-lab/mo-hinh-nau-hoa.js';
import { NAU } from '../public/phong-lab/so-lieu-nau-hoa.js';
import { mienKep, moPhongKep, pgprHapPhu, chenhThamThau, phiHieuDung, phiTheTich, roMinhHoa, chamSaoKep, NHIEM_VU_KEP, moPhongPickering, hatTheoId, soSanhTheta, laThetaDauNuoc, chamSaoPickering, NHIEM_VU_PICKERING, gNen, phiMayo, moPhongMayo, chamSaoMayo, NHIEM_VU_MAYO } from '../public/phong-lab/mo-hinh-ban-moi.js';
import {
	dTheoChatNhuHoa, dTheoApSuat, nhietDoRa, dacTrungPhanBo, phanSoTheTich, doNhotXanthan,
	moPhongMe, NHIEM_VU, chamSao, doKhongNo, thoiGianCamUng, chiSoPeroxide, doNhotNuoc, DAU, PV_NGUONG,
} from '../public/phong-lab/mo-hinh.js';
import {
	moPhongThit, ngayTBARS, heSoPH, NHIEM_VU_THIT, chamSaoThit,
	awUocTinh, MAM_BENH, moPhongBaoQuan, chiSoUcChe, NHIEM_VU_BQ, chamSaoBQ,
} from '../public/phong-lab/mo-hinh-thuc-pham.js';

import { ME, PT, COC_RONG, MAY_MAC_DINH, chuanCoc, quyDoiMe, kepMe, doiKhoiLuongMe, datO, datTuBu, khoiLuongSauDongHoa, taoThamSo, docThamSo, tachHash, hienThiO } from '../public/phong-lab/cong-thuc-me.js';
import { THIET_BI, kiemMay, khoaNguonThietBi } from '../public/phong-lab/thiet-bi.js';
import { doHat, momen, chuDai } from '../public/phong-lab/may-do-hat.js';

let loi = 0;
function dung(ten, dk) {
	if (!dk) loi++;
	console.log(`${dk ? 'ĐẠT ' : 'SAI '} ${ten}`);
}
const gan = (a, b, ss = 0.02) => Math.abs(a - b) / Math.abs(b) <= ss;

// 1. Công thức con
const dG = dTheoChatNhuHoa(0.2, 2, 2.4);
dung('d theo chất nhũ hóa là phép đảo của máy tính lượng chất nhũ hóa', gan(chatNhuHoaToiThieu(0.2, dG, 2).cGL, 2.4, 1e-9) && gan(dG, 1, 0.01));
dung('Nhiệt: 100 bar làm nóng ≈ 2,4 °C (bài 02)', gan(nhietDoRa(25, 100, 1, false) - 25, 2.4, 0.02));
dung('Nhiệt cộng dồn khi không làm lạnh, 3 lần 1000 bar ≈ +72 °C', gan(nhietDoRa(25, 1000, 3, false) - 25, 71.8, 0.01));
dung('Có làm lạnh giữa các lần thì nhiệt không cộng dồn', nhietDoRa(25, 1000, 3, true) === nhietDoRa(25, 1000, 1, false));
const doc = Math.log(dTheoApSuat(800, 1, 50) / dTheoApSuat(100, 1, 50)) / Math.log(8);
dung(`Độ dốc log–log d32 theo áp suất = ${doc.toFixed(2)}, nằm trong −0,6…−0,3 (bài 02)`, doc >= -0.6 && doc <= -0.3);
dung('Phân bố log-chuẩn: d43/d32 = exp(σ²)', gan(dacTrungPhanBo(1, 0.45).d43, Math.exp(0.2025), 1e-9));
dung('φ của 20% khối lượng dầu (ρ 920) ≈ 0,214', gan(phanSoTheTich(20, 920), 0.2137, 0.005));
dung('Xanthan 0,1% ≈ 151 mPa·s, 0,4% lớn hơn 20 lần', gan(doNhotXanthan(0.1), 151) && doNhotXanthan(0.4) > 20 * doNhotXanthan(0.1));

// 2. Hiện tượng đi đúng chiều
const me = {
	dau: 'huong-duong', phanTramDau: 3, nhuHoa: 'ppi', phanTramNhuHoa: 1, phanTramXanthan: 0,
	khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 500, soLan: 2, lamLanh: true }, nhietVao: 25,
};
const cao = moPhongMe(me);
const thap = moPhongMe({ ...me, dongHoa: { bar: 100, soLan: 1, lamLanh: true } });
dung('Áp suất thấp → giọt to hơn', thap.d32 > cao.d32);
dung('Giọt to → kem hóa nhanh hơn (CI 7 ngày)', thap.ongNghiem(7).CI > cao.ongNghiem(7).CI);
dung('Thêm số lần qua máy → giọt nhỏ thêm', moPhongMe({ ...me, dongHoa: { bar: 500, soLan: 3, lamLanh: true } }).d32 < cao.d32);
dung('Kem hóa tăng theo thời gian', cao.ongNghiem(30).CI > cao.ongNghiem(7).CI && cao.ongNghiem(0).CI === 0);

const thieu = moPhongMe({ ...me, phanTramNhuHoa: 0.05, dongHoa: { bar: 1500, soLan: 3, lamLanh: true } });
dung('Thiếu chất nhũ hóa: tăng áp suất không làm giọt nhỏ dưới 6φΓ/c', thieu.d32 >= thieu.dGamma && thieu.thieuNhuHoa);
dung('Thiếu chất nhũ hóa có cảnh báo', thieu.canhBao.some((c) => c.ma === 'thieu-nhu-hoa'));

const khongNH = moPhongMe({ ...me, nhuHoa: null });
dung('Không chất nhũ hóa → váng dầu sau 1 ngày', khongNH.ongNghiem(1).vangDau > 1);
const span = moPhongMe({ ...me, nhuHoa: 'span80' });
dung('Span 80 (HLB thấp) cho dầu trong nước → váng dầu sau 30 ngày', span.ongNghiem(30).vangDau > 1 && span.saiLoai);
const tween = moPhongMe({ ...me, nhuHoa: 'tween80' });
dung('Tween 80 (HLB cao) không nổi váng dầu', tween.ongNghiem(30).vangDau === 0);
dung('Tween hấp phụ nhanh → giọt nhỏ hơn protein cùng điều kiện', tween.d32 < cao.d32);

const whey = { dau: 'mct', phanTramDau: 10, nhuHoa: 'wpi', phanTramNhuHoa: 1, khuay: { rpm: 10000, phut: 2 }, nhietVao: 25 };
dung('WPI qua 3 lần 1000 bar không làm lạnh → biến tính', moPhongMe({ ...whey, dongHoa: { bar: 1000, soLan: 3, lamLanh: false } }).bienTinh);
dung('Làm lạnh giữa các lần → không biến tính', !moPhongMe({ ...whey, dongHoa: { bar: 1000, soLan: 3, lamLanh: true } }).bienTinh);

const sot = { dau: 'huong-duong', phanTramDau: 20, nhuHoa: 'tween80', phanTramNhuHoa: 1, khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: true }, nhietVao: 25 };
const ci = (x) => moPhongMe({ ...sot, phanTramXanthan: x }).ongNghiem(60).CI;
dung('Xanthan ít (0,05%) kem hóa NHANH hơn không xanthan (kết bông cạn kiệt)', ci(0.05) > ci(0));
dung('Xanthan đủ (0,3%) tạo mạng, không kem hóa', ci(0.3) === 0);
dung('Xanthan 0,2% kem hóa chậm hơn không xanthan', ci(0.2) < ci(0));

// Ống nghiệm khớp Stokes: một lớp giọt đơn kích thước vẫn đi đúng quãng đường Stokes
const v1 = stokes(1, 1000, 920, 1).mmMoiNgay;
dung('Stokes 1 µm trong nước ≈ 3,8 mm/ngày (dùng lại máy tính đã kiểm)', gan(v1, 3.8, 0.06));

// Bảo toàn: tổng các lớp trong ống = 100 mm
for (const [ten, kq] of [['cao', cao], ['thap', thap], ['khongNH', khongNH], ['span', span]]) {
	const o = kq.ongNghiem(30);
	dung(`Ống nghiệm ${ten}: các lớp cộng lại = 100 mm`, gan(o.vangDau + o.kem + o.duc + o.serum, 100, 1e-6));
}

// 3. Oxy hóa chất béo
dung('U hướng dương ≈ 68,6 theo công thức Kochhar', gan(doKhongNo(DAU['huong-duong']), 68.6, 0.01));
dung('Thứ tự bền oxy hóa: MCT > hướng dương cao oleic > hướng dương > hạt lanh', (() => {
	const ip = (k) => thoiGianCamUng({ dau: DAU[k] });
	return ip('mct') > ip('huong-duong-oleic') && ip('huong-duong-oleic') > ip('huong-duong') && ip('huong-duong') > ip('lanh');
})());
dung('Hệ số Kochhar khớp tỷ lệ giáo trình oleate:linoleate:linolenate ≈ 1:12:25', gan(1 / 0.08, 12.5, 0.05) && gan(2.08 / 0.08, 26, 0.05));
dung('PV tại cuối giai đoạn cảm ứng = 10 meq/kg', gan(chiSoPeroxide(20, 20), PV_NGUONG, 1e-9));
dung('Lạnh hơn 10 °C → thời gian cảm ứng gấp đôi (Q10 = 2)', gan(thoiGianCamUng({ dau: DAU.lanh, nhietDo: 15 }) / thoiGianCamUng({ dau: DAU.lanh }), 2, 1e-9));
dung('Tocopherol và EDTA kéo dài, chai trong rút ngắn thời gian cảm ứng', (() => {
	const g = thoiGianCamUng({ dau: DAU.lanh });
	return thoiGianCamUng({ dau: DAU.lanh, tocopherol: true }) > g && thoiGianCamUng({ dau: DAU.lanh, edta: true }) > g && thoiGianCamUng({ dau: DAU.lanh, sang: true }) < g;
})());
dung('Độ nhớt nước: 0,89 mPa·s ở 25 °C, 1,57 ở 4 °C', gan(doNhotNuoc(25), 0.89, 0.01) && gan(doNhotNuoc(4), 1.57, 0.02));
dung('Bảo quản lạnh làm kem hóa chậm hơn', cao.ongNghiem(30, 4).CI < cao.ongNghiem(30, 25).CI);

dung('Mọi loại dầu: tổng acid béo không no ≤ 100%', Object.values(DAU).every((d) => d.c181 + d.c182 + d.c183 <= 100));
dung('Dầu ô liu bền oxy hóa hơn đậu nành; cải nằm giữa', (() => {
	const ip = (k) => thoiGianCamUng({ dau: DAU[k] });
	return ip('o-liu') > ip('cai') && ip('cai') > ip('dau-nanh');
})());

// 4. Nhiệm vụ: có lời giải 3 sao, và cách làm ẩu thì không đủ 3 sao
const LOI_GIAI = {
	'sua-thuc-vat': [{ ...me }, { ...me, dongHoa: { bar: 100, soLan: 1, lamLanh: true } }],
	'whey-nong': [
		{ ...whey, dongHoa: { bar: 600, soLan: 2, lamLanh: true } },
		{ ...whey, dongHoa: { bar: 1000, soLan: 3, lamLanh: false } },
	],
	'sot-salad': [{ ...sot, phanTramXanthan: 0.3 }, { ...sot, phanTramXanthan: 0.05 }],
	'omega-3': [
		{ ...sot, phanTramXanthan: 0.3, tocopherol: true },
		{ ...sot, dongHoa: { bar: 600, soLan: 2, lamLanh: true } },
	],
};
for (const nv of NHIEM_VU) {
	const [tot, au] = LOI_GIAI[nv.id];
	const a = chamSao(nv, moPhongMe({ ...tot, ...nv.coDinh })).sao;
	const b = chamSao(nv, moPhongMe({ ...au, ...nv.coDinh })).sao;
	dung(`Nhiệm vụ "${nv.ten}": lời giải được ${a}/3 sao, cách làm ẩu ${b}/3`, a === 3 && b < 3);
}

// 5. Bàn thịt: tái tạo neo đo thật và đúng chiều
{
	const T = (o) => moPhongThit(o);
	const dc = T({});
	const sh = T({ muoi: 2, phosphat: 'stpp', cPhos: 0.3, bicarb: 0.3 });
	dung(`Đối chứng: pH 5,45, năng suất ${dc.nangSuat.toFixed(1)}% ≈ 70% (Sheard 2004)`, gan(dc.pH, 5.45, 1e-9) && Math.abs(dc.nangSuat - 70) < 1);
	dung(`Muối + STPP + bicarbonat: pH ${sh.pH.toFixed(2)} trong 5,75–5,97 (Sheard 2004)`, sh.pH >= 5.75 && sh.pH <= 5.97);
	dung(`Muối + STPP + bicarbonat: năng suất ${sh.nangSuat.toFixed(1)}% ≈ 85% (±2)`, Math.abs(sh.nangSuat - 85) <= 2);
	const chiPhos = T({ phosphat: 'stpp', cPhos: 0.3 }).nangSuat, chiMuoi = T({ muoi: 2 }).nangSuat, ca2 = T({ muoi: 2, phosphat: 'stpp', cPhos: 0.3 }).nangSuat;
	dung('Hiệp lực: muối + phosphat hơn tổng hai tác dụng riêng', ca2 - 70 > chiPhos - 70 + (chiMuoi - 70));
	dung('Phosphat một mình (không muối) chỉ tăng ít (< 4 điểm)', chiPhos - 70 < 4);
	dung('SHMP nâng pH và giữ nước kém STPP cùng liều', T({ muoi: 2, phosphat: 'shmp', cPhos: 0.3 }).nangSuat < ca2);
	dung('Nấu 56 °C cho năng suất cao hơn 72 °C (Kang 2021)', T({ muoi: 2, phosphat: 'stpp', cPhos: 0.3, nhietNau: 56 }).nangSuat > ca2);
	dung('TBARS khớp neo Norazizi 2025: 7 / 21 / 28 ngày', ngayTBARS(null, 0).ngay === 7 && gan(ngayTBARS('stpp', 0.15).ngay, 21, 1e-9) && gan(ngayTBARS('stpp', 0.3).ngay, 28, 1e-9));
	dung('Không ngoại suy TBARS ngoài dữ liệu (TSPP: không có số)', ngayTBARS('tspp', 0.3).ngay === null && ngayTBARS('stpp', 0.5).ngay === 28);
	dung('Hệ số pH có đỉnh: pH 8,5 kém pH 7', heSoPH(8.5) < heSoPH(7));
	const LG = {
		'giam-bong': [{ muoi: 2, phosphat: 'stpp', cPhos: 0.3, bicarb: 0.3, nhietNau: 72 }, { muoi: 2, phosphat: 'stpp', cPhos: 0.3, nhietNau: 72 }],
		'xuc-xich-giam-muoi': [{ muoi: 1.2, phosphat: 'stpp', cPhos: 0.3, bicarb: 0.3, nhietNau: 72 }, { muoi: 1.2, phosphat: 'stpp', cPhos: 0.3, nhietNau: 72 }],
		'thit-trau-de-lau': [{ muoi: 2, phosphat: 'stpp', cPhos: 0.3, nhietNau: 60 }, { muoi: 2, nhietNau: 72 }],
	};
	for (const nv of NHIEM_VU_THIT) {
		const [tot, au] = LG[nv.id];
		const a = chamSaoThit(nv, T(tot), tot).sao, b = chamSaoThit(nv, T(au), au).sao;
		dung(`Nhiệm vụ thịt "${nv.ten}": lời giải ${a}/3, cách làm ẩu ${b}/3`, a === 3 && b < 3);
	}
}

// 6. Bàn bảo quản: bảng FDA, aw, axit yếu
{
	dung('aw nước muối 10% ≈ 0,935 (khớp cột aw–muối của C. botulinum A trong bảng FDA)', Math.abs(awUocTinh({ muoi: 10 }) - 0.935) < 0.005);
	dung('aw nước muối 20% trong 0,83–0,86', awUocTinh({ muoi: 20 }) > 0.83 && awUocTinh({ muoi: 20 }) < 0.86);
	dung('Đường làm giảm aw, càng nhiều càng giảm', awUocTinh({ duong: 65 }) < awUocTinh({ duong: 45 }) && awUocTinh({ duong: 45 }) < 1);
	const sau = (aw) => MAM_BENH.find((b) => b.id === 'sau').awMin <= aw;
	dung('S. aureus: aw 0,80 không mọc, aw 0,90 mọc (FDA)', !sau(0.8) && sau(0.9));
	const BQ = (o) => moPhongBaoQuan(o);
	const lis = (o) => BQ(o).ketQua.find((r) => r.id === 'lis');
	dung('Listeria vẫn mọc ở 4 °C nếu không có hàng rào khác', lis({ pH: 6.5, nhietDo: 4 }).moc);
	dung('C. botulinum không mọc khi lọ để hở (cần kỵ khí)', !BQ({ pH: 6.5, nhietDo: 30 }).ketQua.find((r) => r.id === 'bot-a').moc && BQ({ pH: 6.5, nhietDo: 30, kin: true }).ketQua.find((r) => r.id === 'bot-a').moc);
	dung('pH 3,6 chặn mọi mầm bệnh trong bảng (Salmonella thấp nhất 3,7)', BQ({ pH: 3.6, nhietDo: 30, kin: true }).soMoc === 0);
	const uS = (pH) => chiSoUcChe({ pH, sorbat: 0.5 }).tong;
	dung('Sorbat mạnh hơn khi pH thấp hơn', uS(3.5) > uS(4.0) && uS(4.0) > uS(5.0));
	dung('Dạng phân ly vẫn có tác dụng: ở pH 6 chỉ số ức chế > 0', uS(6) > 0);
	dung('Benzoat không ức chế nấm men ở pH ≥ 4,5 (Arroyo-López 2008)', chiSoUcChe({ pH: 4.6, benzoat: 1 }).tong < 0.05);
	dung('Ở pH 4,2: sorbat 1 g/kg ức chế, benzoat 1 g/kg thì không', chiSoUcChe({ pH: 4.2, sorbat: 1 }).tong >= 1 && chiSoUcChe({ pH: 4.2, benzoat: 1 }).tong < 1);
	dung('Hai chất bảo quản cộng gộp (FIC)', gan(chiSoUcChe({ pH: 3.8, sorbat: 0.3, benzoat: 0.3 }).tong, chiSoUcChe({ pH: 3.8, sorbat: 0.3 }).tong + chiSoUcChe({ pH: 3.8, benzoat: 0.3 }).tong, 1e-9));
	const daDo = { aw: true, pH: true };
	const LG = {
		'tuong-ot': [{ pH: 3.6, sorbat: 1 }, { pH: 3.6 }],
		'ca-muoi': [{ muoi: 11.5 }, { muoi: 8 }],
		'nuoc-trai-cay': [{ pH: 4.2, sorbat: 0.8 }, { pH: 4.2, benzoat: 1 }],
	};
	for (const nv of NHIEM_VU_BQ) {
		const [tot, au] = LG[nv.id].map((m) => ({ pH: 6.5, ...m, ...nv.coDinh }));
		const a = chamSaoBQ(nv, BQ(tot), { me: tot, daDo }).sao, b = chamSaoBQ(nv, BQ(au), { me: au, daDo }).sao;
		dung(`Nhiệm vụ bảo quản "${nv.ten}": lời giải ${a}/3, cách làm ẩu ${b}/3`, a === 3 && b < 3);
	}
}

// 7. Ba bàn mới (Gói 7): số khớp nguồn, không ngoại suy, nhiệm vụ giải được
{
	const nguonJson = JSON.parse(fs.readFileSync(new URL('../nguon/nguon.json', import.meta.url), 'utf8'));
	const coKhoa = new Set(nguonJson.map((e) => e.khoa));
	const thieuKhoa = moiKhoaNguon().filter((k) => !coKhoa.has(k));
	dung(`Mọi khóa nguồn của tham số có trong nguon.json (${moiKhoaNguon().length} khóa)`, thieuKhoa.length === 0);
	for (const [ten, nhom] of Object.entries({ KEP, CHUNG, ...Object.fromEntries(HAT.map((x) => [x.id, { x }])) }))
		for (const [k, v] of Object.entries(nhom)) dung(`${ten}.${k} có nhãn N/T/K/G`, ['N', 'T', 'K', 'G'].includes(v.nhan) && !!v.chac);
	dung('Nhãn G (số minh họa rò rỉ) không nằm trong tiêu chí chấm sao', !NHIEM_VU_KEP.some((n) => n.tieuChi.some((t) => /rò rỉ|hiệu suất/i.test(t.chu))));

	// Nhũ tương kép
	dung('Bản đồ khớp bảng Nollet 2024', mienKep(0.36, 5) === 'xanh' && mienKep(0.36, 40) === 'xanh' && mienKep(2.5, 10) === 'do' && mienKep(2.5, 20) === 'cam' && mienKep(2.5, 40) === 'xanh' && mienKep(5, 20) === 'do' && mienKep(10, 40) === 'cam' && mienKep(10, 47.1) === 'xanh');
	dung('Ô không có trong bài: ngoài vùng có dữ liệu, không ngoại suy', mienKep(1, 40) === null && mienKep(5, 40) === null && mienKep(0.36, 47.1) === null && moPhongKep({ cFree: 1, phiD: 40 }).ngoaiVung);
	dung(`PGPR hấp phụ ở 40 wt%, d 1,9 µm = ${pgprHapPhu(40).toFixed(3)} ≈ 1,28 wt% (Nollet 2024)`, Math.abs(pgprHapPhu(40) - KEP.pgpr_hap_phu_40.gia_tri) < 0.03);
	dung('PGPR hấp phụ tỉ lệ nghịch cỡ giọt: d 1 µm ≈ 2,4; d 3 µm ≈ 0,8', Math.abs(pgprHapPhu(40, 1) - 2.4) < 0.1 && Math.abs(pgprHapPhu(40, 3) - 0.8) < 0.05);
	dung('Tổng PGPR ứng C_free 0,36 ≈ 1,64 wt% (bảng công thức)', Math.abs(moPhongKep({ cFree: 0.36, phiD: 40 }).tongPgpr - 1.64) < 0.03);
	dung(`Chênh thẩm thấu 0,1 M NaCl = ${chenhThamThau(0.1, 0).toFixed(2)} ≈ 4,96 bar`, Math.abs(chenhThamThau(0.1, 0) - 4.96) < 0.01);
	dung('Hướng nước: W₁ đậm hơn thì nước vào, W₂ đậm hơn thì nước ra', moPhongKep({ cFree: 0.36, phiD: 40, cW2: 0 }).huongNuoc === 'vao' && moPhongKep({ cFree: 0.36, phiD: 40, cW2: 0.2 }).huongNuoc === 'ra');
	dung('Đổi muối W₂ khỏi 0,1 M thì ra ngoài bản đồ', moPhongKep({ cFree: 0.36, phiD: 40, cW2: 0.2 }).ngoaiVung);
	dung('φ hiệu dụng = φ_O + φ_W₁ > φ_O', phiHieuDung(0.1, 40) > 0.1 && Math.abs(phiHieuDung(0.1, 40) - 0.1 / (1 - phiTheTich(40))) < 1e-9);
	dung('Rò rỉ minh họa: miền xanh neo EE ≈ 90% ở cuối trục', Math.abs(roMinhHoa('xanh', 1) - 0.9) < 1e-9);
	{
		const me1 = { cFree: 0.36, phiD: 40, buoc2: 'nhe' };
		const a = chamSaoKep(NHIEM_VU_KEP[0], moPhongKep(me1), me1).sao;
		const au = { cFree: 2.5, phiD: 10, buoc2: 'manh' };
		const b = chamSaoKep(NHIEM_VU_KEP[0], moPhongKep(au), au).sao;
		dung(`Nhiệm vụ "${NHIEM_VU_KEP[0].ten}": lời giải ${a}/3, làm ẩu ${b}/3`, a === 3 && b < 3);
		const c = chamSaoKep(NHIEM_VU_KEP[1], moPhongKep(me1), me1).sao;
		const nhieu = { cFree: 2.5, phiD: 40, buoc2: 'nhe' };
		const d = chamSaoKep(NHIEM_VU_KEP[1], moPhongKep(nhieu), nhieu).sao;
		dung(`Nhiệm vụ "${NHIEM_VU_KEP[1].ten}": lời giải ${c}/3, nhiều PGPR ${d}/3`, c === 3 && d < 3);
	}

	// Pickering
	dung('Mọi hạt đều ghi phương pháp đo θ', HAT.every((x) => !!PP_DO[x.pp]));
	dung('Protein, microgel đánh dấu hạt mềm nên ΔE chỉ minh họa', HAT.filter((x) => /wpi|zein/.test(x.id)).every((x) => x.mem && moPhongPickering({ hat: x, dNm: 100 }).minhHoa));
	dung('θ đo trong không khí không được coi là θ dầu–nước', !laThetaDauNuoc(hatTheoId('wpi-vi-gel')) && laThetaDauNuoc(hatTheoId('zein-alginate')));
	dung('Khác phương pháp đo thì không so trực tiếp', !soSanhTheta(hatTheoId('wpi-goc'), hatTheoId('zein')) && soSanhTheta(hatTheoId('wpi-goc'), hatTheoId('wpi-citric')) && !soSanhTheta(hatTheoId('osa-nano'), hatTheoId('osa-tigernut')));
	const heSo = (t) => (1 - Math.abs(Math.cos((t * Math.PI) / 180))) ** 2;
	dung(`Hệ số ΔE θ 70,1° so với 25,4° = ${(heSo(70.1) / heSo(25.4)).toFixed(1)} ≈ 46,7 lần`, Math.abs(heSo(70.1) / heSo(25.4) - 46.7) < 0.3);
	const si = moPhongPickering({ hat: 'silica-amin', dNm: 19 });
	dung(`Silica amin 19 nm, θ 22°: ΔE = ${si.kT.toFixed(1)} ≈ 12 kT`, Math.abs(si.kT - 12) < 1.5 && !si.bamChac);
	dung('θ dưới 90° là O/W, trên 90° là W/O', moPhongPickering({ hat: 'zein', dNm: 100 }).loai === 'W/O' && moPhongPickering({ hat: 'zein-alginate', dNm: 80 }).loai === 'O/W');
	{
		const tot = moPhongPickering({ hat: 'osa-tigernut', dNm: 7710 }), au = moPhongPickering({ hat: 'silica-amin', dNm: 19 });
		dung(`Nhiệm vụ "${NHIEM_VU_PICKERING[0].ten}": lời giải ${chamSaoPickering(NHIEM_VU_PICKERING[0], tot).sao}/3, silica ${chamSaoPickering(NHIEM_VU_PICKERING[0], au).sao}/3`, chamSaoPickering(NHIEM_VU_PICKERING[0], tot).sao === 3 && chamSaoPickering(NHIEM_VU_PICKERING[0], au).sao < 3);
		const tin = moPhongPickering({ hat: 'zein-alginate', dNm: 80 }), kk = moPhongPickering({ hat: 'wpi-citric', dNm: 1000 });
		dung(`Nhiệm vụ "${NHIEM_VU_PICKERING[1].ten}": lời giải ${chamSaoPickering(NHIEM_VU_PICKERING[1], tin).sao}/3, θ đo trong không khí ${chamSaoPickering(NHIEM_VU_PICKERING[1], kk).sao}/3`, chamSaoPickering(NHIEM_VU_PICKERING[1], tin).sao === 3 && chamSaoPickering(NHIEM_VU_PICKERING[1], kk).sao < 3);
	}

	// Mayonnaise
	dung(`Princen–Kiss φ 0,75, σ 10, d₃₂ 3,5: ${gNen(0.75).toFixed(0)} ≈ 349 Pa; φ ≤ 0,712 thì 0`, Math.abs(gNen(0.75) - 349) < 3 && gNen(0.712) === 0 && gNen(0.7) === 0);
	dung('Quy đổi φ: 73% khối lượng ≈ 0,75 thể tích (Ho 2022)', Math.abs(phiMayo(73) - 0.75) < 0.01);
	dung('Điểm đo Li 2012 giữ nguyên số', MAYO.li2012.diem[80].tau0 === 133.5 && MAYO.li2012.diem[75].Gp === 492 && MAYO.li2012.diem[85].d_tt === 3.15);
	const M = (o) => moPhongMayo({ dauPct: 80, ...o });
	dung('Dầu ngoài 75, 80, 85%: báo ngoài vùng có dữ liệu, không có số', M({ dauPct: 70 }).ngoaiVung && M({ dauPct: 70 }).duLieu === null && M({ dauPct: 90 }).duLieu === null);
	dung('Đổ dầu quá nhanh: đảo pha hoặc vỡ, không in số', M({ tocDo: 'nhanh' }).trangThai === 'dao-pha' && M({ tocDo: 'nhanh' }).duLieu === null);
	dung('Không có lòng đỏ: không nhũ hóa', M({ coLongDo: false }).trangThai === 'khong-nhu-hoa');
	dung('Không có giấm: khác công thức bảng đo, không in số', M({ coGiam: false }).duLieu === null);
	dung('Kết quả mayonnaise không có trường hạn dùng hay vi sinh', !Object.keys(M({})).some((k) => /han|sinh|shelf/i.test(k)));
	{
		const a = M({ quaNghien: true }), b = M({ tocDo: 'nhanh' }), c = M({ dauPct: 75 }), d = M({ dauPct: 85, quaNghien: true });
		dung(`Nhiệm vụ "${NHIEM_VU_MAYO[0].ten}": lời giải ${chamSaoMayo(NHIEM_VU_MAYO[0], a).sao}/3, đổ nhanh ${chamSaoMayo(NHIEM_VU_MAYO[0], b).sao}/3`, chamSaoMayo(NHIEM_VU_MAYO[0], a).sao === 3 && chamSaoMayo(NHIEM_VU_MAYO[0], b).sao < 3);
		dung(`Nhiệm vụ "${NHIEM_VU_MAYO[1].ten}": dầu 80% ${chamSaoMayo(NHIEM_VU_MAYO[1], a).sao}/3, dầu 75% ${chamSaoMayo(NHIEM_VU_MAYO[1], c).sao}/3, dầu 85% ${chamSaoMayo(NHIEM_VU_MAYO[1], d).sao}/3`, chamSaoMayo(NHIEM_VU_MAYO[1], a).sao === 3 && chamSaoMayo(NHIEM_VU_MAYO[1], c).sao < 3 && chamSaoMayo(NHIEM_VU_MAYO[1], d).sao < 3);
	}

	// Mẫu mang sang bàn bảo quản: aw lấy từ mẫu thay cho ước tính, không đổi hành vi cũ
	{
		const cu = moPhongBaoQuan({ muoi: 5, duong: 0, pH: 6.5, nhietDo: 25 });
		const moi = moPhongBaoQuan({ muoi: 5, duong: 0, pH: 6.5, nhietDo: 25, awDo: 0.5 });
		dung('Bảo quản: không có awDo thì aw vẫn là ước tính từ muối và đường', cu.awTuMau === false && Math.abs(cu.aw - 0.9) < 0.1 && cu.aw < 1);
		dung('Bảo quản: có awDo thì dùng đúng aw của mẫu và đánh dấu', moi.awTuMau === true && moi.aw === 0.5);
		dung('Bảo quản: aw 0,5 chặn mọi mầm bệnh trong bảng FDA (aw thấp nhất của họ đều cao hơn 0,5)', moi.soMoc === 0);
		dung('Bảo quản: awDo ngoài (0, 1] bị bỏ qua', moPhongBaoQuan({ muoi: 5, awDo: 1.5 }).awTuMau === false && moPhongBaoQuan({ muoi: 5, awDo: 0 }).awTuMau === false);
	}

	// Nâu hóa
	dung('k bánh quy: hai đầu khoảng giữ nguyên số (165 và 195 °C)', Math.abs(kNoiSuy(NAU.banhQuy.kBI, 165) - 0.019) < 1e-9 && Math.abs(kNoiSuy(NAU.banhQuy.kBI, 195) - 0.063) < 1e-9 && Math.abs(kNoiSuy(NAU.banhQuy.kAcryl, 195) - 0.077) < 1e-9);
	dung('k bánh quy: ngoài 165–195 °C không ngoại suy (null)', kNoiSuy(NAU.banhQuy.kBI, 160) === null && kNoiSuy(NAU.banhQuy.kBI, 200) === null);
	dung('k tăng theo nhiệt độ', kNoiSuy(NAU.banhQuy.kBI, 170) < kNoiSuy(NAU.banhQuy.kBI, 190));
	dung(`Ea suy từ hai đầu k (${eaSuyRa(NAU.banhQuy.kBI).toFixed(0)} kJ/mol) lớn hơn Ea trong tóm tắt (tối đa ${NAU.banhQuy.EaBI[1]}): đúng như bàn đã ghi chú`, eaSuyRa(NAU.banhQuy.kBI) > NAU.banhQuy.EaBI[1]);
	dung('Thứ tự đường: xylose nhanh nhất, sucrose chậm nhất', hangDuong('xylose') === 0 && hangDuong('sucrose') === 5);
	{
		const N = (o) => moPhongNau({ loai: 'banh-quy', duong: 'glucose', aw: 0.5, T: 180, phut: 10, ...o });
		dung('Bánh quy 200 °C: ngoài vùng có dữ liệu, không có số', N({ T: 200 }).ngoaiVung && N({ T: 200 }).BI === null);
		dung('Nướng lâu hơn thì độ tiến tăng, không vượt 1', N({ phut: 20 }).BI > N({ phut: 5 }).BI && N({ phut: 30 }).BI < 1);
		const C = (o) => moPhongNau({ loai: 'chip', giong: 'Atlantic', ...o });
		dung('Chip: hạ nhiệt cho đúng số theo giống (84 / 67 / 78)', C({ haNhiet: true }).giam === 84 && C({ haNhiet: true, giong: 'Snowden' }).giam === 67 && C({ haNhiet: true, giong: 'Vigor' }).giam === 78);
		dung('Chip: asparaginase cho đúng số 45,6 và 85', C({ enzyme: 'khoai-tay' }).giam === 45.6 && C({ enzyme: 'khoai-lang' }).giam === 85);
		dung('Chip: hạ nhiệt cộng enzyme là ngoài vùng có dữ liệu, không cộng không nhân', C({ haNhiet: true, enzyme: 'khoai-lang' }).giam === null && C({ haNhiet: true, enzyme: 'khoai-lang' }).ngoaiVung);
		dung('Chip: không can thiệp thì không có số giảm', C({}).giam === null && !C({}).ngoaiVung);
		const st = { daDo: true };
		const sao = (i, kq) => chamSaoNau(NHIEM_VU_NAU[i], kq, st).sao;
		dung(`Nhiệm vụ "${NHIEM_VU_NAU[0].ten}": Atlantic ${sao(0, C({ haNhiet: true }))}/3, Snowden ${sao(0, C({ haNhiet: true, giong: 'Snowden' }))}/3`, sao(0, C({ haNhiet: true })) === 3 && sao(0, C({ haNhiet: true, giong: 'Snowden' })) < 3);
		dung(`Nhiệm vụ "${NHIEM_VU_NAU[1].ten}": khoai lang ${sao(1, C({ enzyme: 'khoai-lang' }))}/3, khoai tây 1 IU ${sao(1, C({ enzyme: 'khoai-tay' }))}/3`, sao(1, C({ enzyme: 'khoai-lang' })) === 3 && sao(1, C({ enzyme: 'khoai-tay' })) < 3);
		const tot = N({ T: 165, duong: 'sucrose', aw: 0.5 }), xau = N({ T: 165, duong: 'sucrose', aw: 0.8 }), nong = N({ T: 180, duong: 'sucrose', aw: 0.5 });
		dung(`Nhiệm vụ "${NHIEM_VU_NAU[2].ten}": lời giải ${sao(2, tot)}/4, aw trong dải ${sao(2, xau)}/4, 180 °C ${sao(2, nong)}/4`, sao(2, tot) === 4 && sao(2, xau) < 4 && sao(2, nong) < 4);
		dung('Kết quả nâu hóa không có trường hạn dùng hay an toàn', !Object.keys(N({})).some((k) => /^han$|^han[A-Z_]|shelf|antoan|anToan/.test(k)));
	}
}


// 8. Cốc có khối lượng mẻ tự chọn (P1) và máy đo cỡ hạt dùng chung (P2)
{
	const rhoHD = DAU['huong-duong'].rho;
	const coc = (o) => ({ ...COC_RONG(), nuoc: true, dau: 'huong-duong', gDau: 20, nhuHoa: 'tween80', gNhuHoa: 1, ...o });
	const q = quyDoiMe(coc({}));
	dung('P1: me = 100, tự bù, 20 g dầu → 20% khối lượng và φ = phanSoTheTich(20, ρ)', q.phanTramDau === 20 && q.phanTramNhuHoa === 1 && q.phi === phanSoTheTich(20, rhoHD) && q.tong === 100 && gan(q.gNuocThuc, 79, 1e-12));
	// bất biến theo mẻ: mô hình nhận phần trăm, nên d32, nhiệt, kem hóa ngày 7 không đổi khi nhân cả mẻ lên 10 lần
	const chay = (me) => {
		const c = doiKhoiLuongMe(coc({}), me).coc;
		const r = quyDoiMe(c);
		return moPhongMe({ dau: 'huong-duong', phanTramDau: r.phanTramDau, nhuHoa: 'tween80', phanTramNhuHoa: r.phanTramNhuHoa, phanTramXanthan: r.phanTramXanthan, khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: false }, nhietVao: 25 });
	};
	const a1 = chay(100), a2 = chay(1000);
	dung('P1: cùng phần trăm ở mẻ 100 g và 1.000 g cho cùng d32, nhiệt ra, lớp kem ngày 7 (sai số 1e-9)', Math.abs(a1.d32 - a2.d32) < 1e-9 && Math.abs(a1.nhietRa - a2.nhietRa) < 1e-9 && Math.abs(a1.ongNghiem(7).kem - a2.ongNghiem(7).kem) < 1e-9);
	dung('P1: đổi mẻ giữ nguyên phần trăm (nhân gram theo tỷ lệ)', (() => { const r = doiKhoiLuongMe(coc({}), 250); return r.coc.gDau === 50 && r.coc.gNhuHoa === 2.5 && quyDoiMe(r.coc).phanTramDau === 20; })());
	const tay = datTuBu(coc({ me: 250, gDau: 50, gNhuHoa: 2.5, gXanthan: 0.5 }), false);
	tay.gNuoc = 150;
	const qt = quyDoiMe(tay);
	dung('P1: tắt tự bù, 150 g nước + 50 g dầu → tổng = 200 + phần khác, phanTramDau = 50/tổng·100', gan(qt.tong, 150 + 50 + 2.5 + 0.5, 1e-12) && gan(qt.phanTramDau, (50 / qt.tong) * 100, 1e-12));
	dung('P1: bật lại tự bù thì me = tổng đang có', datTuBu(tay, true).me === Math.round(203 * 1000) / 1000);
	dung('P1: tỷ lệ dầu : nước và chất nhũ hóa : dầu đúng định nghĩa', gan(q.tyLeDauNuoc, 79 / 20, 1e-12) && gan(q.tyLeNhuHoaDau, 20, 1e-12));
	dung('P1: thể tích mẻ = dầu/ρ + nước + phần còn lại (g ≈ mL)', gan(q.theTichML, (20 * 1000) / rhoHD + 79 + 1, 1e-12));
	// giới hạn
	const k1 = kepMe({ ...coc({}), me: 5000 });
	const k2 = kepMe({ ...coc({}), gDau: 60 });
	const k3 = kepMe({ ...coc({}), gDau: 0.2 });
	dung('P1: mẻ ngoài 20–2.000 g bị kẹp và có lý do', k1.coc.me === ME.max && k1.ly.length > 0 && kepMe({ ...coc({}), me: 3 }).coc.me === ME.min);
	dung('P1: dầu trên 40% bị kẹp về 40% kèm lý do Mayonnaise; dưới 1% kẹp lên 1%', k2.coc.gDau === 40 && /Mayonnaise/.test(k2.ly[0]) && k3.coc.gDau === 1);
	dung('P1: gõ vào ô số ngoài dải thì kẹp, gõ chữ thì giữ giá trị cũ', datO(coc({}), 'gDau', 75).coc.gDau === 40 && datO(coc({}), 'gDau', NaN).coc.gDau === 20);
	dung('P1: cách nhập % và tỷ lệ đổi qua lại về cùng gram', (() => {
		const pt = datO({ ...coc({ me: 250, gDau: 50 }), cachNhap: 'phan-tram' }, 'gDau', 10).coc;
		const tl = datO({ ...coc({ me: 250, gDau: 50 }), cachNhap: 'ty-le' }, 'gDau', 4).coc;
		return gan(pt.gDau, 25, 1e-9) && gan(tl.gDau, (250 - 1) / 5, 1e-9) && gan(hienThiO({ ...tl, cachNhap: 'ty-le' }, 'gDau'), 4, 1e-6);
	})());
	// máy chạy được
	const dh25 = kiemMay('dongHoa', { theTichML: 25 }), dh30 = kiemMay('dongHoa', { theTichML: 30 });
	dung('P1: máy đồng hóa không chạy ở 25 mL (có lý do), chạy ở 30 mL, 15 mL nằm lại máy', !dh25.chay && !!dh25.ly && dh30.chay && dh30.haoML === 15);
	dung('P1: máy khuấy không chạy ở 2.500 mL, 0,5 mL hoặc độ nhớt 6.000 mPa·s; chạy ở 1 mL và 2.000 mL', !kiemMay('khuay', { theTichML: 2500 }).chay && !kiemMay('khuay', { theTichML: 0.5 }).chay && !kiemMay('khuay', { theTichML: 100, nhotMPas: 6000 }).chay && kiemMay('khuay', { theTichML: 1 }).chay && kiemMay('khuay', { theTichML: 2000 }).chay);
	dung('P1: mẻ 100 g (≈ 102 mL) chạy được cả hai máy; mẻ 25 g bị chặn ở máy đồng hóa', (() => { const v = (me) => quyDoiMe(doiKhoiLuongMe(coc({}), me).coc).theTichML; return kiemMay('khuay', { theTichML: v(100) }).chay && kiemMay('dongHoa', { theTichML: v(100) }).chay && !kiemMay('dongHoa', { theTichML: v(25) }).chay; })());
	dung('P1: mẫu 250 g (≈ 254 mL) qua máy đồng hóa còn ≈ 235 g', gan(khoiLuongSauDongHoa(250, 254, 15), 235, 0.005));
	// đường dẫn
	const DUONG = 'me=250&dau=huong-duong&gDau=50&nhuHoa=tween80&gNhuHoa=2.5&gXanthan=0.5&nuoc=tu-bu&toco=1&edta=0&rpm=10000&phut=2&bar=300&lan=2&lamLanh=1';
	const d = docThamSo(DUONG);
	dung('P1: đọc đường dẫn chia sẻ ra đúng cốc và máy', d.coc.me === 250 && d.coc.dau === 'huong-duong' && d.coc.gDau === 50 && d.coc.nhuHoa === 'tween80' && d.coc.gNhuHoa === 2.5 && d.coc.gXanthan === 0.5 && d.coc.nuoc && d.coc.nuocTuBu && d.coc.tocopherol && !d.coc.edta && d.may.khuay.rpm === 10000 && d.may.dongHoa.soLan === 2 && d.may.dongHoa.lamLanh === true && d.may.dongHoa.bar === 300);
	const lo = tachHash('#ban-nhu-tuong?me=250&x=1');
	dung('P1: địa chỉ cũ vẫn tách đúng (không có ?)', ['#ban-mayo', '#ban-thit', '#ban-bao-quan', '#ban-kep', '#ban-pickering', '#ban-nau-hoa', '#nv-tu-do', '#nv-sua-thuc-vat', '#so-tay', ''].every((x) => tachHash(x).duong === x && tachHash(x).chuoi === '') && lo.duong === '#ban-nhu-tuong' && lo.chuoi === 'me=250&x=1' && tachHash('#nv-sua-thuc-vat?me=250').duong === '#nv-sua-thuc-vat');
	let hong;
	try { hong = docThamSo('me=abc&gDau=-5&la=1&dau=khong-co&bar=ab&nuoc=-3'); } catch { hong = null; }
	dung('P1: chuỗi hỏng không ném lỗi: mẻ về mặc định, gDau kẹp về 1%, khóa lạ bị bỏ', !!hong && hong.coc.me === 100 && hong.coc.gDau === 1 && hong.coc.dau === null && hong.may.dongHoa.bar === 300);
	const S1 = { coc: coc({ me: 400, gDau: 80, gXanthan: 0.8, tocopherol: true, edta: true }), may: { khuay: { rpm: 15000, phut: 3.5 }, dongHoa: { bar: 750, soLan: 3, lamLanh: true } } };
	const r1 = docThamSo(taoThamSo(S1));
	dung('P1: chép rồi đọc lại đường dẫn (khứ hồi) ra cùng trạng thái', JSON.stringify([r1.coc.me, r1.coc.dau, r1.coc.gDau, r1.coc.nhuHoa, r1.coc.gNhuHoa, r1.coc.gXanthan, r1.coc.nuoc, r1.coc.tocopherol, r1.coc.edta, r1.may]) === JSON.stringify([400, 'huong-duong', 80, 'tween80', 1, 0.8, true, true, true, S1.may]));
	dung('P1: đường dẫn chỉ ghi khóa khác mặc định', taoThamSo({ coc: COC_RONG(), may: MAY_MAC_DINH() }) === '');
	const cd = docThamSo('me=500&dau=cai&gDau=300', { dau: 'huong-duong', phanTramDau: 10 });
	dung('P1: đề bài cố định thắng khóa trong đường dẫn', cd.coc.dau === 'huong-duong' && gan(quyDoiMe(cd.coc).phanTramDau, 10, 1e-9));
	// mẫu cũ (không có me, không có nuocTuBu) cho đúng kết quả như trước
	const cu = { nuoc: true, dau: 'huong-duong', gDau: 20, nhuHoa: 'tween80', gNhuHoa: 1, gXanthan: 0.2, tocopherol: false, edta: false };
	const qc = quyDoiMe(chuanCoc(cu));
	const moCu = moPhongMe({ dau: 'huong-duong', phanTramDau: 20, nhuHoa: 'tween80', phanTramNhuHoa: 1, phanTramXanthan: 0.2, khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: false }, nhietVao: 25 });
	const moMoi = moPhongMe({ dau: 'huong-duong', phanTramDau: qc.phanTramDau, nhuHoa: 'tween80', phanTramNhuHoa: qc.phanTramNhuHoa, phanTramXanthan: qc.phanTramXanthan, khuay: { rpm: 10000, phut: 2 }, dongHoa: { bar: 300, soLan: 1, lamLanh: false }, nhietVao: 25 });
	dung('P1: mẫu lưu trước gói này (không có me) lấy ra cho cùng d32 như trước', chuanCoc(cu).me === 100 && chuanCoc(cu).nuocTuBu === true && moCu.d32 === moMoi.d32 && moCu.nhietRa === moMoi.nhietRa);
	// P2
	const T = THIET_BI;
	dung('P2: số trong THIET_BI khớp bản thiết kế', T.khuay.theTichML[0] === 1 && T.khuay.theTichML[1] === 2000 && T.khuay.nhotToiDaMPas === 5000 && T.dongHoa.theTichToiThieuML === 30 && T.dongHoa.theTichNamLaiML === 15
		&& T.nhieuXaLaser.daiMay[0] === 0.01 && T.nhieuXaLaser.daiMay[1] === 3500 && T.nhieuXaLaser.daiTinCay[0] === 0.1 && T.nhieuXaLaser.daiTinCay[1] === 1000
		&& T.dls.daiMay[0] === 0.0003 && T.dls.daiMay[1] === 10 && T.dls.daiTinCay[0] === 0.003 && T.dls.daiTinCay[1] === 5);
	{
		const ngJ = JSON.parse(fs.readFileSync(new URL('../nguon/nguon.json', import.meta.url), 'utf8'));
		const co = new Set(ngJ.map((e) => e.khoa));
		const thieu = khoaNguonThietBi().filter((k) => !co.has(k));
		dung(`P2: mọi khóa nguồn của bảng máy có trong nguon.json (${khoaNguonThietBi().length} khóa)`, thieu.length === 0);
	}
	const l1 = doHat({ d32: 1, sigma: 0.45 }, 'nhieuXaLaser');
	const l2 = doHat({ d32: 0.05, sigma: 0.3 }, 'nhieuXaLaser');
	const l3 = doHat({ d32: 40, sigma: 0.75 }, 'dls');
	const l4 = doHat({ d32: 3, sigma: 0.45 }, 'dls');
	dung('P2: d32 1 µm bằng laser → đo được, không cảnh báo', l1.doDuoc && l1.canhBao.length === 0);
	dung('P2: d32 0,05 µm bằng laser → đo được nhưng có cảnh báo xám (dưới 0,1 µm tin cậy)', l2.doDuoc && l2.canhBao.length === 1 && l2.canhBao[0].muc === 'xam');
	dung('P2: d32 40 µm bằng DLS → không đo được (cả dải trên 10 µm)', !l3.doDuoc && l3.canhBao[0].muc === 'vang');
	const pb4 = dacTrungPhanBo(3, 0.45);
	const muc4 = pb4.dv90 > 10 ? 'vang' : pb4.dv90 > 5 ? 'xam' : null;
	dung('P2: d32 3 µm bằng DLS → đo được, cảnh báo theo d_v90 (tính ra), và DLS không in số cỡ hạt', l4.doDuoc && l4.canhBao.some((w) => w.muc === muc4) && Object.keys(l4.so).length === 0 && l4.ghiChu.some((g) => /Z-average/.test(g)));
	dung('P2: D[p,q] = d32·exp((p+q−5)σ²/2) khớp dacTrungPhanBo cho d32 và d43 (1e-12)', (() => { const pb = dacTrungPhanBo(1.7, 0.6); return Math.abs(momen(1.7, 0.6, 3, 2) - pb.d32) < 1e-12 && Math.abs(momen(1.7, 0.6, 4, 3) - pb.d43) < 1e-12; })());
	dung('P2: laser báo d32, d43, d_v10, d_v50, d_v90 và span = (d90−d10)/d50', (() => { const pb = dacTrungPhanBo(1, 0.45); return gan(l1.so.span, (pb.dv90 - pb.dv10) / pb.dv50, 1e-12) && l1.so.d32 === 1; })());
	const m80 = moPhongMayo({ dauPct: 80 }), m78 = moPhongMayo({ dauPct: 78 });
	const ml = doHat({ dTheTich: m80.duLieu.d_tt, nhan: 'N', nguon: 'li2012mayo' }, 'nhieuXaLaser');
	const md = doHat({ dTheTich: m80.duLieu.d_tt, nhan: 'N', nguon: 'li2012mayo' }, 'dls');
	dung('P2: mayonnaise 80% dầu → đường kính TB theo thể tích 3,04 µm nhãn N; laser đo được, DLS không quy đổi sang Z-average', m80.duLieu.d_tt === 3.04 && MAYO.li2012.nhan === 'N' && ml.doDuoc && ml.so.dTheTich === 3.04 && ml.so.d32 === undefined && md.doDuoc && Object.keys(md.so).length === 0 && md.canhBao.some((w) => /Z-average/.test(w.chu)));
	dung('P2: mayonnaise 78% dầu → ngoài vùng có dữ liệu, không có số để đo', m78.duLieu === null && m78.ngoaiVung);
	dung('P2: bàn chưa tính cỡ giọt thì máy đo không đoán số', !doHat({}, 'nhieuXaLaser').doDuoc && /chưa tính cỡ giọt/.test(doHat({}, 'dls').canhBao[0].chu));
	dung('P2: chữ dải đo đúng dạng "0,01–3.500 µm" và "0,3 nm–10 µm"', chuDai(T.nhieuXaLaser.daiMay) === '0,01–3.500 µm' && chuDai(T.dls.daiMay) === '0,3 nm–10 µm');
}

// Thuật ngữ: trong chữ của phòng lab, hiện tượng giọt nhập lại với nhau gọi là "hợp giọt" (không dùng "hợp nhất")
{
	const tep = fs.readdirSync(new URL('../public/phong-lab/', import.meta.url)).filter((f) => f.endsWith('.js'));
	const sai = tep.filter((f) => /hợp nhất|tải bề mặt/.test(fs.readFileSync(new URL(`../public/phong-lab/${f}`, import.meta.url), 'utf8')));
	dung(`Chữ phòng lab dùng "hợp giọt", "độ phủ bề mặt" (không "hợp nhất", "tải bề mặt")${sai.length ? ': còn ở ' + sai.join(', ') : ''}`, sai.length === 0);
}

console.log(loi ? `\n${loi} phép kiểm SAI` : '\nTất cả phép kiểm phòng lab ĐẠT');
process.exit(loi ? 1 : 0);
