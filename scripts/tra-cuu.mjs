// Dựng trang "Tra cứu" (src/content/docs/tra-cuu.md): mã INS/E + từ điển Anh–Việt, một ô tìm kiếm chung.
// Được gọi từ scripts/chuan-bi-noi-dung.mjs sau khi gom xong thẻ phụ gia.
//
// Dữ liệu từ điển gộp từ 3 nơi (theo thứ tự ưu tiên khi trùng từ tiếng Anh):
//   1) bảng thuật ngữ nhũ tương   noi-dung/nhu-tuong/09-thuat-ngu.md        (có cột "Xem" -> liên kết bài)
//   2) bảng thuật ngữ dược bào chế noi-dung/duoc-pham/09-thuat-ngu-duoc-bao-che.md
//   3) từ điển chung               noi-dung/tra-cuu/tu-dien-anh-viet.md       (mỗi mục ## là một lĩnh vực)
// Quy tắc nhãn: dòng của (3) không ghi nhãn thì mặc định K; K mà có con số kèm đơn vị thì dừng build
// (cùng tinh thần quy tắc ẩn số liệu chưa kiểm của web).
import fs from 'node:fs';
import path from 'node:path';
import { htmlNhan, SO_DON_VI } from '../src/plugins/remark-nhan.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NHAN_RE = /\[(?:N|K|T|G)(?:[:;][^\]\n]*)?\]/g;
const boDau = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
// khóa so trùng: bỏ phần trong ngoặc ("HPLC (high-performance …)" ~ "HPLC"), bỏ dấu và ký tự lạ
const khoaTrung = (en) => boDau(en.replace(/\([^)]*\)/g, ' ')).replace(/[^a-z0-9α-ωβ]+/g, ' ').trim();

function docFrontMatter(text) {
	const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
	if (!m) return [{}, text];
	const fm = {};
	for (const d of m[1].split('\n')) {
		const i = d.indexOf(':');
		if (i > 0) fm[d.slice(0, i).trim()] = d.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
	}
	return [fm, text.slice(m[0].length)];
}
const hangBang = (d) => /^\|/.test(d) && !/^\|\s*:?-/.test(d);
const oBang = (d) => d.split('|').slice(1, -1).map((c) => c.trim());
const tachNhanCuoi = (chu) => {
	const nhan = chu.match(NHAN_RE) || [];
	const sach = chu.replace(NHAN_RE, '').replace(/\*\*|`/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
	return { sach, nhan };
};

export function dungTraCuu({ GOC, DOCS, BASE, theGia, soPhuGia, soNhom }) {
	const mucNoiDung = (khu) => path.join(GOC, 'noi-dung', khu);
	const tep = (khu, dauTen) => {
		const f = fs.readdirSync(mucNoiDung(khu)).find((x) => x.startsWith(dauTen));
		if (!f) throw new Error(`tra-cuu: không thấy ${khu}/${dauTen}*`);
		return path.join(mucNoiDung(khu), f);
	};
	const muc = []; // {en, vi, mo, nhan:[chuỗi nhãn], linhVuc, bai:{href,ten}|null, tuDien:boolean}

	// ---- (1) thuật ngữ nhũ tương: slug theo số thứ tự file ("01" -> nen-tang)
	const slugTheoSo = {};
	for (const f of fs.readdirSync(mucNoiDung('nhu-tuong'))) {
		const [fm] = docFrontMatter(fs.readFileSync(path.join(mucNoiDung('nhu-tuong'), f), 'utf8'));
		if (fm.hien_tren_web === 'true' && fm.loai === 'bai') slugTheoSo[f.slice(0, 2)] = fm.slug.toLowerCase();
	}
	{
		const [, than] = docFrontMatter(fs.readFileSync(tep('nhu-tuong', '09-'), 'utf8'));
		for (const d of than.split('\n').filter(hangBang).slice(1)) {
			const c = oBang(d);
			if (c.length < 3 || !c[0]) continue;
			const { sach: mo, nhan } = tachNhanCuoi(c[2]);
			const xem = (c[3] || '').split(/,\s*/).map((s) => slugTheoSo[s]).filter(Boolean);
			muc.push({
				en: tachNhanCuoi(c[1]).sach, vi: tachNhanCuoi(c[0]).sach, mo, nhan,
				linhVuc: 'Nhũ tương',
				bai: xem.length ? { href: `${BASE}/nhu-tuong/${xem[0]}/`, ten: 'Đọc trong bài' } : { href: `${BASE}/nhu-tuong/thuat-ngu/`, ten: 'Bảng thuật ngữ nhũ tương' },
			});
		}
	}
	// ---- (2) thuật ngữ dược bào chế
	{
		const [, than] = docFrontMatter(fs.readFileSync(tep('duoc-pham', '09-'), 'utf8'));
		for (const d of than.split('\n').filter(hangBang).slice(1)) {
			const c = oBang(d);
			if (c.length < 3 || !c[0]) continue;
			const { sach: mo, nhan } = tachNhanCuoi(c[2]);
			muc.push({
				en: tachNhanCuoi(c[1]).sach, vi: tachNhanCuoi(c[0]).sach, mo, nhan,
				linhVuc: 'Dược bào chế',
				bai: { href: `${BASE}/duoc-pham/thuat-ngu-duoc-bao-che/`, ten: 'Bảng thuật ngữ dược' },
			});
		}
	}
	const soTuBai = muc.length;
	// ---- (3) từ điển chung
	const ghiChuLinhVuc = {};
	{
		const [, than] = docFrontMatter(fs.readFileSync(path.join(mucNoiDung('tra-cuu'), 'tu-dien-anh-viet.md'), 'utf8'));
		let lv = '';
		let daThayTieuDe = false;
		for (const d of than.split('\n')) {
			const h = /^##\s+(.+)$/.exec(d);
			if (h) { lv = h[1].trim(); daThayTieuDe = true; continue; }
			if (!daThayTieuDe) continue;
			if (lv && d.startsWith('>')) { ghiChuLinhVuc[lv] = ((ghiChuLinhVuc[lv] || '') + ' ' + d.replace(/^>\s*/, '').replace(/\*\*|`/g, '')).trim(); continue; }
			if (!hangBang(d)) continue;
			const c = oBang(d);
			if (/^English$/i.test(c[0])) continue;
			if (c.length !== 3 || !c[0] || !c[1]) throw new Error(`tra-cuu: dòng bảng sai cột (cần 3) ở "${lv}": ${d.slice(0, 80)}`);
			const { sach: mo, nhan } = tachNhanCuoi(c[2]);
			const nhanDay = nhan.length ? nhan : ['[K]'];
			const chiK = nhanDay.every((n) => /^\[K[\]:;]/.test(n));
			if (chiK && SO_DON_VI.test(`${c[0]} ${c[1]} ${mo}`)) throw new Error(`tra-cuu: mục nhãn K có con số kèm đơn vị (cần ẩn hoặc gắn nguồn): ${c[0]} — ${mo}`);
			muc.push({ en: c[0], vi: c[1], mo, nhan: nhanDay, linhVuc: lv, bai: null, tuDien: true });
		}
	}

	// ---- gộp trùng: giữ dòng gặp trước (dòng có liên kết bài); dòng sau thành "thêm" nếu thuộc lĩnh vực khác
	const theoKhoa = new Map();
	const ds = [];
	for (const m of muc) {
		const k = khoaTrung(m.en);
		if (!k) throw new Error(`tra-cuu: từ tiếng Anh rỗng: ${JSON.stringify(m)}`);
		const da = theoKhoa.get(k);
		if (!da) {
			m.them = [];
			theoKhoa.set(k, m);
			ds.push(m);
		} else if (da.linhVuc !== m.linhVuc && !da.them.some((x) => x.linhVuc === m.linhVuc)) da.them.push(m);
	}
	ds.sort((a, b) => khoaTrung(a.en).localeCompare(khoaTrung(b.en), 'en'));

	// ---- HTML
	const thieu = new Set();
	const lvDem = {};
	for (const m of ds) for (const lv of new Set([m.linhVuc, ...m.them.map((t) => t.linhVuc)])) lvDem[lv] = (lvDem[lv] || 0) + 1;
	const hang = ds
		.map((m) => {
			const badge = m.nhan.map((n) => htmlNhan(n, BASE, thieu)).join('');
			const them = m.them
				.map((t) => `<p class="td-them"><b>${esc(t.linhVuc)}${t.vi && t.vi !== m.vi ? ` (${esc(t.vi)})` : ''}:</b> ${esc(t.mo)} ${t.nhan.map((n) => htmlNhan(n, BASE, thieu)).join('')}</p>`)
				.join('');
			const lvTat = [m.linhVuc, ...m.them.map((t) => t.linhVuc)];
			const lk = m.bai ? `<a class="td-lk" href="${m.bai.href}">${esc(m.bai.ten)} →</a>` : '';
			return `<li class="td-hang" data-linh-vuc="${esc(lvTat.join('|'))}" data-en="${esc(boDau(m.en))}" data-vi="${esc(boDau(m.vi))}">
<div class="td-tu"><b class="td-en">${esc(m.en)}</b><span class="td-vi">${esc(m.vi)}</span></div>
<p class="td-mo">${esc(m.mo)} ${badge}</p>${them}
<div class="td-chan"><span class="td-lv">${esc(lvTat.join(' · '))}</span>${lk}</div>
</li>`;
		})
		.join('\n');
	const nutLv = Object.keys(lvDem)
		.map((k) => `<button type="button" data-tk-lv="${esc(k)}" aria-pressed="false">${esc(k)} <small>${lvDem[k]}</small></button>`)
		.join('\n');
	const ghiChu = Object.entries(ghiChuLinhVuc)
		.map(([k, v]) => `<p class="td-ghi-lv" data-linh-vuc="${esc(k)}" hidden>${esc(v)}</p>`)
		.join('\n');

	const htmlTienDe = `<div class="tk-bang not-content">
<input id="tk-q" class="tk-q" type="search" placeholder="Gõ mã INS (471), tên chất, hay thuật ngữ Anh hoặc Việt: emulsion, nhũ tương, thủy phân…" aria-label="Tìm kiếm" autocomplete="off" />
<div class="tk-nut" role="group" aria-label="Phạm vi tìm">
<button type="button" data-tk-tab="" aria-pressed="true">Tất cả</button>
<button type="button" data-tk-tab="ins" aria-pressed="false">Mã INS/E <small>${soPhuGia}</small></button>
<button type="button" data-tk-tab="td" aria-pressed="false">Từ điển Anh–Việt <small>${ds.length}</small></button>
</div>
<p class="loc-pg-dem" data-tk-dem aria-live="polite"></p>
</div>`;

	const htmlIns = `<section class="tk-muc not-content" data-tk-muc="ins" id="ins">
<h2 class="tk-h2">Mã INS/E của phụ gia</h2>
<p>Gõ mã (ví dụ <b>471</b>, <b>E415</b>) hoặc tên chất. ${soNhom('Chất nhũ hóa')} dòng chất nhũ hóa, ${soNhom('Chất ổn định')} dòng chất ổn định và ${soNhom('Phụ gia khác')} dòng phụ gia khác (bảo quản, chống oxy hóa, tạo ngọt, điều vị) chỉ gồm giá trị <b>đã đọc tại nguồn gốc</b> (EFSA, JECFA); chất chưa xác minh được để riêng, nét đứt.</p>
<details class="tk-doc-ma">
<summary>Cách đọc mã INS/E và dải số</summary>
<p><b>INS</b> (International Numbering System) là hệ mã số của Codex Alimentarius, để gọi phụ gia thống nhất giữa các nước. <b>E</b> là mã của EU: số trùng INS, thêm chữ E, chỉ dành cho chất EU cho phép. Chữ và số trong ngoặc phân biệt các chất cùng họ, ví dụ 322(i) lecithin, 322(ii) lecithin thủy phân một phần; 472a–472f là các este của monoglyceride. <span class="nhan-cum"><span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span></span></p>
<p>Dải số dưới đây chỉ là <b>quy luật gần đúng</b> để đoán nhóm chất khi gặp một mã lạ, có ngoại lệ; muốn chắc phải tra đúng mã. <span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan"><a class="nhan-nguon" href="${BASE}/nguon/#wikipedia-ins">Wikipedia</a></span></span> Nguồn là bảng tổng hợp thứ cấp, chưa đối chiếu bản Codex CXG 36-1989.</p>
<table class="tk-dai"><thead><tr><th>Dải mã</th><th>Nhóm thường gặp</th></tr></thead><tbody>
<tr><td>100–199</td><td>Chất màu</td></tr>
<tr><td>200–299</td><td>Chất bảo quản (kèm một số axit, chất chống oxy hóa)</td></tr>
<tr><td>300–399</td><td>Chất chống oxy hóa, axit thực phẩm, muối khoáng</td></tr>
<tr><td>400–499</td><td>Chất làm dày, tạo gel, nhũ hóa, ổn định</td></tr>
<tr><td>500–599</td><td>Muối khoáng, chất chống đông vón, chất điều chỉnh độ acid</td></tr>
<tr><td>600–699</td><td>Chất điều vị</td></tr>
<tr><td>900–999</td><td>Chất tạo màng bóng, giữ ẩm, xử lý bột, khí đẩy, chất tạo ngọt</td></tr>
<tr><td>1000 trở lên</td><td>Nhóm khác: enzym, tinh bột biến tính…</td></tr>
</tbody></table>
<p>Tên nhóm chức năng (chất nhũ hóa, chất ổn định, chất làm dày…) có trong tab <a href="#tu-dien" data-tk-di="td">Từ điển</a>, lĩnh vực “Phụ gia: nhóm chức năng theo Codex”.</p>
</details>
<blockquote class="tk-canh-bao"><p><b>Không dùng làm căn cứ pháp lý.</b> Ở Việt Nam, phụ gia do Thông tư 24/2019/TT-BYT (hợp nhất 08/VBHN-BYT năm 2023) quản lý. Phụ lục danh mục và mức tối đa (ML) theo nhóm thực phẩm <b>chưa được đối chiếu</b> trên web này. “Không cần ADI bằng số” không có nghĩa là dùng không giới hạn.</p></blockquote>
<div class="loc-pg-nut" role="group" aria-label="Nhóm phụ gia">
<button type="button" data-loc-nhom="" aria-pressed="true">Mọi nhóm</button>
<button type="button" data-loc-nhom="Chất nhũ hóa" aria-pressed="false">Chất nhũ hóa</button>
<button type="button" data-loc-nhom="Chất ổn định" aria-pressed="false">Chất ổn định</button>
<button type="button" data-loc-nhom="Phụ gia khác" aria-pressed="false">Bảo quản, tạo ngọt, khác</button>
</div>
<ul class="ds-pg">
${theGia}
</ul>
</section>`;

	const htmlTu = `<section class="tk-muc not-content" data-tk-muc="td" id="tu-dien">
<h2 class="tk-h2">Từ điển Anh–Việt: hóa học và thực phẩm</h2>
<p>${ds.length} thuật ngữ, gõ tiếng Anh hay tiếng Việt đều được, không cần gõ dấu (gõ “nhu tuong” vẫn ra “nhũ tương”). ${soTuBai} mục lấy từ bảng thuật ngữ trong các bài (kèm liên kết đọc tiếp); phần còn lại là từ điển chung. <b>Cách dịch là gợi ý</b>, chưa đối chiếu từ điển hay tiêu chuẩn chính thức: huy hiệu <span class="nhan-cum"><span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span></span> nghĩa là kiến thức giáo khoa chưa gắn nguồn. Thấy sai hay thiếu thì <a href="https://github.com/vinh210a1-ship-it/nhu-tuong/issues/new">báo lỗi tại đây</a>.</p>
<div class="loc-pg-nut tk-lv" role="group" aria-label="Lĩnh vực">
<button type="button" data-tk-lv="" aria-pressed="true">Mọi lĩnh vực</button>
${nutLv}
</div>
${ghiChu}
<div class="tk-sx"><span>Xếp theo:</span>
<button type="button" data-tk-sx="en" aria-pressed="true">English A–Z</button>
<button type="button" data-tk-sx="vi" aria-pressed="false">Tiếng Việt A–Z</button></div>
<ul class="ds-td">
${hang}
</ul>
</section>`;

	fs.writeFileSync(
		path.join(DOCS, 'tra-cuu.md'),
		`---
title: Tra cứu
description: Tra mã INS/E của phụ gia và từ điển Anh–Việt hóa học, thực phẩm, nhũ tương, dược bào chế; một ô tìm kiếm cho cả hai.
editUrl: false
tableOfContents: false
---

Một ô tìm kiếm cho hai kho tra cứu: **mã INS/E của phụ gia** (kèm kết luận EFSA, JECFA đã đọc) và **từ điển Anh–Việt** về hóa học, thực phẩm, nhũ tương, dược bào chế. Mỗi dòng có huy hiệu mức tin cậy, xem cách đọc ở trang [Cách đọc nhãn tin cậy](../quy-uoc/).

${htmlTienDe}

${htmlIns}

${htmlTu}

<p class="tk-khong-co not-content" data-tk-khong hidden>Không thấy mục nào khớp. Thử gõ ngắn hơn (chỉ phần số của mã INS, hoặc một từ), hoặc đổi sang tiếng Anh/tiếng Việt.</p>
`,
	);
	if (thieu.size) throw new Error(`tra-cuu: nhãn trỏ tới nguồn không có trong nguon.json: ${[...thieu].join(', ')}`);
	return { soTu: ds.length, soTuBai, soLinhVuc: Object.keys(lvDem).length };
}
