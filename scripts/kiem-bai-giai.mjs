// Kiểm trang Bài giải mẫu (src/data/bai-giai-mau.mjs). Chạy: npm run kiem (hoặc node scripts/kiem-bai-giai.mjs)
// Kiểm: (1) máy và ô điền sẵn có thật trong public/may-tinh.js; (2) đủ đề, 3 nấc, lời giải, không có NaN/undefined;
// (3) mọi đoạn mang nhãn N/K/T/G, nhãn K không đè lên câu có số (máy in sẽ ẩn), khóa nguồn @khoa có trong nguon.json;
// (4) số trong lời giải khớp số TÍNH TAY ĐỘC LẬP (bảng TAY_TINH, tính bằng Python/bằng tay, không dùng cong-thuc.js);
// (5) trang may-tinh.md chỉ trỏ tới bài có thật.
import fs from 'node:fs';
import { BAI_GIAI, lienKetMay, trangBaiGiai } from '../src/data/bai-giai-mau.mjs';
import { SO_DON_VI } from '../src/plugins/remark-nhan.mjs';
import { stokes, chatNhuHoaToiThieu, banKinhNhoNhat, laplace, debye, ostwald } from '../public/cong-thuc.js';

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
	if (khoi.includes('`t${i}`')) for (let i = 0; i < 5; i++) ten.add(`t${i}`).add(`d${i}`); // máy Ostwald dựng ô bằng vòng lặp
	return ten;
}

// Số tính tay độc lập: [giá trị, số chữ số có nghĩa dùng khi viết trong lời giải], hoặc chuỗi viết sẵn cho số dạng a × 10ⁿ. Nguồn: Python 2026-11-15 (xem lịch sử PR).
const TAY_TINH = {
	stokes: { phan: 'loi', so: [[7.53408, 3], [226.0224, 3], [56.5056, 3], [26.546041, 3], '8,72 × 10⁻⁸'] },
	'chat-nhu-hoa-toi-thieu': { phan: 'loi', so: [[2400, 3], [4.8, 3], [0.48, 3], [800, 3], [400, 3], [7.2, 3], [14.4, 3]] },
	laplace: { phan: 'loi', so: [[0.04, 3], [0.4, 3], [2, 3], [4000, 3], [40000, 3], [200000, 3]] },
	debye: { phan: 'loi', so: [[3.04, 3], [1.9226648, 3], [2.4821496, 3], [25, 3], [15, 3]] },
	ostwald: { phan: 'loi', so: ['1,05 × 10⁻⁴', '1,31 × 10⁻⁵', [0.99994995, 4], [0.9905854, 4], [0.23407193, 3]] },
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
};

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
