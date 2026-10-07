"""Static, photoreal honey edge (thick honey band with rounded sags, no drips). python edge.py out.png W H SAMPLES SEED WIDTH"""
import bpy, bmesh, math, sys, random
from mathutils import Vector
a = sys.argv[1:]
OUT = a[0]; W, H, SAMPLES = int(a[1]), int(a[2]), int(a[3]); SEED = int(a[4]); WIDTH = float(a[5])
random.seed(SEED)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = "CYCLES"; cy = sc.cycles
cy.device = "CPU"; cy.samples = SAMPLES; cy.use_denoising = True
cy.max_bounces = 24; cy.transmission_bounces = 16; cy.volume_bounces = 2
cy.caustics_reflective = False; cy.caustics_refractive = False
sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Khronos PBR Neutral"; sc.view_settings.look = "None"; sc.view_settings.exposure = -0.3

HALF = WIDTH / 2
FRAME_H = WIDTH * H / W
TOP = FRAME_H + 0.08            # honey continues above the frame
BASE = FRAME_H - 0.145 * (WIDTH / 3.0) ** 0 # bottom edge (unsagged) — ~0.145 below frame top
# Sag lobes (rounded bulges of honey hanging from the edge — never detaching)
lobes = []
x = -HALF - 0.1
while x < HALF + 0.1:
    w = random.uniform(0.12, 0.26); amp = random.uniform(0.02, 0.06) * (1 if random.random() > 0.25 else 0.4)
    lobes.append((x + w, w * 0.62, amp)); x += w * random.uniform(1.4, 2.3)
def sag(x):  return sum(A * math.exp(-((x - c) / w) ** 2) for c, w, A in lobes)
def edge(x): return BASE - sag(x) - 0.004 * math.sin(x * 11 + SEED)
T0 = 0.06
def thick(x): return T0 * (1 + 0.18 * math.sin(x * 9 + SEED) ) + 0.55 * sag(x)
R = 0.06  # radius of the rounded lip

NX, NZ = int((WIDTH + 0.6) * 260), 70
bm = bmesh.new()
front, back = [], []
for i in range(NX + 1):
    x = -HALF - 0.3 + (WIDTH + 0.6) * i / NX
    e, T = edge(x), thick(x)
    colF, colB = [], []
    for j in range(NZ + 1):
        # denser rows near the lip
        f = (j / NZ) ** 2.2
        z = e + (TOP - e) * f
        d = z - e
        t = T * math.sqrt(max(0.0, 1 - (1 - min(d, R) / R) ** 2)) if d < R else T
        # gentle vertical flow streaks
        t *= 1 + 0.01 * math.sin(x * 37 + z * 3) * min(1, d / R)
        lean = 2.2 * max(0.0, d - 0.015) ** 2
        colF.append(bm.verts.new((x, -t + lean, z)))
        colB.append(bm.verts.new((x, lean, z)) if j > 0 else colF[0])
    front.append(colF); back.append(colB)
for i in range(NX):
    for j in range(NZ):
        bm.faces.new((front[i][j], front[i+1][j], front[i+1][j+1], front[i][j+1]))
        bm.faces.new((back[i][j+1], back[i+1][j+1], back[i+1][j], back[i][j]))
    bm.faces.new((front[i][NZ], front[i+1][NZ], back[i+1][NZ], back[i][NZ]))  # top cap
for side, i in (("L", 0), ("R", NX)):
    for j in range(NZ):
        vs = (front[i][j], front[i][j+1], back[i][j+1], back[i][j])
        if len(set(vs)) >= 3:
            try: bm.faces.new(vs if side == "R" else vs[::-1])
            except ValueError: pass
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new("honey"); bm.to_mesh(me); bm.free()
for p in me.polygons: p.use_smooth = True
o = bpy.data.objects.new("honey", me); sc.collection.objects.link(o)

m = bpy.data.materials.new("honey"); m.use_nodes = True
b = m.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (1, 0.93, 0.8, 1); b.inputs["Roughness"].default_value = 0.02
b.inputs["IOR"].default_value = 1.49; b.inputs["Transmission Weight"].default_value = 1.0
va = m.node_tree.nodes.new("ShaderNodeVolumeAbsorption")
va.inputs["Color"].default_value = (1.0, 0.8, 0.22, 1); va.inputs["Density"].default_value = 80
m.node_tree.links.new(va.outputs[0], m.node_tree.nodes["Material Output"].inputs["Volume"])
nt = m.node_tree
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 6; nz.inputs["Detail"].default_value = 3
bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.04
nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
o.data.materials.append(m)

# Tiny trapped air bubbles — a signature detail of real raw honey
bub = bpy.data.materials.new("bubble"); bub.use_nodes = True
bb = bub.node_tree.nodes["Principled BSDF"]
bb.inputs["Roughness"].default_value = 0.0; bb.inputs["IOR"].default_value = 0.67; bb.inputs["Transmission Weight"].default_value = 1.0
for k in range(0):  # bubbles disabled (read as specks at small size)
    x = random.uniform(-HALF, HALF); e = edge(x)
    z = random.uniform(e + 0.012, min(FRAME_H, e + 0.13))
    d = z - e; T = thick(x)
    tt = T * math.sqrt(max(0.0, 1 - (1 - min(d, R) / R) ** 2)) if d < R else T
    r = random.uniform(0.0018, 0.0055) * (3 if random.random() < 0.06 else 1)
    if tt < 3 * r: continue
    lean = 2.2 * max(0.0, d - 0.015) ** 2
    y = -random.uniform(r * 1.3, tt - r * 1.3) + lean
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, z), segments=16, ring_count=8)
    ob = bpy.context.active_object; ob.data.materials.append(bub)
    for p in ob.data.polygons: p.use_smooth = True

def area(name, loc, target, size, energy, color=(1,1,1), sy=None):
    ld = bpy.data.lights.new(name, "AREA"); ld.energy = energy; ld.color = color; ld.shape = "RECTANGLE"; ld.size = size; ld.size_y = sy or size
    ob = bpy.data.objects.new(name, ld); sc.collection.objects.link(ob); ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler(); ob.visible_camera = False
area("key", (-0.6, -1.4, FRAME_H + 1.2), (0, 0, BASE), 1.2, 90, (1, 0.97, 0.92), 0.5)
area("fill", (0.8, -1.2, BASE - 0.3), (0, 0, BASE), 1.5, 14, (1, 0.94, 0.85))
area("back", (0, 1.0, BASE), (0, 0, BASE), 3.0, 8, (1, 0.9, 0.7), 0.6)
# long thin highlight strip reflected along the rounded lip
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.9, FRAME_H + 0.6))
st = bpy.context.active_object; st.scale = (WIDTH * 2, 0.22, 1)
st.rotation_euler = (Vector((0, 0, BASE)) - st.location).to_track_quat("Z", "Y").to_euler()
em = bpy.data.materials.new("strip"); em.use_nodes = True; nt = em.node_tree; nt.nodes.clear()
e = nt.nodes.new("ShaderNodeEmission"); e.inputs["Strength"].default_value = 2.5
out = nt.nodes.new("ShaderNodeOutputMaterial"); nt.links.new(e.outputs[0], out.inputs[0]); st.data.materials.append(em)
st.visible_camera = False; st.visible_shadow = False

world = bpy.data.worlds.new("w"); sc.world = world; world.use_nodes = True
wn = world.node_tree; bg = wn.nodes["Background"]; bg.inputs["Color"].default_value = (0.955, 0.896, 0.776, 1)
lp = wn.nodes.new("ShaderNodeLightPath"); mx = wn.nodes.new("ShaderNodeMath"); mx.operation = "MULTIPLY_ADD"
mx.inputs[1].default_value = -0.8; mx.inputs[2].default_value = 1.0
wn.links.new(lp.outputs["Is Diffuse Ray"], mx.inputs[0]); wn.links.new(mx.outputs[0], bg.inputs["Strength"])
mixc = wn.nodes.new("ShaderNodeMix"); mixc.data_type = "RGBA"
mixc.inputs["A"].default_value = (0.955, 0.896, 0.776, 1); mixc.inputs["B"].default_value = (0.5, 0.26, 0.06, 1)
wn.links.new(lp.outputs["Is Glossy Ray"], mixc.inputs["Factor"]); wn.links.new(mixc.outputs["Result"], bg.inputs["Color"])

camd = bpy.data.cameras.new("cam"); camd.type = "ORTHO"; camd.ortho_scale = WIDTH
cam = bpy.data.objects.new("cam", camd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, -5, FRAME_H / 2); cam.rotation_euler = (math.radians(90), 0, 0)
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
