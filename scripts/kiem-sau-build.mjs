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
import { CONG_CU_BAI, CONG_CU_KHU } from '../src/data/cong-cu-bai.mjs';
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
	['mã nguồn nội bộ dạng "(R12)"', /\(R\d{1,2}[,)]/],
	['mục "Bước tiếp theo" của người soạn', /Bước tiếp theo/],
	['"các luồng" / "luồng nhũ tương…" (tên luồng nội bộ)', /\bcác luồng\b|\bluồng (?:nhũ|chất|khác|này)/],
	['lời người soạn nói với người đọc ("bạn gửi/cho biết…")', /bạn (?:gửi|cho biết|xác nhận) /],
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
// ---- 1b'. các khu đã chuẩn hóa: mỗi bài có "Tự kiểm tra" (2–3 câu, căn cứ N/T), "Cần biết trước" (trừ bài đầu); "Thử ngay" nếu có dữ liệu
for (const [k, ds] of Object.entries(CONG_CU_KHU))
	for (const sl of Object.keys(ds)) if (!KHU[k]?.bai.some((b) => b.slug === sl)) loiThuNgay.push(`cong-cu-khu/${k}: bài "${sl}" không có trong khu`);
for (const khu of KHU_CHUAN) {
	const tkk = docTuKiemTra(path.join(GOC, 'noi-dung', khu, 'tu-kiem-tra.md'));
	KHU[khu].bai.forEach((b, i) => {
		const ma = `${khu}/${b.slug}`;
		const h = noiDung[path.join(DIST, khu, b.slug, 'index.html')];
		if (!h) return void loiThuNgay.push(`${ma}: không thấy trang bài`);
		const tkt = /<div class="tu-kiem-tra[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<div class="thu-ngay|<div class="ket-bai))/.exec(h);
		if (tkk[b.slug]?.mien) {
			if (tkt) loiThuNgay.push(`${ma}: được miễn Tự kiểm tra nhưng trang vẫn có hộp`);
		} else if (!tkt) loiThuNgay.push(`${ma}: thiếu hộp "Tự kiểm tra"`);
		else {
			const soCau = (tkt[1].match(/<details class="tkt-cau"/g) || []).length;
			const soCanCu = (tkt[1].match(/class="tkt-xem"><span class="nhan nhan-[NT]"/g) || []).length;
			if (soCau < 2 || soCau > 3) loiThuNgay.push(`${ma}: hộp "Tự kiểm tra" có ${soCau} câu (cần 2 đến 3)`);
			if (soCanCu !== soCau) loiThuNgay.push(`${ma}: ${soCau - soCanCu} câu tự kiểm tra thiếu dòng căn cứ N/T`);
		}
		if (i > 0 && !/class="can-biet-truoc"/.test(h)) loiThuNgay.push(`${ma}: thiếu dòng "Cần biết trước"`);
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
// Phòng lab dùng chung tên chuẩn "keo tụ", không dùng "kết bông"
for (const tep of fs.readdirSync(path.join(GOC, 'public/phong-lab')).filter((x) => x.endsWith('.js')))
	if (/kết bông/i.test(fs.readFileSync(path.join(GOC, 'public/phong-lab', tep), 'utf8'))) loiThuNgay.push(`public/phong-lab/${tep}: còn "kết bông" (tên chuẩn là "keo tụ")`);
// mọi liên kết #ban-... trên trang bài phải trỏ tới bàn có thật
const maBan = new Set(['thit', 'bao-quan', 'kep', 'pickering', 'mayo']);
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
if (loiCam.length || nhomHong.length || loiThuNgay.length || loiRnd.length) {
	console.log('\nkiem-sau-build: KHÔNG ĐẠT');
	process.exit(1);
}
console.log(`kiem-sau-build: đạt (0 chuỗi cấm, 0 liên kết nội bộ hỏng, 8/8 bài có hộp "Thử ngay", mọi #nv-… khớp nhiệm vụ, trang Số liệu R&D đủ 30 + 7 + 16 dòng, 8/8 bài có Tự kiểm tra, mức độ và Cần biết trước; khu đã chuẩn hóa: ${KHU_CHUAN.join(', ') || 'chưa có'})`);
