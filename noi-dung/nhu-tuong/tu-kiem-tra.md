---
title: "Câu hỏi tự kiểm tra (nguồn cho hộp Tự kiểm tra cuối mỗi bài)"
slug: tu-kiem-tra
khu: nhu-tuong
loai: tu-kiem-tra
hien_tren_web: false
updated: 2026-11-04
---
# Câu hỏi tự kiểm tra

Tệp này không thành trang riêng: "máy in" (`scripts/chuan-bi-noi-dung.mjs`) đọc nó và đặt hộp "Tự kiểm tra" ở cuối từng bài, trước hộp "Thử ngay".

Quy ước viết:
- Mỗi bài 2 đến 3 câu. Mỗi câu gồm một dòng `Hỏi:`, một dòng `Đáp:` và một dòng `Căn cứ:`.
- `Căn cứ: N | <tiêu đề mục>` hoặc `Căn cứ: T | <tiêu đề mục>`: đáp án chỉ được dựa vào câu mang nhãn N (có nguồn) hoặc T (tính minh họa) nằm trong mục đó của chính bài. Máy in kiểm mục có thật và có nhãn đúng loại; sai thì build dừng.
- Không đưa số mới: mọi con số trong đáp án phải có trong bài, ở câu mang nhãn N hoặc T.

## nen-tang

### Câu 1
Hỏi: Với φ = 0,2 và Γ = 2 mg/m², khi đường kính giọt d₃₂ giảm từ 5 µm xuống 1 µm thì lượng chất nhũ hóa tối thiểu để phủ hết bề mặt tăng khoảng mấy lần?
Đáp: Tăng gần 5 lần: từ ≈ 0,5 g/L lên ≈ 2,4 g/L. Giọt nhỏ đi 5 lần thì diện tích bề mặt và lượng chất nhũ hóa cần để phủ đều tăng gần 5 lần.
Căn cứ: T | 2.2 Diện tích bề mặt riêng — con số quyết định mọi thứ

### Câu 2
Hỏi: Theo sách McClements (2016), chất nhũ hóa có HLB 7 đến 9 thì vai trò và hệ quả với nhũ tương O/W là gì?
Đáp: HLB 7 đến 9 là chất thấm ướt, nhũ tương làm ra dễ hợp giọt. Muốn O/W ổn định thì chọn chất tan trong nước có HLB 10 đến 18; quan sát thực nghiệm cho thấy bền nhất ở khoảng 10 đến 12.
Căn cứ: N | 4.3 HLB – cân bằng ưa nước/ưa dầu (cho chất nhũ hóa phân tử nhỏ)

### Câu 3
Hỏi: Vì sao muốn bẻ giọt càng nhỏ thì càng phải thắng áp suất lớn hơn?
Đáp: Áp suất Laplace bên trong giọt tỷ lệ nghịch với bán kính (ΔP = 2γ/r), nên giọt càng nhỏ, áp suất bên trong càng cao và càng khó bẻ tiếp.
Căn cứ: T | 3.1 Sức căng bề mặt và áp suất Laplace

## hinh-thanh

### Câu 1
Hỏi: Để tạo nhũ tương với φ = 0,2, d₃₂ = 1 µm, γ = 10 mN/m, năng lượng bề mặt thật sự cần là bao nhiêu so với năng lượng máy đồng hóa áp suất cao (100 MPa) cấp vào?
Đáp: Cần khoảng 1,2×10⁴ J/m³, trong khi đồng hóa áp suất cao ở 100 MPa cấp cỡ 10⁸ J/m³. Tỷ lệ khoảng 0,01%: phần còn lại biến thành nhiệt.
Căn cứ: T | 3. Hiệu suất năng lượng: tại sao đồng hóa tốn nhiều như vậy

### Câu 2
Hỏi: Vì sao mẫu ra khỏi máy đồng hóa áp suất cao thường nóng, và điều đó có thể gây hại gì với protein whey?
Đáp: Phần năng lượng không dùng để tạo bề mặt hóa nhiệt, tính từ cân bằng năng lượng thì nóng thêm khoảng 2,4 K mỗi 10 MPa. Vì vậy cần làm lạnh ngay, và protein nhạy nhiệt như whey có thể biến tính nếu pha trước đã ấm.
Căn cứ: T | 3. Hiệu suất năng lượng: tại sao đồng hóa tốn nhiều như vậy

### Câu 3
Hỏi: Phương pháp đảo pha theo nhiệt độ (PIT) dựa trên hiện tượng nào và cho ra loại nhũ tương nào?
Đáp: Chất không ion ethoxyl hóa mất nước dần khi nhiệt độ tăng nên HLB hiệu dụng giảm. Ở nhiệt độ đảo pha, sức căng bề mặt cực thấp. Làm lạnh nhanh qua điểm đó thì được nhũ tương O/W giọt rất nhỏ.
Căn cứ: N | 5.1 Đảo pha theo nhiệt độ (PIT – transitional)

## mat-on-dinh

### Câu 1
Hỏi: Giọt 10 µm nổi nhanh gấp bao nhiêu lần giọt 1 µm, và vì sao khi đánh giá kem hóa nên nhìn d₉₀ hoặc d₄₃ chứ không chỉ kích thước trung bình?
Đáp: Gấp 100 lần, vì vận tốc nổi tỷ lệ với bình phương đường kính (v ∝ d²). Kem hóa bị chi phối bởi đuôi các giọt lớn, nên cần số đo nhạy với giọt lớn.
Căn cứ: T | 1. Kem hóa và lắng (Creaming / sedimentation)

### Câu 2
Hỏi: Tăng độ nhớt của pha liên tục lên 10 lần thì giọt nổi chậm đi bao nhiêu lần?
Đáp: Chậm đi 10 lần (v ∝ 1/η). Ví dụ giọt 1 µm ở độ nhớt 10 mPa·s nổi khoảng 0,38 mm/ngày; ở 100 mPa·s khoảng 0,04 mm/ngày.
Căn cứ: T | 1. Kem hóa và lắng (Creaming / sedimentation)

### Câu 3
Hỏi: Ở lực ion cỡ nước muối sinh lý (150 mM), độ dài Debye là bao nhiêu và điều đó nói gì về đẩy tĩnh điện giữa các giọt?
Đáp: Khoảng 0,78 nm, rất ngắn: đẩy tĩnh điện bị che chắn gần như hoàn toàn. Điện tích chỉ cứu được hệ ít muối.
Căn cứ: T | Cơ chế (khung DLVO mở rộng)

## chat-on-dinh

### Câu 1
Hỏi: Trong nghiên cứu nanoemulsion tinh dầu thyme, pha lipid cần chứa tối thiểu bao nhiêu chất không tan để chặn Ostwald ripening?
Đáp: Từ 60% khối lượng dầu bắp trở lên, hoặc từ 50% khối lượng MCT trở lên trong pha lipid.
Căn cứ: N | 2.1 Chất ức chế ripening và chất làm nặng

### Câu 2
Hỏi: Lớp đa tầng (layer-by-layer) được tạo thế nào và giúp gì cho nhũ tương?
Đáp: Thêm polymer mang điện tích trái dấu lên lớp bề mặt sẵn có (ví dụ alginate lên lactoferrin). Cách này tăng độ bền của nhũ tương với lực ion và với điều kiện tiêu hóa.
Căn cứ: N | 2.3 Protein và phức protein–polysaccharide

## he-dac-biet

### Câu 1
Hỏi: Góc tiếp xúc θ bằng bao nhiêu thì năng lượng giải hấp của hạt Pickering lớn nhất, và điều gì xảy ra khi θ tiến về 0° hoặc 180°?
Đáp: Lớn nhất ở θ ≈ 90°. Khi θ tiến về 0° hoặc 180°, hạt dễ rời khỏi bề mặt giọt.
Căn cứ: N | 2.2 Vật lý

### Câu 2
Hỏi: Hạt có góc tiếp xúc (đo trong pha nước) nhỏ hơn 90° thuận lợi cho loại nhũ tương nào?
Đáp: Thuận lợi cho nhũ tương O/W. Khi θ nằm giữa 90° và 180° thì thuận lợi cho W/O.
Căn cứ: N | 2.2 Vật lý

### Câu 3
Hỏi: Khi lượng hạt không đủ phủ kín bề mặt, kích thước giọt cuối cùng phụ thuộc nồng độ hạt thế nào?
Đáp: Hiện tượng "hợp giọt giới hạn": giọt hợp lại cho đến khi bề mặt được phủ đủ, nên kích thước giọt cuối tỷ lệ nghịch với nồng độ hạt (dạng đơn giản). Khi hạt dư, kích thước do cường độ đồng hóa quyết định.
Căn cứ: N | 2.2 Vật lý

## do-luong

### Câu 1
Hỏi: Quy ước "|ζ| lớn hơn 30 mV là bền" áp dụng cho loại ổn định nào?
Đáp: Chỉ áp dụng cho hệ ổn định bằng tĩnh điện, không đúng với hệ ổn định lập thể.
Căn cứ: N | 2. Điện tích bề mặt (zeta potential)

### Câu 2
Hỏi: Nhũ tương loãng và nhũ tương đậm đặc hoặc HIPE khác nhau thế nào trên đường cong chảy?
Đáp: Nhũ tương loãng gần như Newton. Nhũ tương đậm đặc và HIPE có hiện tượng giảm nhớt khi tăng tốc độ cắt (thinning) và có ngưỡng chảy (yield stress).
Căn cứ: N | 3. Lưu biến

### Câu 3
Hỏi: Quét quang học đa tán xạ (Turbiscan) theo dõi những gì và có lợi gì so với quan sát bằng mắt?
Đáp: Theo dõi đồng thời kem hóa, lắng và thay đổi kích thước ở bước sóng 850 nm, ngay trong chai nguyên vẹn. Nó nhạy hơn mắt thường nhiều ngày.
Căn cứ: N | 4.1 Kem hóa/lắng

## san-pham

### Câu 1
Hỏi: Khi làm mayonnaise, vì sao phải cho dầu từng phần nhỏ và kiểm soát tốc độ thêm dầu?
Đáp: Để tránh đảo pha. Quy trình là cho dầu từng phần nhỏ vào máy trộn cao tốc để tạo nhũ thô rồi đồng hóa bằng máy nghiền keo; khi bảo quản nên tránh đông lạnh, gia nhiệt hoặc khuấy quá mạnh.
Căn cứ: N | 2. Mayonnaise và sốt dầu giấm

### Câu 2
Hỏi: Giọt keo tụ trong dạ dày ảnh hưởng thế nào đến tiêu hóa mỡ?
Đáp: Lipase tiếp cận bề mặt giọt, nên giọt keo tụ làm chậm tiêu hóa mỡ: caseinate keo tụ làm chậm hơn Tween 80.
Căn cứ: N | 6. Phân phối hoạt chất (nano, kép, Pickering)

## su-co-thiet-ke

### Câu 1
Hỏi: Mẫu có giọt nhỏ dần biến mất, giọt lớn lớn dần chậm và d³ tăng tuyến tính theo thời gian: nghi hiện tượng nào, kiểm chứng ra sao, xử lý thế nào?
Đáp: Nghi Ostwald ripening (dầu tan nước, ví dụ hương, tinh dầu, TAG ngắn). Vẽ d₄₃³ theo thời gian: đường thẳng thì đúng. Xử lý bằng thêm dầu không tan; ví dụ trong nghiên cứu thyme là ≥ 60% dầu bắp hoặc ≥ 50% MCT. Cách kiểm chứng sau xử lý: độ dốc d³ theo thời gian giảm gần 0.
Căn cứ: N | 1. Bảng chẩn đoán: hiện tượng ⇒ nguyên nhân ⇒ bằng chứng ⇒ giải pháp ⇒ kiểm chứng

### Câu 2
Hỏi: Tăng áp suất đồng hóa nhưng giọt không nhỏ hơn: nghi nguyên nhân nào và làm gì?
Đáp: Nghi giới hạn bởi chất nhũ hóa hoặc độ tan protein kém: d gần như không đổi khi đổi áp suất. Xử lý: tăng chất nhũ hóa, chỉnh pH, xử lý protein (siêu âm, pH-shift); kiểm chứng bằng việc d giảm với chất mới.
Căn cứ: N | 1. Bảng chẩn đoán: hiện tượng ⇒ nguyên nhân ⇒ bằng chứng ⇒ giải pháp ⇒ kiểm chứng

### Câu 3
Hỏi: Nhũ tương Pickering cho giọt to hơn mong đợi hoặc đổi theo đồng hóa: nguyên nhân và cách xử lý?
Đáp: Hợp giọt giới hạn do thiếu hạt, hoặc hạt bị vỡ sau đồng hóa. Bằng chứng là d tỷ lệ nghịch với nồng độ hạt. Xử lý: tăng hạt và kiểm tra tính toàn vẹn của hạt sau đồng hóa.
Căn cứ: N | 1. Bảng chẩn đoán: hiện tượng ⇒ nguyên nhân ⇒ bằng chứng ⇒ giải pháp ⇒ kiểm chứng
