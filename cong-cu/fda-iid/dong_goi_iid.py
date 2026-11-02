"""Gói FDA Inactive Ingredient Database (IIR_OCOMM.xlsx) thành JSON gọn cho trang tra cứu tá dược.
Chạy: python3 -I dong_goi_iid.py <IIR_OCOMM.xlsx> <out.json> <nhãn phiên bản, vd 2026-10>"""
import sys, json, openpyxl, collections
wb = openpyxl.load_workbook(sys.argv[1], read_only=True)
ws = wb.worksheets[0]
rows = list(ws.iter_rows(values_only=True))
hdr = rows[0]
assert hdr[:9] == ('INGREDIENT_NAME', 'ROUTE', 'DOSAGE_FORM', 'CAS_NUMBER', 'UNII', 'POTENCY_AMOUNT', 'POTENCY_UNIT', 'MAXIMUM_DAILY_EXPOSURE', 'MAXIMUM_DAILY_EXPOSURE_UNIT'), hdr
def so(x):
    if x is None or x == '': return None
    if isinstance(x, float) and x.is_integer(): return int(x)
    return x
chat = collections.OrderedDict()
for r in rows[1:]:
    if not r[0]: continue
    ten = str(r[0]).strip()
    c = chat.setdefault(ten, {'cas': None, 'unii': None, 'd': []})
    if r[3] and not c['cas']:
        cas = str(r[3]).strip()
        if cas.isdigit() and len(cas) > 3: cas = f'{cas[:-3]}-{cas[-3:-1]}-{cas[-1]}'  # 9004642 -> 9004-64-2
        c['cas'] = cas
    if r[4] and not c['unii']: c['unii'] = str(r[4]).strip()
    c['d'].append([r[1] or '', r[2] or '', so(r[5]), r[6] or '', so(r[7]), r[8] or ''])
out = {'phien_ban': sys.argv[3], 'so_dong': sum(len(c['d']) for c in chat.values()),
       'chat': [[ten, c['cas'], c['unii'], c['d']] for ten, c in chat.items()]}
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('chất', len(chat), 'dòng', out['so_dong'])
