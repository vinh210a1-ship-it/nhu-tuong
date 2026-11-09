// Hộp "Cách trích dẫn trang này" cuối bài: điền ngày truy cập theo máy người đọc và nút chép.
// Không có JavaScript thì hộp vẫn đọc được, chỗ ngày truy cập giữ chữ "(ngày truy cập)".
function khoiDong() {
	const ngay = new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
	document.querySelectorAll('[data-truy-cap]').forEach((e) => {
		e.textContent = ngay;
	});
	document.querySelectorAll('[data-chep-trich-dan]').forEach((nut) => {
		if (nut.dataset.daDung) return;
		nut.dataset.daDung = '1';
		nut.addEventListener('click', async () => {
			const o = nut.parentElement.querySelector('.td-chu');
			let nhan = 'Đã chép';
			try {
				await navigator.clipboard.writeText(o.textContent);
			} catch (_) {
				// trình duyệt không cho chép tự động: bôi đen sẵn để người đọc bấm Ctrl+C
				const r = document.createRange();
				r.selectNodeContents(o);
				const s = window.getSelection();
				s.removeAllRanges();
				s.addRange(r);
				nhan = 'Đã bôi đen, bấm Ctrl+C';
			}
			nut.textContent = nhan;
			setTimeout(() => {
				nut.textContent = 'Chép';
			}, 2500);
		});
	});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
