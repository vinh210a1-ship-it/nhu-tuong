// Bản đồ lộ trình bằng hình ở đầu sáu trang khu: các trạm (mỗi bài một trạm) nối nhau bằng một đường.
// Tên bài và câu hỏi lấy từ khu.mjs / chang.mjs; file này chỉ thêm biểu tượng cho từng bài và dựng HTML.
// "Máy in" (scripts/chuan-bi-noi-dung.mjs) chèn htmlBanDo(khu) ngay trên bảng lộ trình của trang/<khu>.md.
// Dấu ✓ và đoạn đường tô màu do public/tuong-tac.js bật lớp .da-doc trên [data-slug]; không có JavaScript vẫn hiện bản đồ.
// Biểu tượng là hình gợi ý, không mang số liệu: nét dùng currentColor, mảng dầu dùng màu hổ phách (cùng cách với BieuTuong.astro).
import { KHU } from './khu.mjs';

const D = 'var(--hh-ho-phach)';
const tron = (cx, cy, r, them = '') => `<circle cx="${+cx.toFixed(1)}" cy="${+cy.toFixed(1)}" r="${r}"${them}/>`;
const DAC = ' fill="currentColor" stroke="none"';
const DAU = ` fill="${D}" stroke="none"`;
const vong = (n, r, rc, them, lech = 0) => Array.from({ length: n }, (_, i) => tron(24 + r * Math.cos((2 * Math.PI * i) / n + lech), 24 + r * Math.sin((2 * Math.PI * i) / n + lech), rc, them)).join('');

/** Biểu tượng 48 × 48: tên -> phần ruột của <svg>. Sáu cái đầu trùng hình với BieuTuong.astro (dải chặng, trang chủ). */
export const BIEU_TUONG = {
	giot: tron(24, 24, 11, DAU) + Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a); return `<path d="M${+(24 + 11 * c).toFixed(1)} ${+(24 + 11 * s).toFixed(1)}L${+(24 + 7 * c).toFixed(1)} ${+(24 + 7 * s).toFixed(1)}"/>` + tron(24 + 15 * c, 24 + 15 * s, 2.8, DAC); }).join(''),
	'vo-giot': tron(13, 24, 9, DAU) + '<path d="M25 24h7m-3-3 3 3-3 3"/>' + tron(38, 15, 3.6, DAU) + tron(41, 26, 3, DAU) + tron(36, 34, 3.4, DAU),
	'tach-lop': `<path d="M13 6v32a6 6 0 0 0 6 6h10a6 6 0 0 0 6-6V6"/><rect x="14.2" y="12" width="19.6" height="8"${DAU}/>` + tron(20, 27, 1.8, DAU) + tron(27, 31, 1.5, DAU) + tron(23, 36, 1.3, DAU) + '<path d="M10 6h28"/>',
	mang: tron(24, 24, 10, DAU) + '<circle cx="24" cy="24" r="14.5" stroke-width="3.2" stroke-dasharray="3 2.4"/><path d="M24 4v3M24 41v3M4 24h3M41 24h3"/>',
	'phan-bo': '<path d="M6 41h36"/>' + [[9, 33, 8], [15.5, 22, 19], [22, 13, 28], [28.5, 21, 20], [35, 32, 9]].map(([x, y, h]) => `<rect x="${x}" y="${y}" width="5" height="${h}"${DAU}/>`).join('') + '<path d="M7 38C14 34 17 9 24.5 9S35 34 42 38"/>',
	chai: `<path d="M20 4h8v7l5 6v23a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V17l5-6z"/><path d="M15.6 25h16.8v14a3 3 0 0 1-3 3H18.6a3 3 0 0 1-3-3z"${DAU}/><path d="M20 8h8"/>`,
	// --- nhũ tương, hai bài mở rộng
	'giot-kep': tron(24, 24, 16, DAU) + [[18, 19, 4.5], [30, 22, 5], [22, 32, 4.5]].map(([x, y, r]) => tron(x, y, r, ' fill="var(--hh-be-mat)"')).join(''),
	'chan-doan': `<rect x="9" y="8" width="30" height="35" rx="4"/><path d="M19 8V5h10v3"/><path d="M15 20l3 3 5-6M15 32l3 3 5-6" stroke="${D}" stroke-width="2.8"/><path d="M27 20h7M27 32h7"/>`,
	// --- chất béo
	tag: `<path d="M9 9v30" stroke-width="3"/><g stroke="${D}"><polyline points="9,9 14,6 19,9 24,6 29,9 34,6 39,9"/><polyline points="9,24 14,21 19,24 24,21 29,24 34,21 39,24 44,21"/><polyline points="9,39 14,36 19,39 24,36 29,39 34,36"/></g>`,
	'tinh-the': `<path d="M24 5l16 9.5v19L24 43 8 33.5v-19z"/><path d="M24 5v38M8 14.5l32 19M40 14.5l-32 19" stroke="${D}"/>`,
	'mang-tinh-the': tron(18, 27, 4.5, DAU) + tron(33, 19, 3.5, DAU) + tron(31, 35, 3, DAU) + '<path d="M5 15l38-7M8 40L24 6M4 30l40 10M26 44L43 14M10 8l14 32"/>',
	'trao-doi': `<path d="M8 17h30m-6-6 6 6-6 6"/><path d="M40 31H10m6-6-6 6 6 6" stroke="${D}"/>`,
	'oxy-hoa': `<path d="M16 6c6 8 9 12 9 17a9 9 0 0 1-18 0c0-5 3-9 9-17z"${DAU}/><circle cx="33" cy="33" r="10"/><path d="M33 27v6l4 3"/>`,
	'giot-tinh-the': tron(24, 24, 15, DAU) + '<path d="M5 18l21 8M17 41l14-20M27 29l16 9"/>',
	// --- chất nhũ hóa
	'be-mat': '<path d="M3 26c7-3 14 3 21 0s14-3 21 0" stroke-dasharray="2 3"/>' + [9, 19, 29, 39].map((x) => tron(x, 15, 4, DAC) + `<polyline points="${x},19 ${x - 2},23 ${x + 2},27 ${x - 2},31 ${x + 1},35" stroke="${D}"/>`).join(''),
	'phan-tu': tron(10, 12, 5.5, DAC) + `<path d="M10 18l-3 6 6 6-6 6 3 6" stroke="${D}"/>` + tron(25, 11, 3.5, DAC) + `<path d="M23 15l-3 7 3 7-3 7M27 15l3 7-3 7 3 7" stroke="${D}"/><rect x="35" y="6" width="9" height="9" rx="2"${DAC}/><path d="M39.5 15v27" stroke="${D}"/>`,
	protein: `<path d="M4 30h40v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"${DAU}/><path d="M4 30h40" stroke-dasharray="2 3"/><path d="M7 30c1-13 8-13 9-2s6 9 7-1 6-12 8 3" stroke-width="2.8"/>` + tron(39, 24, 3.2, DAC) + tron(42, 14, 3.2, DAC),
	'quy-dinh': `<path d="M12 5h17l8 8v30H12z"/><path d="M29 5v8h8"/><path d="M18 28l5 5 8-10" stroke="${D}" stroke-width="3"/>`,
	'lua-chon': '<path d="M24 9v10M24 19L11 30M24 19l13 11"/>' + tron(24, 7, 3.2, DAC) + tron(11, 35, 5.5, DAU) + tron(37, 35, 5),
	// --- chất ổn định
	'mang-luoi': `<path d="M4 14c8-6 12 8 20 2s12-8 20-2"/><path d="M4 30c8-6 12 8 20 2s12-8 20-2"/><path d="M14 4c-6 8 8 12 2 20s-8 12-2 20M34 4c-6 8 8 12 2 20s-8 12-2 20" stroke="${D}"/>`,
	'chuoi-nhanh': `<path d="M3 27l8-6 8 6 8-6 8 6 8-6"/><path d="M11 21V10M27 21V10M19 27v11M35 27v11" stroke="${D}"/>` + tron(11, 8, 2.6, DAU) + tron(27, 8, 2.6, DAU) + tron(19, 40, 2.6, DAU) + tron(35, 40, 2.6, DAU),
	'xoan-kep': `<path d="M12 4c0 10 24 10 24 20S12 34 12 44"/><path d="M36 4c0 10-24 10-24 20s24 10 24 20" stroke="${D}"/><path d="M16 9h16M16 39h16M16 24h16" stroke-width="1.6"/>`,
	'hop-trung': '<path d="M4 15l7 7 7-7 7 7 7-7 7 7 5-5M4 33l7-7 7 7 7-7 7 7 7-7 5 5"/>' + tron(18, 24, 3.6, DAU) + tron(32, 24, 3.6, DAU),
	'bo-soi': `<path d="M11 5c5 9 5 29 0 38M24 5v38M37 5c-5 9-5 29 0 38"/><path d="M12 24h24" stroke="${D}" stroke-width="4"/>`,
	// --- thực phẩm
	'giu-nuoc': `<rect x="5" y="17" width="38" height="24" rx="9"/><path d="M12 25h24M12 29h24M12 33h24" stroke="${D}"/><path d="M24 3c3 4 4.5 6 4.5 8a4.5 4.5 0 0 1-9 0c0-2 1.5-4 4.5-8z"${DAC}/>`,
	'la-chan': `<path d="M24 5l15 5v12c0 10-7 17-15 21-8-4-15-11-15-21V10z"/><path d="M17 24l5 5 9-10" stroke="${D}" stroke-width="3"/>`,
	'nau-hoa': `<path d="M25 4c1 8 10 11 10 22a11 11 0 0 1-22 0c0-5 3-8 5-12 1 3 2 4 4 5 1-5 3-9 3-15z"${DAU}/><path d="M8 44h32"/>`,
	'hat-tinh-bot': `<ellipse cx="24" cy="24" rx="18" ry="14"${DAU}/><ellipse cx="22" cy="24" rx="11.5" ry="8.5"/><ellipse cx="20" cy="24" rx="5" ry="3.5"/>`,
	gel: `<path d="M10 12l16-4 14 8-8 12H16zM16 28l-6 12M16 28l10 14 6-14 8 10M26 8l6 20" stroke="${D}"/>` + [[10, 12], [26, 8], [40, 16], [16, 28], [32, 28], [10, 40], [26, 42], [40, 38]].map(([x, y]) => tron(x, y, 3, DAC)).join(''),
	'duong-vi': `<path d="M24 7l15 7.5-15 7.5-15-7.5z"${DAU}/><path d="M24 7l15 7.5v17L24 39 9 31.5v-17z"/><path d="M9 14.5l15 7.5 15-7.5M24 22v17"/>`,
	'nhiet-ke': `<path d="M19 9a5 5 0 0 1 10 0v19a9 9 0 1 1-10 0z"/>` + tron(24, 35, 5, DAU) + `<path d="M24 15v16" stroke="${D}" stroke-width="3"/><path d="M34 11h6M34 17h6M34 23h6"/>`,
	// --- dược phẩm
	vien: `<g transform="rotate(-35 24 24)"><path d="M24 16h-9a8 8 0 0 0 0 16h9z"${DAU}/><rect x="7" y="16" width="34" height="16" rx="8"/><path d="M24 16v16"/></g>`,
	'hoa-tan': '<path d="M9 6h30M13 6v30a6 6 0 0 0 6 6h10a6 6 0 0 0 6-6V6M13 17h22"/>' + `<ellipse cx="24" cy="35" rx="7" ry="4"${DAU}/>` + tron(19, 26, 1.8, DAC) + tron(28, 22, 1.8, DAC) + tron(30, 29, 1.8, DAC),
	lo: `<path d="M11.2 28c5-4 8 4 13 0s8-4 12.6 0v10a3 3 0 0 1-3 3H14.2a3 3 0 0 1-3-3z"${DAU}/><rect x="10" y="16" width="28" height="26" rx="4"/><rect x="7" y="7" width="34" height="9" rx="2"/>`,
	nano: `<circle cx="24" cy="24" r="12.5" stroke="${D}" stroke-width="3.2"/>` + vong(14, 17, 2.2, DAC) + vong(8, 8, 2, DAC, 0.4),
	'vien-nen': `<path d="M7 21v7c0 5.5 7.6 10 17 10s17-4.5 17-10v-7"/><ellipse cx="24" cy="21" rx="17" ry="10" fill="${D}"/><path d="M11 16l26 10"/>`,
	'dong-ho': `<circle cx="24" cy="26" r="16"/><path d="M24 16v10l7 4" stroke="${D}" stroke-width="3"/><path d="M18 4h12M24 4v6"/>`,
	'tang-quy-mo': `<rect x="5" y="27" width="11" height="15" rx="2"/><path d="M19 34h7m-3-3 3 3-3 3"/><path d="M30.2 25h11.6v14a2 2 0 0 1-2 2h-7.6a2 2 0 0 1-2-2z"${DAU}/><rect x="29" y="8" width="14" height="34" rx="3"/>`,
};

/** Bài -> tên biểu tượng. Khu nhũ tương: sáu chặng lấy `bieuTuong` trong chang.mjs, ở đây chỉ khai hai bài mở rộng. */
export const BIEU_TUONG_BAI = {
	'nhu-tuong/he-dac-biet': 'giot-kep',
	'nhu-tuong/su-co-thiet-ke': 'chan-doan',
	'chat-beo/cau-truc-triglyceride-va-acid-beo': 'tag',
	'chat-beo/da-hinh-ket-tinh-va-ban-do-pha': 'tinh-the',
	'chat-beo/sfc-mang-tinh-the-oleogel': 'mang-tinh-the',
	'chat-beo/phan-doan-interesterification-hydro-hoa': 'trao-doi',
	'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung': 'oxy-hoa',
	'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong': 'giot-tinh-the',
	'chat-nhu-hoa/nen-tang-vat-ly-hoa-be-mat': 'be-mat',
	'chat-nhu-hoa/cac-nhom-chat-nhu-hoa-thuc-pham': 'phan-tu',
	'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu': 'protein',
	'chat-nhu-hoa/ma-ins-quy-dinh-an-toan': 'quy-dinh',
	'chat-nhu-hoa/ung-dung-theo-san-pham-va-quy-trinh-chon-chat-nhu-hoa': 'lua-chon',
	'chat-on-dinh/co-che-nen-tang': 'mang-luoi',
	'chat-on-dinh/xanthan-va-galactomannan': 'chuoi-nhanh',
	'chat-on-dinh/carrageenan-va-he-sua': 'xoan-kep',
	'chat-on-dinh/alginate-pectin-gellan': 'hop-trung',
	'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose': 'bo-soi',
	'chat-on-dinh/quy-dinh-ins-e': 'quy-dinh',
	'thuc-pham/giu-nuoc-thit-phosphat-muoi-ph': 'giu-nuoc',
	'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung': 'la-chan',
	'thuc-pham/maillard-caramel-acrylamide': 'nau-hoa',
	'thuc-pham/tinh-bot-ho-hoa-thoai-hoa': 'hat-tinh-bot',
	'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym': 'gel',
	'thuc-pham/chat-tao-ngot-mau-dieu-vi': 'duong-vi',
	'thuc-pham/qua-trinh-nhiet-lanh-say-ep-dun': 'nhiet-ke',
	'thuc-pham/quy-dinh-jecfa-efsa-da-kiem': 'quy-dinh',
	'duoc-pham/ta-duoc-chuc-nang-va-tuong-ky': 'vien',
	'duoc-pham/hoa-tan-sinh-kha-dung-bcs': 'hoa-tan',
	'duoc-pham/dang-bao-che-long-va-ban-ran': 'lo',
	'duoc-pham/he-phan-tan-nano': 'nano',
	'duoc-pham/dang-ran-vien-nen-tao-hat': 'vien-nen',
	'duoc-pham/on-dinh-han-dung-ich': 'dong-ho',
	'duoc-pham/qbd-scale-up-quy-trinh': 'tang-quy-mo',
};

const thoat = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Danh sách trạm của một khu: { slug, ten, cauHoi, so (số trong vòng tròn, null = bài mở rộng), bieuTuong, mau }. Thiếu biểu tượng thì ném lỗi để build dừng. */
export function tramCuaKhu(khu) {
	const k = KHU[khu];
	if (!k) throw new Error(`ban-do-khu: không có khu "${khu}"`);
	let dem = 0;
	return k.bai.map((b) => {
		const laNhuTuong = khu === 'nhu-tuong';
		const moRong = laNhuTuong && b.so == null;
		const so = moRong ? null : laNhuTuong ? b.so : ++dem;
		const bieuTuong = b.bieuTuong || BIEU_TUONG_BAI[`${khu}/${b.slug}`];
		if (!bieuTuong || !BIEU_TUONG[bieuTuong]) throw new Error(`ban-do-khu: bài ${khu}/${b.slug} chưa có biểu tượng (khai ở BIEU_TUONG_BAI trong src/data/ban-do-khu.mjs)`);
		if (!b.cauHoi) throw new Error(`ban-do-khu: bài ${khu}/${b.slug} chưa có cauHoi trong khu.mjs`);
		return {
			slug: b.slug,
			ten: b.ten.replace(/^\d+\.\s*/, ''),
			cauHoi: b.cauHoi,
			so,
			bieuTuong,
			mau: laNhuTuong ? `var(--chang-${moRong ? 7 : b.so})` : k.mau,
			khoa: laNhuTuong ? b.slug : `${khu}/${b.slug}`, // khóa "đã đọc" của tuong-tac.js
		};
	});
}

/** HTML bản đồ của một khu: một khối liền, không có dòng trống (để chèn thẳng vào Markdown). */
export function htmlBanDo(khu) {
	const tram = tramCuaKhu(khu);
	const cot = Math.ceil(tram.length / 2);
	const li = tram.map((t) =>
		`<li style="--mau:${t.mau}"><a class="bd-nut${t.so == null ? ' bd-mo-rong' : ''}" href="${t.slug}/" data-slug="${t.khoa}">` +
		`<span class="bd-tron"><svg class="bieu-tuong" width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${BIEU_TUONG[t.bieuTuong]}</svg>` +
		`${t.so == null ? '' : `<span class="bd-so" aria-hidden="true">${t.so}</span>`}</span>` +
		`<span class="bd-chu"><b>${t.so == null ? '' : `<span class="bd-an">${t.so}. </span>`}${thoat(t.ten)}</b><small>${thoat(t.cauHoi)}</small><span class="bd-tt" data-trang-thai></span></span></a></li>`,
	);
	return [
		`<nav class="ban-do-khu not-content" aria-label="Bản đồ lộ trình khu ${thoat(KHU[khu].ten)}">`,
		`<p class="bd-dau"><b>Bản đồ lộ trình</b><span data-tien-do-khu="${khu}" data-tong="${tram.length}">${tram.length} bài</span></p>`,
		`<ol class="bd-ds" style="--cot:${cot}">`,
		...li,
		'</ol>',
		'<p class="bd-ghi-chu">Biểu tượng minh họa. Dấu ✓ là bài bạn đã đánh dấu đã đọc, chỉ lưu trên máy này.</p>',
		'</nav>',
	].join('\n');
}
