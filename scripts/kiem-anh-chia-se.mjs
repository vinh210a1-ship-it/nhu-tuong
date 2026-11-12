// Kiểm ảnh xem trước khi chia sẻ link, chạy sau build (npm run kiem-sau-build gọi tiếp file này):
//   1. đủ 7 ảnh trong dist/chia-se/, đúng 1200 × 630, mỗi ảnh ≤ 150 KB;
//   2. mọi trang có og:image và twitter:image trỏ tới ảnh có thật; trang của khu nào dùng ảnh khu đó.
// Ảnh dựng bằng scripts/dung-anh-chia-se.mjs (một lần, bằng tay), không dựng lúc build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KHU } from '../src/data/khu.mjs';
import { ANH, RONG, CAO, NANG_TOI_DA, coPng } from './dung-anh-chia-se.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(GOC, 'dist');
const GOC_WEB = 'https://vinh210a1-ship-it.github.io/nhu-tuong';
const loi = [];

for (const ten of Object.keys(ANH)) {
	const tep = path.join(DIST, 'chia-se', `${ten}.png`);
	if (!fs.existsSync(tep)) { loi.push(`thiếu ảnh chia-se/${ten}.png (chạy node scripts/dung-anh-chia-se.mjs rồi build lại)`); continue; }
	const { rong, cao, nang } = coPng(tep);
	if (rong !== RONG || cao !== CAO) loi.push(`chia-se/${ten}.png cỡ ${rong} × ${cao}, phải ${RONG} × ${CAO}`);
	if (nang > NANG_TOI_DA) loi.push(`chia-se/${ten}.png nặng ${(nang / 1024).toFixed(0)} KB, quá ${NANG_TOI_DA / 1024} KB`);
}

const trang = [];
(function di(d) {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		if (e.isDirectory()) di(path.join(d, e.name));
		else if (e.name.endsWith('.html')) trang.push(path.join(d, e.name));
	}
})(DIST);
let soTrang = 0;
for (const p of trang) {
	const h = fs.readFileSync(p, 'utf8');
	if (/<meta http-equiv="refresh"/i.test(h.slice(0, 800))) continue; // trang chuyển hướng không có <head> của Starlight
	soTrang++;
	const ten = '/' + path.relative(DIST, p).split(path.sep).join('/').replace(/index\.html$/, '');
	const khu = ten.split('/')[1];
	const can = `${GOC_WEB}/chia-se/${KHU[khu] ? khu : 'trang-chu'}.png`;
	const og = h.match(/<meta property="og:image" content="([^"]+)"/), tw = h.match(/<meta name="twitter:image" content="([^"]+)"/);
	if (!og || !tw) loi.push(`${ten}: thiếu thẻ og:image hoặc twitter:image`);
	else if (og[1] !== can || tw[1] !== can) loi.push(`${ten}: ảnh chia sẻ là "${og[1]}", phải là "${can}"`);
	if (!/<meta name="twitter:card" content="summary_large_image"/.test(h)) loi.push(`${ten}: thiếu twitter:card = summary_large_image`);
}

if (loi.length) {
	console.log(`kiem-anh-chia-se: KHÔNG ĐẠT (${loi.length} lỗi)`);
	for (const l of loi.slice(0, 40)) console.log('  - ' + l);
	process.exit(1);
}
console.log(`kiem-anh-chia-se: đạt (${Object.keys(ANH).length} ảnh ${RONG} × ${CAO}, mỗi ảnh ≤ ${NANG_TOI_DA / 1024} KB; ${soTrang} trang có og:image và twitter:image đúng khu)`);
