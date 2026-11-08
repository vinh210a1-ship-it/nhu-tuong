// Hộp "Tự kiểm tra" cuối bài: đọc noi-dung/nhu-tuong/tu-kiem-tra.md, kiểm đáp án có căn cứ, dựng HTML.
// Mỗi câu: Hỏi / Đáp / Căn cứ: N|T | <tiêu đề mục>. Căn cứ phải là mục CÓ THẬT trong bài và mục đó phải có nhãn đúng loại (N hoặc T),
// để đáp án luôn dựa trên câu có nguồn hoặc tính minh họa, không dựa vào K hay G. Sai thì build dừng.
import { docTep } from './doc-tep.mjs';
import { tachNhan } from '../src/plugins/remark-nhan.mjs';

const NHAN_RE = /\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/g;
const bo = (t) => t.replace(/\s*\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/g, '').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Neo (id) mà Starlight gán cho tiêu đề: chữ thường, bỏ dấu câu, mỗi khoảng trắng thành "-" (giống github-slugger). */
export const neoMuc = (tieuDe) => bo(tieuDe).toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');

export function docTuKiemTra(duongDan) {
	const ra = {};
	let bai = null, cau = null;
	for (const d of docTep(duongDan).split('\n')) {
		let m;
		if ((m = /^## ([a-z0-9-]+)\s*$/.exec(d))) { bai = ra[m[1]] = []; cau = null; }
		else if (/^### Câu \d+/.test(d)) { if (!bai) throw new Error('tu-kiem-tra.md: "### Câu" nằm ngoài mục "## <slug>"'); cau = {}; bai.push(cau); }
		else if (cau && (m = /^(Hỏi|Đáp|Căn cứ):\s*(.+)$/.exec(d))) cau[m[1]] = m[2].trim();
		// bài chỉ gồm bảng quy định, không có câu N/T để đặt câu hỏi: ghi "Miễn: <lý do>" dưới mục "## <slug>" (không có câu nào)
		else if (bai && !cau && (m = /^Miễn:\s*(.+)$/.exec(d))) bai.mien = m[1].trim();
	}
	for (const [slug, ds] of Object.entries(ra)) {
		if (ds.mien && ds.length) throw new Error(`tu-kiem-tra.md: bài "${slug}" vừa "Miễn" vừa có câu hỏi`);
		ds.forEach((c, i) => {
			if (!c['Hỏi'] || !c['Đáp'] || !c['Căn cứ']) throw new Error(`tu-kiem-tra.md: bài "${slug}" câu ${i + 1} thiếu Hỏi, Đáp hoặc Căn cứ`);
			const k = /^(N|T)\s*\|\s*(.+)$/.exec(c['Căn cứ']);
			if (!k) throw new Error(`tu-kiem-tra.md: bài "${slug}" câu ${i + 1}: "Căn cứ" phải dạng "N | <tiêu đề mục>" hoặc "T | <tiêu đề mục>"`);
			c.nhan = k[1];
			c.muc = k[2].trim();
		});
	}
	return ra;
}

/** Kiểm các câu của một bài với thân bài gốc (đã chuẩn bị). Ném lỗi nếu: số câu ngoài 2–3, mục không có, mục thiếu nhãn đúng loại. */
export function kiemTuKiemTra(slug, cau, than) {
	if (cau?.mien) return; // bài được miễn (xem docTuKiemTra)
	if (!cau || cau.length < 2 || cau.length > 3) throw new Error(`tu-kiem-tra.md: bài "${slug}" cần 2 đến 3 câu, đang có ${cau?.length ?? 0}`);
	const dong = than.split('\n');
	const tieuDe = [];
	dong.forEach((d, n) => {
		const m = /^(#{2,4})\s+(.*)$/.exec(d);
		if (m) tieuDe.push({ n, cap: m[1].length, ten: bo(m[2]) });
	});
	cau.forEach((c, i) => {
		const kq = tieuDe.filter((t) => t.ten === c.muc);
		if (kq.length !== 1) throw new Error(`tu-kiem-tra.md: bài "${slug}" câu ${i + 1}: mục "${c.muc}" có ${kq.length} tiêu đề khớp (cần đúng 1)`);
		const t = kq[0];
		const het = tieuDe.find((x) => x.n > t.n && x.cap <= t.cap)?.n ?? dong.length;
		const muc = dong.slice(t.n, het).join('\n');
		const coNhan = (muc.match(NHAN_RE) || []).some((nh) => tachNhan(nh).some((x) => x.ma === c.nhan));
		if (!coNhan) throw new Error(`tu-kiem-tra.md: bài "${slug}" câu ${i + 1}: mục "${c.muc}" không có câu mang nhãn ${c.nhan}`);
	});
}

export function htmlTuKiemTra(slug, cau) {
	if (cau?.mien) return '';
	const TEN = { N: 'Có nguồn', T: 'Tính minh họa' };
	const ds = cau
		.map(
			(c, i) =>
				`<details class="tkt-cau"><summary><span class="tkt-so">${i + 1}</span>${esc(c['Hỏi'])}</summary><div class="tkt-dap"><p>${esc(c['Đáp'])}</p><p class="tkt-xem"><span class="nhan nhan-${c.nhan}" title="${TEN[c.nhan]}">${c.nhan}</span> xem mục <a href="#${neoMuc(c.muc)}">${esc(bo(c.muc))}</a></p></div></details>`,
		)
		.join('');
	return `<div class="tu-kiem-tra not-content" data-tu-kiem-tra="${slug}"><b class="tkt-tieu-de">Tự kiểm tra</b><small class="tkt-meo">Thử trả lời trong đầu trước, rồi mở đáp án.</small>${ds}</div>`;
}
