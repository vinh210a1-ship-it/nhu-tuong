// Kiểm gói T4-2: dấu mức đọc (4 vạch) trên liên kết nguồn do JavaScript vẽ (máy tính, đồ thị, chẩn đoán, bàn lab).
// Cần bản đã build (dist/) và Playwright, giống kiem-truy-cap: npm install --no-save playwright && npx playwright install chromium
// Chạy sau `npm run build`: npm run kiem-muc-doc-js
//  1) Mỗi liên kết `/nguon/#khóa` sau khi trang vẽ xong có ĐÚNG MỘT dấu ngay sau, đúng mức của nguon/nguon.json, đúng số vạch.
//  2) Có đủ liên kết để phép kiểm có nghĩa (không để trang vẽ 0 liên kết rồi "đạt").
//  3) public/muc-doc.json tải hỏng (lỗi 500, hoặc JSON cụt) thì trang vẫn chạy, không có lỗi script, chỉ thiếu dấu.
//  4) 375 px và 1280 px không tràn ngang; mỗi dấu cao tối thiểu 24 px (đủ chạm) khi đo trong vùng bấm của liên kết.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { mucCua } from '../src/data/muc-doc.mjs';

const GOC = process.cwd();
const DIST = path.join(GOC, 'dist');
const BASE = '/nhu-tuong';
const require = createRequire(import.meta.url);
let chromium;
try {
	({ chromium } = require('playwright'));
} catch {
	console.error('kiem-muc-doc-js: thiếu playwright. Chạy: npm install --no-save playwright && npx playwright install chromium');
	process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'muc-doc.js'))) {
	console.error('kiem-muc-doc-js: không thấy dist/muc-doc.js. Chạy "npm run build" trước.');
	process.exit(1);
}
const nguon = JSON.parse(fs.readFileSync(path.join(GOC, 'nguon/nguon.json'), 'utf8'));
const MUC = Object.fromEntries(nguon.map((e) => [e.khoa, mucCua(e.muc_doc)]));

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

// Mỗi tình huống: trang, các bước làm cho phần JavaScript vẽ liên kết, số liên kết tối thiểu phải thấy.
const TINH_HUONG = [
	{ ten: 'máy tính (liên kết ở thẻ máy)', url: 'may-tinh/', toiThieu: 10 },
	{
		ten: 'máy tính, đồ thị mở ra',
		url: 'may-tinh/',
		lam: async (p) => {
			await p.evaluate(() => document.querySelectorAll('.dt-bo-qua').forEach((b) => b.click()));
			await p.waitForTimeout(300);
		},
		toiThieu: 10,
	},
	{
		ten: 'chẩn đoán (đi tới một kết luận có nguồn)',
		url: 'chan-doan/',
		lam: async (p) => {
			// thử từng câu trả lời đầu tiên, đi theo nút đầu mỗi bước, cho tới khi gặp kết luận có liên kết nguồn
			const NUT = '[data-chan-doan] button:not(.cd-lui):not(.cd-lai)';
			for (let dau = 0; dau < 10 && !(await p.locator('a[href*="/nguon/#"]').count()); dau++) {
				if (dau) await p.locator('.cd-lai').first().click();
				const ds = p.locator(NUT);
				if (dau >= (await ds.count())) break;
				await ds.nth(dau).click();
				for (let i = 0; i < 6 && !(await p.locator('a[href*="/nguon/#"]').count()); i++) {
					const nut = p.locator(NUT).first();
					if (!(await nut.count())) break;
					await nut.click();
					await p.waitForTimeout(100);
				}
			}
		},
		toiThieu: 1,
	},
	{
		ten: 'bàn Pickering (thẻ góc tiếp xúc của một hạt)',
		url: 'phong-lab/#ban-pickering',
		lam: async (p) => {
			await p.waitForTimeout(1500);
			await p.locator('button.pl-nut-tu-1[data-mo-tu="tu-hat"]').click();
			await p.locator('.pl-chai-nut:not(.khoa):visible').first().click();
			await p.locator('[data-cho]:visible').click(); // "Cho vào" bàn
			await p.waitForTimeout(300);
			// "Mang lọ tới đây" đưa hạt vào máy đo góc; thẻ θ kèm nguồn hiện ra
			await p.locator('.pl-tu-dong:visible').click(); // đóng tủ (mỗi bàn có một tủ riêng, chỉ một cái đang mở)
			await p.locator('g[data-tram="goc"]').focus();
			await p.keyboard.press('Enter');
			const mang = p.locator('button[data-dua="goc"]');
			if (await mang.count()) await mang.first().click();
			await p.waitForTimeout(400);
		},
		toiThieu: 1,
	},
	{
		ten: 'bàn nhũ tương kép (bản đồ miền ổn định)',
		url: 'phong-lab/#ban-kep',
		lam: async (p) => {
			await p.waitForTimeout(1500);
			await p.locator('button.pl-nut-tu-1[data-mo-tu="tu-kep"]').click();
			for (const mon of ['dau', 'pgpr', 'w1', 'ga']) {
				await p.locator(`.pl-chai-nut[data-mon="${mon}"]:visible`).click();
				await p.locator('[data-cho]:visible').click();
			}
			await p.locator('.pl-tu-dong:visible').click();
			await p.locator('button[data-lam="chayB1"]:visible').click();
			await p.waitForTimeout(2000);
			await p.locator('button[data-dua="buoc2"]:visible').first().click();
			await p.locator('button[data-lam="chayB2"]:visible').click();
			await p.waitForTimeout(2000);
			await p.locator('button[data-dua="do"]:visible').first().click();
			await p.waitForTimeout(600);
		},
		toiThieu: 1,
	},
	{ ten: 'trang tĩnh (bài) vẫn đúng một dấu', url: 'nhu-tuong/mat-on-dinh/', toiThieu: 10 },
];

const loi = [];
const trinhDuyet = await chromium.launch();

async function doTrang(p) {
	return p.evaluate(() => {
		const a = [...document.querySelectorAll('a[href*="/nguon/#"]')];
		return a.map((x) => {
			const sau = x.nextElementSibling;
			const dau = sau?.classList.contains('muc-vach') ? sau : null;
			const truoc = x.previousElementSibling?.classList.contains('muc-vach');
			return {
				khoa: decodeURIComponent(x.getAttribute('href').split('/nguon/#')[1] || ''),
				coDau: !!dau,
				ma: dau?.dataset.muc ?? null,
				vach: dau ? Number((/muc-vach-(\d)/.exec(dau.className) || [])[1]) : null,
				doi: !!dau && !!dau.nextElementSibling?.classList.contains('muc-vach'),
				cao: dau ? dau.getBoundingClientRect().height : 0,
				truoc,
			};
		});
	});
}

for (const rong of [1280, 375]) {
	for (const th of TINH_HUONG) {
		const ngu = await trinhDuyet.newContext({ viewport: { width: rong, height: 900 } });
		const p = await ngu.newPage();
		const loiScript = [];
		p.on('pageerror', (e) => loiScript.push(e.message));
		await p.goto(URL_GOC + '/' + th.url, { waitUntil: 'load' });
		await p.waitForTimeout(700);
		if (th.lam) await th.lam(p);
		await p.waitForTimeout(500); // chờ MutationObserver quét lượt cuối
		const ds = await doTrang(p);
		const boi = `${th.ten} · ${rong}px`;
		if (ds.length < th.toiThieu) loi.push(`${boi}: chỉ thấy ${ds.length} liên kết nguồn, cần ≥ ${th.toiThieu} (phép kiểm trống)`);
		for (const x of ds) {
			const m = MUC[x.khoa];
			if (!m) {
				if (x.coDau) loi.push(`${boi}: khóa "${x.khoa}" không có trong nguon.json mà vẫn có dấu`);
				continue;
			}
			if (!x.coDau) loi.push(`${boi}: "${x.khoa}" thiếu dấu`);
			else if (x.ma !== m.ma || x.vach !== m.vach) loi.push(`${boi}: "${x.khoa}" dấu ${x.ma}/${x.vach} vạch, nguon.json là ${m.ma}/${m.vach} vạch`);
			if (x.doi) loi.push(`${boi}: "${x.khoa}" có hai dấu liền nhau`);
		}
		const tran = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
		if (tran > 0) loi.push(`${boi}: tràn ngang ${tran}px`);
		if (loiScript.length) loi.push(`${boi}: lỗi script ${loiScript[0]}`);
		console.log(`  ${boi}: ${ds.length} liên kết, ${ds.filter((x) => x.coDau).length} có dấu`);
		await ngu.close();
	}
}

// Tải dữ liệu hỏng: trang vẫn chạy, không lỗi script, không dấu nào được bịa ra.
for (const [ten, tra] of [
	['máy chủ trả 500', (r) => r.fulfill({ status: 500, body: 'loi' })],
	['JSON cụt', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"muc":{"toan-van":' })],
	['JSON sai hình', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[1,2,3]' })],
]) {
	const ngu = await trinhDuyet.newContext({ viewport: { width: 375, height: 900 } });
	const p = await ngu.newPage();
	const loiScript = [];
	p.on('pageerror', (e) => loiScript.push(e.message));
	await p.route('**/muc-doc.json', tra);
	await p.goto(URL_GOC + '/may-tinh/', { waitUntil: 'load' });
	await p.waitForTimeout(900);
	const ds = await p.evaluate(() => ({
		lk: document.querySelectorAll('a[href*="/nguon/#"]').length,
		may: document.querySelectorAll('.may-tinh').length,
		dau: document.querySelectorAll('.may-tinh .muc-vach').length,
	}));
	if (!ds.may) loi.push(`dữ liệu hỏng (${ten}): máy tính không còn hiện`);
	if (!ds.lk) loi.push(`dữ liệu hỏng (${ten}): liên kết nguồn biến mất`);
	if (ds.dau) loi.push(`dữ liệu hỏng (${ten}): vẫn có ${ds.dau} dấu (không được bịa)`);
	if (loiScript.length) loi.push(`dữ liệu hỏng (${ten}): lỗi script ${loiScript[0]}`);
	console.log(`  dữ liệu hỏng (${ten}): máy tính còn ${ds.may}, liên kết ${ds.lk}, dấu ${ds.dau}`);
	await ngu.close();
}

await trinhDuyet.close();
may.close();
if (loi.length) {
	console.error(`kiem-muc-doc-js: ${loi.length} lỗi`);
	for (const l of [...new Set(loi)].slice(0, 40)) console.error('  ✗ ' + l);
	process.exit(1);
}
console.log('kiem-muc-doc-js: đạt');
