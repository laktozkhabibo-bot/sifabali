"""Seamless, non-repeating honeycomb strip via 1-D image quilting (min-error boundary cuts)
+ irregularly placed honey drips. Output tiles horizontally without visible seams."""
from PIL import Image
import numpy as np, random
random.seed(11)
src=np.array(Image.open("/tmp/r/comb_cut.png").convert("RGBA")).astype(np.float32)
H,W,_=src.shape
BAND_H=215
band=src[:BAND_H,255:W].copy()                 # drip-free comb texture
variants=[band, band[:,::-1].copy()]           # original + mirror for variety
O=110                                          # overlap width for each join
SEARCH=70                                      # lattice-alignment search range

def premul(x): return np.concatenate([x[...,:3]*x[...,3:4]/255.0, x[...,3:4]],axis=2)
def err(a,b): return ((premul(a)-premul(b))**2).sum(axis=2)

def min_cut(E):
    """DP vertical seam through error surface E (rows x O). Returns column index per row."""
    h,w=E.shape; C=E.copy(); back=np.zeros((h,w),int)
    for y in range(1,h):
        for x in range(w):
            lo,hi=max(0,x-1),min(w,x+2); k=lo+int(np.argmin(C[y-1,lo:hi])); back[y,x]=k; C[y,x]+=C[y-1,k]
    path=np.zeros(h,int); path[-1]=int(np.argmin(C[-1]))
    for y in range(h-1,0,-1): path[y-1]=back[y,path[y]]
    return path

def join(left,right):
    """Append `right` to `left`, choosing the best offset in `right` and a min-error seam."""
    best=None
    for s in range(0,SEARCH):
        if s+O>right.shape[1]: break
        e=err(left[:,-O:],right[:,s:s+O]).sum()
        if best is None or e<best[0]: best=(e,s)
    s=best[1]; r=right[:,s:]
    E=err(left[:,-O:],r[:,:O]); path=min_cut(E)
    ov=r[:,:O].copy()
    for y in range(left.shape[0]):
        c=path[y]
        # soft seam: 6px feather around the cut
        for x in range(O):
            t=np.clip((x-c+3)/6.0,0,1)
            ov[y,x]=left[y,-O+x]*(1-t)+r[y,x]*t
    return np.concatenate([left[:,:-O],ov,r[:,O:]],axis=1)

TARGET=5200
strip=variants[0][:, :].copy()
i=1
while strip.shape[1]<TARGET:
    v=variants[random.randint(0,1)]
    c=random.randint(0,90); L=random.randint(260,v.shape[1]-c)
    strip=join(strip, v[:,c:c+L]); i+=1
print("strip before wrap", strip.shape)

# make it wrap: blend the end into the beginning
n=strip.shape[1]
best=None
for k in range(0,SEARCH):
    e=err(strip[:,n-k-O:n-k],strip[:,:O]).sum()
    if best is None or e<best[0]: best=(e,k)
k=best[1]; tail=strip[:,n-k-O:n-k]; head=strip[:,:O]
path=min_cut(err(tail,head)); ov=head.copy()
for y in range(BAND_H):
    for x in range(O):
        t=np.clip((x-path[y]+3)/6.0,0,1); ov[y,x]=tail[y,x]*(1-t)+head[y,x]*t
strip=np.concatenate([ov,strip[:,O:n-k-O]],axis=1)
TW=strip.shape[1]; print("tile width",TW)

# ── Drips: two sprites cut from the photo, placed irregularly with varied lengths ──
canvas=np.zeros((H,TW,4),np.float32); canvas[:BAND_H]=strip
SPR_TOP=148
sprites=[src[SPR_TOP:,75:150].copy(), src[SPR_TOP:,168:258].copy()]
for s in sprites:
    fe=56
    s[:fe,:,3]*=np.linspace(0,1,fe)[:,None]      # feather into the comb
def bottom_at(x):
    cols=canvas[:BAND_H, max(0,x-6):x+6, 3]
    rows=np.where((cols>160).any(axis=1))[0]
    return int(rows.max()) if len(rows) else BAND_H-20
def over(dst,src_,x,y):
    h,w=src_.shape[:2]; h=min(h,dst.shape[0]-y); w=min(w,dst.shape[1]-x)
    s=src_[:h,:w]; d=dst[y:y+h,x:x+w]
    sa=s[...,3:4]/255.0; da=d[...,3:4]/255.0; oa=sa+da*(1-sa)
    rgb=(s[...,:3]*sa+d[...,:3]*da*(1-sa))/np.maximum(oa,1e-6)
    dst[y:y+h,x:x+w]=np.concatenate([rgb,oa*255],axis=2)
x=random.randint(60,160)
while x<TW-160:
    kind=random.random()
    spr=sprites[1] if kind<0.55 else sprites[0]
    if random.random()<0.5: spr=spr[:,::-1]
    f=random.uniform(0.5,1.0) if spr is not sprites[0] else random.uniform(0.7,1.1)
    im=Image.fromarray(spr.astype(np.uint8),"RGBA"); nh=max(60,int(im.height*f))
    im=np.array(im.resize((im.width,nh),Image.LANCZOS)).astype(np.float32)
    top=bottom_at(x+im.shape[1]//2)-78
    over(canvas,im,x,max(0,top))
    x+=random.randint(190,470)
# trim empty bottom rows
alpha=canvas[...,3]; last=int(np.where(alpha.max(axis=1)>8)[0].max())+2
out=Image.fromarray(np.clip(canvas[:last],0,255).astype(np.uint8),"RGBA")
out.save("/home/user/sifabali/public/images/honey-comb-edge.webp",quality=86,method=6)
out.save("/home/user/sifabali/public/images/honey-comb-edge.png",optimize=True)
print("final",out.size)
pv=Image.new("RGBA",(out.width+900,out.height),(250,243,228,255)); pv.alpha_composite(out,(0,0)); pv.alpha_composite(out.crop((0,0,900,out.height)),(out.width,0))
pv.convert("RGB").save("/tmp/r/quilt_pv.png")
