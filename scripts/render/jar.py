"""Photoreal honey jar (Blender/Cycles). Usage: python jar.py out.png label.png W H SAMPLES [honey_r honey_g honey_b density]"""
import bpy, bmesh, math, sys
from mathutils import Vector
a = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
OUT, LABEL = a[0], a[1]; W, H, SAMPLES = int(a[2]), int(a[3]), int(a[4])
HONEY = tuple(float(x) for x in a[5:8]) if len(a) >= 8 else (1.0, 0.68, 0.2)
DENS = float(a[8]) if len(a) >= 9 else 55.0

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
cy = sc.cycles
cy.device = "CPU"; cy.samples = SAMPLES; cy.use_denoising = True
cy.max_bounces = 32; cy.transmission_bounces = 24; cy.glossy_bounces = 8; cy.volume_bounces = 2
cy.caustics_reflective = False; cy.caustics_refractive = False; cy.blur_glossy = 1.0
sc.render.film_transparent = True
cy.film_transparent_glass = False
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"; sc.view_settings.exposure = -0.6

def link(o): sc.collection.objects.link(o); return o

def lathe(name, profile, steps=160, solid=0.0, subd=2, smooth=True):
    me = bpy.data.meshes.new(name)
    verts = [(r, 0, z) for r, z in profile]
    edges = [(i, i+1) for i in range(len(verts)-1)]
    me.from_pydata(verts, edges, [])
    o = link(bpy.data.objects.new(name, me))
    m = o.modifiers.new("screw", "SCREW"); m.axis = "Z"; m.steps = steps; m.render_steps = steps
    m.use_merge_vertices = True; m.use_normal_calculate = True; m.use_smooth_shade = smooth
    if solid:
        s = o.modifiers.new("sol", "SOLIDIFY"); s.thickness = solid; s.offset = -1; s.use_even_offset = True
    if subd:
        d = o.modifiers.new("sub", "SUBSURF"); d.levels = subd; d.render_levels = subd
    return o

def principled(name, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m, b

# ── Glass jar ──
glass_prof = [(0.0,0.0),(0.036,0.0),(0.0425,0.0015),(0.045,0.006),(0.045,0.101),(0.0443,0.1065),(0.0415,0.1105),(0.0378,0.1125),(0.0376,0.114),(0.0376,0.123)]
jar = lathe("jar", glass_prof, solid=0.0022, subd=2)
gm, gb = principled("glass", **{"Base Color": (1,1,1,1), "Roughness": 0.0, "IOR": 1.5, "Transmission Weight": 1.0})
jar.data.materials.append(gm)

# ── Honey (with volumetric absorption for depth & glow) ──
honey_prof = [(0.0,0.0026),(0.035,0.0026),(0.0405,0.004),(0.04255,0.0075),(0.04255,0.0985),(0.0415,0.1),(0.03,0.1003),(0.0,0.1004)]
honey = lathe("honey", honey_prof, subd=2)
hm, hb = principled("honey", **{"Base Color": (1.0,0.93,0.8,1), "Roughness": 0.03, "IOR": 1.49, "Transmission Weight": 1.0})
nt = hm.node_tree
va = nt.nodes.new("ShaderNodeVolumeAbsorption")
va.inputs["Color"].default_value = (*HONEY, 1); va.inputs["Density"].default_value = DENS
nt.links.new(va.outputs[0], nt.nodes["Material Output"].inputs["Volume"])
honey.data.materials.append(hm)

# ── Knurled gold lid ──
def lid(r=0.0398, z0=0.1125, z1=0.1305, ridges=90, depth=0.00035):
    bm = bmesh.new(); N = 360
    zs = [z0, z0+0.0008, z0+0.003, z1-0.004, z1-0.0012, z1]
    rings = []
    for zi, z in enumerate(zs):
        ring = []
        for i in range(N):
            ang = 2*math.pi*i/N
            rr = r + (depth*(0.5+0.5*math.cos(ridges*ang)) if 1 <= zi <= 3 else 0) - (0.0006 if zi in (0,5) else 0)
            ring.append(bm.verts.new((rr*math.cos(ang), rr*math.sin(ang), z)))
        rings.append(ring)
    for k in range(len(rings)-1):
        for i in range(N):
            bm.faces.new((rings[k][i], rings[k][(i+1)%N], rings[k+1][(i+1)%N], rings[k+1][i]))
    # rounded top
    prev = rings[-1]
    for rr, dz in ((r-0.0022, 0.0006), (r-0.006, 0.0008), (0.0, 0.0009)):
        if rr == 0:
            c = bm.verts.new((0,0,z1+dz))
            for i in range(N): bm.faces.new((prev[i], prev[(i+1)%N], c))
        else:
            ring = [bm.verts.new((rr*math.cos(2*math.pi*i/N), rr*math.sin(2*math.pi*i/N), z1+dz)) for i in range(N)]
            for i in range(N): bm.faces.new((prev[i], prev[(i+1)%N], ring[(i+1)%N], ring[i]))
            prev = ring
    me = bpy.data.meshes.new("lid"); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = link(bpy.data.objects.new("lid", me))
    s = o.modifiers.new("sub", "SUBSURF"); s.levels = 1; s.render_levels = 1
    return o
L = lid()
lm, lb = principled("gold", **{"Base Color": (0.86,0.62,0.27,1), "Metallic": 1.0, "Roughness": 0.3})
L.data.materials.append(lm)

# ── Paper label wrapped on the jar ──
R = 0.04535; A0, A1 = math.radians(-82), math.radians(82); Z0, Z1 = 0.028, 0.0755
bm = bmesh.new(); nu = 96
uv = bm.loops.layers.uv.new()
cols = []
for i in range(nu+1):
    t = i/nu; ang = A0+(A1-A0)*t
    x, y = R*math.sin(ang), -R*math.cos(ang)
    cols.append((bm.verts.new((x,y,Z0)), bm.verts.new((x,y,Z1)), t))
for i in range(nu):
    (a0,b0,t0),(a1,b1,t1) = cols[i], cols[i+1]
    f = bm.faces.new((a0,a1,b1,b0))
    for lp, (u,v) in zip(f.loops, ((t0,0),(t1,0),(t1,1),(t0,1))): lp[uv].uv = (u,v)
me = bpy.data.meshes.new("label"); bm.to_mesh(me); bm.free()
for p in me.polygons: p.use_smooth = True
lab = link(bpy.data.objects.new("label", me))
pm, pb = principled("paper", **{"Roughness": 0.55})
tex = pm.node_tree.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load(LABEL)
pm.node_tree.links.new(tex.outputs["Color"], pb.inputs["Base Color"])
lab.data.materials.append(pm)

# ── Shadow catcher ──


# ── Lighting ──
def area(name, loc, target, size, energy, color=(1,1,1), cam=False, sy=None):
    ld = bpy.data.lights.new(name, "AREA"); ld.energy = energy; ld.color = color
    ld.shape = "RECTANGLE"; ld.size = size; ld.size_y = sy or size
    o = link(bpy.data.objects.new(name, ld)); o.location = loc
    o.rotation_euler = (Vector(target)-Vector(loc)).to_track_quat("-Z","Y").to_euler()
    o.visible_camera = cam
    return o
area("key", (-0.30,-0.34,0.34), (0,0,0.06), 0.35, 5.5, (1.0,0.96,0.9))
area("fill", (0.36,-0.26,0.16), (0,0,0.06), 0.3, 4, (1.0,0.95,0.88))
area("back", (0.10,0.45,0.30), (0,0,0.06), 0.6, 30, (1.0,0.88,0.66))   # makes the honey glow
area("top", (0,0,0.45), (0,0,0), 0.25, 2)
# Tall reflection strips for glass highlights (invisible to camera)
def strip(name, loc, w, h, strength):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    o = bpy.context.active_object; o.scale = (w, h, 1)
    o.rotation_euler = (Vector((0,0,loc[2]))-Vector(loc)).to_track_quat("Z","Y").to_euler()
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission"); e.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputMaterial"); nt.links.new(e.outputs[0], out.inputs[0])
    o.data.materials.append(m); o.visible_camera = False; o.visible_shadow = False
strip("stripL", (-0.22,-0.16,0.07), 0.03, 0.22, 14)
strip("stripR", (0.24,-0.10,0.07), 0.02, 0.22, 9)

# World: site-cream seen through the glass (transmission/glossy rays), but dim for lighting (diffuse rays)
world = bpy.data.worlds.new("w"); sc.world = world; world.use_nodes = True
wn = world.node_tree; bg = wn.nodes["Background"]
bg.inputs["Color"].default_value = (0.955,0.896,0.776,1)
lp = wn.nodes.new("ShaderNodeLightPath"); mx = wn.nodes.new("ShaderNodeMath"); mx.operation = "MULTIPLY_ADD"
mx.inputs[1].default_value = -0.9; mx.inputs[2].default_value = 1.0
wn.links.new(lp.outputs["Is Diffuse Ray"], mx.inputs[0]); wn.links.new(mx.outputs[0], bg.inputs["Strength"])

# ── Camera ──
camd = bpy.data.cameras.new("cam"); camd.lens = 85
cam = link(bpy.data.objects.new("cam", camd)); sc.camera = cam
cam.location = (0.0, -0.52, 0.125)
cam.rotation_euler = (Vector((0,0,0.066))-cam.location).to_track_quat("-Z","Y").to_euler()
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
