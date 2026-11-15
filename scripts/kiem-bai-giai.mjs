// Kiểm trang Bài giải mẫu (src/data/bai-giai-mau.mjs). Chạy: npm run kiem (hoặc node scripts/kiem-bai-giai.mjs)
// Kiểm: (1) máy và ô điền sẵn có thật trong public/may-tinh.js; (2) đủ đề, 3 nấc, lời giải, không có NaN/undefined;
// (3) mọi đoạn mang nhãn N/K/T/G, nhãn K không đè lên câu có số (máy in sẽ ẩn), khóa nguồn @khoa có trong nguon.json;
// (4) số trong lời giải khớp số TÍNH TAY ĐỘC LẬP (bảng TAY_TINH, tính bằng Python/bằng tay, không dùng cong-thuc.js);
// (5) trang may-tinh.md chỉ trỏ tới bài có thật.
import fs from 'node:fs';
import { BAI_GIAI, lienKetMay, trangBaiGiai } from '../src/data/bai-giai-mau.mjs';
import { SO_DON_VI } from '../src/plugins/remark-nhan.mjs';
import { stokes, chatNhuHoaToiThieu, banKinhNhoNhat, laplace, debye, ostwald, pickering, hlbTron, hlbPhanA, q10DoiThoiGian, arrhenius } from '../public/cong-thuc.js';
import { ivSv, giaTriF } from '../public/cong-thuc.js'; // gói 3

let loi = 0;
const sai = (m) => {
	loi++;
	console.log(`SAI  ${m}`);
};
const dat = (m) => console.log(`ĐẠT  ${m}`);
const so = (x, n = 3) => x.toLocaleString('vi-VN', { maximumSignificantDigits: n });

const mayTinh = fs.readFileSync('public/may-tinh.js', 'utf8');
const nguon = new Set(JSON.parse(fs.readFileSync('nguon/nguon.json', 'utf8')).map((e) => e.khoa));

// khối của một máy trong may-tinh.js: từ "<id>: {" đến máy kế tiếp
function khoiMay(id) {
	const m = new RegExp(`\\n\\t(?:'${id}'|${id}): \\{`).exec(mayTinh);
	if (!m) return null;
	const sau = mayTinh.slice(m.index + m[0].length);
	const het = sau.search(/\n\t(?:'[a-z0-9-]+'|[a-z0-9]+): \{/);
	return het < 0 ? sau : sau.slice(0, het);
}
function oCuaMay(khoi) {
	const ten = new Set([...khoi.matchAll(/\bo\('([a-zA-Z0-9]+)'/g)].map((x) => x[1]));
	if (khoi.includes('.map(([ten, nhan, md])')) for (const m of khoi.matchAll(/\['(c\d+)', '/g)) ten.add(m[1]); // máy IV/SV dựng ô từ bảng acid béo
	if (khoi.includes('`t${i}`')) for (let i = 0; i < 5; i++) ten.add(`t${i}`).add(`d${i}`); // máy Ostwald dựng ô bằng vòng lặp
	if (khoi.includes('`c${i}`')) for (let i = 0; i < 4; i++) ten.add(`c${i}`).add(`t${i}`); // máy Arrhenius: 4 cặp (nhiệt độ, thời gian)
	return ten;
}

// Số tính tay độc lập: [giá trị, số chữ số có nghĩa dùng khi viết trong lời giải], hoặc chuỗi viết sẵn cho số dạng a × 10ⁿ. Nguồn: Python 2026-11-15 (xem lịch sử PR).
const TAY_TINH = {
	stokes: { phan: 'loi', so: [[7.53408, 3], [226.0224, 3], [56.5056, 3], [26.546041, 3], '8,72 × 10⁻⁸'] },
	'chat-nhu-hoa-toi-thieu': { phan: 'loi', so: [[2400, 3], [4.8, 3], [0.48, 3], [800, 3], [400, 3], [7.2, 3], [14.4, 3]] },
	laplace: { phan: 'loi', so: [[0.04, 3], [0.4, 3], [2, 3], [4000, 3], [40000, 3], [200000, 3]] },
	debye: { phan: 'loi', so: [[3.04, 3], [1.9226648, 3], [2.4821496, 3], [25, 3], [15, 3]] },
	ostwald: { phan: 'loi', so: ['1,05 × 10⁻⁴', '1,31 × 10⁻⁵', [0.99994995, 4], [0.9905854, 4], [0.23407193, 3]] },
	// Gói 2 (Python 2026-11-15): kT = 1,380649e-23 × 298,15; ΔE = π r² γ (1 − |cos θ|)²; hồi quy ln t theo 1/T tính bằng công thức bình phương tối thiểu viết tay
	pickering: { phan: 'loi', so: ['5,89 × 10⁻¹⁷', '4,12 × 10⁻²¹', '1,43 × 10⁴', [14309.783, 3], [143.09783, 3], [100, 3], '1,03 × 10³', [13.928203, 3], [0.8660254, 3]] },
	hlb: { phan: 'loi', so: ['= **12**', '**40% A + 60% B**', '**4 g chất A**', '**6 g chất B**', 'HLB 10 cần 50% A', 'HLB 12 cần 30% A', '= −0,1', '"âm 10% A"'] },
	q10: { phan: 'loi', so: [[59.39697, 3], [38.579463, 3], [109.1192, 3], [3.5894474, 3], [2.8284271, 3], [129.04699, 3]] },
	arrhenius: { phan: 'loi', so: [[10228.39, 4], [85.038839, 3], [0.99988893, 4], [7.9210086, 3], [11239.704, 3], [468.321, 3], [15.405296, 3], [3.0443735, 3], [2.045025, 3]] },
};
// Và các tương quan chữ phải đúng với số (câu "lớn hơn", "thẳng hơn" trong lời giải)
const QUAN_HE = {
	stokes: () => stokes(2, 1000, 920, 2).mmMoiNgay * 30 > 200 && Math.abs(stokes(1, 1000, 920, 2).mmMoiNgay * 4 - stokes(2, 1000, 920, 2).mmMoiNgay) < 1e-9,
	'chat-nhu-hoa-toi-thieu': () => Math.abs(banKinhNhoNhat(0.2, 2, 3).dNm / 1000 - 0.5 * (chatNhuHoaToiThieu(0.2, 0.5, 2).cGL / 3)) < 1e-9,
	laplace: () => Math.abs(laplace(10, 0.2).bar / laplace(10, 1).bar - 5) < 1e-9,
	debye: () => debye(0.025) < debye(0.015) && debye(0.015) < debye(0.01),
	ostwald: () => {
		const k = ostwald([[0, 0.15], [14, 0.169], [28, 0.185], [42, 0.198], [56, 0.21]]);
		return k.r2D3 > k.r2D && k.doDocD3 > 0;
	},
	// "bằng đúng lô 60°", "kém đúng 100 lần", "lô 30° bám yếu hơn"
	pickering: () => {
		const E = (r, th) => pickering(r, 30, th, 298.15).kT;
		return Math.abs(E(50, 120) / E(50, 60) - 1) < 1e-9 && Math.abs(E(50, 60) / E(5, 60) - 100) < 1e-6 && E(50, 30) < E(50, 60) && E(50, 60) < E(50, 90);
	},
	// "không đạt được HLB 16", "cả ba điểm nằm trong dải 10–18", "tăng 1 đơn vị HLB thì bớt 10% A"
	hlb: () =>
		hlbPhanA(5, 15, 16) === null && Math.abs(hlbTron(5, 15, hlbPhanA(5, 15, 11)) - 11) < 1e-9 && Math.abs(hlbPhanA(5, 15, 10) - hlbPhanA(5, 15, 11) - 0.1) < 1e-9 && [10, 11, 12].every((h) => h >= 10 && h <= 18),
	// "chưa đầy 2 tháng", "hơn 4 tháng", "chưa đỡ được hạn 12 tháng", khoảng Q10 1,5–3 bao lấy kết quả Q10 = 2
	q10: () => {
		const t = (q) => q10DoiThoiGian(21, 40, 25, q), nguoc = q10DoiThoiGian(365, 25, 40, 2);
		return t(1.5) < t(2) && t(2) < t(3) && t(2) / 30.4 < 2 && nguoc / 30.4 > 4 && nguoc / 30.4 < 5 && nguoc > 21;
	},
	// "nằm giữa 11,5 và 5,6 giờ", "Q10 đổi theo nhiệt độ", 25 °C nằm ngoài khoảng đo, máy ghi R² = 1 ở ba chữ số
	arrhenius: () => {
		const k = arrhenius([[90, 24], [100, 11.5], [110, 5.6], [120, 2.8]]);
		return k.thoiGianTai(105) < 11.5 && k.thoiGianTai(105) > 5.6 && k.q10Tai(25) > k.q10Tai(100) && k.r2 > 0.999 && so(k.r2, 3) === '1' && 25 < 90 && 90 - 25 === 65;
	},
};

// Gói 3 (thêm bằng Object.assign để không đụng chỗ gói khác thêm dòng vào hai bảng phía trên)
// Số tính tay bằng Python viết lại độc lập công thức (khối lượng nguyên tử IUPAC làm tròn như máy), 2026-11-15.
const f_ = (pH, pKa) => 1 / (1 + 10 ** (pH - pKa));
Object.assign(TAY_TINH, {
	totox: { phan: 'loi', so: ['**8**', '**34**', '**40**', '30%', '70%'] },
	'iv-sv': { phan: 'loi', so: [[282.468, 6], [89.85407, 3], [140.1528, 4], [279.237, 4], [875.760, 4], [134.0636, 4], [192.1965, 4], [9.0636, 2], [6.7596, 2], [101.8898, 4], [192.3067, 4]] },
	'axit-yeu': { phan: 'loi', so: [[83.36625, 3], [833.6625, 3], [44.26884, 3], [442.6884, 3], [1883.1813, 3], [1.88318, 3], [7.35876, 3], [6.015805, 3]] },
	'gia-tri-f': { phan: 'loi', so: [[0.316228, 3], [6.32456, 3], [4.21637, 3], [63.2456, 3], [3.16228, 3]] },
});
Object.assign(QUAN_HE, {
	totox: () => 2 * 6 <= 12 && 6 <= 10 && 12 > 10 && 2 * 12 + 10 > 30 && 2 * 6 + 28 > 30 && 2 * 2 + 4 <= 30 && Math.abs((2 * 6) / (2 * 6 + 28) - 0.3) < 1e-9,
	'iv-sv': () => {
		const kq = ivSv([[16, 0, 7], [18, 0, 4], [18, 1, 25], [18, 2, 62], [18, 3, 2]]);
		const mac = ivSv([[16, 0, 10], [18, 0, 4], [18, 1, 60], [18, 2, 20], [18, 3, 6]]);
		return kq.ivDau > 125 && Math.abs(ivSv([[18, 1, 100]]).iv - 89.854) < 0.01 && Math.abs(kq.sv - mac.sv) < 0.2 && kq.ivDau - mac.ivDau > 30;
	},
	'axit-yeu': () => f_(3.8, 4.5) > f_(4.6, 4.5) && f_(4.6, 4.5) / f_(5.6, 4.5) < 10 && f_(3.8, 4.5) / f_(4.6, 4.5) < f_(4.6, 4.5) / f_(5.6, 4.5),
	'gia-tri-f': () => 10 ** ((110 - 120) / 10) === 0.1 && giaTriF(20, 115, 120, 10, 1.5).F / 0.1 > 20 * 2 && Math.abs(giaTriF(20, 115, 120, 10, 1.5).logGiam - 6.32456 / 1.5) < 1e-4,
});

const ids = new Set();
for (const b of BAI_GIAI) {
	const ten = `bài "${b.id}"`;
	if (ids.has(b.id)) sai(`${ten}: trùng id`);
	ids.add(b.id);
	// (1) máy và ô
	const khoi = khoiMay(b.id);
	if (!khoi) {
		sai(`${ten}: không có máy "${b.id}" trong public/may-tinh.js`);
		continue;
	}
	const o = oCuaMay(khoi);
	const la = Object.keys(b.nhap).filter((k) => !o.has(k));
	la.length ? sai(`${ten}: ô điền sẵn không có trong máy: ${la.join(', ')}`) : dat(`${ten}: ${Object.keys(b.nhap).length} ô điền sẵn đều có trong máy`);
	const lk = lienKetMay(b);
	if (!/^\.\.\/may-tinh\/\?[^#\s]+#mt-/.test(lk) || /[<>"' ]/.test(lk)) sai(`${ten}: liên kết mở máy sai dạng: ${lk}`);
	// (2) đủ phần
	const v = b.viet();
	for (const p of ['de', 'nac1', 'nac2', 'nac3', 'loi']) {
		if (typeof v[p] !== 'string' || v[p].length < 60) sai(`${ten}: thiếu hoặc quá ngắn phần ${p}`);
		else if (/NaN|undefined|Infinity|\[object/.test(v[p])) sai(`${ten}: phần ${p} có NaN/undefined`);
	}
	// (3) nhãn
	for (const p of ['de', 'nac1', 'nac2', 'nac3', 'loi']) {
		const khoiChu = v[p].replace(/\$\$[\s\S]*?\$\$/g, '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
		for (const kc of khoiChu) {
			if (kc.startsWith('|')) continue; // bảng số liệu của đề
			const coNhan = /\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/.test(kc);
			const cauHoi = p === 'de' && kc.startsWith('**(');
			if (!coNhan && !cauHoi) sai(`${ten}, ${p}: đoạn không có nhãn: "${kc.slice(0, 50)}…"`);
			const nhan = [...kc.matchAll(/\[(N|K|T|G)(?:[:;][^\]\n]*)?\]/g)].map((m) => m[1]);
			if (nhan.length && nhan.every((x) => x === 'K') && SO_DON_VI.test(kc)) sai(`${ten}, ${p}: đoạn chỉ có nhãn K mà chứa số kèm đơn vị (sẽ bị ẩn): "${kc.slice(0, 50)}…"`);
			for (const [, k] of kc.matchAll(/@([a-z][a-z0-9]*(?:-[a-z0-9]+)*)/g)) if (!nguon.has(k)) sai(`${ten}, ${p}: khóa nguồn @${k} không có trong nguon.json`);
		}
	}
	// (4) số tính tay
	const tay = TAY_TINH[b.id];
	if (!tay) sai(`${ten}: chưa có dòng số tính tay trong TAY_TINH`);
	else {
		const chu = (t) => (typeof t === 'string' ? t : so(t[0], t[1]));
		const thieu = tay.so.filter((t) => !v[tay.phan].includes(chu(t)));
		thieu.length ? sai(`${ten}: lời giải thiếu số tính tay ${thieu.map(chu).join('; ')}`) : dat(`${ten}: ${tay.so.length} số trong lời giải khớp số tính tay`);
	}
	if (!QUAN_HE[b.id]) sai(`${ten}: chưa có phép kiểm tương quan chữ-số`);
	else QUAN_HE[b.id]() ? dat(`${ten}: các câu so sánh trong lời giải đúng với số`) : sai(`${ten}: một câu so sánh trong lời giải không còn đúng với số`);
}

// (5) trang tổng và liên kết từ trang Máy tính
const trang = trangBaiGiai(13);
for (const id of ids) if (!trang.includes(`id="bg-${id}"`)) sai(`trang thiếu neo bg-${id}`);
if (BAI_GIAI.length > 13) sai('nhiều hơn 13 bài (mỗi máy một bài)');
const mt = fs.readFileSync('src/content/docs/may-tinh.md', 'utf8');
for (const [, id] of mt.matchAll(/bai-giai-mau\/#bg-([a-z0-9-]+)/g)) if (!ids.has(id)) sai(`may-tinh.md trỏ tới bài giải chưa có: ${id}`);
console.log(`${BAI_GIAI.length}/13 bài giải mẫu`);
if (loi) {
	console.log(`kiem-bai-giai: ${loi} lỗi`);
	process.exit(1);
}
console.log('kiem-bai-giai: đạt');
