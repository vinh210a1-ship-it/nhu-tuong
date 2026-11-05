# Nhũ tương thực phẩm — web kiến thức tiếng Việt

Web kiến thức về nhũ tương thực phẩm cho người làm R&D, QA và sinh viên công nghệ thực phẩm. Mỗi khẳng định mang một huy hiệu tin cậy:

| Huy hiệu | Nghĩa |
|---|---|
| **N** | Có nguồn (bấm ra thẻ nguồn) |
| **T** | Tính minh họa |
| **K** | Sách nền, chưa đối chiếu số trang |
| **G** | Suy luận hoặc giả thuyết |

Địa chỉ web (sau khi bật GitHub Pages): https://vinh210a1-ship-it.github.io/nhu-tuong/

## Cấu trúc

| Thư mục | Là gì |
|---|---|
| `noi-dung/<khu>/` | **Nội dung gốc** (Markdown) của 6 khu: nhũ tương, chất béo, chất nhũ hóa, chất ổn định, thực phẩm, dược phẩm. Sửa bài ở đây. |
| `nguon/nguon.json`, `nguon.csv` | Danh mục nguồn chung; mỗi `@khoa` trong nhãn trỏ vào một dòng. |
| `noi-dung/tra-cuu/tu-dien-anh-viet.md` | Dữ liệu từ điển Anh–Việt của trang **Tra cứu** (bảng Markdown theo lĩnh vực). Thêm từ: thêm một dòng bảng, build lại. |
| `scripts/tra-cuu.mjs`, `public/tra-cuu.js` | Dựng trang Tra cứu (mã INS + từ điển, gộp bảng thuật ngữ nhũ tương và dược) và ô tìm kiếm bỏ dấu tiếng Việt. |
| `trang/` | Trang lộ trình viết tay của từng khu. |
| `src/content/docs/` | Trang viết tay (trang chủ, quy ước, máy tính). Các trang bài được sinh tự động, không sửa ở đây. |
| `src/plugins/remark-nhan.mjs` | Đổi nhãn `[N: @khoa]`, `[K]`… thành huy hiệu; tạm ẩn đoạn chỉ có nhãn K mà chứa số liệu. |
| `public/cong-thuc.js`, `public/may-tinh.js` | Công thức và giao diện máy tính tương tác. |
| `scripts/` | Chuẩn bị nội dung trước khi build; kiểm máy tính với bảng ví dụ trong bài. |
| `cong-cu/chuan_hoa.py` | Script đã dùng để thống nhất nhãn của 4 bộ tài liệu gốc (bước 1). |

Khu đang bật trên web: đặt trong `KHU_BAT` ở `scripts/chuan-bi-noi-dung.mjs` (hiện bật cả 6 khu).

Kiểm tra trước khi đăng (cũng chạy trong CI): `npm run kiem` (máy tính và Phòng lab), `npm run build`, rồi `npm run kiem-sau-build` (không còn ghi chú nội bộ lọt ra trang bài, không có liên kết nội bộ hỏng).

Trên Windows: tệp `.gitattributes` ép cuối dòng LF; script đọc nội dung đều đổi CRLF thành LF (`scripts/doc-tep.mjs`) nên build vẫn đúng nếu Git đã đổi cuối dòng thành CRLF.

## Cú pháp nhãn trong bài

`[N: @moens2018, @petrut2015]` · `[T]` · `[K]` · `[G: suy luận]` · nhãn ghép `[K; N: @mcclements2007]`.

## Chạy trên máy

```bash
npm ci
npm run kiem     # kiểm máy tính với bảng ví dụ trong bài
npm run dev      # xem thử tại http://localhost:4321/nhu-tuong/
npm run build    # build ra thư mục dist/
```

Công nghệ: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), công thức bằng KaTeX, tìm kiếm bằng Pagefind. Đăng tự động lên GitHub Pages bằng `.github/workflows/dang-web.yml`.
