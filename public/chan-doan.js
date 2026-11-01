// Cây chẩn đoán sự cố nhũ tương: hỏi từng câu, dẫn tới mắt xích hỏng, bằng chứng cần tìm, cách sửa, cách kiểm chứng.
// Nội dung lấy từ bài "Xử lý sự cố và quy trình thiết kế công thức" (bảng chẩn đoán mục 1 và sơ đồ mục 2).
// Tìm mọi <div data-chan-doan> trên trang và dựng giao diện.

const BASE = new URL('.', import.meta.url).pathname; // '/nhu-tuong/'
const bai = (slug, chu) => `<a href="${BASE}nhu-tuong/${slug}/">${chu}</a>`;
const nguon = (khoa, ten) =>
	`<span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan"><a class="nhan-nguon" href="${BASE}nguon/#${khoa}">${ten}</a></span></span>`;

// Câu hỏi: { hoi, goiY?, chon: [[chữ, đích], ...] }; đích là id câu hỏi khác hoặc id kết luận
const CAU = {
	dau: {
		hoi: 'Bạn thấy hiện tượng gì rõ nhất?',
		chon: [
			['Có lớp kem hoặc lớp trắng đục nổi lên trên', 'kem'],
			['Có mắt dầu hoặc lớp dầu trong tách ra', 'hop-giot'],
			['Đo thấy giọt lớn dần theo thời gian', 'lon-dan'],
			['Nhũ tương đặc lại, đóng gel rồi tách', 'gel'],
			['Nhũ tương đổi loại (độ dẫn điện tụt đột ngột)', 'dao-pha'],
			['Mùi ôi, chỉ số peroxide hoặc hexanal tăng', 'oxy-hoa'],
			['Có cặn lắng dưới đáy', 'lang'],
			['Lúc sản xuất: tăng áp đồng hóa mà giọt không nhỏ đi', 'khong-nho'],
			['Hệ đặc biệt: nhũ tương kép hoặc Pickering có vấn đề', 'dac-biet'],
			['Chưa rõ, chưa đo gì', 'chua-ro'],
		],
	},
	kem: {
		hoi: 'Lắc nhẹ thì lớp kem có trộn đều trở lại không?',
		goiY: 'Thử trên một mẫu nhỏ; không lắc mạnh.',
		chon: [
			['Có, trộn lại được', 'kem-nhanh'],
			['Không, thấy dầu tách riêng', 'hop-giot'],
		],
	},
	'kem-nhanh': {
		hoi: 'Lớp kem có hình thành nhanh hơn định luật Stokes dự đoán không?',
		goiY: 'Tính bằng máy tính Stokes với d₉₀ đo được. Dưới kính hiển vi có thấy giọt dính thành cụm không?',
		chon: [
			['Nhanh hơn nhiều, hoặc thấy cụm giọt', 'KQ-keo-tu'],
			['Khớp với Stokes, giọt rời nhau', 'KQ-kem-hoa'],
			['Chưa biết', 'KQ-kem-hoa-thu'],
		],
	},
	'lon-dan': {
		hoi: 'Vẽ d₄₃³ theo thời gian có ra đường thẳng không? Pha dầu có tan một ít trong nước (hương liệu, tinh dầu, TAG mạch ngắn)?',
		chon: [
			['Có, đường thẳng và dầu hơi tan trong nước', 'KQ-ostwald'],
			['Không thẳng, hoặc có những giọt rất lớn xuất hiện', 'hop-giot'],
		],
	},
	gel: {
		hoi: 'Đo độ dẫn điện có thấy tụt mạnh không?',
		goiY: 'O/W dẫn điện tốt; W/O gần như không dẫn.',
		chon: [
			['Có, tụt mạnh', 'KQ-dao-pha'],
			['Không, chỉ đặc lên', 'KQ-gel'],
		],
	},
	'dac-biet': {
		hoi: 'Hệ của bạn là loại nào?',
		chon: [
			['Nhũ tương kép (W/O/W): mất hoạt chất, giọt nước bên trong phồng hoặc xẹp', 'KQ-kep'],
			['Pickering: giọt to hơn mong đợi hoặc đổi theo đồng hóa', 'KQ-pickering'],
		],
	},
	'hop-giot': { chuyen: 'KQ-hop-giot' },
	'dao-pha': { chuyen: 'KQ-dao-pha' },
	'oxy-hoa': { chuyen: 'KQ-oxy-hoa' },
	lang: { chuyen: 'KQ-lang' },
	'khong-nho': { chuyen: 'KQ-khong-nho' },
	'chua-ro': { chuyen: 'KQ-chua-ro' },
};

// Kết luận: tên, nguyên nhân, bằng chứng cần tìm, cách sửa, cách kiểm chứng, đọc thêm
const KQ = {
	'KQ-kem-hoa': {
		ten: 'Kem hóa (giọt nổi theo Stokes)',
		vi: 'Giọt đủ lớn hoặc pha liên tục quá loãng nên giọt nổi lên.',
		bang: 'd₉₀ cao; chỉ số kem hóa (CI) tăng theo thời gian; kích thước giọt giữ nguyên sau khi lắc.',
		sua: 'Giảm kích thước giọt (thêm lần qua máy đồng hóa áp suất cao); tăng độ nhớt hoặc ngưỡng chảy của pha liên tục; thêm chất làm nặng pha dầu.',
		kiem: 'CI giảm, d₉₀ giảm; theo dõi bằng Turbiscan hoặc ống đong.',
		them: `${bai('mat-on-dinh', 'Mất ổn định: kem hóa')} · <a href="${BASE}may-tinh/">máy tính Stokes</a>`,
	},
	'KQ-kem-hoa-thu': {
		ten: 'Có thể là kem hóa, cần phân biệt với keo tụ',
		vi: 'Kem hóa đơn thuần và kem hóa do keo tụ trông giống nhau bằng mắt.',
		bang: 'So sánh kích thước đo bằng tán xạ laser với hình kính hiển vi; pha loãng mẫu trong dung dịch SDS rồi đo lại: nếu kích thước trở về ban đầu thì có keo tụ.',
		sua: 'Làm phép thử trước khi sửa: sửa sai mắt xích sẽ tốn công mà không hết.',
		kiem: 'Kích thước trước và sau khi thêm SDS; hình hiển vi.',
		them: bai('mat-on-dinh', 'Phân biệt hợp giọt và keo tụ'),
	},
	'KQ-keo-tu': {
		ten: 'Keo tụ, rồi kem hóa nhanh',
		vi: 'Giọt dính thành cụm lớn nên nổi nhanh hơn từng giọt riêng lẻ.',
		bang: 'Thấy cụm dưới kính hiển vi; kích thước đo bằng laser nhỏ hơn hình hiển vi; pha loãng bằng SDS thì kích thước trở về ban đầu.',
		sua: 'Tăng lực đẩy tĩnh điện hoặc lập thể; giảm polymer tự do (keo tụ do cạn kiệt); chỉnh pH xa điểm đẳng điện của protein.',
		kiem: 'Kích thước không đổi khi có tác động; zeta hoặc độ nhớt thay đổi theo hướng mong muốn.',
		them: `${bai('mat-on-dinh', 'Mất ổn định: keo tụ')} · ${bai('chat-on-dinh', 'Ổn định')}`,
	},
	'KQ-hop-giot': {
		ten: 'Hợp giọt',
		vi: 'Màng bề mặt bị thủng, hai giọt nhập làm một. Không đảo ngược được bằng lắc.',
		bang: 'Phân bố kích thước dịch về giọt lớn, d₉₀ tăng và không phục hồi sau khi thêm SDS; có mắt dầu.',
		sua: 'Tăng lượng chất nhũ hóa; chọn màng nhớt–đàn hồi; giảm cắt mạnh khi xử lý; kiểm tra chế độ nhiệt.',
		kiem: 'd₄₃ ổn định theo thời gian; thử ly tâm hoặc đông–rã đông.',
		them: `${bai('mat-on-dinh', 'Mất ổn định: hợp giọt')} · <a href="${BASE}may-tinh/">lượng chất nhũ hóa tối thiểu</a>`,
	},
	'KQ-ostwald': {
		ten: 'Ostwald ripening',
		vi: 'Dầu tan một ít trong nước khuếch tán từ giọt nhỏ sang giọt lớn.',
		bang: `Đồ thị d₄₃³ theo thời gian là đường thẳng; pha dầu là hương liệu, tinh dầu hoặc TAG mạch ngắn.`,
		sua: `Trộn thêm dầu không tan trong nước vào pha dầu; ví dụ với tinh dầu húng tây cần ≥ 60% dầu bắp hoặc ≥ 50% MCT ${nguon('chang2012', 'Chang 2012')}. Giảm độ tan; dùng chất nhũ hóa tạo màng dày.`,
		kiem: 'Độ dốc của đường d³ theo thời gian giảm gần về 0.',
		them: bai('mat-on-dinh', 'Mất ổn định: Ostwald ripening'),
	},
	'KQ-gel': {
		ten: 'Keo tụ mạng (gel hóa)',
		vi: 'Giọt keo tụ thành mạng ba chiều làm hệ đặc lại, sau đó mạng co và tách.',
		bang: 'Độ nhớt tăng; kính hiển vi thấy mạng giọt.',
		sua: 'Giảm φ hoặc điều chỉnh loại và lượng gum; kiểm tra HLB và nhiệt độ.',
		kiem: 'G′ giảm khi đo lưu biến; hình hiển vi không còn mạng.',
		them: `${bai('do-luong', 'Đo lường: lưu biến')} · ${bai('chat-on-dinh', 'Ổn định')}`,
	},
	'KQ-dao-pha': {
		ten: 'Đảo pha',
		vi: 'O/W chuyển thành W/O (hoặc ngược lại), thường khi thêm pha phân tán quá nhanh hoặc φ quá cao.',
		bang: 'Độ dẫn điện tụt đột ngột trong lúc thêm pha.',
		sua: 'Thêm pha phân tán chậm; đổi chất nhũ hóa; giảm φ.',
		kiem: 'Đo độ dẫn điện liên tục trong quá trình thêm pha.',
		them: bai('mat-on-dinh', 'Mất ổn định: đảo pha'),
	},
	'KQ-oxy-hoa': {
		ten: 'Oxy hóa lipid',
		vi: 'Chất béo bị oxy hóa tạo mùi ôi; ở nhũ tương, phản ứng xảy ra mạnh ở bề mặt giọt.',
		bang: 'PV, TBARS hoặc hexanal tăng; có ion kim loại; tiếp xúc ánh sáng.',
		sua: 'Thêm chất tạo phức kim loại (EDTA, citrate); thêm chất chống oxy hóa; dùng màng bề mặt tích điện dương; giảm oxy.',
		kiem: 'Thời gian cảm ứng kéo dài; PV và cảm quan tốt hơn đối chứng.',
		them: `<a href="${BASE}chat-beo/oxy-hoa-lipid-chong-oxy-hoa-han-su-dung/">Chất béo: oxy hóa và hạn dùng</a> · <a href="${BASE}may-tinh/">máy tính Q10, Arrhenius</a>`,
	},
	'KQ-lang': {
		ten: 'Lắng hạt rắn hoặc protein tụ',
		vi: 'Hạt rắn hoặc protein bị tụ nặng hơn pha liên tục nên lắng xuống.',
		bang: 'Ly tâm thấy pha rắn tách ra.',
		sua: 'Giảm cỡ hạt; thêm gellan hoặc gum tạo ngưỡng chảy; chỉnh pH.',
		kiem: 'Mẫu ly tâm không còn cặn.',
		them: `<a href="${BASE}chat-on-dinh/alginate-pectin-gellan/">Chất ổn định: gellan giữ hạt lơ lửng</a>`,
	},
	'KQ-khong-nho': {
		ten: 'Bị giới hạn bởi chất nhũ hóa',
		vi: 'Giọt vỡ được nhưng không đủ chất nhũ hóa phủ nhanh nên lại hợp nhau ngay trong máy, hoặc protein tan kém.',
		bang: 'Kích thước giọt gần như không đổi theo áp suất; so sánh với một chất nhũ hóa phân tử nhỏ ở cùng điều kiện.',
		sua: `Tăng lượng chất nhũ hóa; chỉnh pH; xử lý protein (siêu âm, pH-shift) ${nguon('yang2021', 'Yang 2021')}.`,
		kiem: 'Kích thước giảm khi đổi sang chất nhũ hóa mới hoặc tăng lượng.',
		them: `${bai('hinh-thanh', 'Hình thành nhũ tương')} · <a href="${BASE}may-tinh/">lượng chất nhũ hóa tối thiểu</a>`,
	},
	'KQ-kep': {
		ten: 'Rò rỉ, thẩm thấu trong nhũ tương kép',
		vi: 'Nước và chất tan đi qua lớp dầu giữa hai pha nước do chênh áp suất thẩm thấu.',
		bang: 'Độ dẫn điện pha ngoài tăng; kích thước giọt dầu thay đổi.',
		sua: `Cân bằng thẩm thấu (muối, đường); tăng độ nhớt pha nước bên trong; dùng hạt Pickering ở bề mặt ${nguon('muschiolik2017', 'Muschiolik 2017')}.`,
		kiem: 'Hiệu suất giữ hoạt chất ổn định theo thời gian.',
		them: bai('he-dac-biet', 'Hệ đặc biệt: nhũ tương kép'),
	},
	'KQ-pickering': {
		ten: 'Thiếu hạt hoặc hạt vỡ (Pickering)',
		vi: 'Không đủ hạt phủ bề mặt nên giọt hợp nhau tới khi diện tích vừa đủ cho số hạt có.',
		bang: 'Kích thước giọt tỉ lệ nghịch với nồng độ hạt.',
		sua: `Tăng lượng hạt; kiểm tra hạt còn nguyên sau đồng hóa ${nguon('schroen2024', 'Schroën 2024')}.`,
		kiem: 'Kích thước giảm khi tăng lượng hạt.',
		them: bai('he-dac-biet', 'Hệ đặc biệt: Pickering'),
	},
	'KQ-chua-ro': {
		ten: 'Đo trước khi đoán',
		vi: 'Chưa đủ dữ kiện để chọn mắt xích; sửa theo cảm giác dễ sửa nhầm chỗ.',
		bang: 'Đo d₃₂, d₉₀, zeta, độ nhớt và chụp hiển vi ở vài thời điểm (ngày 0, 1, 7, 30).',
		sua: 'Quay lại cây này khi có số đo.',
		kiem: 'Lặp lại phép đo theo thời gian; so với mẫu đối chứng.',
		them: bai('do-luong', 'Đo lường và đặc trưng nhũ tương'),
	},
};

function dung(goc) {
	if (goc.dataset.daDung) return;
	goc.dataset.daDung = '1';
	const lichSu = [];
	function ve(id) {
		let c = CAU[id];
		if (c && c.chuyen) id = c.chuyen;
		c = CAU[id];
		const vet = lichSu.length
			? `<ol class="cd-vet">${lichSu.map(([, chu]) => `<li>${chu}</li>`).join('')}</ol>`
			: '';
		let than;
		if (c) {
			than = `<p class="cd-hoi">${c.hoi}</p>${c.goiY ? `<p class="cd-goi-y">${c.goiY}</p>` : ''}
<div class="cd-chon">${c.chon.map(([chu, dich], i) => `<button type="button" data-i="${i}">${chu}</button>`).join('')}</div>`;
		} else {
			const k = KQ[id];
			than = `<div class="cd-kq">
<p class="cd-kq-nhan">Mắt xích nhiều khả năng nhất</p>
<p class="cd-kq-ten">${k.ten}</p>
<p>${k.vi}</p>
<dl>
<dt>Bằng chứng cần tìm</dt><dd>${k.bang}</dd>
<dt>Cách sửa</dt><dd>${k.sua}</dd>
<dt>Cách kiểm chứng</dt><dd>${k.kiem}</dd>
<dt>Đọc thêm</dt><dd>${k.them}</dd>
</dl></div>`;
		}
		goc.innerHTML = `<div class="cd-dau"><span class="mt-the">Chẩn đoán</span><strong>Sản phẩm nhũ tương bị hỏng: hỏng ở mắt xích nào?</strong></div>
${vet}${than}
<div class="cd-nut">${lichSu.length ? '<button type="button" class="cd-lui">← Quay lại</button><button type="button" class="cd-lai">Làm lại từ đầu</button>' : ''}</div>
<p class="cd-chu"><span class="nhan nhan-K" title="Sách nền">K</span><span class="nhan nhan-G" title="Suy luận">G</span> Cây này tổng hợp từ cơ chế ở các bài Mất ổn định và Hình thành; là gợi ý để kiểm, chưa phải số liệu thực nghiệm cho một sản phẩm cụ thể.</p>`;
		if (c)
			goc.querySelectorAll('.cd-chon button').forEach((b) =>
				b.addEventListener('click', () => {
					const [chu, dich] = c.chon[Number(b.dataset.i)];
					lichSu.push([id, chu]);
					ve(dich);
				}),
			);
		goc.querySelector('.cd-lui')?.addEventListener('click', () => ve(lichSu.pop()[0]));
		goc.querySelector('.cd-lai')?.addEventListener('click', () => {
			lichSu.length = 0;
			ve('dau');
		});
	}
	ve('dau');
}

function khoiDong() {
	document.querySelectorAll('[data-chan-doan]').forEach(dung);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
