// Đọc tệp chữ (.md) cho các script chuẩn bị nội dung.
// Trên Windows, Git có thể đổi cuối dòng thành CRLF (\r\n) khi lấy tệp về máy. Bộ đọc front-matter
// ("---" ở đầu tệp) và các biểu thức chính quy trong script đều giả định LF (\n), nên CRLF làm
// build ra "0 bài". Mọi tệp chữ phải đi qua hàm này để luôn thành LF, và bỏ dấu BOM đầu tệp nếu có.
import fs from 'node:fs';

export function docTep(duongDan) {
	return fs.readFileSync(duongDan, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
}
