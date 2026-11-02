// Đổi nhãn tin cậy trong bài ([N: @khoa], [T], [K], [G: ghi chú], nhãn ghép [K; N: @khoa])
// thành huy hiệu màu; mỗi @khoa thành đường dẫn tới thẻ nguồn trên trang Nguồn.
//
// Quy tắc "số liệu sách nền chờ đối chiếu" (anh Vinh duyệt 2026-11-01): khối nội dung
// (đoạn, mục danh sách, dòng bảng) chỉ có nhãn K mà chứa số kèm đơn vị thì tạm ẩn,
// thay bằng một dòng báo. Bật/tắt bằng tùy chọn anSoSachNen trong astro.config.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { visit, SKIP } from 'unist-util-visit';

const NHAN_RE = /\[(N|K|T|G)(?:[:;][^\]\n]*)?\]/g;
const TEN = {
	N: 'Có nguồn',
	T: 'Tính minh họa',
	K: 'Sách nền, chờ đối chiếu trang',
	G: 'Suy luận hoặc giả thuyết',
};
// số kèm đơn vị đo: dấu hiệu "con số" trong một khối
// (mở rộng 2026-11-01 khi thêm khu thực phẩm, dược: thêm mL, số thập phân, giá trị pH, aw, pKa không có đơn vị)
export const SO_DON_VI =
	/\d[\d.,]*\s*(?:°C|%|mg|g\/|µm|μm|nm|mN|kg|MPa|bar|mPa|kT|kJ|m\/s|rpm|phút|giờ|ngày|mL)|\d+,\d+|\b(?:pH|pHu|aw|pKa)\b[^\d\n]{0,12}\d/;

let NGUON = null;
function nguon() {
	if (!NGUON) {
		const ds = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nguon/nguon.json'), 'utf8'));
		NGUON = new Map(ds.map((e) => [e.khoa, e]));
	}
	return NGUON;
}

const esc = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function tenNgan(e) {
	const dau = (e.trich_dan.match(/^[^\s(.,:]+/) || [e.khoa])[0];
	const hauTo = /\d{4}([a-z])$/.exec(e.khoa);
	return `${dau}${e.nam ? ' ' + e.nam : ''}${hauTo ? hauTo[1] : ''}`;
}

// "[N: @a, @b; K]" -> [{ma:'N', phan:'@a, @b'}, {ma:'K', phan:''}]
export function tachNhan(nhan) {
	const trong = nhan.slice(1, -1);
	const doan = [];
	for (const s of trong.split(';')) {
		const m = /^\s*(N|K|T|G)(?=$|[\s:])\s*:?\s*(.*)$/s.exec(s);
		if (m) doan.push({ ma: m[1], phan: m[2].trim() });
		else if (doan.length) doan[doan.length - 1].phan += (doan.at(-1).phan ? '; ' : '') + s.trim();
	}
	return doan;
}

function htmlPhan(phan, base, thieu) {
	let html = esc(phan);
	html = html.replace(/@([a-z][a-z0-9]*(?:-[a-z0-9]+)*)/g, (_, k) => {
		const e = nguon().get(k);
		if (!e) {
			thieu.add(k);
			return esc('@' + k);
		}
		return `<a class="nhan-nguon" href="${base}/nguon/#${k}" title="${esc(e.trich_dan)}">${esc(tenNgan(e))}</a>`;
	});
	html = html.replace(
		/PubMed (\d{6,9})/g,
		(_, id) => `<a class="nhan-nguon" href="https://pubmed.ncbi.nlm.nih.gov/${id}/">PubMed ${id}</a>`,
	);
	return html;
}

export function htmlNhan(nhan, base, thieu = new Set()) {
	const doan = tachNhan(nhan);
	const ben = doan
		.map(
			({ ma, phan }) =>
				`<span class="nhan nhan-${ma}" title="${TEN[ma]}">${ma}</span>` +
				(phan ? `<span class="nhan-phan">${htmlPhan(phan, base, thieu)}</span>` : ''),
		)
		.join('');
	return `<span class="nhan-cum">${ben}</span>`;
}

function chuoi(node) {
	if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'inlineMath') return node.value;
	return (node.children || []).map(chuoi).join(' ');
}

function maTrong(s) {
	const ma = new Set();
	for (const m of s.matchAll(NHAN_RE)) for (const d of tachNhan(m[0])) ma.add(d.ma);
	return ma;
}

export default function remarkNhan({ base = '', anSoSachNen = true } = {}) {
	return (tree, file) => {
		const thieu = new Set();
		const an = [];

		// 1) Ẩn khối chỉ có nhãn K mà chứa số liệu
		if (anSoSachNen) {
			visit(tree, ['paragraph', 'listItem', 'tableRow'], (node) => {
				const s = chuoi(node);
				const ma = maTrong(s);
				if (ma.has('K') && !ma.has('N') && !ma.has('T') && SO_DON_VI.test(s)) {
					an.push(s.slice(0, 120));
					const bao = {
						type: 'html',
						value:
							'<span class="an-so-lieu">Đoạn này có số liệu lấy từ sách nền, đang chờ đối chiếu số trang nên tạm ẩn. <span class="nhan nhan-K" title="Sách nền, chờ đối chiếu trang">K</span></span>',
					};
					if (node.type === 'paragraph') node.children = [bao];
					else if (node.type === 'listItem') node.children = [{ type: 'paragraph', children: [bao] }];
					else node.children = node.children.map((c, i) => ({ ...c, children: i === 0 ? [bao] : [] }));
					return SKIP;
				}
			});
		}

		// 2) Nhãn nằm trong tiêu đề: bỏ khỏi tiêu đề (để mục lục sạch), đặt huy hiệu ngay dưới tiêu đề
		visit(tree, 'heading', (node, i, parent) => {
			const nhan = [];
			visit(node, 'text', (t) => {
				t.value = t.value.replace(NHAN_RE, (m) => (nhan.push(m), '')).replace(/\s+$/, '');
			});
			if (nhan.length && parent) {
				parent.children.splice(i + 1, 0, {
					type: 'paragraph',
					children: [
						{
							type: 'html',
							value:
								'<span class="nhan-muc">Cả mục này: ' + nhan.map((n) => htmlNhan(n, base, thieu)).join(' ') + '</span>',
						},
					],
				});
			}
		});

		// 3) Nhãn trong chữ thường -> huy hiệu
		visit(tree, 'text', (node, i, parent) => {
			if (!parent || i == null || !NHAN_RE.test(node.value)) return;
			NHAN_RE.lastIndex = 0;
			const moi = [];
			let cuoi = 0;
			for (const m of node.value.matchAll(NHAN_RE)) {
				if (m.index > cuoi) moi.push({ type: 'text', value: node.value.slice(cuoi, m.index) });
				moi.push({ type: 'html', value: htmlNhan(m[0], base, thieu) });
				cuoi = m.index + m[0].length;
			}
			if (cuoi < node.value.length) moi.push({ type: 'text', value: node.value.slice(cuoi) });
			parent.children.splice(i, 1, ...moi);
			return [SKIP, i + moi.length];
		});

		// Ghi báo cáo để kiểm sau khi build
		const tep = path.join(process.cwd(), 'bao-cao-build.json');
		let bc = {};
		try {
			bc = JSON.parse(fs.readFileSync(tep, 'utf8'));
		} catch {}
		bc[path.relative(process.cwd(), file.path || 'khong-ro')] = { an, khoaThieu: [...thieu] };
		fs.writeFileSync(tep, JSON.stringify(bc, null, 1));
		if (thieu.size) throw new Error(`Mã nguồn không có trong nguon.json: ${[...thieu].join(', ')} (${file.path})`);
	};
}
