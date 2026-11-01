// Chuẩn bị nội dung trước khi build:
//  - chép các bài của khu đang bật từ noi-dung/<khu>/ sang src/content/docs/<khu>/<slug>.md
//  - viết lại front-matter cho Starlight, bỏ tiêu đề H1 trùng, nối liên kết giữa các bài
//  - chèn máy tính tương tác vào đúng chỗ trong bài
//  - sinh trang Nguồn từ nguon/nguon.json
// Chạy: npm run chuan-bi (tự chạy trong npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { tenNgan } from '../src/plugins/remark-nhan.mjs';

const GOC = process.cwd();
const DOCS = path.join(GOC, 'src/content/docs');
const KHU_BAT = ['nhu-tuong']; // đợt 1: chỉ khu nhũ tương; thêm 'chat-beo', 'chat-nhu-hoa', 'chat-on-dinh' ở bước 3
const TEN_KHU = { 'nhu-tuong': 'Nhũ tương', 'chat-beo': 'Chất béo', 'chat-nhu-hoa': 'Chất nhũ hóa', 'chat-on-dinh': 'Chất ổn định' };

// Máy tính chèn vào bài: [khu, slug, dòng mốc (máy tính đặt NGAY TRƯỚC dòng này), loại]
const MAY_TINH = [
	['nhu-tuong', 'mat-on-dinh', 'Hai nhận xét quan trọng:', 'stokes'],
	['nhu-tuong', 'nen-tang', '### 2.3 Các đường kính trung bình', 'chat-nhu-hoa-toi-thieu'],
];

function docFrontMatter(text) {
	const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
	if (!m) return [{}, text];
	const fm = {};
	for (const dong of m[1].split('\n')) {
		const i = dong.indexOf(':');
		if (i > 0) fm[dong.slice(0, i).trim()] = dong.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
	}
	return [fm, text.slice(m[0].length)];
}

const yaml = (s) => JSON.stringify(s);

function xoaVaTao(dir) {
	fs.rmSync(dir, { recursive: true, force: true });
	fs.mkdirSync(dir, { recursive: true });
}

fs.rmSync(path.join(GOC, 'bao-cao-build.json'), { force: true });
let soBai = 0;
for (const khu of KHU_BAT) {
	const nguonDir = path.join(GOC, 'noi-dung', khu);
	const dich = path.join(DOCS, khu);
	xoaVaTao(dich);
	// trang lộ trình của khu (viết tay trong trang/<khu>.md)
	fs.copyFileSync(path.join(GOC, 'trang', `${khu}.md`), path.join(dich, 'index.md'));
	const tep = fs.readdirSync(nguonDir).filter((f) => f.endsWith('.md')).sort();
	// bảng tra: tên file gốc / số thứ tự -> slug
	const slugTheoFile = {};
	const slugTheoSo = {};
	for (const f of tep) {
		const [fm] = docFrontMatter(fs.readFileSync(path.join(nguonDir, f), 'utf8'));
		slugTheoFile[f] = fm.slug;
		slugTheoSo[f.slice(0, 2)] = fm.slug;
	}
	for (const f of tep) {
		const [fm, than] = docFrontMatter(fs.readFileSync(path.join(nguonDir, f), 'utf8'));
		if (fm.hien_tren_web !== 'true' || fm.loai === 'muc-luc') continue; // trang lộ trình viết tay
		let body = than.replace(/^#\s+.+\n+/, ''); // H1 trùng với tiêu đề Starlight
		// liên kết tới bài khác: (03-co-che-mat-on-dinh.md) -> (../mat-on-dinh/)
		body = body.replace(/\]\((\d{2}-[\w-]+\.md)\)/g, (m, ten) => (slugTheoFile[ten] ? `](../${slugTheoFile[ten]}/)` : m));
		// "file 03" trong chữ -> liên kết tới bài 03
		body = body.replace(/\b[Ff]ile (0[1-9])\b/g, (m, so) => (slugTheoSo[so] ? `[bài ${so}](../${slugTheoSo[so]}/)` : m));
		// cột "Xem" của bảng thuật ngữ: | 01 | -> | [01](../nen-tang/) |
		if (fm.loai === 'thuat-ngu')
			body = body.replace(/\|\s*(0[1-9](?:,\s*0[1-9])*)\s*\|\s*$/gm, (m, ds) =>
				'| ' + ds.split(/,\s*/).map((so) => (slugTheoSo[so] ? `[${so}](../${slugTheoSo[so]}/)` : so)).join(', ') + ' |',
			);
		// bảng thuật ngữ -> src/data/thuat-ngu.json cho thẻ "Khái niệm hôm nay" ở trang chủ
		if (fm.loai === 'thuat-ngu') {
			const tron = (s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|`/g, '').trim();
			const dong = than.split('\n').filter((d) => /^\|/.test(d) && !/^\|\s*-/.test(d)).slice(1);
			const tn = dong.map((d) => d.split('|').slice(1, -1).map(tron)).filter((c) => c.length >= 3 && c[0]);
			const xem = (c) => (c[3] || '').split(/,\s*/)[0];
			fs.mkdirSync(path.join(GOC, 'src/data'), { recursive: true });
			fs.writeFileSync(
				path.join(GOC, 'src/data/thuat-ngu.json'),
				JSON.stringify(tn.map((c) => ({ vi: c[0], en: c[1], mo: c[2], bai: slugTheoSo[xem(c)] || null })), null, 1),
			);
		}
		for (const [k, slug, moc, loai] of MAY_TINH) {
			if (k !== khu || slug !== fm.slug) continue;
			if (!body.includes(moc)) throw new Error(`Không tìm thấy mốc chèn máy tính "${moc}" trong ${f}`);
			body = body.replace(moc, `<div class="may-tinh" data-may-tinh="${loai}"></div>\n\n${moc}`);
		}
		const dau = [
			'---',
			`title: ${yaml(fm.title)}`,
			`description: ${yaml(`${TEN_KHU[khu]} – ${fm.title}`)}`,
			'editUrl: false',
			'---',
			'',
			`<p class="nguon-goc-bai">Cập nhật ${fm.updated}. Nội dung gốc: <code>noi-dung/${khu}/${f}</code></p>`,
			'',
		].join('\n');
		// hộp cuối bài: đánh dấu đã đọc (lưu trong máy người xem)
		if (fm.loai === 'bai')
			body += `\n\n<div class="ket-bai not-content" data-ket-bai="${fm.slug}"><div class="kb-chu"><b>Đọc xong bài này?</b><small data-tien-do>Đánh dấu để theo dõi lộ trình của bạn. Dữ liệu chỉ lưu trên máy này.</small></div><button type="button" class="kb-nut" data-danh-dau>Đánh dấu đã đọc</button></div>\n`;
		// dòng trống sau thẻ <p> để Markdown không nuốt dòng đầu của bài vào khối HTML
		fs.writeFileSync(path.join(dich, `${fm.slug}.md`), dau + '\n' + body);
		soBai++;
	}
}

// ---------------- trang Nguồn
const ds = JSON.parse(fs.readFileSync(path.join(GOC, 'nguon/nguon.json'), 'utf8'));
const MUC = {
	'toan-van': ['Đọc toàn văn', 'muc-1'],
	'mot-phan': ['Đọc một phần / trang gốc', 'muc-2'],
	'tom-tat': ['Đọc tóm tắt', 'muc-3'],
	'tieu-de': ['Chỉ thấy tiêu đề', 'muc-4'],
	'tri-nho': ['Ghi từ trí nhớ, chưa kiểm', 'muc-5'],
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const dem = Object.fromEntries(Object.keys(MUC).map((k) => [k, ds.filter((e) => e.muc_doc === k).length]));
const the = ds
	.map((e) => {
		const lk = [];
		if (e.doi) lk.push(`<a href="https://doi.org/${esc(e.doi)}">DOI ${esc(e.doi)}</a>`);
		if (e.pmid) lk.push(`<a href="https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/">PubMed ${e.pmid}</a>`);
		if (!e.doi && !e.pmid && e.url) lk.push(`<a href="${esc(e.url)}">Đường dẫn</a>`);
		const trich = esc(e.trich_dan).replace(/\*([^*]+)\*/g, '<em>$1</em>');
		return `<li class="the-nguon" id="${e.khoa}" data-khu="${e.khu.join(' ')}" data-muc="${e.muc_doc}">
<div class="the-dau"><strong>${esc(tenNgan(e))}</strong> <span class="muc-doc ${MUC[e.muc_doc][1]}">${MUC[e.muc_doc][0]}</span> <span class="khu">${e.khu.map((k) => TEN_KHU[k]).join(', ')}</span></div>
<div class="the-trich">${trich}</div>
<div class="the-lk">${lk.join(' · ')}</div>
</li>`;
	})
	.join('\n');
fs.writeFileSync(
	path.join(DOCS, 'nguon.md'),
	`---
title: Nguồn
description: Danh mục chung các nguồn được trích trong web, kèm mức đã đọc của từng nguồn.
editUrl: false
tableOfContents: false
---

Mỗi huy hiệu **N** trong bài dẫn về một thẻ ở đây. Cột "mức đọc" cho biết người soạn đã đọc nguồn đến đâu: phần lớn mới đọc **tóm tắt**, nên con số quan trọng vẫn cần mở bản gốc trước khi dùng cho công thức thật.

| Mức đọc | Số nguồn |
|---|---|
${Object.entries(MUC).map(([k, [ten]]) => `| ${ten} | ${dem[k]} |`).join('\n')}
| **Tổng** | **${ds.length}** |

Không truy cập được trong lúc soạn: OpenAlex, Crossref, trang PMC (bị chặn xác minh). Vì vậy DOI chưa được kiểm chéo, và nhiều nguồn chỉ có đường dẫn trang Consensus.

<input id="loc-nguon" class="loc-nguon" type="search" placeholder="Lọc theo tên tác giả, năm, từ khóa…" aria-label="Lọc nguồn" />

<ul class="ds-nguon">
${the}
</ul>
`,
);
console.log(`chuan-bi: ${soBai} bài (${KHU_BAT.join(', ')}), ${ds.length} nguồn`);
