import sack1 from '../assets/images/white_rice_sack_1_1786553727373.jpg';
import sack2 from '../assets/images/white_rice_sack_2_1786553744148.jpg';
import sack3 from '../assets/images/white_rice_sack_3_1786553768867.jpg';

export const initialCategories = [
  { id: 'all', name: 'همه محصولات', iconClass: 'fa-solid fa-border-all' },
  { id: 'kamfiroozi-mumtaz', name: 'کامفیروزی ممتاز', iconClass: 'fa-solid fa-crown' },
  { id: 'kamfiroozi-first', name: 'کشت اول معطر', iconClass: 'fa-solid fa-wheat-awn' },
  { id: 'kamfiroozi-doodi', name: 'دودی هیزمی', iconClass: 'fa-solid fa-fire' },
  { id: 'kamfiroozi-brown', name: 'قهوه‌ای رژیمی', iconClass: 'fa-solid fa-heart-pulse' },
  { id: 'kamfiroozi-lasheh', name: 'سرلاشه و نیم‌دانه', iconClass: 'fa-solid fa-bowl-rice' }
];

export const initialProducts = [
  {
    id: 'prod-1',
    _id: 'prod-1',
    name: 'برنج کامفیروزی ممتاز اعلا طلا رایس',
    description: 'برنج اصیل کامفیروز مرودشت با عطر و بوی نوستالژیک، دانه‌های خوش‌ری و پخت مجلسی فوق‌العاده نرم و یکدست.',
    price: 1450000,
    oldPrice: 1650000,
    discountPercent: 12,
    stock: 45,
    inStock: true,
    image: sack1,
    origin: 'کامفیروز، استان فارس',
    farmer: 'حاج احمد رضایی (شالیکار نمونه)',
    cookingRatio: '۱ پیمانه برنج به ۱.۳ پیمانه آب',
    elongation: 'بسیار عالی (ری‌کشی تا ۲ برابر)',
    rating: 5.0,
    reviewCount: 142,
    gallery: [sack1, sack2, sack3],
    features: ['۱۰۰٪ خالص و بدون اختلاط', 'بسته‌بندی نخی سفید ضد رطوبت', 'سورت لیزری و دو الک'],
    cookingTime: '۲۵ الی ۳۰ دقیقه',
    smellLevel: 'فوق‌العاده عالی',
    grainType: 'دانه قلمی کامفیروزی',
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'prod-2',
    _id: 'prod-2',
    name: 'برنج کامفیروزی کشت اول فوق معطر',
    description: 'برداشت اول شالیزارهای حاصلخیز حوزه رود کر کامفیروز با بیشترین عطر طبیعی و ری‌کشی مجلسی استثنایی.',
    price: 1580000,
    oldPrice: 1780000,
    discountPercent: 11,
    stock: 30,
    inStock: true,
    image: sack2,
    origin: 'شالیزارهای چشمه کامفیروز',
    farmer: 'کربلایی علی‌محمد زارع',
    cookingRatio: '۱ پیمانه برنج به ۱.۲۵ پیمانه آب',
    elongation: 'فوق‌العاده کشیده و یکدست',
    rating: 4.9,
    reviewCount: 98,
    gallery: [sack2, sack1, sack3],
    features: ['محصول تازه امسال', 'عطر خیره‌کننده محلی', 'تضمین پخت دانه دانه'],
    cookingTime: '۳۰ دقیقه',
    smellLevel: 'بی‌نظیر و معطر',
    grainType: 'دانه بلند بومی',
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'prod-3',
    _id: 'prod-3',
    name: 'برنج کامفیروزی دودی هیزمی سنتی',
    description: 'دودی شده با چوب درختان جنگلی به روش سنتی؛ طعمی ویژه و نوستالژیک برای غذاهای سنتی و خورشت‌های ایرانی.',
    price: 820000,
    oldPrice: 920000,
    discountPercent: 11,
    stock: 20,
    inStock: true,
    image: sack3,
    origin: 'روستای خانیمن کامفیروز',
    farmer: 'استاد رحیم همتی',
    cookingRatio: '۱ پیمانه به ۱.۳ پیمانه آب',
    elongation: 'بسیار خوش‌پخت با عطر دودی ملایم',
    rating: 4.8,
    reviewCount: 64,
    gallery: [sack3, sack1],
    features: ['دودی طبیعی با چوب بلوط و راش', 'بدون افزودنی شیمیایی', 'طعم اصیل سنتی'],
    cookingTime: '۳۰ دقیقه',
    smellLevel: 'دودی هیزمی مطبوع',
    grainType: 'دانه قلمی',
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'prod-4',
    _id: 'prod-4',
    name: 'برنج قهوه‌ای کامفیروزی رژیمی و سبوس‌دار',
    description: 'سرشار از فیبر طبیعی، ویتامین‌های گروه B و مواد معدنی؛ مناسب برای رژیم‌های سلامت، لاغری و کنترل قند خون.',
    price: 760000,
    oldPrice: 850000,
    discountPercent: 10,
    stock: 15,
    inStock: true,
    image: sack1,
    origin: 'کامفیروز شمالی',
    farmer: 'تعاونی شالیکاران سلامت فارس',
    cookingRatio: '۱ پیمانه برنج به ۱.۵ پیمانه آب',
    elongation: 'بافت سبک و آسان‌هضم',
    rating: 4.9,
    reviewCount: 52,
    gallery: [sack1, sack2],
    features: ['سبوس‌دار و مقوی', 'شاخص گلیسمی پایین', '۱۰۰٪ ارگانیک'],
    cookingTime: '۴۰ دقیقه',
    smellLevel: 'عطر ملایم غلات تازه',
    grainType: 'دانه قهوه‌ای کامل',
    isFeatured: false,
    isDeal: false
  },
  {
    id: 'prod-5',
    _id: 'prod-5',
    name: 'برنج سرلاشه معطر کامفیروزی اعلا',
    description: 'شکسته و سرلاشه برنج ممتاز کامفیروز؛ دارای همان عطر و طعم فوق‌العاده با قیمتی کاملاً اقتصادی برای مصارف روزمره.',
    price: 1150000,
    oldPrice: 1300000,
    discountPercent: 12,
    stock: 50,
    inStock: true,
    image: sack2,
    origin: 'کامفیروز جنوبی',
    farmer: 'اتحادیه کشاورزان کامفیروز',
    cookingRatio: '۱ پیمانه برنج به ۱.۲ پیمانه آب',
    elongation: 'پخت عالی و دانه‌دار',
    rating: 4.7,
    reviewCount: 86,
    gallery: [sack2, sack3],
    features: ['عطر ۱۰۰٪ مشابه برنج دانه کامل', 'تمیز و بوجاری شده', 'مقرون به‌صرفه'],
    cookingTime: '۲۵ دقیقه',
    smellLevel: 'بسیار خوش‌عطر',
    grainType: 'سرلاشه و لاشه',
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'prod-6',
    _id: 'prod-6',
    name: 'برنج کامفیروزی مجلسی بوجار دو الک',
    description: 'مخصوص مهمانی‌ها، مجالس و تالارها؛ یکدستی بی‌نقص، بدون کوچک‌ترین خرده و با ری‌کشی خیره‌کننده.',
    price: 2980000,
    oldPrice: 3300000,
    discountPercent: 10,
    stock: 25,
    inStock: true,
    image: sack3,
    origin: 'حاشیه سد درودزن کامفیروز',
    farmer: 'حاج قاسم زارع',
    cookingRatio: '۱ پیمانه برنج به ۱.۳ پیمانه آب',
    elongation: 'مخصوص سفره‌های رسمی و مجالس',
    rating: 5.0,
    reviewCount: 110,
    gallery: [sack3, sack1, sack2],
    features: ['دو بار بوجار و سورت نوری', 'بسته‌بندی نخی ممتاز', 'ضمانت بازگشت وجه'],
    cookingTime: '۳۰ دقیقه',
    smellLevel: 'عالی و ماندگار',
    grainType: 'دانه قلمی یکدست',
    isFeatured: true,
    isDeal: true
  }
];

export const initialHeroSlides = [
  {
    id: 'slide-1',
    _id: 'slide-1',
    title: 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار',
    description: 'تضمین پخت عالی، عطر بی‌نظیر و کیفیت درجه یک در گونی‌های نخی سفید سفارشی طلا رایس',
    subtitle: 'فروش ویژه فصل جدید',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'مشاهده تخفیف‌های امروز',
    category: 'all',
    link: '/products'
  },
  {
    id: 'slide-2',
    _id: 'slide-2',
    title: 'کشت اول معطر؛ عطر خالص شالیزارهای استان فارس',
    description: 'دست‌چین شده از بهترین خوشه‌های برنج کامفیروزی با دانه‌های قلمی و ری‌کشی فوق‌العاده',
    subtitle: '۱۰۰٪ ارگانیک و طبیعی',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'خرید کیسه ۱۰ کیلویی',
    category: 'kamfiroozi-first',
    link: '/products'
  },
  {
    id: 'slide-3',
    _id: 'slide-3',
    title: 'بسته‌بندی در گونی‌های پارچه‌ای نخی سفید سنتی',
    description: 'حفظ کامل تازگی و جلوگیری از رطوبت با کیسه‌های نخی ممتاز و امکان ارسال به سراسر کشور',
    subtitle: 'ضمانت بازگشت ۷ روزه',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'مشاهده تمامی محصولات',
    category: 'all',
    link: '/products'
  }
];

export const initialTrustItems = [
  {
    id: 'trust-1',
    title: 'تضمین اصالت ۱۰۰٪',
    description: 'برنج کامفیروز خالص بدون ناخالصی و اختلاط، تهیه شده مستقیماً از شالیزارهای حاصلخیز کامفیروز مرودشت.',
    iconClass: 'fa-solid fa-shield-halved'
  },
  {
    id: 'trust-2',
    title: 'ارسال سریع سراسری',
    description: 'ارسال با بسته‌بندی نخی ایمن و بهداشتی از طریق پست پیشتاز و باربری اختصاصی به کلیه شهرهای کشور.',
    iconClass: 'fa-solid fa-truck-fast'
  },
  {
    id: 'trust-3',
    title: 'ضمانت بازگشت ۷ روزه',
    description: 'در صورت هرگونه عدم رضایت از عطر، طعم یا کیفیت پخت، محصول بدون قید و شرط پس گرفته و وجه عودت داده می‌شود.',
    iconClass: 'fa-solid fa-arrow-rotate-left'
  },
  {
    id: 'trust-4',
    title: 'مشاوره و پشتیبانی',
    description: 'پاسخگویی به سوالات خریداران، راهنمای پخت مجلسی و ثبت سفارشات عمده در تمام ایام هفته.',
    iconClass: 'fa-solid fa-headset'
  }
];

export const initialBrandStory = {
  title: 'ارزش و تازگی بی‌نظیر برنج کامفیروزی طلا رایس',
  description: 'طلا رایس با حذف کامل واسطه‌ها، اصیل‌ترین برنج معطر کامفیروز مرودشت استان فارس را در گونی‌های پارچه‌ای سفید با کیفیت مستقیماً به سفره‌های شما می‌رساند. عطر تازگی، پخت نرم و قد کشیدن عالی، تضمین همیشگی طلا رایس است.'
};

export const initialReviews = [
  {
    id: 'rev-1',
    userName: 'دکتر علیرضا محمودی',
    productName: 'خریدار کیسه ۱۰ کیلویی کامفیروزی ممتاز',
    rating: 5,
    comment: 'عطر این برنج واقعاً خاطره‌انگیز و فوق‌العاده‌ست. پخت بسیار آسانی داره و دانه‌ها کاملاً از هم باز و قد کشیده می‌شن. بسته‌بندی نخی تمیز هم عالی بود.'
  },
  {
    id: 'rev-2',
    userName: 'خانم مریم کاظمی (شیراز)',
    productName: 'خریدار کیسه ۲۰ کیلویی مجلسی',
    rating: 5,
    comment: 'برای مهمانی خانوادگی پختم، همه مهمان‌ها مجذوب عطر و نرمی دانه‌ها شدن. ارسال خیلی سریع بود و دقیقاً همون کیفیتی بود که وعده داده بودن.'
  },
  {
    id: 'rev-3',
    userName: 'مهندس سعید کرمی',
    productName: 'خریدار کیسه ۱۰ کیلویی کشت اول',
    rating: 5,
    comment: 'چندین ساله برنج کامفیروز مصرف می‌کنیم، ولی طلا رایس خالص‌ترین و باکیفیت‌ترین نمونه‌ای بود که تا حالا تهیه کردم. بدون هیچ‌گونه خرده و دانه‌های شکسته.'
  },
  {
    id: 'rev-4',
    userName: 'فاطمه رضایی',
    productName: 'خریدار کیسه ۵ کیلویی دودی سنتی',
    rating: 5,
    comment: 'عطر دودی هیزمی بسیار ملایم و سنتی داره و ترکیبش با خورشت فسنجان بی‌نظیر شد. حتماً دوباره سفارش می‌دم.'
  }
];

export const initialArticles = [
  {
    id: 'art-1',
    _id: 'art-1',
    title: 'رازهای پخت مجلسی و قد کشیدن برنج کامفیروز',
    category: 'رازهای پخت',
    summary: 'چگونه برنج کامفیروز را به بهترین شکل آبکش یا کته کنیم تا بیشترین قد و عطر را آزاد کند؟',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    readTime: '۵ دقیقه مطالعه',
    date: '۱۴۰۳/۰۶/۱۵',
    author: 'کارشناس پخت طلا رایس',
    excerpt: 'چگونه برنج کامفیروز را به بهترین شکل آبکش یا کته کنیم تا بیشترین قد و عطر را آزاد کند؟',
    content: [
      'برنج کامفیروز یکی از باکیفیت‌ترین برنج‌های بومی ایران است که به دلیل کشت در آب‌های زلال چشمه‌ها و رودخانه کر، بافتی لطیف و عطری مسحورکننده دارد.',
      'برای پخت کته، نسبت ۱ پیمانه برنج به ۱.۳ پیمانه آب همراه با یک قاشق مرباخوری نمک و کمی روغن محلی ایده‌آل است.',
      'برای آبکش، برنج را ۲ تا ۳ ساعت در آب ولرم و نمک خیس کنید و در هنگام جوشیدن با مقداری آبلیمو یا یخ به آن شوک وارد کنید تا حداکثر قد کشیدن اتفاق بیفتد.'
    ],
    proTips: [
      'از هم زدن زیاد برنج هنگام جوشیدن خودداری کنید تا دانه‌ها نشکنند.',
      'برای دم‌کشی کامل، از دم‌کنی ضخیم استفاده کرده و شعله را در حداقل نگه دارید.'
    ]
  },
  {
    id: 'art-2',
    _id: 'art-2',
    title: 'راهنمای تشخیص برنج اصل کامفیروزی از نمونه‌های تقلبی',
    category: 'راهنمای خرید',
    summary: 'معیارهای مهم در تشخیص دانه، رنگ، عطر طبیعی و عدم اختلاط برنج کامفیروز.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    readTime: '۴ دقیقه مطالعه',
    date: '۱۴۰۳/۰۶/۱۰',
    author: 'مهندس کشاورزی طلا رایس',
    excerpt: 'معیارهای مهم در تشخیص دانه، رنگ، عطر طبیعی و عدم اختلاط برنج کامفیروز.',
    content: [
      'برنج اصیل کامفیروز دارای دانه‌هایی نیمه بلند، مایل به کرم روشن و بدون سفیدی گچی در وسط دانه است.',
      'عطر برنج کامفیروز به طور طبیعی بعد از سایش ملایم دانه‌ها بین دو کف دست آزاد می‌شود و ماندگاری بالایی دارد.'
    ],
    proTips: [
      'دانه‌های برنج اصل کامفیروز چربی طبیعی مطبوعی دارند که در پخت نرمی فوق‌العاده‌ای ایجاد می‌کند.'
    ]
  },
  {
    id: 'art-3',
    _id: 'art-3',
    title: 'روش‌های اصولی نگهداری برنج در کیسه‌های نخی',
    category: 'نگهداری برنج',
    summary: 'چگونه از شته و آفت‌زدگی برنج جلوگیری کنیم و کیفیت عطر آن را ماه‌ها حفظ کنیم؟',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800',
    readTime: '۳ دقیقه مطالعه',
    date: '۱۴۰۳/۰۵/۲۸',
    author: 'تیم پشتیبانی طلا رایس',
    excerpt: 'چگونه از شته و آفت‌زدگی برنج جلوگیری کنیم و کیفیت عطر آن را ماه‌ها حفظ کنیم؟',
    content: [
      'کیسه‌های پارچه‌ای نخی سفید طلا رایس به دلیل تنفس‌پذیری طبیعی، مانع از تعریق دانه و ایجاد بوی رطوبت می‌شوند.',
      'بهترین محل نگهداری، مکانی خشک، خنک و دور از تابش مستقیم آفتاب با فاصله ۱۰ سانتی‌متری از سطح زمین است.'
    ],
    proTips: [
      'قرار دادن چند حبه سیر خشک یا برگ بو داخل گونی از آفت‌زدگی جلوگیری می‌کند.'
    ]
  }
];

export const initialTestTips = [
  {
    title: 'شستشوی ملایم',
    desc: 'برنج را به آرامی و بدون چنگ زدن بشویید تا دانه‌ها آسیب نبینند و نشکنند.',
    iconClass: 'fa-solid fa-hand-holding-droplet'
  },
  {
    title: 'خیساندن مناسب',
    desc: 'حداقل ۲ ساعت خیساندن در آب ولرم با نمک به قد کشیدن حداکثری کمک می‌کند.',
    iconClass: 'fa-solid fa-hourglass-half'
  },
  {
    title: 'شوک یخ هنگام جوش',
    desc: 'افزودن چند تکه یخ قبل از آبکش کردن به قد کشیدن برنج شوک می‌دهد.',
    iconClass: 'fa-solid fa-snowflake'
  },
  {
    title: 'روغن حیوانی یا کره',
    desc: 'کمی روغن محلی روی برنج در انتهای دم‌کشی عطر آن را دوچندان می‌کند.',
    iconClass: 'fa-solid fa-fire-burner'
  }
];

export const initialCoupons = [
  {
    code: 'TALA20',
    discountPercent: 20,
    minSpend: 500000,
    description: '۲۰٪ تخفیف خرید اول'
  },
  {
    code: 'BAHAR',
    discountPercent: 15,
    minSpend: 300000,
    description: '۱۵٪ تخفیف ویژه'
  },
  {
    code: 'KAMFIROOZ',
    discountPercent: 10,
    minSpend: 0,
    description: '۱۰٪ تخفیف بدون سقف'
  }
];

export const initialOrders = [
  {
    id: 'ORD-9104',
    date: '۱۴۰۳/۰۶/۲۸',
    items: [
      {
        product: initialProducts[0],
        weightKg: 10,
        quantity: 1
      }
    ],
    totalAmount: 1450000,
    discountAmount: 145000,
    shippingFee: 0,
    finalAmount: 1305000,
    status: 'reviewing',
    trackingCode: 'TRK-9842104',
    recipientName: 'محمد رضایی',
    phone: '۰۹۱۷۱۲۳۴۵۶۷',
    province: 'فارس',
    city: 'شیراز',
    postalCode: '۷۱۸۴۵۶۷۸۹۰',
    fullAddress: 'شیراز، بلوار ارم، کوچه ۱۲، پلاک ۲۴',
    user: {
      name: 'محمد رضایی',
      phone: '۰۹۱۷۱۲۳۴۵۶۷'
    }
  },
  {
    id: 'ORD-8920',
    date: '۱۴۰۳/۰۶/۲۵',
    items: [
      {
        product: initialProducts[1] || initialProducts[0],
        weightKg: 5,
        quantity: 2
      }
    ],
    totalAmount: 1560000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 1560000,
    status: 'shipping',
    trackingCode: 'TRK-9831920',
    recipientName: 'زهرا موسوی',
    phone: '۰۹۳۵۹۸۷۶۵۴۳',
    province: 'فارس',
    city: 'شیراز',
    postalCode: '۷۱۴۵۶۱۲۳۸۹',
    fullAddress: 'شیراز، میدان قدوسی غربی، خیابان سبحانی، مجتمع سرو',
    user: {
      name: 'زهرا موسوی',
      phone: '۰۹۳۵۹۸۷۶۵۴۳'
    }
  },
  {
    id: 'ORD-8715',
    date: '۱۴۰۳/۰۶/۲۰',
    items: [
      {
        product: initialProducts[0],
        weightKg: 20,
        quantity: 1
      }
    ],
    totalAmount: 2800000,
    discountAmount: 200000,
    shippingFee: 0,
    finalAmount: 2600000,
    status: 'shipped',
    trackingCode: 'TRK-9815712',
    recipientName: 'امیرحسین کریمی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    postalCode: '۱۹۸۷۶۵۴۳۲۱',
    fullAddress: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۱۸',
    user: {
      name: 'امیرحسین کریمی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹'
    }
  },
  {
    id: 'ORD-8421',
    date: '۱۴۰۳/۰۶/۱۵',
    items: [
      {
        product: initialProducts[0],
        weightKg: 10,
        quantity: 2
      }
    ],
    totalAmount: 2900000,
    discountAmount: 290000,
    shippingFee: 0,
    finalAmount: 2610000,
    status: 'delivered',
    trackingCode: 'TRK-9784210',
    recipientName: 'رضا کمالی',
    phone: '۰۹۱۷۳۱۱۴۴۵۵',
    province: 'فارس',
    city: 'مرودشت',
    postalCode: '۷۳۷۱۸۴۵۶۹۰',
    fullAddress: 'مرودشت، خیابان انقلاب، نبش کوچه شهید رضایی',
    user: {
      name: 'رضا کمالی',
      phone: '۰۹۱۷۳۱۱۴۴۵۵'
    }
  }
];
