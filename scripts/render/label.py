from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, sys
title = sys.argv[1] if len(sys.argv)>1 else "ÇİÇEK BALI  ·  850 g"
out = sys.argv[2] if len(sys.argv)>2 else "label.png"
W,H=2400,900
img=Image.new("RGB",(W,H),(244,235,215))
nz=Image.effect_noise((W,H),40).convert("L").filter(ImageFilter.GaussianBlur(0.7))
img=Image.composite(Image.new("RGB",(W,H),(228,214,186)), img, nz.point(lambda v: max(0,min(255,(v-140)*2))))
d=ImageDraw.Draw(img)
gold=(170,114,34); dark=(34,29,24)
d.rectangle([30,30,W-30,H-30],outline=gold,width=6)
d.rectangle([52,52,W-52,H-52],outline=gold,width=2)
cx=W//2
def hexagon(cx,cy,r):
    return [(cx+r*math.cos(math.pi/3*i+math.pi/6), cy+r*math.sin(math.pi/3*i+math.pi/6)) for i in range(6)]
d.polygon(hexagon(cx,170,74),outline=gold,width=6)
d.polygon([(cx,122),(cx+27,176),(cx-27,176)],fill=gold)
d.ellipse([cx-29,150,cx+29,208],fill=gold)
pf=ImageFont.truetype("f1.ttf",230); inter=ImageFont.truetype("f0.ttf",44); inter2=ImageFont.truetype("f0.ttf",42)
def ctext(y,t,f,fill,spacing=0):
    widths=[d.textlength(c,font=f) for c in t]; total=sum(widths)+spacing*(len(t)-1)
    x=cx-total/2
    for c,w in zip(t,widths): d.text((x,y),c,font=f,fill=fill); x+=w+spacing
ctext(262,"Şifa Balı",pf,dark)
ctext(560,"DOĞAL · HAM · ŞİFA",inter,gold,spacing=18)
d.line([cx-440,655,cx-60,655],fill=gold,width=3); d.line([cx+60,655,cx+440,655],fill=gold,width=3)
d.polygon(hexagon(cx,655,14),fill=gold)
ctext(705,title,inter2,(90,70,50),spacing=10)
img.save(out)
