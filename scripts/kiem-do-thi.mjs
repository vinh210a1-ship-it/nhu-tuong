// Kiểm đồ thị của máy tính (gói T2). Mỗi public/do-thi/<id>.js phải:
//  - <id> là một máy có trong MAY của public/may-tinh.js; tệp ≤ 6 KB;
//  - xuất macDinh, ve, doanTruoc đúng hợp đồng (xem đầu public/do-thi.js);
//  - ve(macDinh) ra SVG qua phép kiểm SVG chung, bảng khớp số cột, có điểm "của bạn"; ve(đầu vào sai) trả null;
//  - có phép kiểm riêng scripts/kiem-do-thi/<id>.mjs (export default (mod, ok) => {...}) đối chiếu điểm với công thức của máy.
// Chạy: npm run kiem
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { kiemSvg } from './kiem-svg.mjs';

const GOC = process.cwd();
const thuMuc = path.join(GOC, 'public/do-thi');
const mayTinh = fs.readFileSync(path.join(GOC, 'public/may-tinh.js'), 'utf8');
let loi = 0, so = 0;
const ok = (ten) => (dieuKien, tn) => {
	if (!dieuKien) {
		loi++;
		console.log(`SAI  ${ten}: ${tn}`);
	}
};
const ds = fs.existsSync(thuMuc) ? fs.readdirSync(thuMuc).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).sort() : [];
for (const id of ds) {
	const tep = path.join(thuMuc, `${id}.js`);
	const t = ok(`do-thi/${id}`);
	t(new RegExp(`^\\t(?:'${id}'|${id}):\\s*\\{`, 'm').test(mayTinh), 'không có máy tính tên này trong MAY của public/may-tinh.js');
	t(fs.statSync(tep).size <= 6144, `tệp ${fs.statSync(tep).size} byte, vượt 6 KB`);
	const mod = await import(pathToFileURL(tep).href);
	const d = mod.doanTruoc;
	t(mod.macDinh && typeof mod.macDinh === 'object', 'thiếu export macDinh');
	t(typeof mod.ve === 'function', 'thiếu export ve(dauVao)');
	t(d && typeof d.cauHoi === 'string' && Array.isArray(d.lua) && d.lua.length === 3 && [0, 1, 2].includes(d.dung) && typeof d.giaiThich === 'string', 'doanTruoc phải có cauHoi, lua (3 lựa chọn), dung (0–2), giaiThich');
	if (!mod.ve || !mod.macDinh) continue;
	const r = mod.ve({ ...mod.macDinh });
	t(r && typeof r.svg === 'string', 've(macDinh) phải trả { svg, bang, chuThich, diem }');
	if (!r) continue;
	for (const e of kiemSvg(r.svg, `do-thi/${id} (svg)`)) t(false, e.replace(/^do-thi\/\S+ \(svg\): /, ''));
	// chữ hỏng lọt ra người đọc (mẫu chuỗi viết nhầm trong nháy đơn, biến chưa gán, số không hữu hạn)
	const chuHienRa = [r.svg, r.chuThich ?? '', ...(r.bang?.cot ?? []), ...(r.bang?.hang ?? []).flat()].join('\n');
	for (const xau of ['${', 'undefined', '[object', 'NaN', 'Infinity']) t(!chuHienRa.includes(xau), `kết quả ve(macDinh) chứa chuỗi hỏng "${xau}" (svg, chuThich hoặc bảng)`);
	t(r.svg.includes('class="dt-diem"'), 'đồ thị không vẽ điểm "của bạn" với đầu vào mặc định');
	t(r.bang && r.bang.cot?.length > 0 && r.bang.hang?.length > 0 && r.bang.hang.every((h) => h.length === r.bang.cot.length), 'bảng số liệu thiếu hoặc số cột không khớp');
	t(r.diem && isFinite(r.diem.x) && isFinite(r.diem.y), 'thiếu diem {x, y}');
	t(mod.ve({ ...mod.macDinh, [Object.keys(mod.macDinh)[0]]: NaN }) === null, 've phải trả null khi một ô nhập là NaN');
	const rieng = path.join(GOC, 'scripts/kiem-do-thi', `${id}.mjs`);
	if (!fs.existsSync(rieng)) {
		t(false, `thiếu phép kiểm riêng scripts/kiem-do-thi/${id}.mjs`);
		continue;
	}
	await (await import(pathToFileURL(rieng).href)).default(mod, t);
	so++;
}
console.log(loi ? `\nkiem-do-thi: ${loi} lỗi` : `kiem-do-thi: đạt (${ds.length} đồ thị)`);
process.exit(loi ? 1 : 0);
