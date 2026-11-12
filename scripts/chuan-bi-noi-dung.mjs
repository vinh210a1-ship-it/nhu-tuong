// Chuẩn bị nội dung trước khi build:
//  - chép các bài của khu đang bật từ noi-dung/<khu>/ sang src/content/docs/<khu>/<slug>.md
//  - viết lại front-matter cho Starlight, bỏ tiêu đề H1 trùng, nối liên kết giữa các bài
//  - chèn máy tính tương tác vào đúng chỗ trong bài
//  - sinh trang Nguồn từ nguon/nguon.json
// Chạy: npm run chuan-bi (tự chạy trong npm run build)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { tenNgan, htmlNhan, tachNhan, SO_DON_VI } from '../src/plugins/remark-nhan.mjs';
import { KHU } from '../src/data/khu.mjs';
import { dungTraCuu } from './tra-cuu.mjs';
import { docTep } from './doc-tep.mjs';
import { htmlLienQuan, kiemLienQuan } from '../src/data/lien-quan-khu.mjs';
import { htmlBanDo } from '../src/data/ban-do-khu.mjs';
import { htmlThuNgay, htmlMucDo, htmlCanBietTruoc, htmlCanBietTruocKhu, CONG_CU_BAI } from '../src/data/cong-cu-bai.mjs';
import { docTuKiemTra, kiemTuKiemTra, htmlTuKiemTra } from './tu-kiem-tra.mjs';

const GOC = process.cwd();
kiemLienQuan(); // dữ liệu hộp "Liên quan ở khu khác" sai (bài lạ, cùng khu, quá 3 dòng) thì dừng build
const DOCS = path.join(GOC, 'src/content/docs');
const KHU_BAT = ['nhu-tuong', 'chat-beo', 'chat-nhu-hoa', 'chat-on-dinh', 'thuc-pham', 'duoc-pham'];
const TEN_KHU = { 'nhu-tuong': 'Nhũ tương', 'chat-beo': 'Chất béo', 'chat-nhu-hoa': 'Chất nhũ hóa', 'chat-on-dinh': 'Chất ổn định', 'thuc-pham': 'Thực phẩm', 'duoc-pham': 'Dược phẩm' };

// Khóa lưu "đã đọc" trong máy người xem: bài nhũ tương giữ slug trần (tương thích dữ liệu cũ), khu khác thêm tên khu
// câu hỏi tự kiểm tra của 8 bài nhũ tương (noi-dung/nhu-tuong/tu-kiem-tra.md); mỗi đáp án phải có căn cứ N hoặc T trong bài
const TU_KIEM_TRA = docTuKiemTra(path.join(GOC, 'noi-dung/nhu-tuong/tu-kiem-tra.md'));
// các khu khác: mỗi khu có thể có tệp noi-dung/<khu>/tu-kiem-tra.md; khu nào có tệp thì MỌI bài của khu đó phải có 2–3 câu
const TU_KIEM_TRA_KHU = Object.fromEntries(
	KHU_BAT.filter((k) => k !== 'nhu-tuong' && fs.existsSync(path.join(GOC, 'noi-dung', k, 'tu-kiem-tra.md'))).map((k) => [k, docTuKiemTra(path.join(GOC, 'noi-dung', k, 'tu-kiem-tra.md'))]),
);
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
// tên bài (ngắn, như ở thanh bên) theo khu và slug; dùng làm chữ liên kết thay cho số tệp nội bộ như "bài 03"
const tenBaiNgan = (khu, slug) => {
	const b = (KHU[khu]?.bai ?? []).find((x) => x.slug === slug);
	return b ? b.ten.replace(/^\d+\.\s+/, '') : null;
};
// ---- Gói T5: ngày đăng lần đầu lấy từ lịch sử git (commit đầu tiên chạm tệp nguồn).
// Bản clone nông (CI không có fetch-depth: 0) sẽ báo sai ngày, nên chỉ tin git khi lịch sử đầy đủ; không thì bỏ, không báo lỗi.
const gitDayDu = (() => {
	try {
		return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: GOC, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'false';
	} catch {
		return false;
	}
})();
function ngayDangDau(tepTuongDoi) {
	if (!gitDayDu) return null;
	try {
		const ra = execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%as', '--', tepTuongDoi], { cwd: GOC, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
			.split('\n')
			.filter(Boolean);
		return ra.length ? ra[ra.length - 1] : null;
	} catch {
		return null;
	}
}
// ---------------- hình cơ chế (T1): src/hinh/<khu>/<tên>.svg + <tên>.md (chú thích, viết Markdown, nhãn [N]/[T]/[K]/[G] như trong bài)
// Trong bài gốc, dòng riêng `<!-- hinh: tên -->` được thay bằng khối <figure>. Hình tìm trong src/hinh/<khu của bài>/.
// Khối HTML không được có dòng trống bên trong <svg> (Markdown sẽ cắt khối); id trong hình được thêm tiền tố h-<tên>- để hai hình trên một trang không trùng id.
function htmlHinh(khu, ten) {
	const tep = path.join(GOC, 'src/hinh', khu, `${ten}.svg`);
	const tepCt = path.join(GOC, 'src/hinh', khu, `${ten}.md`);
	if (!fs.existsSync(tep) || !fs.existsSync(tepCt)) throw new Error(`Hình "${ten}" (dòng <!-- hinh: ${ten} --> trong khu ${khu}) thiếu src/hinh/${khu}/${ten}.svg hoặc ${ten}.md`);
	const tt = `h-${ten}-`;
	const svg = fs
		.readFileSync(tep, 'utf8')
		.replace(/\r/g, '')
		.trim()
		.replace(/\bid="([^"]+)"/g, `id="${tt}$1"`)
		.replace(/aria-labelledby="([^"]+)"/g, (m, v) => `aria-labelledby="${v.split(/\s+/).map((x) => tt + x).join(' ')}"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${tt}$1)`)
		.replace(/href="#([^"]+)"/g, `href="#${tt}$1"`);
	const chuThich = fs.readFileSync(tepCt, 'utf8').replace(/\r/g, '').trim();
	return `<figure class="hinh-co-che not-content">\n<div class="hinh-svg">\n${svg}\n</div>\n\n<figcaption>\n\n${chuThich}\n\n</figcaption>\n\n</figure>`;
}

const escHtml = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SITE = 'https://vinh210a1-ship-it.github.io/nhu-tuong';
const TEN_WEB = 'Web kiến thức nhũ tương thực phẩm';
/** Hộp "Cách trích dẫn trang này": đóng sẵn, có nút chép; ngày truy cập do public/trich-dan.js điền theo máy người đọc. */
function htmlTrichDan(khu, slug, tieuDe, moc) {
	return `<details class="trich-dan-trang not-content" data-pagefind-ignore><summary>Cách trích dẫn trang này</summary><p class="td-chu">${escHtml(TEN_WEB)} (2026). ${escHtml(tieuDe)}. ${escHtml(moc)}. ${SITE}/${khu}/${slug}/ (truy cập <span data-truy-cap>(ngày truy cập)</span>).</p><button type="button" class="td-chep" data-chep-trich-dan>Chép</button></details>`;
}
/** Thẻ meta cho Google Scholar và Dublin Core, ghi vào front matter (Starlight đọc khóa head). */
function dauMetaTrichDan(tieuDe, dang, capNhat) {
	const dinhDang = (d) => d.replace(/-/g, '/');
	const the = [['citation_title', tieuDe], ['citation_author', TEN_WEB]];
	if (dang) the.push(['citation_publication_date', dinhDang(dang)]);
	the.push(['citation_online_date', dinhDang(capNhat)], ['citation_language', 'vi'], ['DC.rights', 'CC BY 4.0']);
	return ['head:', ...the.map(([ten, nd]) => `  - tag: meta\n    attrs: ${JSON.stringify({ name: ten, content: nd })}`)].join('\n');
}

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
		// ghi chú của người soạn gửi người giao việc: mục "Bước tiếp theo", dòng "Đề xuất:" (không phải nội dung cho người đọc)
		.replace(/^[ \t]*(?:[-*]\s+)?\*\*(?:Bước tiếp theo|Đề xuất)[^\n]*\n?/gm, '')
		// tiêu đề "Chắc chắn / giả thuyết / bước tiếp theo" -> bỏ phần "bước tiếp theo" vì mục đó đã bị bỏ
		.replace(/^(#{2,4} (?:\d+\. )?)(?:Điều chắc|Điều đã chắc|Chắc chắn)[^\n]*bước tiếp theo[^\n]*$/gm, '$1Điều đã chắc và điều còn là giả thuyết')
		// "phiên" = phiên làm việc của người soạn: người đọc không biết phiên nào
		.replace(/ ?\(đọc trong phiên\)/g, '')
		.replace(/ (?:trong|từ) phiên(?: này)?(?! bản)/g, '')
		.replace(/^(?:Quy ước nhãn|Nhãn): `\[N.*\n+/gm, '') // dòng giải thích quy ước (đã có ở trang "Cách đọc nhãn")
		.replace(NHAN_TRONG_CODE, '$1')
		.replace(KHOA_TRAN, '[N: $1]')
		.replace(/^Chú thích dùng khi lên web:/gm, 'Chú thích:')
		// "## 4. Mô hình lab đề xuất (`[T]` ...)" -> tiêu đề cho người đọc, nhãn T đặt dưới tiêu đề
		.replace(/^(#{2,4} (?:\d+\. )?)Mô hình lab đề xuất.*$/gm, '$1Mô hình định lượng minh họa [T]');
	// bỏ cả mục có tiêu đề ghi "(không đưa lên web)" tới tiêu đề cùng cấp kế tiếp
	body = body.replace(/^(#{2,4}) [^\n]*(?:\(không đưa lên web\)|Cách bổ sung cho web|Đề xuất khung trình bày trên web)[^\n]*\n[\s\S]*?(?=^#{2,4} |(?![\s\S]))/gm, (m, h) => '');
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
	// bản đồ lộ trình bằng hình (src/data/ban-do-khu.mjs) đặt ngay trên bảng lộ trình; bảng giữ lại cho trình đọc màn hình và bản in
	{
		const trangKhu = docTep(path.join(GOC, 'trang', `${khu}.md`));
		const viTri = trangKhu.search(/^\|/m);
		if (viTri < 0) throw new Error(`trang/${khu}.md: không tìm thấy bảng lộ trình để đặt bản đồ lên trên`);
		fs.writeFileSync(path.join(dich, 'index.md'), `${trangKhu.slice(0, viTri)}${htmlBanDo(khu)}\n\n${trangKhu.slice(viTri)}`);
	}
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
			slugTheoFile[ten] ? `[bài ${tenBaiNgan(khu, slugTheoFile[ten]) ?? ten.slice(0, 2)}](../${slugTheoFile[ten]}/)` : ten in slugTheoFile ? '[trang Nguồn](../../nguon/)' : m,
		);
		// liên kết tới bài khác: (03-co-che-mat-on-dinh.md) -> (../mat-on-dinh/)
		body = body.replace(/\]\((\d{2}-[\w-]+\.md)\)/g, (m, ten) => (slugTheoFile[ten] ? `](../${slugTheoFile[ten]}/)` : m));
		// "file 03" trong chữ -> liên kết tới bài 03
		body = body.replace(/\b[Ff]ile (0[1-9])\b/g, (m, so) => (slugTheoSo[so] ? `[bài ${tenBaiNgan(khu, slugTheoSo[so]) ?? so}](../${slugTheoSo[so]}/)` : m));
		// "bài 04–06" và "bài 04" bằng chữ (số theo tên tệp nguồn) -> liên kết bằng tên bài, không để số nội bộ lộ ra
		const lkBai = (so) => (slugTheoSo[so] && tenBaiNgan(khu, slugTheoSo[so]) ? `[${tenBaiNgan(khu, slugTheoSo[so])}](../${slugTheoSo[so]}/)` : null);
		body = body.replace(/(?<!\[)\b([Bb]ài) (0[1-9])\s*[–-]\s*(0[1-9])\b/g, (m, bai, a, b) => (lkBai(a) && lkBai(b) ? `${bai === 'Bài' ? 'Các bài' : 'các bài'} ${lkBai(a)} đến ${lkBai(b)}` : m));
		if (khu === 'duoc-pham') body = body.replace(/(?<!\[)\b([Bb])ài 10\b/g, (m, b) => `[${b === 'B' ? 'Trang' : 'trang'} Nguồn](../../nguon/)`); // tệp 10 là danh mục nguồn, không công khai
		body = body.replace(/(?<!\[)\b([Bb]ài) (0[1-9])\b/g, (m, bai, so) => (lkBai(so) ? `${bai} ${lkBai(so)}` : m));
		// cột "Xem" của bảng thuật ngữ: | 01 | -> | [01](../nen-tang/) |
		if (fm.loai === 'thuat-ngu')
			body = body.replace(/\|\s*(0[1-9](?:,\s*0[1-9])*)\s*\|\s*$/gm, (m, ds) =>
				'| ' + ds.split(/,\s*/).map((so) => (slugTheoSo[so] ? `[${tenBaiNgan(khu, slugTheoSo[so]) ?? so}](../${slugTheoSo[so]}/)` : so)).join(', ') + ' |',
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
		body = body.replace(/^<!--\s*hinh:\s*([a-z0-9-]+)\s*-->[ \t]*$/gm, (m, ten) => htmlHinh(khu, ten));
		for (const [k, slug, moc, loai] of MAY_TINH) {
			if (k !== khu || slug !== fm.slug) continue;
			if (!body.includes(moc)) throw new Error(`Không tìm thấy mốc chèn máy tính "${moc}" trong ${f}`);
			const khoi = loai === 'chan-doan' ? '<div class="chan-doan" data-chan-doan></div>' : `<div class="may-tinh" data-may-tinh="${loai}"></div>`;
			body = body.replace(moc, `${khoi}\n\n${moc}`);
		}
		const dangDau = ngayDangDau(`noi-dung/${khu}/${f}`);
		// Ngày "updated" ghi trong bài gốc có thể sớm hơn ngày bài lên repo; khi đó chưa có lần sửa lớn nào sau lúc đăng, nên chỉ in ngày đăng
		const chuaSuaLon = Boolean(dangDau) && fm.updated <= dangDau;
		const dongNgay = !dangDau ? `Sửa nội dung lớn ${fm.updated}` : chuaSuaLon ? `Đăng lần đầu ${dangDau}` : `Đăng lần đầu ${dangDau} · Sửa nội dung lớn ${fm.updated}`;
		const dau = [
			'---',
			`title: ${yaml(fm.title)}`,
			`description: ${yaml(`${TEN_KHU[khu]} – ${fm.title}`)}`,
			'editUrl: false',
			...(fm.loai === 'bai' ? [dauMetaTrichDan(fm.title, dangDau, chuaSuaLon ? dangDau : fm.updated)] : []),
			'---',
			'',
			`<p class="nguon-goc-bai">${khu === 'nhu-tuong' && fm.loai === 'bai' ? htmlMucDo(fm.level) + ' · ' : ''}${dongNgay} · <a href="../../quy-uoc/">Cách đọc nhãn và giới hạn nội dung →</a></p>`,
			...(khu === 'nhu-tuong' && fm.loai === 'bai' && htmlCanBietTruoc(fm.slug) ? [htmlCanBietTruoc(fm.slug)] : []),
			...(khu in TU_KIEM_TRA_KHU && fm.loai === 'bai' && htmlCanBietTruocKhu(khu, fm.slug) ? [htmlCanBietTruocKhu(khu, fm.slug)] : []),
			'',
		].join('\n');
		// hộp "Tự kiểm tra": 2 đến 3 câu, đáp án gập; kiểm căn cứ N/T ngay lúc dựng (sai thì dừng build)
		if (fm.loai === 'bai' && khu === 'nhu-tuong') {
			kiemTuKiemTra(fm.slug, TU_KIEM_TRA[fm.slug], body);
			body += `

${htmlTuKiemTra(fm.slug, TU_KIEM_TRA[fm.slug])}
`;
		}
		if (fm.loai === 'bai' && khu in TU_KIEM_TRA_KHU) {
			kiemTuKiemTra(`${khu}/${fm.slug}`, TU_KIEM_TRA_KHU[khu][fm.slug], body);
			body += `

${htmlTuKiemTra(`${khu}/${fm.slug}`, TU_KIEM_TRA_KHU[khu][fm.slug])}
`;
		}
		if (fm.loai === 'bai' && khu in TU_KIEM_TRA_KHU) {
			const thuNgay = htmlThuNgay(fm.slug, khu);
			if (thuNgay) body += `\n\n${thuNgay}\n`;
		}
		// hộp "Thử ngay" (nối bài với máy tính, Phòng lab, tra cứu; dữ liệu ở src/data/cong-cu-bai.mjs), đặt trước hộp "đã đọc"
		if (fm.loai === 'bai' && khu === 'nhu-tuong') {
			const thuNgay = htmlThuNgay(fm.slug);
			if (thuNgay) body += `\n\n${thuNgay}\n`;
		}
		// hộp "Liên quan ở khu khác" (gói L4; dữ liệu ở src/data/lien-quan-khu.mjs), đặt sau "Thử ngay", trước hộp "đã đọc"
		if (fm.loai === 'bai') {
			const lienQuan = htmlLienQuan(khu, fm.slug);
			if (lienQuan) body += `\n\n${lienQuan}\n`;
		}
		// hộp cuối bài: đánh dấu đã đọc (lưu trong máy người xem)
		if (fm.loai === 'bai')
			body += `\n\n<div class="ket-bai not-content" data-ket-bai="${khoaDaDoc(khu, fm.slug)}" data-khu="${khu}" data-tong="${KHU[khu].bai.length}" data-ten-khu="${TEN_KHU[khu]}"><div class="kb-chu"><b>Đọc xong bài này?</b><small data-tien-do>Đánh dấu để theo dõi lộ trình của bạn. Dữ liệu chỉ lưu trên máy này.</small></div><button type="button" class="kb-nut" data-danh-dau>Đánh dấu đã đọc</button></div>\n`;
		// hộp "Cách trích dẫn trang này" (T5), cuối bài, sau hộp "Đọc xong bài này?"
		if (fm.loai === 'bai') body += `\n${htmlTrichDan(khu, fm.slug, fm.title, chuaSuaLon ? `Đăng ${dangDau}` : `Sửa nội dung lớn ${fm.updated}`)}\n`;
		// dòng trống sau thẻ <p> để Markdown không nuốt dòng đầu của bài vào khối HTML
		fs.writeFileSync(path.join(dich, `${fm.slug}.md`), dau + '\n' + body);
		soBai++;
	}
}

// ---------------- danh sách đồ thị của máy tính (T2): public/do-thi/<id>.js -> public/do-thi/index.json (sinh tự động, đã gitignore)
{
	const thuMuc = path.join(GOC, 'public/do-thi');
	const ds = fs.existsSync(thuMuc) ? fs.readdirSync(thuMuc).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).sort() : [];
	fs.mkdirSync(thuMuc, { recursive: true });
	fs.writeFileSync(path.join(thuMuc, 'index.json'), JSON.stringify(ds));
}

// ---------------- trang Nhật ký thay đổi (T5): 100 dòng mới nhất từ git log, chỉ tính commit chạm bài công khai
{
	// tệp nguồn công khai -> tên bài (tên bài lấy từ front matter hiện tại; tệp đã xóa hoặc không công khai thì bỏ)
	const tenBaiTheoTep = {};
	for (const khu of KHU_BAT)
		for (const f of fs.readdirSync(path.join(GOC, 'noi-dung', khu)).filter((x) => x.endsWith('.md'))) {
			const [fm] = docFrontMatter(docTep(path.join(GOC, 'noi-dung', khu, f)));
			if (fm.hien_tren_web === 'true' && fm.loai !== 'muc-luc' && fm.title) tenBaiTheoTep[`noi-dung/${khu}/${f}`] = (fm.slug && tenBaiNgan(khu, fm.slug.toLowerCase())) || tieuDeGon(fm.title);
		}
	const dong = [];
	if (gitDayDu) {
		try {
			const ra = execFileSync('git', ['log', '-n', '600', '--name-only', '--format=%x01%as%x09%s', '--', 'noi-dung/'], { cwd: GOC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
			for (const khoi of ra.split('\x01').filter(Boolean)) {
				const [dauKhoi, ...tep] = khoi.split('\n');
				const [ngay, ...tt] = dauKhoi.split('\t');
				const ten = [...new Set(tep.map((t) => tenBaiTheoTep[t.trim()]).filter(Boolean))];
				if (!ten.length) continue;
				const hien = ten.length > 3 ? `${ten.slice(0, 3).join(', ')} và ${ten.length - 3} bài khác` : ten.join(', ');
				dong.push(`- **${ngay}** · ${hien} · ${tt.join('\t').replace(/\s*\(#\d+\)\s*$/, '').replace(/\s*\((?:gói\s+)?[A-Z]\d[^)]*\)\s*$/, '').replace(/\s*\((?:gói\s+)?[GLTHB]\d[\w–-]*(?:\s*[+,]\s*[GLTHB]?\d[\w–-]*)*\)/g, '').replace(/([*_`\[\]<>])/g, '\\$1')}`);
				if (dong.length >= 100) break;
			}
		} catch {
			/* không đọc được git: để trang trống, không báo lỗi */
		}
	}
	fs.writeFileSync(
		path.join(DOCS, 'nhat-ky-thay-doi.md'),
		`---
title: Nhật ký thay đổi
description: Những lần sửa nội dung bài gần đây của web, mới nhất ở trên.
editUrl: false
tableOfContents: false
---

Mỗi dòng là một lần sửa làm đổi chữ trong ít nhất một bài (ngày · bài bị sửa · việc đã làm). Chỉ tính bài công khai; lần sửa chỉ chạm tệp nội bộ không hiện ở đây. Danh sách lấy từ lịch sử sửa tệp của web, tối đa 100 lần gần nhất.

${dong.length ? dong.join('\n') : '_Chưa đọc được lịch sử sửa tệp ở lần dựng này._'}
`,
	);
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
