// Đồ thị máy "pickering": ΔE (kT) theo góc tiếp xúc θ, trục y logarit (khung chung: ../do-thi.js).
import { pickering } from '../cong-thuc.js';
import { bieuDo, so, nhanG, nhanN } from '../do-thi.js';

export const macDinh = { r: 50, g: 30, th: 90, T: 25 };

export function ve(v) {
	const { r, g, th, T } = v;
	if (!(r > 0 && g > 0 && th >= 0 && th <= 180 && isFinite(T))) return null;
	const kT = (x) => pickering(r, g, x, T + 273.15).kT;
	// khung trục y cố định 1 đến 10⁷ kT: đổi r hoặc γ thì đường dịch lên xuống thấy được
	const b = bieuDo({ x: { min: 0, max: 180, vach: [0, 30, 60, 90, 120, 150, 180], nhan: 'Góc tiếp xúc θ (độ)' }, y: { min: 1, max: 1e7, log: true, nhan: 'ΔE (kT)' } });
	b.vung(0, 30, 'rất nhạy θ').vung(150, 180, 'rất nhạy θ');
	b.duong([[90, 1], [90, 1e7]], 'dt-duong-phu');
	b.duong([[0, 1000], [180, 1000]], 'dt-duong-phu');
	b.duong(kT);
	const trongKhung = b.diem(th, kT(th));
	const hang = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((x) => [String(x), so(kT(x))]);
	return {
		svg: b.xuat('Năng lượng giải hấp hạt Pickering theo góc tiếp xúc', `Đồ thị trục y logarit: ΔE đối xứng quanh θ bằng 90 độ và cao nhất ở 90 độ, rơi nhanh khi θ tiến về 0 hoặc 180 độ. Điểm của bạn: θ = ${so(th)} độ, ΔE = ${so(kT(th))} kT.`),
		bang: { cot: ['θ (độ)', 'ΔE (kT)'], hang },
		chuThich: `Đường là chính công thức ΔE = πr²γ(1 − |cos θ|)² của máy với r = ${so(r)} nm, γ = ${so(g)} mN/m. Nét đứng đánh dấu θ = 90°, nơi ΔE cao nhất; nét ngang là mức hàng nghìn kT, trên đó hạt gần như bám vĩnh viễn ${nhanG()}. Vùng xám (θ dưới 30° hoặc trên 150°): sai số nhỏ ở θ làm ΔE đổi nhiều lần ${nhanG()}. ${trongKhung ? '' : 'Điểm của bạn nằm ngoài khung đồ thị (ΔE dưới 1 kT). '}Chỉ cho hạt cầu cứng, giọt lớn hơn hạt rất nhiều ${nhanN('schroen2024', 'Schroën 2024')}; đồ thị không dùng được cho hạt mềm vì chúng không có góc tiếp xúc cố định ${nhanN('murray2019', 'Murray 2019')}.`,
		diem: { x: th, y: kT(th) },
	};
}

export const doanTruoc = {
	cauHoi: 'Giữ nguyên bán kính hạt và sức căng dầu–nước, hạt Pickering bám chặt nhất vào mặt phân cách dầu–nước khi góc tiếp xúc θ gần giá trị nào?',
	lua: ['Gần 0°', 'Gần 90°', 'Gần 180°'],
	dung: 1,
	giaiThich: 'ΔE tỉ lệ với (1 − |cos θ|)², lớn nhất khi cos θ = 0, tức θ = 90°: hạt thấm ướt như nhau bởi dầu và nước nên khó rời mặt phân cách nhất.',
};
