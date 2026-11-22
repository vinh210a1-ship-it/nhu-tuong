// Kiểm gói T4-3: nút lọc theo mức đọc ở trang /nguon/. Cần bản đã build (dist/) và Playwright, giống kiem-muc-doc-js.
// Chạy sau `npm run build`: npm run kiem-loc-nguon
//  1) Mỗi nút mức hiện ĐÚNG số thẻ có data-muc đó (đối chiếu nguon/nguon.json); "Tất cả" hiện đủ.
//  2) Nút kết hợp với ô chữ (cả hai cùng lọc), dòng đếm báo đúng số, nút đang chọn có aria-pressed="true".
//  3) Địa chỉ ?muc=<mã> chọn sẵn đúng mức; mã lạ thì bỏ qua (hiện đủ).
//  4) 375 px không tràn ngang; mỗi nút cao tối thiểu 44 px (đủ chạm).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { MUC_DOC } from '../src/data/muc-doc.mjs';

const GOC = process.cwd();
const DIST = path.join(GOC, 'dist');
const BASE = '/nhu-tuong';
const require = createRequire(import.meta.url);
let chromium;
try {
	({ chromium } = require('playwright'));
} catch {
	console.error('kiem-loc-nguon: thiếu playwright. Chạy: npm install --no-save playwright && npx playwright install chromium');
	process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'nguon', 'index.html'))) {
	console.error('kiem-loc-nguon: không thấy dist/nguon/index.html. Chạy "npm run build" trước.');
	process.exit(1);
}
const nguon = JSON.parse(fs.readFileSync(path.join(GOC, 'nguon/nguon.json'), 'utf8'));
const dem = (ma) => nguon.filter((e) => e.muc_doc === ma).length;

const KIEU = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const may = http.createServer((req, res) => {
	let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	if (!p.startsWith(BASE + '/')) p = BASE + p;
	let f = path.join(DIST, p.slice(BASE.length));
	if (!f.startsWith(DIST)) return void res.writeHead(403).end();
	if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
	if (!fs.existsSync(f)) return void res.writeHead(404).end('not found');
	res.writeHead(200, { 'content-type': KIEU[path.extname(f)] || 'application/octet-stream' }).end(fs.readFileSync(f));
});
await new Promise((ok) => may.listen(0, '127.0.0.1', ok));
const URL_GOC = `http://127.0.0.1:${may.address().port}${BASE}`;

const loi = [];
const kiem = (dk, lo) => { if (!dk) loi.push(lo); };
const trinh = await chromium.launch();
try {
	for (const [ten, rong] of [['1280 px', 1280], ['375 px', 375]]) {
		const p = await trinh.newPage({ viewport: { width: rong, height: 800 } });
		const loiScript = [];
		p.on('pageerror', (e) => loiScript.push(e.message));
		await p.goto(`${URL_GOC}/nguon/`, { waitUntil: 'networkidle' });
		const hien = () => p.evaluate(() => [...document.querySelectorAll('.the-nguon')].filter((t) => !t.hidden).length);
		const hienMuc = (ma) => p.evaluate((m) => [...document.querySelectorAll('.the-nguon')].filter((t) => !t.hidden && t.dataset.muc === m).length, ma);
		kiem((await hien()) === nguon.length, `${ten}: lúc đầu phải hiện đủ ${nguon.length} thẻ`);
		const nut = await p.locator('[data-loc-muc]').count();
		kiem(nut === Object.keys(MUC_DOC).length + 1, `${ten}: cần ${Object.keys(MUC_DOC).length + 1} nút, thấy ${nut}`);
		for (const ma of Object.keys(MUC_DOC)) {
			await p.click(`[data-loc-muc="${ma}"]`);
			const n = await hien();
			kiem(n === dem(ma) && (await hienMuc(ma)) === n, `${ten}: nút "${ma}" hiện ${n} thẻ, nguon.json có ${dem(ma)}`);
			kiem((await p.getAttribute(`[data-loc-muc="${ma}"]`, 'aria-pressed')) === 'true', `${ten}: nút "${ma}" thiếu aria-pressed="true" khi đang chọn`);
			kiem((await p.locator('[data-loc-muc][aria-pressed="true"]').count()) === 1, `${ten}: cùng lúc chỉ một nút được chọn`);
			kiem((await p.textContent('[data-dem-nguon]')).includes(`Đang hiện ${dem(ma)} trong ${nguon.length}`), `${ten}: dòng đếm sai ở mức "${ma}"`);
		}
		// kết hợp với ô chữ: lấy một từ khóa có thật trong một thẻ mức tóm tắt
		await p.click('[data-loc-muc="tom-tat"]');
		await p.fill('#loc-nguon', 'zzzkhongco');
		kiem((await hien()) === 0 && (await p.textContent('[data-dem-nguon]')).includes('Không có nguồn nào khớp'), `${ten}: ô chữ vô nghĩa phải cho 0 thẻ và báo không khớp`);
		await p.fill('#loc-nguon', '');
		kiem((await hien()) === dem('tom-tat'), `${ten}: xóa ô chữ thì chỉ còn lọc theo mức`);
		await p.click('[data-loc-muc=""]');
		kiem((await hien()) === nguon.length && (await p.textContent('[data-dem-nguon]')).trim() === '', `${ten}: "Tất cả" phải hiện đủ và xóa dòng đếm`);
		const cao = await p.evaluate(() => Math.min(...[...document.querySelectorAll('[data-loc-muc]')].map((n) => n.getBoundingClientRect().height)));
		kiem(cao >= 44, `${ten}: nút lọc cao ${cao} px, cần ≥ 44 px`);
		const trangTran = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
		kiem(!trangTran, `${ten}: trang tràn ngang`);
		kiem(!loiScript.length, `${ten}: lỗi script ${loiScript.join('; ')}`);
		await p.close();
	}
	// địa chỉ ?muc=
	const p = await trinh.newPage();
	await p.goto(`${URL_GOC}/nguon/?muc=toan-van`, { waitUntil: 'networkidle' });
	kiem((await p.evaluate(() => [...document.querySelectorAll('.the-nguon')].filter((t) => !t.hidden).length)) === dem('toan-van'), '?muc=toan-van phải chọn sẵn mức toàn văn');
	kiem((await p.getAttribute('[data-loc-muc="toan-van"]', 'aria-pressed')) === 'true', '?muc=toan-van: nút toàn văn phải được chọn');
	await p.goto(`${URL_GOC}/nguon/?muc=khong-co`, { waitUntil: 'networkidle' });
	kiem((await p.evaluate(() => [...document.querySelectorAll('.the-nguon')].filter((t) => !t.hidden).length)) === nguon.length, '?muc= mã lạ phải bị bỏ qua');
} finally {
	await trinh.close();
	may.close();
}
if (loi.length) {
	console.log(`kiem-loc-nguon: ${loi.length} lỗi`);
	for (const l of loi) console.log('  - ' + l);
	process.exit(1);
}
console.log('kiem-loc-nguon: đạt (5 nút mức + "Tất cả" khớp nguon.json ở 1280 và 375 px, kết hợp ô chữ, ?muc=, nút ≥ 44 px, không tràn ngang)');
