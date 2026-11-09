// Máy đo cỡ hạt dùng chung: nhiễu xạ laser và DLS, mỗi máy có DẢI MÁY (theo hãng) và DẢI TIN CẬY (theo tổng quan).
// Đo là ĐỌC mẫu, không làm đổi mẫu: các nhiệm vụ chấm sao theo d32 của mô hình, không phụ thuộc máy nào được chọn.
// Chỉ hàm thuần, không chạm DOM.
import { THIET_BI } from './thiet-bi.js';
import { dacTrungPhanBo } from './mo-hinh.js';

const f = (x) => x.toLocaleString('vi-VN', { maximumSignificantDigits: 3 });
/** 0,0003 → "0,3 nm"; 0,01 → "0,01 µm"; 3500 → "3.500 µm". */
export const chuKichThuoc = (um) => (um < 0.01 ? `${f(um * 1000)} nm` : `${f(um)} µm`);
export const chuDai = ([a, b]) => {
	const sa = chuKichThuoc(a);
	const sb = chuKichThuoc(b);
	const dv = (s) => s.slice(s.lastIndexOf(' ') + 1);
	return `${dv(sa) === dv(sb) ? sa.slice(0, sa.lastIndexOf(' ')) : sa}–${sb}`; // 0,01–3.500 µm; 0,3 nm–10 µm
};

/** Trung bình mô men của phân bố log-chuẩn: D[p,q] = d32·exp((p+q−5)σ²/2). Dùng để kiểm dacTrungPhanBo, không hiện D[6,5]. */
export const momen = (d32, sigma, p, q) => d32 * Math.exp(((p + q - 5) * sigma * sigma) / 2);

export const DONG_PHA_LOANG = 'Mẫu phải pha loãng trước khi đo (cả hai máy).';
const GIAI_THICH_Z =
	'Máy DLS thật báo Z-average, là trung bình điều hòa theo cường độ tán xạ (ISO 22412), không phải d₃₂. Với mẫu có phân bố rộng, Z-average không so trực tiếp được với d₃₂ của máy nhiễu xạ laser. Mô phỏng này chưa tính Z-average nên không in số cỡ hạt.';

/**
 * Đo một mẫu bằng một máy.
 * @param {{d32?:number, sigma?:number, dTheTich?:number, nhan?:string, nguon?:string}} mau
 *   `{d32, sigma}` (bàn cơ bản, [T]) hoặc `{dTheTich}` (Mayonnaise: chỉ có đường kính trung bình theo thể tích, [N])
 * @param {'nhieuXaLaser'|'dls'} idMay
 * @returns {{doDuoc:boolean, canhBao:{muc:'vang'|'xam', chu:string}[], so:object, ghiChu:string[], nhan:string, nguon:string|null, may:object}}
 */
export function doHat(mau, idMay) {
	const may = THIET_BI[idMay];
	const kq = { doDuoc: false, canhBao: [], so: {}, ghiChu: [], nhan: mau?.nhan ?? 'T', nguon: mau?.nguon ?? null, may };
	if (!may?.daiMay) {
		kq.canhBao.push({ muc: 'vang', chu: 'Máy này không có trong bảng thông số.' });
		return kq;
	}
	let lo;
	let hi;
	let pb = null;
	if (Number.isFinite(mau?.d32) && Number.isFinite(mau?.sigma)) {
		pb = dacTrungPhanBo(mau.d32, mau.sigma);
		lo = pb.dv10;
		hi = pb.dv90;
	} else if (Number.isFinite(mau?.dTheTich)) {
		lo = hi = mau.dTheTich;
	} else {
		kq.canhBao.push({ muc: 'vang', chu: 'Bàn này chưa tính cỡ giọt, nên máy đo chưa có gì để đọc.' });
		return kq;
	}
	const [a, b] = may.daiMay;
	const [ta, tb] = may.daiTinCay;
	kq.ghiChu.push(DONG_PHA_LOANG);
	if (hi < a || lo > b) {
		kq.canhBao.push({ muc: 'vang', chu: `Giọt cỡ này nằm ngoài dải đo của máy (${chuDai(may.daiMay)}). Thử máy kia.` });
		return kq;
	}
	kq.doDuoc = true;
	if (lo < a) kq.canhBao.push({ muc: 'vang', chu: `Một phần phân bố (giọt dưới ${chuKichThuoc(a)}) nằm ngoài dải máy, kết quả bỏ sót phần đó.` });
	if (hi > b) kq.canhBao.push({ muc: 'vang', chu: `Một phần phân bố (giọt trên ${chuKichThuoc(b)}) nằm ngoài dải máy, kết quả bỏ sót phần đó.` });
	if (!kq.canhBao.length && (lo < ta || hi > tb)) {
		kq.canhBao.push({ muc: 'xam', chu: 'Ngoài vùng đo tin cậy theo tổng quan, nên kiểm lại bằng máy khác hoặc kính hiển vi.' });
	}
	if (idMay === 'nhieuXaLaser') {
		if (pb) kq.so = { d32: pb.d32, d43: pb.d43, dv10: pb.dv10, dv50: pb.dv50, dv90: pb.dv90, span: (pb.dv90 - pb.dv10) / pb.dv50 };
		else kq.so = { dTheTich: mau.dTheTich };
	} else {
		// DLS: không in số cỡ hạt (Z-average chưa tính được, quan hệ Z với D[6,5] không có nguồn)
		kq.so = {};
		kq.ghiChu.push(GIAI_THICH_Z + (pb ? ` Mẫu của bạn có phân bố rộng (σ = ${f(mau.sigma)}).` : ''));
		if (!pb) kq.canhBao.push({ muc: 'xam', chu: 'Mẫu này chỉ có một số trung bình theo thể tích, không có phân bố, nên không quy đổi được sang Z-average.' });
	}
	return kq;
}
