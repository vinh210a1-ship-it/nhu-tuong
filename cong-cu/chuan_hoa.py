#!/usr/bin/env python3
"""Chuẩn hóa 4 bộ tài liệu (nhũ tương, chất béo, chất nhũ hóa, chất ổn định) cho web kiến thức.

Không sửa file gốc. Đọc từ SRC, ghi bản sao đã chuẩn hóa vào OUT:
  OUT/noi-dung/<khu>/<file>.md   nội dung với nhãn thống nhất + front-matter
  OUT/nguon/nguon.json, nguon.csv danh mục nguồn chung (khử trùng lặp theo DOI/PMID/tên-năm)
  OUT/BAO-CAO-CHUAN-HOA.md        báo cáo: quy đổi nhãn, nguồn trùng, trích dẫn chưa khớp

Nhãn thống nhất (4 mức):
  N = Có nguồn   T = Tính minh họa   K = Sách nền, chờ đối chiếu   G = Suy luận/giả thuyết
Cú pháp sau chuẩn hóa: [N: @khoa1, @khoa2; K] — mỗi đoạn ngăn bởi ';' mở đầu bằng mã;
đoạn không có mã thì thuộc mã đứng trước. '@khoa' trỏ vào nguon.json.

Cách chạy: python3 chuan_hoa.py <SRC> <OUT>
"""
import csv, difflib, json, re, sys, unicodedata
from collections import Counter, defaultdict
from pathlib import Path

SRC = Path(sys.argv[1]); OUT = Path(sys.argv[2])
NGAY = "2026-11-01"

BO = {  # khu web: (thư mục gốc, file danh mục nguồn, các file không đổi nhãn)
    "nhu-tuong":    ("tai-lieu-nhu-tuong", "10-tai-lieu-tham-khao.md", {"00-muc-luc-va-huong-dan.md", "10-tai-lieu-tham-khao.md", "09-thuat-ngu.md"}),
    "chat-beo":     ("tai-lieu-chat-beo", "99-thu-muc-nguon.md", {"00-muc-luc-va-quy-uoc.md", "99-thu-muc-nguon.md"}),
    "chat-nhu-hoa": ("tai-lieu-chat-hoat-dong-be-mat", "06-nguon-tai-lieu.md", {"00-README-muc-luc.md", "06-nguon-tai-lieu.md", "07-ke-hoach-web-va-khoang-trong.md"}),
    "chat-on-dinh": ("tai-lieu-chat-on-dinh", "07-danh-muc-nguon.md", {"00-muc-luc-va-cach-dung.md", "07-danh-muc-nguon.md"}),
}
TEN_KHU = {"nhu-tuong": "Nhũ tương", "chat-beo": "Chất béo", "chat-nhu-hoa": "Chất nhũ hóa", "chat-on-dinh": "Chất ổn định"}

# ---------------------------------------------------------------- tiện ích
def fold(s):
    s = unicodedata.normalize("NFKD", s).replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in s if not unicodedata.combining(c))

def ho(s):
    """Họ tác giả đầu dạng khóa: 'Rodríguez-Sandoval E' -> 'rodriguezsandoval'."""
    s = s.strip().split(",")[0].strip()
    tok = s.split()[0] if s.split() else s
    if tok.lower() in ("de", "van", "von", "da", "del", "la", "le", "di") and len(s.split()) > 1:
        tok = tok + s.split()[1]
    return re.sub(r"[^a-z]", "", fold(tok).lower())

DOI_RE = re.compile(r"10\.\d{4,9}/[^\s|)\]>;,]+", re.I)
def doi_of(s):
    m = DOI_RE.search(s)
    return m.group(0).rstrip(".").lower() if m else None

def pmid_of(s):
    m = re.search(r"PMID[:\s]*(\d{6,9})", s)
    return m.group(1) if m else None

def url_of(s):
    m = re.search(r"https?://[^\s|)\]>]+", s)
    return m.group(0) if m else None

def nam_of(s):
    m = re.search(r"\((\d{4})[^)]*\)", s) or re.search(r"\b(19\d{2}|20\d{2})\b", s)
    return int(m.group(1)) if m else None

def tu(s):
    return {w for w in re.findall(r"[a-z]{4,}", fold(s).lower())}

def tu5(s):
    return {w[:5] for w in tu(s)}

def lam_sach(s):
    s = re.sub(r"\s*\[(?:liên kết|DOI)\]\(https?://[^)]+\)", "", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()

# ---------------------------------------------------------------- đọc danh mục
raw = []   # mỗi phần tử: dict(khu, ma, trich_dan, muc_doc, doi, pmid, url, ho, nam, loai)

def them(khu, ma, trich, muc, extra=""):
    full = trich + " " + extra
    raw.append(dict(khu=khu, ma=ma, trich_dan=lam_sach(trich), muc_doc=muc,
                    doi=doi_of(full), pmid=pmid_of(full), url=url_of(full),
                    ho=ho(re.sub(r"^\W+", "", lam_sach(trich))), nam=nam_of(trich)))

def bang(path):
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("|") and not re.match(r"^\|\s*-", line):
            yield [c.strip() for c in line.strip().strip("|").split("|")]

# nhũ tương: | R01 | trích dẫn | Kiểm | Dùng cho |  (T.. sách, C.. bài kinh điển)
p = SRC / BO["nhu-tuong"][0] / BO["nhu-tuong"][1]
for c in bang(p):
    if re.fullmatch(r"[RTC]\d{2}", c[0]):
        if c[0][0] == "R":
            muc = {"PM": "tom-tat", "WF": "mot-phan"}.get(c[2].split()[0], "tom-tat")
            them("nhu-tuong", c[0], c[1], muc, c[2])
        else:
            them("nhu-tuong", c[0], c[1], "tri-nho")

# chất béo: | R1 | trích dẫn | PMID | DOI | Đã đọc |  ; mục B sách (không mã)
p = SRC / BO["chat-beo"][0] / BO["chat-beo"][1]
muc_b = False; nb = 0
for line in p.read_text(encoding="utf-8").splitlines():
    if line.startswith("## B."): muc_b = True
    if line.startswith("## C."): muc_b = False
    if not line.startswith("|") or re.match(r"^\|\s*-", line): continue
    c = [x.strip() for x in line.strip().strip("|").split("|")]
    if re.fullmatch(r"R\d{1,2}", c[0]) and len(c) >= 5:
        muc = "toan-van" if c[4] == "TV" else ("mot-phan" if c[4].startswith("TV") else "tom-tat")
        them("chat-beo", c[0], c[1], muc, f"PMID {c[2].split()[0]} {c[3]}")
    elif muc_b and c[0] not in ("Nguồn",):
        nb += 1; them("chat-beo", f"B{nb}", c[0], "tri-nho")

# chất nhũ hóa: | A1 | trích dẫn | Mức | Link |
p = SRC / BO["chat-nhu-hoa"][0] / BO["chat-nhu-hoa"][1]
for c in bang(p):
    if re.fullmatch(r"[A-E]\d{1,2}", c[0]) and len(c) >= 3:
        muc = {"T": "mot-phan", "Đ": "tom-tat", "G": "tieu-de", "K": "tri-nho"}.get(c[2][:1], "tom-tat")
        them("chat-nhu-hoa", c[0], c[1], muc, " ".join(c[2:]))

# chất ổn định: '- Tác giả (năm). Tiêu đề. *Tạp chí*. [liên kết](url)' ; mục F: PMID EFSA
p = SRC / BO["chat-on-dinh"][0] / BO["chat-on-dinh"][1]
n = 0
for line in p.read_text(encoding="utf-8").splitlines():
    if line.startswith("- ") and re.search(r"\(\d{4}\)", line):
        n += 1
        muc = "mot-phan" if "EFSA" in line and "2018" in line and "carrageenan" in line.lower() else "tom-tat"
        them("chat-on-dinh", f"S{n}", line[2:], muc, line)
    for pm, chu in re.findall(r"(\d{8}) \(([^)]+)\)", line) if line.startswith("PubMed") else []:
        n += 1
        y = re.search(r"\d{4}", chu)
        raw.append(dict(khu="chat-on-dinh", ma=f"S{n}", trich_dan=f"EFSA Journal: đánh giá lại phụ gia – {chu}" + (" (modified starches)" if "tinh bột" in chu else ""),
                        muc_doc="tom-tat", doi=None, pmid=pm, url=f"https://pubmed.ncbi.nlm.nih.gov/{pm}/",
                        ho="efsa", nam=int(y.group(0)) if y else None))

# ---------------------------------------------------------------- khử trùng lặp
groups = []   # danh sách nhóm; mỗi nhóm là list các raw trùng nhau
def same(a, b):
    if a["doi"] and b["doi"]: return a["doi"] == b["doi"]
    if a["pmid"] and b["pmid"]: return a["pmid"] == b["pmid"]
    if a["ho"] != b["ho"] or a["nam"] != b["nam"] or not a["nam"]: return False
    ta, tb = tu(a["trich_dan"]), tu(b["trich_dan"])
    if len(ta & tb) / max(1, min(len(ta), len(tb))) < 0.85: return False
    ja, jb = re.findall(r"\*([^*]+)\*", a["trich_dan"]), re.findall(r"\*([^*]+)\*", b["trich_dan"])
    if ja and jb:   # cùng họ-năm, tiêu đề gần giống nhưng khác tạp chí -> hai bài khác nhau
        wa, wb = tu(ja[0]) or {ja[0].lower()}, tu(jb[0]) or {jb[0].lower()}
        return len(wa & wb) / max(1, min(len(wa), len(wb))) >= 0.6
    return True
for r in raw:
    for g in groups:
        if any(same(r, x) for x in g):
            g.append(r); break
    else:
        groups.append([r])

THU_TU_MUC = ["toan-van", "mot-phan", "tom-tat", "tieu-de", "tri-nho"]
nguon = []; dung = Counter()
for g in groups:
    best = min(g, key=lambda r: (THU_TU_MUC.index(r["muc_doc"]), -len(r["trich_dan"])))
    base = (best["ho"] or "nguon") + (str(best["nam"]) if best["nam"] else "")
    dung[base] += 1
    nguon.append(dict(base=base, trich_dan=best["trich_dan"], ho=best["ho"], nam=best["nam"],
                      doi=next((r["doi"] for r in g if r["doi"]), None),
                      pmid=next((r["pmid"] for r in g if r["pmid"]), None),
                      url=next((r["url"] for r in g if r["url"]), None),
                      muc_doc=best["muc_doc"], khu=sorted({r["khu"] for r in g}),
                      ma_cu=[f'{r["khu"]}:{r["ma"]}' for r in g]))
dem = Counter()
for e in nguon:
    if dung[e["base"]] > 1:
        e["khoa"] = e["base"] + "abcdefghijklmnopqrstuvwxyz"[dem[e["base"]]]; dem[e["base"]] += 1
    else:
        e["khoa"] = e["base"]
    del e["base"]
theo_ma = {m: e for e in nguon for m in e["ma_cu"]}

# ---------------------------------------------------------------- tra trích dẫn trong bài
def ung_vien(khu, h, nam):
    return [e for e in nguon if e["ho"] == h and (nam is None or e["nam"] == nam)]

def ung_vien_rong(khu, h, nam):   # thêm cả nguồn không ghi năm (vd văn bản EFSA trong danh mục chất ổn định)
    return [e for e in nguon if e["ho"] == h and (nam is None or e["nam"] in (nam, None))]

def chon(cands, khu, goi_y=""):
    if not cands: return None
    same_khu = [e for e in cands if khu in e["khu"]]
    cands = same_khu or cands
    if len(cands) == 1: return cands[0]
    if goi_y:
        w = tu5(goi_y)
        scored = sorted(cands, key=lambda e: -len(w & tu5(e["trich_dan"])))
        if len(w & tu5(scored[0]["trich_dan"])) > len(w & tu5(scored[1]["trich_dan"])):
            return scored[0]
    return None

chua_khop = []   # (khu, file, dòng, đoạn)

def thay_ma_cu(khu, s):
    """Thay mã kiểu R01/T01/C01 (nhũ tương) và R1, R14–R16 (chất béo)."""
    def key(m): e = theo_ma.get(f"{khu}:{m}"); return "@" + e["khoa"] if e else None
    if khu == "chat-beo":
        def rng(m):
            a, b = int(m.group(1)), int(m.group(2))
            ks = [key(f"R{i}") for i in range(a, b + 1)]
            return ", ".join(ks) if all(ks) else m.group(0)
        s = re.sub(r"\bR(\d{1,2})\s*[–-]\s*R(\d{1,2})\b", rng, s)
        s = re.sub(r"\bR\d{1,2}\b", lambda m: key(m.group(0)) or m.group(0), s)
    if khu == "nhu-tuong":
        s = re.sub(r"\b[RTC]\d{2}\b", lambda m: key(m.group(0)) or m.group(0), s)
    return s

HO_RE = r"[A-ZÀ-ỸĐ][A-Za-zÀ-ỹđĐ'’\-]+(?:\s(?:de|van|von|da)\s[A-Z][\w\-]+)?"
def thay_tac_gia_nam(khu, s, ten_file, so_dong, dong=""):
    """'Mackie 1999, 2000; Gunning 2004' -> '@mackie1999, @mackie2000; @gunning2004'. PMID/DOI cũng khớp."""
    def by_id(m):
        val = m.group(0)
        e = next((x for x in nguon if (x["pmid"] and x["pmid"] in val) or (x["doi"] and x["doi"] in val.lower())), None)
        return "@" + e["khoa"] if e else val
    s = re.sub(r"PMID\s*\d{6,9}|doi\s+10\.\S+", by_id, s)
    def tg(m):
        h = ho(m.group(1)); years = re.findall(r"\d{4}", m.group(2))
        after = s[m.end():m.end() + 40] + " " + dong
        keys = []
        for y in years:
            e = chon(ung_vien(khu, h, int(y)), khu, after) or chon(ung_vien_rong(khu, h, int(y)), khu, after)
            if not e: return m.group(0)
            keys.append("@" + e["khoa"])
        return ", ".join(keys)
    s = re.sub(rf"({HO_RE})(?:\s+et al\.?)?\s+((?:19|20)\d{{2}}[a-z]?(?:,\s*(?:19|20)\d{{2}}[a-z]?)*)(?!\d|;\d|/)", tg, s)
    # 'EFSA 2017, @efsa2017a' -> '@efsa2017a' (tác giả-năm thừa khi đã khớp bằng PMID/DOI)
    s = re.sub(rf"(?:{HO_RE}[ ,]+)*(?:{HO_RE})\s+(?:19|20)\d{{2}}[a-z]?,\s*(?=@)", "", s)
    # họ đứng một mình, chỉ khi họ đó là duy nhất trong danh mục của khu (vd 'Gumus', 'Abbott')
    def mot_minh(m):
        h = ho(m.group(1))
        c = [e for e in nguon if e["ho"] == h and khu in e["khu"]]
        return "@" + c[0]["khoa"] if len(c) == 1 else m.group(0)
    # chỉ xét họ đứng ở đầu một mục trích dẫn ('N: Gumus; ...'), không bắt họ nằm giữa câu ghi chú
    s = re.sub(rf"(?:(?<=^)|(?<=[NKTG]: )|(?<=; ))({HO_RE})(?=\s*(?:[;:,\]\"]|$|\s(?:dùng|ch\.|luận)))", mot_minh, s)
    return s

# ---------------------------------------------------------------- đổi nhãn
MA_DOI = {  # mã cũ -> mã mới, theo từng khu
    "nhu-tuong":    {"N": "N", "K": "K", "T": "T", "G": "G"},
    "chat-beo":     {"N": "N", "S": "K", "G": "G"},
    "chat-nhu-hoa": {"N": "N", "K": "K", "S": "G"},
}
thong_ke = defaultdict(Counter)   # khu -> Counter('S→K')
LABEL_RE = re.compile(r"`?\[(N|K|T|G|S)((?:[:;,/\s—–-])[^\]\n]*)?\](?!\()`?")

def doi_doan(khu, seg):
    seg = seg.strip()
    m = re.match(r"^(N|K|T|G|S)(?=$|[\s:,/—–-])\s*(?:[:,—–-]\s*)?(.*)$", seg, re.S)
    if not m: return seg, None
    cu, phan = m.group(1), m.group(2).strip()
    moi = MA_DOI[khu].get(cu)
    if moi is None: return seg, None
    thong_ke[khu][f"[{cu}] → [{moi}]"] += 1
    return (f"{moi}: {phan}" if phan else moi), moi

def doi_nhan(khu, inner):
    inner = inner.replace("S/K", "S; K")
    segs = [doi_doan(khu, s)[0] for s in re.split(r";", inner)]
    return "; ".join(segs)

def xu_ly_on_dinh(line, f, i):
    def rep(m):
        inner = m.group(1)
        if re.match(r"^Suy luận", inner):
            thong_ke["chat-on-dinh"]["[Suy luận…] → [G]"] += 1
            return "[G: " + thay_tac_gia_nam("chat-on-dinh", "s" + inner[1:], f, i, line) + "]"
        if re.match(r"^Giả thuyết", inner):
            thong_ke["chat-on-dinh"]["[Giả thuyết…] → [G]"] += 1
            return "[G: g" + inner[1:] + "]"
        if inner == "Nguồn":
            thong_ke["chat-on-dinh"]["[Nguồn] → [N]"] += 1; return "[N]"
        if inner.startswith("Nguồn: tác giả năm"): return m.group(0)
        if inner.startswith("Nguồn:"):
            thong_ke["chat-on-dinh"]["[Nguồn: …] → [N: …]"] += 1
            return "[N: " + thay_tac_gia_nam("chat-on-dinh", inner[6:].strip(), f, i, line) + "]"
        if re.match(rf"^{HO_RE}(?:\s+et al\.?)?\s+(?:19|20)\d{{2}}", inner) or inner.startswith("EFSA"):
            thong_ke["chat-on-dinh"]["[Tác giả năm] → [N: …]"] += 1
            return "[N: " + thay_tac_gia_nam("chat-on-dinh", inner, f, i, line) + "]"
        return m.group(0)
    return re.sub(r"\[([^\]\n\[]{2,400})\](?!\()", rep, line)

def xu_ly(khu, text, ten_file):
    out = []; in_code = False
    for i, line in enumerate(text.splitlines(), 1):
        if line.strip().startswith("```"): in_code = not in_code
        if in_code: out.append(line); continue
        if re.match(r"^Nhãn: .*\[N\]", line) or line.startswith("> Quy ước nguồn"):   # dòng chú giải nhãn cũ: web có trang quy ước chung
            continue
        if khu == "chat-on-dinh":
            line = xu_ly_on_dinh(line, ten_file, i)
        else:
            def rep(m):
                inner = m.group(1) + (m.group(2) or "")
                new = doi_nhan(khu, inner)
                new = thay_ma_cu(khu, new)
                if khu == "chat-nhu-hoa" or "PubMed" in new or "PMID" in new:
                    new = thay_tac_gia_nam(khu, new, ten_file, i, line)
                return "[" + new + "]"
            line = LABEL_RE.sub(rep, line)
        out.append(line)
    return re.sub(r"\n{3,}", "\n\n", "\n".join(out)) + "\n"

# ---------------------------------------------------------------- front-matter
def front_matter(khu, ten, text):
    fm = {}
    body = text
    if text.startswith("---\n"):
        end = text.index("\n---", 4)
        for l in text[4:end].splitlines():
            if ":" in l:
                k, v = l.split(":", 1); fm[k.strip()] = v.strip()
        body = text[end + 4:].lstrip("\n")
    m = re.search(r"^#\s+(.+)$", body, re.M)
    title = fm.get("title") or (re.sub(r"^\d+\.\s*", "", m.group(1)).strip() if m else ten)
    so = int(re.match(r"\d+", ten).group(0))
    slug = fm.get("slug") or re.sub(r"^\d+-", "", ten[:-3])
    if ten in (BO[khu][1],): loai = "nguon"
    elif so == 0: loai = "muc-luc"
    elif "ke-hoach" in ten: loai = "ke-hoach"
    elif "thuat-ngu" in ten: loai = "thuat-ngu"
    else: loai = "bai"
    new = {"title": title, "slug": slug, "khu": khu, "thu_tu": so, "loai": loai,
           "hien_tren_web": "false" if loai in ("nguon", "ke-hoach") else "true"}
    for k in ("level", "tags"):
        if k in fm: new[k] = fm[k]
    new["updated"] = fm.get("updated", NGAY)
    new["nguon_goc"] = f"{BO[khu][0]}/{ten}"
    lines = ["---"] + [f"{k}: {json.dumps(v, ensure_ascii=False) if k == 'title' else v}" for k, v in new.items()] + ["---", ""]
    return "\n".join(lines) + body, bool(text.startswith("---\n"))

# ---------------------------------------------------------------- chạy
co_fm = 0; them_fm = 0; tep = []
for khu, (thu_muc, _, giu) in BO.items():
    for f in sorted((SRC / thu_muc).glob("*.md")):
        text = f.read_text(encoding="utf-8")
        if f.name not in giu:
            text = xu_ly(khu, text, f.name)
        text, had = front_matter(khu, f.name, text)
        co_fm += had; them_fm += (not had)
        dst = OUT / "noi-dung" / khu / f.name
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(text, encoding="utf-8")
        tep.append((khu, f.name, text, f.name in giu))

# ---------------------------------------------------------------- kiểm tự động
khoa_set = {e["khoa"] for e in nguon}
loi_khoa = []; pubmed_le = []; con_ma_cu = []; n_khong_khoa = Counter(); n_co_khoa = Counter(); muc_dem = defaultdict(Counter)
CANON = re.compile(r"\[(N|K|T|G)(?:[:;][^\]\n]*)?\](?!\()")
for khu, ten, text, giu in tep:
    if giu: continue
    for i, line in enumerate(text.splitlines(), 1):
        for m in re.finditer(r"@([a-z]+\d{0,4}[a-z]?)", line):
            if m.group(1) not in khoa_set: loi_khoa.append((khu, ten, i, m.group(0)))
        for m in CANON.finditer(line):
            whole = m.group(0)
            for seg in whole[1:-1].split(";"):
                c = seg.strip()[:1]
                if c in "NKTG" and (len(seg.strip()) == 1 or seg.strip()[1] in ": "):
                    muc_dem[khu][c] += 1
            if whole.startswith("[N"):
                (n_co_khoa if "@" in whole else n_khong_khoa)[f"{khu}/{ten}"] += 1
            # tác giả-năm hoặc mã cũ còn sót trong nhãn N
            if whole.startswith("[N") and re.search(rf"{HO_RE}\s+(?:19|20)\d{{2}}|\bR\d{{1,2}}\b|PMID \d", whole):
                chua_khop.append((khu, ten, i, whole))
            if re.search(r"PubMed \d{6,9}", whole):
                pubmed_le.append((khu, ten, i, whole))
        if khu == "chat-on-dinh":
            for m in re.finditer(r"\[(Suy luận|Giả thuyết|Nguồn)[^\]]*\]", line):
                if "tác giả năm" not in m.group(0): con_ma_cu.append((khu, ten, i, m.group(0)))
        else:
            for m in re.finditer(r"\[S(?=[\]:;,/\s])[^\]]*\](?!\()", line):
                con_ma_cu.append((khu, ten, i, m.group(0)))

# ---------------------------------------------------------------- xuất danh mục
(OUT / "nguon").mkdir(parents=True, exist_ok=True)
nguon.sort(key=lambda e: e["khoa"])
(OUT / "nguon" / "nguon.json").write_text(json.dumps(nguon, ensure_ascii=False, indent=1), encoding="utf-8")
TEN_MUC = {"toan-van": "Đọc toàn văn", "mot-phan": "Đọc một phần / trang gốc", "tom-tat": "Đọc tóm tắt",
           "tieu-de": "Chỉ thấy tiêu đề", "tri-nho": "Ghi từ trí nhớ, chưa kiểm"}
with open(OUT / "nguon" / "nguon.csv", "w", encoding="utf-8-sig", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["Khóa", "Trích dẫn", "Năm", "DOI", "PMID", "Đường dẫn", "Mức đọc", "Khu dùng", "Mã cũ"])
    for e in nguon:
        w.writerow([e["khoa"], e["trich_dan"], e["nam"] or "", e["doi"] or "", e["pmid"] or "", e["url"] or "",
                    TEN_MUC[e["muc_doc"]], ", ".join(TEN_KHU[k] for k in e["khu"]), "; ".join(e["ma_cu"])])

# ---------------------------------------------------------------- báo cáo
R = []
R.append(f"# Báo cáo chuẩn hóa nội dung — {NGAY}\n")
R.append("Sinh tự động bởi `cong-cu/chuan_hoa.py`. File gốc trong `tai-lieu-*` **không bị sửa**; bản chuẩn hóa nằm ở `noi-dung/`.\n")
tong_raw = len(raw); tong = len(nguon); trung = [e for e in nguon if len(e["ma_cu"]) > 1]
R.append("**Nhãn sau chuẩn hóa trông như sau:** `[N: @moens2018, @petrut2015]` (có nguồn, bấm ra thẻ nguồn) · `[K]` (sách nền) · `[G: suy luận]` · `[T]` · nhãn ghép `[K; N: @mcclements2007]`. Mỗi `@khóa` là một dòng trong `nguon/nguon.csv`.\n")
R.append("## 1. Kết quả chính\n")
R.append(f"- Nhãn: {sum(sum(c.values()) for c in thong_ke.values())} lượt đổi; còn sót nhãn cũ: **{len(con_ma_cu)}**.")
R.append(f"- Nguồn: {tong_raw} dòng ở 4 danh mục → **{tong} nguồn** sau khi gộp ({len(trung)} nguồn xuất hiện ở hơn một danh mục).")
R.append(f"- Mã nguồn trỏ sai (có @khóa nhưng không có trong danh mục): **{len(loi_khoa)}**.")
R.append(f"- Trích dẫn trong bài chưa khớp được với danh mục: **{len(chua_khop)}** (liệt kê ở mục 5).")
R.append(f"- Front-matter: {co_fm} file đã có (bổ sung trường), {them_fm} file được thêm mới.\n")
R.append("## 2. Bảng quy đổi nhãn (số lượt đổi thực tế)\n")
R.append("| Khu | Nhãn cũ → nhãn mới | Số lượt |\n|---|---|---|")
for khu in BO:
    for k, v in sorted(thong_ke[khu].items(), key=lambda x: -x[1]):
        R.append(f"| {TEN_KHU[khu]} | {k} | {v} |")
R.append("\nNghĩa nhãn mới: **N** có nguồn · **T** tính minh họa · **K** sách nền, chờ đối chiếu trang · **G** suy luận/giả thuyết.\n")
R.append("## 3. Phân bố nhãn sau chuẩn hóa (đếm từng đoạn nhãn)\n")
R.append("| Khu | N có nguồn | T tính | K sách nền | G suy luận | Nhãn N có @khóa | Nhãn N chưa gắn khóa |\n|---|---|---|---|---|---|---|")
for khu in BO:
    c = muc_dem[khu]
    co = sum(v for k, v in n_co_khoa.items() if k.startswith(khu + "/"))
    ko = sum(v for k, v in n_khong_khoa.items() if k.startswith(khu + "/"))
    R.append(f"| {TEN_KHU[khu]} | {c['N']} | {c['T']} | {c['K']} | {c['G']} | {co} | {ko} |")
R.append("\n\"Nhãn N chưa gắn khóa\" là câu ghi `[N]` trơn: có nguồn nhưng bài gốc không nói nguồn nào. Trên web sẽ hiện huy hiệu xanh nhưng chưa bấm ra được thẻ nguồn; cần gắn tay dần.\n")
R.append("## 4. Danh mục nguồn chung\n")
md = Counter(e["muc_doc"] for e in nguon)
R.append("| Mức đọc | Số nguồn |\n|---|---|")
for k in THU_TU_MUC: R.append(f"| {TEN_MUC[k]} | {md[k]} |")
R.append(f"\nCó DOI: {sum(1 for e in nguon if e['doi'])} · Có PMID: {sum(1 for e in nguon if e['pmid'])} · Chỉ có đường dẫn (thường là trang Consensus): {sum(1 for e in nguon if not e['doi'] and not e['pmid'] and e['url'])} · Không có định danh nào: {sum(1 for e in nguon if not e['doi'] and not e['pmid'] and not e['url'])}\n")
R.append("### Nguồn trùng giữa các danh mục (đã gộp thành một)\n")
R.append("| Khóa mới | Mã cũ | Trích dẫn |\n|---|---|---|")
for e in trung: R.append(f"| {e['khoa']} | {'; '.join(e['ma_cu'])} | {e['trich_dan'][:110]} |")
R.append("\n## 5. Trích dẫn chưa khớp (cần xem tay)\n")
if chua_khop:
    R.append("Số dòng tính trong bản chuẩn hóa ở `noi-dung/`.\n")
    R.append("| Khu | File:dòng | Nhãn |\n|---|---|---|")
    for khu, ten, i, s in chua_khop: R.append(f"| {TEN_KHU[khu]} | {ten}:{i} | `{s[:120]}` |")
else: R.append("Không có.")
R.append("\n### Trích PubMed trực tiếp (bài chỉ liệt kê, chưa vào danh mục — giữ nguyên, web sẽ link thẳng PubMed)\n")
R.append("\n".join(f"- {TEN_KHU[k]} {t}:{i} `{s}`" for k, t, i, s in pubmed_le) or "Không có.")
R.append("\n## 6. Nhãn cũ còn sót\n")
R.append("\n".join(f"- {TEN_KHU[k]} {t}:{i} `{s}`" for k, t, i, s in con_ma_cu) or "Không có.")
R.append("\n## 7. Mã @khóa trỏ sai\n")
R.append("\n".join(f"- {TEN_KHU[k]} {t}:{i} `{s}`" for k, t, i, s in loi_khoa) or "Không có.")
R.append("\n## 8. File nào lên web\n")
R.append("| Khu | File | Loại | Lên web |\n|---|---|---|---|")
for khu, ten, text, giu in tep:
    loai = re.search(r"^loai: (.+)$", text, re.M).group(1); hien = re.search(r"^hien_tren_web: (.+)$", text, re.M).group(1)
    R.append(f"| {TEN_KHU[khu]} | {ten} | {loai} | {'có' if hien == 'true' else 'không (gộp vào trang Nguồn / tài liệu nội bộ)'} |")
R.append("\nFile mục lục (00) giữ nguyên chữ, chưa đổi nhãn: phần \"quy ước nhãn\" trong đó sẽ được thay bằng một trang quy ước chung khi dựng web.\n")
(OUT / "BAO-CAO-CHUAN-HOA.md").write_text("\n".join(R) + "\n", encoding="utf-8")
print(f"raw={tong_raw} nguon={tong} trung={len(trung)} con_ma_cu={len(con_ma_cu)} loi_khoa={len(loi_khoa)} chua_khop={len(chua_khop)}")
