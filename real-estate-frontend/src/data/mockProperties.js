export const CITIES = [
  { id: 'delhi-ncr', name: 'Delhi NCR', popular: true },
  { id: 'mumbai', name: 'Mumbai', popular: true },
  { id: 'bangalore', name: 'Bangalore', popular: true },
  { id: 'hyderabad', name: 'Hyderabad', popular: true },
  { id: 'pune', name: 'Pune', popular: true },
  { id: 'kolkata', name: 'Kolkata', popular: false },
  { id: 'chennai', name: 'Chennai', popular: false },
  { id: 'ahmedabad', name: 'Ahmedabad', popular: false },
];

export const PROPERTY_TYPES = [
  { id: 'all', label: 'All Property Types' },
  { id: 'apartment', label: 'Flat / Apartment' },
  { id: 'builder-floor', label: 'Builder Floor' },
  { id: 'villa', label: 'Independent House / Villa' },
  { id: 'plot', label: 'Residential Land / Plot' },
  { id: 'commercial', label: 'Commercial Space / Office' },
  { id: 'penthouse', label: 'Luxury Penthouse' },
];

export const BHK_OPTIONS = ['1 RK / 1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

export const BUDGET_RANGES = [
  { label: 'Any Budget', min: 0, max: 1000000000 },
  { label: 'Under ₹ 50 Lac', min: 0, max: 5000000 },
  { label: '₹ 50 Lac - ₹ 1 Cr', min: 5000000, max: 10000000 },
  { label: '₹ 1 Cr - ₹ 2 Cr', min: 10000000, max: 20000000 },
  { label: '₹ 2 Cr - ₹ 5 Cr', min: 20000000, max: 50000000 },
  { label: 'Above ₹ 5 Cr', min: 50000000, max: 1000000000 },
];

export const POSSESSION_OPTIONS = [
  'Ready to Move',
  'Under Construction',
  'Available Immediately',
  'Immediate Registry'
];

export const POSTED_BY_OPTIONS = [
  'Owner (Zero Brokerage)',
  'Verified Agent',
  'Developer / Builder'
];

export const FURNISHING_OPTIONS = [
  'Fully Furnished',
  'Semi-Furnished',
  'Unfurnished'
];

export const FACING_OPTIONS = [
  'East',
  'North-East',
  'North',
  'West'
];

export const AMENITIES_LIST = [
  'Swimming Pool',
  'Clubhouse & Spa',
  'Full Gym & Aerobics Room',
  '24x7 High-Tier Security',
  'Power Backup 100%',
  'EV Charging',
  'Landscaped Garden',
  'Covered Car Parking'
];

export const FEATURED_LOCALITIES = [
  {
    name: 'Golf Course Extension, Gurgaon',
    city: 'Delhi NCR',
    avgPrice: '₹ 14,200 / sq.ft',
    growth: '+12.4% YoY',
    propertiesCount: '1,420+ Listings',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Whitefield, Bangalore',
    city: 'Bangalore',
    avgPrice: '₹ 9,450 / sq.ft',
    growth: '+15.2% YoY',
    propertiesCount: '2,890+ Listings',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bandra West, Mumbai',
    city: 'Mumbai',
    avgPrice: '₹ 48,000 / sq.ft',
    growth: '+8.7% YoY',
    propertiesCount: '980+ Listings',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    avgPrice: '₹ 8,900 / sq.ft',
    growth: '+18.1% YoY',
    propertiesCount: '1,650+ Listings',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hinjewadi Phase 1, Pune',
    city: 'Pune',
    avgPrice: '₹ 7,600 / sq.ft',
    growth: '+10.5% YoY',
    propertiesCount: '1,210+ Listings',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  },
];

export const INITIAL_PROPERTIES = [
  {
    id: 'prop-1',
    title: '3 BHK Luxury High-Rise Apartment in DLF The Arbour',
    locality: 'Sector 63, Golf Course Extension Road',
    city: 'Delhi NCR',
    price: 34500000, // 3.45 Cr
    pricePerSqFt: 14500,
    areaSqFt: 2380,
    bhk: '3 BHK',
    baths: 3,
    balconies: 3,
    type: 'apartment',
    purpose: 'buy',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: '18th of 32 Floors',
    possession: 'Ready to Move',
    postedBy: 'Verified Agent',
    postedDate: '2 days ago',
    verified: true,
    reraApproved: true,
    reraId: 'RC/REP/HARERA/GGM/645/377',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Immerse in grand lifestyle with 3.5 acres of central greens, 100,000 sq.ft state of the art clubhouse, private elevator lobby, floor-to-ceiling panoramic glass balconies, and EV charging points in 2 dedicated basement parking slots.',
    amenities: ['Clubhouse & Spa', 'Swimming Pool', '24x7 High-Tier Security', 'Power Backup 100%', 'EV Charging', 'Landscaped Garden', 'Covered Car Parking'],
    contact: {
      name: 'Rajesh Sharma (Apex Realty)',
      phone: '+91 98112 34567',
      email: 'rajesh@apexrealty.in',
      badge: 'Certified Super Agent'
    }
  },
  {
    id: 'prop-2',
    title: '4 BHK Ultra-Modern Villa with Private Garden & Terrace',
    locality: 'Whitefield - Hope Farm Junction',
    city: 'Bangalore',
    price: 48000000, // 4.80 Cr
    pricePerSqFt: 12000,
    areaSqFt: 4000,
    bhk: '4 BHK',
    baths: 4,
    balconies: 4,
    type: 'villa',
    purpose: 'buy',
    furnishing: 'Fully Furnished',
    facing: 'East',
    floor: 'G+2 Independent Villa',
    possession: 'Ready to Move',
    postedBy: 'Owner (Zero Brokerage)',
    postedDate: 'Today',
    verified: true,
    reraApproved: true,
    reraId: 'PRM/KA/RERA/1251/446/PR/190823',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Bespoke custom-built Spanish design Villa with private plunge pool, landscaped backyard lawn, modular Italian kitchen, German fittings, and automated smart home security controls.',
    amenities: ['Swimming Pool', 'Landscaped Garden', 'Power Backup 100%', 'Covered Car Parking', '24x7 High-Tier Security'],
    contact: {
      name: 'Sunil Nair',
      phone: '+91 98450 98765',
      email: 'sunil.nair@gmail.com',
      badge: 'Direct Property Owner'
    }
  },
  {
    id: 'prop-3',
    title: '2 BHK Premium Sea-View Apartment in Bandra West',
    locality: 'Pali Hill, Bandra West',
    city: 'Mumbai',
    price: 38500000, // 3.85 Cr
    pricePerSqFt: 38500,
    areaSqFt: 1000,
    bhk: '2 BHK',
    baths: 2,
    balconies: 2,
    type: 'apartment',
    purpose: 'buy',
    furnishing: 'Fully Furnished',
    facing: 'West',
    floor: '14th of 20 Floors',
    possession: 'Ready to Move',
    postedBy: 'Verified Agent',
    postedDate: '1 day ago',
    verified: true,
    reraApproved: true,
    reraId: 'P51800028472',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Rare opportunity in prime Pali Hill! Unobstructed sunset views of the Arabian Sea, designer interior woodwork, imported marble flooring, acoustic soundproof French windows.',
    amenities: ['Swimming Pool', 'Clubhouse & Spa', 'Covered Car Parking', '24x7 High-Tier Security'],
    contact: {
      name: 'Vikram Mehta (Prime Properties)',
      phone: '+91 98200 11223',
      email: 'vikram@mumbaiprime.in',
      badge: 'RERA Registered Broker'
    }
  },
  {
    id: 'prop-4',
    title: '3 BHK Spacious High-Rise Apartment for Rent in Gachibowli',
    locality: 'Financial District, Nanakramguda',
    city: 'Hyderabad',
    price: 55000, // ₹55,000 / month rent
    pricePerSqFt: 28,
    areaSqFt: 1950,
    bhk: '3 BHK',
    baths: 3,
    balconies: 2,
    type: 'apartment',
    purpose: 'rent',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '9th of 28 Floors',
    possession: 'Available Immediately',
    postedBy: 'Owner (Zero Brokerage)',
    postedDate: '3 hours ago',
    verified: true,
    reraApproved: true,
    reraId: 'P02400001928',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Perfect for IT professionals working in Amazon/Google/Microsoft campuses. Located right behind Financial District. Gated township with supermarket, pharmacy, and gym inside community.',
    amenities: ['Full Gym & Aerobics Room', 'Power Backup 100%', 'Covered Car Parking', '24x7 High-Tier Security'],
    contact: {
      name: 'Kavitha Reddy',
      phone: '+91 97011 44556',
      email: 'kavitha.reddy@gmail.com',
      badge: 'Direct Owner'
    }
  },
  {
    id: 'prop-5',
    title: 'Commercial Grade A Office Space on Baner High Street',
    locality: 'Baner - Balewadi Road',
    city: 'Pune',
    price: 18500000, // 1.85 Cr
    pricePerSqFt: 15400,
    areaSqFt: 1200,
    bhk: 'Commercial',
    baths: 2,
    balconies: 1,
    type: 'commercial',
    purpose: 'buy',
    furnishing: 'Semi-Furnished',
    facing: 'North',
    floor: '4th of 12 Floors',
    possession: 'Ready to Move',
    postedBy: 'Developer / Builder',
    postedDate: '3 days ago',
    verified: true,
    reraApproved: true,
    reraId: 'P52100019920',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Premium Grade A LEED certified commercial glass facade tower with 8% estimated rental yield. Ideal for IT consulting, financial firms, or high-return investment.',
    amenities: ['Power Backup 100%', '24x7 High-Tier Security', 'Covered Car Parking', 'EV Charging'],
    contact: {
      name: 'Rohan Developers Sales Team',
      phone: '+91 98900 67890',
      email: 'sales@rohangroup.com',
      badge: 'Official Builder Desk'
    }
  },
  {
    id: 'prop-6',
    title: 'Residential Gated Plot 250 Sq.Yd in Sector 88',
    locality: 'Faridabad Bypass Road',
    city: 'Delhi NCR',
    price: 12500000, // 1.25 Cr
    pricePerSqFt: 5555,
    areaSqFt: 2250,
    bhk: 'Plot / Land',
    baths: 0,
    balconies: 0,
    type: 'plot',
    purpose: 'buy',
    furnishing: 'Unfurnished',
    facing: 'North',
    floor: 'Freehold Land',
    possession: 'Immediate Registry',
    postedBy: 'Verified Agent',
    postedDate: '4 days ago',
    verified: true,
    reraApproved: true,
    reraId: 'HRERA-PKL-FBD-311-2018',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'HUDA approved DTCP licensed township plot. Bank loan available from SBI & HDFC up to 80%. Boundary wall complete, underground electrification, and ready for immediate construction.',
    amenities: ['24x7 High-Tier Security', 'Landscaped Garden'],
    contact: {
      name: 'Amit Bansal',
      phone: '+91 99100 22334',
      email: 'amit@bansalproperties.com',
      badge: 'Verified Property Dealer'
    }
  },
  {
    id: 'prop-7',
    title: '2 BHK Modern High-Rise Flat in Dwarka Expressway Sector 102',
    locality: 'Sector 102, Dwarka Expressway',
    city: 'Delhi NCR',
    price: 8500000, // 85 Lac
    pricePerSqFt: 6800,
    areaSqFt: 1250,
    bhk: '2 BHK',
    baths: 2,
    balconies: 2,
    type: 'apartment',
    purpose: 'buy',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: '7th of 24 Floors',
    possession: 'Under Construction',
    postedBy: 'Verified Agent',
    postedDate: '1 day ago',
    verified: true,
    reraApproved: true,
    reraId: 'RC/REP/HARERA/GGM/2023/102',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Upcoming landmark development on 8-lane Dwarka Expressway. Excellent connectivity to IGI Airport & Cyber City. Loaded with sports complex, club house, and modular fittings.',
    amenities: ['Clubhouse & Spa', 'Swimming Pool', 'Full Gym & Aerobics Room', 'Power Backup 100%', 'Covered Car Parking'],
    contact: {
      name: 'Deepak Verma',
      phone: '+91 98101 55678',
      email: 'deepak.verma@realtypro.in',
      badge: 'Certified Agent'
    }
  },
  {
    id: 'prop-8',
    title: '1 BHK Fully Furnished Studio Flat in Indiranagar 100ft Road',
    locality: '12th Main, Indiranagar',
    city: 'Bangalore',
    price: 32000, // 32k / month
    pricePerSqFt: 49,
    areaSqFt: 650,
    bhk: '1 RK / 1 BHK',
    baths: 1,
    balconies: 1,
    type: 'apartment',
    purpose: 'rent',
    furnishing: 'Fully Furnished',
    facing: 'East',
    floor: '2nd of 4 Floors',
    possession: 'Available Immediately',
    postedBy: 'Owner (Zero Brokerage)',
    postedDate: '5 hours ago',
    verified: true,
    reraApproved: false,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Cozy, modern and fully equipped 1 BHK in heart of Indiranagar. Includes high-speed Wi-Fi, 55-inch smart TV, washing machine, modular kitchen, and power backup.',
    amenities: ['Power Backup 100%', '24x7 High-Tier Security'],
    contact: {
      name: 'Aakash Gupta',
      phone: '+91 99800 44321',
      email: 'aakash.gupta@gmail.com',
      badge: 'Direct Owner'
    }
  },
  {
    id: 'prop-9',
    title: '4 BHK Independent Luxury Floor with Stilt Parking',
    locality: 'Sushant Lok 1, Block C',
    city: 'Delhi NCR',
    price: 27500000, // 2.75 Cr
    pricePerSqFt: 11000,
    areaSqFt: 2500,
    bhk: '4 BHK',
    baths: 4,
    balconies: 3,
    type: 'builder-floor',
    purpose: 'buy',
    furnishing: 'Semi-Furnished',
    facing: 'North',
    floor: '2nd of 4 Floors',
    possession: 'Ready to Move',
    postedBy: 'Owner (Zero Brokerage)',
    postedDate: '3 days ago',
    verified: true,
    reraApproved: true,
    reraId: 'HRERA-GGM-124-2022',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Exclusive 4 BHK builder floor with private Otis elevator, 2 dedicated covered car parkings, Italian marble flooring throughout, modular kitchen with chimney & hob.',
    amenities: ['Covered Car Parking', 'Power Backup 100%', '24x7 High-Tier Security', 'EV Charging'],
    contact: {
      name: 'Pradeep Malhotra',
      phone: '+91 98111 88990',
      email: 'pradeep.malhotra@gmail.com',
      badge: 'Direct Owner'
    }
  },
  {
    id: 'prop-10',
    title: '3 BHK High-Floor Panoramic Lake View Penthouse',
    locality: 'Hiranandani Gardens, Powai',
    city: 'Mumbai',
    price: 62000000, // 6.20 Cr
    pricePerSqFt: 22142,
    areaSqFt: 2800,
    bhk: '3 BHK',
    baths: 4,
    balconies: 2,
    type: 'penthouse',
    purpose: 'buy',
    furnishing: 'Fully Furnished',
    facing: 'North-East',
    floor: '29th of 30 Floors',
    possession: 'Ready to Move',
    postedBy: 'Developer / Builder',
    postedDate: 'Just Now',
    verified: true,
    reraApproved: true,
    reraId: 'P51800001234',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Signature duplex penthouse with private sky deck terrace, panoramic Powai lake views, private infinity jacuzzi, high double height ceilings and customized Italian furniture.',
    amenities: ['Clubhouse & Spa', 'Swimming Pool', 'Full Gym & Aerobics Room', '24x7 High-Tier Security', 'EV Charging', 'Covered Car Parking'],
    contact: {
      name: 'Hiranandani Luxury Desk',
      phone: '+91 98201 99887',
      email: 'luxury@hiranandani.net',
      badge: 'Official Builder Desk'
    }
  }
];

export function formatIndianPrice(amount, purpose = 'buy') {
  if (!amount) return 'Price on Request';
  if (purpose === 'rent') {
    return `₹ ${Number(amount).toLocaleString('en-IN')}/mo`;
  }
  const num = Number(amount);
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹ ${cr.replace(/\.00$/, '')} Cr`;
  } else if (num >= 100000) {
    const lac = (num / 100000).toFixed(2);
    return `₹ ${lac.replace(/\.00$/, '')} Lac`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export function getPropertySlug(property) {
  if (!property) return '';
  const titlePart = (property.title || 'property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${titlePart}-${property.id}`;
}

export function findPropertyBySlug(properties, slug) {
  if (!slug || !properties || !properties.length) return null;
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Direct ID match (e.g. "prop-1")
  const byId = properties.find((p) => p.id.toLowerCase() === cleanSlug);
  if (byId) return byId;

  // 2. Slug ending with -id (e.g. "3-bhk-luxury-high-rise-apartment-dlf-the-arbour-prop-1")
  for (const p of properties) {
    const pSlug = getPropertySlug(p).toLowerCase();
    if (cleanSlug === pSlug || cleanSlug.endsWith(`-${p.id.toLowerCase()}`)) {
      return p;
    }
  }

  // 3. Fallback contains match
  for (const p of properties) {
    if (cleanSlug.includes(p.id.toLowerCase())) {
      return p;
    }
  }

  return null;
}
