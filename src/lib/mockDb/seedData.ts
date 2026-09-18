import { PRODUCTS, MOCK_REVIEWS } from '../../data/products';
import type { 
  AdminProduct, 
  AdminCategory, 
  AdminCollection, 
  AdminOrder, 
  AdminCustomer, 
  AdminReview, 
  MediaAsset,
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  DeliverySettings,
  StoreSettings,
  CheckoutSettings,
  ProductImageItem
} from '../../types/admin';

export const INITIAL_PRODUCTS: AdminProduct[] = PRODUCTS.map((p, index) => {
  let images: ProductImageItem[] = [];

  if (p.images.gallery && p.images.gallery.length > 0) {
    images = p.images.gallery.map((url, i) => ({
      id: `img-${p.id}-${i + 1}`,
      url,
      alt: `${p.name} view ${i + 1}`,
      type: i === 0 ? 'primary' : 'gallery',
      isPrimary: i === 0,
      sortOrder: i + 1
    }));
  } else {
    images = [
      {
        id: `img-${p.id}-1`,
        url: p.images.main,
        alt: `${p.name} primary photo`,
        type: 'primary',
        sortOrder: 1
      },
      {
        id: `img-${p.id}-2`,
        url: p.images.secondary,
        alt: `${p.name} secondary angle`,
        type: 'gallery',
        sortOrder: 2
      }
    ];

    if (p.images.childHolding) {
      images.push({
        id: `img-${p.id}-3`,
        url: p.images.childHolding,
        alt: `${p.name} in child hands`,
        type: 'lifestyle',
        sortOrder: 3
      });
    }

    if (p.images.inPlay) {
      images.push({
        id: `img-${p.id}-4`,
        url: p.images.inPlay,
        alt: `${p.name} during open play`,
        type: 'lifestyle',
        sortOrder: 4
      });
    }

    if (p.images.detail) {
      images.push({
        id: `img-${p.id}-5`,
        url: p.images.detail,
        alt: `${p.name} material detail`,
        type: 'detail',
        sortOrder: 5
      });
    }

    if (p.images.scaleRef) {
      images.push({
        id: `img-${p.id}-6`,
        url: p.images.scaleRef,
        alt: `${p.name} scale reference`,
        type: 'scale',
        sortOrder: 6
      });
    }
  }

  const baseSku = `GK-${p.id.split('-').map(w => w[0]?.toUpperCase()).join('')}-${100 + index}`;
  const quantity = p.inStock ? 12 + index * 4 : 0;

  return {
    id: p.id,
    name: p.name,
    slug: p.id,
    subtitle: p.subtitle,
    tag: p.tag || '',
    status: p.inStock ? 'active' : 'draft',
    price: p.price,
    originalPrice: p.originalPrice,
    currency: 'BDT',
    rating: p.rating,
    reviewCount: p.reviewCount,
    ageBadge: p.ageBadge,
    ageGroup: p.ageGroup,
    category: p.category,
    interests: p.interests,
    benefits: p.benefits,
    materials: p.materials,
    occasions: p.occasions,
    valueStatement: p.valueStatement,
    description: p.description,
    sensoryQuote: p.sensoryQuote,
    whyKidsLoveIt: p.whyKidsLoveIt,
    developmentMilestones: p.developmentMilestones,
    whatsInside: p.whatsInside,
    images,
    featuredImageId: images[0]?.id,
    dimensions: p.dimensions,
    careInstructions: p.careInstructions,
    safetyNotes: p.safetyNotes,
    inventory: {
      trackInventory: true,
      quantity,
      lowStockThreshold: 5,
      allowBackorder: false,
      sku: baseSku,
    },
    inStock: p.inStock,
    featured: index < 4,
    seo: {
      metaTitle: `${p.name} | Wooden Montessori Toys Bangladesh | GrowKins`,
      metaDescription: p.valueStatement
    },
    createdAt: new Date(Date.now() - (index + 1) * 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
  };
});

export const INITIAL_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-open-ended',
    name: 'Open-ended play',
    slug: 'open-ended-play',
    description: 'Versatile play elements without rules or scripted outcomes.',
    status: 'active',
    sortOrder: 1,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Open-ended play').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-stacking',
    name: 'Stacking toys',
    slug: 'stacking-toys',
    description: 'Precision-crafted nesting arches, balancing figurines and towers.',
    status: 'active',
    sortOrder: 2,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Stacking toys').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-building',
    name: 'Building sets',
    slug: 'building-sets',
    description: 'Solid beechwood blocks, arches and architectural inspiration.',
    status: 'active',
    sortOrder: 3,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Building sets').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-art',
    name: 'Art & Craft',
    slug: 'art-and-craft',
    description: 'Pure beeswax crayons, easel boards and organic non-toxic pigments.',
    status: 'active',
    sortOrder: 4,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Art & Craft').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-sensory',
    name: 'Sensory',
    slug: 'sensory',
    description: 'Soft linen textures, acoustic bell rattles and tactile discoveries.',
    status: 'active',
    sortOrder: 5,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Sensory').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-pretend',
    name: 'Pretend play',
    slug: 'pretend-play',
    description: 'Wooden cameras, felt tea sets and small world woodland animals.',
    status: 'active',
    sortOrder: 6,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Pretend play').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-books',
    name: 'Books & Storytelling',
    slug: 'books-and-storytelling',
    description: 'Cloth exploration books and tactile nature storyboards.',
    status: 'active',
    sortOrder: 7,
    productCount: INITIAL_PRODUCTS.filter(p => p.category === 'Books & Storytelling').length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_COLLECTIONS: AdminCollection[] = [
  {
    id: 'col-bestsellers',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most cherished heirloom play items loved across Bangladeshi households.',
    productIds: ['woodland-balance-friends', 'sunrise-stacking-arch', 'make-believe-camera'],
    status: 'active',
    sortOrder: 1,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'col-new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh sensory additions to the GrowKins collection.',
    productIds: ['meadow-play-mat', 'artisan-wooden-easel'],
    status: 'active',
    sortOrder: 2,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'col-eid-gifts',
    name: 'Eid & Akika Gifts',
    slug: 'eid-and-akika-gifts',
    description: 'Thoughtful heirloom wooden gifts packed in premium organic muslin bags.',
    productIds: ['woodland-balance-friends', 'sensory-rattle-trio', 'sunrise-stacking-arch'],
    status: 'active',
    sortOrder: 3,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'LK-BD-9412',
    customer: {
      id: 'cust-1',
      name: 'Nusrat Jahan',
      phone: '01712345678',
      email: 'nusrat.jahan@gmail.com',
      isGuest: false
    },
    deliveryAddress: {
      fullName: 'Nusrat Jahan',
      phone: '01712345678',
      deliveryZone: 'inside-dhaka',
      district: 'Dhaka',
      thanaArea: 'Dhanmondi',
      streetAddress: 'House 42, Road 9/A, Dhanmondi R/A'
    },
    items: [
      {
        productId: 'woodland-balance-friends',
        name: 'Woodland Balance Friends',
        sku: 'GK-WBF-100',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
        price: 1850,
        quantity: 1,
        total: 1850
      },
      {
        productId: 'sunrise-stacking-arch',
        name: 'Sunrise Stacking Arch',
        sku: 'GK-SSA-101',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80',
        price: 1950,
        quantity: 1,
        total: 1950
      }
    ],
    subtotal: 3800,
    deliveryFee: 0, // Free delivery (> 2500)
    total: 3800,
    currency: 'BDT',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'cod_collected',
    status: 'delivered',
    notes: 'Please call before arriving.',
    timeline: [
      {
        id: 't-1',
        status: 'pending',
        title: 'Order Placed',
        description: 'Placed by customer via Storefront with Cash on Delivery.',
        timestamp: '16 Sep 2026, 11:30 AM',
        actor: 'Customer'
      },
      {
        id: 't-2',
        status: 'confirmed',
        title: 'Confirmed via Phone',
        description: 'Customer confirmed address and readiness to pay cash on delivery.',
        timestamp: '16 Sep 2026, 02:15 PM',
        actor: 'Admin (Pritom)'
      },
      {
        id: 't-3',
        status: 'shipped',
        title: 'Dispatched with Courier',
        description: 'Handed to Pathao Courier (Tracking: PTH-849201).',
        timestamp: '17 Sep 2026, 10:00 AM',
        actor: 'Courier Team'
      },
      {
        id: 't-4',
        status: 'delivered',
        title: 'Delivered & COD Collected',
        description: 'Parcel handed over. BDT 3,800 received in cash.',
        timestamp: '18 Sep 2026, 04:20 PM',
        actor: 'Courier Rider'
      }
    ],
    createdAt: '2026-09-16T05:30:00.000Z',
    updatedAt: '2026-09-18T10:20:00.000Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'LK-BD-8834',
    customer: {
      id: 'cust-2',
      name: 'Tanvir Ahmed',
      phone: '01898765432',
      email: 'tanvir.ahmed@yahoo.com',
      isGuest: true
    },
    deliveryAddress: {
      fullName: 'Farah Ahmed',
      phone: '01898765432',
      deliveryZone: 'inside-dhaka',
      district: 'Dhaka',
      thanaArea: 'Uttara',
      streetAddress: 'Sector 4, Road 12, House 15, Flat 4B'
    },
    items: [
      {
        productId: 'sunrise-stacking-arch',
        name: 'Sunrise Stacking Arch',
        sku: 'GK-SSA-101',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80',
        price: 1950,
        quantity: 1,
        total: 1950
      }
    ],
    subtotal: 1950,
    deliveryFee: 70,
    total: 2020,
    currency: 'BDT',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'cod_pending',
    status: 'shipped',
    notes: 'Gift wrapping requested if possible.',
    gift: {
      enabled: true,
      recipientName: 'Baby Ayla',
      message: 'Happy 1st Birthday little angel!'
    },
    timeline: [
      {
        id: 't-1',
        status: 'pending',
        title: 'Order Placed',
        description: 'Cash on Delivery checkout completed.',
        timestamp: '17 Sep 2026, 03:40 PM',
        actor: 'Customer'
      },
      {
        id: 't-2',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Phone verification completed with customer.',
        timestamp: '17 Sep 2026, 05:00 PM',
        actor: 'Support Agent'
      },
      {
        id: 't-3',
        status: 'shipped',
        title: 'Handed over to RedX',
        description: 'Dispatched for next-day delivery in Uttara.',
        timestamp: '18 Sep 2026, 09:30 AM',
        actor: 'Dispatch Manager'
      }
    ],
    createdAt: '2026-09-17T09:40:00.000Z',
    updatedAt: '2026-09-18T03:30:00.000Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'LK-BD-7219',
    customer: {
      id: 'cust-3',
      name: 'Dr. Sadia Rahman',
      phone: '01655443322',
      email: 'dr.sadia.r@hospital.org',
      isGuest: false
    },
    deliveryAddress: {
      fullName: 'Dr. Sadia Rahman',
      phone: '01655443322',
      deliveryZone: 'outside-dhaka',
      district: 'Chattogram',
      thanaArea: 'Khulshi',
      streetAddress: 'South Khulshi Residential Area, Road 3, House 21'
    },
    items: [
      {
        productId: 'woodland-balance-friends',
        name: 'Woodland Balance Friends',
        sku: 'GK-WBF-100',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
        price: 1850,
        quantity: 1,
        total: 1850
      }
    ],
    subtotal: 1850,
    deliveryFee: 130,
    total: 1980,
    currency: 'BDT',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'cod_pending',
    status: 'pending',
    notes: 'Please call before delivery to confirm clinic hours.',
    timeline: [
      {
        id: 't-1',
        status: 'pending',
        title: 'Order Placed',
        description: 'Customer checked out from Chattogram.',
        timestamp: '18 Sep 2026, 06:15 PM',
        actor: 'Customer'
      }
    ],
    createdAt: '2026-09-18T12:15:00.000Z',
    updatedAt: '2026-09-18T12:15:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-1',
    name: 'Nusrat Jahan',
    phone: '01712345678',
    email: 'nusrat.jahan@gmail.com',
    isGuest: false,
    totalOrders: 3,
    totalSpent: 8450,
    lastOrderDate: '18 Sep 2026',
    defaultAddress: {
      district: 'Dhaka',
      thanaArea: 'Dhanmondi',
      streetAddress: 'House 42, Road 9/A, Dhanmondi R/A'
    },
    notes: 'Loyal customer, loves Montessori open-ended toys.',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-09-18T10:20:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'Tanvir Ahmed',
    phone: '01898765432',
    email: 'tanvir.ahmed@yahoo.com',
    isGuest: true,
    totalOrders: 1,
    totalSpent: 2020,
    lastOrderDate: '17 Sep 2026',
    defaultAddress: {
      district: 'Dhaka',
      thanaArea: 'Uttara',
      streetAddress: 'Sector 4, Road 12, House 15'
    },
    notes: 'First time buyer via mobile.',
    createdAt: '2026-09-17T09:40:00.000Z',
    updatedAt: '2026-09-17T09:40:00.000Z'
  },
  {
    id: 'cust-3',
    name: 'Dr. Sadia Rahman',
    phone: '01655443322',
    email: 'dr.sadia.r@hospital.org',
    isGuest: false,
    totalOrders: 2,
    totalSpent: 4280,
    lastOrderDate: '18 Sep 2026',
    defaultAddress: {
      district: 'Chattogram',
      thanaArea: 'Khulshi',
      streetAddress: 'South Khulshi Residential Area'
    },
    notes: 'Pediatrician, often gifts to patients and family.',
    createdAt: '2026-08-25T14:00:00.000Z',
    updatedAt: '2026-09-18T12:15:00.000Z'
  }
];

export const INITIAL_REVIEWS: AdminReview[] = MOCK_REVIEWS.map((r, i) => ({
  id: r.id,
  productId: i === 0 ? 'woodland-balance-friends' : i === 1 ? 'sunrise-stacking-arch' : 'woodland-balance-friends',
  productName: i === 0 ? 'Woodland Balance Friends' : i === 1 ? 'Sunrise Stacking Arch' : 'Woodland Balance Friends',
  author: r.author,
  authorRole: r.authorRole,
  rating: r.rating,
  title: r.title,
  content: r.content,
  childAge: r.childAge,
  photoUrl: r.photoUrl,
  verified: r.verified,
  status: 'approved',
  date: r.date,
  createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
}));

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-1',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    filename: 'woodland-balance-hero.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    width: 800,
    height: 800,
    alt: 'Woodland balance animals stacked',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    filename: 'sunrise-stacking-rainbow.jpg',
    mimeType: 'image/jpeg',
    size: 312000,
    width: 800,
    height: 800,
    alt: 'Wooden rainbow stacking arch pastel',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    filename: 'child-building-blocks.jpg',
    mimeType: 'image/jpeg',
    size: 298000,
    width: 800,
    height: 800,
    alt: 'Child playing on cream rug with blocks',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-4',
    url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
    filename: 'wooden-details-macro.jpg',
    mimeType: 'image/jpeg',
    size: 410000,
    width: 800,
    height: 800,
    alt: 'Smooth curved beechwood texture detail',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_HOMEPAGE_CMS: HomepageCMS = {
  hero: {
    enabled: true,
    eyebrow: 'Heirloom Montessori Play in Bangladesh',
    headline: 'Nurture calm minds through natural wooden play.',
    subheadline: 'Screen-free toys shaped from pure European beechwood, organic water stains, and soft natural textiles.',
    primaryCtaLabel: 'Explore All Playthings',
    secondaryCtaLabel: 'Discover by Age',
    trustBullet1: 'Cash on Delivery All Over Bangladesh',
    trustBullet2: 'Non-Toxic & EN71 / ASTM Certified Safe',
    slides: [
      {
        id: 'slide-1',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
        badgeAge: '0–8Y',
        badgeTitle: 'Montessori Open-Ended Play',
        badgeSubtitle: 'Screen-Free Sensory Development',
        alt: 'Child playing peacefully with wooden toys in a bright Montessori playroom',
        enabled: true,
        sortOrder: 1
      },
      {
        id: 'slide-2',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=85',
        badgeAge: '1–5Y',
        badgeTitle: 'Natural Beechwood Stacking',
        badgeSubtitle: 'Tactile Equilibrium & Motor Skills',
        alt: 'Wooden rainbow stacking arch and handcrafted balancing toys',
        enabled: true,
        sortOrder: 2
      },
      {
        id: 'slide-3',
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85',
        badgeAge: '2–7Y',
        badgeTitle: 'Imaginative World Building',
        badgeSubtitle: 'Architectural Blocks & Animal Figures',
        alt: 'Parent and child building wooden block castles together',
        enabled: true,
        sortOrder: 3
      }
    ]
  },
  stages: {
    enabled: true,
    heading: 'Find Play Built for Their Exact Stage',
    subheading: 'Each phase of growth deserves mindful developmental toys tailored to motor and cognitive leaps.'
  },
  trending: {
    enabled: true,
    heading: 'Loved by Little Hands Across Dhaka',
    subheading: 'Our most wanted open-ended favourites, back in stock for mindful gifting.'
  },
  playShelf: {
    enabled: true,
    heading: 'Featured Wooden Discoveries',
    subheading: 'Essential play sets tested by pediatricians and parents.'
  },
  personalities: {
    enabled: true,
    heading: 'Shop by Their Unique Play Personality',
    subheading: 'Does your child build towers, paint with light, or climb the sofa? Match toys to who they are.'
  },
  brandPhilosophy: {
    enabled: true,
    heading: 'Pure, Simple & Thoughtfully Crafted',
    subheading: 'Why Bangladeshi parents choose GrowKins heirloom toys over noisy plastic batteries.',
    quote: '“Toys should leave 90% of the play to the child, and only 10% to the toy.”'
  },
  ugcMosaic: {
    enabled: true,
    heading: 'Moments of Wonder at Home',
    subheading: 'Real playrooms in Dhanmondi, Gulshan, Uttara and beyond.',
    handle: '@growkins.bd'
  },
  recommendationQuiz: {
    enabled: true,
    heading: 'Need help finding the ideal gift?',
    subheading: 'Answer 3 quick questions about their age and interests for our curated recommendations.'
  },
  editorialBanner: {
    enabled: true,
    heading: 'The Art of Peaceful Playrooms',
    subheading: 'How fewer, higher-quality wooden toys reduce sensory overwhelm in apartments.',
    buttonText: 'Read Our Story'
  },
  community: {
    enabled: true,
    heading: 'Join 4,500+ Mindful Parents in Bangladesh',
    subheading: 'Receive gentle play inspiration and early notice of heirloom wooden restocks.'
  },
  newsletter: {
    enabled: true,
    heading: 'Keep In Touch With Our Playroom',
    subheading: 'No spam ever. Just gentle child development notes and special Eid previews.'
  }
};

export const INITIAL_NAVIGATION_CMS: NavigationCMS = {
  announcementBar: {
    enabled: true,
    messageEn: 'Free shipping on orders over ৳2,500 across Bangladesh · Cash on Delivery available',
    messageBn: '৳২,৫০০-এর বেশি অর্ডারে সমগ্র বাংলাদেশে ফ্রি ডেলিভারি · ক্যাশ অন ডেলিভারি প্রযোজ্য',
    linkUrl: '/shop'
  },
  menuItems: [
    { id: 'nav-1', label: 'Shop All', path: '/shop', megaMenuTab: 'shop', enabled: true, sortOrder: 1 },
    { id: 'nav-2', label: 'By Age Stage', path: '/shop', megaMenuTab: 'age', enabled: true, sortOrder: 2 },
    { id: 'nav-3', label: 'Play Personalities', path: '/shop', megaMenuTab: 'play', enabled: true, sortOrder: 3 },
    { id: 'nav-4', label: 'Gifts & Eid', path: '/shop', megaMenuTab: 'gifts', enabled: true, sortOrder: 4, badge: 'Curated' },
    { id: 'nav-5', label: 'Our Story', path: '/our-story', enabled: true, sortOrder: 5 }
  ]
};

export const INITIAL_FOOTER_CMS: FooterCMS = {
  brandTagline: 'Heirloom Wooden Toys & Screen-Free Montessori Discoveries in Bangladesh.',
  description: 'Handcrafted with FSC-certified European beechwood, natural vegetable dyes and child-safe organic finishes for mindful Bangladeshi families.',
  phone: '+880 1712-345678',
  email: 'hello@growkins.com',
  address: 'Road 9/A, Dhanmondi R/A, Dhaka 1209, Bangladesh',
  hours: 'Saturday – Thursday: 10:00 AM – 8:00 PM',
  facebookUrl: 'https://facebook.com/growkins.bd',
  instagramUrl: 'https://instagram.com/growkins.bd',
  whatsappNumber: '+8801712345678',
  codNoticeText: 'Pay with Cash on Delivery at your doorstep anywhere in Bangladesh. Inspect package upon courier arrival.',
  copyrightText: '© 2026 GrowKins Bangladesh. All rights reserved. Made with love for little dreamers.'
};

export const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  globalFreeShippingThreshold: 2500,
  defaultCodAvailable: true,
  courierPartners: ['Pathao Courier', 'RedX Logistics', 'Steadfast Courier', 'Sundarban Courier'],
  zones: [
    {
      id: 'inside-dhaka',
      name: 'Inside Dhaka City',
      description: 'Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Mohammadpur, Old Dhaka & surrounding areas.',
      fee: 70,
      estimatedDelivery: '1–2 business days',
      freeDeliveryThreshold: 2500,
      enabled: true
    },
    {
      id: 'outside-dhaka',
      name: 'Outside Dhaka (All Over Bangladesh)',
      description: 'Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Bogura and all 64 districts.',
      fee: 130,
      estimatedDelivery: '2–4 business days via courier',
      freeDeliveryThreshold: 2500,
      enabled: true
    }
  ]
};

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'GrowKins',
  storeTagline: 'Montessori & Heirloom Wooden Toys Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  supportPhone: '+880 1712-345678',
  supportEmail: 'care@growkins.com',
  officeAddress: 'Dhanmondi 9/A, Dhaka-1209, Bangladesh',
  socials: {
    facebook: 'https://facebook.com/growkins.bd',
    instagram: 'https://instagram.com/growkins.bd',
    whatsapp: '+8801712345678'
  }
};

export const INITIAL_CHECKOUT_SETTINGS: CheckoutSettings = {
  codEnabled: true,
  codTitle: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
  codDescription: 'Pay in cash when our courier delivers the parcel directly to your doorstep. No advance payment required.',
  phoneRequired: true,
  emailRequired: false,
  allowGiftWrapping: true,
  giftWrappingFee: 0,
  minOrderValue: 500,
  orderConfirmationMessage: 'Thank you! Your order has been received. Our team will contact you via phone before dispatching.'
};
