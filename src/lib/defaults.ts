/**
 * Default content & demo catalog.
 * - Used by `prisma/seed.ts` to fill a fresh database.
 * - Used as a fallback when a key is missing in the database (so the site never renders empty).
 * Everything here can be edited later from /hostpage.
 */
import type { CategoryDTO, ProductDTO, SiteContent } from "./types";
import { defaultMedia } from "./media";

export const defaultContent: SiteContent = {
  announcement: {
    enabled: true,
    text: {
      tr: "🐝 750 ₺ ve üzeri siparişlerde kargo bedava! · Aynı gün kargo",
      en: "🐝 Free shipping on orders over 750 ₺ · Same-day dispatch",
      ar: "🐝 شحن مجاني للطلبات فوق 750 ₺ · شحن في نفس اليوم",
    },
    link: "/magaza",
  },
  hero: {
    eyebrow: {
      tr: "Anadolu yaylalarından sofranıza",
      en: "From the Anatolian highlands to your table",
      ar: "من هضاب الأناضول إلى مائدتك",
    },
    title: { tr: "Doğanın Altın Şifası", en: "Nature's Golden Remedy", ar: "شفاء الطبيعة الذهبي" },
    subtitle: {
      tr: "Katkısız, işlenmemiş ve özenle hasat edilmiş ham bal ile arı ürünleri. Her kavanozda bir yaylanın hikâyesi.",
      en: "Pure, unprocessed and carefully harvested raw honey and bee products. A highland story in every jar.",
      ar: "عسل خام نقي غير معالج ومنتجات نحل محصودة بعناية. في كل برطمان حكاية هضبة.",
    },
    ctaPrimary: { tr: "Mağazayı Keşfet", en: "Explore the Shop", ar: "تسوّق الآن" },
    ctaSecondary: { tr: "Hikâyemiz", en: "Our Story", ar: "قصتنا" },
  },
  stats: { customers: 12500, hives: 640, years: 27 },
  why: {
    title: { tr: "Neden Şifa Balı?", en: "Why Şifa Balı?", ar: "لماذا شفاء بالي؟" },
    subtitle: {
      tr: "Üç kuşaktır süren arıcılık geleneğini modern kalite standartlarıyla buluşturuyoruz.",
      en: "Three generations of beekeeping tradition, meeting modern quality standards.",
      ar: "ثلاثة أجيال من تقاليد تربية النحل تلتقي بمعايير الجودة الحديثة.",
    },
    items: [
      {
        icon: "leaf",
        title: { tr: "%100 Doğal", en: "100% Natural", ar: "طبيعي 100%" },
        text: {
          tr: "Şeker şurubu, katkı ya da ısıl işlem yok. Petekten kavanoza, olduğu gibi.",
          en: "No sugar syrup, additives or heat treatment. From comb to jar, exactly as it is.",
          ar: "بدون شراب سكر أو إضافات أو معالجة حرارية. من الشهد إلى البرطمان كما هو.",
        },
      },
      {
        icon: "flask",
        title: { tr: "Laboratuvar Onaylı", en: "Lab Tested", ar: "مُختبر معملياً" },
        text: {
          tr: "Her hasat bağımsız laboratuvarlarda analiz edilir; raporlar talep üzerine paylaşılır.",
          en: "Every harvest is analysed by independent labs; reports are shared on request.",
          ar: "كل حصاد يُحلَّل في مختبرات مستقلة، والتقارير متاحة عند الطلب.",
        },
      },
      {
        icon: "mountain",
        title: { tr: "Yayla Arıcılığı", en: "Highland Apiaries", ar: "مناحل الهضاب" },
        text: {
          tr: "Kovanlarımız 1.500 metre üzerindeki, tarım ilacından uzak endemik çiçek yaylalarında.",
          en: "Our hives sit above 1,500 m, in pesticide-free highlands full of endemic flowers.",
          ar: "خلايانا فوق 1500 متر، في هضاب خالية من المبيدات ومليئة بالأزهار المستوطنة.",
        },
      },
      {
        icon: "truck",
        title: { tr: "Özenli Teslimat", en: "Careful Delivery", ar: "توصيل بعناية" },
        text: {
          tr: "Kırılmaya karşı özel ambalaj ve aynı gün kargo ile kapınıza kadar.",
          en: "Break-proof packaging and same-day shipping, right to your door.",
          ar: "تغليف خاص ضد الكسر وشحن في نفس اليوم حتى باب منزلك.",
        },
      },
    ],
  },
  journey: {
    title: { tr: "Çiçekten Kavanoza", en: "From Flower to Jar", ar: "من الزهرة إلى البرطمان" },
    subtitle: {
      tr: "Bir kaşık balın arkasındaki sabırlı yolculuk.",
      en: "The patient journey behind a single spoonful.",
      ar: "الرحلة الصبورة خلف ملعقة واحدة من العسل.",
    },
    steps: [
      {
        image: "/images/journey/cicek.png",
        fit: "cover",
        title: { tr: "Çiçek", en: "The Flower", ar: "الزهرة" },
        text: {
          tr: "Arılarımız binlerce endemik yayla çiçeğinden nektar toplar.",
          en: "Our bees gather nectar from thousands of endemic highland flowers.",
          ar: "يجمع نحلنا الرحيق من آلاف أزهار الهضاب المستوطنة.",
        },
      },
      {
        image: "/images/journey/ari.png",
        fit: "cover",
        title: { tr: "Arı", en: "The Bee", ar: "النحلة" },
        text: {
          tr: "Tek bir arı ömrü boyunca yalnızca bir çay kaşığının 1/12'si kadar bal üretir.",
          en: "A single bee makes only 1/12 of a teaspoon of honey in its lifetime.",
          ar: "تنتج النحلة الواحدة 1/12 ملعقة صغيرة فقط من العسل طوال حياتها.",
        },
      },
      {
        image: "/images/journey/petek.png",
        fit: "contain",
        title: { tr: "Petek", en: "The Comb", ar: "الشهد" },
        text: {
          tr: "Nektar petek gözlerinde olgunlaşır ve arılar tarafından mumla mühürlenir.",
          en: "Nectar ripens inside the comb cells and is sealed with wax by the bees.",
          ar: "ينضج الرحيق داخل خلايا الشهد وتختمه النحلات بالشمع.",
        },
      },
      {
        image: "/images/journey/hasat.png",
        fit: "contain",
        title: { tr: "Hasat", en: "The Harvest", ar: "الحصاد" },
        text: {
          tr: "Yalnızca olgun petekler, arıya yetecek bal bırakılarak elle hasat edilir.",
          en: "Only ripe combs are hand-harvested, always leaving enough honey for the bees.",
          ar: "تُحصد الأقراص الناضجة فقط يدوياً مع ترك ما يكفي من العسل للنحل.",
        },
      },
      {
        image: "/images/journey/kavanoz.png",
        fit: "cover",
        title: { tr: "Kavanoz", en: "The Jar", ar: "البرطمان" },
        text: {
          tr: "Soğuk süzme ile, ısıtılmadan cam kavanozlara doldurulur ve size ulaşır.",
          en: "Cold-strained, never heated, poured into glass jars and sent to you.",
          ar: "يُصفّى على البارد دون تسخين، ويُعبّأ في برطمانات زجاجية ويصل إليك.",
        },
      },
    ],
  },
  about: {
    title: { tr: "Üç Kuşaktır Arıcılık", en: "Three Generations of Beekeeping", ar: "ثلاثة أجيال من تربية النحل" },
    intro: {
      tr: "Şifa Balı, 1998'de Karadeniz yaylalarında birkaç kovanla başlayan bir aile hikâyesidir.",
      en: "Şifa Balı is a family story that began in 1998 with a few hives in the Black Sea highlands.",
      ar: "شفاء بالي قصة عائلية بدأت عام 1998 ببضع خلايا في هضاب البحر الأسود.",
    },
    story: {
      tr: "Dedemizin sabırla kurduğu arılıklar, bugün 640'tan fazla kovanla Anadolu'nun en temiz yaylalarına yayıldı. Göçer arıcılık yaparak arılarımızı mevsime göre çiçeğin en bol olduğu yerlere taşıyoruz.\n\nBalı asla ısıtmıyor, süzmeyi soğuk yapıyor ve her hasadı laboratuvarda test ettiriyoruz. Çünkü inanıyoruz ki gerçek bal, doğanın bize sunduğu en saf şifadır.\n\nBugün binlerce aileye ulaşan Şifa Balı, ilk günkü titizliğini ve dürüstlüğünü koruyor.",
      en: "The apiaries our grandfather patiently built have grown to more than 640 hives across Anatolia's cleanest highlands. As migratory beekeepers, we move our bees with the seasons to wherever the flowers are most abundant.\n\nWe never heat our honey, we strain it cold and have every harvest tested in a lab. Because we believe real honey is the purest remedy nature offers.\n\nToday Şifa Balı reaches thousands of families while keeping the care and honesty of its very first day.",
      ar: "المناحل التي بناها جدّنا بصبر نمت اليوم إلى أكثر من 640 خلية في أنقى هضاب الأناضول. نحن نربي النحل بأسلوب الترحال، فننقل نحلنا مع المواسم إلى حيث تكثر الأزهار.\n\nلا نسخّن عسلنا أبداً، ونصفّيه على البارد، ونختبر كل حصاد في المختبر. لأننا نؤمن أن العسل الحقيقي هو أنقى شفاء تقدّمه الطبيعة.\n\nاليوم يصل شفاء بالي إلى آلاف العائلات مع الحفاظ على عناية وصدق يومه الأول.",
    },
    mission: {
      tr: "Misyonumuz: arıyı ve doğayı koruyarak, sofranıza en saf balı getirmek.",
      en: "Our mission: to bring the purest honey to your table while protecting bees and nature.",
      ar: "رسالتنا: أن نقدّم أنقى عسل إلى مائدتك مع حماية النحل والطبيعة.",
    },
    quote: {
      tr: "“Arı çiçeğe zarar vermeden bal yapar. Biz de doğaya zarar vermeden arıcılık yapıyoruz.”",
      en: "“The bee makes honey without harming the flower. We keep bees without harming nature.”",
      ar: "«النحلة تصنع العسل دون أن تؤذي الزهرة، ونحن نربي النحل دون أن نؤذي الطبيعة.»",
    },
  },
  testimonials: {
    title: { tr: "Müşterilerimiz Ne Diyor?", en: "What Our Customers Say", ar: "ماذا يقول عملاؤنا؟" },
    items: [
      {
        id: "t1",
        name: "Ayşe K.",
        city: "İstanbul",
        rating: 5,
        text: {
          tr: "Kestane balının tadı çocukluğumdaki köy balını hatırlattı. Paketleme de kusursuzdu.",
          en: "The chestnut honey tastes just like the village honey of my childhood. Packaging was flawless.",
          ar: "طعم عسل الكستناء ذكّرني بعسل القرية في طفولتي. والتغليف كان مثالياً.",
        },
      },
      {
        id: "t2",
        name: "Mehmet D.",
        city: "Ankara",
        rating: 5,
        text: {
          tr: "Karakovan balını ilk kez denedim, gerçekten farklı. Artık her ay sipariş veriyorum.",
          en: "My first time trying karakovan honey — truly different. I now order every month.",
          ar: "جرّبت عسل الكاراكوفان لأول مرة، مختلف حقاً. أطلب الآن كل شهر.",
        },
      },
      {
        id: "t3",
        name: "Layla A.",
        city: "Dubai",
        rating: 5,
        text: {
          tr: "Hediye kutusunu aileme gönderdim, herkes bayıldı. Zarif ve lezzetli.",
          en: "I sent the gift box to my family and everyone loved it. Elegant and delicious.",
          ar: "أرسلت صندوق الهدايا لعائلتي وأعجب الجميع. أنيق ولذيذ.",
        },
      },
      {
        id: "t4",
        name: "Elif S.",
        city: "İzmir",
        rating: 5,
        text: {
          tr: "Propolis damlası kış boyunca vazgeçilmezimiz oldu. Hızlı kargo için teşekkürler!",
          en: "The propolis drops were our winter essential. Thanks for the fast shipping!",
          ar: "قطرات البروبوليس كانت أساسية لنا طوال الشتاء. شكراً على الشحن السريع!",
        },
      },
    ],
  },
  newsletter: {
    title: { tr: "Hasat Haberlerini Kaçırmayın", en: "Never Miss a Harvest", ar: "لا تفوّت أخبار الحصاد" },
    text: {
      tr: "Yeni hasatlar, sınırlı üretimler ve abonelere özel indirimler için bültenimize katılın.",
      en: "Join our newsletter for new harvests, limited batches and subscriber-only offers.",
      ar: "اشترك في نشرتنا للحصول على أخبار الحصاد الجديد والإنتاج المحدود والعروض الحصرية.",
    },
  },
  brand: {
    tagline: { tr: "Doğanın altın şifası", en: "Nature's golden remedy", ar: "شفاء الطبيعة الذهبي" },
    footerText: {
      tr: "Anadolu yaylalarından, katkısız ve özenle hasat edilmiş bal ve arı ürünleri.",
      en: "Pure, carefully harvested honey and bee products from the Anatolian highlands.",
      ar: "عسل ومنتجات نحل نقية محصودة بعناية من هضاب الأناضول.",
    },
  },
  contact: {
    whatsapp: "+90 555 123 45 67",
    phone: "+90 555 123 45 67",
    email: "merhaba@sifabali.com",
    address: {
      tr: "Bağdat Cad. No: 128, Kadıköy / İstanbul",
      en: "Bağdat Ave. No: 128, Kadıköy / Istanbul, Türkiye",
      ar: "شارع بغداد رقم 128، كاديكوي / إسطنبول، تركيا",
    },
    hours: {
      tr: "Pazartesi – Cumartesi · 09:00 – 19:00",
      en: "Monday – Saturday · 09:00 – 19:00",
      ar: "الإثنين – السبت · 09:00 – 19:00",
    },
    mapUrl: "https://maps.google.com/?q=Kadıköy+İstanbul",
    instagram: "https://instagram.com/sifabali",
    facebook: "https://facebook.com/sifabali",
    youtube: "",
    tiktok: "",
  },
  seo: {
    title: {
      tr: "Şifa Balı — Doğal Ham Bal ve Arı Ürünleri",
      en: "Şifa Balı — Natural Raw Honey & Bee Products",
      ar: "شفاء بالي — عسل خام طبيعي ومنتجات النحل",
    },
    description: {
      tr: "Anadolu yaylalarından katkısız çiçek balı, kestane balı, karakovan ve petek bal, arı sütü, propolis ve polen. Güvenli alışveriş, hızlı kargo.",
      en: "Pure flower, chestnut, karakovan and comb honey, royal jelly, propolis and pollen from the Anatolian highlands. Secure shopping, fast delivery.",
      ar: "عسل الزهور والكستناء والكاراكوفان وعسل الشهد وغذاء الملكات والبروبوليس وحبوب اللقاح من هضاب الأناضول. تسوّق آمن وتوصيل سريع.",
    },
  },
  media: defaultMedia,
};

export const defaultCategories: CategoryDTO[] = [
  { id: "cat-ballar", slug: "ballar", name: { tr: "Ballar", en: "Honeys", ar: "أنواع العسل" }, sortOrder: 1 },
  { id: "cat-ari-urunleri", slug: "ari-urunleri", name: { tr: "Arı Ürünleri", en: "Bee Products", ar: "منتجات النحل" }, sortOrder: 2 },
  { id: "cat-hediyelik", slug: "hediyelik", name: { tr: "Hediyelik", en: "Gifts", ar: "هدايا" }, sortOrder: 3 },
];

type SeedProduct = Omit<ProductDTO, "id" | "visible" | "sortOrder"> & { categorySlug: string };

const img = (slug: string) => [`/products/${slug}.svg`, `/products/${slug}-detail.svg`];
/** Photoreal studio renders (transparent WebP) for the honey jars */
const photo = (slug: string) => [`/products/${slug}.webp`];

export const defaultProducts: SeedProduct[] = [
  {
    slug: "cicek-bali-850g",
    categorySlug: "ballar",
    name: { tr: "Çiçek Balı", en: "Wildflower Honey", ar: "عسل الزهور" },
    description: {
      tr: "Yüzlerce yayla çiçeğinin nektarından oluşan, hafif ve aromatik süzme çiçek balı. Kahvaltıların vazgeçilmezi.",
      en: "Light, aromatic strained honey made from the nectar of hundreds of highland flowers. A breakfast essential.",
      ar: "عسل زهور مصفّى خفيف وعطري من رحيق مئات أزهار الهضاب. لا غنى عنه على الفطور.",
    },
    benefits: {
      tr: ["Doğal enerji kaynağı", "Antioksidan açısından zengin", "Boğazı yumuşatır"],
      en: ["Natural source of energy", "Rich in antioxidants", "Soothes the throat"],
      ar: ["مصدر طبيعي للطاقة", "غني بمضادات الأكسدة", "يلطّف الحلق"],
    },
    weight: "850 g",
    price: 650,
    salePrice: null,
    stock: 120,
    images: photo("cicek-bali"),
    featured: true,
    categoryId: null,
  },
  {
    slug: "kestane-bali-850g",
    categorySlug: "ballar",
    name: { tr: "Kestane Balı", en: "Chestnut Honey", ar: "عسل الكستناء" },
    description: {
      tr: "Karadeniz'in kestane ormanlarından; koyu renkli, hafif acımsı ve yoğun aromalı değerli bir bal.",
      en: "From the chestnut forests of the Black Sea; a dark, slightly bitter and intensely aromatic honey.",
      ar: "من غابات الكستناء في البحر الأسود؛ عسل داكن بمرارة خفيفة ونكهة مركّزة.",
    },
    benefits: {
      tr: ["Yüksek mineral içeriği", "Bağışıklığı destekler", "Kan dolaşımına faydalı"],
      en: ["High mineral content", "Supports immunity", "Good for circulation"],
      ar: ["محتوى عالٍ من المعادن", "يدعم المناعة", "مفيد للدورة الدموية"],
    },
    weight: "850 g",
    price: 900,
    salePrice: null,
    stock: 80,
    images: photo("kestane-bali"),
    featured: true,
    categoryId: null,
  },
  {
    slug: "karakovan-bali-1kg",
    categorySlug: "ballar",
    name: { tr: "Karakovan Balı", en: "Karakovan Honey", ar: "عسل الكاراكوفان" },
    description: {
      tr: "Ağaç kovuklarından yapılan geleneksel kovanlarda, hiçbir müdahale olmadan üretilen nadir ve çok değerli bal.",
      en: "A rare, prized honey made in traditional hollow-log hives without any human intervention.",
      ar: "عسل نادر وثمين يُنتج في خلايا تقليدية من جذوع الأشجار دون أي تدخل بشري.",
    },
    benefits: {
      tr: ["Tamamen doğal üretim", "Polen ve propolis içerir", "Eşsiz aroma"],
      en: ["Completely natural production", "Contains pollen and propolis", "Unique aroma"],
      ar: ["إنتاج طبيعي بالكامل", "يحتوي على حبوب اللقاح والبروبوليس", "نكهة فريدة"],
    },
    weight: "1 kg",
    price: 1400,
    salePrice: null,
    stock: 25,
    images: photo("karakovan-bali"),
    featured: true,
    categoryId: null,
  },
  {
    slug: "petek-bal-1kg",
    categorySlug: "ballar",
    name: { tr: "Petek Bal", en: "Honeycomb", ar: "عسل الشهد" },
    description: {
      tr: "Arıların ördüğü doğal petekleriyle, olduğu gibi kesilip kutulanan en saf bal formu.",
      en: "Honey in its purest form — natural comb, cut and boxed exactly as the bees built it.",
      ar: "العسل في أنقى صوره — شهد طبيعي يُقطع ويُعبّأ كما بناه النحل تماماً.",
    },
    benefits: {
      tr: ["Balmumu ile birlikte tüketilir", "Sindirimi destekler", "İşlenmemiş"],
      en: ["Eaten together with the wax", "Supports digestion", "Unprocessed"],
      ar: ["يؤكل مع الشمع", "يدعم الهضم", "غير معالج"],
    },
    weight: "1 kg",
    price: 1200,
    salePrice: null,
    stock: 40,
    images: img("petek-bal"),
    featured: false,
    categoryId: null,
  },
  {
    slug: "ari-sutu-50g",
    categorySlug: "ari-urunleri",
    name: { tr: "Arı Sütü", en: "Royal Jelly", ar: "غذاء ملكات النحل" },
    description: {
      tr: "Kraliçe arının besini, taze ve saf arı sütü. Soğuk zincirle gönderilir.",
      en: "The queen bee's food — fresh, pure royal jelly shipped with a cold chain.",
      ar: "غذاء ملكة النحل — غذاء ملكات طازج ونقي يُشحن بسلسلة تبريد.",
    },
    benefits: {
      tr: ["Vitamin B kompleksi", "Enerji ve zindelik", "Cilt sağlığını destekler"],
      en: ["Vitamin B complex", "Energy and vitality", "Supports skin health"],
      ar: ["مركّب فيتامين ب", "طاقة وحيوية", "يدعم صحة البشرة"],
    },
    weight: "50 g",
    price: 750,
    salePrice: null,
    stock: 30,
    images: img("ari-sutu"),
    featured: false,
    categoryId: null,
  },
  {
    slug: "propolis-damla-30ml",
    categorySlug: "ari-urunleri",
    name: { tr: "Propolis Damla", en: "Propolis Drops", ar: "قطرات البروبوليس" },
    description: {
      tr: "Yüksek oranda ham propolis içeren, alkolsüz sulu propolis ekstraktı.",
      en: "Alcohol-free water-based extract with a high concentration of raw propolis.",
      ar: "مستخلص بروبوليس مائي خالٍ من الكحول بتركيز عالٍ من البروبوليس الخام.",
    },
    benefits: {
      tr: ["Doğal koruyucu", "Ağız ve boğaz sağlığı", "Alkolsüz formül"],
      en: ["Natural defender", "Mouth and throat health", "Alcohol-free formula"],
      ar: ["حماية طبيعية", "صحة الفم والحلق", "تركيبة خالية من الكحول"],
    },
    weight: "30 ml",
    price: 350,
    salePrice: null,
    stock: 150,
    images: img("propolis-damla"),
    featured: false,
    categoryId: null,
  },
  {
    slug: "cicek-poleni-250g",
    categorySlug: "ari-urunleri",
    name: { tr: "Çiçek Poleni", en: "Bee Pollen", ar: "حبوب لقاح الزهور" },
    description: {
      tr: "Rengârenk, kurutulmuş taze çiçek poleni. Yoğurt, smoothie ve kahvaltılara mükemmel.",
      en: "Colourful, gently dried fresh bee pollen. Perfect with yogurt, smoothies and breakfast.",
      ar: "حبوب لقاح طازجة ملوّنة ومجففة بلطف. مثالية مع الزبادي والعصائر والفطور.",
    },
    benefits: {
      tr: ["Doğal protein kaynağı", "Amino asit deposu", "Güne zinde başlangıç"],
      en: ["Natural protein source", "Packed with amino acids", "An energetic start to the day"],
      ar: ["مصدر طبيعي للبروتين", "غني بالأحماض الأمينية", "بداية نشيطة لليوم"],
    },
    weight: "250 g",
    price: 400,
    salePrice: null,
    stock: 60,
    images: img("cicek-poleni"),
    featured: false,
    categoryId: null,
  },
  {
    slug: "balmumu-mum-seti",
    categorySlug: "hediyelik",
    name: { tr: "Doğal Balmumu Mum Seti", en: "Natural Beeswax Candle Set", ar: "طقم شموع شمع العسل الطبيعي" },
    description: {
      tr: "%100 saf balmumundan el yapımı, hafif bal kokulu, isli olmayan 3'lü mum seti.",
      en: "Handmade set of 3 candles from 100% pure beeswax — soot-free with a gentle honey scent.",
      ar: "طقم من 3 شموع مصنوعة يدوياً من شمع العسل النقي 100% — بلا سخام وبرائحة عسل لطيفة.",
    },
    benefits: {
      tr: ["Havayı temizler", "Uzun yanma süresi", "El yapımı"],
      en: ["Purifies the air", "Long burn time", "Handmade"],
      ar: ["ينقّي الهواء", "مدة احتراق طويلة", "صناعة يدوية"],
    },
    weight: "3 × 120 g",
    price: 300,
    salePrice: null,
    stock: 45,
    images: img("balmumu-mum"),
    featured: false,
    categoryId: null,
  },
  {
    slug: "hediye-kutusu",
    categorySlug: "hediyelik",
    name: { tr: "Hediye Kutusu (Bal Çeşitleri)", en: "Gift Box (Honey Selection)", ar: "صندوق هدايا (تشكيلة عسل)" },
    description: {
      tr: "Çiçek, kestane ve karakovan balından oluşan, ahşap kaşıklı şık hediye kutusu.",
      en: "An elegant gift box with flower, chestnut and karakovan honey plus a wooden dipper.",
      ar: "صندوق هدايا أنيق يضم عسل الزهور والكستناء والكاراكوفان مع ملعقة خشبية.",
    },
    benefits: {
      tr: ["3 farklı bal", "Ahşap bal kaşığı", "Hediye notu eklenebilir"],
      en: ["3 different honeys", "Wooden honey dipper", "Gift note available"],
      ar: ["3 أنواع من العسل", "ملعقة عسل خشبية", "إمكانية إضافة بطاقة إهداء"],
    },
    weight: "3 × 450 g",
    price: 1800,
    salePrice: null,
    stock: 20,
    images: img("hediye-kutusu"),
    featured: true,
    categoryId: null,
  },
];

/** Converts seed products into DTOs (used as a fallback when the database is unreachable) */
export function fallbackProducts(): ProductDTO[] {
  return defaultProducts.map((p, i) => {
    const { categorySlug, ...rest } = p;
    return {
      ...rest,
      id: `fallback-${p.slug}`,
      visible: true,
      sortOrder: i,
      categoryId: defaultCategories.find((c) => c.slug === categorySlug)?.id ?? null,
    };
  });
}
