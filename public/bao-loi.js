// Nút "Báo lỗi / góp ý số liệu" cuối mỗi bài. Chỉ tạo một liên kết tới GitHub Issues
// (điền sẵn tên bài và địa chỉ trang); không gửi gì đi cho tới khi người đọc tự bấm "Submit" trên GitHub.
const REPO = 'https://github.com/vinh210a1-ship-it/nhu-tuong';

function them() {
	const nd = document.querySelector('.sl-markdown-content');
	if (!nd || document.querySelector('.bao-loi')) return;
	const tieuDe = (document.querySelector('h1')?.textContent || document.title).trim();
	const trang = location.origin + location.pathname;
	const u = new URL(REPO + '/issues/new');
	u.searchParams.set('title', `[Góp ý] ${tieuDe}`);
	u.searchParams.set(
		'body',
		`Trang: ${trang}\n\nĐoạn/số liệu có vấn đề (trích nguyên văn):\n\n\nVì sao bạn cho là chưa đúng (kèm nguồn nếu có):\n\n`,
	);
	const d = document.createElement('aside');
	d.className = 'bao-loi';
	d.innerHTML = `<span>Thấy số liệu sai, thiếu nguồn hoặc chỗ khó hiểu?</span> <a rel="noopener" target="_blank" href="${u.href}">Báo lỗi / góp ý số liệu</a> <small>(mở trang GitHub; cần tài khoản GitHub miễn phí)</small>`;
	nd.appendChild(d);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', them);
else them();
