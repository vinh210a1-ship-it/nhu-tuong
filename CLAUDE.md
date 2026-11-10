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
| Phòng lab ảo | `public/phong-lab/`: `mo-hinh.js` (bàn nhũ tương: dầu, chất nhũ hóa, nhiệm vụ, chấm sao), `cong-thuc-me.js` (mẻ tính bằng gam, giới hạn, ba cách nhập), `thiet-bi.js` (thông số máy theo hãng gồm khuấy, đồng hóa, microfluidizer, siêu âm; `kiemMay`; mô hình máy làm mịn và ba nhiệm vụ P3 nằm ở `mo-hinh.js`: `lamMin`, `SIEU_AM`, `NANG_LUONG_SAO`), `may-do-hat.js` (máy đo cỡ hạt dùng chung: nhiễu xạ laser, DLS), `ban-chung.js` (khung `taoBan(cfg)` cho bàn mới), `ban-thit.js`, `ban-bao-quan.js`, `ban-nau-hoa.js` + `mo-hinh-nau-hoa.js` + `so-lieu-nau-hoa.js`, `mo-hinh-thuc-pham.js`. Danh sách bàn, chế độ của bàn nhũ tương (cơ bản/mayo/pickering/kep) và đọc `#ban-…` nằm ở hàm `dungVo` đầu `phong-lab.js`; mã chế độ cũ giữ nguyên để địa chỉ, khóa sao và mẫu đã lưu vẫn dùng được. |
| Tủ lưu mẫu (mẫu dùng chung giữa các bàn) | `public/phong-lab/tu-luu-mau.js` (kho, localStorage `pl:tu-mau`, mẫu chỉ xóa khi người dùng bấm Xóa). Bàn dựng bằng `taoBan` tự có nút Lưu mẫu; muốn bàn mang được thuộc tính sang bàn khác thì khai `tt(st)` (thuộc tính chung, kèm nhãn), muốn bàn nhận mẫu từ bàn X thì khai `nhanTu.X(tt, st)`; không khai thì báo "chưa đọc được", không đoán. `nhanChung(tt, st, mau)` là lối đọc cho mọi bàn gốc chưa có mục riêng; hiện chỉ bàn bảo quản khai (đọc `pH`, `aw`, `muoi`). Ô "Số đo của bạn" trong tủ (`datSoDo`) ghi các khóa đó vào mẫu với nhãn G, cờ `nhap`. |
| Tra cứu (INS, từ điển, TT24, tá dược) | `scripts/tra-cuu.mjs`, `public/tra-cuu.js`, `public/tt24.js`, `public/ta-duoc.js`, `noi-dung/tra-cuu/tu-dien-anh-viet.md` |
| Trang viết tay | `src/content/docs/*.md(x)` (trang chủ, quy ước, máy tính, phòng lab, chẩn đoán, tá dược), `trang/` (lộ trình từng khu) |
| Hộp học của 5 khu ngoài Nhũ tương (Cần biết trước, Thử ngay) | `src/data/cong-cu-khu/<khu>.mjs` (nối bài với máy tính, bàn lab, trang tra cứu; dòng `tra-cuu` có thể kèm `q` = từ khóa điền sẵn, phải kiểm bằng trình duyệt là ra ít nhất 1 kết quả), đăng ký trong `src/data/cong-cu-bai.mjs`. Bài không có công cụ đúng chủ đề ghi lý do ở `MIEN_THU_NGAY` (cùng file); bài khai `[]` ở "Cần biết trước" in dòng "đọc độc lập" (trừ bài đầu khu) |
| Hộp "Liên quan ở khu khác" (nối bài với bài cùng chủ đề ở khu khác) | `src/data/lien-quan-khu.mjs`: khóa `khu/slug`, mỗi bài tối đa 3 dòng, đích phải ở khu khác; sai thì build dừng. Nối hai chiều nên mỗi cặp có hai dòng. Câu mô tả chỉ nói phạm vi bài kia, không đưa số liệu. |
| Tự kiểm tra của từng khu | `noi-dung/<khu>/tu-kiem-tra.md` (`## slug` / `### Câu n` / `Hỏi:` `Đáp:` `Căn cứ: N\|T \| <tiêu đề>`; bài chỉ có bảng quy định thì ghi `Miễn: <lý do>`). Máy in dừng build nếu tiêu đề không duy nhất hoặc không có nhãn khớp. |
| Kiểm định kỳ (link ngoài, khóa nguồn, hạn kiểm bảng pháp lý) | `scripts/kiem-dinh-ky.mjs`, `nguon/han-kiem-lai.json` (chỉ điền `kiem_lan_cuoi` khi thật sự đã đối chiếu), lịch ở `.github/workflows/kiem-dinh-ky.yml` (chỉ báo cáo) |
| Màu chữ đủ tương phản (WCAG AA), vùng cuộn bằng bàn phím | Token `--khu-*-chu`, `--hh-thuong-hieu-chu`, `--hh-ho-phach-chu` ở `src/styles/giao-dien.css` (màu khu gốc chỉ cho viền, nền; chữ nhỏ dùng token `-chu`); nút `.kb-nut` pha 25% đen; `vungCuonBanPhim` trong `public/tuong-tac.js` gắn `tabindex` cho công thức và bảng tràn khung. Đổi màu thì chạy `npm run kiem-truy-cap`. |
| Giấy phép, lý lịch bài, trích dẫn, nhật ký thay đổi | `LICENSE` (MIT, mã), `LICENSE-NOI-DUNG.md` (CC BY 4.0, chữ và hình), chân trang `src/components/Footer.astro`, trang `src/content/docs/giay-phep.md`. "Máy in" (`ngayDangDau`, `htmlTrichDan`, `dauMetaTrichDan`, khối "trang Nhật ký thay đổi") sinh dòng ngày "Đăng lần đầu" (từ git, chỉ tin khi lịch sử đầy đủ), hộp "Cách trích dẫn trang này" (`public/trich-dan.js` điền ngày truy cập), thẻ meta Google Scholar và `/nhat-ky-thay-doi/`. Workflow đăng web phải giữ `fetch-depth: 0`, nếu không ngày đăng và nhật ký bị bỏ trống. |
| Hình cơ chế (T1) | `src/hinh/<khu>/<tên>.svg` (vẽ tay, một khối, KHÔNG có dòng trống; `viewBox` rộng ≤ 400 với chữ 14, thẻ `svg` có `width` ≤ 480, `role="img"`, `<title>`, `<desc>`, màu chỉ qua lớp `h-*` trong `src/styles/hinh.css` hoặc `var(--hh-*/--sl-color-*)`) và `<tên>.md` (chú thích 2–4 câu, một đoạn, có nhãn N/T/K/G như bài, phải nói hình KHÔNG nói gì). Đặt vào bài bằng một dòng riêng `<!-- hinh: tên -->` ngay dưới tiêu đề mục trong `noi-dung/<khu>/*.md`; máy in (`htmlHinh`) thay bằng `<figure>` và gắn tiền tố `h-<tên>-` cho id. `npm run kiem` chạy `scripts/kiem-hinh.mjs` (+ `scripts/kiem-svg.mjs` dùng chung); `kiem-sau-build.mjs` đếm hình trong `dist/`. Chữ trong `<svg>` được chú giải bỏ qua (`BO_QUA` ở `public/chu-giai.js`). |
| Đồ thị của máy tính (T2) | Khung chung `public/do-thi.js` (viewBox mặc định 350 vì khung đồ thị ở 375 px chỉ rộng 305 px, chữ 14 ra 12,2 px; hàm `bieuDo` với `vung`, `duong`, `cham`, `moc`, `diem`; `nhanN`, `nhanK`, `nhanG`; hợp đồng ghi ở đầu file; đặt `x.vach` để chọn vạch chia): mỗi máy một file `public/do-thi/<id>.js` (≤ 6 KB; `macDinh`, `ve(dauVao)`, `doanTruoc`) và một phép kiểm `scripts/kiem-do-thi/<id>.mjs`. Không sửa `may-tinh.js`: `do-thi.js` tự gắn vào máy có tên trong `public/do-thi/index.json` (máy in sinh, đã gitignore). Mốc [N] chỉ lấy từ số đã là [N] trên web; vùng không có dữ liệu tô xám bằng `b.vung`, không ngoại suy. `npm run kiem` chạy `scripts/kiem-do-thi.mjs`; `npm run kiem-truy-cap` tự bấm "Bỏ qua" để quét cả đồ thị. |
| Nút báo lỗi, bản in | `public/bao-loi.js`, khối `@media print` cuối `src/styles/giao-dien.css` |
| Nhãn → huy hiệu | `src/plugins/remark-nhan.mjs`, CSS ở `src/styles/nhan.css` |
| Công cụ trích dữ liệu (Python) | `cong-cu/` (tt24, fda-iid, chuan_hoa.py) |

## Lệnh
```bash
npm ci
npm run kiem    # phép kiểm máy tính và phòng lab; sai một phép là CI không đăng web
npm run build   # chạy chuan-bi rồi astro build ra dist/
npm run dev     # xem thử tại http://localhost:4321/nhu-tuong/
npm run kiem-truy-cap   # sau khi build: axe-core quét 14 trang (sáng/tối, 1280/390 px); cần `npm install --no-save playwright` và trình duyệt; thêm `-- --chat` để có lỗi thì thoát mã 1
```
Đăng web: `.github/workflows/dang-web.yml`. Với PR thì chỉ kiểm và build thử; khi gộp vào main thì build và đăng.

## Bẫy đã gặp
- **Windows CRLF:** regex front-matter trong `chuan-bi-noi-dung.mjs` chỉ hiểu `\n`, nên clone trên Windows với autocrlf sẽ làm build hỏng. Cần `.gitattributes` (`* text=auto eol=lf`) hoặc regex chấp nhận `\r?\n`.
- Chuỗi `:số` trong nhãn bị hiểu là directive. "Máy in" đã thoát thành `\:`, đừng bỏ đoạn này.
- Công thức `$$…$$` viết trên một dòng bị hiểu là công thức trong dòng, gây tràn ngang trên điện thoại.
- Nhánh đã squash-merge thì không push tiếp được (force push bị chặn). Muốn làm tiếp thì tạo nhánh mới từ `main`.
- Thêm số liệu mới: ghi kèm nguồn, trang/bảng, điều kiện đo. Số ngoài vùng có dữ liệu thì báo "ngoài vùng có dữ liệu", không ngoại suy.
