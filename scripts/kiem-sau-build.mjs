// Kiểm sau build: chạy sau `npm run build`, đọc các trang đã dựng trong dist/.
//  1) Chuỗi cấm: ghi chú nội bộ của người soạn không được lọt ra trang người đọc.
//  2) Liên kết nội bộ và neo (#...) không được hỏng.
// Không kiểm liên kết ra ngoài (https://...): cần mạng và hay đổi theo thời gian.
// Chạy: npm run kiem-sau-build            (kiểm thư mục dist/)
//       node scripts/kiem-sau-build.mjs <thư-mục-dist>   (thư mục khác, để thử bộ kiểm)
import fs from 'node:fs';
import path from 'node:path';
import { KHU } from '../src/data/khu.mjs';

const GOC = process.cwd();
const DIST = path.resolve(process.argv[2] || path.join(GOC, 'dist'));
const cauHinh = fs.readFileSync(path.join(GOC, 'astro.config.mjs'), 'utf8');
const BASE = (/const BASE\s*=\s*['"]([^'"]+)['"]/.exec(cauHinh) || [, '/nhu-tuong'])[1].replace(/\/$/, '');

if (!fs.existsSync(DIST)) {
	console.error(`kiem-sau-build: không thấy thư mục ${DIST}. Chạy "npm run build" trước.`);
	process.exit(1);
}

// ---- gom mọi trang HTML (bỏ thư mục pagefind: chỉ chứa dữ liệu tìm kiếm)
const trang = [];
(function duyet(d) {
	for (const f of fs.readdirSync(d, { withFileTypes: true })) {
		const p = path.join(d, f.name);
		if (f.isDirectory()) {
			if (f.name !== 'pagefind') duyet(p);
		} else if (f.name.endsWith('.html')) trang.push(p);
	}
})(DIST);
const noiDung = Object.fromEntries(trang.map((p) => [p, fs.readFileSync(p, 'utf8')]));
const tenTrang = (p) => '/' + path.relative(DIST, p).split(path.sep).join('/').replace(/index\.html$/, '');

// chữ người đọc thấy: bỏ script, style, thẻ HTML
const chuHienRa = (h) =>
	h
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<style[\s\S]*?<\/style>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ');

// ---- 1) chuỗi cấm
// Mọi trang: dòng ghi tên tệp gốc.
const CAM_MOI_TRANG = [['Nội dung gốc:', /Nội dung gốc:/], ['đường dẫn noi-dung/…', /noi-dung\/[a-z-]+\/\d{2}-/]];
// Các bài khu Nhũ tương (8 bài + bảng thuật ngữ): phạm vi đã duyệt cho đợt dọn ghi chú nội bộ.
const CAM_BAI = [
	['"cho web"', /\bcho web\b/],
	['"lên web"', /\blên web\b/],
	['"luồng khác"', /luồng khác/],
	['luồng "…" (tên luồng nội bộ)', /luồng "/],
	['"file 10"', /\bfile 10\b/],
	['"(từ R" + số', /\(từ R\d+/],
];
const slugBai = new Set(KHU['nhu-tuong'].bai.map((b) => b.slug));
slugBai.add('thuat-ngu');
const loiCam = [];
const canhBao = {};
for (const [p, h] of Object.entries(noiDung)) {
	const t = chuHienRa(h);
	const ten = tenTrang(p);
	const laBaiNhuTuong = [...slugBai].some((s) => ten === `/nhu-tuong/${s}/`); // dist/ chính là gốc của base, nên đường dẫn trong dist không có base
	for (const [nhan, re] of CAM_MOI_TRANG) if (re.test(t)) loiCam.push(`${ten}: còn ${nhan}`);
	for (const [nhan, re] of CAM_BAI) {
		const co = re.test(t);
		if (laBaiNhuTuong && co) loiCam.push(`${ten}: còn ${nhan}`);
		// ngoài phạm vi khu Nhũ tương: chỉ báo để biết, không chặn
		if (!laBaiNhuTuong && co) (canhBao[nhan] ??= []).push(ten);
	}
	// mã nguồn nội bộ dạng R18, R20… trong 8 bài: chỉ báo
	if (laBaiNhuTuong && /\bR\d{2}\b/.test(t)) (canhBao['mã nguồn nội bộ dạng R18 (trong khu Nhũ tương)'] ??= []).push(ten);
}

// ---- 2) liên kết nội bộ và neo
const idCache = {};
const idCua = (p) => (idCache[p] ??= new Set([...noiDung[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
const hong = {};
let soLienKet = 0;
for (const [p, h] of Object.entries(noiDung)) {
	const ten = tenTrang(p);
	const o = new URL(BASE + ten, 'http://x');
	for (const m of h.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
		const raw = m[1].replace(/&amp;/g, '&');
		if (/^(https?:)?\/\//.test(raw) || /^(mailto|tel|javascript):/.test(raw)) continue;
		soLienKet++;
		let u;
		try {
			u = new URL(raw, o);
		} catch {
			(hong[`href không hợp lệ: ${raw}`] ??= []).push(ten);
			continue;
		}
		if (!u.pathname.startsWith(BASE)) {
			(hong[`trỏ ra ngoài base: ${raw}`] ??= []).push(ten);
			continue;
		}
		let f = path.join(DIST, decodeURIComponent(u.pathname.slice(BASE.length)));
		if (!/\.[a-z0-9]+$/i.test(f)) f = path.join(f, 'index.html');
		if (!fs.existsSync(f)) {
			(hong[`không có trang ${u.pathname}`] ??= []).push(ten);
			continue;
		}
		const neo = decodeURIComponent(u.hash.slice(1));
		if (neo && noiDung[f] && !idCua(f).has(neo)) (hong[`mất neo ${u.pathname}#${neo}`] ??= []).push(ten);
	}
}

// ---- báo kết quả
console.log(`kiem-sau-build: ${trang.length} trang, ${soLienKet} liên kết nội bộ, base "${BASE}"`);
for (const [nhan, ds] of Object.entries(canhBao)) console.log(`  ghi chú (không chặn): ${nhan} còn ở ${ds.length} trang, vd ${ds[0]}`);
if (loiCam.length) {
	console.log(`\nCHUỖI CẤM: ${loiCam.length} chỗ`);
	for (const l of loiCam.slice(0, 40)) console.log('  - ' + l);
}
const nhomHong = Object.entries(hong);
if (nhomHong.length) {
	console.log(`\nLIÊN KẾT HỎNG: ${nhomHong.length} nhóm`);
	for (const [k, ds] of nhomHong.slice(0, 40)) console.log(`  - ${k}  (từ ${ds.length} trang, vd ${ds[0]})`);
}
if (loiCam.length || nhomHong.length) {
	console.log('\nkiem-sau-build: KHÔNG ĐẠT');
	process.exit(1);
}
console.log('kiem-sau-build: đạt (0 chuỗi cấm, 0 liên kết nội bộ hỏng)');
