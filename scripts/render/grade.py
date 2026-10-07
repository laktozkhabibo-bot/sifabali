import sys
from PIL import Image
import numpy as np
src, dst = sys.argv[1], sys.argv[2]
hue = float(sys.argv[3]) if len(sys.argv) > 3 else 12; sat = float(sys.argv[4]) if len(sys.argv) > 4 else 1.15; val = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
im = Image.open(src).convert("RGBA"); a = np.array(im).astype(np.float32)
rgb = Image.fromarray(a[..., :3].astype(np.uint8)).convert("HSV"); h = np.array(rgb).astype(np.float32)
w = (h[..., 2] / 255.0) ** 1.6
h[..., 0] = (h[..., 0] + w * hue / 360 * 255) % 255; h[..., 1] = np.clip(h[..., 1] * sat, 0, 255); h[..., 2] = np.clip(h[..., 2] * val, 0, 255)
out = np.array(Image.fromarray(h.astype(np.uint8), "HSV").convert("RGB")).astype(np.float32)
res = np.dstack([out, a[..., 3]]).astype(np.uint8)
Image.fromarray(res, "RGBA").save(dst)
