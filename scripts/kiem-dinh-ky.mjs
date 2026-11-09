// Kiểm định kỳ (chạy tay hoặc theo lịch hằng tháng trên GitHub Actions). CHỈ BÁO CÁO, không tự sửa gì.
//  1) Khóa nguồn @khoa dùng trong bài nhưng không có trong nguon/nguon.json.
//  2) Bảng pháp lý đã quá hạn kiểm lại chưa (nguon/han-kiem-lai.json).
//  3) Liên kết ngoài (trong bài và trong nguon.json) có còn mở được không.
// Dùng: node scripts/kiem-dinh-ky.mjs [--khong-mang] [--gioi-han=N]
// Mã thoát: 1 nếu có khóa thiếu; liên kết hỏng và quá hạn chỉ cảnh báo (mã 0) trừ khi thêm --nghiem.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const khongMang = args.includes('--khong-mang');
const nghiem = args.includes('--nghiem');
const gioiHan = Number((args.find((a) => a.startsWith('--gioi-han=')) || '').split('=')[1]) || Infinity;
const goc = process.cwd();

function* duyet(dir) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) yield* duyet(p);
		else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) yield p;
	}
}
const tep = [...duyet(path.join(goc, 'noi-dung')), ...duyet(path.join(goc, 'trang'))];
// src/content/docs: chỉ lấy trang viết tay ở gốc (khu sinh tự động bị bỏ)
for (const e of fs.readdirSync(path.join(goc, 'src/content/docs'), { withFileTypes: true })) {
	if (e.isFile() && /\.mdx?$/.test(e.name)) tep.push(path.join(goc, 'src/content/docs', e.name));
}

const nguon = JSON.parse(fs.readFileSync(path.join(goc, 'nguon/nguon.json'), 'utf8'));
const coKhoa = new Set(nguon.map((e) => e.khoa));
const MAU = new Set(['khoa', 'kh']); // ví dụ định dạng trong trang quy ước, không phải khóa thật

// 1) khóa nguồn
const thieu = new Map();
const lienKet = new Map(); // url -> nơi dùng
for (const f of tep) {
	const t = fs.readFileSync(f, 'utf8');
	for (const m of t.matchAll(/\[(?:[^\]]*?)N:\s*([^\]]+)\]/g)) {
		for (const k of m[1].matchAll(/@([a-z0-9_-]+)/gi)) {
			if (!coKhoa.has(k[1]) && !MAU.has(k[1])) (thieu.get(k[1]) ?? thieu.set(k[1], []).get(k[1])).push(path.relative(goc, f));
		}
	}
	for (const m of t.matchAll(/https?:\/\/[^\s)\]>"'`]+/g)) {
		const u = m[0].replace(/[.,;:]+$/, '');
		if (!lienKet.has(u)) lienKet.set(u, path.relative(goc, f));
	}
}
for (const e of nguon) if (e.url && /^https?:/.test(e.url) && !lienKet.has(e.url)) lienKet.set(e.url, `nguon:${e.khoa}`);

let loi = 0;
console.log(`== 1) Khóa nguồn thiếu trong nguon.json: ${thieu.size}`);
for (const [k, ds] of thieu) console.log(`  - @${k} (vd ${ds[0]})`);
if (thieu.size) loi = 1;

// 2) hạn kiểm lại
console.log('\n== 2) Bảng pháp lý, hạn kiểm lại');
const han = JSON.parse(fs.readFileSync(path.join(goc, 'nguon/han-kiem-lai.json'), 'utf8'));
let quaHan = 0;
for (const m of han.muc) {
	let tt;
	if (!m.kiem_lan_cuoi) tt = 'CHƯA có ngày kiểm được ghi nhận';
	else {
		const ngay = (Date.now() - Date.parse(m.kiem_lan_cuoi)) / 86400000;
		tt = ngay > m.chu_ky_ngay ? `QUÁ HẠN (${Math.round(ngay)} ngày, chu kỳ ${m.chu_ky_ngay})` : `còn hạn (${Math.round(ngay)} ngày)`;
	}
	if (/CHƯA|QUÁ/.test(tt)) quaHan++;
	console.log(`  - ${m.ten}: ${tt}. Cần đối chiếu: ${m.can_doi_chieu}`);
}

// 3) liên kết ngoài
console.log(`\n== 3) Liên kết ngoài: ${lienKet.size} địa chỉ`);
const hong = [];
const khongKetLuan = [];
if (!khongMang) {
	const ds = [...lienKet.entries()].slice(0, gioiHan);
	let i = 0;
	const hoi = async (u) => {
		for (const method of ['HEAD', 'GET']) {
			try {
				const r = await fetch(u, { method, redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'nhu-tuong-kiem-lien-ket (+https://github.com/vinh210a1-ship-it/nhu-tuong)' } });
				if (r.ok) return 'ok';
				if (r.status === 404 || r.status === 410) return `hỏng ${r.status}`;
				if (method === 'GET') return `không kết luận ${r.status}`; // 403/429/5xx: nhiều nhà xuất bản chặn máy
			} catch (e) {
				if (method === 'GET') return `không kết luận ${e.cause?.code ?? e.name}`;
			}
		}
	};
	await Promise.all(
		Array.from({ length: 8 }, async () => {
			while (i < ds.length) {
				const [u, noi] = ds[i++];
				const kq = await hoi(u);
				if (kq?.startsWith('hỏng')) hong.push(`${kq}  ${u}  (${noi})`);
				else if (kq?.startsWith('không')) khongKetLuan.push(`${kq}  ${u}`);
			}
		}),
	);
	console.log(`  mở được: ${ds.length - hong.length - khongKetLuan.length}; hỏng (404/410): ${hong.length}; không kết luận (bị chặn/quá chậm): ${khongKetLuan.length}`);
	for (const h of hong) console.log('  HỎNG ' + h);
} else console.log('  (bỏ qua: --khong-mang)');

console.log(`\nTóm tắt: khóa thiếu ${thieu.size}, liên kết hỏng ${hong.length}, bảng pháp lý cần kiểm ${quaHan}.`);
if (nghiem && (hong.length || quaHan)) loi = 1;
process.exit(loi);
