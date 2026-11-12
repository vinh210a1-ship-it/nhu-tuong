// Kiểm truy cập (WCAG 2.1 AA) bằng axe-core trên vài trang mẫu của bản đã build (dist/), nền sáng và nền tối, màn hình rộng và điện thoại.
//
// Cách chạy:
//   npm run build
//   npm run kiem-truy-cap            # chế độ báo cáo: in lỗi, luôn thoát mã 0
//   npm run kiem-truy-cap -- --chat  # chế độ chặt: có lỗi thì thoát mã 1
//
// Cần thêm thư viện playwright và một trình duyệt (không có trong dependencies để npm ci nhẹ):
//   npm install --no-save playwright && npx playwright install chromium
// Script tự dựng một máy chủ nhỏ phục vụ dist/ ở địa chỉ gốc /nhu-tuong/, không cần mở cổng ngoài.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';

const GOC = process.cwd();
const DIST = path.join(GOC, 'dist');
const BASE = '/nhu-tuong';
const CHAT = process.argv.includes('--chat');
const TRANG = [
	['trang chủ', `${BASE}/`],
	['trang khu (nhũ tương, có bản đồ lộ trình)', `${BASE}/nhu-tuong/`],
	['trang khu (thực phẩm, có bản đồ lộ trình)', `${BASE}/thuc-pham/`],
	['bài (mất ổn định)', `${BASE}/nhu-tuong/mat-on-dinh/`],
	['bài (nền tảng, có hình cơ chế)', `${BASE}/nhu-tuong/nen-tang/`],
	['bài (chất ổn định, có hình cơ chế)', `${BASE}/nhu-tuong/chat-on-dinh/`],
	['bài (đo lường, có hình cơ chế)', `${BASE}/nhu-tuong/do-luong/`],
	['tra cứu', `${BASE}/tra-cuu/`],
	['bài (chất nhũ hóa)', `${BASE}/chat-nhu-hoa/nen-tang-vat-ly-hoa-be-mat/`],
	['bài (thực phẩm)', `${BASE}/thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung/`],
	['bài (dược phẩm)', `${BASE}/duoc-pham/hoa-tan-sinh-kha-dung-bcs/`],
	['máy tính', `${BASE}/may-tinh/`],
	['phòng lab', `${BASE}/phong-lab/`],
	['chẩn đoán', `${BASE}/chan-doan/`],
	['tá dược', `${BASE}/tra-cuu-ta-duoc/`],
	['số liệu R&D', `${BASE}/so-lieu-rnd/`],
	['nguồn', `${BASE}/nguon/`],
	['giấy phép', `${BASE}/giay-phep/`],
	['nhật ký thay đổi', `${BASE}/nhat-ky-thay-doi/`],
];
// quy tắc axe cần pass; "best-practice" không tính (chỉ WCAG A/AA)
const THE_AXE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const require = createRequire(import.meta.url);
let chromium;
try {
	({ chromium } = require('playwright'));
} catch {
	console.error('kiem-truy-cap: thiếu thư viện playwright. Chạy: npm install --no-save playwright && npx playwright install chromium');
	process.exit(CHAT ? 1 : 0);
}
if (!fs.existsSync(DIST)) {
	console.error('kiem-truy-cap: không thấy dist/. Chạy "npm run build" trước.');
	process.exit(1);
}
const axeSrc = fs.readFileSync(path.join(GOC, 'node_modules/axe-core/axe.min.js'), 'utf8');

const KIEU = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml' };
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
const GOC_URL = `http://127.0.0.1:${may.address().port}`;

const trinhDuyet = await chromium.launch();
const loi = [];
let soLuot = 0;
for (const chuDe of ['light', 'dark']) {
	for (const rong of [1280, 390]) {
		const ngu = await trinhDuyet.newContext({ viewport: { width: rong, height: 900 }, colorScheme: chuDe });
		await ngu.addInitScript((t) => {
			try {
				localStorage.setItem('starlight-theme', t);
			} catch (_) {}
		}, chuDe);
		const trang = await ngu.newPage();
		for (const [ten, duongDan] of TRANG) {
			await trang.goto(GOC_URL + duongDan, { waitUntil: 'load' });
			await trang.evaluate((t) => (document.documentElement.dataset.theme = t), chuDe);
			await trang.waitForTimeout(500); // chờ script gắn thẻ (công thức, tra cứu) chạy xong
				await trang.evaluate(() => document.querySelectorAll('.dt-bo-qua').forEach((b) => b.click())); // hiện đồ thị (đang chờ "đoán trước") để axe quét cả đồ thị
				await trang.waitForTimeout(100);
			await trang.addScriptTag({ content: axeSrc });
			const kq = await trang.evaluate(async (the) => {
				// eslint-disable-next-line no-undef
				const r = await axe.run(document, { runOnly: { type: 'tag', values: the }, resultTypes: ['violations'] });
				return r.violations.map((v) => ({ id: v.id, impact: v.impact, soNut: v.nodes.length, mau: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} — ${(n.any[0]?.message || n.failureSummary || '').split('\n')[0]}`) }));
			}, THE_AXE);
			soLuot++;
			for (const v of kq) loi.push({ boi: `${ten} · ${chuDe} · ${rong}px`, ...v });
		}
		await ngu.close();
	}
}
await trinhDuyet.close();
may.close();

if (!loi.length) {
	console.log(`kiem-truy-cap: đạt (${soLuot} lượt: ${TRANG.length} trang × sáng/tối × 1280/390 px, 0 lỗi WCAG A/AA)`);
	process.exit(0);
}
const theoQuyTac = {};
for (const l of loi) (theoQuyTac[l.id] ??= []).push(l);
console.log(`kiem-truy-cap: ${loi.length} nhóm lỗi trong ${soLuot} lượt`);
for (const [id, ds] of Object.entries(theoQuyTac)) {
	console.log(`\n${id} (${ds[0].impact}), ${ds.reduce((a, l) => a + l.soNut, 0)} phần tử:`);
	for (const l of ds) {
		console.log(`  - ${l.boi}: ${l.soNut} phần tử`);
		for (const m of l.mau) console.log(`      ${m}`);
	}
}
if (CHAT) {
	console.error('\nkiem-truy-cap: KHÔNG ĐẠT');
	process.exit(1);
}
console.log('\n(chế độ báo cáo: thoát mã 0; thêm --chat để chặn)');
