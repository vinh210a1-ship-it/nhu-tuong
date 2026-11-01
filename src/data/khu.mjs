// Bốn khu kiến thức: tên, màu, biểu tượng và danh sách bài (theo thứ tự đọc).
// Dùng cho thanh bên (astro.config.mjs), dải đầu bài (PageTitle) và trang chủ.
// ten = tên ngắn hiện ở thanh bên; cauHoi = "Bài này trả lời: ..." ở đầu bài.
import { CHANG, MO_RONG } from './chang.mjs';

export const KHU = {
	'nhu-tuong': {
		ten: 'Nhũ tương',
		mau: 'var(--chang-1)',
		icon: 'giot',
		bai: [...CHANG.map((c) => ({ ...c, ten: `${c.so}. ${c.ten}` })), ...MO_RONG],
	},
	'chat-beo': {
		ten: 'Chất béo',
		mau: 'var(--khu-chat-beo)',
		icon: 'chat-beo',
		bai: [
			{ slug: 'cau-truc-triglyceride-va-acid-beo', ten: 'Cấu trúc TAG và acid béo', cauHoi: 'TAG và vị trí sn quyết định tính chất chất béo thế nào; các chỉ số IV, SV, PV, AV' },
			{ slug: 'da-hinh-ket-tinh-va-ban-do-pha', ten: 'Đa hình và kết tinh', cauHoi: 'Dạng α, β′, β khác nhau ra sao; tempering sô-cô-la, bloom, trộn lẫn TAG' },
			{ slug: 'sfc-mang-tinh-the-oleogel', ten: 'SFC, mạng tinh thể, oleogel', cauHoi: 'Vì sao SFC chưa đủ; mạng tinh thể béo giữ dầu thế nào; oleogel đang ở đâu' },
			{ slug: 'phan-doan-interesterification-hydro-hoa', ten: 'Biến tính chất béo', cauHoi: 'Phân đoạn, interesterification, hydro hóa thay đổi gì và chọn thế nào' },
			{ slug: 'oxy-hoa-lipid-chong-oxy-hoa-han-su-dung', ten: 'Oxy hóa và hạn dùng', cauHoi: 'Oxy hóa lipid trong dầu khối và nhũ tương, chất chống oxy hóa, ước lượng hạn dùng và các bẫy' },
			{ slug: 'chat-beo-dac-thu-va-chat-beo-trong-nhu-tuong', ten: 'Chất béo đặc thù, béo trong nhũ tương', cauHoi: 'Bơ ca cao, cọ, lauric, béo sữa, MCT, PUFA; tinh thể béo trong giọt và partial coalescence' },
		],
	},
	'chat-nhu-hoa': {
		ten: 'Chất nhũ hóa',
		mau: 'var(--khu-chat-nhu-hoa)',
		icon: 'chat-nhu-hoa',
		bai: [
			{ slug: 'nen-tang-vat-ly-hoa-be-mat', ten: 'Nền tảng hóa lý bề mặt', cauHoi: 'Sức căng bề mặt, Gibbs, CMC, HLB, CPP, Bancroft và giới hạn của chúng' },
			{ slug: 'cac-nhom-chat-nhu-hoa-thuc-pham', ten: 'Các nhóm chất nhũ hóa', cauHoi: 'Lecithin, MDG, E472, SSL, polysorbate, Span, este sucrose, PGPR, saponin: cấu trúc và cơ chế' },
			{ slug: 'protein-nhu-hoa-va-canh-tranh-hap-phu', ten: 'Protein và cạnh tranh hấp phụ', cauHoi: 'Protein nhũ hóa thế nào; khi nào chất nhũ hóa phân tử nhỏ đẩy protein khỏi bề mặt' },
			{ slug: 'ma-ins-quy-dinh-an-toan', ten: 'Mã INS/E, quy định, an toàn', cauHoi: 'Mã INS/E, kết luận EFSA và ADI, văn bản Việt Nam, đọc nghiên cứu an toàn thế nào' },
			{ slug: 'ung-dung-theo-san-pham-va-quy-trinh-chon-chat-nhu-hoa', ten: 'Ứng dụng và cách chọn', cauHoi: 'Chọn chất nhũ hóa cho kem lạnh, bánh mì, W/O, nhũ tương kép, đồ uống' },
		],
	},
	'chat-on-dinh': {
		ten: 'Chất ổn định',
		mau: 'var(--khu-chat-on-dinh)',
		icon: 'chat-on-dinh',
		bai: [
			{ slug: 'co-che-nen-tang', ten: 'Cơ chế nền tảng', cauHoi: 'Hydrocolloid ổn định hệ bằng những cách nào; depletion flocculation, yield stress, tương tác với protein' },
			{ slug: 'xanthan-va-galactomannan', ten: 'Xanthan và galactomannan', cauHoi: 'Xanthan, guar, LBG, tara: cấu trúc, ảnh hưởng của muối và nhiệt, hiệp lực' },
			{ slug: 'carrageenan-va-he-sua', ten: 'Carrageenan và hệ sữa', cauHoi: 'Carrageenan κ, ι, λ tương tác với casein micelle; sữa cacao' },
			{ slug: 'alginate-pectin-gellan', ten: 'Alginate, pectin, gellan', cauHoi: 'Gel ion hóa, pectin trong sữa acid, gellan giữ hạt lơ lửng' },
			{ slug: 'gum-arabic-gelatin-tinh-bot-cellulose', ten: 'Gum arabic, gelatin, tinh bột, cellulose', cauHoi: 'Gum arabic, gelatin, tinh bột biến tính, MCC và CMC' },
			{ slug: 'quy-dinh-ins-e', ten: 'Mã INS/E và quy định', cauHoi: 'Kết luận EFSA và JECFA đã xác minh, và những phần còn thiếu' },
		],
	},
	'thuc-pham': {
		ten: 'Thực phẩm',
		mau: 'var(--khu-thuc-pham)',
		icon: 'thuc-pham',
		bai: [
			{ slug: 'giu-nuoc-thit-phosphat-muoi-ph', ten: 'Giữ nước thịt: phosphat, muối, pH', cauHoi: 'Phosphat và muối giữ nước cho thịt, surimi bằng cơ chế nào; vì sao pH so với điểm đẳng điện là then chốt' },
			{ slug: 'bao-quan-hoat-do-nuoc-va-han-su-dung', ten: 'Bảo quản và hoạt độ nước', cauHoi: 'Giới hạn aw, pH, nhiệt độ của vi sinh vật gây bệnh; axit yếu, nitrit, sulfit và hàng rào kép' },
			{ slug: 'maillard-caramel-acrylamide', ten: 'Maillard, caramel, acrylamide', cauHoi: 'Nhiệt độ, pH, aw ảnh hưởng nâu hóa thế nào; giảm acrylamide bằng những đòn bẩy nào' },
			{ slug: 'tinh-bot-ho-hoa-thoai-hoa', ten: 'Tinh bột: hồ hóa, thoái hóa', cauHoi: 'Hồ hóa và thoái hóa xảy ra thế nào; đường, muối và tinh bột biến tính thay đổi gì' },
			{ slug: 'protein-bien-tinh-gel-hoa-va-enzym', ten: 'Protein, gel và enzym', cauHoi: 'Protein biến tính và tạo gel theo hai bước nào; muối, pH, transglutaminase và các enzym thực phẩm' },
			{ slug: 'chat-tao-ngot-mau-dieu-vi', ten: 'Tạo ngọt, màu, điều vị', cauHoi: 'Chất tạo ngọt, glutamat, anthocyanin: độ ổn định trong nền và ADI đã kiểm' },
			{ slug: 'qua-trinh-nhiet-lanh-say-ep-dun', ten: 'Thanh trùng, đông lạnh, sấy, ép đùn', cauHoi: 'Phương trình chủ đạo của từng quá trình: D, z, F; Tg′; đẳng nhiệt hấp phụ; thông số ép đùn' },
			{ slug: 'quy-dinh-jecfa-efsa-da-kiem', ten: 'ADI phụ gia đã kiểm', cauHoi: 'ADI/MTDI của phosphat, chất bảo quản, chống oxy hóa, chất tạo ngọt đã đọc tại JECFA và EFSA' },
		],
	},
	'duoc-pham': {
		ten: 'Dược phẩm',
		mau: 'var(--khu-duoc-pham)',
		icon: 'duoc',
		bai: [
			{ slug: 'ta-duoc-chuc-nang-va-tuong-ky', ten: 'Tá dược: chức năng, tương kỵ', cauHoi: 'Tá dược làm những việc gì; vì sao không "trơ"; tương kỵ thật như Maillard với lactose, peroxide trong polysorbate' },
			{ slug: 'hoa-tan-sinh-kha-dung-bcs', ten: 'Hòa tan, sinh khả dụng, BCS', cauHoi: 'Noyes–Whitney, phân loại BCS, chỉ tiêu hòa tan và f2, mô hình giải phóng, cách tăng độ tan' },
			{ slug: 'dang-bao-che-long-va-ban-ran', ten: 'Dạng lỏng và bán rắn', cauHoi: 'Nhũ tương, kem, thuốc mỡ, hỗn dịch, nhũ tương tiêm: chỉ tiêu chất lượng và vi cấu trúc' },
			{ slug: 'he-phan-tan-nano', ten: 'Hệ phân tán nano', cauHoi: 'Nanoemulsion, SEDDS, liposome, LNP, tinh thể nano, cyclodextrin, phân tán rắn vô định hình' },
			{ slug: 'dang-ran-vien-nen-tao-hat', ten: 'Dạng rắn: tạo hạt, dập viên', cauHoi: 'Dòng chảy bột, tạo hạt, dập viên, bôi trơn, rã, mài mòn, bao phim, SUPAC-IR' },
			{ slug: 'on-dinh-han-dung-ich', ten: 'Độ ổn định và hạn dùng', cauHoi: 'Điều kiện thử ICH, vùng khí hậu IVb, Arrhenius và ASAP, các đường phân hủy' },
			{ slug: 'qbd-scale-up-quy-trinh', ten: 'QbD và scale-up', cauHoi: 'QTPP, CQA, CPP, design space theo ICH Q8 và các mức thay đổi khi tăng quy mô' },
		],
		phu: [{ slug: 'thuat-ngu-duoc-bao-che', ten: 'Thuật ngữ bào chế' }],
	},
};
export const THU_TU_KHU = ['nhu-tuong', 'chat-beo', 'chat-nhu-hoa', 'chat-on-dinh', 'thuc-pham', 'duoc-pham'];
