import type { Product, ReviewItem } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'busy-cube-montessori',
    name: 'Busy Cube – Montessori Sensory Activity Cube',
    subtitle: 'Sensory & Fine Motor Skills Activity Cube for Toddlers',
    tag: 'BESTSELLER',
    price: 1250,
    originalPrice: 1650,
    rating: 4.9,
    reviewCount: 142,
    ageBadge: 'AGE 1–3',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ['Exploring', 'Building', 'Creating'],
    benefits: ['Fine motor', 'Focus', 'Sensory discovery'],
    materials: ['FSC beechwood', 'Plant-based silicone'],
    occasions: ['Everyday play', 'Travel', 'Birthday'],
    valueStatement: '6-in-1 sensory challenges to develop fine motor skills and problem-solving',
    description: 'The Busy Cube is a compact, multi-activity educational toy designed for toddlers aged 1–3 years. Inspired by Montessori learning principles, this cube features 6 different interactive sides with real-life elements like locks, keys, switches, gears, zippers, buttons, and spinning wheels. Each side challenges children to press, pull, rotate, and slide, helping them develop fine motor skills, hand-eye coordination, problem-solving ability, and sensory awareness.\n\nMade from child-safe, non-toxic materials with smooth edges, the Busy Cube is perfect for quiet play at home, in the car, or while traveling. Its vibrant colors and engaging textures stimulate curiosity and cognitive growth while keeping little hands busy and minds active.',
    sensoryQuote: '“Six interactive sides that turn everyday curiosity into calm, focused discovery.”',
    whyKidsLoveIt: 'Toddlers love having real tactile elements to click, turn, and twist with their own little hands, giving them a joyful sense of independence without any screen time.',
    developmentMilestones: [
      {
        title: 'Pincer Grasp & Dexterity',
        description: 'Twisting dials, sliding latches, and turning keys calibrate fine finger muscle control.'
      },
      {
        title: 'Tactile Sensory Awareness',
        description: 'Multi-textured switches and mechanical gears stimulate curiosity and cause-and-effect learning.'
      },
      {
        title: 'Calm Independent Concentration',
        description: 'Engaging real-life mechanisms keep little minds peacefully absorbed during travel or quiet time.'
      }
    ],
    whatsInside: [
      { name: 'Montessori Activity Cube', count: '1 pc', detail: '6 interactive sides with locks, gears & switches' },
      { name: 'Smooth Rounded Corner Base', count: '1 pc', detail: 'Sanded child-safe natural beechwood' },
      { name: 'Travel Strap Attachment', count: '1 pc', detail: 'Convenient clip for strollers and car rides' }
    ],
    images: {
      main: '/items/busy-cube.jfif',
      secondary: '/items/busy-cube-02.jpg',
      detail: '/items/busy-cube-03.jpg',
      gallery: [
        '/items/busy-cube.jfif',
        '/items/busy-cube-02.jpg',
        '/items/busy-cube-03.jpg'
      ]
    },
    dimensions: '15 × 15 × 15 cm · Weight: 380g',
    careInstructions: 'Wipe with a soft dry or slightly damp cloth. Avoid submerging in water.',
    safetyNotes: 'Tested and certified compliant with international EN71 & ASTM standards. BPA-free, lead-free non-toxic finishes.',
    inStock: true
  },
  {
    id: 'busy-zipper-bag-montessori',
    name: 'Busy Zipper Bag – Montessori Sensory Activity Pouch',
    subtitle: 'Sensory Activity Pouch for Preschoolers & Toddlers',
    tag: 'BESTSELLER',
    price: 1250,
    originalPrice: 1550,
    rating: 4.9,
    reviewCount: 98,
    ageBadge: 'AGE 2–5',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ['Exploring', 'Pretending', 'Creating'],
    benefits: ['Fine motor', 'Focus', 'Sensory discovery'],
    materials: ['Organic cotton', 'Recycled wool'],
    occasions: ['Travel', 'Everyday play', 'Gift'],
    valueStatement: 'Mess-free, quiet, and travel-friendly all-in-one sensory activity kit',
    description: 'The Busy Zipper Bag is a fun, mess-free sensory toy designed to keep toddlers engaged while developing essential life skills. This soft, zippered pouch contains multiple mini activities such as lacing cards, Velcro puzzles, sticker scenes, counting beads, and small manipulatives that encourage fine motor practice, hand strength, and focus.\n\nPerfect for on-the-go entertainment, the Busy Zipper Bag fits easily into diaper bags or backpacks, making it ideal for travel, doctor visits, or restaurant waits. Parents love it because it\'s quiet, reusable, and helps children learn through hands-on play without creating a mess.',
    sensoryQuote: '“Zip, lace, match, and explore — the ultimate quiet companion on the go.”',
    whyKidsLoveIt: 'Children love unzipping their own personal busy pouch to discover tactile puzzles, soft buckles, and colorful interactive tasks that make them feel like capable big kids.',
    developmentMilestones: [
      {
        title: 'Practical Life Skills',
        description: 'Practicing zipping, buttoning, and lacing strengthens self-dressing capability.'
      },
      {
        title: 'Bilateral Hand Coordination',
        description: 'Holding the pouch with one hand while manipulating zippers and buckles with the other.'
      },
      {
        title: 'Focus in New Environments',
        description: 'Provides familiar, soothing sensory input during travel, car rides, or dining out.'
      }
    ],
    whatsInside: [
      { name: 'Sensory Activity Zipper Pouch', count: '1 pc', detail: 'Reinforced dual-zip soft travel case' },
      { name: 'Lacing Cards & Strings', count: '2 sets', detail: 'Colorful guided lacing practice' },
      { name: 'Velcro Shape Puzzles', count: '4 pcs', detail: 'Tactile hook-and-loop sorting shapes' },
      { name: 'Counting Bead Strand', count: '1 set', detail: 'Smooth silicone counting beads' }
    ],
    images: {
      main: '/items/busy-bag-01.jfif',
      secondary: '/items/busy-bag-02.jfif',
      detail: '/items/busy-bag-03.jpg',
      gallery: [
        '/items/busy-bag-01.jfif',
        '/items/busy-bag-02.jfif',
        '/items/busy-bag-03.jpg'
      ]
    },
    dimensions: '22 × 18 × 4 cm · Weight: 260g',
    careInstructions: 'Spot clean with mild soapy water and lay flat to dry. Do not machine wash.',
    safetyNotes: 'Crafted from skin-safe organic felt and certified non-toxic fabrics. Soft, flexible edges with zero sharp points.',
    inStock: true
  },
  {
    id: 'finger-number-count-toy',
    name: 'Finger Math Counting Toy – Educational Number Learning Tool',
    subtitle: 'Hands-on Finger Play Math & Counting Toy for Kids',
    tag: 'STAFF PICK',
    price: 1250,
    originalPrice: 1600,
    rating: 4.8,
    reviewCount: 116,
    ageBadge: 'AGE 3+',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ['Building', 'Exploring', 'Creating'],
    benefits: ['Fine motor', 'Focus', 'Spatial thinking'],
    materials: ['Organic cotton', 'Recycled wool'],
    occasions: ['Everyday play', 'Birthday', 'Gift'],
    valueStatement: 'Interactive finger-play math for intuitive counting, addition, and number sense',
    description: 'The Finger Number Count Toy is an interactive educational tool that helps children learn counting, number recognition, and basic arithmetic through hands-on finger play. Featuring colorful felt hands with movable fingers and number tiles, this Montessori-inspired toy allows kids to physically add and subtract while matching numbers to quantities.\n\nDesigned for preschoolers and early learners, this toy builds confidence in math skills, improves concentration, and makes learning numbers fun and engaging. The soft, durable materials ensure safe and long-lasting use, while the bright colors and tactile design keep children motivated to explore and learn.',
    sensoryQuote: '“Fold a finger, add a tile — turning abstract math into tangible finger play.”',
    whyKidsLoveIt: 'Kids naturally use their fingers to count. This toy turns that intuitive instinct into a playful physical puzzle where folding felt fingers makes numbers instantly make sense.',
    developmentMilestones: [
      {
        title: 'Concrete Number Sense',
        description: 'Transforms abstract numerals into physical finger quantities that children can see and feel.'
      },
      {
        title: 'Early Addition & Subtraction',
        description: 'Folding down fingers intuitively demonstrates subtraction; raising them models addition.'
      },
      {
        title: 'Fine Motor Pincer Control',
        description: 'Attaching number tiles with velcro tabs strengthens thumb and index finger precision.'
      }
    ],
    whatsInside: [
      { name: 'Montessori Finger Counting Board', count: '1 pc', detail: 'Foldable felt base with pair of articulated hands' },
      { name: 'Tactile Number Tiles (0-10)', count: '10 pcs', detail: 'High-contrast hook-and-loop number tokens' },
      { name: 'Arithmetic Symbol Tiles (+, -, =)', count: '3 pcs', detail: 'Introductory math equation tokens' }
    ],
    images: {
      main: '/items/number-count-01.jfif',
      secondary: '/items/number-count-02.jpg',
      detail: '/items/number-count-03.jpg',
      gallery: [
        '/items/number-count-01.jfif',
        '/items/number-count-02.jpg',
        '/items/number-count-03.jpg'
      ]
    },
    dimensions: '30 × 25 cm (Unfolded) · Weight: 180g',
    careInstructions: 'Gently brush off lint or wipe clean with a slightly damp cloth. Store flat.',
    safetyNotes: '100% soft eco-friendly felt. Fully non-toxic dyes, free from latex and harsh adhesives.',
    inStock: true
  },
  {
    id: 'woodland-balance-friends',
    name: 'Woodland Balance Friends',
    subtitle: 'Stackable Forest Wildlife Set',
    tag: 'BESTSELLER',
    price: 1850,
    originalPrice: 2150,
    rating: 4.9,
    reviewCount: 238,
    ageBadge: 'AGE 3–6',
    ageGroup: '3–5Y',
    category: 'Stacking toys',
    interests: ['Building', 'Pretending', 'Creating'],
    benefits: ['Balance', 'Fine motor', 'Creativity'],
    materials: ['FSC beechwood'],
    occasions: ['Eid gift', 'Birthday', 'Everyday play'],
    valueStatement: 'Builds balance, fine motor control and screen-free creativity',
    description: 'A charming family of 10 solid European beechwood woodland animals, gently weighted and shaped to stack in dozens of precarious, delightful configurations. Keeps children completely absorbed away from mobile screens.',
    sensoryQuote: '“Stack, balance and invent a new little world every time.”',
    whyKidsLoveIt: 'Children in Dhaka apartments are drawn to the friendly animal expressions, the satisfying weight of solid wood, and the gentle thrill of seeing how high they can balance the bear before it wobbles.',
    developmentMilestones: [
      {
        title: 'Spatial Awareness & Equilibrium',
        description: 'Teaches early physics concepts through intuitive counterweights and trial-and-error balancing.'
      },
      {
        title: 'Fine Motor Dexterity',
        description: 'Calibrated edges encourage a pincer grip and deliberate, calm hand movements.'
      },
      {
        title: 'Narrative Storytelling',
        description: 'Double-sided silk-printed illustrations spark open-ended pretend play and forest adventures.'
      }
    ],
    whatsInside: [
      { name: 'Balancing Forest Bear', count: '1 pc', detail: 'Solid weighted beechwood base' },
      { name: 'Perched Tawny Owl', count: '1 pc', detail: 'Concave base for multi-angle stacking' },
      { name: 'Red Fox & Forest Hare', count: '2 pcs', detail: 'Smooth contoured edges' },
      { name: 'Spotted Fawn & Hedgehog', count: '2 pcs', detail: 'Tactile textured woodgrain' },
      { name: 'Acorn & Woodland Trees', count: '4 pcs', detail: 'Natural matte water-based dye' },
      { name: 'Organic Cotton Storage Bag', count: '1 pc', detail: 'Drawstring pouch for easy tidy-up' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Bear: 12 × 8 × 2.2 cm · Hare: 6 × 4 × 2 cm · Cotton Bag: 24 × 20 cm',
    careInstructions: 'Wipe with a damp cloth. Occasionally condition with pure coconut or mustard wood-safe oil.',
    safetyNotes: 'Tested and certified compliant with international EN71 & ASTM F963 safety standards. Non-toxic organic water-based stains.',
    inStock: true
  },
  {
    id: 'sunrise-stacking-arch',
    name: 'Sunrise Stacking Arch',
    subtitle: 'Muted Earth-Tone Nesting Rainbow',
    tag: 'BESTSELLER',
    price: 1950,
    originalPrice: 2250,
    rating: 4.8,
    reviewCount: 164,
    ageBadge: 'AGE 1–5',
    ageGroup: '1–2Y',
    category: 'Stacking toys',
    interests: ['Building', 'Exploring', 'Creating'],
    benefits: ['Spatial thinking', 'Fine motor', 'Creativity'],
    materials: ['FSC beechwood'],
    occasions: ['Eid gift', 'Akika / New baby', 'Birthday'],
    valueStatement: 'Encourages spatial thinking and open-ended architectural play',
    description: 'Seven velvety-smooth nesting arches in soothing terracotta, ochre, sage, and sky tones. A world-renowned Montessori staple for bridges, cradles, and architectural sculptures.',
    sensoryQuote: '“Tunnels for cars, fences for animals, and mountains for dreaming.”',
    whyKidsLoveIt: 'Toddlers love turning the arches upside down into rocking cradles for stuffed toys, building tunnels, and stacking towering bridges across the floor.',
    developmentMilestones: [
      {
        title: 'Size & Grading Differentiation',
        description: 'Children visually and kinesthetically discern gradations of size, curve, and weight.'
      },
      {
        title: 'Bilateral Coordination',
        description: 'Encourages using both hands together to steady and nest curved elements.'
      },
      {
        title: 'Abstract Architectural Play',
        description: 'Transforms ordinary floor space into dynamic bridges, fences, and imaginative dwellings.'
      }
    ],
    whatsInside: [
      { name: '7 Graduated Nesting Arches', count: '7 pcs', detail: 'Solid FSC linden and beechwood' },
      { name: 'Play Inspiration Booklet', count: '1 pc', detail: '12 open-ended building ideas' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Largest arch: 26 × 13 × 5 cm · Smallest arch: 7 × 3.5 × 5 cm',
    careInstructions: 'Spot clean with mild soap and dry immediately. Do not soak in water.',
    safetyNotes: 'Velvety unlacquered matte finish ensures blocks do not slip when stacked. Food-grade non-toxic stains.',
    inStock: true
  },
  {
    id: 'little-architect-blocks',
    name: 'Little Architect Blocks',
    subtitle: 'Tactile Geometric Construction Set',
    tag: 'NEW',
    price: 2450,
    originalPrice: 2850,
    rating: 4.9,
    reviewCount: 118,
    ageBadge: 'AGE 2–7',
    ageGroup: '3–5Y',
    category: 'Building sets',
    interests: ['Building', 'Creating'],
    benefits: ['Spatial thinking', 'Focus', 'Creativity'],
    materials: ['FSC beechwood'],
    occasions: ['Birthday', 'Eid gift', 'Everyday play'],
    valueStatement: 'Grows architectural imagination and sustained quiet focus',
    description: '36 precision-milled architectural elements including arches, pillars, triangular roofs, and stairways. Natural wood construction that brings quiet focus to family afternoons.',
    sensoryQuote: '“Castles today, ancient towers tomorrow, and endless possibilities every afternoon.”',
    whyKidsLoveIt: 'Solid natural wood resonance when placed together. No batteries, no screens, just pure constructive flow on a cozy bed or rug.',
    developmentMilestones: [
      {
        title: 'Geometric Intuition',
        description: 'Introduces ratios, cylinders, prisms, and stable base geometry.'
      },
      {
        title: 'Sustained Concentration',
        description: 'Building multi-tier structures nurtures patience and emotional resilience.'
      },
      {
        title: 'Collaborative Play',
        description: 'Ideal for siblings or parent-child building sessions.'
      }
    ],
    whatsInside: [
      { name: 'Column Pillars & Cylinders', count: '12 pcs', detail: 'Precision-turned smooth beech' },
      { name: 'Arched Portals & Bridges', count: '6 pcs', detail: 'Curved structural lintels' },
      { name: 'Triangular Gables & Roofs', count: '8 pcs', detail: '45-degree angle peak blocks' },
      { name: 'Solid Foundation Plinths', count: '10 pcs', detail: 'Weighted rectangular bases' },
      { name: 'Solid Beechwood Storage Tray', count: '1 pc', detail: 'With engraved puzzle alignment grid' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Tray: 32 × 28 × 6 cm · Standard block unit: 4 × 4 × 4 cm',
    careInstructions: 'Dust with soft dry cloth. Keep away from direct humid dampness.',
    safetyNotes: 'Exceeds EN71 and ASTM safety requirements. Beveled smooth corners.',
    inStock: true
  },
  {
    id: 'make-believe-camera',
    name: 'Make-Believe Wooden Camera',
    subtitle: 'Kaleidoscope Viewfinder Toy',
    tag: 'STAFF PICK',
    price: 1350,
    rating: 4.7,
    reviewCount: 82,
    ageBadge: 'AGE 3–8',
    ageGroup: '3–5Y',
    category: 'Pretend play',
    interests: ['Exploring', 'Pretending', 'Creating'],
    benefits: ['Creativity', 'Sensory discovery', 'Language'],
    materials: ['FSC beechwood', 'Organic cotton'],
    occasions: ['Gift', 'Eid gift', 'Travel'],
    valueStatement: 'Invites social storytelling, visual wonder and pretend play',
    description: 'A pocket-sized heirloom camera featuring a faceted glass kaleidoscope lens, rotatable click dial, and soft cotton neck strap. Turns afternoon park walks into magical adventures.',
    sensoryQuote: '“Say cheese! Every room looks like a magical crystalline garden through the lens.”',
    whyKidsLoveIt: 'Looking through the kaleidoscope turns balconies, trees, and parents’ faces into dancing geometric gems.',
    developmentMilestones: [
      {
        title: 'Observation & Visual Inquiry',
        description: 'Encourages slowing down to observe light, angles, colors, and shadows.'
      },
      {
        title: 'Social Roleplaying',
        description: 'Promotes interactive dialogue: "Smile!", "Look this way!", fostering language skills.'
      },
      {
        title: 'Tactile Sensory Feedback',
        description: 'Clicking rotatable dial provides satisfying physical feedback.'
      }
    ],
    whatsInside: [
      { name: 'Carved Beechwood Camera Body', count: '1 pc', detail: 'With rotatable top dial' },
      { name: 'Faceted Glass Kaleidoscope Lens', count: '1 pc', detail: 'Scratch-resistant safety housing' },
      { name: 'Adjustable Cotton Webbing Strap', count: '1 pc', detail: 'Safety breakaway clasp' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Camera: 11 × 7.5 × 4.5 cm · Strap drop length: 38 cm',
    careInstructions: 'Clean lens with soft lens cloth. Wipe wood with gentle dry cloth.',
    safetyNotes: 'Shatter-proof encased optical grade acrylic prism. Meets drop test standards.',
    inStock: true
  },
  {
    id: 'pocket-forest-friends',
    name: 'Pocket Forest Friends',
    subtitle: 'Miniature Carved Animal Figurines',
    price: 1150,
    rating: 4.8,
    reviewCount: 219,
    ageBadge: 'AGE 2–6',
    ageGroup: '1–2Y',
    category: 'Pretend play',
    interests: ['Pretending', 'Exploring'],
    benefits: ['Language', 'Creativity', 'Fine motor'],
    materials: ['FSC beechwood'],
    occasions: ['Gift', 'Everyday play', 'Eid gift'],
    valueStatement: 'Inspires small-world pretend play and portable companions',
    description: 'Five palm-sized woodland friends: deer fawn, gentle bear, hare, badger, and spotted toadstool. Perfectly sized for little pockets, car rides, and restaurant visits.',
    sensoryQuote: '“Little companions that fit inside small coat pockets for big adventures.”',
    whyKidsLoveIt: 'They go everywhere: tucked into sensory bins of puffed rice, lined up on sofa edges, or accompanying toddlers during doctor visits.',
    developmentMilestones: [
      {
        title: 'Vocabulary & Animal Recognition',
        description: 'Spurs early Bengali and English word formation and animal sounds.'
      },
      {
        title: 'Emotional Empathy',
        description: 'Caring for small creature figurines fosters nurturing instincts.'
      },
      {
        title: 'Portable Focus',
        description: 'Compact size allows imaginative play anywhere in Dhaka traffic without screen time.'
      }
    ],
    whatsInside: [
      { name: 'Deer Fawn & Brown Bear', count: '2 pcs', detail: 'Solid maple with hand-stained details' },
      { name: 'Forest Badger & Little Hare', count: '2 pcs', detail: 'Silky smooth satin finish' },
      { name: 'Toadstool Mushroom', count: '1 pc', detail: 'Charming forest accent' },
      { name: 'Linen Travel Pouch', count: '1 pc', detail: 'With GrowKins embroidered mark' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Figures average 5–8 cm height · Pouch: 15 × 12 cm',
    careInstructions: 'Wipe with soft slightly damp towel.',
    safetyNotes: 'Solid single-piece carvings with zero small detachment parts. Safe for 24M+.',
    inStock: true
  },
  {
    id: 'first-beeswax-crayons',
    name: 'First Beeswax Crayons',
    subtitle: 'Pure Honey-Scented Block Crayons',
    price: 850,
    rating: 4.9,
    reviewCount: 174,
    ageBadge: 'AGE 2–6',
    ageGroup: '1–2Y',
    category: 'Art & Craft',
    interests: ['Creating'],
    benefits: ['Fine motor', 'Creativity', 'Sensory discovery'],
    materials: ['Natural beeswax'],
    occasions: ['Everyday play', 'Gift', 'Birthday'],
    valueStatement: 'Supports toddler palmar grip and rich artistic expression',
    description: 'Eight chunky beeswax block crayons made from 100% natural organic beeswax and food-grade mineral pigments. Sweet honey scent with zero toxic paraffin petroleum.',
    sensoryQuote: '“No snap, no crumble — just rich, warm honey scent and vibrant broad strokes.”',
    whyKidsLoveIt: 'Toddler fists grip these chunky blocks effortlessly without breaking. Covers large chart paper easily!',
    developmentMilestones: [
      {
        title: 'Palmar Grasp Development',
        description: 'Block profile naturally assists toddlers transitioning to refined finger control.'
      },
      {
        title: 'Non-Toxic Sensory Grounding',
        description: 'Pure natural beeswax aroma brings a calming sensory dimension.'
      },
      {
        title: 'Rich Pigmentation',
        description: 'High pigment density allows luminous wax layering.'
      }
    ],
    whatsInside: [
      { name: '8 Pure Beeswax Color Blocks', count: '8 pcs', detail: 'Goldenrod, Terracotta, Coral, Forest, Ocean, Plum, Ochre, Bark' },
      { name: 'Recycled Kraft Gift Box', count: '1 pc', detail: 'With individual paper-divider slots' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Each block: 4 × 2.4 × 1.2 cm · Weight: 28g per crayon',
    careInstructions: 'Store in a cool dry place away from direct heat.',
    safetyNotes: '100% food-grade mineral colorants. Non-toxic if accidentally mouthed. AP certified.',
    inStock: true
  },
  {
    id: 'meadow-play-mat',
    name: 'Meadow Play Mat',
    subtitle: 'Quilted Organic Cotton Leaf Cushion',
    price: 3200,
    rating: 4.8,
    reviewCount: 94,
    ageBadge: 'AGE 0–5',
    ageGroup: '0–12M',
    category: 'Sensory',
    interests: ['Exploring', 'Moving'],
    benefits: ['Sensory discovery', 'Balance', 'Focus'],
    materials: ['Organic cotton'],
    occasions: ['Akika / New baby', 'Everyday play', 'Gift'],
    valueStatement: 'A plush organic cotton haven for tummy time and story snuggles',
    description: 'An expansive, double-sided organic cotton play mat shaped like an oak leaf with gentle quilting for tummy time, first crawls, and peaceful afternoon naps.',
    sensoryQuote: '“Gentle cushioning for first rolls, first crawls, and afternoon story snuggles.”',
    whyKidsLoveIt: 'Hypoallergenic and breathable in warm Bangladeshi weather. Looks gorgeous in any modern bedroom or drawing room.',
    developmentMilestones: [
      {
        title: 'Tummy Time Trunk Strength',
        description: 'Provides firm yet cushioned ground resistance for baby head-lifting and crawling.'
      },
      {
        title: 'Safe Boundary',
        description: 'Creates a clean, dedicated perimeter for baby play on tile or wooden floors.'
      },
      {
        title: 'Breathable Cotton Weave',
        description: 'Prevents heat buildup and skin rash in tropical temperatures.'
      }
    ],
    whatsInside: [
      { name: 'Quilted Leaf Play Mat', count: '1 pc', detail: '100% organic breathable cotton' },
      { name: 'Cotton Ribbon Tie', count: '1 pc', detail: 'Rolls easily for family visits to grandparents’ home' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: '115 × 95 cm · 2.5 cm plush supportive loft',
    careInstructions: 'Machine wash delicate cold. Line dry in shade.',
    safetyNotes: 'OEKO-TEX baby certified. Free from formaldehyde, AZO dyes, and harsh chemicals.',
    inStock: true
  },
  {
    id: 'sensory-rattle-trio',
    name: 'Montessori Bell Rattle Trio',
    subtitle: 'Natural Polished Maple & Beechwood Sounds',
    price: 1250,
    rating: 4.9,
    reviewCount: 138,
    ageBadge: 'AGE 0–12M',
    ageGroup: '0–12M',
    category: 'Sensory',
    interests: ['Exploring', 'Moving'],
    benefits: ['Sensory discovery', 'Fine motor', 'Focus'],
    materials: ['FSC beechwood'],
    occasions: ['Akika / New baby', 'Gift', 'Everyday play'],
    valueStatement: 'Gentle acoustic sound engineered for sensitive infant ears',
    description: 'Three distinct acoustic Montessori rattles: rolling drum rattle, interlocking grasping rings, and bell cylinder in silk-smooth unvarnished maple wood. Perfect Akika or newborn gift.',
    sensoryQuote: '“Soft woody chimes that comfort rather than overwhelm little developing nervous systems.”',
    whyKidsLoveIt: 'Easy for tiny uncoordinated fingers to clutch, shake, and pass from hand to hand.',
    developmentMilestones: [
      {
        title: 'Auditory Tracking & Localization',
        description: 'Soft musical resonance assists infants in turning their heads to locate sound.'
      },
      {
        title: 'Grasp Reflex Development',
        description: 'Calibrated ring diameter engineered for early infant grasping reflex.'
      },
      {
        title: 'Midline Transfer',
        description: 'Encourages passing objects between left and right hands around 5-7 months.'
      }
    ],
    whatsInside: [
      { name: 'Rolling Cylinder with Brass Bell', count: '1 pc', detail: 'Gentle rolling sound encourages crawling' },
      { name: 'Interlocking Grasping Dual Rings', count: '1 pc', detail: 'Clacking natural wood tones' },
      { name: 'Ergonomic Dumbbell Barbell Rattle', count: '1 pc', detail: 'Easy single-hand grip' },
      { name: 'Organic Muslin Gift Pouch', count: '1 pc', detail: 'Breathable unbleached cotton' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: 'Rolling bell: 8 × 6 cm · Rings: 7.5 cm diameter · Dumbbell: 11 cm length',
    careInstructions: 'Wipe clean with moist washcloth. Treat with organic coconut oil occasionally.',
    safetyNotes: 'Sealed enclosed brass bell cannot detach. Conforms to strict choking hazard standards.',
    inStock: true
  },
  {
    id: 'wobble-balance-board',
    name: 'Wobble & Balance Board',
    subtitle: 'Curved Beechwood Rocker & Bridge',
    price: 3450,
    originalPrice: 3950,
    rating: 4.9,
    reviewCount: 260,
    ageBadge: 'AGE 1–8',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ['Moving', 'Building', 'Pretending'],
    benefits: ['Balance', 'Spatial thinking', 'Creativity'],
    materials: ['FSC beechwood', 'Recycled wool'],
    occasions: ['Birthday', 'Eid gift', 'Everyday play'],
    valueStatement: 'Strengthens core posture, physical balance and active indoor movement',
    description: 'Pressed multi-layer European beech rocker lined on the underside with wool felt to protect apartment floor tiles and dampen sound. Ideal for energetic play on hot or rainy days in Dhaka.',
    sensoryQuote: '“A seesaw, a bridge, a reading nook, a slide for teddy bears.”',
    whyKidsLoveIt: 'Children burn unlimited energy indoors rocking, sliding, balancing, and building fortresses over it.',
    developmentMilestones: [
      {
        title: 'Vestibular Balance Development',
        description: 'Stimulates the inner-ear fluid responsible for sense of balance and physical coordination.'
      },
      {
        title: 'Core Muscle Strength',
        description: 'Engages abdominal and postural muscles during dynamic movement.'
      },
      {
        title: 'Physical Confidence',
        description: 'Encourages courageous bodily self-trust without needing outdoor playgrounds.'
      }
    ],
    whatsInside: [
      { name: 'Molded Beech Balance Board', count: '1 pc', detail: 'Supports up to 200kg (grown-up tested!)' },
      { name: 'Natural Wool Felt Underside', count: '1 pc', detail: 'Silences indoor play on tile floors' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      childHolding: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      inPlay: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      scaleRef: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: '88 × 30 × 19 cm · Thickness: 1.8 cm · Weight: 3.2 kg',
    careInstructions: 'Vacuum felt backing regularly. Wipe wood with slightly damp cloth.',
    safetyNotes: 'Child-safe water-based varnish. Rounded ergonomic safety corners.',
    inStock: true
  }
];

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Nusrat Jahan',
    authorRole: 'Mum of two (aged 2 & 4), Dhanmondi, Dhaka',
    rating: 5,
    title: 'Screen-time replaced with peaceful creative play',
    content: 'My daughter used to ask for YouTube rhymes every evening. After receiving the Woodland Balance Friends, she spends over 45 minutes making animal families and stacking them. Cash on delivery in Dhanmondi was super fast (arrived next day)!',
    date: '2 days ago',
    childAge: 'Age 3',
    photoUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Tanvir & Farah Ahmed',
    authorRole: 'Parents of 18M baby, Uttara, Dhaka',
    rating: 5,
    title: 'Heirloom quality wood in Bangladesh',
    content: 'It is so hard to find genuine toxic-free wooden toys in Bangladesh. Most market toys smell like plastic fumes. The Sunrise Stacking Arch is smooth, beautifully dyed, and looks stunning in our drawing room. Loved the COD service.',
    date: '5 days ago',
    childAge: 'Age 1.5',
    photoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Dr. Sadia Rahman',
    authorRole: 'Pediatrician & Mother, Chittagong',
    rating: 5,
    title: 'Perfect Akika Gift for my niece',
    content: 'I ordered the Montessori Bell Rattle Trio for my brother’s newborn in Chittagong. Delivery arrived safely in 2 days via courier with cash on delivery. The organic muslin bag and gentle acoustic wood sounds are superb.',
    date: '1 week ago',
    childAge: 'Age 6M',
    photoUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=400&q=80',
    verified: true
  }
];

export function syncLiveProductsFromDb(): void {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('growkins_db_products') : null;
    if (raw) {
      const dbProds = JSON.parse(raw);
      const mapped = dbProds
        .filter((p: any) => p.status === 'active')
        .map((p: any) => {
          const main = p.images?.find((img: any) => img.type === 'primary')?.url || p.images?.[0]?.url || '';
          const secondary = p.images?.find((img: any) => img.type === 'gallery')?.url || p.images?.[1]?.url || main;
          const childHolding = p.images?.find((img: any) => img.type === 'lifestyle')?.url;
          const inPlay = p.images?.find((img: any) => img.sortOrder === 4)?.url || childHolding;
          const detail = p.images?.find((img: any) => img.type === 'detail')?.url;
          const scaleRef = p.images?.find((img: any) => img.type === 'scale')?.url;

          return {
            ...p,
            tag: p.tag || undefined,
            images: {
              main,
              secondary,
              childHolding,
              inPlay,
              detail,
              scaleRef
            },
            inStock: p.inventory ? (p.inventory.quantity > 0 || p.inventory.allowBackorder) : p.inStock
          };
        });

      if (mapped.length > 0) {
        PRODUCTS.length = 0;
        PRODUCTS.push(...mapped);
      }
    }
  } catch {
    // fallback to initial static array
  }
}

// Initial sync on module load
syncLiveProductsFromDb();

