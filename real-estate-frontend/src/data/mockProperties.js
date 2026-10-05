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
  { id: 'all', label: 'All Residential' },
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
    facing: 'North-East (Park Facing)',
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
    amenities: ['Clubhouse & Spa', 'Olympic Swimming Pool', 'Tennis Court', '24x7 High-Tier Security', 'Power Backup 100%', 'EV Charging', 'Jogging Track', 'Kids Play Area'],
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
    facing: 'East Facing Vastu Compliant',
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
    amenities: ['Private Pool', 'Landscaped Garden', 'Smart Home Automation', 'Modular Italian Kitchen', 'Solar Power backup', 'Covered 3 Car Parking'],
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
    facing: 'West (Arabian Sea Facing)',
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
    amenities: ['Sea View Balcony', 'Rooftop Infinity Lounge', 'High Speed Mitsubishi Elevators', 'Automated Multi-level Parking', '24x7 Concierge Service'],
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
    facing: 'East Facing',
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
    amenities: ['Full Gym & Aerobics Room', 'Badminton Court', 'Supermarket on premises', '100% DG Power Backup', 'Reserved Car Parking'],
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
    furnishing: 'Warm Shell with AC',
    facing: 'Main Road Frontage',
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
    amenities: ['Central Air Conditioning', 'Conference Rooms', 'Double Height Reception Lobby', 'Cafeteria & Food Court', 'Fiber Optic Ready'],
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
    facing: 'North Facing 60ft Wide Road',
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
    amenities: ['Gated Security Entry', 'Underground Sewage & Electricity', '60ft Wide Metalled Roads', 'Central Theme Park', 'Community Hall'],
    contact: {
      name: 'Amit Bansal',
      phone: '+91 99100 22334',
      email: 'amit@bansalproperties.com',
      badge: 'Verified Property Dealer'
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
