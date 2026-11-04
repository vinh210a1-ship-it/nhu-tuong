// Chuẩn bị nội dung trước khi build:
//  - chép các bài của khu đang bật từ noi-dung/<khu>/ sang src/content/docs/<khu>/<slug>.md
//  - viết lại front-matter cho Starlight, bỏ tiêu đề H1 trùng, nối liên kết giữa các bài
//  - chèn máy tính tương tác vào đúng chỗ trong bài
//  - sinh trang Nguồn từ nguon/nguon.json
// Chạy: npm run chuan-bi (tự chạy trong npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { tenNgan, htmlNhan, tachNhan, SO_DON_VI } from '../src/plugins/remark-nhan.mjs';
import { KHU } from '../src/data/khu.mjs';
import { dungTraCuu } from './tra-cuu.mjs';
import { docTep } from './doc-tep.mjs';

const GOC = process.cwd();
const DOCS = path.join(GOC, 'src/content/docs');
const KHU_BAT = ['nhu-tuong', 'chat-beo', 'chat-nhu-hoa', 'chat-on-dinh', 'thuc-pham', 'duoc-pham'];
const TEN_KHU = { 'nhu-tuong': 'Nhũ tương', 'chat-beo': 'Chất béo', 'chat-nhu-hoa': 'Chất nhũ hóa', 'chat-on-dinh': 'Chất ổn định', 'thuc-pham': 'Thực phẩm', 'duoc-pham': 'Dược phẩm' };

// Khóa lưu "đã đọc" trong máy người xem: bài nhũ tương giữ slug trần (tương thích dữ liệu cũ), khu khác thêm tên khu
const khoaDaDoc = (khu, slug) => (khu === 'nhu-tuong' ? slug : `${khu}/${slug}`);

// Máy tính chèn vào bài: [khu, slug, dòng mốc (máy tính đặt NGAY TRƯỚC dòng này), loại]
const MAY_TINH = [
	['nhu-tuong', 'mat-on-dinh', 'Hai nhận xét quan trọng:', 'stokes'],
	['nhu-tuong', 'nen-tang', '### 2.3 Các đường kính trung bình', 'chat-nhu-hoa-toi-thieu'],
	['nhu-tuong', 'su-co-thiet-ke', '## 3. Quy trình thiết kế công thức', 'chan-doan'],
	['chat-nhu-hoa', 'nen-tang-vat-ly-hoa-be-mat', '### Bảng HLB tham khảo', 'hlb'],
	['chat-beo', 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', '### 6.2 Bẫy cần tránh', 'arrhenius'],
	['nhu-tuong', 'nen-tang', '### 3.2 Hấp phụ (Gibbs) và độ phủ', 'laplace'],
	['nhu-tuong', 'mat-on-dinh', '### Điều kiện hay gặp trong thực phẩm', 'debye'],
	['nhu-tuong', 'mat-on-dinh', '### Chất ức chế ripening (ripening inhibitor)', 'ostwald'],
	['nhu-tuong', 'he-dac-biet', '### 2.3 Các loại hạt thực phẩm', 'pickering'],
	['chat-beo', 'cau-truc-triglyceride-va-acid-beo', '## 8. Điều đã chắc', 'iv-sv'],
	['chat-beo', 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', '## 6. Hạn sử dụng: Arrhenius', 'totox'],
	['thuc-pham', 'bao-quan-hoat-do-nuoc-va-han-su-dung', '## 4. Nitrit, muối ướp và màu thịt', 'axit-yeu'],
	['thuc-pham', 'qua-trinh-nhiet-lanh-say-ep-dun', '## 2. Đông lạnh và trạng thái thủy tinh', 'gia-tri-f'],
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

// Định dạng của bộ tài liệu mới (thực phẩm, dược): nhãn viết trong dấu `...`, khóa nguồn trần `@a; @b`,
// dòng giải thích quy ước nhãn, mục ghi "(không đưa lên web)". Đưa về đúng định dạng web và bỏ phần nội bộ.
const NHAN_TRONG_CODE = /`(\[(?:N|K|T|G)[^\]`\n]*\])`/g;
const KHOA_TRAN = /`(@[a-z][a-z0-9-]*(?:;\s*@[a-z][a-z0-9-]*)*)`/g;
const BAO_AN = '<span class="an-so-lieu">Số liệu sách nền ở đây đang chờ đối chiếu số trang nên tạm ẩn. <span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span></span>';
function chuanHoaDinhDang(body) {
	body = body
		.replace(/^(?:Quy ước nhãn|Nhãn): `\[N.*\n+/gm, '') // dòng giải thích quy ước (đã có ở trang "Cách đọc nhãn")
		.replace(NHAN_TRONG_CODE, '$1')
		.replace(KHOA_TRAN, '[N: $1]')
		.replace(/^Chú thích dùng khi lên web:/gm, 'Chú thích:')
		// "## 4. Mô hình lab đề xuất (`[T]` ...)" -> tiêu đề cho người đọc, nhãn T đặt dưới tiêu đề
		.replace(/^(#{2,4} (?:\d+\. )?)Mô hình lab đề xuất.*$/gm, '$1Mô hình định lượng minh họa [T]');
	// bỏ cả mục có tiêu đề ghi "(không đưa lên web)" tới tiêu đề cùng cấp kế tiếp
	body = body.replace(/^(#{2,4}) [^\n]*\(không đưa lên web\)[^\n]*\n[\s\S]*?(?=^#{2,4} |(?![\s\S]))/gm, (m, h) => '');
	// trong một dòng có cả nhãn N/T lẫn K: đoạn câu nào kết thúc bằng [K] mà có số kèm đơn vị thì ẩn riêng đoạn đó
	return body
		.split('\n')
		.map((d) => {
			if (!/\[K\]/.test(d) || !/\[(?:N|T)[\]:;]/.test(d)) return d;
			const re = /\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/g;
			let ra = '', dau = 0, m;
			while ((m = re.exec(d))) {
				let doan = d.slice(dau, m.index);
				const chiK = tachNhan(m[0]).every((x) => x.ma === 'K');
				let cuoi = m.index + m[0].length;
				if (chiK && SO_DON_VI.test(doan)) {
					const tienTo = (/^\s*(?:[-*]|\d+\.)\s+(?:\*\*[^*]+\*\*\s*)?/.exec(doan) || [''])[0];
					ra += (ra && !/\s$/.test(ra) && !tienTo ? " " : "") + tienTo + BAO_AN;
					// câu chú kèm ngay sau nhãn ("— chỉ dùng nội bộ ...") cũng bỏ
					const sau = /^\s*—[^.]*\.?/.exec(d.slice(cuoi));
					if (sau) cuoi += sau[0].length;
				} else ra += doan + m[0];
				dau = cuoi;
				re.lastIndex = cuoi;
			}
			return ra + d.slice(dau);
		})
		.join('\n');
}

// Công thức viết cả trên MỘT dòng ($$...$$) bị remark-math hiểu là công thức trong dòng (không có khung cuộn,
// tràn ngang trên điện thoại). Tách thành khối 3 dòng ($$ / công thức / $$) để thành công thức dạng khối.
// Chỉ đổi dòng mà cả dòng là một công thức; giữ phần thụt đầu dòng hoặc dấu ">" của khối trích.
function tachCongThucMotDong(body) {
	return body.replace(/^([ \t]*(?:>[ \t]*)*)\$\$([^$\n]+)\$\$[ \t]*$/gm, (m, tienTo, ct) => `${tienTo}$$\n${tienTo}${ct.trim()}\n${tienTo}$$`);
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
	fs.writeFileSync(path.join(dich, 'index.md'), docTep(path.join(GOC, 'trang', `${khu}.md`)));
	const tep = fs.readdirSync(nguonDir).filter((f) => f.endsWith('.md')).sort();
	// bảng tra: tên file gốc / số thứ tự -> slug
	const slugTheoFile = {};
	const slugTheoSo = {};
	for (const f of tep) {
		const [fm] = docFrontMatter(docTep(path.join(nguonDir, f)));
		const sl = (fm.slug || '').toLowerCase();
		const congKhai = fm.hien_tren_web === 'true' && fm.loai !== 'muc-luc';
		slugTheoFile[f] = congKhai ? sl : null;
		if (congKhai) slugTheoSo[f.slice(0, 2)] = sl;
	}
	for (const f of tep) {
		const [fm, than] = docFrontMatter(docTep(path.join(nguonDir, f)));
		if (fm.hien_tren_web !== 'true' || fm.loai === 'muc-luc') continue; // trang lộ trình viết tay
		fm.slug = fm.slug.toLowerCase(); // Astro đổi đường dẫn sang chữ thường
		fm.title = tieuDeGon(fm.title);
		let body = boGhiChuDau(than.replace(/^#\s+.+\n+/, '')); // H1 trùng với tiêu đề Starlight
		body = tachCongThucMotDong(chuanHoaDinhDang(body));
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
			`<p class="nguon-goc-bai">Cập nhật ${fm.updated} · <a href="../../quy-uoc/">Cách đọc nhãn và giới hạn nội dung →</a></p>`,
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
// ---------------- thẻ phụ gia cho trang Tra cứu (gom từ bảng mã INS/E của khu chất nhũ hóa và chất ổn định)
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
const docGoc = (khu, tep) => docTep(path.join(GOC, 'noi-dung', khu, fs.readdirSync(path.join(GOC, 'noi-dung', khu)).find((f) => f.startsWith(tep))));
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
// phụ gia thực phẩm khác: bảng ADI đã kiểm của khu thực phẩm
const tpGoc = chuanHoaDinhDang(docGoc('thuc-pham', '09-'));
for (const [chat, jecfa, efsa, nguonTp] of dongBang(tpGoc, '**Kết luận trước.**')) {
	const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(chat);
	const ten = m ? m[1] : chat;
	const ma = m ? `INS ${m[2]}` : '—';
	// glutamat: cột JECFA lấy từ bài phản biện, chưa mở trang JECFA -> không đưa lên thẻ tra cứu
	const jecfaCo = /glutamat/i.test(ten) ? '' : jecfa;
	phuGia.push({ ma, ten, nhom: 'Phụ gia khác', chucNang: '', xacMinh: '', efsa: /chưa tra/.test(efsa) ? '' : efsa, jecfa: /chưa tra/.test(jecfaCo) ? '' : jecfaCo, nguon: nguonTp, bai: 'thuc-pham/quy-dinh-jecfa-efsa-da-kiem' });
}
// liên kết từ thẻ phụ gia sang bảng ML của TT24 (chỉ khi mã có trong Phụ lục 1)
const insTt24 = JSON.parse(fs.readFileSync(path.join(GOC, 'public/du-lieu/tt24.json'), 'utf8')).pl1.map(([ins]) => ins);
const lkTt24 = (ma) => {
	// mã đầu tiên sau "E" hoặc "INS" (với khoảng E460–E466 lấy mã đầu); khớp cả khi Phụ lục 1 ghi thêm (i) hay chữ: 960 -> 960a
	const so = [...String(ma).matchAll(/(?<!–)(?:E|INS )(\d{3,4}[a-z]?)/g)]
		.map((m) => m[1])
		.find((x) => insTt24.some((i) => i === x || i.startsWith(x + '(') || (/^\d+$/.test(x) && new RegExp(`^${x}[a-z]`).test(i))));
	return so ? `<a class="pg-bai pg-tt24" href="${BASE}/tra-cuu/?q=${so}#tt24">Mức tối đa theo TT24 →</a>` : '';
};
const theGia = phuGia
	.map((g) => {
		const chua = g.chuaXacMinh !== undefined;
		const dong = (nhan, gt) => (gt ? `<div><dt>${nhan}</dt><dd>${mdNho(gt)}</dd></div>` : '');
		return `<li class="the-pg${chua ? ' chua' : ''}" data-nhom="${g.nhom}">
<div class="pg-dau"><span class="pg-ma">${esc(g.ma)}</span><span class="pg-nhom">${g.nhom}</span></div>
<div class="pg-ten">${mdNho(g.ten)}</div>
<dl class="pg-ds">${dong('Chức năng', g.chucNang)}${dong('Mức xác minh', g.xacMinh)}${dong(g.nhom === 'Phụ gia khác' ? 'EFSA' : 'Kết luận EFSA', g.efsa)}${dong('ADI (mg/kg thể trọng/ngày)', g.adi)}${dong(g.nhom === 'Phụ gia khác' ? 'JECFA (ADI, mg/kg thể trọng/ngày)' : 'JECFA', g.jecfa && g.jecfa !== 'không đọc' ? g.jecfa : '')}${dong('Chưa xác minh', g.chuaXacMinh)}${dong('Nguồn', g.nguon)}</dl>
<a class="pg-bai" href="${BASE}/${g.bai}/">Đọc trong bài →</a>${lkTt24(g.ma)}
</li>`;
	})
	.join('\n');
const soNhom = (n) => phuGia.filter((g) => g.nhom === n && g.chuaXacMinh === undefined).length;
// Trang Tra cứu = thẻ phụ gia (ở trên) + từ điển Anh–Việt, dựng ở scripts/tra-cuu.mjs. Trang cũ /tra-cuu-phu-gia/ chuyển hướng (astro.config.mjs).
fs.rmSync(path.join(DOCS, 'tra-cuu-phu-gia.md'), { force: true });
const tc = dungTraCuu({ GOC, DOCS, BASE, theGia, soPhuGia: phuGia.length, soNhom });
console.log(`chuan-bi: trang Tra cứu: ${tc.soTu} từ (${tc.soTuBai} từ bảng thuật ngữ trong bài), ${tc.soLinhVuc} lĩnh vực`);
console.log(`chuan-bi: ${phuGia.length} dòng phụ gia`);
console.log(`chuan-bi: ${soBai} bài (${KHU_BAT.join(', ')}), ${ds.length} nguồn`);
