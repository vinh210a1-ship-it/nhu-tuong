---
title: Phòng lab ảo
description: Trò chơi phòng thí nghiệm có bốn bàn, gồm bàn nhũ tương với bốn chế độ (cơ bản, mayonnaise, Pickering, nhũ tương kép), bàn thịt, bàn bảo quản và bàn nâu hóa. Kéo thả nguyên liệu, chạy máy và xem kết quả tính bằng cơ chế và số liệu có nguồn.
template: splash
tableOfContents: false
editUrl: false
head:
  - tag: link
    attrs: { rel: stylesheet, href: /nhu-tuong/phong-lab/phong-lab.css }
  - tag: script
    attrs: { type: module, src: /nhu-tuong/phong-lab/phong-lab.js }
---

Phòng lab có **bốn bàn thí nghiệm**. Chọn bàn, chọn nhiệm vụ, rồi mở tủ lấy nguyên liệu và kéo mẫu qua từng máy. Bàn nhũ tương có **bốn chế độ**, vì cả bốn đều là nhũ tương nhưng cơ chế giữ giọt khác nhau, nên mỗi chế độ dùng đúng mô hình và số liệu có nguồn của riêng nó (không ép chung một công thức); nhiệm vụ, sao và Sổ tay của từng chế độ giữ nguyên:

- **Bàn nhũ tương, chế độ Cơ bản** (nhũ tương đơn O/W): cân dầu và chất nhũ hóa → khuấy → đồng hóa → đo giọt → tua nhanh thời gian xem tách lớp, ôi dầu.
- **Chế độ Mayonnaise** (nhũ tương đơn, khung minh họa): thêm dầu nhanh hay chậm → nghiền keo → so với bảng đo ở dầu 75, 80, 85%.
- **Chế độ Pickering** (nhũ tương đơn, hạt rắn làm chất ổn định): chọn hạt → đọc góc tiếp xúc kèm cách đo → tính năng lượng giải hấp → xem loại nhũ tương.
- **Chế độ W/O/W** (nhũ tương kép): chọn PGPR và tỉ lệ giọt trong → bước 1 → bước 2 nhẹ hơn → xem bản đồ miền ổn định theo một nghiên cứu.
- **Bàn thịt**: pha nước muối với muối, phosphat → tiêm vào thịt → đo pH → nấu → cân xem thịt còn mọng nước không.
- **Bàn bảo quản**: pha lọ sản phẩm với muối, đường, axit, chất bảo quản → đo aw và pH → ủ trên đĩa thạch xem vi khuẩn nào mọc.
- **Bàn nâu hóa** (học nguyên lý): bánh quy hoặc chip chiên; đường, aw, nhiệt độ, hạ nhiệt chiên, asparaginase. Số có nguồn giữ đúng điều kiện đã công bố; đường cong bánh quy là nội suy nhãn T trong 165–195 °C; ngoài vùng thì báo không có dữ liệu.

## Cân mẻ như ở lab thật và máy đo cỡ hạt

Ở bàn nhũ tương, cốc nay nhận **số gam** thay vì chỉ phần trăm. Chọn khối lượng mẻ từ 20 đến 2.000 g, rồi nhập dầu, chất nhũ hóa, xanthan theo một trong ba cách: **gam**, **phần trăm của cả mẻ**, hoặc **tỉ lệ**. Nước tự bù cho đủ mẻ, hoặc bạn tắt chế độ đó để tự cân nước. Mô hình vẫn tính theo phần trăm [G], nên đổi khối lượng mẻ không làm đổi cỡ giọt; khối lượng mẻ chỉ quyết định máy nào chạy được.

- **Máy chạy được hay không:** máy khuấy cắt cao (rotor–stator) nhận mẫu 1 mL–2 L và độ nhớt pha nước tới 5.000 mPa·s; máy đồng hóa áp cao để bàn cần tối thiểu 30 mL và giữ lại khoảng 15 mL trong máy sau một lượt chạy. Thông số lấy từ tài liệu hãng, mỗi nguồn nằm ở trang Nguồn. Mẻ không hợp thì máy báo lý do và không chạy.
- **Máy đo cỡ hạt:** chọn **nhiễu xạ laser** (đọc d₃₂, d₄₃, Dv10/50/90 và span) hoặc **DLS**. Mỗi máy có dải đo của hãng và dải tin cậy theo tổng quan; giọt nằm ngoài dải thì máy báo, không in số. DLS thật báo Z-average (trung bình điều hòa theo cường độ tán xạ), không phải d₃₂, nên máy DLS của phòng lab này chưa in số cỡ hạt mà chỉ giải thích vì sao. Đo chỉ đọc mẫu, không làm đổi mẫu.
- **Đoán trước khi chạy:** thẻ đoán cho bạn dự đoán giọt to hơn, nhỏ hơn hay như cũ so với lần trước, rồi mới đối chiếu với kết quả.
- **Chia sẻ mẻ:** địa chỉ dạng `#ban-nhu-tuong?me=…` mang theo mẻ bạn vừa cân, nên gửi cho người khác là mở ra đúng mẻ đó.

## Tủ lưu mẫu

Mỗi bàn có nút **Lưu mẫu vào tủ**. Mẫu nằm trong **Tủ lưu mẫu** ở cuối trang, dùng chung cho mọi bàn, lưu trong trình duyệt này và **chỉ mất khi bạn bấm Xóa** (hai bước, để tránh lỡ tay) hoặc khi xóa dữ liệu trình duyệt.

- **Lấy ra ở bàn gốc:** khôi phục đúng trạng thái lúc lưu.
- **Mang sang bàn khác:** bàn nhận chỉ đọc những thuộc tính nó tính được, kèm nhãn N/T/G, và nói rõ phần chưa đọc được; không đoán số. Giữa các chế độ nhũ tương chưa có lối mang mẫu vì mỗi chế độ đo đại lượng khác nhau. Có ba lối: **bàn thịt → bàn bảo quản** (đọc muối và pH), **bàn nâu hóa (bánh quy) → bàn bảo quản** (đọc aw bạn đã đặt; pH, muối, đường chưa biết nên bàn dùng mặc định và nói rõ), và **bất kỳ bàn nào → bàn bảo quản** qua ô **Số đo của bạn** trong tủ: bạn ghi pH, aw hoặc muối đo được ngoài đời vào mẫu (nhãn G), bàn bảo quản đọc các số đó để xét hàng rào vi sinh, giống như đem một sản phẩm bất kỳ đi kiểm hạn dùng. Các cặp bàn khác báo chưa có phép chuyển đã kiểm.

Kết quả không phải do may rủi: mỗi hiện tượng đều tính bằng cơ chế và số đo có nguồn (Stokes, bảng giới hạn mọc của FDA, các nghiên cứu về phosphat trong thịt…). Mỗi lời giải thích có nhãn tin cậy như phần còn lại của web; số nào là minh họa đều được ghi rõ.

<div id="phong-lab" class="not-content"><noscript>Phòng lab cần bật JavaScript.</noscript></div>
