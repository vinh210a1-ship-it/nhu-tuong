// Hộp "Liên quan ở khu khác" cuối bài: nối bài này với bài cùng chủ đề ở một khu khác (gói L4).
// "Máy in" (scripts/chuan-bi-noi-dung.mjs) đặt hộp sau "Thử ngay" và trước hộp "Đọc xong bài này?".
// Quy tắc (hàm htmlLienQuan và scripts/kiem-sau-build.mjs đều kiểm): mỗi bài tối đa 3 dòng; bài đích phải ở KHU KHÁC và có trong src/data/khu.mjs;
// mỗi dòng có một câu nói bài kia bàn gì ở góc của nó. Câu mô tả chỉ nói phạm vi bài, không đưa số liệu khoa học.
// 13 cặp do bộ phận Thiết kế chốt (THIET-KE-GD1-L1-L7). Mỗi cặp { a, b, viA, viB } cho hai dòng: viA hiện ở bài a (vì sao nên đọc b), viB hiện ở bài b. a, b viết 'khu/slug'.
import { KHU } from './khu.mjs';

export const LIEN_QUAN_CAP = [
	{ a: 'nhu-tuong/mat-on-dinh', b: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung',
		viA: 'Đi sâu cơ chế gốc tự do, chất chống oxy hóa và cách ước lượng hạn dùng của dầu.',
		viB: 'Xem vì sao trong nhũ tương, bề mặt giọt và chất nhũ hóa ảnh hưởng đến tốc độ ôi.' }, // 1
	{ a: 'nhu-tuong/san-pham', b: 'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong',
		viA: 'Tinh thể mỡ trong giọt làm hợp giọt một phần thế nào, nền của kem lạnh và bơ.',
		viB: 'Xem hợp giọt một phần được dùng có chủ ý trong kem lạnh, kem đánh bông và bơ ra sao.' }, // 2
	{ a: 'nhu-tuong/san-pham', b: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu',
		viA: 'Vì sao kem lạnh cần chất nhũ hóa phân tử nhỏ đẩy bớt protein khỏi bề mặt hạt béo.',
		viB: 'Xem các sản phẩm cụ thể nơi cạnh tranh hấp phụ quyết định cấu trúc.' }, // 3
	{ a: 'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong', b: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu',
		viA: 'Phía bề mặt của hợp giọt một phần: chất nhũ hóa nào thay protein và vì sao.',
		viB: 'Phía tinh thể của hợp giọt một phần: loại béo và độ rắn ảnh hưởng đến mạng hạt béo ra sao.' }, // 4
	{ a: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', b: 'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung',
		viA: 'Cùng phép ngoại suy Arrhenius, áp cho hư hỏng do vi sinh và hoạt độ nước.',
		viB: 'Cùng phép ngoại suy Arrhenius, áp cho oxy hóa dầu, kèm các bẫy khi ngoại suy.' }, // 5
	{ a: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', b: 'duoc-pham/on-dinh-han-dung-ich',
		viA: 'Cách ngành dược thử ổn định theo ICH và ASAP, nơi dữ liệu thử nhanh được dùng để định hạn dùng.',
		viB: 'Ngoại suy hạn dùng cho dầu và nhũ tương thực phẩm, chọn động học bậc 0 hoặc bậc 1 theo dữ liệu.' }, // 6
	{ a: 'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung', b: 'duoc-pham/on-dinh-han-dung-ich',
		viA: 'Điều kiện thử và vùng khí hậu IVb mà dược dùng để định hạn dùng.',
		viB: 'Hàng rào aw, pH, nhiệt độ mà thực phẩm dùng để chặn vi sinh.' }, // 7
	{ a: 'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose', b: 'thuc-pham/tinh-bot-ho-hoa-thoai-hoa',
		viA: 'Hồ hóa và thoái hóa: vì sao tinh bột làm đặc tốt lúc đầu rồi đổi theo thời gian.',
		viB: 'Tinh bột biến tính dùng làm chất ổn định, đặt cạnh gum, gelatin và cellulose.' }, // 8
	{ a: 'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym', b: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu',
		viA: 'Cùng protein nhưng ở bề mặt giọt: hấp phụ, mở cuộn và bị đẩy khỏi bề mặt.',
		viB: 'Cùng protein nhưng trong khối: biến tính và tạo gel theo hai bước.' }, // 9
	{ a: 'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym', b: 'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose',
		viA: 'Gelatin: gel protein tạo bằng làm lạnh, khác gel tạo bằng gia nhiệt.',
		viB: 'Cơ chế chung của gel protein tạo bằng nhiệt, muối và enzym.' }, // 10
	{ a: 'nhu-tuong/he-dac-biet', b: 'duoc-pham/he-phan-tan-nano',
		viA: 'Nanoemulsion, SEDDS, liposome và LNP nhìn từ phía bào chế thuốc, kèm thông số đồng hóa áp lực cao và rotor–stator.',
		viB: 'Nền vật lý của nanoemulsion và Ostwald ripening, phía thực phẩm.' }, // 11
	{ a: 'nhu-tuong/chat-on-dinh', b: 'chat-on-dinh/co-che-nen-tang',
		viA: 'Các cơ chế hydrocolloid giữ hệ ổn định: độ nhớt, ứng suất chảy, keo tụ do cạn kiệt.',
		viB: 'Bản đồ cơ chế hỏng nào chặn bằng công cụ nào, trong đó hydrocolloid là một công cụ.' }, // 12
	{ a: 'thuc-pham/maillard-caramel-acrylamide', b: 'duoc-pham/ta-duoc-chuc-nang-va-tuong-ky',
		viA: 'Maillard cũng xảy ra trong viên thuốc: tương kỵ giữa lactose và dược chất có nhóm amin.',
		viB: 'Cơ chế đầy đủ của Maillard và các yếu tố nhiệt độ, pH, aw.' }, // 13
];

/** Bản tra theo bài: 'khu/slug' → [{ bai, vi }], suy ra từ các cặp nên luôn có đủ hai chiều. */
export const LIEN_QUAN = (() => {
	const m = {};
	for (const c of LIEN_QUAN_CAP) {
		(m[c.a] ??= []).push({ bai: c.b, vi: c.viA });
		(m[c.b] ??= []).push({ bai: c.a, vi: c.viB });
	}
	return m;
})();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const tim = (ma) => {
	const [k, ...r] = ma.split('/');
	const s = r.join('/');
	const b = KHU[k]?.bai.find((x) => x.slug === s) ?? KHU[k]?.phu?.find((x) => x.slug === s);
	return b ? { khu: k, slug: s, ten: b.ten } : null;
};

/** Kiểm dữ liệu: khóa và đích có thật, đích ở khu khác, tối đa 3 dòng, mỗi dòng có câu mô tả. Sai thì ném lỗi (build dừng). */
export function kiemLienQuan() {
	const thay = new Set();
	for (const c of LIEN_QUAN_CAP) {
		const k = [c.a, c.b].sort().join(' | ');
		if (thay.has(k)) throw new Error(`lien-quan-khu: cặp lặp ${k}`);
		thay.add(k);
		if (!c.viA || !c.viB) throw new Error(`lien-quan-khu: cặp ${k} thiếu viA hoặc viB (cần đủ hai chiều)`);
	}
	for (const [ma, ds] of Object.entries(LIEN_QUAN)) {
		const goc = tim(ma);
		if (!goc) throw new Error(`lien-quan-khu: bài "${ma}" không có trong KHU`);
		if (ds.length < 1 || ds.length > 3) throw new Error(`lien-quan-khu: bài "${ma}" có ${ds.length} dòng (cần 1 đến 3)`);
		for (const d of ds) {
			const dich = tim(d.bai);
			if (!dich) throw new Error(`lien-quan-khu: "${ma}" trỏ tới bài lạ "${d.bai}"`);
			if (dich.khu === goc.khu) throw new Error(`lien-quan-khu: "${ma}" trỏ tới bài cùng khu "${d.bai}" (hộp này chỉ cho khu khác)`);
			if (!d.vi) throw new Error(`lien-quan-khu: "${ma}" → "${d.bai}" thiếu câu mô tả`);
		}
	}
}

/** HTML hộp "Liên quan ở khu khác" (một khối liền, không dòng trống). Trang bài nằm ở /<khu>/<slug>/ nên liên kết là ../../<khu>/<slug>/. */
export function htmlLienQuan(khu, slug) {
	const ma = `${khu}/${slug}`;
	const ds = LIEN_QUAN[ma];
	if (!ds) return '';
	const li = ds.map((d) => {
		const t = tim(d.bai);
		return `<li><span class="tn-loai lq-khu lq-${t.khu}">${esc(KHU[t.khu].ten)}</span><a class="tn-ten" href="../../${t.khu}/${t.slug}/">${esc(t.ten)}</a><span class="tn-vi">${esc(d.vi)}</span></li>`;
	});
	return `<div class="lien-quan not-content" data-lien-quan="${ma}"><b class="tn-tieu-de">Liên quan ở khu khác</b><ul class="tn-ds">${li.join('')}</ul></div>`;
}
