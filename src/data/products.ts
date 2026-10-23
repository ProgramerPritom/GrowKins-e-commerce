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
  },
  {
    id: '10-in-1-polygon-busy-cube',
    name: "10 in 1 Polygon Busy Cube",
    subtitle: "10-Sided Multi-Activity Montessori Wooden Sensory Cube",
    tag: 'BESTSELLER',
    price: 890,
    originalPrice: 1150,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–4',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ["Exploring","Building"],
    benefits: ["Fine motor","Focus","Sensory discovery"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play"],
    valueStatement: "10-Sided Multi-Activity Montessori Wooden Sensory Cube",
    description: "10 in 1 Polygon Busy Cube হলো একটি বহুমুখী মন্টessori ভিত্তিক সেন্সরি অ্যাক্টিভিটি কিউব। এতে লক-কি, গিয়ার, শু-লেসিং, স্পিনার এবং সুইচের মতো ১০ ধরনের ভিন্ন ভিন্ন অ্যাক্টিভিটি রয়েছে। খেলতে খেলতেই আপনার সোনামনির হাতের আঙুলের মোটর স্কিল, মনোযোগ এবং কৌতূহল চমৎকারভাবে বিকশিত হবে। নিরাপদ মসৃণ কাঠের তৈরি এই কিউবটি ভ্রমণ কিংবা ঘরে বসে স্ক্রিন-ফ্রি কোয়ালিটি টাইমের জন্য আদর্শ।",
    sensoryQuote: "“10-Sided Multi-Activity Montessori Wooden Sensory Cube designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Fine motor",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor."
      },
      {
            "title": "Problem solving",
            "description": "Hands-on activity specifically designed to calibrate and strengthen problem solving."
      },
      {
            "title": "Sensory discovery",
            "description": "Hands-on activity specifically designed to calibrate and strengthen sensory discovery."
      }
],
    whatsInside: [
      {
            "name": "10-in-1 Polygon Busy Cube Unit",
            "count": "1 pc",
            "detail": "Solid smoothed wooden polygonal base with 10 built-in activities"
      },
      {
            "name": "Keys & Lock Attachment",
            "count": "1 set",
            "detail": "Secure safety key mechanism for hand dexterity"
      },
      {
            "name": "Shoe Lacing Cord",
            "count": "1 pc",
            "detail": "Soft durable shoelace cord for practical life skills"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/14ZzoAsJZhcV8qj4Dc9xzVCoCJxhguOAI',
      secondary: '/items/10-in-1-polygon-busy-cube.jpg',
      detail: 'https://lh3.googleusercontent.com/d/14ZzoAsJZhcV8qj4Dc9xzVCoCJxhguOAI',
      gallery: ['https://lh3.googleusercontent.com/d/14ZzoAsJZhcV8qj4Dc9xzVCoCJxhguOAI', '/items/10-in-1-polygon-busy-cube.jpg']
    },
    dimensions: "14 × 14 × 14 cm · Weight: 420g",
    careInstructions: "শুকনো অথবা সামান্য ভেজা সুতি কাপড় দিয়ে মুছে রাখুন। পানিতে ভেজাবেন না।",
    safetyNotes: "EN71 এবং ASTM সেফটি কমপ্লায়েন্ট। শতভাগ বিষমুক্ত রঙ ও মসৃণ গোলাকার কোণা।",
    inStock: true
  },
  {
    id: 'gyan-box-set-16-books',
    name: "Gyan Box Set — ১৬ টি বই",
    subtitle: "Comprehensive 16-Book Early Learning Foundation Set for Kids",
    tag: 'NEW',
    price: 750,
    originalPrice: 990,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–5',
    ageGroup: '1–2Y',
    category: 'Books & Storytelling',
    interests: ["Reading"],
    benefits: ["Language"],
    materials: ["FSC beechwood","Organic cotton"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Comprehensive 16-Book Early Learning Foundation Set for Kids",
    description: "ছোট্ট সোনামনিদের প্রথম বই পড়ার চমৎকার অভিজ্ঞতা দিতে Gyan Box-এর ১৬ টি বইয়ের সম্পূর্ণ সেট। এতে রয়েছে বাংলা বর্ণমালা, ইংরেজি Alphabet, আরবি হরফ, সংখ্যা ও গণনা, পশু-পাখি, ফল-মূল, যানবাহনসহ গুরুত্বপূর্ণ ১৬টি বিষয়ের রঙিন সচিত্র বই। মজবুত ও সহজে না ছেঁড়ার মতো উন্নত বোর্ডে তৈরি, যা বাচ্চাদের হাত থেকে সহজে নষ্ট হয় না।",
    sensoryQuote: "“Comprehensive 16-Book Early Learning Foundation Set for Kids designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Early literacy",
            "description": "Hands-on activity specifically designed to calibrate and strengthen early literacy."
      },
      {
            "title": "Vocabulary expansion",
            "description": "Hands-on activity specifically designed to calibrate and strengthen vocabulary expansion."
      },
      {
            "title": "Cognitive development",
            "description": "Hands-on activity specifically designed to calibrate and strengthen cognitive development."
      }
],
    whatsInside: [
      {
            "name": "Educational Board Books",
            "count": "16 pcs",
            "detail": "Bangla, English, Arabic, Numbers, Animals, Fruits, Vegetables & more"
      },
      {
            "name": "Protective Gift Storage Box",
            "count": "1 pc",
            "detail": "Hard-case book organizer container"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1VZC7NljUhvUV_vWGPuqgZMA5oYrNDVpL',
      secondary: '/items/gyan-box-set-16-books.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1VZC7NljUhvUV_vWGPuqgZMA5oYrNDVpL',
      gallery: ['https://lh3.googleusercontent.com/d/1VZC7NljUhvUV_vWGPuqgZMA5oYrNDVpL', '/items/gyan-box-set-16-books.jpg']
    },
    dimensions: "10 × 10 cm per book · Box: 22 × 12 × 11 cm",
    careInstructions: "পৃষ্ঠাগুলো শুকনো কাপড় দিয়ে মুছে রাখুন। সরাসরি পানির সংস্পর্শ থেকে দূরে রাখুন।",
    safetyNotes: "শিশুদের উপযোগী গোলাকার কোণাযুক্ত (Round Corners) এবং বিষমুক্ত নন-টক্সিক কালি।",
    inStock: true
  },
  {
    id: '7-in-1-busy-cube',
    name: "7 in 1 Busy Cube",
    subtitle: "7-Sided Educational Activity Center with Bead Maze & Clock",
    tag: 'BESTSELLER',
    price: 750,
    originalPrice: 950,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–3',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ["Exploring"],
    benefits: ["Fine motor","Focus"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play","Gift"],
    valueStatement: "7-Sided Educational Activity Center with Bead Maze & Clock",
    description: "7 in 1 Busy Cube হলো টডলারদের হাতের নিয়ন্ত্রণ ও বুদ্ধির বিকাশে অত্যন্ত জনপ্রিয় একটি কাঠের খেলনা। এতে রয়েছে রঙিন শেপ সর্টার, লার্নিং ক্লক, এবাকাস কাউন্টার, মিনি বিড মেজ ও রোলিং গিয়ার। বিভিন্ন ধরনের অ্যাক্টিভিটি শিশুদের দীর্ঘক্ষণ ব্যস্ত ও আনন্দিত রাখতে সাহায্য করে।",
    sensoryQuote: "“7-Sided Educational Activity Center with Bead Maze & Clock designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Fine motor",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor."
      },
      {
            "title": "Shape recognition",
            "description": "Hands-on activity specifically designed to calibrate and strengthen shape recognition."
      },
      {
            "title": "Focus",
            "description": "Hands-on activity specifically designed to calibrate and strengthen focus."
      }
],
    whatsInside: [
      {
            "name": "7-in-1 Busy Cube Unit",
            "count": "1 pc",
            "detail": "Solid wooden cube base with shape sorter, clock, abacus and gears"
      },
      {
            "name": "Geometric Sorting Blocks",
            "count": "4 pcs",
            "detail": "Color-coded wooden sorting blocks"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1jEfw0TyXKnx5pPEa8h1E3DffCnBTnRVI',
      secondary: '/items/7-in-1-busy-cube.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1jEfw0TyXKnx5pPEa8h1E3DffCnBTnRVI',
      gallery: ['https://lh3.googleusercontent.com/d/1jEfw0TyXKnx5pPEa8h1E3DffCnBTnRVI', '/items/7-in-1-busy-cube.jpg']
    },
    dimensions: "13 × 13 × 13 cm · Weight: 390g",
    careInstructions: "ধুলোবালি পড়লে নরম সুতি কাপড় দিয়ে পরিষ্কার করুন।",
    safetyNotes: "মসৃণভাবে স্যান্ডেড কাঠ, কোনো ধারালো অংশ নেই। আন্তর্জাতিক শিশু নিরাপত্তা মানসম্মত।",
    inStock: true
  },
  {
    id: 'intelligent-book-mega-combo',
    name: "Intelligent Book + Writing Tablet + Magic Water Book + Flash Card Combo",
    subtitle: "All-in-One Early Learning Mega Smart Educational Bundle",
    tag: 'STAFF PICK',
    price: 1150,
    originalPrice: 1550,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–6',
    ageGroup: '3–5Y',
    category: 'Books & Storytelling',
    interests: ["Reading"],
    benefits: ["Language","Fine motor"],
    materials: ["FSC beechwood","Organic cotton"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "All-in-One Early Learning Mega Smart Educational Bundle",
    description: "আমাদের সবচেয়ে জনপ্রিয় মেগা এডুকেশনাল কম্বো! এই একটি প্যাকেজেই থাকছে ইন্টারেক্টিভ ইন্টেলিজেন্ট অডিও লার্নিং বুক, ৮.৫ ইঞ্চি এলসিডি রাইটিং ট্যাবলেট, রিইউজেবল ম্যাজিক ওয়াটার কালারিং বুক এবং ডাবল-সাইডেড ফ্ল্যাশ কার্ড। অডিও শুনে উচ্চারণ শেখা, ট্যাবলেটে নির্ভুল লেখার চর্চা এবং কোনো রং ছড়ানো ছাড়াই পানিতে আঁকাআঁকির দারুণ সমাহার।",
    sensoryQuote: "“All-in-One Early Learning Mega Smart Educational Bundle designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Language mastery",
            "description": "Hands-on activity specifically designed to calibrate and strengthen language mastery."
      },
      {
            "title": "Writing confidence",
            "description": "Hands-on activity specifically designed to calibrate and strengthen writing confidence."
      },
      {
            "title": "Fine motor coordination",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor coordination."
      }
],
    whatsInside: [
      {
            "name": "Electronic Intelligent Sound Book",
            "count": "1 pc",
            "detail": "Interactive touch-activated audio speech learning book"
      },
      {
            "name": "LCD Writing Tablet with Stylus",
            "count": "1 pc",
            "detail": "8.5-inch pressure-sensitive erasable writing pad"
      },
      {
            "name": "Magic Water Coloring Book with Pen",
            "count": "1 pc",
            "detail": "Water-fillable pen with refillable magical color reveal pages"
      },
      {
            "name": "Illustrated Flash Card Pack",
            "count": "1 set",
            "detail": "Card collection for vocabulary and phonics drills"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1NuP4TcF2FrHL6W3yIUUGisd3WeudWfZr',
      secondary: '/items/intelligent-book-mega-combo.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1NuP4TcF2FrHL6W3yIUUGisd3WeudWfZr',
      gallery: ['https://lh3.googleusercontent.com/d/1NuP4TcF2FrHL6W3yIUUGisd3WeudWfZr', '/items/intelligent-book-mega-combo.jpg']
    },
    dimensions: "30 × 24 × 6 cm (Package Box)",
    careInstructions: "ইলেকট্রনিক বুক ও ট্যাবলেটে সরাসরি পানি ছিটাবেন না। শুষ্ক স্থানে সংরক্ষণ করুন।",
    safetyNotes: "চোখের সুরক্ষায় অ্যান্টি-গ্লেয়ার এলসিডি স্ক্রিন। ব্যাটারি চেম্বার সুরক্ষিত স্ক্রু দিয়ে লক করা।",
    inStock: true
  },
  {
    id: 'gyan-box-writing-tablet-combo',
    name: "Gyan Box + Writing Tablet Combo",
    subtitle: "12 Foundational Board Books paired with 8.5\" LCD Practice Tablet",
    tag: 'BESTSELLER',
    price: 850,
    originalPrice: 1100,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–5',
    ageGroup: '1–2Y',
    category: 'Books & Storytelling',
    interests: ["Reading"],
    benefits: ["Language","Fine motor","Creativity"],
    materials: ["FSC beechwood","Organic cotton"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "12 Foundational Board Books paired with 8.5\" LCD Practice Tablet",
    description: "জ্ঞান বক্সের ১২টি রঙিন বেসিক লার্নিং বুক এবং ৮.৫ ইঞ্চি এলসিডি রাইটিং ট্যাবলেটের একটি অসাধারণ কম্বো। বই দেখে বর্ণ, সংখ্যা ও শব্দ চেনার পাশাপাশি ট্যাবলেটে সোনামনি যতখুশি লিখে আবার এক ক্লিকে মুছে নতুন করে অনুশীলন করতে পারবে। খাতা-কলম অপচয় ছাড়াই আনন্দময় পড়াশোনা।",
    sensoryQuote: "“12 Foundational Board Books paired with 8.5\" LCD Practice Tablet designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Literacy",
            "description": "Hands-on activity specifically designed to calibrate and strengthen literacy."
      },
      {
            "title": "Handwriting preparation",
            "description": "Hands-on activity specifically designed to calibrate and strengthen handwriting preparation."
      },
      {
            "title": "Fine motor control",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor control."
      }
],
    whatsInside: [
      {
            "name": "Gyan Box Board Books",
            "count": "12 pcs",
            "detail": "Foundational topics: Alphabet, Numbers, Fruits, Shapes & more"
      },
      {
            "name": "LCD Writing Tablet with Stylus",
            "count": "1 pc",
            "detail": "One-click clear button with screen lock protection"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1AzfiPePHBfrbAxQVMoA6XtJwgIzWrFUl',
      secondary: '/items/gyan-box-writing-tablet-combo.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1AzfiPePHBfrbAxQVMoA6XtJwgIzWrFUl',
      gallery: ['https://lh3.googleusercontent.com/d/1AzfiPePHBfrbAxQVMoA6XtJwgIzWrFUl', '/items/gyan-box-writing-tablet-combo.jpg']
    },
    dimensions: "Tablet: 22.5 × 14.5 cm · Books: 10 × 10 cm",
    careInstructions: "ট্যাবলেটের স্ক্রিনে ধারালো কোনো বস্তু ব্যবহার করবেন না। শুধু সরবরাহকৃত স্টাইলাস ব্যবহার করুন।",
    safetyNotes: "নো রেডিয়েশন ও নো ব্লু-লাইট স্ক্রিন। দীর্ঘ সময় ব্যবহারের পরও চোখের ক্লান্তি আসে না।",
    inStock: true
  },
  {
    id: 'flash-card-writing-tablet-combo',
    name: "Flash Card + Writing Tablet",
    subtitle: "Sight Words Flash Cards with Digital Erasable Writing Board",
    tag: 'NEW',
    price: 950,
    originalPrice: 1250,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–6',
    ageGroup: '3–5Y',
    category: 'Books & Storytelling',
    interests: ["Reading"],
    benefits: ["Language","Focus"],
    materials: ["FSC beechwood","Organic cotton"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Sight Words Flash Cards with Digital Erasable Writing Board",
    description: "ফ্ল্যাশ কার্ড ও রাইটিং ট্যাবলেটের এই ডুয়াল লার্নিং কম্বোটি শিশুদের বানান ও হাতের লেখা শেখার জন্য দারুণ কার্যকরী। কার্ডের ছবি দেখে শব্দ বোঝা এবং সাথে সাথে ট্যাবলেটে পেনসিল গ্রিপে হাত ঘুরিয়ে লেখার চর্চা করা যায়। রিইউজেবল হওয়ায় হাজারবার লেখা ও মোছার সুযোগ থাকে।",
    sensoryQuote: "“Sight Words Flash Cards with Digital Erasable Writing Board designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Sight word recognition",
            "description": "Hands-on activity specifically designed to calibrate and strengthen sight word recognition."
      },
      {
            "title": "Pencil grip practice",
            "description": "Hands-on activity specifically designed to calibrate and strengthen pencil grip practice."
      },
      {
            "title": "Focus",
            "description": "Hands-on activity specifically designed to calibrate and strengthen focus."
      }
],
    whatsInside: [
      {
            "name": "Educational Flash Cards",
            "count": "1 pack",
            "detail": "Comprehensive two-sided cards covering objects, animals & phonics"
      },
      {
            "name": "Erasable LCD Tablet & Pen",
            "count": "1 unit",
            "detail": "Clear and bright display with erase lock"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1ecmNpvD-HuebKip7Vk-UaDQWYbC7rLpY',
      secondary: '/items/flash-card-writing-tablet-combo.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1ecmNpvD-HuebKip7Vk-UaDQWYbC7rLpY',
      gallery: ['https://lh3.googleusercontent.com/d/1ecmNpvD-HuebKip7Vk-UaDQWYbC7rLpY', '/items/flash-card-writing-tablet-combo.jpg']
    },
    dimensions: "23 × 15 × 3 cm",
    careInstructions: "কার্ড পানিতে ভেজাবেন না, ট্যাবলেটের স্ক্রিন নরম সুতি কাপড়ে মুছুন।",
    safetyNotes: "BPA-মুক্ত পরিবেশবান্ধব প্লাস্টিক ও শিশুদের জন্য নিরাপদ নন-গ্লেয়ার ডিসপ্লে।",
    inStock: true
  },
  {
    id: '7in1-busy-cube-mini-bead-maze',
    name: "7in1-Busy Cube + Mini Bead Maze",
    subtitle: "Ultimate Toddler Motor Skills Dynamic Duo Play Set",
    tag: 'BESTSELLER',
    price: 900,
    originalPrice: 1200,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–4',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ["Exploring","Building"],
    benefits: ["Fine motor","Spatial thinking","Focus"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Ultimate Toddler Motor Skills Dynamic Duo Play Set",
    description: "একটি প্যাকেজেই দুটি সেরা সেন্সরি খেলনা! ৭-ইন-১ মাল্টিঅ্যাক্টিভিটি বিজি কিউব এবং সাথে কালারফুল মিনি উডেন বিড মেজ। তারের প্যাঁচানো ট্র্যাকে রঙিন পুঁতি এদিক-ওদিক সরানো এবং কিউবের গিয়ার ও শেপ নিয়ে খেলা শিশুদের ধৈর্য, আঙুলের পেশী ও মস্তিষ্কের সমন্বয়কে দ্রুত উন্নত করে।",
    sensoryQuote: "“Ultimate Toddler Motor Skills Dynamic Duo Play Set designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Fine motor dexterity",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor dexterity."
      },
      {
            "title": "Hand-eye coordination",
            "description": "Hands-on activity specifically designed to calibrate and strengthen hand-eye coordination."
      },
      {
            "title": "Spatial reasoning",
            "description": "Hands-on activity specifically designed to calibrate and strengthen spatial reasoning."
      }
],
    whatsInside: [
      {
            "name": "7-in-1 Busy Cube Unit",
            "count": "1 pc",
            "detail": "Solid wooden activity cube with mechanical elements"
      },
      {
            "name": "Mini Bead Maze Coaster",
            "count": "1 pc",
            "detail": "Classic roller coaster wire with smooth colorful sliding beads"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1l5KfCYszKjjQl7Cw-POhZ_cjZbYvbq9P',
      secondary: '/items/7in1-busy-cube-mini-bead-maze.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1l5KfCYszKjjQl7Cw-POhZ_cjZbYvbq9P',
      gallery: ['https://lh3.googleusercontent.com/d/1l5KfCYszKjjQl7Cw-POhZ_cjZbYvbq9P', '/items/7in1-busy-cube-mini-bead-maze.jpg']
    },
    dimensions: "Busy Cube: 13×13 cm · Bead Maze: 12×9×9 cm",
    careInstructions: "শুকনো কাপড় দিয়ে মুছে পরিষ্কার রাখুন। মেটাল ট্র্যাকে অতিরিক্ত চাপ দেবেন না।",
    safetyNotes: "স্মুথ ও গোল করে পলিশ করা বিড, বিষমুক্ত ওয়াটার-বেস কালার পেইন্ট।",
    inStock: true
  },
  {
    id: 'educational-board-5-books-flash-card',
    name: "Educational Board + 5 Books + Flash Card",
    subtitle: "Triple-Action Multi-Subject Early Scholar Learning Suite",
    tag: 'STAFF PICK',
    price: 1200,
    originalPrice: 1600,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–6',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Language","Fine motor"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Triple-Action Multi-Subject Early Scholar Learning Suite",
    description: "সোনামনির পড়াশোনার ভিত মজবুত করতে এই কম্বোটি অতুলনীয়। এতে রয়েছে বর্ণ ও সংখ্যা অনুশীলনের উডেন এডুকেশনাল বোর্ড, ৫টি বেসিক লার্নিং বোর্ড বুক এবং এক সেট আকর্ষণীয় রঙিন ফ্ল্যাশ কার্ড। বোর্ডের মাধ্যমে স্পর্শ করে শেপ ও সংখ্যা চেনা, বই থেকে গল্প ও শব্দ শেখা এবং কার্ড দিয়ে কুইজ খেলা—সবকিছু এক সেটে।",
    sensoryQuote: "“Triple-Action Multi-Subject Early Scholar Learning Suite designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Alphabet mastering",
            "description": "Hands-on activity specifically designed to calibrate and strengthen alphabet mastering."
      },
      {
            "title": "Numeracy foundation",
            "description": "Hands-on activity specifically designed to calibrate and strengthen numeracy foundation."
      },
      {
            "title": "Language comprehension",
            "description": "Hands-on activity specifically designed to calibrate and strengthen language comprehension."
      }
],
    whatsInside: [
      {
            "name": "Wooden Educational Logic Board",
            "count": "1 pc",
            "detail": "Engraved letters, numbers, and sorting slots"
      },
      {
            "name": "Illustrated Foundation Board Books",
            "count": "5 pcs",
            "detail": "Selected subjects for core preschool readiness"
      },
      {
            "name": "Educational Flash Card Deck",
            "count": "1 set",
            "detail": "Durable flash cards with real-world pictures"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1J5mfiS_BJ9uz5WGji26D1CWUZCuRUpby',
      secondary: '/items/educational-board-5-books-flash-card.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1J5mfiS_BJ9uz5WGji26D1CWUZCuRUpby',
      gallery: ['https://lh3.googleusercontent.com/d/1J5mfiS_BJ9uz5WGji26D1CWUZCuRUpby', '/items/educational-board-5-books-flash-card.jpg']
    },
    dimensions: "Board: 30 × 22 cm · Books: 10 × 10 cm",
    careInstructions: "বোর্ড ও বইগুলো শুকনো স্থানে গুছিয়ে রাখুন।",
    safetyNotes: "সব কাঠের টুকরো স্যান্ডেড এবং ধারহীন। পেইন্ট শতভাগ লিড ও বিপিএ মুক্ত।",
    inStock: true
  },
  {
    id: 'led-drawing-board-drawing-book',
    name: "LED Drawing Board + ১০ Page Drawing Book",
    subtitle: "Illuminated Glow Art Sketchpad with 48-Page Coloring Book",
    tag: 'NEW',
    price: 850,
    originalPrice: 1150,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–8',
    ageGroup: '3–5Y',
    category: 'Art & Craft',
    interests: ["Creating"],
    benefits: ["Creativity"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Illuminated Glow Art Sketchpad with 48-Page Coloring Book",
    description: "আলোর জাদুতে আঁকাআঁকির আনন্দ! LED Drawing Board-এ স্পেশাল গ্লো পেন্সিল দিয়ে ড্রয়িং করে লাইট জ্বালালেই ছবিগুলো নিয়ন আলোর মতো উজ্জ্বল হয়ে ওঠে। সাথে থাকছে রঙিন ছবির ড্রয়িং বুক, যা দেখে সোনামনি খুব সহজেই নতুন নতুন স্কেচ করতে পারবে। মুছে আবার নতুন করে হাজারো ছবি আঁকা যায়।",
    sensoryQuote: "“Illuminated Glow Art Sketchpad with 48-Page Coloring Book designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Creativity stimulation",
            "description": "Hands-on activity specifically designed to calibrate and strengthen creativity stimulation."
      },
      {
            "title": "Visual expression",
            "description": "Hands-on activity specifically designed to calibrate and strengthen visual expression."
      },
      {
            "title": "Hand coordination",
            "description": "Hands-on activity specifically designed to calibrate and strengthen hand coordination."
      }
],
    whatsInside: [
      {
            "name": "Acrylic LED Glow Drawing Board",
            "count": "1 pc",
            "detail": "Crystal-clear illuminated board with multi-color LED backlighting"
      },
      {
            "name": "Coloring & Drawing Guide Book",
            "count": "1 pc",
            "detail": "Inspirational outline illustrations to trace and color"
      },
      {
            "name": "Neon Fluorescent Chalk Pens",
            "count": "1 set",
            "detail": "Vivid erasable light-reactive drawing markers"
      },
      {
            "name": "Microfiber Cleaning Cloth",
            "count": "1 pc",
            "detail": "Soft streak-free wipe for instant board erasing"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1dyFJ5qDQHPbfn0g40ksKY32YiZaIPBYx',
      secondary: '/items/led-drawing-board-drawing-book.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1dyFJ5qDQHPbfn0g40ksKY32YiZaIPBYx',
      gallery: ['https://lh3.googleusercontent.com/d/1dyFJ5qDQHPbfn0g40ksKY32YiZaIPBYx', '/items/led-drawing-board-drawing-book.jpg']
    },
    dimensions: "Board: 20 × 20 cm · USB Powered or Battery Compatible",
    careInstructions: "মুছার সময় সামান্য পানি স্প্রে করে মাইক্রোফাইবার কাপড় দিয়ে আলতোভাবে মুছুন।",
    safetyNotes: "লো-ভোল্টেজ নিরাপদ এলইডি আলো, স্ক্রিন গরম হয় না।",
    inStock: true
  },
  {
    id: 'vegetable-cutter-wooden-set',
    name: "Vegetable Cutter",
    subtitle: "Montessori Wooden Kitchen Cutting Vegetables & Lacing Play Set",
    price: 400,
    originalPrice: 550,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–4',
    ageGroup: '1–2Y',
    category: 'Pretend play',
    interests: ["Pretending"],
    benefits: ["Fine motor","Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Montessori Wooden Kitchen Cutting Vegetables & Lacing Play Set",
    description: "শিশুদের প্রিয় ভেজিটেবল কাটার খেলনা সেট! কাঠের তৈরি গাজর, টমেটো, বেগুন ইত্যাদি সবজির টুকরোগুলো ভেলক্রো দিয়ে জোড়া লাগানো থাকে। কাঠের নিরাপদ ছুরি দিয়ে কাটার সময় চমৎকার খচখচ শব্দ হয়, যা বাচ্চাদের রান্না খেলার আনন্দ বাড়িয়ে দেয়। সাথে সবজিগুলো সুতায় গেঁথে লেইসিং প্র্যাকটিস করার সুবিধাও রয়েছে।",
    sensoryQuote: "“Montessori Wooden Kitchen Cutting Vegetables & Lacing Play Set designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Pincer grasp strength",
            "description": "Hands-on activity specifically designed to calibrate and strengthen pincer grasp strength."
      },
      {
            "title": "Vegetable recognition",
            "description": "Hands-on activity specifically designed to calibrate and strengthen vegetable recognition."
      },
      {
            "title": "Hand dexterity",
            "description": "Hands-on activity specifically designed to calibrate and strengthen hand dexterity."
      }
],
    whatsInside: [
      {
            "name": "Sliceable Wooden Vegetables",
            "count": "1 set",
            "detail": "Brightly painted wooden vegetable pairs connected with hook-and-loop"
      },
      {
            "name": "Safe Rounded Wooden Knife",
            "count": "1 pc",
            "detail": "Blunt rounded edge wooden play slicer"
      },
      {
            "name": "Threading Lacing String",
            "count": "1 pc",
            "detail": "Smooth wooden tipped cord for threading coordination"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/13Btx5HiE6_6lGLvyfYLetSJpVcy3D2Kl',
      secondary: '/items/vegetable-cutter-wooden-set.jpg',
      detail: 'https://lh3.googleusercontent.com/d/13Btx5HiE6_6lGLvyfYLetSJpVcy3D2Kl',
      gallery: ['https://lh3.googleusercontent.com/d/13Btx5HiE6_6lGLvyfYLetSJpVcy3D2Kl', '/items/vegetable-cutter-wooden-set.jpg']
    },
    dimensions: "18 × 15 × 5 cm · Weight: 280g",
    careInstructions: "ভেজা কাপড় দিয়ে হালকা মুছে শুকিয়ে নিন। সাবান পানিতে ধোবেন না।",
    safetyNotes: "সম্পূর্ণ ধারহীন নিরাপদ কাঠের তৈরি এবং পরিবেশবান্ধব নিরাপদ রং ব্যবহৃত।",
    inStock: true
  },
  {
    id: 'multifunctional-educational-board',
    name: "Multifunctional Educational Board",
    subtitle: "All-in-One Bangla Alphabet, Numbers, Shapes & Ring Sorting Board",
    tag: 'BESTSELLER',
    price: 999,
    originalPrice: 1350,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–6',
    ageGroup: '1–2Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Fine motor"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "All-in-One Bangla Alphabet, Numbers, Shapes & Ring Sorting Board",
    description: "এক বোর্ডেই বাংলা বর্ণমালা (স্বরবর্ণ ও ব্যঞ্জনবর্ণ), সংখ্যা, জ্যামিতিক শেপ এবং রঙিন রিং সাজানোর অনন্য কাঠের বোর্ড। প্রতিটি অক্ষরের নিজস্ব স্লট রয়েছে, যেখানে ব্লকগুলো ম্যাচিং করে বসাতে হয়। কাউন্টিং রিংগুলোর মাধ্যমে সংখ্যা গণনার বাস্তব ধারণা তৈরি হয়।",
    sensoryQuote: "“All-in-One Bangla Alphabet, Numbers, Shapes & Ring Sorting Board designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Bangla alphabet mastery",
            "description": "Hands-on activity specifically designed to calibrate and strengthen bangla alphabet mastery."
      },
      {
            "title": "Number counting rings",
            "description": "Hands-on activity specifically designed to calibrate and strengthen number counting rings."
      },
      {
            "title": "Color sorting",
            "description": "Hands-on activity specifically designed to calibrate and strengthen color sorting."
      }
],
    whatsInside: [
      {
            "name": "Multifunctional Wooden Base Board",
            "count": "1 pc",
            "detail": "Sturdy pre-slotted puzzle and peg board"
      },
      {
            "name": "Bangla Alphabet & Number Blocks",
            "count": "1 set",
            "detail": "Thick, easy-to-grab wooden cutouts"
      },
      {
            "name": "Colored Counting Rings & Shapes",
            "count": "1 set",
            "detail": "Vibrant stacking rings for math and stacking"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1_mU6krqVn0z17ZWRiQA7s3qzZrnE1FG-',
      secondary: '/items/multifunctional-educational-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1_mU6krqVn0z17ZWRiQA7s3qzZrnE1FG-',
      gallery: ['https://lh3.googleusercontent.com/d/1_mU6krqVn0z17ZWRiQA7s3qzZrnE1FG-', '/items/multifunctional-educational-board.jpg']
    },
    dimensions: "45 × 18 × 6 cm · Weight: 750g",
    careInstructions: "শুকনো সুতি কাপড় দিয়ে পরিষ্কার রাখুন।",
    safetyNotes: "কোণাগুলো নিখুঁতভাবে রাউন্ড করা এবং রঙ পানিতে গলে না।",
    inStock: true
  },
  {
    id: 'kids-sticky-dart-board',
    name: "Kids Sticky Dart Board",
    subtitle: "Safe Indoor Soft Fabric Target Board with Hook-and-Loop Sticky Balls",
    price: 400,
    originalPrice: 580,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–8',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Fine motor","Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Safe Indoor Soft Fabric Target Board with Hook-and-Loop Sticky Balls",
    description: "ঘরে বসেই নিরাপদে ডার্ট খেলার আনন্দ! বাচ্চাদের জন্য বিশেষভাবে তৈরি এই স্টিকি ডার্ট বোর্ডে কোনো ধারালো পিন নেই; রয়েছে নরম ভেলক্রো লাগানো রঙিন বল, যা ছুড়ে মারলেই বোর্ডে আটকে যায়। পয়েন্ট টার্গেট করে বল নিক্ষেপের মাধ্যমে চোখের সাথে হাতের নিশানা এবং শারীরিক মুভমেন্টের দারুণ চর্চা হয়।",
    sensoryQuote: "“Safe Indoor Soft Fabric Target Board with Hook-and-Loop Sticky Balls designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Hand-eye coordination",
            "description": "Hands-on activity specifically designed to calibrate and strengthen hand-eye coordination."
      },
      {
            "title": "Gross motor skills",
            "description": "Hands-on activity specifically designed to calibrate and strengthen gross motor skills."
      },
      {
            "title": "Focus & Patience",
            "description": "Hands-on activity specifically designed to calibrate and strengthen focus & patience."
      }
],
    whatsInside: [
      {
            "name": "Large Printed Fabric Target Board",
            "count": "1 pc",
            "detail": "Vibrant numbered score target with hanging loop"
      },
      {
            "name": "Sticky Grip Target Balls",
            "count": "6 pcs",
            "detail": "Lightweight plastic balls with heavy-duty hook tape"
      },
      {
            "name": "Self-Adhesive Wall Mounting Hook",
            "count": "1 pc",
            "detail": "Easy drill-free wall mounting hanger"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1-Q0K2yOZLUFcdvK1PrAO3I4_r3s8_SAk',
      secondary: '/items/kids-sticky-dart-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1-Q0K2yOZLUFcdvK1PrAO3I4_r3s8_SAk',
      gallery: ['https://lh3.googleusercontent.com/d/1-Q0K2yOZLUFcdvK1PrAO3I4_r3s8_SAk', '/items/kids-sticky-dart-board.jpg']
    },
    dimensions: "Target Board: 36 × 36 cm",
    careInstructions: "ময়লা হলে বোর্ডে হালকাভাবে ব্রাশ করুন। বলগুলো পরিষ্কার রাখুন।",
    safetyNotes: "কোনো সুঁচালো অংশ নেই। শিশুদের জন্য শতভাগ নিরাপদ ও ইনজুরি-মুক্ত।",
    inStock: true
  },
  {
    id: 'fidget-spinning-ball',
    name: "Fidget Spinning Ball",
    subtitle: "Tactile Rotating Kinetic Orb for Sensory Calming & Focus",
    price: 220,
    originalPrice: 320,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3+',
    ageGroup: '3–5Y',
    category: 'Sensory',
    interests: ["Exploring"],
    benefits: ["Focus","Sensory discovery"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Tactile Rotating Kinetic Orb for Sensory Calming & Focus",
    description: "হাতে ঘুরিয়ে খেলার ছোট্ট একটি ম্যাজিকাল ফিজেট টয়। মসৃণ গতির এই স্পিনিং বলটি আঙুলের ডগায় অনায়াসে ঘোরে, যা অস্থিরতা কমাতে এবং মনোযোগ বৃদ্ধিতে সহায়তা করে। ছোট সাইজ হওয়ায় স্কুল ব্যাগ কিংবা পকেটে নিয়ে যেকোনো জায়গায় সহজেই সাথে রাখা যায়।",
    sensoryQuote: "“Tactile Rotating Kinetic Orb for Sensory Calming & Focus designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Stress reduction",
            "description": "Hands-on activity specifically designed to calibrate and strengthen stress reduction."
      },
      {
            "title": "Deep focus",
            "description": "Hands-on activity specifically designed to calibrate and strengthen deep focus."
      },
      {
            "title": "Finger flexibility",
            "description": "Hands-on activity specifically designed to calibrate and strengthen finger flexibility."
      }
],
    whatsInside: [
      {
            "name": "Kinetic Fidget Spinning Ball",
            "count": "1 pc",
            "detail": "Ergonomic smooth dual-axis rotation orb"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1kGjVSxDNs_vAkvZ363QNfgP93ZFZAOLO',
      secondary: '/items/fidget-spinning-ball.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1kGjVSxDNs_vAkvZ363QNfgP93ZFZAOLO',
      gallery: ['https://lh3.googleusercontent.com/d/1kGjVSxDNs_vAkvZ363QNfgP93ZFZAOLO', '/items/fidget-spinning-ball.jpg']
    },
    dimensions: "5 × 5 × 5 cm · Weight: 65g",
    careInstructions: "পানিতে নিমজ্জিত করবেন না। নরম শুকনো কাপড়ে পরিষ্কার করুন।",
    safetyNotes: "মসৃণ সারফেস, কোনো ধারালো প্রান্ত নেই।",
    inStock: true
  },
  {
    id: 'finger-arithmetic-board',
    name: "Finger Arithmetic Board",
    subtitle: "Montessori Felt & Wood Hands-on Finger Counting Math Board",
    tag: 'NEW',
    price: 850,
    originalPrice: 1150,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–7',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Spatial thinking","Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Montessori Felt & Wood Hands-on Finger Counting Math Board",
    description: "আঙুল গুনে গণিত শেখার চিরন্তন পদ্ধতিকে আধুনিক রূপ দেওয়া হয়েছে Finger Arithmetic Board-এ। বোর্ডে থাকা নরম কাপড়ের আঙুলগুলো ভাঁজ করে ১ থেকে ১০ পর্যন্ত সংখ্যা গণনা এবং সহজে যোগ-বিয়োগ হাতে-কলমে প্র্যাকটিস করা যায়। শিশুদের কাছে গণিতকে ভয়ের বদলে মজার খেলায় পরিণত করে।",
    sensoryQuote: "“Montessori Felt & Wood Hands-on Finger Counting Math Board designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Mathematical thinking",
            "description": "Hands-on activity specifically designed to calibrate and strengthen mathematical thinking."
      },
      {
            "title": "Addition & Subtraction",
            "description": "Hands-on activity specifically designed to calibrate and strengthen addition & subtraction."
      },
      {
            "title": "Finger counting visualization",
            "description": "Hands-on activity specifically designed to calibrate and strengthen finger counting visualization."
      }
],
    whatsInside: [
      {
            "name": "Montessori Finger Counting Board",
            "count": "1 pc",
            "detail": "Felt board base with 10 foldable movable fingers"
      },
      {
            "name": "Number and Math Operator Tiles",
            "count": "1 set",
            "detail": "Numbers 0–10 plus +, -, = operator cards"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1SRo7HwSdcM_P0zzSAqHPec8lEPjXgBVO',
      secondary: '/items/finger-arithmetic-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1SRo7HwSdcM_P0zzSAqHPec8lEPjXgBVO',
      gallery: ['https://lh3.googleusercontent.com/d/1SRo7HwSdcM_P0zzSAqHPec8lEPjXgBVO', '/items/finger-arithmetic-board.jpg']
    },
    dimensions: "30 × 30 cm · Weight: 260g",
    careInstructions: "ধুলোবালি পড়লে ব্রাশ দিয়ে ঝেড়ে ফেলুন। পানিতে ভেজাবেন না।",
    safetyNotes: "নরম ফ্যাব্রিক উপাদান, শিশুদের ত্বকের জন্য পুরোপুরি নিরাপদ ও কোমল।",
    inStock: true
  },
  {
    id: '6-in-1-logic-board',
    name: "6 in 1 Logic Board",
    subtitle: "Multi-Challenge Geometric Sorting & Number Logic Wooden Board",
    tag: 'BESTSELLER',
    price: 750,
    originalPrice: 1050,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–5',
    ageGroup: '1–2Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Spatial thinking"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Multi-Challenge Geometric Sorting & Number Logic Wooden Board",
    description: "এক বোর্ডেই ৬ ধরনের আকর্ষণীয় বুদ্ধিবৃত্তিক খেলা! শেপ ম্যাচিং, কালার সর্টিং, কাউন্টিং স্ট্যাকিং, রিং সর্টার ও মেমোরি পাজল। শিশুদের মস্তিষ্ককে সক্রিয় রাখতে এবং লজিক্যাল রিজনিং ক্ষমতা গড়ে তুলতে ৬-ইন-১ লজিক বোর্ড অত্যন্ত সমাদৃত একটি খেলনা।",
    sensoryQuote: "“Multi-Challenge Geometric Sorting & Number Logic Wooden Board designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Logical reasoning",
            "description": "Hands-on activity specifically designed to calibrate and strengthen logical reasoning."
      },
      {
            "title": "Geometric classification",
            "description": "Hands-on activity specifically designed to calibrate and strengthen geometric classification."
      },
      {
            "title": "Early arithmetic",
            "description": "Hands-on activity specifically designed to calibrate and strengthen early arithmetic."
      }
],
    whatsInside: [
      {
            "name": "Multi-Track Wooden Logic Board",
            "count": "1 pc",
            "detail": "Heavy natural wood base with slots and stacking pillars"
      },
      {
            "name": "Colored Wooden Geometric Blocks",
            "count": "1 set",
            "detail": "Circles, triangles, squares, pentagons with center holes"
      },
      {
            "name": "Stacking Rings and Counter Tiles",
            "count": "1 set",
            "detail": "Color-graduated stacking rings"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1AOuCvTpEMZIBgszJEdMn2fzW3eNKjryj',
      secondary: '/items/6-in-1-logic-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1AOuCvTpEMZIBgszJEdMn2fzW3eNKjryj',
      gallery: ['https://lh3.googleusercontent.com/d/1AOuCvTpEMZIBgszJEdMn2fzW3eNKjryj', '/items/6-in-1-logic-board.jpg']
    },
    dimensions: "38 × 15 × 7 cm · Weight: 600g",
    careInstructions: "শুকনো সুতি কাপড় দিয়ে মুছে রাখুন।",
    safetyNotes: "মসৃণ পলিশড কাঠ, নন-টক্সিক ওয়াটার কালার দিয়ে ফিনিশিং দেওয়া।",
    inStock: true
  },
  {
    id: 'fishing-lacing-board',
    name: "Fishing Lacing Board",
    subtitle: "2-in-1 Magnetic Wooden Fish Catcher & Precision Lacing Puzzle",
    price: 750,
    originalPrice: 1000,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–5',
    ageGroup: '1–2Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Gift"],
    valueStatement: "2-in-1 Magnetic Wooden Fish Catcher & Precision Lacing Puzzle",
    description: "ম্যাগনেটিক ফিশিং ও লেইসিং বোর্ডের দ্বিগুণ মজা! ম্যাগনেটিক বড়শি দিয়ে পুকুর থেকে মাছ ধরা এবং সেই মাছগুলোর ফুটো দিয়ে সুতা পরিয়ে মালা গাঁথা—দুটোই করা যায় এই খেলনায়। শিশুদের ধৈর্য বাড়ানো এবং হাতের আঙুল নিয়ন্ত্রণের জন্য এটি খুবই চমৎকার একটি সেট।",
    sensoryQuote: "“2-in-1 Magnetic Wooden Fish Catcher & Precision Lacing Puzzle designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Magnetic target precision",
            "description": "Hands-on activity specifically designed to calibrate and strengthen magnetic target precision."
      },
      {
            "title": "Hand dexterity",
            "description": "Hands-on activity specifically designed to calibrate and strengthen hand dexterity."
      },
      {
            "title": "Patience & Focus",
            "description": "Hands-on activity specifically designed to calibrate and strengthen patience & focus."
      }
],
    whatsInside: [
      {
            "name": "Ocean Illustrated Wooden Board",
            "count": "1 pc",
            "detail": "Deep cut-out slots for sea creatures"
      },
      {
            "name": "Magnetic Sea Creature Figures",
            "count": "10+ pcs",
            "detail": "Wooden fish, crabs and marine friends with metal rivets"
      },
      {
            "name": "Magnetic Wooden Fishing Rod",
            "count": "1 pc",
            "detail": "Smooth wooden rod with safe magnetic bobber"
      },
      {
            "name": "Lacing Threader Cord",
            "count": "1 pc",
            "detail": "Safe wooden threader needle with attached lace"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1qqSP9PKwY3jQ7y01JyVN0Oc7N44oB8_D',
      secondary: '/items/fishing-lacing-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1qqSP9PKwY3jQ7y01JyVN0Oc7N44oB8_D',
      gallery: ['https://lh3.googleusercontent.com/d/1qqSP9PKwY3jQ7y01JyVN0Oc7N44oB8_D', '/items/fishing-lacing-board.jpg']
    },
    dimensions: "30 × 22 × 2 cm · Weight: 420g",
    careInstructions: "শুকনো কাপড়ে মুছে সংরক্ষণ করুন। পানির সংস্পর্শ থেকে দূরে রাখুন।",
    safetyNotes: "ম্যাগনেটগুলো কাঠের ভেতরে শক্তভাবে আটকানো, খুলে আসার কোনো ঝুঁকি নেই।",
    inStock: true
  },
  {
    id: 'talking-flash-card-device',
    name: "Talking Flash Card",
    subtitle: "Interactive Speech & Pronunciation Card Reader with 224+ Audio Sight Words",
    tag: 'BESTSELLER',
    price: 850,
    originalPrice: 1190,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–5',
    ageGroup: '1–2Y',
    category: 'Books & Storytelling',
    interests: ["Reading"],
    benefits: ["Fine motor","Focus"],
    materials: ["FSC beechwood","Organic cotton"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Interactive Speech & Pronunciation Card Reader with 224+ Audio Sight Words",
    description: "কথা বলা ফ্ল্যাশ কার্ড রিডার! ডিভাইসে যেকোনো কার্ড ইনসার্ট করলেই মিষ্টি কণ্ঠে স্পষ্ট উচ্চারণে শব্দটি পড়ে শোনায় এবং সাথে বাস্তবসম্মত সাউন্ড ইফেক্ট দেয় (যেমন: বিড়ালের কার্ডে মিউ মিউ শব্দ)। পশু-পাখি, যানবাহন, খাবার, ফলমূলসহ শত শত কার্ড রয়েছে। শিশুদের দ্রুত কথা শেখা ও উচ্চারণ সংশোধনে অত্যন্ত জনপ্রিয়।",
    sensoryQuote: "“Interactive Speech & Pronunciation Card Reader with 224+ Audio Sight Words designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Clear pronunciation",
            "description": "Hands-on activity specifically designed to calibrate and strengthen clear pronunciation."
      },
      {
            "title": "Auditory comprehension",
            "description": "Hands-on activity specifically designed to calibrate and strengthen auditory comprehension."
      },
      {
            "title": "Vocabulary expansion",
            "description": "Hands-on activity specifically designed to calibrate and strengthen vocabulary expansion."
      }
],
    whatsInside: [
      {
            "name": "Smart Audio Card Reader Device",
            "count": "1 pc",
            "detail": "Compact cat-ear reader with repeat & volume buttons"
      },
      {
            "name": "Double-Sided Sight Word Flash Cards",
            "count": "112 pcs (224 words)",
            "detail": "Categories: Animals, Vehicles, Food, Daily items & more"
      },
      {
            "name": "USB Type-C Charging Cable",
            "count": "1 pc",
            "detail": "Fast safe charging cord"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1fDzo85buinvg61dL9XKPTSMk0AlasfIj',
      secondary: '/items/talking-flash-card-device.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1fDzo85buinvg61dL9XKPTSMk0AlasfIj',
      gallery: ['https://lh3.googleusercontent.com/d/1fDzo85buinvg61dL9XKPTSMk0AlasfIj', '/items/talking-flash-card-device.jpg']
    },
    dimensions: "Reader: 10.5 × 9 × 2 cm · Cards: 9 × 6 cm",
    careInstructions: "সরাসরি পানি বা ধুলো থেকে দূরে রাখুন। ব্যবহারের পর সুইচ অফ করে রাখুন।",
    safetyNotes: "স্ক্রিনলেস ডিজাইন—শিশুদের চোখের কোনো ক্ষতি হয় না। ইউএসবি রিচার্জেবল ও নিরাপদ।",
    inStock: true
  },
  {
    id: 'magnetic-color-classification-board',
    name: "Magnetic Color Classification Board",
    subtitle: "Montessori Magnetic Pen Color & Number Maze Sorting Board",
    tag: 'NEW',
    price: 600,
    originalPrice: 850,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 2–6',
    ageGroup: '1–2Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Montessori Magnetic Pen Color & Number Maze Sorting Board",
    description: "ম্যাগনেটিক পেন দিয়ে বিড সরিয়ে রঙ ও সংখ্যা মেলানোর দারুণ অ্যাক্টিভিটি! অ্যাক্রিলিক গ্লাসের নিচে সিল করা রঙিন পুঁতিগুলোকে ম্যাগনেটিক কলম দিয়ে নির্দিষ্ট রঙের কাপে বা নম্বরে নিয়ে যেতে হয়। পুঁতিগুলো কাঁচের ভেতরে বন্ধ থাকায় হারিয়ে যাওয়ার বা মুখে দেওয়ার কোনো ভয় নেই। এটি পেনসিল ধরার শক্তি বাড়াতে অনন্য।",
    sensoryQuote: "“Montessori Magnetic Pen Color & Number Maze Sorting Board designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Pencil grip mastery",
            "description": "Hands-on activity specifically designed to calibrate and strengthen pencil grip mastery."
      },
      {
            "title": "Color classification",
            "description": "Hands-on activity specifically designed to calibrate and strengthen color classification."
      },
      {
            "title": "Number counting",
            "description": "Hands-on activity specifically designed to calibrate and strengthen number counting."
      }
],
    whatsInside: [
      {
            "name": "Enclosed Magnetic Wooden Maze Board",
            "count": "1 pc",
            "detail": "Shatterproof sealed acrylic face with maze tracks and sorting wells"
      },
      {
            "name": "Attached Magnetic Wand Stylus",
            "count": "1 pc",
            "detail": "Cord-attached magnetic pen stored in dedicated slot"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1ki1pIzdpp9xoU_IDzh1GGG_NG7shc88E',
      secondary: '/items/magnetic-color-classification-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1ki1pIzdpp9xoU_IDzh1GGG_NG7shc88E',
      gallery: ['https://lh3.googleusercontent.com/d/1ki1pIzdpp9xoU_IDzh1GGG_NG7shc88E', '/items/magnetic-color-classification-board.jpg']
    },
    dimensions: "29.5 × 22 × 1.5 cm · Weight: 550g",
    careInstructions: "অ্যাক্রিলিক প্যানেল কাঁচের ক্লিনার বা নরম কাপড় দিয়ে আলতোভাবে মুছুন।",
    safetyNotes: "সব পুঁতি অ্যাক্রিলিক প্যানেলের নিচে সম্পূর্ণ সিল করা। ছোট বাচ্চার মুখে দেওয়ার কোনো সুযোগ নেই।",
    inStock: true
  },
  {
    id: 'magnetic-stick-blocks-36pcs',
    name: "Magnetic Stick Blocks — ৩৬ পিস",
    subtitle: "36-Piece 3D Magnetic Rods & Metal Balls Architectural Construction Set",
    tag: 'BESTSELLER',
    price: 900,
    originalPrice: 1250,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–8',
    ageGroup: '3–5Y',
    category: 'Building sets',
    interests: ["Building"],
    benefits: ["Spatial thinking","Creativity","Fine motor"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "36-Piece 3D Magnetic Rods & Metal Balls Architectural Construction Set",
    description: "৩৬ পিসের ম্যাগনেটিক স্টিক ও বলের এই সেটটি দিয়ে বাচ্চারা নিজেদের কল্পনামতো বাড়ি, টাওয়ার, গাড়ি, জ্যামিতিক শেপ বা থ্রিডি ভাস্কর্য তৈরি করতে পারে। শক্তিশালী চুম্বক থাকায় টুকরোগুলো সহজে শক্ত হয়ে জুড়ে থাকে। শিশুদের মধ্যে স্থাপত্যবিদ্যা ও সৃজনশীল চিন্তাভাবনা বিকাশে এটি আদর্শ।",
    sensoryQuote: "“36-Piece 3D Magnetic Rods & Metal Balls Architectural Construction Set designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "3D spatial intelligence",
            "description": "Hands-on activity specifically designed to calibrate and strengthen 3d spatial intelligence."
      },
      {
            "title": "Geometry principles",
            "description": "Hands-on activity specifically designed to calibrate and strengthen geometry principles."
      },
      {
            "title": "Creative engineering",
            "description": "Hands-on activity specifically designed to calibrate and strengthen creative engineering."
      }
],
    whatsInside: [
      {
            "name": "Magnetic Sticks (Rods)",
            "count": "24 pcs",
            "detail": "Vibrant non-toxic plastic encased magnetic rods"
      },
      {
            "name": "Steel Connector Spheres",
            "count": "12 pcs",
            "detail": "Smooth nickel-free steel connection balls"
      },
      {
            "name": "Idea & Building Model Guide",
            "count": "1 pc",
            "detail": "Step-by-step visual creation booklet"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1gg9pFYU5t3h47YTePbDClyDLsPWfvy9x',
      secondary: '/items/magnetic-stick-blocks-36pcs.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1gg9pFYU5t3h47YTePbDClyDLsPWfvy9x',
      gallery: ['https://lh3.googleusercontent.com/d/1gg9pFYU5t3h47YTePbDClyDLsPWfvy9x', '/items/magnetic-stick-blocks-36pcs.jpg']
    },
    dimensions: "Rods: 5.8 cm · Spheres: 1.2 cm · Box: 24 × 18 × 4 cm",
    careInstructions: "চৌম্বকীয় অংশগুলো শুকনো কাপড় দিয়ে মুছে রাখুন। অতিরিক্ত তাপে রাখবেন না।",
    safetyNotes: "আল্ট্রাসনিক ওয়েল্ডিং পদ্ধতিতে তৈরি, চুম্বক বের হয়ে আসার কোনো সম্ভাবনা নেই।",
    inStock: true
  },
  {
    id: 'mini-bead-maze-wooden',
    name: "Mini Bead Maze",
    subtitle: "Classic Wooden Wire Roller Coaster Bead Maze for Toddlers",
    price: 280,
    originalPrice: 390,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–3',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ["Exploring"],
    benefits: ["Fine motor"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play"],
    valueStatement: "Classic Wooden Wire Roller Coaster Bead Maze for Toddlers",
    description: "ছোটদের হাতের নিয়ন্ত্রণ ও রঙ চেনার জন্য ক্লাসিক মিনি উডেন বিড মেজ। প্যাঁচানো তারের ট্র্যাকে বিভিন্ন রঙের কাঠের পুঁতি আঙুল দিয়ে টেনে টেনে এক প্রান্ত থেকে অন্য প্রান্তে নেওয়া যায়। এটি শিশুদের আঙুলের পেশী মজবুত করে এবং চোখ ও হাতের সমন্বয় বাড়ায়।",
    sensoryQuote: "“Classic Wooden Wire Roller Coaster Bead Maze for Toddlers designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Fine motor control",
            "description": "Hands-on activity specifically designed to calibrate and strengthen fine motor control."
      },
      {
            "title": "Color recognition",
            "description": "Hands-on activity specifically designed to calibrate and strengthen color recognition."
      },
      {
            "title": "Pincer grasp",
            "description": "Hands-on activity specifically designed to calibrate and strengthen pincer grasp."
      }
],
    whatsInside: [
      {
            "name": "Wooden Mini Bead Maze Coaster",
            "count": "1 pc",
            "detail": "Solid smoothed wooden base with double curved metal loop tracks and colorful beads"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1BT-yb2udUNIBxtPQCS7qa9W8hnVp8pb2',
      secondary: '/items/mini-bead-maze-wooden.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1BT-yb2udUNIBxtPQCS7qa9W8hnVp8pb2',
      gallery: ['https://lh3.googleusercontent.com/d/1BT-yb2udUNIBxtPQCS7qa9W8hnVp8pb2', '/items/mini-bead-maze-wooden.jpg']
    },
    dimensions: "12 × 9 × 9 cm · Weight: 180g",
    careInstructions: "শুকনো সুতি কাপড় দিয়ে পরিষ্কার রাখুন।",
    safetyNotes: "বিডগুলো তারের ভেতরে শক্তভাবে লক করা, কোনোভাবেই খুলে আসবে না। ১০০% নিরাপদ।",
    inStock: true
  },
  {
    id: 'alphabet-pin-board',
    name: "Alphabet Pin Board",
    subtitle: "Mushroom Nail Alphabet & Number Mosaic Pegboard Puzzle Set",
    price: 329,
    originalPrice: 480,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–6',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Fine motor","Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Mushroom Nail Alphabet & Number Mosaic Pegboard Puzzle Set",
    description: "রঙিন মাশরুম পিন দিয়ে বোর্ডের ফুটোয় বসিয়ে বসিয়ে ইংরেজি Alphabet (ABC) এবং সংখ্যা (123) সাজানোর দারুণ খেলা। পিনগুলো আঙুলের ডগায় ধরে বোর্ডে ঢোকাতে হয়, যা পেনসিল ধরার জন্য প্রয়োজনীয় হাতের গ্রিপ দারুণভাবে পোক্ত করে। সাথে বিভিন্ন প্যাটার্ন ও ছবি বানানোর সুযোগও থাকে।",
    sensoryQuote: "“Mushroom Nail Alphabet & Number Mosaic Pegboard Puzzle Set designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Finger grip strength",
            "description": "Hands-on activity specifically designed to calibrate and strengthen finger grip strength."
      },
      {
            "title": "Alphabet & Number familiarity",
            "description": "Hands-on activity specifically designed to calibrate and strengthen alphabet & number familiarity."
      },
      {
            "title": "Pattern replication",
            "description": "Hands-on activity specifically designed to calibrate and strengthen pattern replication."
      }
],
    whatsInside: [
      {
            "name": "Perforated Pegboard Base",
            "count": "1 pc",
            "detail": "Sturdy grid board with storage compartment"
      },
      {
            "name": "Colorful Mushroom Nails & Letter Pins",
            "count": "1 set",
            "detail": "Multi-color easy-grip inserting pins"
      },
      {
            "name": "Alphabet & Pattern Cards",
            "count": "1 set",
            "detail": "Visual guides to copy letters and creative shapes"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1wYvwdzlPrz2Fkulqr1XUVjmA5Qxb8oU3',
      secondary: '/items/alphabet-pin-board.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1wYvwdzlPrz2Fkulqr1XUVjmA5Qxb8oU3',
      gallery: ['https://lh3.googleusercontent.com/d/1wYvwdzlPrz2Fkulqr1XUVjmA5Qxb8oU3', '/items/alphabet-pin-board.jpg']
    },
    dimensions: "22 × 18 × 4 cm · Weight: 230g",
    careInstructions: "পিনগুলো ব্যবহারের পর স্টোরেজ বক্সে গুছিয়ে রাখুন।",
    safetyNotes: "গোলাকার মসৃণ পিন হেড। ৩ বছরের বেশি বয়সের বাচ্চাদের জন্য উপযুক্ত।",
    inStock: true
  },
  {
    id: 'kids-punching-bag-set',
    name: "Kids Punching Bag",
    subtitle: "Freestanding Indoor Inflatable Sports Fitness Punching Column",
    price: 550,
    originalPrice: 750,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–10',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Fine motor","Balance"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Freestanding Indoor Inflatable Sports Fitness Punching Column",
    description: "ঘরে বসেই সোনামনির অফুরন্ত এনার্জি কাজে লাগানোর সেরা ফিটনেস খেলনা! পাঞ্চ বা কিক করলে সাথে সাথে এটি আবার সোজা হয়ে দাঁড়িয়ে যায়। নিচে পানি বা বালু ভরে ভারী করা হয় এবং ওপরে বাতাস ভরা থাকে। ঘরের ভেতরে নিরাপদে শারীরিক ব্যায়াম ও খেলাধুলার চমৎকার একটি সুযোগ তৈরি করে।",
    sensoryQuote: "“Freestanding Indoor Inflatable Sports Fitness Punching Column designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Gross motor energy release",
            "description": "Hands-on activity specifically designed to calibrate and strengthen gross motor energy release."
      },
      {
            "title": "Balance & Agility",
            "description": "Hands-on activity specifically designed to calibrate and strengthen balance & agility."
      },
      {
            "title": "Stress reduction",
            "description": "Hands-on activity specifically designed to calibrate and strengthen stress reduction."
      }
],
    whatsInside: [
      {
            "name": "Inflatable Heavy-Duty Punching Column",
            "count": "1 pc",
            "detail": "Bounce-back design with stable weighted bottom chamber"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1LqsVOIDcCEH8zpAJ0BHAG-of7kPE0nPU',
      secondary: '/items/kids-punching-bag-set.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1LqsVOIDcCEH8zpAJ0BHAG-of7kPE0nPU',
      gallery: ['https://lh3.googleusercontent.com/d/1LqsVOIDcCEH8zpAJ0BHAG-of7kPE0nPU', '/items/kids-punching-bag-set.jpg']
    },
    dimensions: "Height: 120 cm (Inflated) · Base Diameter: 40 cm",
    careInstructions: "ধারালো কোনো জিনিসের কাছে রাখবেন না। নরম ভেজা কাপড়ে পরিষ্কার করুন।",
    safetyNotes: "নরম বাতাসের কুশন থাকায় বাচ্চার হাত বা পায়ে কোনো চোট লাগার ঝুঁকি নেই।",
    inStock: true
  },
  {
    id: 'wooden-memory-chess-game',
    name: "Wooden Memory Chess Game",
    subtitle: "Montessori Color Matching Memory Chess Strategy Game for Families",
    price: 450,
    originalPrice: 650,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 3–8',
    ageGroup: '3–5Y',
    category: 'Open-ended play',
    interests: ["Exploring","Creating"],
    benefits: ["Focus"],
    materials: ["FSC beechwood"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Montessori Color Matching Memory Chess Strategy Game for Families",
    description: "স্মরণশক্তি ও মনোযোগ বাড়ানোর অত্যন্ত জনপ্রিয় বোর্ড গেম! কাঠের বোর্ডে থাকা গুটিগুলোর নিচে বিভিন্ন রঙ লুকানো থাকে। ডাইস ঘুরিয়ে যে রঙ উঠবে, বোর্ডে সেই রঙের গুটিটি মনে রেখে খুঁজে বের করতে হয়। যার স্মরণশক্তি যত ভালো, সে তত বেশি গুটি সংগ্রহ করে বিজয়ী হতে পারে। পুরো পরিবারের সাথে খেলার মতো চমৎকার এক উপহার।",
    sensoryQuote: "“Montessori Color Matching Memory Chess Strategy Game for Families designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Short-term memory retention",
            "description": "Hands-on activity specifically designed to calibrate and strengthen short-term memory retention."
      },
      {
            "title": "Color matching",
            "description": "Hands-on activity specifically designed to calibrate and strengthen color matching."
      },
      {
            "title": "Focus & Attention",
            "description": "Hands-on activity specifically designed to calibrate and strengthen focus & attention."
      }
],
    whatsInside: [
      {
            "name": "Circular Wooden Board Base",
            "count": "1 pc",
            "detail": "Solid polished wood disc with 24 peg holes"
      },
      {
            "name": "Colored Wooden Chess Pegs",
            "count": "24 pcs",
            "detail": "6 vibrant colors hidden underneath peg stems"
      },
      {
            "name": "Color-Coded Wooden Dice",
            "count": "1 pc",
            "detail": "6-sided color die matching peg tips"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/19tvFTAwx5m1cRy4e4NdbmBDjJOiSwrEw',
      secondary: '/items/wooden-memory-chess-game.jpg',
      detail: 'https://lh3.googleusercontent.com/d/19tvFTAwx5m1cRy4e4NdbmBDjJOiSwrEw',
      gallery: ['https://lh3.googleusercontent.com/d/19tvFTAwx5m1cRy4e4NdbmBDjJOiSwrEw', '/items/wooden-memory-chess-game.jpg']
    },
    dimensions: "17.5 × 17.5 × 5.5 cm · Weight: 350g",
    careInstructions: "শুকনো সুতি কাপড়ে মুছে রাখুন। সব গুটি বোর্ডে সাজিয়ে সংরক্ষণ করুন।",
    safetyNotes: "১০০% পরিবেশবান্ধব কাঠ এবং মসৃণ গোলাকার ফিনিশিং। বিষাক্ত রাসায়নিক মুক্ত।",
    inStock: true
  },
  {
    id: 'space-busy-book',
    name: "Space Busy Book",
    subtitle: "Cosmic Journey Felt Montessori Sensory Busy Book with Daily Life Skills",
    tag: 'BESTSELLER',
    price: 999,
    originalPrice: 1350,
    rating: 4.9,
    reviewCount: 65,
    ageBadge: 'AGE 1–5',
    ageGroup: '1–2Y',
    category: 'Sensory',
    interests: ["Exploring"],
    benefits: ["Sensory discovery"],
    materials: ["FSC beechwood","Plant-based silicone"],
    occasions: ["Everyday play","Birthday","Gift"],
    valueStatement: "Cosmic Journey Felt Montessori Sensory Busy Book with Daily Life Skills",
    description: "মহাকাশের রোমাঞ্চকর থিমে তৈরি স্পেস বিজি বুক! জিপার খোলা-বন্ধ করা, বোতাম লাগানো, বেল্ট বাঁধা এবং শু-লেস বাঁধার মতো বাস্তব জীবনের গুরুত্বপূর্ণ দক্ষতা শিশুরা খেলতে খেলতে এই বইটির মাধ্যমে শিখে ফেলে। সফট ফেল্ট কাপড়ে তৈরি এই বইটি ওজনে হালকা এবং সহজে বহনযোগ্য।",
    sensoryQuote: "“Cosmic Journey Felt Montessori Sensory Busy Book with Daily Life Skills designed for hands-on, screen-free learning.”",
    whyKidsLoveIt: "Children love the hands-on tactile engagement, interactive mechanical elements, and immediate sense of accomplishment.",
    developmentMilestones: [
      {
            "title": "Daily dressing skills (zipper, buttons, lacing)",
            "description": "Hands-on activity specifically designed to calibrate and strengthen daily dressing skills (zipper, buttons, lacing)."
      },
      {
            "title": "Sensory texture discovery",
            "description": "Hands-on activity specifically designed to calibrate and strengthen sensory texture discovery."
      },
      {
            "title": "Astronomy curiosity",
            "description": "Hands-on activity specifically designed to calibrate and strengthen astronomy curiosity."
      }
],
    whatsInside: [
      {
            "name": "Multi-Page Space Sensory Busy Book",
            "count": "1 pc",
            "detail": "Packed with interactive zippers, buckles, velcro planets & lacing modules"
      },
      {
            "name": "Portable Handle and Carrying Strap",
            "count": "1 set",
            "detail": "Easy toddler briefcase carry design"
      }
],
    images: {
      main: 'https://lh3.googleusercontent.com/d/1U7nJYdC-c4ciAOf4nq5ouxMIUvUzar6x',
      secondary: '/items/space-busy-book.jpg',
      detail: 'https://lh3.googleusercontent.com/d/1U7nJYdC-c4ciAOf4nq5ouxMIUvUzar6x',
      gallery: ['https://lh3.googleusercontent.com/d/1U7nJYdC-c4ciAOf4nq5ouxMIUvUzar6x', '/items/space-busy-book.jpg']
    },
    dimensions: "28 × 22 × 4 cm · Weight: 290g",
    careInstructions: "হালকা ময়লা হলে ভেজা ওয়াইপস বা হালকা সাবান পানি দিয়ে মুছে রোদে শুকিয়ে নিন।",
    safetyNotes: "সব বোতাম ও জিপার শক্তভাবে সেলাই করা। ছোট কোনো ঢিলেঢালা অংশ নেই।",
    inStock: true
  },
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

