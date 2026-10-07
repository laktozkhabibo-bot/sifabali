"""Photoreal honey bee in flight (side/3-4 view, transparent bg). python bee.py out.png SIZE SAMPLES"""
import bpy, bmesh, math, sys, random
from mathutils import Vector, Euler
OUT, SIZE, SAMPLES = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
FRAME = int(sys.argv[4]) if len(sys.argv) > 4 else 1
random.seed(4)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = "CYCLES"; cy = sc.cycles
cy.device = "CPU"; cy.samples = SAMPLES; cy.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = SIZE
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Punchy"
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.9
sc.frame_start, sc.frame_end = 1, 3

def link(o): sc.collection.objects.link(o); return o
def mat(name, color, rough=0.5, sheen=0.0, sheen_tint=(1,1,1), coat=0.0, sub=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1); b.inputs["Roughness"].default_value = rough
    b.inputs["Sheen Weight"].default_value = sheen; b.inputs["Sheen Tint"].default_value = (*sheen_tint, 1); b.inputs["Sheen Roughness"].default_value = 0.6
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Subsurface Weight"].default_value = sub
    return m, b

def ellipsoid(name, loc, scale, m, rot=(0,0,0), seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg//2, radius=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; o.scale = scale
    for p in o.data.polygons: p.use_smooth = True
    o.data.materials.append(m); return o

def hair(o, count, length, color, root=0.004, tip=0.0015, seed=0):
    """Fuzzy pile using the particle hair system (falls back silently if unavailable)."""
    try:
        mod = o.modifiers.new("hair", "PARTICLE_SYSTEM"); ps = mod.particle_system.settings
        ps.type = "HAIR"; ps.count = count; ps.hair_length = length; ps.use_advanced_hair = True
        ps.brownian_factor = 0.02; ps.use_rotations = True; ps.rotation_mode = "NOR"
        ps.child_type = "INTERPOLATED"; ps.child_percent = 6; ps.rendered_child_count = 6; ps.child_length = 0.9
        ps.roughness_1 = 0.06; ps.roughness_2 = 0.04; ps.kink = "NO"
        ps.root_radius = 1.0; ps.tip_radius = 0.3; ps.radius_scale = root
        mod.particle_system.seed = seed
        hm = bpy.data.materials.new("hair"); hm.use_nodes = True
        nt = hm.node_tree; nt.nodes.clear()
        hb = nt.nodes.new("ShaderNodeBsdfHairPrincipled"); hb.parametrization = "COLOR"
        hb.inputs["Color"].default_value = (*color, 1); hb.inputs["Roughness"].default_value = 0.35
        out = nt.nodes.new("ShaderNodeOutputMaterial"); nt.links.new(hb.outputs[0], out.inputs["Surface"])
        o.data.materials.append(hm); ps.material = len(o.data.materials)
        return True
    except Exception as ex:
        print("hair unavailable:", ex); return False

# Bee faces +X. Units ≈ cm*10.
chitin, chitin_b = mat("chitin", (0.035, 0.025, 0.018), rough=0.35, coat=0.4)
# Abdomen with golden/dark bands (object-space X stripes)
ab_m, ab_b = mat("abdomen", (0.6, 0.35, 0.08), rough=0.4, sheen=0.6, sheen_tint=(0.9,0.7,0.4), coat=0.3)
nt = ab_m.node_tree
tc = nt.nodes.new("ShaderNodeTexCoord"); sep = nt.nodes.new("ShaderNodeSeparateXYZ")
wave = nt.nodes.new("ShaderNodeTexWave"); wave.wave_type = "BANDS"; wave.bands_direction = "X"
wave.inputs["Scale"].default_value = 0.75; wave.inputs["Distortion"].default_value = 0.6; wave.inputs["Detail"].default_value = 2
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.36; ramp.color_ramp.elements[0].color = (0.52, 0.27, 0.05, 1)
ramp.color_ramp.elements[1].position = 0.66; ramp.color_ramp.elements[1].color = (0.045, 0.028, 0.016, 1)
nt.links.new(tc.outputs["Object"], wave.inputs["Vector"]); nt.links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
nt.links.new(ramp.outputs["Color"], ab_b.inputs["Base Color"])
abdomen = ellipsoid("abdomen", (-0.62, 0, -0.08), (0.62, 0.43, 0.42), ab_m, rot=(0, math.radians(-12), 0))
# pointed tip
tip = ellipsoid("tip", (-1.12, 0, -0.19), (0.12, 0.1, 0.09), chitin, rot=(0, math.radians(-15), 0))

thorax_m, _ = mat("thorax", (0.22, 0.13, 0.05), rough=0.6, sheen=1.0, sheen_tint=(0.95, 0.75, 0.45))
thorax = ellipsoid("thorax", (0.05, 0, 0.0), (0.36, 0.33, 0.33), thorax_m)
head_m, _ = mat("head", (0.05, 0.035, 0.025), rough=0.45, sheen=0.5, sheen_tint=(0.8,0.6,0.35))
head = ellipsoid("head", (0.47, 0, -0.03), (0.16, 0.25, 0.26), head_m)
eye_m, eye_b = mat("eye", (0.07, 0.045, 0.03), rough=0.38, coat=0.25)
ev = eye_m.node_tree.nodes.new("ShaderNodeTexVoronoi"); ev.inputs["Scale"].default_value = 180
eb = eye_m.node_tree.nodes.new("ShaderNodeBump"); eb.inputs["Strength"].default_value = 0.35
eye_m.node_tree.links.new(ev.outputs["Distance"], eb.inputs["Height"]); eye_m.node_tree.links.new(eb.outputs["Normal"], eye_b.inputs["Normal"])
for s in (1, -1):
    ellipsoid("eye", (0.46, 0.17 * s, 0.04), (0.11, 0.08, 0.2), eye_m, rot=(math.radians(10 * s), 0, math.radians(12 * s)))

# Hair
hair(thorax, 1800, 0.11, (0.28, 0.15, 0.05), seed=1)
hair(head, 500, 0.06, (0.12, 0.07, 0.03), seed=2)
hair(abdomen, 900, 0.025, (0.35, 0.22, 0.08), seed=3)

# Curves for legs & antennae
def tube(name, pts, radius, m):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = radius; cu.bevel_resolution = 4
    sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts): p.co = (*c, 1)
    sp.order_u = 3; sp.use_endpoint_u = True
    o = link(bpy.data.objects.new(name, cu)); o.data.materials.append(m); return o
leg_m, _ = mat("leg", (0.06, 0.04, 0.025), rough=0.4, sheen=0.4, sheen_tint=(0.8,0.6,0.4))
for s in (1, -1):
    for i, (x0, kx, kz, fx, fz) in enumerate(((0.28, 0.36, -0.34, 0.22, -0.5), (0.06, 0.0, -0.36, -0.22, -0.5), (-0.14, -0.38, -0.36, -0.78, -0.46))):
        tube("leg", [(x0, 0.1*s, -0.2), (kx, 0.2*s, kz), (fx, 0.22*s, fz), (fx - 0.12, 0.2*s, fz - 0.04)], 0.017 if i < 2 else 0.024, leg_m)
    tube("antenna", [(0.58, 0.08*s, 0.12), (0.74, 0.14*s, 0.32), (0.9, 0.18*s, 0.36), (1.05, 0.24*s, 0.3)], 0.016, chitin)

# Wings (4) — translucent membrane with veins, flapping → motion blur
wing_m = bpy.data.materials.new("wing"); wing_m.use_nodes = True
wnt = wing_m.node_tree; wb = wnt.nodes["Principled BSDF"]
wb.inputs["Roughness"].default_value = 0.12; wb.inputs["Specular IOR Level"].default_value = 0.8
try: wb.inputs["Thin Film Thickness"].default_value = 420
except Exception: pass
vor = wnt.nodes.new("ShaderNodeTexVoronoi"); vor.feature = "DISTANCE_TO_EDGE"; vor.inputs["Scale"].default_value = 3.2
vr = wnt.nodes.new("ShaderNodeValToRGB")
vr.color_ramp.elements[0].position = 0.0; vr.color_ramp.elements[0].color = (1,1,1,1)
vr.color_ramp.elements[1].position = 0.035; vr.color_ramp.elements[1].color = (0,0,0,1)
wnt.links.new(vor.outputs["Distance"], vr.inputs["Fac"])
col = wnt.nodes.new("ShaderNodeMix"); col.data_type = "RGBA"
col.inputs["A"].default_value = (0.9, 0.88, 0.84, 1); col.inputs["B"].default_value = (0.12, 0.08, 0.05, 1)
wnt.links.new(vr.outputs["Color"], col.inputs["Factor"]); wnt.links.new(col.outputs["Result"], wb.inputs["Base Color"])
al = wnt.nodes.new("ShaderNodeMapRange"); al.inputs["To Min"].default_value = 0.26; al.inputs["To Max"].default_value = 0.85
wnt.links.new(vr.outputs["Color"], al.inputs["Value"]); wnt.links.new(al.outputs["Result"], wb.inputs["Alpha"])

def wing(name, length, width, pivot, side, base_rot):
    bm = bmesh.new(); n = 40
    verts = [bm.verts.new((0, 0, 0))]
    for i in range(n + 1):
        t = math.pi * i / n
        yy = length * (0.5 - 0.5 * math.cos(t)); xx = -width * math.sin(t) * (0.8 + 0.2 * math.cos(t))
        verts.append(bm.verts.new((xx, yy * side, 0)))
    for i in range(1, n + 1): bm.faces.new((verts[0], verts[i], verts[i + 1]) if side > 0 else (verts[0], verts[i + 1], verts[i]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me)); o.location = pivot; o.data.materials.append(wing_m)
    # flap keyframes (motion blur)
    for f, amp in ((1, -1), (2, 1), (3, -1)):
        o.rotation_euler = Euler((base_rot[0] + math.radians(26) * amp * side, base_rot[1], base_rot[2] * side), "XYZ")
        o.keyframe_insert("rotation_euler", frame=f)
    return o
wing("fwL", 1.05, 0.3, (0.12, 0.12, 0.26), 1, (math.radians(40), 0, math.radians(28)))
wing("hwL", 0.7, 0.19, (-0.06, 0.12, 0.24), 1, (math.radians(32), 0, math.radians(48)))
wing("fwR", 1.05, 0.3, (0.12, -0.12, 0.26), -1, (math.radians(-72), 0, math.radians(34)))
wing("hwR", 0.7, 0.19, (-0.06, -0.12, 0.24), -1, (math.radians(-62), 0, math.radians(52)))

# Lighting
def area(name, loc, size, energy, color=(1,1,1)):
    ld = bpy.data.lights.new(name, "AREA"); ld.energy = energy; ld.size = size; ld.color = color
    o = link(bpy.data.objects.new(name, ld)); o.location = loc
    o.rotation_euler = (Vector((0,0,0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler(); o.visible_camera = False
area("key", (1.5, -3.0, 3.5), 3.0, 300, (1, 0.97, 0.92))
area("rim", (-3.0, 3.0, 2.0), 2.0, 260, (1, 0.9, 0.75))
area("fill", (-2.0, -3.5, -1.0), 3.0, 50, (0.9, 0.95, 1))
world = bpy.data.worlds.new("w"); sc.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.95, 0.9, 0.8, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.25

camd = bpy.data.cameras.new("cam"); camd.lens = 100
cam = link(bpy.data.objects.new("cam", camd)); sc.camera = cam
cam.location = (0.7, -6.4, 4.9)
cam.rotation_euler = (Vector((-0.15, 0, -0.05)) - cam.location).to_track_quat("-Z", "Y").to_euler()
sc.frame_set(FRAME)
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
