// Phép kiểm chung cho SVG tự vẽ (hình cơ chế ở src/hinh/ và đồ thị ở public/do-thi/). Trả về danh sách lỗi (rỗng là đạt).
import fs from 'node:fs';
import path from 'node:path';

const GOC = process.cwd();
/** Tên biến màu đã khai trong src/styles/*.css (nhóm --sl-* do Starlight cấp). */
function bienCoSan() {
	const ds = new Set();
	for (const f of fs.readdirSync(path.join(GOC, 'src/styles')).filter((x) => x.endsWith('.css')))
		for (const m of fs.readFileSync(path.join(GOC, 'src/styles', f), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)) ds.add(m[1]);
	return ds;
}
const MAN_HINH_HEP = 343; // rộng nội dung ở điện thoại 375 px (trừ lề), tính bằng px

/**
 * @param {string} svg chuỗi SVG đầy đủ
 * @param {string} ten tên để báo lỗi
 */
export function kiemSvg(svg, ten) {
	const loi = [];
	const sai = (m) => loi.push(`${ten}: ${m}`);
	if (!/^<svg[\s>]/.test(svg.trim()) || !/<\/svg>\s*$/.test(svg)) return [`${ten}: phải bắt đầu bằng <svg và kết thúc bằng </svg>`];
	if (/\n[ \t]*\n/.test(svg.replace(/\r/g, ''))) sai('có dòng trống bên trong SVG (Markdown sẽ cắt khối HTML)');
	if (/<(style|script|foreignObject|image|a)\b/i.test(svg) || /\son[a-z]+\s*=|javascript:|href="https?:/i.test(svg)) sai('chứa thẻ/thuộc tính không cho phép (style, script, foreignObject, image, a, on…=, liên kết ngoài)');
	if (!/\brole="img"/.test(svg) || !/<title\b[^>]*>[^<]+<\/title>/.test(svg) || !/<desc\b[^>]*>[^<]+<\/desc>/.test(svg) || !/aria-labelledby="/.test(svg)) sai('thiếu role="img", <title>, <desc> hoặc aria-labelledby (chữ cho người đọc màn hình)');
	const vb = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
	const rongAttr = svg.match(/^<svg[^>]*\swidth="(\d+(?:\.\d+)?)"/);
	if (!vb) sai('thiếu viewBox="0 0 rộng cao"');
	if (!rongAttr) sai('thiếu width="…" trên thẻ svg (bề rộng ưa thích khi màn rộng; tối đa 480)');
	else if (Number(rongAttr[1]) > 480) sai(`width ${rongAttr[1]} quá lớn (tối đa 480)`);
	// cỡ chữ hiệu dụng ở điện thoại: cỡ chữ (đơn vị viewBox) × 343 / rộng viewBox ≥ 12 px
	if (vb) {
		const ds = [...svg.matchAll(/font-size\s*[:=]\s*"?(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
		const nho = ds.length ? Math.min(14, ...ds) : 14; // chữ không khai cỡ lấy 14 theo hinh.css / do-thi.css
		const hieuDung = (nho * MAN_HINH_HEP) / Number(vb[1]);
		if (hieuDung < 12) sai(`chữ nhỏ nhất chỉ còn ${hieuDung.toFixed(1)} px ở màn 375 px (cần ≥ 12): giảm bề rộng viewBox (${vb[1]}) hoặc tăng cỡ chữ (${nho})`);
	}
	// màu: chỉ none / currentColor / inherit / var(--có-sẵn) / url(#…); không mã màu cứng
	const bien = bienCoSan();
	for (const m of svg.matchAll(/\b(fill|stroke|stop-color|flood-color|color)\s*[:=]\s*"?\s*([^;"'>]+)/g)) {
		const gt = m[2].trim();
		if (/^(none|currentColor|inherit|url\(#[^)]+\))$/.test(gt)) continue;
		const v = gt.match(/^var\((--[a-z0-9-]+)(?:\s*,[^)]*)?\)$/);
		if (!v) sai(`màu cứng "${m[1]}: ${gt}": dùng lớp trong hinh.css/do-thi.css hoặc var(--…)`);
		else if (!v[1].startsWith('--sl-') && !bien.has(v[1])) sai(`biến ${v[1]} chưa khai trong src/styles/*.css`);
	}
	for (const m of svg.matchAll(/var\((--[a-z0-9-]+)/g)) if (!m[1].startsWith('--sl-') && !bien.has(m[1])) sai(`biến ${m[1]} chưa khai trong src/styles/*.css`);
	return [...new Set(loi)];
}
