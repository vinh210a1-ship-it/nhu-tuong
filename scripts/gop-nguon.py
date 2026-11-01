"""Gộp một danh mục nguồn mới (CSV cùng cột với nguon/nguon.csv) vào nguon/nguon.json và nguon/nguon.csv.

Dùng khi một luồng tìm tài liệu gửi về bộ nguồn của khu mới. Khóa trùng mà cùng DOI/PMID thì chỉ thêm khu; trùng mà khác bài thì dừng, không ghi đè.
Chạy: python3 scripts/gop-nguon.py <file.csv> <ma-khu>   (ví dụ: ... nguon-thuc-pham.csv thuc-pham)
"""
import csv, json, re, sys
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
MUC = {"Đọc toàn văn": "toan-van", "Đọc một phần / trang gốc": "mot-phan", "Đọc tóm tắt": "tom-tat",
       "Chỉ thấy tiêu đề": "tieu-de", "Ghi từ trí nhớ, chưa kiểm": "tri-nho"}
TEN_MUC = {v: k for k, v in MUC.items()}

tep, khu = sys.argv[1], sys.argv[2]
ds = json.loads((GOC / "nguon/nguon.json").read_text(encoding="utf-8"))
co = {e["khoa"] for e in ds}
moi = []
for d in csv.DictReader(open(tep, encoding="utf-8-sig")):
    k = d["Khóa"].strip()
    if not re.fullmatch(r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*", k):
        sys.exit(f"Khóa không hợp lệ: {k!r}")
    if k in co:
        cu = next((e for e in ds if e["khoa"] == k), None)
        cung = cu and ((d["DOI"].strip() and d["DOI"].strip() == cu["doi"]) or (d["PMID"].strip() and d["PMID"].strip() == cu["pmid"]))
        if not cung:
            sys.exit(f"Khóa đã có trong nguon.json nhưng là bài khác: {k} (đổi tên khóa trong file mới)")
        if khu not in cu["khu"]:
            cu["khu"].append(khu)  # cùng một bài: chỉ thêm khu dùng
        continue
    if d["Mức đọc"] not in MUC:
        sys.exit(f"Mức đọc lạ ở {k}: {d['Mức đọc']!r}")
    co.add(k)
    moi.append(dict(trich_dan=d["Trích dẫn"].strip(), ho=re.match(r"[a-z]+", k).group(0),
                    nam=int(d["Năm"]) if d["Năm"].strip().isdigit() else None,
                    doi=d["DOI"].strip() or None, pmid=d["PMID"].strip() or None, url=d["Đường dẫn"].strip() or None,
                    muc_doc=MUC[d["Mức đọc"]], khu=[khu],
                    ma_cu=[m.strip() for m in d["Mã cũ"].split(";") if m.strip()], khoa=k))
ds = sorted(ds + moi, key=lambda e: e["khoa"])
(GOC / "nguon/nguon.json").write_text(json.dumps(ds, ensure_ascii=False, indent=1), encoding="utf-8")

# nguon.csv: giữ tên khu tiếng Việt như bản cũ
ten_khu = {}
for d in csv.DictReader(open(GOC / "nguon/nguon.csv", encoding="utf-8-sig")):
    ten_khu[d["Khóa"]] = d["Khu dùng"]
for d in csv.DictReader(open(tep, encoding="utf-8-sig")):
    k = d["Khóa"].strip()
    ten_khu[k] = ", ".join(x for x in [ten_khu.get(k, ""), d["Khu dùng"]] if x) if d["Khu dùng"] not in ten_khu.get(k, "") else ten_khu[k]
with open(GOC / "nguon/nguon.csv", "w", encoding="utf-8-sig", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["Khóa", "Trích dẫn", "Năm", "DOI", "PMID", "Đường dẫn", "Mức đọc", "Khu dùng", "Mã cũ"])
    for e in ds:
        w.writerow([e["khoa"], e["trich_dan"], e["nam"] or "", e["doi"] or "", e["pmid"] or "", e["url"] or "",
                    TEN_MUC[e["muc_doc"]], ten_khu.get(e["khoa"], ""), "; ".join(e["ma_cu"])])
print(f"gộp {len(moi)} nguồn mới, tổng {len(ds)}")
