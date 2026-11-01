"""Vẽ hình minh họa trang chủ: giọt dầu trong nước, có màng chất nhũ hóa (đầu ưa nước ra ngoài, đuôi kỵ nước cắm vào dầu).
Màu lấy từ biến CSS (--hh-*) nên tự đổi theo nền sáng/tối. Chạy: python3 scripts/ve-hinh-nhu-tuong.py > src/assets/nhu-tuong.svg
"""
import math, random
random.seed(7)
W, H = 480, 410
o = []
def p(s): o.append(s)

p(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Sơ đồ nhũ tương dầu trong nước: giọt dầu được bao bởi màng chất nhũ hóa, đầu ưa nước hướng ra pha nước, đuôi kỵ nước cắm vào giọt dầu" class="hinh-nhu-tuong">')
p('<defs><radialGradient id="dau" cx="38%" cy="34%" r="70%">'
  '<stop offset="0" style="stop-color:var(--hh-dau-sang)"/><stop offset="1" style="stop-color:var(--hh-dau)"/></radialGradient></defs>')

giot = [(215, 205, 112), (78, 92, 46), (382, 92, 34), (380, 318, 42), (70, 318, 30), (300, 48, 17)]

VUNG_CHU = [(150, 6, 320, 34), (130, 372, 300, 404), (330, 124, 460, 154)]
def va_cham(x, y, m=14):
    if any(a - 6 <= x <= c + 6 and b - 6 <= y <= d + 6 for a, b, c, d in VUNG_CHU): return True
    return any(math.hypot(x - a, y - b) < r + m for a, b, r in giot)

# phân tử nước rải nền
for _ in range(400):
    if len([s for s in o if 'class="nuoc"' in s]) >= 26: break
    x, y = random.uniform(12, W - 12), random.uniform(12, H - 12)
    if va_cham(x, y): continue
    g = random.uniform(0, 360)
    p(f'<g class="nuoc" transform="translate({x:.1f} {y:.1f}) rotate({g:.0f})">'
      '<line x1="0" y1="0" x2="-5.2" y2="4.1"/><line x1="0" y1="0" x2="5.2" y2="4.1"/>'
      '<circle r="3.4" class="o"/><circle cx="-5.2" cy="4.1" r="2.1" class="h"/><circle cx="5.2" cy="4.1" r="2.1" class="h"/></g>')

def duoi(cx, cy, r, goc, dai):
    # đuôi zigzag từ bề mặt cắm vào trong
    pts = []
    n = 5
    for i in range(n + 1):
        t = i / n
        rr = r - 1 - t * dai
        lech = (2.6 if i % 2 else -2.6) if 0 < i < n else 0
        a = goc + lech / max(rr, 1)
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return ' '.join(pts)

for (cx, cy, r) in giot:
    p(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#dau)" class="giot"/>')
    buoc = 13 if r > 25 else 11
    n = max(8, int(2 * math.pi * r / buoc))
    dai = min(18, r * 0.42)
    for i in range(n):
        a = 2 * math.pi * i / n
        p(f'<polyline class="duoi" points="{duoi(cx, cy, r, a, dai)}"/>')
        hr = 4.2 if r > 25 else 3.4
        p(f'<circle class="dau-ua-nuoc" cx="{cx + (r + hr) * math.cos(a):.1f}" cy="{cy + (r + hr) * math.sin(a):.1f}" r="{hr}"/>')

# hai phân tử triacylglycerol (TAG) cách điệu trong giọt lớn: khung glycerol + 3 mạch acyl
def tag(x, y, s=1.0):
    p(f'<g class="tag" transform="translate({x} {y}) scale({s})"><line x1="0" y1="0" x2="0" y2="28"/>')
    for k, yy in enumerate((0, 14, 28)):
        pts = ' '.join(f'{6 + j * 7},{yy + (-3 if j % 2 else 3)}' for j in range(8))
        p(f'<polyline points="0,{yy} {pts}"/>')
    p('</g>')
tag(165, 168, 1.0)
tag(200, 222, 0.9)

# chú thích kiểu sơ đồ giáo khoa
def ghi(x1, y1, x2, y2, chu, neo='start', dy=5):
    p(f'<line class="chi" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/><circle class="chi-dau" cx="{x1}" cy="{y1}" r="2"/>')
    dx = {'start': 4, 'end': -4, 'middle': 0}[neo]
    p(f'<text class="nhan-hinh" x="{x2 + dx}" y="{y2 + dy}" text-anchor="{neo}">{chu}</text>')
ghi(215, 290, 215, 376, 'giọt dầu (pha phân tán)', 'middle', 16)
ghi(319, 153, 336, 140, 'màng chất nhũ hóa')
ghi(150, 70, 160, 22, 'nước (pha liên tục)')
p('</svg>')
print(''.join(o))
