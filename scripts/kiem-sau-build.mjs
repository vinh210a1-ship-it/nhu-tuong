// Kiểm sau build: chạy sau `npm run build`, đọc các trang đã dựng trong dist/.
//  1) Chuỗi cấm: ghi chú nội bộ của người soạn không được lọt ra trang người đọc.
//  2) Liên kết nội bộ và neo (#...) không được hỏng.
// Không kiểm liên kết ra ngoài (https://...): cần mạng và hay đổi theo thời gian.
// Chạy: npm run kiem-sau-build            (kiểm thư mục dist/)
//       node scripts/kiem-sau-build.mjs <thư-mục-dist>   (thư mục khác, để thử bộ kiểm)
import fs from 'node:fs';
import path from 'node:path';
import { KHU } from '../src/data/khu.mjs';
import { docTuKiemTra } from './tu-kiem-tra.mjs';
import { CONG_CU_BAI, CONG_CU_KHU, MIEN_THU_NGAY, canBietTruocKhu } from '../src/data/cong-cu-bai.mjs';
import { LIEN_QUAN } from '../src/data/lien-quan-khu.mjs';
import { NHIEM_VU } from '../public/phong-lab/mo-hinh.js';

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
	['mã nguồn nội bộ dạng "(R12)"', /(?<![A-Za-z0-9])\(R\d{1,2}[,)]/],
	['mục "Bước tiếp theo" của người soạn', /Bước tiếp theo/],
	['"các luồng" / "luồng nhũ tương…" (tên luồng nội bộ)', /\bcác luồng\b|\bluồng (?:nhũ|chất|khác|này)/],
	['lời người soạn nói với người đọc ("bạn gửi/cho biết…")', /bạn (?:gửi|cho biết|xác nhận) /],
	['ghi chú soạn thảo cho web ("với web", "quy tắc làm web", "web nên", "hiển thị trên web", "gợi ý hiển thị", "chỉ nên đăng")', /[Vv]ới web\b|[Qq]uy tắc làm web|\bweb nên\b|hiển thị trên web|[Gg]ợi ý hiển thị|(?:chỉ|chưa) nên đăng/],
	['lời kể quy trình soạn ("theo trí nhớ", "kết quả tìm kiếm", "trong phiên", "qua công cụ", "container")', /[Tt]heo trí nhớ|[Kk]ết quả tìm kiếm|trong phiên|qua công cụ|công cụ web|\bcontainer\b/],
	['tên tệp gõ dở ("04-...")', /\d{2}-\.\.\./],
	['gọi bài theo số tệp ("bài 03"); phải gọi bằng tên bài', /\b[Bb]ài \d{2}\b/],
	['"hợp nhất" chỉ giọt hoặc hạt béo (tên chuẩn là "hợp giọt"); "bản hợp nhất" của văn bản pháp luật thì được giữ', /(?<!bản |văn bản |Bản |và |gọi là )hợp nhất(?! (?:Thông|TT|VBHN|văn))/],
	['"tải bề mặt" (tên chuẩn là "độ phủ bề mặt Γ")', /tải bề mặt/],
	['tham chiếu tệp nội bộ ("xem file 99", "Xem 03-…", tên tệp .md)', /\b[Xx]em file \d+|\b[Xx]em `?\d{2}-|\b\d{2}-[a-zA-Z-]+\.md\b/],
	['ghi chú hạn mức công cụ ("Consensus giới hạn", "không mở được từ container")', /Consensus giới hạn|không mở được từ container/],
];
// Khu đã chuẩn hóa đợt 2026-11-08: khu nào có noi-dung/<khu>/tu-kiem-tra.md thì áp cùng bộ kiểm với khu Nhũ tương
const KHU_CHUAN = Object.keys(KHU).filter((k) => k !== 'nhu-tuong' && fs.existsSync(path.join(GOC, 'noi-dung', k, 'tu-kiem-tra.md')));
const trangKhuChuan = new Set(KHU_CHUAN.flatMap((k) => KHU[k].bai.map((b) => `/${k}/${b.slug}/`)));
const slugBai = new Set(KHU['nhu-tuong'].bai.map((b) => b.slug));
slugBai.add('thuat-ngu');
const loiCam = [];
const canhBao = {};
for (const [p, h] of Object.entries(noiDung)) {
	const t = chuHienRa(h);
	const ten = tenTrang(p);
	const laBaiNhuTuong = [...slugBai].some((s) => ten === `/nhu-tuong/${s}/`) || trangKhuChuan.has(ten); // dist/ chính là gốc của base, nên đường dẫn trong dist không có base
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

// ---- 1b) hộp "Thử ngay": mỗi bài trong 8 bài có hộp (1 đến 3 dòng, dòng nào cũng có câu "vì sao nên thử")
const loiThuNgay = [];
for (const b of KHU['nhu-tuong'].bai) {
	const p = path.join(DIST, 'nhu-tuong', b.slug, 'index.html');
	const h = noiDung[p];
	if (!h) {
		loiThuNgay.push(`${b.slug}: không thấy trang bài`);
		continue;
	}
	const hop = /<div class="thu-ngay[^"]*"[^>]*>([\s\S]*?)<\/ul><\/div>/.exec(h);
	if (!hop) {
		loiThuNgay.push(`${b.slug}: thiếu hộp "Thử ngay"`);
		continue;
	}
	const soDong = (hop[1].match(/<li>/g) || []).length;
	const soVi = (hop[1].match(/class="tn-vi">[^<]{10,}</g) || []).length;
	if (soDong < 1 || soDong > 3) loiThuNgay.push(`${b.slug}: hộp "Thử ngay" có ${soDong} dòng (cần 1 đến 3)`);
	if (soVi !== soDong) loiThuNgay.push(`${b.slug}: ${soDong - soVi} dòng thiếu câu "vì sao nên thử"`);
	if (!/class="thu-ngay[\s\S]*?class="ket-bai/.test(h)) loiThuNgay.push(`${b.slug}: hộp "Thử ngay" phải nằm trước hộp "Đọc xong bài này?"`);
	// Gói 6: hộp "Tự kiểm tra" (2–3 câu, mỗi câu có nhãn căn cứ N/T), nhãn mức độ, "Cần biết trước" (trừ chặng 1)
	const tkt = /<div class="tu-kiem-tra[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<div class="thu-ngay)/.exec(h);
	if (!tkt) loiThuNgay.push(`${b.slug}: thiếu hộp "Tự kiểm tra" (phải nằm trước hộp "Thử ngay")`);
	else {
		const soCau = (tkt[1].match(/<details class="tkt-cau"/g) || []).length;
		const soCanCu = (tkt[1].match(/class="tkt-xem"><span class="nhan nhan-[NT]"/g) || []).length;
		if (soCau < 2 || soCau > 3) loiThuNgay.push(`${b.slug}: hộp "Tự kiểm tra" có ${soCau} câu (cần 2 đến 3)`);
		if (soCanCu !== soCau) loiThuNgay.push(`${b.slug}: ${soCau - soCanCu} câu tự kiểm tra thiếu dòng căn cứ N/T`);
	}
	if (!/class="muc-do muc-do-/.test(h)) loiThuNgay.push(`${b.slug}: thiếu nhãn mức độ`);
	if (b.slug !== 'nen-tang' && !/class="can-biet-truoc"/.test(h)) loiThuNgay.push(`${b.slug}: thiếu dòng "Cần biết trước"`);
	// thuật ngữ chuẩn: "kết bông" chỉ được xuất hiện trong cụm "còn gọi: kết bông"; còn lại dùng "keo tụ (flocculation)"
	const chuBai = chuHienRa(h);
	const soKetBong = (chuBai.match(/kết bông/gi) || []).length - (chuBai.match(/còn gọi: kết bông/gi) || []).length;
	if (soKetBong > 0) loiThuNgay.push(`${b.slug}: còn ${soKetBong} chỗ "kết bông" ngoài cụm "còn gọi: kết bông" (tên chuẩn là "keo tụ")`);
}
for (const k of Object.keys(CONG_CU_BAI)) if (!KHU['nhu-tuong'].bai.some((b) => b.slug === k)) loiThuNgay.push(`cong-cu-bai.mjs: bài "${k}" không có trong khu Nhũ tương`);
// ---- 1b''. hộp "Liên quan ở khu khác" (gói L4): bài nào có dữ liệu thì có hộp 1–3 dòng, dòng nào cũng có câu mô tả và trỏ sang KHU KHÁC, hộp nằm trước "Đọc xong bài này?"
for (const [ma, ds] of Object.entries(LIEN_QUAN)) {
	const [k, sl] = ma.split('/');
	const h = noiDung[path.join(DIST, k, sl, 'index.html')];
	if (!h) {
		loiThuNgay.push(`${ma}: không thấy trang bài cho hộp "Liên quan ở khu khác"`);
		continue;
	}
	const hop = /<div class="lien-quan[^"]*"[^>]*>([\s\S]*?)<\/ul><\/div>/.exec(h);
	if (!hop) {
		loiThuNgay.push(`${ma}: có dữ liệu "Liên quan ở khu khác" nhưng trang không có hộp`);
		continue;
	}
	const soDong = (hop[1].match(/<li>/g) || []).length;
	const soVi = (hop[1].match(/class="tn-vi">[^<]{10,}</g) || []).length;
	if (soDong !== ds.length || soDong < 1 || soDong > 3) loiThuNgay.push(`${ma}: hộp "Liên quan ở khu khác" có ${soDong} dòng (dữ liệu ${ds.length}, cần 1 đến 3)`);
	if (soVi !== soDong) loiThuNgay.push(`${ma}: ${soDong - soVi} dòng "Liên quan ở khu khác" thiếu câu mô tả`);
	if (!/class="lien-quan[\s\S]*?class="ket-bai/.test(h)) loiThuNgay.push(`${ma}: hộp "Liên quan ở khu khác" phải nằm trước hộp "Đọc xong bài này?"`);
	for (const m of hop[1].matchAll(/href="\.\.\/\.\.\/([^/]+)\//g)) if (m[1] === k) loiThuNgay.push(`${ma}: hộp "Liên quan ở khu khác" trỏ về cùng khu`);
}
// ---- 1b'. các khu đã chuẩn hóa: mỗi bài có "Tự kiểm tra" (2–3 câu, căn cứ N/T), "Cần biết trước" (trừ bài đầu); "Thử ngay" nếu có dữ liệu
for (const [k, ds] of Object.entries(CONG_CU_KHU))
	for (const sl of Object.keys(ds)) if (!KHU[k]?.bai.some((b) => b.slug === sl)) loiThuNgay.push(`cong-cu-khu/${k}: bài "${sl}" không có trong khu`);
for (const ma of Object.keys(MIEN_THU_NGAY)) {
	const [k, sl] = ma.split('/');
	if (!KHU[k]?.bai.some((b) => b.slug === sl)) loiThuNgay.push(`MIEN_THU_NGAY: bài "${ma}" không có trong khu`);
}
for (const khu of KHU_CHUAN) {
	const tkk = docTuKiemTra(path.join(GOC, 'noi-dung', khu, 'tu-kiem-tra.md'));
	KHU[khu].bai.forEach((b, i) => {
		const ma = `${khu}/${b.slug}`;
		const h = noiDung[path.join(DIST, khu, b.slug, 'index.html')];
		if (!h) return void loiThuNgay.push(`${ma}: không thấy trang bài`);
		const tkt = /<div class="tu-kiem-tra[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<div class="thu-ngay|<div class="lien-quan|<div class="ket-bai))/.exec(h);
		if (tkk[b.slug]?.mien) {
			if (tkt) loiThuNgay.push(`${ma}: được miễn Tự kiểm tra nhưng trang vẫn có hộp`);
		} else if (!tkt) loiThuNgay.push(`${ma}: thiếu hộp "Tự kiểm tra"`);
		else {
			const soCau = (tkt[1].match(/<details class="tkt-cau"/g) || []).length;
			const soCanCu = (tkt[1].match(/class="tkt-xem"><span class="nhan nhan-[NT]"/g) || []).length;
			if (soCau < 2 || soCau > 3) loiThuNgay.push(`${ma}: hộp "Tự kiểm tra" có ${soCau} câu (cần 2 đến 3)`);
			if (soCanCu !== soCau) loiThuNgay.push(`${ma}: ${soCau - soCanCu} câu tự kiểm tra thiếu dòng căn cứ N/T`);
		}
		// L5: mọi bài trừ bài đầu khu đều có dòng "Cần biết trước" (có liên kết, hoặc "không cần, bài này đọc độc lập")
		if (i > 0 && !/class="can-biet-truoc"/.test(h)) loiThuNgay.push(`${ma}: thiếu dòng "Cần biết trước"`);
		if (i > 0 && !canBietTruocKhu(khu, b.slug).length && !/bài này đọc độc lập/.test(h)) loiThuNgay.push(`${ma}: khai độc lập nhưng trang không có dòng "bài này đọc độc lập"`);
		if (i === 0 && !canBietTruocKhu(khu, b.slug).length && /class="can-biet-truoc"/.test(h)) loiThuNgay.push(`${ma}: bài đầu khu không có bài nào đứng trước nên không in dòng "Cần biết trước"`);
		if (MIEN_THU_NGAY[ma]) {
			if (CONG_CU_KHU[khu]?.[b.slug]) loiThuNgay.push(`${ma}: được miễn "Thử ngay" nhưng vẫn có dữ liệu`);
		} else if (!CONG_CU_KHU[khu]?.[b.slug]) loiThuNgay.push(`${ma}: không có "Thử ngay" và cũng không có lý do miễn trong MIEN_THU_NGAY`);
		const hop = /<div class="thu-ngay[^"]*"[^>]*>([\s\S]*?)<\/ul><\/div>/.exec(h);
		if (hop) {
			const soDong = (hop[1].match(/<li>/g) || []).length;
			const soVi = (hop[1].match(/class="tn-vi">[^<]{10,}</g) || []).length;
			if (soDong < 1 || soDong > 3) loiThuNgay.push(`${ma}: hộp "Thử ngay" có ${soDong} dòng (cần 1 đến 3)`);
			if (soVi !== soDong) loiThuNgay.push(`${ma}: ${soDong - soVi} dòng thiếu câu "vì sao nên thử"`);
			if (!/class="thu-ngay[\s\S]*?class="ket-bai/.test(h)) loiThuNgay.push(`${ma}: hộp "Thử ngay" phải nằm trước hộp "Đọc xong bài này?"`);
		} else if (CONG_CU_KHU[khu]?.[b.slug]) loiThuNgay.push(`${ma}: có dữ liệu "Thử ngay" nhưng trang không có hộp`);
		const chuBai = chuHienRa(h);
		const soKetBong = (chuBai.match(/kết bông/gi) || []).length - (chuBai.match(/còn gọi: kết bông/gi) || []).length;
		if (soKetBong > 0) loiThuNgay.push(`${ma}: còn ${soKetBong} chỗ "kết bông" ngoài cụm "còn gọi: kết bông" (tên chuẩn là "keo tụ")`);
	});
}
// ---- L7 (gói L7c): mỗi cặp "Liên quan ở khu khác" phải có đủ hai chiều trong dist/ (chặn); bài không có liên kết trong thân bài tới bài khác (chỉ báo)
let soLkKhuKhac = 0;
const bai0LienKet = [];
{
	for (const [ma, ds] of Object.entries(LIEN_QUAN)) {
		for (const d of ds) {
			const hDich = noiDung[path.join(DIST, ...d.bai.split('/'), 'index.html')];
			if (!hDich) continue; // thiếu trang đã được báo ở trên
			const hop = /<div class="lien-quan[^"]*"[^>]*>([\s\S]*?)<\/ul><\/div>/.exec(hDich)?.[1] ?? '';
			if (!hop.includes(`href="../../${ma}/"`)) loiThuNgay.push(`${ma} trỏ sang ${d.bai} nhưng ${d.bai} không trỏ ngược lại (mỗi cặp phải đủ hai chiều)`);
			else soLkKhuKhac++;
		}
	}
	const slugCong = new Set(Object.entries(KHU).flatMap(([k, v]) => v.bai.map((b) => `${k}/${b.slug}`)));
	for (const ma of slugCong) {
		const h = noiDung[path.join(DIST, ma, 'index.html')];
		if (!h) continue;
		const bat = h.indexOf('class="sl-markdown-content"');
		if (bat < 0) continue;
		let than = h.slice(bat);
		const cat = than.search(/<div class="(?:tu-kiem-tra|thu-ngay|lien-quan|ket-bai)\b/);
		if (cat > 0) than = than.slice(0, cat);
		than = than.replace(/<p class="(?:nguon-goc-bai|can-biet-truoc)">[\s\S]*?<\/p>/g, '');
		let dem = 0;
		for (const m of than.matchAll(/<a [^>]*href="([^"#][^"]*)"/g)) {
			let u;
			try {
				u = new URL(m[1], 'http://x' + BASE + '/' + ma + '/'); // gốc có BASE để liên kết tương đối và tuyệt đối cùng qua một phép cắt BASE (khu "nhu-tuong" trùng tên với BASE)
			} catch {
				continue;
			}
			const dich = u.pathname.replace(new RegExp('^' + BASE), '').replace(/^\/|\/$/g, '');
			if (dich !== ma && slugCong.has(dich)) dem++;
		}
		if (!dem) bai0LienKet.push(ma);
	}
	if (bai0LienKet.length) canhBao[`bài không có liên kết nào trong thân bài tới bài khác (${bai0LienKet.length}/${slugCong.size}; mục tiêu sau gói L7c: dưới 15, tức thêm liên kết cho ít nhất 3 bài)`] = bai0LienKet.map((x) => '/' + x + '/');
}
// ---- T5: lý lịch bài (dòng ngày, hộp trích dẫn, thẻ meta), chân trang giấy phép, trang Nhật ký thay đổi
{
	const baiCongKhai = Object.entries(KHU).flatMap(([k, v]) => v.bai.map((b) => `${k}/${b.slug}`));
	let soBaiDu = 0;
	for (const ma of baiCongKhai) {
		const h = noiDung[path.join(DIST, ma, 'index.html')];
		if (!h) continue;
		const loi = [];
		const dong = /<p class="nguon-goc-bai">([\s\S]*?)<\/p>/.exec(h)?.[1] ?? '';
		if (!/(?:Đăng lần đầu \d{4}-\d{2}-\d{2}(?: · Sửa nội dung lớn \d{4}-\d{2}-\d{2})?|Sửa nội dung lớn \d{4}-\d{2}-\d{2})/.test(dong)) loi.push('dòng ngày sai khuôn');
		const coDang = /Đăng lần đầu/.test(dong);
		if (!/<details class="trich-dan-trang[^"]*" data-pagefind-ignore(?:="")?><summary>Cách trích dẫn trang này<\/summary>[\s\S]*?data-truy-cap[\s\S]*?data-chep-trich-dan/.test(h)) loi.push('thiếu hộp "Cách trích dẫn trang này" (hoặc thiếu data-pagefind-ignore, nếu không Pagefind sẽ lập chỉ mục hộp này)');
		else if (!h.includes(`https://vinh210a1-ship-it.github.io/nhu-tuong/${ma}/`)) loi.push('hộp trích dẫn sai địa chỉ');
		for (const ten of ['citation_title', 'citation_author', 'citation_online_date', 'citation_language', 'DC.rights', ...(coDang ? ['citation_publication_date'] : [])])
			if (!new RegExp(`<meta[^>]*name="${ten.replace('.', '\\.')}"`).test(h)) loi.push(`thiếu thẻ meta ${ten}`);
		if (coDang && !/Đăng lần đầu/.test(h)) loi.push('dòng ngày');
		if (loi.length) loiThuNgay.push(`${ma}: ${loi.join('; ')}`);
		else soBaiDu++;
	}
	if (!soBaiDu) loiThuNgay.push('T5: không có bài nào đủ dòng ngày, hộp trích dẫn và thẻ meta');
	const thieuChanTrang = trang.filter((p) => !/<meta http-equiv="refresh"/.test(noiDung[p]) && !/Chữ và hình: CC BY 4\.0 · Mã: MIT/.test(noiDung[p])).map(tenTrang);
	if (thieuChanTrang.length) loiThuNgay.push(`chân trang thiếu dòng giấy phép ở ${thieuChanTrang.length} trang, vd ${thieuChanTrang.slice(0, 3).join(', ')}`);
	if (!fs.existsSync(path.join(GOC, 'LICENSE')) || !fs.existsSync(path.join(GOC, 'LICENSE-NOI-DUNG.md'))) loiThuNgay.push('thiếu LICENSE hoặc LICENSE-NOI-DUNG.md');
	const nk = noiDung[path.join(DIST, 'nhat-ky-thay-doi', 'index.html')];
	if (!nk) loiThuNgay.push('thiếu trang /nhat-ky-thay-doi/');
	else if (/\((?:gói\s+)?[A-Z]\d[^)]*\)/.test(chuHienRa(nk))) loiThuNgay.push('trang Nhật ký thay đổi còn mã nội bộ dạng "(gói L6)" hoặc "(L1–L3)" trong tên việc');
	else if (process.env.CI && !/\d{4}-\d{2}-\d{2}<\/strong> · /.test(nk)) loiThuNgay.push('trang Nhật ký thay đổi không có dòng nào khi build trên CI (kiểm fetch-depth: 0)');
	if (!noiDung[path.join(DIST, 'giay-phep', 'index.html')]) loiThuNgay.push('thiếu trang /giay-phep/');
}
// Phòng lab dùng chung tên chuẩn "keo tụ", không dùng "kết bông"
for (const tep of fs.readdirSync(path.join(GOC, 'public/phong-lab')).filter((x) => x.endsWith('.js')))
	if (/kết bông/i.test(fs.readFileSync(path.join(GOC, 'public/phong-lab', tep), 'utf8'))) loiThuNgay.push(`public/phong-lab/${tep}: còn "kết bông" (tên chuẩn là "keo tụ")`);
// mọi liên kết #ban-... trên trang bài phải trỏ tới bàn có thật
const maBan = new Set(['thit', 'bao-quan', 'kep', 'pickering', 'mayo', 'nau-hoa']);
for (const [p, h] of Object.entries(noiDung))
	for (const m of h.matchAll(/href="[^"#]*phong-lab\/#ban-([^"]*)"/g)) if (!maBan.has(m[1])) loiThuNgay.push(`${tenTrang(p)}: liên kết #ban-${m[1]} không khớp bàn nào`);
// mọi liên kết #nv-... (ở bất kỳ trang nào) phải trỏ tới nhiệm vụ có thật ("tu-do" = phòng lab tự do)
const maNhiemVu = new Set([...NHIEM_VU.map((n) => n.id), 'tu-do']);
for (const [p, h] of Object.entries(noiDung))
	for (const m of h.matchAll(/href="[^"#]*phong-lab\/#nv-([^"]*)"/g)) if (!maNhiemVu.has(m[1])) loiThuNgay.push(`${tenTrang(p)}: liên kết #nv-${m[1]} không khớp nhiệm vụ nào trong NHIEM_VU`);

// ---- 1c) trang "Số liệu R&D": ba bảng đọc từ src/data/so-lieu-rnd/*.json, ra HTML tĩnh, đủ dòng, mỗi dòng đủ nguồn/trang/điều kiện/nhãn
const loiRnd = [];
{
	const htmlRnd = noiDung[path.join(DIST, 'so-lieu-rnd', 'index.html')];
	if (!htmlRnd) loiRnd.push('không thấy trang so-lieu-rnd/');
	else {
		const BANG = [['hlb.json', 30], ['dong-hoa.json', 7], ['mayo-li2012.json', 16]];
		const thanBang = [...htmlRnd.matchAll(/<tbody[^>]*>([\s\S]*?)<\/tbody>/g)].map((m) => (m[1].match(/<tr/g) || []).length);
		if (thanBang.length !== BANG.length) loiRnd.push(`trang có ${thanBang.length} bảng, cần ${BANG.length}`);
		BANG.forEach(([tep, soDong], i) => {
			const j = JSON.parse(fs.readFileSync(path.join(GOC, 'src/data/so-lieu-rnd', tep), 'utf8'));
			if (j.dong.length !== soDong) loiRnd.push(`${tep}: ${j.dong.length} dòng, cần ${soDong}`);
			if (thanBang[i] !== j.dong.length) loiRnd.push(`${tep}: trang hiện ${thanBang[i]} dòng, JSON có ${j.dong.length}`);
			j.dong.forEach((r, n) => {
				for (const k of ['nguon', 'dieu_kien_do', 'nhan']) if (!r[k]) loiRnd.push(`${tep} dòng ${n + 1}: thiếu "${k}"`);
				if (!r.trang && !r.vi_tri) loiRnd.push(`${tep} dòng ${n + 1}: thiếu cả trang lẫn vị trí (bảng/hình)`);
			});
		});
		const chuRnd = chuHienRa(htmlRnd);
		if ((chuRnd.match(/Nguồn và điều kiện đo/g) || []).length < BANG.length) loiRnd.push('thiếu khung "Nguồn và điều kiện đo" ở một bảng');
		for (const [ten, re] of [['cảnh báo HLB đổi theo nhiệt độ', /HLB đổi theo nhiệt độ/], ['cảnh báo không có HLB yêu cầu của từng dầu', /HLB yêu cầu/], ['cảnh báo thiếu Span 85', /Span 85 không có trong bảng/], ['ghi rõ cone–plate 20 °C', /cone–plate ở 20 °C/], ['ghi rõ đường kính theo thể tích, không phải d₃₂', /không phải d₃₂/]])
			if (!re.test(chuRnd)) loiRnd.push(`trang thiếu ${ten}`);
	}
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
		// #nv-…, #so-tay, #ban-… trên trang Phòng lab do JavaScript xử lý lúc mở trang (không có id sẵn trong HTML);
		// riêng mã nhiệm vụ được kiểm ở bước 1b.
		const neoCuaLab = u.pathname.endsWith('/phong-lab/') && /^(nv-.+|so-tay|ban-.+)$/.test(neo);
		if (neo && !neoCuaLab && noiDung[f] && !idCua(f).has(neo)) (hong[`mất neo ${u.pathname}#${neo}`] ??= []).push(ten);
	}
}

// ---- báo kết quả
// hình cơ chế (T1) và đồ thị (T2): số <figure> trong dist/ khớp số dòng <!-- hinh: --> ở bài gốc, mỗi hình có chú thích, id không trùng; index.json đồ thị khớp thư mục
const loiHinh = [];
{
	const soDong = {};
	for (const khu of fs.readdirSync(path.join(GOC, 'noi-dung'), { withFileTypes: true }).filter((d) => d.isDirectory()))
		for (const f of fs.readdirSync(path.join(GOC, 'noi-dung', khu.name)).filter((x) => x.endsWith('.md'))) {
			const n = [...fs.readFileSync(path.join(GOC, 'noi-dung', khu.name, f), 'utf8').matchAll(/^<!--\s*hinh:\s*([a-z0-9-]+)\s*-->/gm)].length;
			if (n) soDong[khu.name] = (soDong[khu.name] || 0) + n;
		}
	const tong = Object.values(soDong).reduce((a, b) => a + b, 0);
	let soFigure = 0;
	for (const [p, h] of Object.entries(noiDung)) {
		const fig = [...h.matchAll(/<figure class="hinh-co-che[^>]*>([\s\S]*?)<\/figure>/g)];
		soFigure += fig.length;
		for (const m of fig) {
			if (!/<svg\b[^>]*viewBox="/.test(m[1]) || !/<figcaption>\s*<p>/.test(m[1])) loiHinh.push(`${tenTrang(p)}: hình thiếu <svg viewBox> hoặc chú thích <figcaption><p>`);
			if (/\[(?:N|T|K|G)[:\];]/.test(m[1].replace(/<svg[\s\S]*?<\/svg>/, ''))) loiHinh.push(`${tenTrang(p)}: nhãn tin cậy trong chú thích chưa thành huy hiệu`);
		}
		if (fig.length) {
			const ids = [...h.matchAll(/\sid="(h-[^"]+)"/g)].map((m) => m[1]);
			if (new Set(ids).size !== ids.length) loiHinh.push(`${tenTrang(p)}: id trong hình bị trùng`);
		}
	}
	if (soFigure !== tong) loiHinh.push(`số hình trong dist/ (${soFigure}) khác số dòng <!-- hinh: --> trong noi-dung/ (${tong})`);
	for (const p of Object.keys(noiDung)) if (/<!--\s*hinh:/.test(noiDung[p])) loiHinh.push(`${tenTrang(p)}: còn sót dòng <!-- hinh: -->`);
	const ds = fs.existsSync(path.join(DIST, 'do-thi/index.json')) ? JSON.parse(fs.readFileSync(path.join(DIST, 'do-thi/index.json'), 'utf8')) : null;
	const dsThuMuc = fs.readdirSync(path.join(GOC, 'public/do-thi')).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).sort();
	if (!ds || JSON.stringify(ds) !== JSON.stringify(dsThuMuc)) loiHinh.push('dist/do-thi/index.json thiếu hoặc không khớp public/do-thi/*.js (chạy lại npm run build)');
	for (const id of dsThuMuc) if (!fs.existsSync(path.join(DIST, 'do-thi', `${id}.js`))) loiHinh.push(`dist/do-thi/${id}.js không có`);
	var soHinh = soFigure, soDoThi = dsThuMuc.length;
}

// bản đồ lộ trình bằng hình: mỗi trang khu có đúng một bản đồ, đủ số trạm, mỗi trạm là liên kết tới bài và mang khóa "đã đọc", bảng lộ trình vẫn còn ngay bên dưới
{
	for (const khu of Object.keys(KHU)) {
		const tep = path.join(DIST, khu, 'index.html');
		const h = fs.existsSync(tep) ? fs.readFileSync(tep, 'utf8') : '';
		const bd = [...h.matchAll(/<nav class="ban-do-khu[^>]*>([\s\S]*?)<\/nav>/g)];
		if (bd.length !== 1) { loiHinh.push(`/${khu}/: cần đúng 1 bản đồ lộ trình (đang ${bd.length})`); continue; }
		const tram = [...bd[0][1].matchAll(/<a class="bd-nut[^"]*" href="([^"]+)" data-slug="([^"]+)">/g)];
		if (tram.length !== KHU[khu].bai.length) loiHinh.push(`/${khu}/: bản đồ có ${tram.length} trạm, khu có ${KHU[khu].bai.length} bài`);
		KHU[khu].bai.forEach((b, i) => {
			if (!tram[i]) return;
			if (tram[i][1] !== `${b.slug}/`) loiHinh.push(`/${khu}/: trạm ${i + 1} trỏ "${tram[i][1]}", phải là "${b.slug}/"`);
			if (tram[i][2] !== (khu === 'nhu-tuong' ? b.slug : `${khu}/${b.slug}`)) loiHinh.push(`/${khu}/: trạm ${i + 1} sai khóa đã đọc "${tram[i][2]}"`);
			if (!fs.existsSync(path.join(DIST, khu, b.slug, 'index.html'))) loiHinh.push(`/${khu}/: trạm ${i + 1} trỏ tới bài không có trong dist/ (${b.slug})`);
		});
		if ((bd[0][1].match(/<svg class="bieu-tuong"/g) || []).length !== tram.length) loiHinh.push(`/${khu}/: có trạm thiếu biểu tượng`);
		if (!/^\s*<table/.test(h.slice(bd[0].index + bd[0][0].length))) loiHinh.push(`/${khu}/: ngay dưới bản đồ phải còn bảng lộ trình (cho trình đọc màn hình và bản in)`);
	}
}

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
if (loiThuNgay.length) {
	console.log(`\nHỘP "THỬ NGAY" / LIÊN KẾT PHÒNG LAB: ${loiThuNgay.length} lỗi`);
	for (const l of loiThuNgay.slice(0, 40)) console.log('  - ' + l);
}
if (loiRnd.length) {
	console.log(`\nTRANG "SỐ LIỆU R&D": ${loiRnd.length} lỗi`);
	for (const l of loiRnd.slice(0, 40)) console.log('  - ' + l);
}
if (loiHinh.length) {
	console.log(`\nHÌNH CƠ CHẾ / ĐỒ THỊ / BẢN ĐỒ LỘ TRÌNH: ${loiHinh.length} lỗi`);
	for (const l of loiHinh.slice(0, 40)) console.log('  - ' + l);
}
if (loiCam.length || nhomHong.length || loiThuNgay.length || loiRnd.length || loiHinh.length) {
	console.log('\nkiem-sau-build: KHÔNG ĐẠT');
	process.exit(1);
}
console.log(`kiem-sau-build: đạt (0 chuỗi cấm, 0 liên kết nội bộ hỏng, 8/8 bài có hộp "Thử ngay", ${Object.keys(LIEN_QUAN).length} bài có hộp "Liên quan ở khu khác" (${Object.values(LIEN_QUAN).reduce((t, d) => t + d.length, 0)} liên kết, ${soLkKhuKhac} đã kiểm có đủ hai chiều trong dist/; ${bai0LienKet.length} bài chưa có liên kết thân bài tới bài khác, chỉ báo), mọi #nv-… khớp nhiệm vụ, trang Số liệu R&D đủ 30 + 7 + 16 dòng, ${soHinh} hình cơ chế và ${soDoThi} đồ thị đúng quy cách, ${Object.keys(KHU).length} trang khu có bản đồ lộ trình, 8/8 bài có Tự kiểm tra, mức độ và Cần biết trước; khu đã chuẩn hóa: ${KHU_CHUAN.join(', ') || 'chưa có'})`);
