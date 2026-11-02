"""Tách văn bản hợp nhất 09/VBHN-BYT (2024) của TT 24/2019/TT-BYT thành JSON.
Chạy: python3 -I tach_tt24.py <vbhn.txt (pdftotext -layout)> <out.json>"""
import re, sys, json

L = open(sys.argv[1], encoding='utf-8').read().replace('\f', '\n').split('\n')

def tim(s, tu=0):
    for i in range(tu, len(L)):
        if L[i].strip() == s: return i
    raise SystemExit('không thấy ' + s)

i1 = tim('PHỤ LỤC 1'); i2a = tim('PHỤ LỤC 2A'); i2b = tim('PHỤ LỤC 2B')
ign = next(i for i in range(i2b, len(L)) if 'GIẢI THÍCH GHI CHÚ TẠI PHỤ LỤC 2A' in L[i])
i3 = tim('PHỤ LỤC 3', ign); i4 = tim('PHỤ LỤC 4', i3)

TRANG = re.compile(r'^\s{20,}\d{1,4}\s*$')       # số trang (thụt sâu)
CHAN = re.compile(r'^\s{0,14}\d{1,3}\s*$')       # mốc chú thích chân trang (thụt nông)

def bo_chu_thich(dong):
    """Bỏ số trang và khối chú thích chân trang của văn bản hợp nhất."""
    ra, i, chu_thich = [], 0, []
    while i < len(dong):
        d = dong[i]
        if TRANG.match(d): i += 1; continue
        if CHAN.match(d) and i + 1 < len(dong) and re.search(r'(được|bị) (sửa đổi|bổ sung|bãi bỏ|thay thế)|theo quy định tại|Thông tư', ' '.join(dong[i+1:i+4])):
            j = i + 1
            khoi = []
            while j < len(dong) and not TRANG.match(dong[j]):
                khoi.append(dong[j].strip()); j += 1
            chu_thich.append({'so': d.strip(), 'noi_dung': ' '.join(khoi)})
            i = j; continue
        ra.append(d); i += 1
    return ra, chu_thich

def gop(ds): return re.sub(r'\s+', ' ', ' '.join(ds)).strip()
SUP = re.compile(r'(?<=[A-Za-z\)])\d{1,3}$')    # số chú thích dính sau tên (CURCUMIN10)

# ---------- Phụ lục 1: STT INS Tên Việt Tên Anh Chức năng (cột theo vị trí)
def phu_luc_1(dong):
    ds, cur = [], None
    for d in dong:
        m = re.match(r'^(\d{1,3})\.\s+(\S+)\s+(.*)$', d)
        if m and re.match(r'^E?\d{3,4}[a-z]?(\([ivx]+\))?$', m.group(2)):
            if cur: ds.append(cur)
            cur = {'stt': int(m.group(1)), 'ins': m.group(2), 'col': [[], [], []], 'dong': []}
            cur['dong'].append(d)
        elif cur and d.strip():
            cur['dong'].append(d)
    if cur: ds.append(cur)
    # cắt cột theo vị trí ký tự của dòng đầu: tìm các khúc cách ≥2 dấu cách
    out = []
    for c in ds:
        vi, en, cn = [], [], []
        dau = c['dong'][0]
        m = re.match(r'^(\d{1,3}\.\s+\S+\s+)', dau)
        p0 = len(m.group(1))
        # vị trí cột: lấy từ dòng đầu, các khúc cách ≥ 2 sau p0
        manh = [(mm.start(), mm.group()) for mm in re.finditer(r'\S+(?: \S+)*', dau[p0:])]
        # đặt mốc cột Anh và Chức năng
        if len(manh) >= 3:
            x_en = p0 + manh[1][0]; x_cn = p0 + manh[-1][0]
        elif len(manh) == 2:
            x_en = p0 + manh[1][0]; x_cn = 10**6
        else:
            x_en = x_cn = 10**6
        for d in c['dong']:
            dd = d.ljust(x_cn + 1)
            vi.append(dd[p0 if d is dau else 0:x_en] if d is dau else dd[:x_en])
            en.append(dd[x_en:x_cn]); cn.append(dd[x_cn:])
        out.append({'stt': c['stt'], 'ins': c['ins'], 'ten_vi': gop(vi), 'ten_en': gop(en), 'chuc_nang': gop(cn)})
    return out

# ---------- Phụ lục 2A: khối nhóm chất
DONG_2A = re.compile(r'^\s{0,4}(\d{2}\.\d(?:\.\d{1,2})*)\s{2,}(.*?)\s{2,}(GMP|\d[\d.,]*)(?:\s{2,}(.*))?\s*$')
def phu_luc_2(dong, co_ma=True):
    khoi, cur, mode = [], None, None
    i = 0
    while i < len(dong):
        d = dong[i]; s = d.strip()
        if s.startswith('INS') and 'Tên phụ gia' in s:
            # tiêu đề nhóm là các dòng chữ in hoa ngay trên
            k = len(khoi_tieu_de)
            cur = {'nhom': SUP.sub('', gop(khoi_tieu_de)), 'ins': [], 'dong': []}
            khoi.append(cur); mode = 'ins'; khoi_tieu_de.clear(); i += 1; continue
        if mode == 'ins':
            m = re.match(r'^(\d{3,4}[a-z]?(?:\([ivx]+\))?)\s+(.*)$', s)
            if m: cur['ins'].append([m.group(1), m.group(2).strip()]); i += 1; continue
            if s and cur['ins'] and not s.startswith(('Mã nhóm', 'Nhóm thực phẩm')) and d.startswith(' ' * 6):
                cur['ins'][-1][1] += ' ' + s; i += 1; continue
            if s.startswith(('Mã nhóm', 'Nhóm thực phẩm')): mode = 'bang'; i += 1; continue
        if mode == 'bang':
            if s in ('thực phẩm', '(mg/kg)') or re.match(r'^thực phẩm\s+\(mg/kg\)$', s) or s == '' or s.startswith('Mã nhóm') or (s.startswith('Nhóm thực phẩm') and 'ML' in s):
                i += 1; continue
            if co_ma:
                m = DONG_2A.match(d)
                if m:
                    cur['dong'].append({'ma': m.group(1), 'ten': m.group(2).strip(), 'ml': m.group(3), 'gc': (m.group(4) or '').strip()}); i += 1; continue
                m2 = re.match(r'^\s{0,4}(\d{2}\.\d(?:\.\d{1,2})*)\s{2,}(.*)$', d)
            else:
                m = re.match(r'^(\S.*?)\s{2,}(GMP|\d[\d.,]*)(?:\s{2,}(.*))?\s*$', d)
                if m and not d.startswith(' '):
                    cur['dong'].append({'ten': m.group(1).strip(), 'ml': m.group(2), 'gc': (m.group(3) or '').strip()}); i += 1; continue
            # tiêu đề nhóm mới? (chữ in hoa, không thụt)
            if re.match(r'^[A-Z0-9][A-Z0-9 ,\-\'’().&/:;]+$', s) and not d.startswith('  ') and not re.match(r'^[\d.,& XSR]+$', s):
                khoi_tieu_de.append(s); mode = None; i += 1; continue
            # dòng nối tiếp: tên nhóm (cột giữa) và/hoặc ghi chú (cột phải)
            if cur and cur['dong']:
                last = cur['dong'][-1]
                if co_ma:
                    phan = re.split(r'\s{2,}', s)
                    if d.startswith(' ' * 8) and len(d) - len(d.lstrip()) > 40 and len(phan) == 1:
                        last['gc'] = (last['gc'] + ' ' + s).strip()
                    else:
                        last['ten'] += ' ' + phan[0]
                        if len(phan) > 1: last['gc'] = (last['gc'] + ' ' + ' '.join(phan[1:])).strip()
                else:
                    phan = re.split(r'\s{2,}', s)
                    if len(d) - len(d.lstrip()) > 40: last['gc'] = (last['gc'] + ' ' + s).strip()
                    else:
                        last['ten'] += ' ' + phan[0]
                        if len(phan) > 1: last['gc'] = (last['gc'] + ' ' + ' '.join(phan[1:])).strip()
            i += 1; continue
        if mode is None:
            if re.match(r'^[A-Z0-9][A-Z0-9 ,\-\'’().&/:;]+\d*$', s) and not d.startswith('   '):
                khoi_tieu_de.append(s)
            elif s and khoi_tieu_de and not d.startswith('   '):
                khoi_tieu_de.append(s)
        i += 1
    for k in khoi:
        for r in k['dong']:
            r['ten'] = re.sub(r'\s+', ' ', r['ten']).strip()
            r['gc'] = re.sub(r'\s*&\s*', ' & ', re.sub(r'\s+', ' ', r['gc'])).strip()
    return khoi
khoi_tieu_de = []

MO_DAU = re.compile(r'^(Chỉ|Không|Đối|Sử dụng|Tính|Trừ|Ngoại|Mức|Khi|Dùng|Được|Áp|Theo|Riêng|Hàm|Bao|Tổng|Có|Cho|Ngoài|Kể|Loại|Giới|Xử|Tồn|Các|Phù|Lượng|Thời|Nếu|Nồng|Dư|Ví|Với|Hoặc)\b')
def ghi_chu(dong):
    """Số ghi chú có thể nằm giữa khối nhiều dòng (căn giữa theo chiều dọc)."""
    out, cur = [], None
    for d in dong:
        s = d.strip()
        if not s or s.startswith(('Số ghi chú', 'GIẢI THÍCH')): continue
        m = re.match(r'^\s{0,8}(\d{1,3})(?:\s{2,}(\S.*))?$', d)
        if m:
            so, chu = m.group(1), (m.group(2) or '').strip()
            if chu:
                cur = [so, [chu]]; out.append(cur)
            elif cur is not None and cur[0] is None:
                cur[0] = so
            else:
                cur = [so, []]; out.append(cur)
            continue
        if MO_DAU.match(s) and cur is not None and cur[0] is not None and cur[1]:
            cur = [None, [s]]; out.append(cur); continue
        if cur is not None: cur[1].append(s)
    thieu = [' '.join(t) for so, t in out if so is None]
    if thieu: print('GHI CHÚ KHÔNG SỐ:', thieu[:3])
    return {so: re.sub(r'\s+', ' ', ' '.join(t)).strip() for so, t in out if so}

def phu_luc_3(dong):
    ds, nhom, muc2, cur = [], [], False, None
    for d in dong:
        s = d.strip()
        if s.startswith('2. Đối tượng thực phẩm'): muc2 = True; continue
        if not muc2:
            m = re.match(r'^(\d{1,3})\s+(\d{3,4}[a-z]?(?:\([ivx]+\))?)\s+(.*)$', s)
            if m: ds.append({'stt': int(m.group(1)), 'ins': m.group(2), 'ten': m.group(3).strip()})
            continue
        m = re.match(r'^(\d{2}\.\d(?:\.\d{1,2})*)\s+(.*)$', s)
        if m and not d.startswith('    '):
            cur = {'ma': m.group(1), 'ten': m.group(2).strip()}; nhom.append(cur)
        elif cur and s and d.startswith('    '):
            cur['ten'] += ' ' + s
    for c in nhom: c['ten'] = re.sub(r'\s+', ' ', c['ten'])
    return ds, nhom

def phu_luc_4(dong):
    out, cur = [], None
    for d in dong:
        m = re.match(r'^\s{0,2}(\d{2}\.\d(?:\.\d{1,2})*)\s+(.*)$', d)
        if m:
            cur = {'ma': m.group(1), 'ten': [], 'x': None}
            out.append(cur)
            rest = d[m.start(2):]
            cur['x'] = m.start(2)
            phan = re.split(r'\s{2,}|(?<=\S) (?=[A-ZĐ][a-zà-ỹ]+ )', rest.strip(), maxsplit=1)
            cur['ten'].append(re.split(r'\s{2,}', rest.strip())[0])
            continue
        if cur and d.strip() and len(d) - len(d.lstrip()) <= cur['x'] + 1 and len(d) - len(d.lstrip()) >= cur['x'] - 1:
            seg = re.split(r'\s{2,}', d.strip())[0]
            if len(cur['ten']) < 4: cur['ten'].append(seg)
    return [{'ma': c['ma'], 'ten_tho': gop(c['ten'])} for c in out]

p1, ct1 = bo_chu_thich(L[i1:i2a])
p2a, ct2a = bo_chu_thich(L[i2a:i2b])
p2b, ct2b = bo_chu_thich(L[i2b:ign])
pgc, _ = bo_chu_thich(L[ign:i3])
_xs = next((k for k, d in enumerate(pgc) if re.match(r'^\s?XS\d', d)), len(pgc))
pgc = pgc[:max(0, _xs - 1)]
p3, ct3 = bo_chu_thich(L[i3:i4])
p4, _ = bo_chu_thich(L[i4:])
khoi_tieu_de.clear(); a2 = phu_luc_2(p2a, True)
khoi_tieu_de.clear(); b2 = phu_luc_2(p2b, False)
out = {
    'van_ban': 'Văn bản hợp nhất 09/VBHN-BYT (2024) của Thông tư 24/2019/TT-BYT (sửa đổi bởi TT 17/2023/TT-BYT, TT 08/2024/TT-BYT)',
    'phu_luc_1': phu_luc_1(p1), 'phu_luc_2a': a2, 'phu_luc_2b': b2,
    'ghi_chu': ghi_chu(pgc), 'phu_luc_3': phu_luc_3(p3)[0], 'phu_luc_3_nhom': phu_luc_3(p3)[1], 'phu_luc_4': phu_luc_4(p4),
    'chu_thich_sua_doi': ct1 + ct2a + ct2b + ct3,
}
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('PL1', len(out['phu_luc_1']), 'PL2A khối', len(a2), 'dòng', sum(len(k['dong']) for k in a2),
      'PL2B khối', len(b2), 'dòng', sum(len(k['dong']) for k in b2), 'ghi chú', len(out['ghi_chu']),
      'PL3', len(out['phu_luc_3']), 'PL3 nhóm', len(out['phu_luc_3_nhom']), 'PL4', len(out['phu_luc_4']), 'chú thích sửa đổi', len(out['chu_thich_sua_doi']))
