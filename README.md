<div dir="rtl">

# 🍯 Şifa Balı — متجر إلكتروني فاخر للعسل ومنتجات النحل

متجر إلكتروني كامل لعلامة **Şifa Balı** مبني بـ Next.js، بثلاث لغات (التركية افتراضياً + الإنجليزية + العربية مع دعم RTL كامل)، وحركات سينمائية، ولوحة تحكم لصاحب الموقع تظهر تعديلاتها على الموقع الحي **فوراً** دون أي إعادة بناء أو نشر.

---

## ✨ المزايا

**الواجهة والحركات**
- شاشة تحميل سريعة جداً (أقل من ثانية، CSS فقط، مرة واحدة لكل جلسة) لا تؤخر ظهور الموقع.
- قسم Hero: عسل حقيقي ثابت على الحافة العلوية، برطمان عسل واقعي، عنوان يظهر حرفاً حرفاً (CSS فوري)، Parallax عند التمرير، ونحل واقعي يطير بهدوء.
- ظهور العناصر عند التمرير بتتابع (Stagger)، عدّادات أرقام متحركة.
- بطاقات منتجات هادئة وثابتة (بدون حركة عند مرور الماوس) مع زر «Sepete Ekle» ظاهر دائماً.
- انتقالات بين الصفحات، وقسم «Çiçekten Kavanoza» بتمرير أفقي مثبّت (GSAP ScrollTrigger).
- تمرير ناعم بـ Lenis، واحترام كامل لإعداد `prefers-reduced-motion` (تتوقف الحركات الثقيلة تلقائياً).

**المتجر**
- الصفحات: الرئيسية، المتجر (فلترة بالفئة + ترتيب بالسعر + بحث فوري)، صفحة المنتج (معرض صور بتكبير، الفوائد، الوزن، الكمية، منتجات مشابهة)، من نحن، تواصل معنا، إتمام الطلب.
- سلة جانبية متحركة محفوظة في المتصفح، وإتمام الطلب يُرسل الطلب كاملاً عبر **واتساب**.
- SEO: عناوين ووصف لكل صفحة، Open Graph، روابط hreflang للغات الثلاث، `sitemap.xml`، `robots.txt`، وبيانات منظمة (Product / Store / BreadcrumbList).

**لوحة التحكم** (`/hostpagepass` ← `/hostpage`)
- المنتجات: إضافة، تعديل، حذف، رفع صور بالسحب والإفلات مع إعادة الترتيب بالسحب، الاسم، الوصف، الفوائد، السعر، سعر الخصم، الفئة، المخزون، إظهار/إخفاء، «مميز»، وترتيب العرض.
- الفئات: إضافة وتعديل وحذف وترتيب.
- كل نصوص الموقع باللغات الثلاث: Hero، لماذا نحن، الأرقام، رحلة العسل، من نحن، آراء العملاء، النشرة، التذييل، وSEO.
- معلومات التواصل وروابط التواصل الاجتماعي، وشريط الإعلانات العلوي (إظهار/إخفاء + معاينة).
- صندوق وارد لرسائل نموذج التواصل ومشتركي النشرة (مع تصدير CSV).
- زر **«Değişiklikleri Kaydet»** يحفظ كل شيء في معاملة واحدة ويحدّث الموقع الحي فوراً، مع إشعار Toast، وتنبيه عند مغادرة الصفحة بتعديلات غير محفوظة، واختصار `Ctrl/Cmd + S`.

**الأمان**
- التحقق من كلمة المرور على الخادم فقط، ومخزّنة مشفّرة بـ **bcrypt** في قاعدة البيانات (ليست في كود الواجهة).
- جلسة JWT موقّعة داخل Cookie من نوع `httpOnly` + `secure` + `sameSite=strict`، صالحة 8 ساعات.
- Middleware يحمي `/hostpage` و `/api/admin/*`؛ أي دخول مباشر يُعاد توجيهه إلى `/hostpagepass`.
- تحديد محاولات الدخول: 5 محاولات خاطئة خلال 15 دقيقة ← حظر 15 دقيقة (محفوظ في قاعدة البيانات فيعمل عبر كل خوادم Vercel).
- تغيير كلمة المرور من اللوحة يُخرج كل الجلسات الأخرى تلقائياً. زر تسجيل خروج.

---

## 🧱 التقنيات

| المجال | التقنية |
|---|---|
| الإطار | Next.js 15 (App Router) + TypeScript + React 19 |
| التصميم | Tailwind CSS 3 |
| الحركات | Framer Motion 12، GSAP 3 + ScrollTrigger، Lenis |
| قاعدة البيانات | PostgreSQL + Prisma 6 (Neon أو Supabase أو أي Postgres) |
| تخزين الصور | Vercel Blob |
| الحالة | Zustand (السلة) |
| التحقق | Zod، bcryptjs، jose (JWT) |
| الخطوط | Playfair Display، Inter، IBM Plex Sans Arabic (عبر `next/font`) |

---

## 📁 هيكل المشروع

```
sifabali/
├── prisma/
│   ├── schema.prisma            # جداول: Product, Category, SiteSetting, AdminCredential, LoginAttempt, ContactMessage, Subscriber
│   ├── migrations/              # ملفات ترحيل قاعدة البيانات
│   └── seed.ts                  # بيانات أولية (9 منتجات، 3 فئات، كل النصوص، كلمة المرور الأولى)
├── public/
│   ├── products/*.svg           # صور مؤقتة للمنتجات (استبدلها من اللوحة)
│   ├── logo.svg                 # الشعار النصي
│   └── og.png                   # صورة المشاركة على الشبكات الاجتماعية
├── scripts/
│   ├── generate-product-art.mjs # يولّد صور المنتجات المؤقتة
│   └── set-host-password.ts     # إعادة تعيين كلمة مرور اللوحة من الطرفية
└── src/
    ├── middleware.ts            # حماية اللوحة + توجيه اللغات
    ├── app/
    │   ├── (site)/[locale]/     # صفحات المتجر: الرئيسية، magaza، urun/[slug]، hakkimizda، iletisim، siparis
    │   ├── (host)/              # hostpagepass (الدخول) و hostpage (اللوحة)
    │   ├── api/                 # host/login|logout، admin/save|upload|password|inbox|data، contact، newsletter
    │   ├── sitemap.ts, robots.ts, icon.svg, globals.css
    ├── components/
    │   ├── motion/              # Preloader, HoneyDrips, Bees, SplitText, TiltCard, Magnetic, Counter, Reveal, PageTransition, SmoothScroll, CustomCursor
    │   ├── home/                # Hero, FeaturedProducts, WhySection, JourneySection, Testimonials, Newsletter
    │   ├── layout/              # Header, Footer, AnnouncementBar, LanguageSwitcher, WhatsAppFloat…
    │   ├── shop/ product/ cart/ contact/ about/ seo/ ui/
    │   └── host/                # لوحة التحكم ومكوّناتها
    ├── lib/
    │   ├── data.ts              # جلب البيانات مع Cache + Tags (للتحديث الفوري)
    │   ├── defaults.ts          # المحتوى الافتراضي والمنتجات التجريبية
    │   ├── auth.ts session.ts rate-limit.ts admin-schema.ts
    │   └── i18n/                # إعداد اللغات ونصوص الواجهة الثابتة
    └── store/cart.ts
```

### الروابط
| الصفحة | TR (افتراضي) | EN | AR |
|---|---|---|---|
| الرئيسية | `/` | `/en` | `/ar` |
| المتجر | `/magaza` | `/en/magaza` | `/ar/magaza` |
| منتج | `/urun/cicek-bali-850g` | `/en/urun/…` | `/ar/urun/…` |
| من نحن | `/hakkimizda` | `/en/hakkimizda` | `/ar/hakkimizda` |
| تواصل | `/iletisim` | `/en/iletisim` | `/ar/iletisim` |
| إتمام الطلب | `/siparis` | `/en/siparis` | `/ar/siparis` |
| دخول اللوحة | `/hostpagepass` | | |
| اللوحة | `/hostpage` | | |

---

## 💻 التثبيت والتشغيل محلياً

### المتطلبات
- Node.js **18.18 أو أحدث** (يُفضّل 20 أو 22).
- قاعدة بيانات PostgreSQL (محلية، أو مجانية سحابية من [Neon](https://neon.tech) أو [Supabase](https://supabase.com)).

### الخطوات

```bash
# 1) تثبيت الحزم
npm install

# 2) إنشاء ملف البيئة
cp .env.example .env
#   ثم افتح .env واملأ القيم (انظر الجدول أدناه)

# 3) إنشاء جداول قاعدة البيانات
npx prisma migrate deploy

# 4) تعبئة البيانات الأولية (المنتجات، الفئات، النصوص، كلمة مرور اللوحة الأولى)
npm run db:seed

# 5) التشغيل
npm run dev
```

افتح `http://localhost:3000` للموقع و `http://localhost:3000/hostpagepass` للوحة التحكم.

> في التطوير المحلي، إن لم تضع `BLOB_READ_WRITE_TOKEN` فستُحفظ الصور المرفوعة في `public/uploads` (للتجربة فقط). في الإنتاج على Vercel يجب ربط Vercel Blob.

---

## 🔐 متغيرات البيئة (.env)

| المتغير | إلزامي | الوصف |
|---|---|---|
| `DATABASE_URL` | ✅ | رابط اتصال PostgreSQL الذي يستخدمه الموقع (يُفضّل الرابط «Pooled»). |
| `DIRECT_URL` | ✅ | رابط الاتصال المباشر (غير Pooled) — يستخدمه `prisma migrate`. إن لم يكن لديك Pooler ضع نفس قيمة `DATABASE_URL`. |
| `SESSION_SECRET` | ✅ | نص عشوائي طويل (32 حرفاً على الأقل) لتوقيع جلسات اللوحة. أنشئه بـ: `openssl rand -base64 48` |
| `HOST_INITIAL_PASSWORD` | ✅ أول مرة | كلمة مرور اللوحة الأولى. تُستخدم **مرة واحدة فقط** لإنشاء الـ hash في قاعدة البيانات. بعد تغيير كلمة المرور من اللوحة يمكنك حذفها. |
| `BLOB_READ_WRITE_TOKEN` | ✅ على Vercel | يُنشأ تلقائياً عند ربط Blob Store بالمشروع في Vercel. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | رابط الموقع النهائي بدون `/` في النهاية، مثل `https://www.sifabali.com` (يُستخدم للـ SEO والـ Sitemap و Open Graph). |

### أمثلة لروابط قاعدة البيانات

**Neon** (من لوحة Neon ← Connection Details):
```env
DATABASE_URL="postgresql://USER:PASS@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASS@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

**Supabase** (Project Settings ← Database ← Connection string):
```env
# Transaction pooler (المنفذ 6543)
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
# Direct / Session (المنفذ 5432)
DIRECT_URL="postgresql://postgres.PROJECT:PASS@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

---

## 🔑 كلمة مرور الهوست (صاحب الموقع)

1. **الضبط الأول:** ضع كلمة مرور قوية في `HOST_INITIAL_PASSWORD` ثم شغّل `npm run db:seed` (على Vercel يحدث هذا تلقائياً أثناء النشر). تُحفظ في قاعدة البيانات مشفّرة بـ bcrypt.
   - حتى لو لم تشغّل الـ seed، أول محاولة دخول ستُنشئ الـ hash تلقائياً من هذا المتغير.
2. **الدخول:** افتح `/hostpagepass` وأدخل كلمة المرور.
3. **التغيير:** من اللوحة ← «Güvenlik» ← «Şifre Değiştir» (10 أحرف على الأقل). يتم تسجيل خروج كل الأجهزة الأخرى تلقائياً.
4. **إذا نسيت كلمة المرور:** من جهازك وبنفس `DATABASE_URL` الخاص بالإنتاج:
   ```bash
   npm run host:password -- "كلمة-مرور-جديدة-قوية"
   ```

> ⚠️ لا تضع كلمة المرور في كود الواجهة أبداً ولا ترفع ملف `.env` إلى GitHub (مستثنى في `.gitignore`).

---

## 🚀 النشر على Vercel خطوة بخطوة

### 1) ارفع المشروع إلى GitHub
```bash
git add . && git commit -m "Şifa Balı" && git push
```

### 2) أنشئ المشروع على Vercel
1. ادخل [vercel.com/new](https://vercel.com/new) واختر المستودع (Repository).
2. Framework Preset: **Next.js** (يُكتشف تلقائياً).
3. **لا تغيّر أمر البناء**: الملف `package.json` يحتوي على سكربت `vercel-build` يستخدمه Vercel تلقائياً، وهو ينفّذ بالترتيب:
   `prisma generate` ← `prisma migrate deploy` (إنشاء/تحديث الجداول) ← `prisma db seed` (تعبئة البيانات الأولية إن كانت القاعدة فارغة فقط) ← `next build`.

### 3) أنشئ قاعدة البيانات
- **الطريقة الأسهل:** في مشروعك على Vercel ← تبويب **Storage** ← **Create Database** ← اختر **Neon (Postgres)** ← Connect.
  سيضيف Vercel متغيرات البيئة تلقائياً. تأكد أن لديك `DATABASE_URL` (الرابط Pooled) و `DIRECT_URL` (الرابط غير Pooled — في Neon يكون اسمه غالباً `DATABASE_URL_UNPOOLED`؛ انسخ قيمته إلى متغير جديد باسم `DIRECT_URL`).
- **أو Supabase:** أنشئ مشروعاً في Supabase وانسخ الرابطين كما في المثال أعلاه.

### 4) أنشئ مخزن الصور (Vercel Blob)
Storage ← **Create** ← **Blob** ← Connect to project.
سيُضاف `BLOB_READ_WRITE_TOKEN` تلقائياً.

### 5) أضف بقية متغيرات البيئة
Project ← **Settings** ← **Environment Variables** وأضف (لبيئة Production و Preview):

| Key | Value |
|---|---|
| `SESSION_SECRET` | ناتج `openssl rand -base64 48` |
| `HOST_INITIAL_PASSWORD` | كلمة مرور قوية للوحة |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` (ثم نطاقك الخاص لاحقاً) |
| `DIRECT_URL` | إن لم يُضف تلقائياً (انظر الخطوة 3) |

### 6) انشر
اضغط **Deploy** (أو Deployments ← Redeploy إن كان المشروع قد بُني قبل إضافة المتغيرات).
بعد انتهاء البناء:
- افتح الموقع ✅
- افتح `/hostpagepass` وسجّل الدخول بكلمة `HOST_INITIAL_PASSWORD` ✅
- غيّر كلمة المرور فوراً من «Güvenlik» ✅

### 7) نطاق خاص (اختياري)
Settings ← **Domains** ← أضف `sifabali.com`، ثم حدّث `NEXT_PUBLIC_SITE_URL` بالنطاق الجديد وأعد النشر مرة واحدة.

---

## ⚡ كيف تظهر التعديلات فوراً دون إعادة نشر؟

صفحات المتجر مولّدة مسبقاً (سريعة جداً) ومخزّنة مع وسوم Cache (`catalog` و `content`).
عند الضغط على «Değişiklikleri Kaydet» يحفظ الخادم كل شيء في قاعدة البيانات داخل معاملة واحدة، ثم يستدعي `revalidateTag` و `revalidatePath` — فيُعاد توليد الصفحات تلقائياً مع أول زيارة تالية. **لا حاجة لأي Build أو Deploy.**

---

## 🎨 التخصيص

- **صور المنتجات:** الصور الحالية رسومات SVG مؤقتة. من اللوحة افتح المنتج واسحب صورك الحقيقية (JPG/PNG/WEBP حتى 8MB)، واسحبها لترتيبها — الأولى هي صورة الغلاف. يمكن حذف الصور المؤقتة بعدها.
- **نصوص الأزرار والقوائم الثابتة** (مثل «Sepete Ekle»): في `src/lib/i18n/dictionaries.ts`.
- **الألوان والخطوط:** `tailwind.config.ts` و `src/lib/fonts.ts`.
- **الشعار:** `src/components/ui/Logo.tsx` و `public/logo.svg`.
- **صورة المشاركة:** استبدل `public/og.png` (1200×630).

---

## 🖼️ الصور الواقعية

- برطمان العسل في الواجهة، وحافة العسل الثابتة (في Hero وبطاقات «الرحلة»)، والنحل، وصور منتجات «Çiçek / Kestane / Karakovan» هي **صور ثلاثية الأبعاد واقعية (Photoreal)** مُصيَّرة بـ Blender/Cycles بخلفية شفافة (WebP) — موجودة في `public/images` و `public/products`.
- سكربتات توليدها في `scripts/render/` (تحتاج `pip install bpy pillow numpy`)، مثال:
  ```bash
  python scripts/render/label.py "ÇİÇEK BALI  ·  850 g" label.png
  python scripts/render/jar.py out.png label.png 800 1000 96 1.0 0.68 0.2 55
  ```
- بقية المنتجات (Petek Bal، Arı Sütü، Propolis…) ما زالت رسومات مؤقتة: ارفع صوراً حقيقية لها من اللوحة.

## ⚡ ملاحظة عن السرعة

`npm run dev` (وضع التطوير — تظهر أيقونة **N** أسفل الشاشة) يُترجم كل صفحة عند أول فتح لها فيبدو بطيئاً (2–5 ثوانٍ). هذا طبيعي ولا يحدث للزبائن.
لتجربة السرعة الحقيقية محلياً:
```bash
npm run build && npm start
```
في الإنتاج: أول ظهور للصفحة ≈ 0.2 ثانية، والانتقال بين الصفحات ≈ 0.25 ثانية.

---

## 🛠️ أوامر مفيدة

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل بيئة التطوير |
| `npm run build` / `npm start` | بناء وتشغيل نسخة الإنتاج محلياً |
| `npm run lint` / `npm run typecheck` | فحص الكود |
| `npm run db:migrate` | إنشاء ترحيل جديد بعد تعديل `schema.prisma` |
| `npm run db:deploy` | تطبيق الترحيلات على قاعدة البيانات |
| `npm run db:seed` | تعبئة البيانات الأولية (آمن للتكرار، لا يمسح تعديلاتك) |
| `npm run db:studio` | واجهة رسومية لتصفح قاعدة البيانات |
| `npm run host:password -- "..."` | إعادة تعيين كلمة مرور اللوحة |

---

## ❓ حل المشكلات

- **«Sunucu hatası» عند الدخول للوحة:** تأكد من `DATABASE_URL` و `SESSION_SECRET` (32 حرفاً على الأقل) ومن تطبيق الترحيلات.
- **فشل البناء عند `prisma migrate deploy`:** تأكد من وجود `DIRECT_URL` صحيح (اتصال مباشر غير Pooled).
- **«Görsel depolama ayarlı değil» عند رفع صورة:** اربط Vercel Blob بالمشروع (الخطوة 4) وأعد النشر.
- **تم حظر الدخول بعد محاولات خاطئة:** انتظر 15 دقيقة، أو احذف صفوف جدول `LoginAttempt` من `npm run db:studio`.
- **الخطوط لا تظهر أثناء البناء محلياً:** `next/font` يحتاج اتصالاً بالإنترنت وقت البناء فقط.

</div>
