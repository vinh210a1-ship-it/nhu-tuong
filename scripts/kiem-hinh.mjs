// Kiểm hình cơ chế (gói T1): mỗi src/hinh/<khu>/<tên>.svg có <tên>.md làm chú thích, được dùng bởi đúng một dòng
// `<!-- hinh: tên -->` trong noi-dung/<khu>/, và qua phép kiểm SVG chung (scripts/kiem-svg.mjs).
// Chạy: npm run kiem
import fs from 'node:fs';
import path from 'node:path';
import { kiemSvg } from './kiem-svg.mjs';

const GOC = process.cwd();
const loi = [];
const hinh = [];
const goc = path.join(GOC, 'src/hinh');
if (fs.existsSync(goc))
	for (const khu of fs.readdirSync(goc, { withFileTypes: true }).filter((d) => d.isDirectory()))
		for (const f of fs.readdirSync(path.join(goc, khu.name)).filter((x) => x.endsWith('.svg'))) hinh.push([khu.name, f.slice(0, -4)]);

// các dòng dùng hình trong bài gốc
const dung = {};
const nd = path.join(GOC, 'noi-dung');
for (const khu of fs.readdirSync(nd, { withFileTypes: true }).filter((d) => d.isDirectory()))
	for (const f of fs.readdirSync(path.join(nd, khu.name)).filter((x) => x.endsWith('.md')))
		for (const m of fs.readFileSync(path.join(nd, khu.name, f), 'utf8').matchAll(/^<!--\s*hinh:\s*([a-z0-9-]+)\s*-->[ \t]*$/gm)) (dung[`${khu.name}/${m[1]}`] ??= []).push(`${khu.name}/${f}`);

for (const [khu, ten] of hinh) {
	const tep = `src/hinh/${khu}/${ten}`;
	const svg = fs.readFileSync(path.join(GOC, tep + '.svg'), 'utf8');
	loi.push(...kiemSvg(svg, `${tep}.svg`));
	if (!/^[a-z0-9-]+$/.test(ten)) loi.push(`${tep}.svg: tên hình chỉ gồm a-z, 0-9 và dấu gạch ngang`);
	const tepCt = path.join(GOC, tep + '.md');
	if (!fs.existsSync(tepCt)) {
		loi.push(`${tep}.md: thiếu chú thích`);
		continue;
	}
	const ct = fs.readFileSync(tepCt, 'utf8').replace(/\r/g, '').trim();
	const cau = ct.replace(/\[[NTKG][^\]]*\]/g, '').split(/(?<=[.!?])\s+/).filter((c) => c.replace(/[*\s]/g, ''));
	if (cau.length < 2 || cau.length > 4) loi.push(`${tep}.md: chú thích phải 2–4 câu (đang ${cau.length})`);
	if (!/\bkhông\b/i.test(ct)) loi.push(`${tep}.md: chú thích phải nói hình KHÔNG nói gì (thiếu chữ "không")`);
	if (/\n\s*\n/.test(ct)) loi.push(`${tep}.md: chú thích là một đoạn, không có dòng trống`);
	const chuTrongHinh = [...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]).join(' ');
	if (/\d/.test(chuTrongHinh) && !/\[N: @/.test(ct)) loi.push(`${tep}: chữ trong hình có con số nhưng chú thích không trích khóa nguồn [N: @khoa] (hình cơ chế không có số trừ khi đã là [N] trong bài)`);
	if (!dung[`${khu}/${ten}`]) loi.push(`${tep}.svg: không có bài nào dùng (thêm dòng <!-- hinh: ${ten} --> vào bài trong noi-dung/${khu}/)`);
	else if (dung[`${khu}/${ten}`].length > 1) loi.push(`${tep}.svg: dùng ở ${dung[`${khu}/${ten}`].length} chỗ (${dung[`${khu}/${ten}`].join(', ')}); mỗi hình chỉ đặt một chỗ`);
}
for (const k of Object.keys(dung)) if (!hinh.some(([khu, ten]) => `${khu}/${ten}` === k)) loi.push(`dòng <!-- hinh: ${k.split('/')[1]} --> trong ${dung[k][0]} nhưng không có src/hinh/${k}.svg`);

for (const l of loi) console.log('SAI  ' + l);
console.log(loi.length ? `\n${loi.length} lỗi hình` : `kiem-hinh: đạt (${hinh.length} hình)`);
process.exit(loi.length ? 1 : 0);
