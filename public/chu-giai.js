// Chú giải thuật ngữ: rê chuột (hoặc chạm/Tab) vào một thuật ngữ trong bài để xem giải nghĩa ngắn.
// Dữ liệu từ Từ điển (public/chu-giai.json). Mỗi thuật ngữ chỉ được chú giải ở lần xuất hiện đầu tiên của trang.
// Mô tả mang nhãn của mục từ điển (đa số là K: gợi ý, chưa đối chiếu) và tooltip ghi rõ nhãn đó.
const BASE = new URL('.', import.meta.url).pathname;
const BO_QUA = 'a,h1,h2,h3,h4,h5,h6,code,pre,kbd,button,summary,input,textarea,select,script,style,.katex,.nhan,.nhan-cum,.may-tinh,.tk-bang,.td-hang,.pl-goc,.chu-giai,.bao-loi,.sl-anchor-link,[data-khong-chu-giai]';
const TOI_DA = 25;
const NHAN = { N: 'có nguồn', T: 'tính minh họa', K: 'sách nền, chưa đối chiếu', G: 'suy luận' };

async function chay() {
	const goc = document.querySelector('.sl-markdown-content');
	if (!goc || /\/(tra-cuu|phong-lab|nguon|thuat-ngu)\/?/.test(location.pathname.replace(BASE, '/'))) return;
	let ds;
	try {
		const r = await fetch(BASE + 'chu-giai.json');
		if (!r.ok) return;
		ds = await r.json();
	} catch {
		return;
	}
	const theoTu = new Map();
	for (const m of ds) for (const t of m.t) theoTu.set(t.toLowerCase(), m);
	const dsTu = [...theoTu.keys()].sort((a, b) => b.length - a.length);
	if (!dsTu.length) return;
	const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const re = new RegExp(`(?<![\\p{L}\\p{N}])(${dsTu.map(esc).join('|')})(?![\\p{L}\\p{N}])`, 'iu');
	const da = new Set();
	let dem = 0;
	const nut = [];
	const it = document.createTreeWalker(goc, NodeFilter.SHOW_TEXT);
	for (let n = it.nextNode(); n; n = it.nextNode()) {
		if (n.parentElement?.closest(BO_QUA)) continue;
		nut.push(n);
	}
	for (const n of nut) {
		let node = n;
		while (dem < TOI_DA) {
			const m = re.exec(node.nodeValue);
			if (!m) break;
			const khoa = m[1].toLowerCase();
			const muc = theoTu.get(khoa);
			if (da.has(muc)) {
				// đã chú giải rồi: tìm tiếp phần sau chỗ này
				const sau = node.splitText(m.index + m[0].length);
				node = sau;
				continue;
			}
			da.add(muc);
			const truoc = node.splitText(m.index);
			const sau = truoc.splitText(m[0].length);
			const sp = document.createElement('span');
			sp.className = 'chu-giai';
			sp.tabIndex = 0;
			sp.setAttribute('role', 'note');
			const nhan = [...muc.ma].map((c) => NHAN[c]).filter(Boolean).join(', ');
			sp.dataset.mo = `${muc.en}: ${muc.mo.replace(/[.\s]+$/, '')}. [${muc.ma}] ${nhan}`;
			truoc.parentNode.replaceChild(sp, truoc);
			sp.appendChild(truoc);
			dem++;
			node = sau;
		}
		if (dem >= TOI_DA) break;
	}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
else chay();
