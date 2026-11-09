// Hộp "Liên quan ở khu khác" cuối bài: nối bài này với bài cùng chủ đề ở một khu khác (gói L4).
// "Máy in" (scripts/chuan-bi-noi-dung.mjs) đặt hộp sau "Thử ngay" và trước hộp "Đọc xong bài này?".
// Quy tắc (hàm htmlLienQuan và scripts/kiem-sau-build.mjs đều kiểm): mỗi bài tối đa 3 dòng; bài đích phải ở KHU KHÁC và có trong src/data/khu.mjs;
// mỗi dòng có một câu nói bài kia bàn gì ở góc của nó. Câu mô tả chỉ nói phạm vi bài, không đưa số liệu khoa học.
// Khóa và đích đều viết 'khu/slug'. Các cặp được nối hai chiều, nên mỗi cặp có hai dòng (một ở mỗi bài).
import { KHU } from './khu.mjs';

export const LIEN_QUAN = {
	// 1. Oxy hóa lipid
	'nhu-tuong/mat-on-dinh': [
		{ bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', vi: 'Bài này chỉ tóm tắt oxy hóa lipid trong nhũ tương (mục 7.1); khu Chất béo bàn đủ cơ chế, chất chống oxy hóa, phép đo và hạn dùng.' },
		{ bai: 'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong', vi: 'Hợp giọt một phần nhìn từ phía tinh thể béo trong giọt.' },
	],
	'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung': [
		{ bai: 'nhu-tuong/mat-on-dinh', vi: 'Oxy hóa chỉ là một trong các con đường mất ổn định; bài này đặt nó cạnh kem hóa, keo tụ, hợp giọt và nói chúng nối tiếp nhau thế nào.' },
		{ bai: 'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung', vi: 'Hạn dùng nhìn từ phía vi sinh vật: hoạt độ nước, pH và hàng rào kép.' },
		{ bai: 'duoc-pham/on-dinh-han-dung-ich', vi: 'Arrhenius và các điều kiện thử ICH khi tính hạn dùng của thuốc.' },
	],
	// 2. Hợp giọt một phần, kem lạnh, bơ
	'nhu-tuong/san-pham': [
		{ bai: 'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong', vi: 'Bơ ca cao, béo sữa, MCT và tinh thể béo trong giọt: phần chất béo đứng sau kem, kem lạnh và bơ.' },
		{ bai: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu', vi: 'Protein bị chất nhũ hóa phân tử nhỏ đẩy khỏi bề mặt giọt, kèm cách dùng có chủ ý trong kem lạnh và kem tươi đánh bông.' },
	],
	'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong': [
		{ bai: 'nhu-tuong/mat-on-dinh', vi: 'Hợp giọt một phần đặt cạnh kem hóa, keo tụ, hợp giọt và Ostwald ripening để biết khi nào dùng chẩn đoán nào.' },
		{ bai: 'nhu-tuong/san-pham', vi: 'Các sản phẩm cụ thể (sữa, kem, bơ, margarine) và chất béo nào hợp với từng loại.' },
		{ bai: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu', vi: 'Màng protein và chất nhũ hóa phân tử nhỏ trên bề mặt giọt béo quyết định giọt có dễ dính nhau không.' },
	],
	'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu': [
		{ bai: 'chat-beo/chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong', vi: 'Phía tinh thể béo của câu chuyện kem lạnh: kết tinh trong giọt và hợp giọt một phần.' },
		{ bai: 'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym', vi: 'Cùng protein nhưng nhìn từ phía biến tính nhiệt, tạo gel và enzym.' },
	],
	// 3. Arrhenius và hạn dùng
	'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung': [
		{ bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', vi: 'Hạn dùng khi hư hỏng là do oxy hóa lipid, không phải vi sinh; có cả bẫy khi ngoại suy bằng Arrhenius.' },
		{ bai: 'duoc-pham/on-dinh-han-dung-ich', vi: 'Cách ngành dược dùng Arrhenius, Q10 và ASAP cùng các điều kiện thử ICH.' },
	],
	'duoc-pham/on-dinh-han-dung-ich': [
		{ bai: 'chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', vi: 'Cùng phương trình Arrhenius áp vào oxy hóa dầu, kèm các bẫy cần tránh.' },
		{ bai: 'thuc-pham/bao-quan-hoat-do-nuoc-va-han-su-dung', vi: 'Hạn dùng thực phẩm nhìn qua aw, pH và hàng rào vi sinh.' },
	],
	// 4. Tinh bột
	'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose': [
		{ bai: 'thuc-pham/tinh-bot-ho-hoa-thoai-hoa', vi: 'Tinh bột tự nhiên hồ hóa và thoái hóa thế nào, đường và muối làm đổi gì.' },
		{ bai: 'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym', vi: 'Protein tạo gel theo hai bước nào; bên này là phần gelatin ở góc chất ổn định.' },
	],
	'thuc-pham/tinh-bot-ho-hoa-thoai-hoa': [
		{ bai: 'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose', vi: 'Tinh bột biến tính (E1404–E1452) được dùng làm chất ổn định, nhóm nào và để làm gì.' },
	],
	// 5. Protein, gel
	'thuc-pham/protein-bien-tinh-gel-hoa-va-enzym': [
		{ bai: 'chat-nhu-hoa/protein-nhu-hoa-va-canh-tranh-hap-phu', vi: 'Protein làm chất nhũ hóa trên bề mặt giọt và khi nào bị chất nhũ hóa nhỏ đẩy đi.' },
		{ bai: 'chat-on-dinh/gum-arabic-gelatin-tinh-bot-cellulose', vi: 'Gelatin ở góc chất ổn định, cạnh gum arabic, tinh bột biến tính và cellulose.' },
	],
	// 6. Nanoemulsion
	'nhu-tuong/he-dac-biet': [
		{ bai: 'duoc-pham/he-phan-tan-nano', vi: 'Nanoemulsion, SEDDS, liposome, LNP nhìn từ phía bào chế thuốc, kể cả thông số đồng hóa áp lực cao và rotor–stator.' },
	],
	'duoc-pham/he-phan-tan-nano': [
		{ bai: 'nhu-tuong/he-dac-biet', vi: 'Nanoemulsion, Pickering, nhũ tương kép và HIPE cho thực phẩm: cơ chế và cách đo.' },
	],
	// 7. Chặng 4: trỏ thẳng bài thay vì trang khu
	'nhu-tuong/chat-on-dinh': [
		{ bai: 'chat-on-dinh/co-che-nen-tang', vi: 'Hydrocolloid ổn định hệ bằng những cách nào: depletion flocculation, ứng suất chảy, tương tác với protein.' },
		{ bai: 'chat-nhu-hoa/cac-nhom-chat-nhu-hoa-thuc-pham', vi: 'Lecithin, MDG, polysorbate, Span, PGPR…: cấu trúc và cơ chế từng nhóm chất nhũ hóa.' },
	],
	// 8. Maillard
	'thuc-pham/maillard-caramel-acrylamide': [
		{ bai: 'duoc-pham/ta-duoc-chuc-nang-va-tuong-ky', vi: 'Maillard cũng là một tương kỵ thật trong bào chế: lactose với hoạt chất có nhóm amin.' },
	],
	'duoc-pham/ta-duoc-chuc-nang-va-tuong-ky': [
		{ bai: 'thuc-pham/maillard-caramel-acrylamide', vi: 'Cơ chế Maillard đầy đủ: nhiệt độ, pH, aw và các đòn bẩy giảm acrylamide.' },
	],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const tim = (ma) => {
	const [k, ...r] = ma.split('/');
	const s = r.join('/');
	const b = KHU[k]?.bai.find((x) => x.slug === s) ?? KHU[k]?.phu?.find((x) => x.slug === s);
	return b ? { khu: k, slug: s, ten: b.ten } : null;
};

/** Kiểm dữ liệu: khóa và đích có thật, đích ở khu khác, tối đa 3 dòng, mỗi dòng có câu mô tả. Sai thì ném lỗi (build dừng). */
export function kiemLienQuan() {
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
