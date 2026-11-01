// Chuẩn bị nội dung trước khi build:
//  - chép các bài của khu đang bật từ noi-dung/<khu>/ sang src/content/docs/<khu>/<slug>.md
//  - viết lại front-matter cho Starlight, bỏ tiêu đề H1 trùng, nối liên kết giữa các bài
//  - chèn máy tính tương tác vào đúng chỗ trong bài
//  - sinh trang Nguồn từ nguon/nguon.json
// Chạy: npm run chuan-bi (tự chạy trong npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { tenNgan, htmlNhan } from '../src/plugins/remark-nhan.mjs';
import { KHU } from '../src/data/khu.mjs';

const GOC = process.cwd();
const DOCS = path.join(GOC, 'src/content/docs');
const KHU_BAT = ['nhu-tuong', 'chat-beo', 'chat-nhu-hoa', 'chat-on-dinh'];
const TEN_KHU = { 'nhu-tuong': 'Nhũ tương', 'chat-beo': 'Chất béo', 'chat-nhu-hoa': 'Chất nhũ hóa', 'chat-on-dinh': 'Chất ổn định' };

// Khóa lưu "đã đọc" trong máy người xem: bài nhũ tương giữ slug trần (tương thích dữ liệu cũ), khu khác thêm tên khu
const khoaDaDoc = (khu, slug) => (khu === 'nhu-tuong' ? slug : `${khu}/${slug}`);

// Máy tính chèn vào bài: [khu, slug, dòng mốc (máy tính đặt NGAY TRƯỚC dòng này), loại]
const MAY_TINH = [
	['nhu-tuong', 'mat-on-dinh', 'Hai nhận xét quan trọng:', 'stokes'],
	['nhu-tuong', 'nen-tang', '### 2.3 Các đường kính trung bình', 'chat-nhu-hoa-toi-thieu'],
	['nhu-tuong', 'su-co-thiet-ke', '## 3. Quy trình thiết kế công thức', 'chan-doan'],
	['chat-nhu-hoa', 'nen-tang-vat-ly-hoa-be-mat', '### Bảng HLB tham khảo', 'hlb'],
	['chat-beo', 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', '### 6.2 Bẫy cần tránh', 'arrhenius'],
];
// Tiêu đề gọn: bỏ "Chương 01 — " hay "01. " ở đầu
const tieuDeGon = (t) => t.replace(/^Chương\s+\d+\s*[—–-]\s*/, '').replace(/^\d{2}\.\s+/, '');
// Dòng ghi chú nội bộ ở khối trích đầu bài (chú giải nhãn, ngày soạn, tên file): không đưa lên web
const GHI_CHU_NOI_BO = /Nhãn|Soạn ngày|Luồng "|chú giải|Mức tin cậy|Mức xác minh|\[(?:N|K|G|T)[^\]]*\]\s*=|\.md`/;
function boGhiChuDau(body) {
	const dong = body.split('\n');
	let i = 0;
	while (i < dong.length && dong[i].trim() === '') i++;
	const dau = i;
	while (i < dong.length && dong[i].startsWith('>')) i++;
	if (i === dau) return body.replace(/^\s*(?:---[ \t]*\n\s*)+/, '');
	const giu = dong.slice(dau, i).filter((d) => !GHI_CHU_NOI_BO.test(d) && d.replace(/^>\s*/, '').trim() !== '');
	return [...dong.slice(0, dau), ...giu, ...dong.slice(i)].join('\n').replace(/^\s*(?:---[ \t]*\n\s*)+/, '');
}

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
		const sl = (fm.slug || '').toLowerCase();
		const congKhai = fm.hien_tren_web === 'true' && fm.loai !== 'muc-luc';
		slugTheoFile[f] = congKhai ? sl : null;
		if (congKhai) slugTheoSo[f.slice(0, 2)] = sl;
	}
	for (const f of tep) {
		const [fm, than] = docFrontMatter(fs.readFileSync(path.join(nguonDir, f), 'utf8'));
		if (fm.hien_tren_web !== 'true' || fm.loai === 'muc-luc') continue; // trang lộ trình viết tay
		fm.slug = fm.slug.toLowerCase(); // Astro đổi đường dẫn sang chữ thường
		fm.title = tieuDeGon(fm.title);
		let body = boGhiChuDau(than.replace(/^#\s+.+\n+/, '')); // H1 trùng với tiêu đề Starlight
		// trong nhãn, ":chữ" (vd. "11(5):3144") bị Starlight hiểu thành cú pháp directive và cắt nhãn làm đôi -> thoát dấu ":"
		body = body.replace(/\[(?:N|K|T|G)[:;][^\]\n]*\]/g, (m) => m.slice(0, 2) + m.slice(2).replace(/:(?=[\p{L}\d])/gu, '\\:'));
		// `03-ten-file.md` trong chữ -> liên kết tới bài (hoặc trang Nguồn với file danh mục nguồn)
		body = body.replace(/`(\d{2}-[\w-]+\.md)`/g, (m, ten) =>
			slugTheoFile[ten] ? `[bài ${ten.slice(0, 2)}](../${slugTheoFile[ten]}/)` : ten in slugTheoFile ? '[trang Nguồn](../../nguon/)' : m,
		);
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
			const khoi = loai === 'chan-doan' ? '<div class="chan-doan" data-chan-doan></div>' : `<div class="may-tinh" data-may-tinh="${loai}"></div>`;
			body = body.replace(moc, `${khoi}\n\n${moc}`);
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
			body += `\n\n<div class="ket-bai not-content" data-ket-bai="${khoaDaDoc(khu, fm.slug)}" data-khu="${khu}" data-tong="${KHU[khu].bai.length}" data-ten-khu="${TEN_KHU[khu]}"><div class="kb-chu"><b>Đọc xong bài này?</b><small data-tien-do>Đánh dấu để theo dõi lộ trình của bạn. Dữ liệu chỉ lưu trên máy này.</small></div><button type="button" class="kb-nut" data-danh-dau>Đánh dấu đã đọc</button></div>\n`;
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
// ---------------- trang Tra cứu phụ gia (gom từ bảng mã INS/E của khu chất nhũ hóa và chất ổn định)
const BASE = '/nhu-tuong';
function dongBang(text, tieuDe) {
	// các dòng của bảng Markdown đầu tiên ngay sau tiêu đề (bỏ dòng tiêu đề cột và dòng ---)
	const i = text.indexOf(tieuDe);
	if (i < 0) throw new Error(`Không thấy mục "${tieuDe}" để dựng trang tra cứu phụ gia`);
	const dong = text.slice(i).split('\n');
	const bang = [];
	let vao = false;
	for (const d of dong.slice(1)) {
		if (/^\|/.test(d)) { vao = true; bang.push(d); }
		else if (vao) break;
	}
	return bang.slice(2).map((d) => d.split('|').slice(1, -1).map((c) => c.trim()));
}
function mdNho(chu) {
	// Markdown ngắn trong ô bảng -> HTML: nhãn tin cậy, **đậm**, [chữ](link)
	const nhan = [];
	let t = chu.replace(/\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/g, (m) => `\u0000${nhan.push(m) - 1}\u0000`);
	t = esc(t)
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	return t.replace(/\u0000(\d+)\u0000/g, (m, k) => htmlNhan(nhan[Number(k)], BASE));
}
const maTrongChu = (c) => {
	// "E472a–f" -> 472a…472f ; "E432–436" -> 432…436 ; "SSL E481, CSL E482" -> 481, 482
	const ra = [];
	for (const m of c.matchAll(/E?(\d{3,4})([a-f])?(?:\s*[–-]\s*E?(\d{3,4}|[a-f]))?/g)) {
		const [, so, chu, den] = m;
		if (chu && den && /^[a-f]$/.test(den)) for (let x = chu.charCodeAt(0); x <= den.charCodeAt(0); x++) ra.push(so + String.fromCharCode(x));
		else if (!chu && den && /^\d+$/.test(den)) for (let x = Number(so); x <= Number(den); x++) ra.push(String(x));
		else ra.push(so + (chu || ''));
	}
	return ra;
};
const docGoc = (khu, tep) => fs.readFileSync(path.join(GOC, 'noi-dung', khu, fs.readdirSync(path.join(GOC, 'noi-dung', khu)).find((f) => f.startsWith(tep))), 'utf8');
const nhGoc = docGoc('chat-nhu-hoa', '04-');
const odGoc = docGoc('chat-on-dinh', '06-');
const adi = dongBang(nhGoc, '## 4.2 Bảng EFSA');
const adiTheoMa = {};
for (const [ten, ketLuan, so, nguonAdi] of adi) for (const ma of maTrongChu(ten)) adiTheoMa[ma] = { ketLuan, so, nguonAdi };
const phuGia = [];
for (const [ma, ten, chucNang, xacMinh] of dongBang(nhGoc, '### Bảng INS/E của chất nhũ hóa chính')) {
	const chinh = maTrongChu(ma)[0];
	const a = adiTheoMa[chinh] || adiTheoMa[chinh?.replace(/[a-f]$/, '')];
	phuGia.push({
		ma: /^\d/.test(ma) ? ma.replace(/(\d{3,4})/, 'E$1') : ma,
		ten, nhom: 'Chất nhũ hóa', chucNang, xacMinh,
		efsa: a ? a.ketLuan : '', adi: a ? a.so : '', nguon: a ? a.nguonAdi : '',
		bai: 'chat-nhu-hoa/ma-ins-quy-dinh-an-toan',
	});
}
for (const [ten, ma, efsa, jecfa, nguonOd] of dongBang(odGoc, '## Bảng tổng hợp')) {
	phuGia.push({ ma, ten, nhom: 'Chất ổn định', chucNang: '', xacMinh: '[N]', efsa, jecfa, nguon: nguonOd, bai: 'chat-on-dinh/quy-dinh-ins-e' });
}
for (const [ten, ghiChu] of dongBang(odGoc, '## Đã biết nhưng **chưa xác minh')) {
	if (!/E\d|INS \d|[Gg]elatin/.test(ten)) continue;
	// mã gọn: nhiều mã E thì ghi thành khoảng (E460–E466), kèm mã INS nếu có; không có mã thì "—"
	const soE = [...new Set([...ten.matchAll(/E(\d{3,4})/g)].map((m) => Number(m[1])))];
	const maE = soE.length > 2 ? [`E${Math.min(...soE)}–E${Math.max(...soE)}`] : soE.map((x) => `E${x}`);
	const ma = [...maE, ...[...ten.matchAll(/INS (\d+)/g)].map((m) => `INS ${m[1]}`)].join(', ');
	phuGia.push({ ma: ma || '—', ten: ten.replace(/\s*\(E\d+\)/, ''), nhom: 'Chất ổn định', chucNang: '', xacMinh: '[K]', efsa: '', chuaXacMinh: ghiChu, nguon: '', bai: 'chat-on-dinh/quy-dinh-ins-e' });
}
const theGia = phuGia
	.map((g) => {
		const chua = g.chuaXacMinh !== undefined;
		const dong = (nhan, gt) => (gt ? `<div><dt>${nhan}</dt><dd>${mdNho(gt)}</dd></div>` : '');
		return `<li class="the-pg${chua ? ' chua' : ''}" data-nhom="${g.nhom}">
<div class="pg-dau"><span class="pg-ma">${esc(g.ma)}</span><span class="pg-nhom">${g.nhom}</span></div>
<div class="pg-ten">${mdNho(g.ten)}</div>
<dl class="pg-ds">${dong('Chức năng', g.chucNang)}${dong('Mức xác minh', g.xacMinh)}${dong('Kết luận EFSA', g.efsa)}${dong('ADI (mg/kg thể trọng/ngày)', g.adi)}${dong('JECFA', g.jecfa && g.jecfa !== 'không đọc' ? g.jecfa : '')}${dong('Chưa xác minh', g.chuaXacMinh)}${dong('Nguồn', g.nguon)}</dl>
<a class="pg-bai" href="${BASE}/${g.bai}/">Đọc trong bài →</a>
</li>`;
	})
	.join('\n');
const soNhom = (n) => phuGia.filter((g) => g.nhom === n && g.chuaXacMinh === undefined).length;
fs.writeFileSync(
	path.join(DOCS, 'tra-cuu-phu-gia.md'),
	`---
title: Tra cứu phụ gia theo mã INS/E
description: Chất nhũ hóa và chất ổn định thường dùng — mã INS/E, chức năng, kết luận EFSA đã đọc, nguồn.
editUrl: false
tableOfContents: false
---

Gõ mã (ví dụ **471**, **E415**) hoặc tên chất để lọc. Thông tin gom tự động từ hai bài [Mã INS/E của chất nhũ hóa](../chat-nhu-hoa/ma-ins-quy-dinh-an-toan/) và [Mã INS/E của chất ổn định](../chat-on-dinh/quy-dinh-ins-e/): ${soNhom('Chất nhũ hóa')} dòng chất nhũ hóa, ${soNhom('Chất ổn định')} dòng chất ổn định, kèm các chất **chưa xác minh** được để riêng.

> **Không dùng trang này làm căn cứ pháp lý.** Ở Việt Nam, phụ gia được quản lý theo Thông tư 24/2019/TT-BYT (văn bản hợp nhất 08/VBHN-BYT năm 2023); phụ lục danh mục và mức tối đa (ML) theo nhóm thực phẩm **chưa được đối chiếu** trên web này. "Không cần ADI bằng số" không có nghĩa là dùng không giới hạn.

<div class="loc-pg not-content">
<input id="loc-phu-gia" class="loc-nguon" type="search" placeholder="Lọc theo mã hoặc tên: 471, lecithin, xanthan…" aria-label="Lọc phụ gia" />
<div class="loc-pg-nut" role="group" aria-label="Nhóm">
<button type="button" data-loc-nhom="" aria-pressed="true">Tất cả</button>
<button type="button" data-loc-nhom="Chất nhũ hóa" aria-pressed="false">Chất nhũ hóa</button>
<button type="button" data-loc-nhom="Chất ổn định" aria-pressed="false">Chất ổn định</button>
</div>
<p class="loc-pg-dem" data-dem-phu-gia></p>
</div>

<ul class="ds-pg not-content">
${theGia}
</ul>
`,
);
console.log(`chuan-bi: ${phuGia.length} dòng phụ gia`);
console.log(`chuan-bi: ${soBai} bài (${KHU_BAT.join(', ')}), ${ds.length} nguồn`);
