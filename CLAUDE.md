# CLAUDE.md: đọc trước khi sửa repo này

Web kiến thức nhũ tương thực phẩm, viết bằng tiếng Việt, đăng công khai tại https://vinh210a1-ship-it.github.io/nhu-tuong/.
Chủ repo là vinh, làm R&D thực phẩm, không chuyên lập trình. Luôn trả lời bằng tiếng Việt. Khi dùng thuật ngữ lập trình, giải thích ngắn bằng lời thường.

## Luật bắt buộc
- **Không bịa số liệu.** Mỗi khẳng định phải mang nhãn: `[N: @khoa]` có nguồn, `[T]` tính minh họa, `[K]` sách nền chưa có số trang, `[G: …]` suy luận. Khóa `@khoa` phải có trong `nguon/nguon.json`.
- Khối `[K]` có chứa số bị tự ẩn (biến `SO_DON_VI` trong `src/plugins/remark-nhan.mjs`). Đổi một nhãn K thành N là làm số đó hiện lên web, nên phải liệt kê cho vinh xem trước.
- Không xóa file, không `git reset --hard`, không force push, không tự gộp PR. Mỗi việc làm trên một nhánh riêng và mở PR để vinh duyệt.
- Không đổi URL của bài đã đăng. Không thêm thư viện nặng (Three.js, Plotly…).

## Đọc gì, tránh đọc gì (tiết kiệm token)
- Đọc trước: file này, rồi bản đồ graphify (nếu có, nằm ở thư mục cha `E:\web hóa`). Sau đó tìm bằng grep và chỉ đọc từng đoạn.
- **Không đọc nguyên** các file lớn: `public/du-lieu/*.json` (TT24, FDA IID), `nguon/nguon.json`, `nguon/nguon.csv`, `package-lock.json`, `public/phong-lab/phong-lab.js`, `public/phong-lab/phong-lab.css`.
- `src/content/docs/<khu>/` là trang sinh tự động (đã gitignore). Không sửa ở đó.

## Ghi nhật ký (để Claude trên claude.ai đọc được)
vinh làm việc với Claude ở hai nơi: terminal trên máy và một dự án trên claude.ai. Hai nơi không tự chia sẻ trí nhớ. Vì vậy, xong mỗi bước (một gói, một PR, một quyết định của vinh), **ghi thêm một mục lên đầu** file `E:\web hóa\NHAT-KY.md` (nằm ngoài repo, mục mới nhất ở trên):
- ngày giờ; đã làm gì; nhánh/PR; vinh đã duyệt hay quyết định gì; việc còn lại.
Không xóa hay sửa mục cũ. Mọi thay đổi code đi qua PR trên GitHub, nên Claude trên claude.ai đọc được tiến độ qua PR và nhật ký này.

## Bản đồ thư mục
| Muốn làm | Sửa ở đâu |
|---|---|
| Sửa hoặc thêm bài | `noi-dung/<khu>/*.md` (khu: nhu-tuong, chat-beo, chat-nhu-hoa, chat-on-dinh, thuc-pham, duoc-pham) |
| Thứ tự bài, tên ở thanh bên | `src/data/khu.mjs`, `src/data/chang.mjs` (6 chặng của khu nhũ tương) |
| "Máy in" biến bài gốc thành trang | `scripts/chuan-bi-noi-dung.mjs` (`KHU_BAT`, `MAY_TINH`, ẩn ghi chú nội bộ) |
| Nguồn tham khảo | `nguon/nguon.csv`, gộp vào `nguon.json` bằng `scripts/gop-nguon.py` |
| Máy tính (13 máy) | Công thức ở `public/cong-thuc.js`, giao diện ở `public/may-tinh.js`. Muốn chèn máy vào bài thì thêm một dòng vào mảng `MAY_TINH` (khu, slug, tiêu đề làm mốc, id máy); nếu không tìm thấy tiêu đề mốc thì build báo lỗi. |
| Phòng lab ảo | `public/phong-lab/`: `mo-hinh.js` (bàn nhũ tương: dầu, chất nhũ hóa, nhiệm vụ, chấm sao), `ban-chung.js` (khung `taoBan(cfg)` cho bàn mới), `ban-thit.js`, `ban-bao-quan.js`, `mo-hinh-thuc-pham.js`. Danh sách bàn và đọc `#ban-…` nằm ở đầu `phong-lab.js`. |
| Tra cứu (INS, từ điển, TT24, tá dược) | `scripts/tra-cuu.mjs`, `public/tra-cuu.js`, `public/tt24.js`, `public/ta-duoc.js`, `noi-dung/tra-cuu/tu-dien-anh-viet.md` |
| Trang viết tay | `src/content/docs/*.md(x)` (trang chủ, quy ước, máy tính, phòng lab, chẩn đoán, tá dược), `trang/` (lộ trình từng khu) |
| Hộp học của 5 khu ngoài Nhũ tương (Cần biết trước, Thử ngay) | `src/data/cong-cu-khu/<khu>.mjs` (nối bài với máy tính, bàn lab, trang tra cứu), đăng ký trong `src/data/cong-cu-bai.mjs` |
| Tự kiểm tra của từng khu | `noi-dung/<khu>/tu-kiem-tra.md` (`## slug` / `### Câu n` / `Hỏi:` `Đáp:` `Căn cứ: N\|T \| <tiêu đề>`; bài chỉ có bảng quy định thì ghi `Miễn: <lý do>`). Máy in dừng build nếu tiêu đề không duy nhất hoặc không có nhãn khớp. |
| Kiểm định kỳ (link ngoài, khóa nguồn, hạn kiểm bảng pháp lý) | `scripts/kiem-dinh-ky.mjs`, `nguon/han-kiem-lai.json` (chỉ điền `kiem_lan_cuoi` khi thật sự đã đối chiếu), lịch ở `.github/workflows/kiem-dinh-ky.yml` (chỉ báo cáo) |
| Nút báo lỗi, bản in | `public/bao-loi.js`, khối `@media print` cuối `src/styles/giao-dien.css` |
| Nhãn → huy hiệu | `src/plugins/remark-nhan.mjs`, CSS ở `src/styles/nhan.css` |
| Công cụ trích dữ liệu (Python) | `cong-cu/` (tt24, fda-iid, chuan_hoa.py) |

## Lệnh
```bash
npm ci
npm run kiem    # phép kiểm máy tính và phòng lab; sai một phép là CI không đăng web
npm run build   # chạy chuan-bi rồi astro build ra dist/
npm run dev     # xem thử tại http://localhost:4321/nhu-tuong/
```
Đăng web: `.github/workflows/dang-web.yml`. Với PR thì chỉ kiểm và build thử; khi gộp vào main thì build và đăng.

## Bẫy đã gặp
- **Windows CRLF:** regex front-matter trong `chuan-bi-noi-dung.mjs` chỉ hiểu `\n`, nên clone trên Windows với autocrlf sẽ làm build hỏng. Cần `.gitattributes` (`* text=auto eol=lf`) hoặc regex chấp nhận `\r?\n`.
- Chuỗi `:số` trong nhãn bị hiểu là directive. "Máy in" đã thoát thành `\:`, đừng bỏ đoạn này.
- Công thức `$$…$$` viết trên một dòng bị hiểu là công thức trong dòng, gây tràn ngang trên điện thoại.
- Nhánh đã squash-merge thì không push tiếp được (force push bị chặn). Muốn làm tiếp thì tạo nhánh mới từ `main`.
- Thêm số liệu mới: ghi kèm nguồn, trang/bảng, điều kiện đo. Số ngoài vùng có dữ liệu thì báo "ngoài vùng có dữ liệu", không ngoại suy.
