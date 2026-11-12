// Dựng ảnh xem trước khi chia sẻ link (Zalo, Facebook...): 1200 × 630 px cho trang chủ và sáu khu.
// Chạy MỘT LẦN bằng tay rồi commit file PNG; build không dựng lại ảnh:
//     node scripts/dung-anh-chia-se.mjs            (cần Playwright và trình duyệt, như npm run kiem-truy-cap)
// Ảnh ghép từ tên khu, câu mô tả của trang khu (front-matter `description` trong trang/<khu>.md) và một hình cơ chế sẵn có.
// Không đưa số liệu lên ảnh. Khu chưa có hình cơ chế thì dùng biểu tượng của khu.
// Thẻ og:image / twitter:image do src/components/Head.astro gắn; kiem-sau-build.mjs kiểm đủ 7 ảnh, đúng cỡ, mỗi ảnh ≤ 150 KB.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { KHU, THU_TU_KHU } from '../src/data/khu.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RA = path.join(GOC, 'public/chia-se');
export const RONG = 1200, CAO = 630, NANG_TOI_DA = 150 * 1024;

/** Trang -> hình cơ chế đặt bên phải (đường dẫn trong src/hinh, không đuôi) hoặc null = dùng biểu tượng. */
export const ANH = {
	'trang-chu': { hinh: 'nhu-tuong/ba-qua-trinh', mau: 'var(--hh-thuong-hieu)' },
	'nhu-tuong': { hinh: 'nhu-tuong/sau-con-duong', mau: 'var(--chang-1)' },
	'chat-beo': { hinh: 'chat-beo/ba-dang-da-hinh', mau: 'var(--khu-chat-beo)' },
	'chat-nhu-hoa': { hinh: 'chat-nhu-hoa/orogenic-displacement', mau: 'var(--khu-chat-nhu-hoa)' },
	'chat-on-dinh': { hinh: null, mau: 'var(--khu-chat-on-dinh)' }, // khu này chưa có hình cơ chế
	'thuc-pham': { hinh: 'thuc-pham/tinh-bot-ho-hoa-thoai-hoa', mau: 'var(--khu-thuc-pham)' },
	'duoc-pham': { hinh: 'duoc-pham/ba-he-nano', mau: 'var(--khu-duoc-pham)' },
};

const thoat = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const moTa = (tep) => {
	const m = fs.readFileSync(tep, 'utf8').match(/^description:\s*(.+)$/m);
	if (!m) throw new Error(`${tep}: thiếu description`);
	return m[1].trim().replace(/^["']|["']$/g, '');
};
// Biểu tượng khu "Chất ổn định" (trùng hình với BieuTuong.astro), dùng khi khu chưa có hình cơ chế
const BIEU_TUONG_ON_DINH = '<svg viewBox="0 0 48 48" width="300" height="300" fill="none" stroke="var(--sl-color-white)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14c8-6 12 8 20 2s12-8 20-2"/><path d="M4 30c8-6 12 8 20 2s12-8 20-2"/><path d="M14 4c-6 8 8 12 2 20s-8 12-2 20M34 4c-6 8 8 12 2 20s-8 12-2 20" stroke="var(--hh-ho-phach)"/></svg>';

function trang(ten) {
	const { hinh, mau } = ANH[ten];
	const laChu = ten === 'trang-chu';
	const tieuDe = laChu ? 'Nhũ tương thực phẩm' : KHU[ten].ten;
	const mo = laChu ? moTa(path.join(GOC, 'src/content/docs/index.mdx')) : moTa(path.join(GOC, 'trang', `${ten}.md`));
	let khoi;
	if (hinh) {
		const tep = path.join(GOC, 'src/hinh', `${hinh}.svg`);
		if (!fs.existsSync(tep)) throw new Error(`thiếu hình ${hinh}.svg (hình này có thể còn nằm ở một PR chưa gộp); không dựng lại ảnh ${ten}.png`);
		khoi = `<div class="hinh-svg">${fs.readFileSync(tep, 'utf8')}</div>`;
	} else khoi = `<div class="bt">${BIEU_TUONG_ON_DINH}</div>`;
	const css = ['400', '600', '700'].map((w) => `<link rel="stylesheet" href="${pathToFileURL(path.join(GOC, `node_modules/@fontsource/be-vietnam-pro/${w}.css`))}">`).join('') +
		['giao-dien.css', 'hinh.css'].map((f) => `<style>${fs.readFileSync(path.join(GOC, 'src/styles', f), 'utf8')}</style>`).join('');
	return `<!doctype html><html lang="vi" data-theme="light"><head><meta charset="utf-8">${css}<style>
html, body { margin: 0; width: ${RONG}px; height: ${CAO}px; overflow: hidden; }
body { --mau: ${mau}; display: grid; grid-template-columns: 1fr 452px; font-family: 'Be Vietnam Pro', sans-serif; color: var(--sl-color-white); background: var(--sl-color-black); }
.trai { position: relative; display: flex; flex-direction: column; padding: 56px 40px 52px 76px; }
.trai::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 20px; background: var(--mau); }
.web { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 600; color: var(--hh-thuong-hieu-dam); }
.web img { width: 56px; height: 56px; }
h1 { margin: auto 0 0; font-size: ${laChu ? 62 : 92}px; line-height: 1.08; white-space: nowrap; font-weight: 700; letter-spacing: -0.01em; }
p { margin: 26px 0 auto; font-size: 31px; line-height: 1.42; color: var(--sl-color-gray-2); }
.nhan { display: flex; align-items: center; gap: 10px; font-size: 23px; white-space: nowrap; color: var(--sl-color-gray-2); }
.nhan b { display: grid; place-items: center; flex: none; width: 38px; height: 38px; border-radius: 9px; color: #fff; font-size: 22px; }
.nhan span { margin-left: 6px; }
.phai { display: grid; place-items: center; margin: 32px 32px 32px 0; border: 2px solid var(--hh-vien); border-radius: 28px; background: var(--hh-be-mat); overflow: hidden; }
.phai .hinh-svg svg { display: block; width: auto; height: ${CAO - 64 - 36}px; max-width: 396px; }
.bt { display: grid; place-items: center; width: 340px; height: 340px; border-radius: 50%; border: 6px solid var(--mau); }
</style></head><body>
<div class="trai">
<div class="web"><img src="${pathToFileURL(path.join(GOC, 'src/assets/logo.svg'))}" alt="">${laChu ? 'Kiến thức cho người làm R&amp;D' : 'Nhũ tương thực phẩm'}</div>
<h1>${thoat(tieuDe)}</h1>
<p>${thoat(mo)}</p>
<div class="nhan"><b style="background:#2f7d46">N</b><b style="background:#2563eb">T</b><b style="background:#996312">K</b><b style="background:#7d53dd">G</b><span>Mỗi khẳng định có nhãn tin cậy và nguồn</span></div>
</div>
<div class="phai">${khoi}</div>
</body></html>`;
}

/** Đọc chiều rộng, chiều cao từ đầu file PNG (khối IHDR). */
export function coPng(tep) {
	const b = fs.readFileSync(tep);
	return { rong: b.readUInt32BE(16), cao: b.readUInt32BE(20), nang: b.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { chromium } = createRequire(import.meta.url)('playwright');
	const sharp = createRequire(import.meta.url)('sharp');
	fs.mkdirSync(RA, { recursive: true });
	const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'chia-se-'));
	const br = await chromium.launch();
	const p = await br.newPage({ viewport: { width: RONG, height: CAO }, deviceScaleFactor: 1 });
	let loi = 0;
	for (const ten of ['trang-chu', ...THU_TU_KHU]) {
		let html;
		try { html = trang(ten); } catch (e) { console.log(`BỎ QUA ${ten}: ${e.message}`); loi++; continue; }
		const tep = path.join(tam, `${ten}.html`);
		fs.writeFileSync(tep, html);
		await p.goto(pathToFileURL(tep).href, { waitUntil: 'networkidle' });
		await p.evaluate(() => document.fonts.ready);
		const tran = await p.evaluate(() => { const t = document.querySelector('.trai'), n = t.querySelector('.nhan span').getBoundingClientRect(), r = t.getBoundingClientRect(); return t.scrollHeight > t.clientHeight + 1 || t.scrollWidth > t.clientWidth + 1 || n.right > r.right - 24; });
		const dich = path.join(RA, `${ten}.png`);
		// PNG bảng màu 256 màu (sharp có sẵn theo Astro): hình phẳng nên nhìn không khác, file nhẹ đi nhiều
		fs.writeFileSync(dich, await sharp(await p.screenshot({ type: 'png' })).png({ palette: true, colours: 256, effort: 10 }).toBuffer());
		const { rong, cao, nang } = coPng(dich);
		const dat = rong === RONG && cao === CAO && nang <= NANG_TOI_DA && !tran;
		if (!dat) loi++;
		console.log(`${dat ? 'ĐẠT ' : 'HỎNG'} ${ten}.png  ${rong} × ${cao}  ${(nang / 1024).toFixed(1)} KB${tran ? '  CHỮ TRÀN KHUNG' : ''}`);
	}
	await br.close();
	fs.rmSync(tam, { recursive: true, force: true });
	process.exit(loi ? 1 : 0);
}
