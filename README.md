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
| `noi-dung/<khu>/` | **Nội dung gốc** (Markdown) của 4 khu: nhũ tương, chất béo, chất nhũ hóa, chất ổn định. Sửa bài ở đây. |
| `nguon/nguon.json`, `nguon.csv` | Danh mục nguồn chung; mỗi `@khoa` trong nhãn trỏ vào một dòng. |
| `trang/` | Trang lộ trình viết tay của từng khu. |
| `src/content/docs/` | Trang viết tay (trang chủ, quy ước, máy tính). Các trang bài được sinh tự động, không sửa ở đây. |
| `src/plugins/remark-nhan.mjs` | Đổi nhãn `[N: @khoa]`, `[K]`… thành huy hiệu; tạm ẩn đoạn chỉ có nhãn K mà chứa số liệu. |
| `public/cong-thuc.js`, `public/may-tinh.js` | Công thức và giao diện máy tính tương tác. |
| `scripts/` | Chuẩn bị nội dung trước khi build; kiểm máy tính với bảng ví dụ trong bài. |
| `cong-cu/chuan_hoa.py` | Script đã dùng để thống nhất nhãn của 4 bộ tài liệu gốc (bước 1). |

Khu đang bật trên web: đặt trong `KHU_BAT` ở `scripts/chuan-bi-noi-dung.mjs` (hiện chỉ có nhũ tương).

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
