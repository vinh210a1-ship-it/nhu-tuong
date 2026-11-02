---
title: Tra cứu tá dược (FDA IID)
description: Tra lượng tá dược đã có trong thuốc được FDA duyệt, theo đường dùng và dạng bào chế (FDA Inactive Ingredient Database, bản 10/2026).
editUrl: false
tableOfContents: false
---

Trang này tra **Inactive Ingredient Database (IID)** của FDA Hoa Kỳ: tá dược nào đã có trong thuốc được duyệt, ở **đường dùng** nào, **dạng bào chế** nào, với **lượng lớn nhất** bao nhiêu. <span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan"><a class="nhan-nguon" href="../nguon/#fda-iid-2026">FDA IID 10/2026</a></span></span> Ví dụ đời thường: giống sổ ghi "món này đã từng nấu với tối đa bao nhiêu muối mà vẫn được duyệt", không phải "ăn bao nhiêu muối thì an toàn".

<div id="ta-duoc" class="tk-bang ta-duoc not-content">
<input id="td-q" class="tk-q" type="search" placeholder="Gõ tên tiếng Anh (polysorbate 80, lecithin, magnesium stearate) hoặc số CAS" aria-label="Tìm tá dược" autocomplete="off" />
<select id="td-duong" aria-label="Đường dùng"><option value="">Mọi đường dùng</option></select>
<p class="loc-pg-dem" data-td-dem aria-live="polite"></p>
<div data-td-ds><noscript>Trang này cần bật JavaScript để tìm trong 9.076 dòng dữ liệu.</noscript></div>
</div>

## Cách đọc

- **Hàm lượng tối đa mỗi đơn vị liều** (Potency Amount): lượng tá dược lớn nhất trong một viên, một ống, hoặc nồng độ (%w/w, %w/v) đã có trong một chế phẩm được duyệt, theo đúng đường dùng và dạng bào chế của dòng đó. <span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span> Đây là cách đọc thông dụng trong ngành; trang mô tả của FDA đã đọc chưa thấy câu chữ chính thức.
- **Lượng tối đa mỗi ngày** (Maximum Daily Exposure): theo tên cột, là tổng lượng tá dược tối đa nhận trong một ngày theo liều dùng của chế phẩm. <span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span> Trong tệp, không dòng nào có cả hai loại số: 3.659 dòng chỉ có hàm lượng mỗi đơn vị liều, 4.211 dòng chỉ có lượng mỗi ngày, 1.206 dòng để trống cả hai. <span class="nhan-cum"><span class="nhan nhan-N" title="Có nguồn">N</span><span class="nhan-phan"><a class="nhan-nguon" href="../nguon/#fda-iid-2026">FDA IID 10/2026</a></span></span>
- **NA** là chữ FDA ghi trong tệp; web giữ nguyên, chưa diễn giải. Ô "—" là tệp để trống.
- Tên tá dược giữ nguyên tiếng Anh như FDA để tra chéo với tài liệu nhà cung cấp. Đường dùng hay gặp có thêm tên tiếng Việt.

## Giới hạn

- IID là **tiền lệ đã dùng**, không phải giới hạn an toàn và không phải quy định của Việt Nam. Dùng thấp hơn mức trong IID không tự động có nghĩa là an toàn cho mọi bệnh nhân (trẻ em, đường dùng khác, dùng kéo dài). <span class="nhan-cum"><span class="nhan nhan-G" title="Suy luận hoặc giả thuyết">G</span></span>
- Phải so **đúng đường dùng và dạng bào chế**: một tá dược có tiền lệ đường uống chưa chắc có tiền lệ đường tiêm.
- Dữ liệu là bản tải tháng 10/2026; FDA cập nhật hằng quý. Bản trên web được gói lại từ tệp gốc bằng `cong-cu/fda-iid/dong_goi_iid.py`, không sửa số. Số CAS được thêm dấu gạch theo quy ước (ví dụ 9005656 thành 9005-65-6).

Bài liên quan: [Tá dược: chức năng và tương kỵ](../duoc-pham/ta-duoc-chuc-nang-va-tuong-ky/).
