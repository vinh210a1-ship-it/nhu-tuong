// Kiểm bộ máy tính toán của Phòng lab ảo: công thức con khớp với bài, và các hiện tượng
// hóa học đi đúng chiều (áp suất thấp → giọt to → kem hóa nhanh, v.v.).
// Chạy: npm run kiem
import { chatNhuHoaToiThieu, stokes } from '../public/cong-thuc.js';
import {
	dTheoChatNhuHoa, dTheoApSuat, nhietDoRa, dacTrungPhanBo, phanSoTheTich, doNhotXanthan,
	moPhongMe, NHIEM_VU, chamSao,
} from '../public/phong-lab/mo-hinh.js';

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

// 3. Nhiệm vụ: có lời giải 3 sao, và cách làm ẩu thì không đủ 3 sao
const LOI_GIAI = {
	'sua-thuc-vat': [{ ...me }, { ...me, dongHoa: { bar: 100, soLan: 1, lamLanh: true } }],
	'whey-nong': [
		{ ...whey, dongHoa: { bar: 600, soLan: 2, lamLanh: true } },
		{ ...whey, dongHoa: { bar: 1000, soLan: 3, lamLanh: false } },
	],
	'sot-salad': [{ ...sot, phanTramXanthan: 0.3 }, { ...sot, phanTramXanthan: 0.05 }],
};
for (const nv of NHIEM_VU) {
	const [tot, au] = LOI_GIAI[nv.id];
	const a = chamSao(nv, moPhongMe({ ...tot, ...nv.coDinh })).sao;
	const b = chamSao(nv, moPhongMe({ ...au, ...nv.coDinh })).sao;
	dung(`Nhiệm vụ "${nv.ten}": lời giải được ${a}/3 sao, cách làm ẩu ${b}/3`, a === 3 && b < 3);
}

console.log(loi ? `\n${loi} phép kiểm SAI` : '\nTất cả phép kiểm phòng lab ĐẠT');
process.exit(loi ? 1 : 0);
