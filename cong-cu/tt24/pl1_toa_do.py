"""Tách Phụ lục 1 bằng toạ độ chữ (pdfplumber). Chạy: python3 -I pl1_toa_do.py <pdf> <tu_trang> <den_trang> <out.json>"""
import sys, re, json, pdfplumber
pdf = pdfplumber.open(sys.argv[1]); a, b = int(sys.argv[2]), int(sys.argv[3])
rows, cur = [], None
for pi in range(a, b + 1):
    pg = pdf.pages[pi]
    words = pg.extract_words(keep_blank_chars=False, use_text_flow=False, x_tolerance=1.5)
    for w in words: w['pi'] = pi
    # mốc cột từ tiêu đề trên trang đầu; các trang sau dùng lại
    for w in words:
        if w['text'] == 'Tiếng' : pass
    hdr = {}
    for w in words:
        if w['text'] in ('Chức',): hdr['cn'] = w['x0']
    if 'cn' in hdr: X_CN = hdr['cn'] - 8
    # gom theo dòng
    lines = {}
    for w in words:
        k = round(w['top'] / 3)
        lines.setdefault(k, []).append(w)
    for k in sorted(lines):
        ws = sorted(lines[k], key=lambda w: w['x0'])
        txt = ' '.join(w['text'] for w in ws)
        if re.fullmatch(r'\d{1,3}', txt.strip()) and ws[0]['x0'] > 250: continue  # số trang
        m = re.match(r'^(\d{1,3})\.$', ws[0]['text'])
        if m and len(ws) > 1 and re.match(r'^E?\d{3,4}[a-z]?(\([ivx]+\))?$', ws[1]['text']):
            cur = {'stt': int(m.group(1)), 'ins': ws[1]['text'], 'w': []}; rows.append(cur)
            ws = ws[2:]
        if cur is None: continue
        if ws and ws[0]['x0'] < 60 and not m: continue
        cur['w'].extend(ws)
print('rows', len(rows))
# xác định ranh giới cột từ phân bố x0: dùng mốc cố định đo từ tiêu đề trang đầu
p0 = pdf.pages[a]
hw = p0.extract_words()
def x_of(t, after=None):
    for w in hw:
        if w['text'] == t: return w['x0']
xs = [w for w in hw if w['text'] == 'Tiếng']
x_vi, x_en = sorted(w['x0'] for w in xs)[:2]
x_cn = x_of('Chức')
print('mốc', x_vi, x_en, x_cn)
json.dump({'rows': [{'stt': r['stt'], 'ins': r['ins'], 'w': [[w['x0'], w['top'] + 10000 * w['pi'], w['text']] for w in r['w']]} for r in rows], 'x': [x_vi, x_en, x_cn]}, open(sys.argv[4], 'w'), ensure_ascii=False)
