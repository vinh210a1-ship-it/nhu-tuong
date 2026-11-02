// Kiểm bộ máy tính toán của Phòng lab ảo: công thức con khớp với bài, và các hiện tượng
// hóa học đi đúng chiều (áp suất thấp → giọt to → kem hóa nhanh, v.v.).
// Chạy: npm run kiem
import { chatNhuHoaToiThieu, stokes } from '../public/cong-thuc.js';
import {
	dTheoChatNhuHoa, dTheoApSuat, nhietDoRa, dacTrungPhanBo, phanSoTheTich, doNhotXanthan,
	moPhongMe, NHIEM_VU, chamSao, doKhongNo, thoiGianCamUng, chiSoPeroxide, doNhotNuoc, DAU, PV_NGUONG,
} from '../public/phong-lab/mo-hinh.js';
import {
	moPhongThit, ngayTBARS, heSoPH, NHIEM_VU_THIT, chamSaoThit,
	awUocTinh, MAM_BENH, moPhongBaoQuan, chiSoUcChe, NHIEM_VU_BQ, chamSaoBQ,
} from '../public/phong-lab/mo-hinh-thuc-pham.js';

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

console.log(loi ? `\n${loi} phép kiểm SAI` : '\nTất cả phép kiểm phòng lab ĐẠT');
process.exit(loi ? 1 : 0);
