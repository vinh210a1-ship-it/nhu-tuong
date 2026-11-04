"""Chuyển 3 bảng CSV (trích từ sách McClements 2016 và bài Li, Kim, Yoon 2012) thành 3 file JSON cho trang "Số liệu R&D".

Dùng một lần khi có bộ CSV mới (bộ hiện tại nằm ngoài repo: E:\\audit-nhu-tuong\\du-lieu\\nguon-toan-van\\):
    python -X utf8 cong-cu/csv-sang-so-lieu-rnd.py <thư-mục-chứa-3-csv>
Ra: src/data/so-lieu-rnd/hlb.json, dong-hoa.json, mayo-li2012.json.

Mỗi dòng giữ: nguon (khóa trong nguon/nguon.json), trang, vi_tri (bảng/hình), dieu_kien_do, nhan (N/T/K/G).
Không thêm hay sửa số nào: chỉ đổi cột sang tên khóa không dấu. Số trang và vị trí lấy đúng từ cột "Trang" và "Vị trí trong bài"
của CSV, bổ sung số trang của bài Li 2012 từ bảng so-lieu-toan-van.json (cùng bộ dữ liệu đã kiểm).
"""
import csv, json, re, sys
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
RA = GOC / "src/data/so-lieu-rnd"
VAO = Path(sys.argv[1])


def doc(ten):
    return list(csv.DictReader(open(VAO / ten, encoding="utf-8-sig", newline="")))


def rong(s):
    s = (s or "").strip()
    return s or None


RA.mkdir(parents=True, exist_ok=True)

# ---- 1) HLB 30 chất (McClements 2016, Table 4.6, tr.135)
hlb = []
for d in doc("bang-hlb-mcclements2016.csv"):
    hlb.append(
        {
            "ten": d["Tên"].strip(),
            "viet_tat": rong(d["Viết tắt"]) if d["Viết tắt"].strip() not in ("", "—") else None,
            "tan_trong": d["Tan trong (O=dầu, W=nước)"].strip(),
            "hlb": rong(d["HLB"]),  # None nghĩa là sách không ghi số cho chất này
            "dien_tich": rong(d["Điện tích / điểm đục"]),
            "nguon": d["Nguồn"].strip(),
            "trang": "tr.135",
            "vi_tri": "Table 4.6",
            "dieu_kien_do": "Giá trị HLB do sách tổng hợp, ghi nguồn McClements 2014. HLB đổi theo nhiệt độ và điều kiện dung dịch (tr.136).",
            "nhan": d["Nhãn"].strip(),
        }
    )
assert len(hlb) == 30, len(hlb)
json.dump(
    {
        "ten": "HLB của 30 chất nhũ hóa phân tử nhỏ",
        "dong": hlb,
    },
    open(RA / "hlb.json", "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=1,
)

# ---- 2) 7 loại thiết bị đồng hóa (Table 6.1, tr.250)
dong_hoa, ghi_chu = [], None
for d in doc("bang-dong-hoa-mcclements2016.csv"):
    if d["Thiết bị"].strip() == "Ghi chú":
        ghi_chu = d["Công suất"].strip()
        continue
    dong_hoa.append(
        {
            "thiet_bi": d["Thiết bị"].strip(),
            "cong_suat": rong(d["Công suất"]),
            "che_do_dong": rong(d["Chế độ dòng chủ đạo"]),
            "mat_do_nang_luong": rong(d["Mật độ năng lượng (J/m³)"]),
            "hieu_suat": rong(d["Hiệu suất năng lượng tương đối"]),
            "co_giot_nho_nhat": rong(d["Cỡ giọt nhỏ nhất"]),
            "do_nhot_mau": rong(d["Độ nhớt mẫu"]),
            "nguon": d["Nguồn"].strip(),
            "trang": "tr.250",
            "vi_tri": "Table 6.1",
            "dieu_kien_do": "Giá trị điển hình do sách tổng hợp từ Walstra 1983, Schubert 1997, Walstra & Smulder 1998; không phải một phép đo riêng.",
            "nhan": d["Nhãn"].strip(),
        }
    )
assert len(dong_hoa) == 7 and ghi_chu, (len(dong_hoa), ghi_chu)
json.dump(
    {"ten": "7 loại thiết bị đồng hóa", "ghi_chu": ghi_chu, "dong": dong_hoa},
    open(RA / "dong-hoa.json", "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=1,
)

# ---- 3) Mayonnaise theo hàm lượng dầu (Li, Kim, Yoon 2012)
CT = "Công thức: dầu đậu nành 75/80/85, nước 14/9/4, lòng đỏ (10% muối) 8, đường 1, giấm 12–14% 2 (% khối lượng)."
LB = "Lưu biến bằng cone–plate ở 20 °C."
THANH_PHAN = "Đo trên các mẫu mayonnaise làm theo công thức của bài; nhiệt độ đo chưa trích."
# (vị trí, trang, điều kiện đo) theo "Vị trí trong bài" của CSV; trang lấy từ so-lieu-toan-van.json
THEO_VI_TRI = {
    "Bảng 1": ("Bảng 1", None, CT),
    "Bảng 2": ("Bảng 2", "tr.3", THANH_PHAN),
    "Tóm tắt": ("Tóm tắt", "tr.1", "Nhiễu xạ laser; đường kính trung bình theo thể tích (volume-weighted), KHÔNG phải d32."),
    "Bảng 3": ("Bảng 3", "tr.4", LB),
    "Bảng 4": ("Bảng 4", None, LB),
    "tr.6": ("Bảng 4, Hình 4", "tr.6", LB + " G′ và G″ tại ω = 10 rad/s."),
    "tr.4": ("Hình 3", "tr.4", LB),
}
mayo = []
for d in doc("mayo-theo-ham-luong-dau-li2012.csv"):
    vt, tr, dk = THEO_VI_TRI[d["Vị trí trong bài"].strip()]
    mayo.append(
        {
            "dai_luong": d["Đại lượng"].strip(),
            "dau_75": d["Dầu 75%"].strip(),
            "dau_80": d["Dầu 80%"].strip(),
            "dau_85": d["Dầu 85%"].strip(),
            "don_vi": rong(d["Đơn vị"]),
            "nguon": "li2012mayo",
            "trang": tr,
            "vi_tri": vt,
            "dieu_kien_do": dk,
            "nhan": d["Nhãn"].strip(),
        }
    )
assert len(mayo) == 16, len(mayo)
json.dump(
    {
        "ten": "Mayonnaise theo hàm lượng dầu 75, 80, 85%",
        "ghi_chu": "Li L, Kim H, Yoon J (2012) Food Eng Prog 16(1):7–13 (tiêu đề tiếng Hàn, tóm tắt tiếng Anh). Một nghiên cứu, một công thức.",
        "dong": mayo,
    },
    open(RA / "mayo-li2012.json", "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=1,
)
print("ghi 3 file:", len(hlb), "dòng HLB;", len(dong_hoa), "thiết bị;", len(mayo), "dòng mayonnaise")
