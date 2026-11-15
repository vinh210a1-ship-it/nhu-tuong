// Kiểm gói T4 (huy hiệu N hiện mức đọc nguồn), chạy trong `npm run kiem`, không cần build.
//  1) Mọi nguồn trong nguon/nguon.json có muc_doc thuộc bảng src/data/muc-doc.mjs.
//  2) nguon/nguon.csv và nguon/nguon.json ghi CÙNG mức đọc cho từng khóa (đổi một nơi mà quên nơi kia là sai).
//  3) Dấu dựng ra đúng số vạch, đúng neo; mã lạ hoặc thiếu thì về "chưa xác định" (0 vạch), không bao giờ được nâng.
//  4) Trang Cách đọc nhãn có đủ neo giải thích, CSS có đủ 5 hình vạch.
import fs from 'node:fs';
import path from 'node:path';
import { MUC_DOC, CHUA_RO, mucCua, htmlMucDoc, htmlVach } from '../src/data/muc-doc.mjs';

const GOC = process.cwd();
const loi = [];
const doc = (t) => fs.readFileSync(path.join(GOC, t), 'utf8');

// đọc CSV có ngoặc kép (trích dẫn chứa dấu phẩy), bỏ BOM
function docCsv(s) {
	const dong = [];
	let o = '', hang = [], trong = false;
	s = s.replace(/^﻿/, '');
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (trong) {
			if (c === '"' && s[i + 1] === '"') (o += '"'), i++;
			else if (c === '"') trong = false;
			else o += c;
		} else if (c === '"') trong = true;
		else if (c === ',') hang.push(o), (o = '');
		else if (c === '\n' || c === '\r') {
			if (c === '\r' && s[i + 1] === '\n') i++;
			hang.push(o), (o = '');
			if (hang.length > 1 || hang[0] !== '') dong.push(hang);
			hang = [];
		} else o += c;
	}
	if (o !== '' || hang.length) hang.push(o), dong.push(hang);
	const [dau, ...con] = dong;
	return con.map((h) => Object.fromEntries(dau.map((ten, i) => [ten, h[i] ?? ''])));
}

// 1) và 2)
const json = JSON.parse(doc('nguon/nguon.json'));
const csv = docCsv(doc('nguon/nguon.csv'));
const theoCsv = new Map(csv.map((d) => [d['Khóa'], d['Mức đọc']]));
const tenCsv = new Map(Object.entries(MUC_DOC).map(([ma, m]) => [m.csv, ma]));
const dem = {};
for (const e of json) {
	if (!Object.hasOwn(MUC_DOC, e.muc_doc)) loi.push(`nguon.json: ${e.khoa} có muc_doc lạ ${JSON.stringify(e.muc_doc)}`);
	dem[e.muc_doc] = (dem[e.muc_doc] || 0) + 1;
	if (!theoCsv.has(e.khoa)) loi.push(`nguon.csv thiếu khóa ${e.khoa} (có trong nguon.json)`);
	else if (tenCsv.get(theoCsv.get(e.khoa)) !== e.muc_doc)
		loi.push(`${e.khoa}: nguon.csv ghi "${theoCsv.get(e.khoa)}" nhưng nguon.json ghi "${e.muc_doc}"`);
}
const khoaJson = new Set(json.map((e) => e.khoa));
for (const k of theoCsv.keys()) if (!khoaJson.has(k)) loi.push(`nguon.json thiếu khóa ${k} (có trong nguon.csv)`);

// 3) dấu dựng ra
const VACH = { 'toan-van': 4, 'mot-phan': 3, 'tom-tat': 2, 'tieu-de': 1, 'tri-nho': 0 }; // gõ tay độc lập với bảng
for (const [ma, n] of Object.entries(VACH)) {
	if (!MUC_DOC[ma]) { loi.push(`bảng MUC_DOC thiếu mã ${ma}`); continue; }
	if (MUC_DOC[ma].vach !== n) loi.push(`MUC_DOC['${ma}'].vach = ${MUC_DOC[ma].vach}, phải là ${n}`);
	const h = htmlMucDoc(ma, '/goc');
	if (!h.includes(`class="muc-vach muc-vach-${n}"`) || !h.includes(`data-muc="${ma}"`) || !h.includes(`href="/goc/quy-uoc/#muc-doc-${ma}"`))
		loi.push(`htmlMucDoc('${ma}') dựng sai lớp, data-muc hoặc neo: ${h}`);
	if (!h.includes(`(${MUC_DOC[ma].ten})`) || !h.includes('data-pagefind-ignore') || !h.includes('aria-hidden="true"'))
		loi.push(`htmlMucDoc('${ma}') thiếu chữ cho trình đọc màn hình, data-pagefind-ignore hoặc aria-hidden`);
	if (!htmlVach(ma).includes(`muc-vach-${n}"`)) loi.push(`htmlVach('${ma}') sai số vạch`);
}
if (Object.keys(MUC_DOC).length !== Object.keys(VACH).length) loi.push('bảng MUC_DOC có mã ngoài 5 mức đã định: thêm cả vào kiem-muc-doc.mjs, quy-uoc.md');
for (const la of [undefined, null, '', 'toan-van ', 'TOAN-VAN', 'doc-het', 'constructor', '__proto__']) {
	const m = mucCua(la);
	if (m.ma !== CHUA_RO || m.vach !== 0) loi.push(`mã lạ ${JSON.stringify(la)} phải về "chưa xác định", 0 vạch (đang ${m.ma}, ${m.vach})`);
	if (!htmlMucDoc(la, '').includes(`#muc-doc-${CHUA_RO}"`)) loi.push(`htmlMucDoc(${JSON.stringify(la)}) không trỏ neo chưa xác định`);
}

// 4) trang quy ước và CSS
const quyUoc = doc('src/content/docs/quy-uoc.md');
for (const ma of [...Object.keys(MUC_DOC), CHUA_RO]) if (!quyUoc.includes(`id="muc-doc-${ma}"`)) loi.push(`quy-uoc.md thiếu neo id="muc-doc-${ma}"`);
const css = doc('src/styles/nhan.css');
for (let n = 0; n <= 4; n++) if (!new RegExp(`\\.muc-vach-${n} \\{ --muc-vach-hinh: url\\(`).test(css)) loi.push(`nhan.css thiếu hình cho .muc-vach-${n}`);
for (let n = 0; n <= 4; n++) {
	const m = new RegExp(`\\.muc-vach-${n} \\{ --muc-vach-hinh: url\\("([^"]+)"`).exec(css);
	const dac = m ? (decodeURIComponent(m[1]).match(/fill='#000'/g) || []).length : -1;
	if (dac !== n) loi.push(`nhan.css: hình .muc-vach-${n} có ${dac} vạch đặc, phải là ${n}`);
}

if (loi.length) {
	console.log(`kiem-muc-doc: KHÔNG ĐẠT, ${loi.length} lỗi`);
	for (const l of loi.slice(0, 40)) console.log('  - ' + l);
	process.exit(1);
}
console.log(
	`kiem-muc-doc: đạt (${json.length} nguồn, nguon.csv khớp nguon.json; ` +
		Object.keys(MUC_DOC).map((ma) => `${MUC_DOC[ma].ten} ${dem[ma] || 0}`).join(', ') + ')',
);
