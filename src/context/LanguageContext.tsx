import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'bn';

export interface Translations {
  // Navigation & General
  nav: {
    shop: string;
    byAge: string;
    play: string;
    everyday: string;
    gifts: string;
    ourStory: string;
    searchPlaceholder: string;
    bag: string;
    wishlist: string;
  };
  announcement: {
    freeShipping: string;
    cod: string;
    hotline: string;
  };
  hero: {
    tag: string;
    headlinePart1: string;
    headlineAccent: string;
    headlinePart2: string;
    subheading: string;
    shopByAge: string;
    exploreAll: string;
    codNotice: string;
    woodNotice: string;
  };
  stages: {
    tag: string;
    headline: string;
    subheading: string;
    exploreStage: string;
    seeMoreShop: string;
  };
  trending: {
    tag: string;
    headline: string;
    subheading: string;
    viewAll: string;
  };
  playShelf: {
    tag: string;
    headline: string;
    viewAll: string;
  };
  catalog: {
    breadcrumbHome: string;
    breadcrumbShop: string;
    shelfTag: string;
    headline: string;
    subheading: string;
    showing: string;
    filters: string;
    sortBy: string;
    featured: string;
    priceLow: string;
    priceHigh: string;
    rating: string;
    prev: string;
    next: string;
    page: string;
    of: string;
    clearFilters: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    freeShippingNotice: string;
    freeShippingAchieved: string;
    subtotal: string;
    deliveryFee: string;
    free: string;
    total: string;
    proceedToCheckout: string;
    insideDhaka: string;
    outsideDhaka: string;
  };
  checkout: {
    headerNotice: string;
    step1Title: string;
    step2Title: string;
    codNoticeTitle: string;
    codNoticeDesc: string;
    zoneTitle: string;
    insideDhakaOption: string;
    outsideDhakaOption: string;
    recipientTitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    mobile: string;
    mobileSub: string;
    email: string;
    emailSub: string;
    addressTitle: string;
    district: string;
    thana: string;
    thanaPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    instructions: string;
    instructionsPlaceholder: string;
    reviewBtn: string;
    placeOrderBtn: string;
    placingOrder: string;
    totalPayable: string;
  };
  footer: {
    brandBio: string;
    codOnly: string;
    categoriesTitle: string;
    orderTitle: string;
    conciergeTitle: string;
    addressLabel: string;
    addressValue: string;
    phoneLabel: string;
    phoneValue: string;
    copyright: string;
  };
}

const translationsData: Record<Language, Translations> = {
  en: {
    nav: {
      shop: 'Shop',
      byAge: 'By Age',
      play: 'Play',
      everyday: 'Everyday',
      gifts: 'Gifts',
      ourStory: 'Our Story',
      searchPlaceholder: 'Search products…',
      bag: 'Bag',
      wishlist: 'Wishlist'
    },
    announcement: {
      freeShipping: 'Free nationwide delivery on orders over ৳2,500',
      cod: '100% Cash on Delivery with doorstep parcel inspection',
      hotline: 'Concierge Hotline: 01767026831 (10 AM – 8 PM)'
    },
    hero: {
      tag: 'Little Discoveries for Real Life',
      headlinePart1: 'Little things for',
      headlineAccent: 'big',
      headlinePart2: 'imaginations.',
      subheading: 'Thoughtfully chosen toys, essentials and little discoveries for every stage of growing up.',
      shopByAge: 'Shop by Age',
      exploreAll: 'Explore All',
      codNotice: 'Cash on Delivery Across Bangladesh',
      woodNotice: '100% Child-Safe Natural Wood'
    },
    stages: {
      tag: 'Growing Together',
      headline: 'Made for where they are now.',
      subheading: "Every stage has its own magic, challenges and discoveries. Choose your child's age to see toys crafted specifically for their hands and mind.",
      exploreStage: 'Explore stage collection',
      seeMoreShop: 'See More in Shop'
    },
    trending: {
      tag: 'Trending Now in Bangladesh',
      headline: 'Most loved by little learners.',
      subheading: 'Top-rated wooden puzzles, open-ended Montessori arches and sensory essentials turning screen-time into peaceful creative play.',
      viewAll: 'View All Trending'
    },
    playShelf: {
      tag: 'The Play Shelf',
      headline: 'Things little hands keep reaching for.',
      viewAll: 'View all products'
    },
    catalog: {
      breadcrumbHome: 'Home',
      breadcrumbShop: 'Shop',
      shelfTag: 'The Play Shelf',
      headline: 'Good things for growing days.',
      subheading: 'Thoughtfully chosen, age-appropriate and ready for the beautiful mess of real play.',
      showing: 'thoughtful finds',
      filters: 'Filters',
      sortBy: 'Sort by',
      featured: 'Featured',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      rating: 'Highest Rated',
      prev: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      clearFilters: 'Clear all filters',
      emptyTitle: "Hmm, we couldn't find that one.",
      emptyDesc: 'Try adjusting or clearing some filters to explore our full collection of open-ended play discoveries.'
    },
    cart: {
      title: 'Your Bag',
      emptyTitle: 'Your bag is empty',
      emptyDesc: 'Discover wooden Montessori toys and conscious playroom essentials.',
      exploreBtn: 'Start Discovering',
      freeShippingNotice: 'away from Free Delivery!',
      freeShippingAchieved: 'You qualify for Free Nationwide Delivery! 🎉',
      subtotal: 'Items Subtotal',
      deliveryFee: 'Courier Delivery',
      free: 'FREE',
      total: 'Total Cash Payable',
      proceedToCheckout: 'Proceed to Cash on Delivery',
      insideDhaka: 'Inside Dhaka (৳70)',
      outsideDhaka: 'Outside Dhaka (৳130)'
    },
    checkout: {
      headerNotice: '100% Cash on Delivery Across Bangladesh',
      step1Title: 'Where should we deliver your parcel?',
      step2Title: 'Review your order before confirmation',
      codNoticeTitle: '100% Cash on Delivery (COD)',
      codNoticeDesc: 'No advance payment needed. Inspect your parcel at your doorstep before handing cash to the courier rider.',
      zoneTitle: 'Select Delivery Zone',
      insideDhakaOption: 'Inside Dhaka City (৳70 · 24–48h)',
      outsideDhakaOption: 'Outside Dhaka / All BD (৳130 · 2–4 days)',
      recipientTitle: 'Recipient Information',
      fullName: 'Your Full Name *',
      fullNamePlaceholder: 'e.g. Nusrat Jahan or Tanvir Ahmed',
      mobile: 'Active Mobile Number *',
      mobileSub: 'for courier call',
      email: 'Email Address',
      emailSub: '(optional)',
      addressTitle: 'Delivery Street Address',
      district: 'District *',
      thana: 'Thana / Area *',
      thanaPlaceholder: 'e.g. Dhanmondi, Gulshan, or Agrabad',
      address: 'House / Road / Flat No. & Full Address *',
      addressPlaceholder: 'e.g. House 12, Road 5, Flat 4B, Block C',
      instructions: 'Special Delivery Instructions',
      instructionsPlaceholder: "e.g. 'Please call before arrival', 'Leave at reception'...",
      reviewBtn: 'Review My Order',
      placeOrderBtn: 'Place Cash on Delivery Order',
      placingOrder: 'Placing your order… Just a moment',
      totalPayable: 'Total Cash Payable'
    },
    footer: {
      brandBio: 'Heirloom Montessori toys, sensory objects and conscious play essentials for Bangladeshi families. Designed to nurture calm, screen-free imaginations.',
      codOnly: 'Payment: Cash on Delivery Only',
      categoriesTitle: 'Categories',
      orderTitle: 'Order & Delivery',
      conciergeTitle: 'Concierge & Address',
      addressLabel: 'Official Address:',
      addressValue: 'Nana Tower, Bosila, Dhaka, Bangladesh',
      phoneLabel: 'Concierge Phone:',
      phoneValue: '01767026831',
      copyright: 'GrowKins Bangladesh. Made for little people.'
    }
  },
  bn: {
    nav: {
      shop: 'শপ',
      byAge: 'বয়স অনুযায়ী',
      play: 'প্লে কালেকশন',
      everyday: 'প্রতিদিনের জিনিস',
      gifts: 'উপহার',
      ourStory: 'আমাদের গল্প',
      searchPlaceholder: 'খেলনা খুঁজুন…',
      bag: 'ব্যাগ',
      wishlist: 'পছন্দের তালিকা'
    },
    announcement: {
      freeShipping: '৳২,৫০০ টাকার অর্ডারে সারা দেশে ফ্রি ডেলিভারি',
      cod: '১০০% ক্যাশ অন ডেলিভারি — বাসায় পণ্য দেখে মূল্য পরিশোধ করুন',
      hotline: 'হেল্পলাইন: ০১৭৬৭০২৬৮৩১ (সকাল ১০টা – রাত ৮টা)'
    },
    hero: {
      tag: 'শিশুদের শৈশবের সুন্দর আবিষ্কার',
      headlinePart1: 'ছোট শিশুদের জন্য',
      headlineAccent: 'বড়',
      headlinePart2: 'কল্পনার জগৎ।',
      subheading: 'প্রতিটি বয়সের শিশুদের জন্য যত্ন সহকারে বাছাইকৃত নিরাপদ কাঠের খেলনা ও শিক্ষণীয় সামগ্রী।',
      shopByAge: 'বয়স অনুযায়ী দেখুন',
      exploreAll: 'সবগুলো দেখুন',
      codNotice: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি',
      woodNotice: '১০০% শিশুবান্ধব প্রাকৃতিক কাঠ'
    },
    stages: {
      tag: 'শিশুর বেড়ে ওঠার সাথে',
      headline: 'শিশুর বর্তমান বয়সের উপযোগী খেলনা।',
      subheading: 'প্রতিটি বয়সের থাকে নিজস্ব আনন্দ ও আবিষ্কার। শিশুর সঠিক মানসিক ও শারীরিক বিকাশের জন্য তৈরি খেলনা বেছে নিন।',
      exploreStage: 'এই বয়সের কালেকশন দেখুন',
      seeMoreShop: 'শপে আরও দেখুন'
    },
    trending: {
      tag: 'বর্তমানে সর্বাধিক জনপ্রিয়',
      headline: 'ছোটদের সবচেয়ে প্রিয় খেলনাগুলো।',
      subheading: 'স্ক্রিন টাইম কমিয়ে শিশুর মননশীলতা বাড়াতে অভিভাবক ও শিশুদের পছন্দের কাঠের খেলনা ও মন্টেসরি আর্চ।',
      viewAll: 'সব জনপ্রিয় আইটেম দেখুন'
    },
    playShelf: {
      tag: 'দ্য প্লে শেলফ',
      headline: 'যেসব খেলনা শিশুরা বারবার হাতে তুলে নেয়।',
      viewAll: 'সব পণ্য দেখুন'
    },
    catalog: {
      breadcrumbHome: 'হোম',
      breadcrumbShop: 'শপ',
      shelfTag: 'দ্য প্লে শেলফ',
      headline: 'শিশুর বেড়ে ওঠার সুন্দর খেলনা।',
      subheading: 'স্ক্রিন-মুক্ত শৈশব ও মননশীল খেলার জন্য নিরাপদ প্রাকৃতিক খেলনা কালেকশন।',
      showing: 'টি পণ্য প্রদর্শিত হচ্ছে',
      filters: 'ফিল্টার',
      sortBy: 'সাজান',
      featured: 'বিশেষ কালেকশন',
      priceLow: 'দাম: কম থেকে বেশি',
      priceHigh: 'দাম: বেশি থেকে কম',
      rating: 'সর্বোচ্চ রেটিং',
      prev: 'পূর্ববর্তী',
      next: 'পরবর্তী',
      page: 'পৃষ্ঠা',
      of: 'এর',
      clearFilters: 'সব ফিল্টার মুছুন',
      emptyTitle: 'কোনো পণ্য পাওয়া যায়নি',
      emptyDesc: 'অন্য কোনো ফিল্টার বা সার্চ দিয়ে চেষ্টা করুন।'
    },
    cart: {
      title: 'আপনার শপিং ব্যাগ',
      emptyTitle: 'আপনার ব্যাগ খালি',
      emptyDesc: 'নিরাপদ কাঠের মন্টেসরি খেলনা থেকে পছন্দের আইটেম বেছে নিন।',
      exploreBtn: 'পণ্য দেখতে শুরু করুন',
      freeShippingNotice: 'টাকা যোগ করলেই ফ্রি ডেলিভারি!',
      freeShippingAchieved: 'আপনি সারা দেশে ফ্রি ডেলিভারি পাচ্ছেন! 🎉',
      subtotal: 'পণ্যমূল্য সাবটোটাল',
      deliveryFee: 'কুরিয়ার ডেলিভারি',
      free: 'ফ্রি',
      total: 'মোট নগদ প্রদেয়',
      proceedToCheckout: 'ক্যাশ অন ডেলিভারিতে অর্ডার করুন',
      insideDhaka: 'ঢাকার ভেতরে (৳৭০)',
      outsideDhaka: 'ঢাকার বাইরে (৳১৩০)'
    },
    checkout: {
      headerNotice: 'সারা বাংলাদেশে ১০০% ক্যাশ অন ডেলিভারি',
      step1Title: 'আপনার পার্সেল কোথায় ডেলিভারি দিতে হবে?',
      step2Title: 'অর্ডার নিশ্চিত করার আগে তথ্যগুলো দেখে নিন',
      codNoticeTitle: '১০০% ক্যাশ অন ডেলিভারি (COD)',
      codNoticeDesc: 'কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পার্সেল ডেলিভারিম্যানের সামনে দেখে তারপর ক্যাশ পরিশোধ করুন।',
      zoneTitle: 'ডেলিভারি এলাকা নির্বাচন করুন',
      insideDhakaOption: 'ঢাকা সিটির ভেতরে (৳৭০ · ২৪–৪৮ ঘণ্টা)',
      outsideDhakaOption: 'ঢাকার বাইরে / পুরো বাংলাদেশ (৳১৩০ · ২–৪ দিন)',
      recipientTitle: 'গ্রাহকের তথ্য',
      fullName: 'আপনার সম্পূর্ণ নাম *',
      fullNamePlaceholder: 'যেমন: নুসরাত জাহান অথবা তানভীর আহমেদ',
      mobile: 'সচল মোবাইল নম্বর *',
      mobileSub: 'কুরিয়ার কলের জন্য',
      email: 'ইমেইল অ্যাড্রেস',
      emailSub: '(ঐচ্ছিক)',
      addressTitle: 'ডেলিভারি ঠিকানা',
      district: 'জেলা *',
      thana: 'থানা / এরিয়া *',
      thanaPlaceholder: 'যেমন: ধানমন্ডি, গুলশান, বা আগ্রাবাদ',
      address: 'বাড়ি / রোড / ফ্ল্যাট নং ও বিস্তারিত ঠিকানা *',
      addressPlaceholder: 'যেমন: বাড়ি ১২, রোড ৫, ফ্ল্যাট ৪বি',
      instructions: 'ডেলিভারি সংক্রান্ত বিশেষ নির্দেশনা',
      instructionsPlaceholder: 'যেমন: "আসার আগে ফোন দিবেন", "রিসেপশনে রাখতে পারেন"...',
      reviewBtn: 'অর্ডারের বিবরণ দেখুন',
      placeOrderBtn: 'ক্যাশ অন ডেলিভারি অর্ডার নিশ্চিত করুন',
      placingOrder: 'অর্ডার কনফার্ম হচ্ছে… অপেক্ষা করুন',
      totalPayable: 'মোট প্রদেয় টাকা'
    },
    footer: {
      brandBio: 'বাংলাদেশি পরিবারের জন্য তৈরি শিশুদের নিরাপদ মন্টেসরি ও কাঠের খেলনা। স্ক্রিন-মুক্ত সৃজনশীল শৈশব উপহার দিতে আমাদের এই প্রয়াস।',
      codOnly: 'পেমেন্ট: শুধুমাত্র ক্যাশ অন ডেলিভারি',
      categoriesTitle: 'ক্যাটাগরি',
      orderTitle: 'অর্ডার ও ডেলিভারি',
      conciergeTitle: 'যোগাযোগ ও ঠিকানা',
      addressLabel: 'অফিসিয়াল ঠিকানা:',
      addressValue: 'নানা টাওয়ার, বসিলা, ঢাকা, বাংলাদেশ',
      phoneLabel: 'ফোন নম্বর:',
      phoneValue: '০১৭৬৭০২৬৮৩১',
      copyright: 'গ্রোকিন্স বাংলাদেশ। শিশুদের জন্য যত্নসহকারে নির্মিত।'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('growkins_lang');
      if (saved === 'bn' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('growkins_lang', lang);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translationsData[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
