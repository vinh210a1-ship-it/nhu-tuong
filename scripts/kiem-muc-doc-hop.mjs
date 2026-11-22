// Kiểm gói T4-4: bấm dấu mức đọc (4 vạch) thì hiện hộp giải thích ngay tại chỗ, có đường lui là liên kết cũ.
// Cần bản đã build (dist/) và Playwright, giống kiem-muc-doc-js: npm install --no-save playwright && npx playwright install chromium
// Chạy sau `npm run build`: npm run kiem-muc-doc-hop
//  1) Bấm dấu ở trang bài: hộp mở, không đổi địa chỉ trang, lời giải nghĩa là nguyên văn dòng `muc-doc-<mã>` ở trang Cách đọc nhãn,
//     hộp nằm gọn trong màn hình (375 px và 1280 px), không làm trang tràn ngang.
//  2) Đóng được bằng Esc, nút Đóng, bấm ra ngoài; sau khi đóng bằng bàn phím thì tiêu điểm về đúng dấu; Enter trên dấu mở hộp.
//  3) Đường lui: Ctrl+bấm không mở hộp (để trình duyệt mở tab mới); dữ liệu hỏng hoặc trình duyệt không có `popover` thì bấm vẫn tới
//     trang Cách đọc nhãn đúng neo.
//  4) Dấu do JavaScript vẽ (máy tính) cũng mở hộp; hộp mở ra không có lỗi axe-core (WCAG A/AA), sáng và tối.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { nghiaTuTrang } from '../src/data/muc-doc.mjs';

const GOC = process.cwd();
const DIST = path.join(GOC, 'dist');
const BASE = '/nhu-tuong';
const require = createRequire(import.meta.url);
let chromium;
try {
	({ chromium } = require('playwright'));
} catch {
	console.error('kiem-muc-doc-hop: thiếu playwright. Chạy: npm install --no-save playwright && npx playwright install chromium');
	process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'muc-doc.js'))) {
	console.error('kiem-muc-doc-hop: không thấy dist/muc-doc.js. Chạy "npm run build" trước.');
	process.exit(1);
}
const NGHIA = nghiaTuTrang(fs.readFileSync(path.join(GOC, 'src/content/docs/quy-uoc.md'), 'utf8'));
const axeSrc = fs.readFileSync(path.join(GOC, 'node_modules/axe-core/axe.min.js'), 'utf8');

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
const TRANG_BAI = 'nhu-tuong/mat-on-dinh/';
const DAU = 'a.muc-vach[data-muc]';

const loi = [];
const trinhDuyet = await chromium.launch();
const mo = async (rong, { chan, theme } = {}) => {
	const ngu = await trinhDuyet.newContext({ viewport: { width: rong, height: 800 }, colorScheme: theme === 'dark' ? 'dark' : 'light' });
	const p = await ngu.newPage();
	const loiScript = [];
	p.on('pageerror', (e) => loiScript.push(e.message));
	if (chan) await p.route('**/muc-doc.json', chan);
	return { ngu, p, loiScript };
};
const hopMo = (p) => p.evaluate(() => !!document.querySelector('#muc-doc-hop')?.matches(':popover-open'));

for (const rong of [1280, 375]) {
	const boi = `trang bài · ${rong}px`;
	const { ngu, p, loiScript } = await mo(rong);
	await p.goto(`${URL_GOC}/${TRANG_BAI}`, { waitUntil: 'load' });
	await p.waitForTimeout(700);
	// Một dấu cho mỗi mức có mặt trong trang (và chắc chắn có ít nhất vài mức), bấm lần lượt
	const cacMa = await p.evaluate((d) => [...new Set([...document.querySelectorAll(d)].map((a) => a.dataset.muc))], DAU);
	if (cacMa.length < 2) loi.push(`${boi}: chỉ thấy ${cacMa.length} mức đọc trong trang, phép kiểm trống`);
	const diaChi0 = p.url();
	for (const ma of cacMa) {
		const dau = p.locator(`${DAU}[data-muc="${ma}"]`).first();
		await dau.scrollIntoViewIfNeeded();
		await dau.click();
		await p.waitForTimeout(100);
		if (!(await hopMo(p))) {
			loi.push(`${boi}: bấm dấu "${ma}" mà hộp không mở`);
			continue;
		}
		if (p.url() !== diaChi0) loi.push(`${boi}: bấm dấu "${ma}" làm trang đổi địa chỉ (${p.url()})`);
		const chu = await p.locator('#muc-doc-hop .mdh-nghia').innerText();
		if (!NGHIA[ma] || !chu.replace(/\s+/g, ' ').includes(NGHIA[ma])) loi.push(`${boi}: lời giải "${ma}" không khớp trang Cách đọc nhãn`);
		const lk = await p.locator('#muc-doc-hop a').getAttribute('href');
		if (!lk?.endsWith(`/quy-uoc/#muc-doc-${ma}`)) loi.push(`${boi}: liên kết trong hộp "${ma}" là ${lk}`);
		const kt = await p.evaluate(() => {
			const r = document.querySelector('#muc-doc-hop').getBoundingClientRect();
			return { t: r.left, p: r.right, tr: r.top, d: r.bottom, rong: document.documentElement.clientWidth, cao: innerHeight };
		});
		if (kt.t < 0 || kt.p > kt.rong || kt.tr < 0 || kt.d > kt.cao) loi.push(`${boi}: hộp "${ma}" tràn khỏi màn hình ${JSON.stringify(kt)}`);
		if ((await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) > 0) loi.push(`${boi}: hộp "${ma}" làm trang tràn ngang`);
		await p.keyboard.press('Escape');
		if (await hopMo(p)) loi.push(`${boi}: Esc không đóng hộp "${ma}"`);
		else if (!(await dau.evaluate((a) => a === document.activeElement))) loi.push(`${boi}: đóng hộp "${ma}" bằng Esc mà tiêu điểm không về dấu`);
	}
	// nút Đóng, bấm ra ngoài, Enter, bấm lần hai
	const dau = p.locator(DAU).first();
	await dau.scrollIntoViewIfNeeded();
	await dau.click();
	await p.locator('#muc-doc-hop button').click();
	if (await hopMo(p)) loi.push(`${boi}: nút Đóng không đóng hộp`);
	await dau.click();
	await p.waitForTimeout(400);
	await dau.click(); // bấm lại đúng dấu đang mở bằng chuột: đóng, không mở lại
	await p.waitForTimeout(400);
	if (await hopMo(p)) loi.push(`${boi}: bấm lại dấu đang mở bằng chuột thì hộp lại mở`);
	await dau.click();
	await p.mouse.click(2, 790);
	if (await hopMo(p)) loi.push(`${boi}: bấm ra ngoài không đóng hộp`);
	await dau.focus();
	await p.keyboard.press('Enter');
	await p.waitForTimeout(100);
	if (!(await hopMo(p))) loi.push(`${boi}: Enter trên dấu không mở hộp`);
	if (p.url() !== diaChi0) loi.push(`${boi}: Enter trên dấu làm trang đổi địa chỉ`);
	// Ctrl+bấm: không chặn (để mở tab mới), nên hộp không được mở
	await p.keyboard.press('Escape');
	const dau2 = p.locator(DAU).nth(1);
	await dau2.scrollIntoViewIfNeeded();
	const [tabMoi] = await Promise.all([ngu.waitForEvent('page', { timeout: 3000 }).catch(() => null), dau2.click({ modifiers: ['Control'] })]);
	if (await hopMo(p)) loi.push(`${boi}: Ctrl+bấm vẫn mở hộp`);
	if (!tabMoi) loi.push(`${boi}: Ctrl+bấm không mở tab mới (liên kết cũ bị chặn)`);
	if (loiScript.length) loi.push(`${boi}: lỗi script ${loiScript[0]}`);
	console.log(`  ${boi}: bấm thử ${cacMa.length} mức (${cacMa.join(', ')})`);
	await ngu.close();
}

// Dấu do JavaScript vẽ (máy tính) cũng mở hộp
{
	const { ngu, p, loiScript } = await mo(375);
	await p.goto(`${URL_GOC}/may-tinh/`, { waitUntil: 'load' });
	await p.waitForTimeout(900);
	const n = await p.locator(DAU).count();
	if (n < 5) loi.push(`máy tính: chỉ có ${n} dấu, phép kiểm trống`);
	else {
		await p.locator(DAU + ':visible').first().click();
		await p.waitForTimeout(100);
		if (!(await hopMo(p))) loi.push('máy tính: bấm dấu do JavaScript vẽ mà hộp không mở');
	}
	if (loiScript.length) loi.push(`máy tính: lỗi script ${loiScript[0]}`);
	console.log(`  máy tính (dấu do JavaScript vẽ): ${n} dấu`);
	await ngu.close();
}

// axe-core khi hộp đang mở, sáng và tối
for (const theme of ['light', 'dark']) {
	const { ngu, p } = await mo(375, { theme });
	await p.goto(`${URL_GOC}/${TRANG_BAI}`, { waitUntil: 'load' });
	await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
	await p.waitForTimeout(500);
	await p.locator(DAU).first().click();
	await p.addScriptTag({ content: axeSrc });
	const r = await p.evaluate(async () => {
		const k = await axe.run(document.querySelector('#muc-doc-hop'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations'] });
		return k.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join('; ')}`);
	});
	for (const v of r) loi.push(`axe (${theme}, hộp mở): ${v}`);
	console.log(`  axe (${theme}, hộp mở): ${r.length} lỗi`);
	await ngu.close();
}

// Đường lui: dữ liệu hỏng, hoặc trình duyệt không có `popover`: bấm dấu vẫn tới trang Cách đọc nhãn đúng neo
for (const [ten, chan, bo] of [
	['muc-doc.json trả 500', (r) => r.fulfill({ status: 500, body: 'loi' }), false],
	['trình duyệt không có popover', null, true],
]) {
	const { ngu, p, loiScript } = await mo(375, { chan });
	if (bo) await p.addInitScript(() => delete HTMLElement.prototype.showPopover);
	await p.goto(`${URL_GOC}/${TRANG_BAI}`, { waitUntil: 'load' });
	await p.waitForTimeout(700);
	// nếu dữ liệu hỏng thì trang tĩnh vẫn có dấu do máy in dựng sẵn
	const dau = p.locator(DAU).first();
	await dau.scrollIntoViewIfNeeded();
	const ma = await dau.getAttribute('data-muc');
	await Promise.all([p.waitForURL(/\/quy-uoc\/#muc-doc-/, { timeout: 5000 }).catch(() => null), dau.click()]);
	if (!p.url().includes(`/quy-uoc/#muc-doc-${ma}`)) loi.push(`đường lui (${ten}): bấm dấu "${ma}" không tới trang Cách đọc nhãn (${p.url()})`);
	if (loiScript.length) loi.push(`đường lui (${ten}): lỗi script ${loiScript[0]}`);
	console.log(`  đường lui (${ten}): tới ${p.url().replace(/^.*\/nhu-tuong/, '')}`);
	await ngu.close();
}

await trinhDuyet.close();
may.close();
if (loi.length) {
	console.error(`\nkiem-muc-doc-hop: ${loi.length} lỗi`);
	for (const l of loi) console.error('  - ' + l);
	process.exit(1);
}
console.log('kiem-muc-doc-hop: đạt');
