// Khung đồ thị dùng chung cho các máy tính (gói T2). Không thư viện ngoài, mỗi đồ thị là SVG tự vẽ.
//
// CÁCH THÊM MỘT ĐỒ THỊ CHO MÁY TÍNH <id> (không phải sửa may-tinh.js, không sửa file này):
//   1. Tạo public/do-thi/<id>.js (id là khóa trong MAY của may-tinh.js, ví dụ 'stokes'). Tối đa 6 KB.
//   2. Tạo scripts/kiem-do-thi/<id>.mjs (phép kiểm riêng; mẫu: scripts/kiem-do-thi/stokes.mjs).
//   3. npm run kiem && npm run build. Máy in tự đưa <id> vào public/do-thi/index.json (file sinh tự động, đã gitignore).
//
// Hợp đồng của file public/do-thi/<id>.js:
//   export const macDinh = { d: 1, ... };       // giá trị mặc định của các ô nhập, TRÙNG với may-tinh.js (tên ô = thuộc tính name)
//   export function ve(dauVao) { return { svg, bang: { cot: [...], hang: [[...], ...] }, chuThich, diem: { x, y } }; }
//        // dauVao: { tên ô: số } đã đọc dấu phẩy thập phân. Nhập sai (NaN, ≤ 0 ...) thì trả null.
//        // svg: chuỗi do bieuDo(...).xuat(...) tạo; bang: bảng số liệu cho người đọc màn hình; chuThich: HTML ngắn (thoát ký tự).
//        // diem: tọa độ điểm "của bạn" trên đồ thị, để phép kiểm đối chiếu với công thức của máy.
//   export const doanTruoc = { cauHoi, lua: [a, b, c], dung: 0 | 1 | 2, giaiThich };
//        // MỘT câu hỏi định tính (không đòi con số) hiện trước đồ thị; chọn xong hoặc bấm "Bỏ qua" thì đồ thị mới hiện.
//
// Khoảng trục nên cố định theo vùng có dữ liệu của máy (ví dụ theo macDinh), không co giãn theo đường vừa vẽ: nếu không, đổi một ô nhập thì đường và điểm
// dịch cùng nhau và người dùng không thấy tác động. Đổi tên trục theo chiều (nổi/lắng...) khi dấu của kết quả đổi.
// Luật (xem bản thiết kế GĐ2): đồ thị vẽ đúng công thức của chính máy, quét một biến quanh giá trị người dùng nhập,
// điểm của người dùng được làm nổi; mốc [N] chỉ lấy từ con số đã là [N] trên web; vùng không có dữ liệu thì tô xám
// và ghi "ngoài vùng có dữ liệu", không ngoại suy; màu chỉ dùng lớp dt-* (giữ nguyên ở nền sáng và nền tối).

const BASE = new URL('.', import.meta.url).pathname; // '/nhu-tuong/'
const thoat = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
/** Ghi số kiểu Việt (dấu phẩy thập phân). */
export const so = (x, chuSo = 3) => Number(x).toLocaleString('vi-VN', { maximumSignificantDigits: chuSo });
/** Đọc một ô nhập, chấp nhận dấu phẩy thập phân (giống may-tinh.js). */
export const doc = (v) => parseFloat(String(v).replace(',', '.'));
/** Huy hiệu N có liên kết tới thẻ nguồn (giống nhãn trong bài). */
export const nhanN = (khoa, ten) =>
	`<span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan"><a class="nhan-nguon" href="${BASE}nguon/#${khoa}">${thoat(ten)}</a></span></span>`;

/** Huy hiệu K (sách nền, chờ đối chiếu trang) cho chú thích có ranh giới lấy từ ghi chú [K] của máy. */
export const nhanK = () => '<span class="nhan-cum"><span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span></span>';
/** Huy hiệu G (suy luận hoặc giả thuyết). */
export const nhanG = () => '<span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span>';
const lam = (v) => Math.round(v * 10) / 10;
const MU = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** Nhãn vạch: số thường; trục log từ 1000 trở lên ghi 10³, 10⁴… cho gọn. */
const nhanVach = (v, log) => (log && v >= 1000 ? '10' + String(Math.round(Math.log10(v))).replace(/\d/g, (c) => MU[c]) : so(v));
let demSvg = 0;

/** Chọn các vạch chia đẹp (1, 2, 5 × 10^k) cho trục tuyến tính. */
function vachTuyenTinh(min, max) {
	const buoc0 = (max - min) / 4;
	const mu = Math.pow(10, Math.floor(Math.log10(buoc0)));
	const buoc = [1, 2, 5, 10].map((k) => k * mu).find((b) => b >= buoc0);
	const ds = [];
	for (let v = Math.ceil(min / buoc) * buoc; v <= max + buoc * 1e-9; v += buoc) ds.push(Math.abs(v) < buoc * 1e-9 ? 0 : v);
	return ds;
}

/**
 * Tạo khung đồ thị. x, y = { min, max, log?: boolean, nhan: 'Tên trục (đơn vị)' }.
 * Trả về các hàm: vung, duong, diem, moc, xuat. Gọi theo thứ tự bất kỳ; thứ tự vẽ cố định (vùng, lưới, đường, mốc, điểm).
 */
export function bieuDo({ x, y, rong = 380, cao = 250 }) {
	const L = 66, R = 14, T = 14, B = 52;
	const w = rong - L - R, h = cao - T - B;
	const f = (t, v) => (t.log ? Math.log10(v) : v);
	const px = (v) => L + ((f(x, v) - f(x, x.min)) / (f(x, x.max) - f(x, x.min))) * w;
	const py = (v) => T + h - ((f(y, v) - f(y, y.min)) / (f(y, y.max) - f(y, y.min))) * h;
	const trong = (xv, yv) => xv >= x.min && xv <= x.max && yv >= y.min && yv <= y.max && isFinite(xv) && isFinite(yv);
	const vach = (t) => {
		if (t.vach) return t.vach; // vạch chia tự chọn, ví dụ [0, 30, 60, 90, 120, 150, 180]
		if (!t.log) return vachTuyenTinh(t.min, t.max);
		const ds = [];
		for (let k = Math.ceil(Math.log10(t.min) - 1e-9); k <= Math.floor(Math.log10(t.max) + 1e-9); k++) ds.push(Math.pow(10, k));
		return ds;
	};
	const vungs = [], duongs = [], mocs = [], diems = [];
	const b = {
		px, py, trong,
		/** Tô xám khoảng x0..x1 (cắt theo trục) và ghi nhãn ngắn, ví dụ 'ngoài vùng có dữ liệu'. */
		vung(x0, x1, nhan) {
			const a = px(Math.max(x0, x.min)), c = px(Math.min(x1, x.max));
			if (!(c > a)) return b;
			vungs.push(`<rect class="dt-ngoai" x="${lam(a)}" y="${T}" width="${lam(c - a)}" height="${h}"/>`);
			if (nhan) {
				// vùng hẹp hơn chữ: bám mép trái (hoặc mép phải nếu vùng nằm sát bên phải) thay vì căn giữa, để chữ không tràn ra nhãn trục
				const roi = nhan.length * 7.6 > c - a;
				const sat = roi && a > L + w / 2;
				const xv = roi ? (sat ? c - 4 : a + 4) : (a + c) / 2;
				vungs.push(`<text class="dt-chu dt-chu-nho" x="${lam(xv)}" y="${T + 16}" text-anchor="${roi ? (sat ? 'end' : 'start') : 'middle'}">${thoat(nhan)}</text>`);
			}
			return b;
		},
		/** Vẽ đường y = g(x) (hàm) hoặc đi qua mảng [[x, y], ...]; đoạn ra ngoài trục thì bỏ, không kẻ nối. */
		duong(g, lop = 'dt-duong') {
			const pts = Array.isArray(g)
				? g
				: Array.from({ length: 81 }, (_, i) => {
						const t = i / 80;
						const xv = x.log ? Math.pow(10, f(x, x.min) + t * (f(x, x.max) - f(x, x.min))) : x.min + t * (x.max - x.min);
						return [xv, g(xv)];
					});
			let d = '', len = false;
			for (const [xv, yv] of pts) {
				if (!trong(xv, yv)) { len = false; continue; }
				d += `${len ? 'L' : 'M'}${lam(px(xv))} ${lam(py(yv))}`;
				len = true;
			}
			if (d) duongs.push(`<path class="${lop}" d="${d}"/>`);
			return b;
		},
		/** Mốc có nguồn [N] (chỉ dùng con số đã là [N] trên web). Trả false nếu nằm ngoài trục. */
		moc(xv, yv, nhan) {
			if (!trong(xv, yv)) return false;
			const cx = lam(px(xv)), cy = lam(py(yv));
			mocs.push(`<path class="dt-moc" d="M${cx} ${cy - 6}L${cx + 6} ${cy}L${cx} ${cy + 6}L${cx - 6} ${cy}Z"/>`);
			if (nhan) mocs.push(`<text class="dt-chu" x="${cx + (cx > rong * 0.6 ? -9 : 9)}" y="${cy - 8}" text-anchor="${cx > rong * 0.6 ? 'end' : 'start'}">${thoat(nhan)}</text>`);
			return true;
		},
		/** Chấm số đo của người dùng (không phải điểm "của bạn", không phải mốc [N]): chấm nhỏ có viền. Trả false nếu nằm ngoài trục. */
		cham(xv, yv) {
			if (!trong(xv, yv)) return false;
			mocs.push(`<circle class="dt-cham" cx="${lam(px(xv))}" cy="${lam(py(yv))}" r="4"/>`);
			return true;
		},
		/** Điểm "của bạn": chấm to, hai vạch dóng về trục, nhãn. Trả false nếu nằm ngoài trục. */
		diem(xv, yv, nhan = 'Của bạn') {
			if (!trong(xv, yv)) return false;
			const cx = lam(px(xv)), cy = lam(py(yv));
			diems.push(`<path class="dt-dong" d="M${cx} ${T + h}V${cy}H${L}"/>`);
			diems.push(`<circle class="dt-diem" cx="${cx}" cy="${cy}" r="5.5"/>`);
			diems.push(`<text class="dt-chu dt-chu-dam" x="${cx + (cx > rong * 0.6 ? -10 : 10)}" y="${cy + (cy < T + 24 ? 20 : -9)}" text-anchor="${cx > rong * 0.6 ? 'end' : 'start'}">${thoat(nhan)}</text>`);
			return true;
		},
		/** Ghép thành chuỗi <svg>. tieuDe và moTa là chữ cho người đọc màn hình (bắt buộc). */
		xuat(tieuDe, moTa) {
			const id = `dt${++demSvg}`;
			const luoi = [];
			for (const v of vach(x)) luoi.push(`<path class="dt-luoi" d="M${lam(px(v))} ${T}V${T + h}"/><text class="dt-chu" x="${lam(px(v))}" y="${T + h + 18}" text-anchor="middle">${nhanVach(v, x.log)}</text>`);
			for (const v of vach(y)) luoi.push(`<path class="dt-luoi" d="M${L} ${lam(py(v))}H${L + w}"/><text class="dt-chu" x="${L - 6}" y="${lam(py(v)) + 5}" text-anchor="end">${nhanVach(v, y.log)}</text>`);
			return `<svg class="dt-svg" viewBox="0 0 ${rong} ${cao}" width="480" role="img" aria-labelledby="${id}t ${id}m"><title id="${id}t">${thoat(tieuDe)}</title><desc id="${id}m">${thoat(moTa)}</desc>${vungs.join('')}${luoi.join('')}<path class="dt-truc" d="M${L} ${T}V${T + h}H${L + w}"/>${duongs.join('')}${mocs.join('')}${diems.join('')}<text class="dt-chu" x="${lam(L + w / 2)}" y="${cao - 6}" text-anchor="middle">${thoat(x.nhan)}</text><text class="dt-chu" transform="translate(13 ${lam(T + h / 2)}) rotate(-90)" text-anchor="middle">${thoat(y.nhan)}</text></svg>`;
		},
	};
	return b;
}

function bangHtml({ cot, hang }) {
	return `<table><thead><tr>${cot.map((c) => `<th scope="col">${thoat(c)}</th>`).join('')}</tr></thead><tbody>${hang.map((r) => `<tr>${r.map((o) => `<td>${thoat(o)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function gan(el, mod) {
	const form = el.querySelector('form');
	const kq = el.querySelector('.mt-ket-qua');
	if (!form || !kq || el.querySelector('.do-thi')) return;
	const dt = document.createElement('div');
	dt.className = 'do-thi not-content';
	const dt0 = mod.doanTruoc;
	dt.innerHTML = `${
		dt0
			? `<div class="dt-doan" role="group" aria-labelledby="dt-hoi-${el.dataset.mayTinh}"><p class="dt-hoi" id="dt-hoi-${el.dataset.mayTinh}"><strong>Đoán trước khi xem đồ thị.</strong> ${thoat(dt0.cauHoi)}</p><div class="dt-lua">${dt0.lua
					.map((l, i) => `<button type="button" class="dt-nut" data-i="${i}">${thoat(l)}</button>`)
					.join('')}<button type="button" class="dt-nut dt-bo-qua">Bỏ qua, xem đồ thị</button></div><p class="dt-dap" aria-live="polite"></p></div>`
			: ''
	}<div class="dt-hinh"${dt0 ? ' hidden' : ''}><div class="dt-khung"></div><p class="dt-chu-thich"></p><details class="dt-bang"><summary>Bảng số liệu của đồ thị</summary><div class="dt-bang-trong"></div></details></div>`;
	kq.after(dt);
	const khung = dt.querySelector('.dt-khung'), ct = dt.querySelector('.dt-chu-thich'), bang = dt.querySelector('.dt-bang-trong');
	const ve = () => {
		const dauVao = {};
		for (const e of form.elements) if (e.name) dauVao[e.name] = doc(e.value);
		let r = null;
		try { r = mod.ve(dauVao); } catch (_) {}
		if (!r) {
			khung.innerHTML = '';
			bang.innerHTML = '';
			ct.textContent = 'Nhập số hợp lệ ở máy tính phía trên để xem đồ thị.';
			return;
		}
		khung.innerHTML = r.svg;
		bang.innerHTML = bangHtml(r.bang);
		ct.innerHTML = r.chuThich || '';
	};
	form.addEventListener('input', ve);
	ve();
	if (dt0) {
		const dap = dt.querySelector('.dt-dap');
		const nut = [...dt.querySelectorAll('.dt-nut')];
		const hien = () => (dt.querySelector('.dt-hinh').hidden = false);
		nut.forEach((n) =>
			n.addEventListener('click', () => {
				if (n.classList.contains('dt-bo-qua')) return (nut.forEach((x) => (x.disabled = true)), hien());
				const i = Number(n.dataset.i);
				nut.forEach((x) => (x.disabled = true));
				n.classList.add(i === dt0.dung ? 'dt-dung' : 'dt-sai');
				nut[dt0.dung].classList.add('dt-dung');
				dap.textContent = `${i === dt0.dung ? 'Đúng.' : 'Chưa đúng.'} ${dt0.giaiThich}`;
				hien();
			}),
		);
	}
}

async function khoiDong() {
	const may = [...document.querySelectorAll('.may-tinh[data-may-tinh]')];
	if (!may.length) return;
	let ds = [];
	try {
		ds = await (await fetch(new URL('./do-thi/index.json', import.meta.url))).json();
	} catch (_) {
		return;
	}
	for (const el of may) {
		const id = el.dataset.mayTinh;
		if (!ds.includes(id)) continue;
		import(`./do-thi/${id}.js`)
			.then((mod) => {
				// may-tinh.js dựng máy trước (đánh dấu data-da-dung); nếu chưa kịp thì đợi
				if (el.dataset.daDung) return gan(el, mod);
				const mo = new MutationObserver(() => el.dataset.daDung && (mo.disconnect(), gan(el, mod)));
				mo.observe(el, { attributes: true });
			})
			.catch(() => {});
	}
}
// phép kiểm chạy trong Node (không có document) chỉ cần các hàm vẽ
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
	else khoiDong();
}
