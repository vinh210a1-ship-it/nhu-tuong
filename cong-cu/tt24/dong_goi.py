"""Gộp kết quả tách TT24 thành 2 tệp:
  - <day_du.json>: đầy đủ (dùng cho luồng khác, kiểm tra)
  - public/du-lieu/tt24.json: bản gọn cho trang Tra cứu
Chạy: python3 -I dong_goi.py <tt24.json từ tach_tt24.py> <pl1.json từ pl1_toa_do> <day_du.json> <gon.json>"""
import sys, json, re, collections
t = json.load(open(sys.argv[1], encoding='utf-8'))
pl1 = json.load(open(sys.argv[2], encoding='utf-8'))
assert len(pl1) == 400 and [x['stt'] for x in pl1] == list(range(1, 401)), 'Phụ lục 1 phải đủ 400 dòng liên tục'
t['phu_luc_1'] = pl1
json.dump(t, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# tên nhóm thực phẩm: lấy cách viết hay gặp nhất trong Phụ lục 2A, bổ sung từ Phụ lục 3 mục 2
ten = collections.defaultdict(collections.Counter)
for k in t['phu_luc_2a']:
    for r in k['dong']: ten[r['ma']][r['ten']] += 1
for c in t['phu_luc_3_nhom']:
    ten[c['ma']][re.sub(r'\s*\(Chỉ áp dụng.*$', '', c['ten'])] += 0.5
nhom_tp = {ma: c.most_common(1)[0][0] for ma, c in sorted(ten.items(), key=lambda x: [int(p) for p in x[0].split('.')])}
gon = {
    'van_ban': t['van_ban'],
    'pl1': [[x['ins'], x['ten_vi'], x['ten_en'], x['chuc_nang']] for x in pl1],
    'gmp': [x['ins'] for x in t['phu_luc_3']],
    'gmp_nhom': [[c['ma'], c['ten']] for c in t['phu_luc_3_nhom']],
    'nhom_tp': nhom_tp,
    'a2': [[k['nhom'], k['ins'], [[r['ma'], r['ml'], r['gc']] for r in k['dong']]] for k in t['phu_luc_2a']],
    'b2': [[k['nhom'], k['ins'], [[r['ten'], r['ml'], r['gc']] for r in k['dong']]] for k in t['phu_luc_2b']],
    'gc': t['ghi_chu'],
}
json.dump(gon, open(sys.argv[4], 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('nhóm TP', len(nhom_tp), 'GMP', len(gon['gmp']), 'GMP nhóm', len(gon['gmp_nhom']))
