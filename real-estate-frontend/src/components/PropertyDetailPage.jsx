import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles,
  Home,
  Check,
  Send,
  Calculator,
  Building
} from 'lucide-react';
import { formatIndianPrice, getPropertySlug } from '../data/mockProperties';

export default function PropertyDetailPage({
  property,
  allProperties = [],
  onNavigate,
  isShortlisted,
  onToggleShortlist
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('I am interested in this property. Please share more details.');
  const [inquirySent, setInquirySent] = useState(false);
  const [copied, setCopied] = useState(false);

  // EMI calculator state based on property price
  const initialLoan = property ? Math.round(property.price * 0.8) : 5000000;
  const [loanAmount, setLoanAmount] = useState(initialLoan);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  useEffect(() => {
    if (property) {
      setLoanAmount(Math.round(property.price * 0.8));
      setActivePhotoIdx(0);
      setInquirySent(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [property?.id]);

  if (!property) return null;

  // EMI Calculation
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} in ${property.locality}, ${property.city} on 99acres`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Similar properties in same city or category
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-16 animate-fadeIn">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-[72px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 overflow-x-auto py-1">
            <button
              onClick={() => onNavigate('/')}
              className="font-medium text-brand-600 hover:text-brand-800 flex items-center hover:underline shrink-0"
            >
              <Home className="w-3.5 h-3.5 mr-1" /> Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('/')}
              className="font-medium hover:text-slate-800 shrink-0"
            >
              {property.city}
            </button>
            <span>/</span>
            <span className="capitalize shrink-0">{property.type}</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-xs">
              {property.title}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Listings
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => onToggleShortlist(property.id)}
              className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg transition border ${
                isShortlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 mr-1 ${isShortlisted ? 'fill-rose-500' : ''}`} />
              {isShortlisted ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Main Title & Price Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {property.verified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Verified Listing
                  </span>
                )}
                {property.reraApproved && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    RERA ID: <strong>{property.reraId}</strong>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  Posted {property.postedDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center text-sm text-slate-600 font-medium mt-1.5">
                <MapPin className="w-4 h-4 text-brand-600 mr-1.5 shrink-0" />
                <span>{property.locality}, {property.city}</span>
              </div>
            </div>

            <div className="lg:text-right flex flex-col sm:flex-row lg:flex-col justify-between items-start lg:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {formatIndianPrice(property.price, property.purpose)}
                </div>
                {property.pricePerSqFt && (
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    ₹ {property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft
                  </div>
                )}
              </div>
              {property.purpose !== 'rent' && (
                <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Est. EMI starting at ₹ {Math.round(emi).toLocaleString('en-IN')}/mo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Main Large Image Frame */}
          <div className="lg:col-span-8 relative h-72 sm:h-[450px] rounded-3xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={property.images[activePhotoIdx] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10">
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev - 1 + property.images.length) % property.images.length)}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev + 1) % property.images.length)}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md">
              Photo {activePhotoIdx + 1} of {property.images.length}
            </div>
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md">
              {property.bhk} in {property.locality}
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[450px] pb-2">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`relative shrink-0 w-32 h-24 lg:w-full lg:h-32 rounded-2xl overflow-hidden border-2 transition ${
                  activePhotoIdx === i
                    ? 'border-brand-600 ring-2 ring-brand-500/30'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview / Key Specifications Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center">
                <Layers className="w-5 h-5 text-brand-600 mr-2" />
                Key Property Specifications
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Configuration</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.bhk}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Super Builtup Area</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.areaSqFt} sq.ft</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Bathrooms</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.baths || 2} Baths</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Balconies</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.balconies || 2} Balconies</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Furnishing</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.furnishing}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Facing / Vastu</span>
                  <strong className="text-slate-900 font-extrabold text-base block truncate" title={property.facing}>
                    {property.facing}
                  </strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Floor Level</span>
                  <strong className="text-slate-900 font-extrabold text-base block">{property.floor}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Possession Status</span>
                  <strong className="text-emerald-700 font-extrabold text-base block">{property.possession}</strong>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                <Building className="w-5 h-5 text-brand-600 mr-2" />
                About This Property
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p className="whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  {property.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Freehold Property with Clean Clear Title</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct Access to Major Metro & Expressways</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% DG Power Backup & 24x7 Water Supply</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-tier Security with CCTV Surveillance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-brand-600 mr-2" />
                  Amenities & Facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-800 flex items-center space-x-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrated EMI Calculator */}
            {property.purpose !== 'rent' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center">
                      <Calculator className="w-5 h-5 text-brand-600 mr-2" />
                      Home Loan EMI Calculator for this Property
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Estimated on 80% loan value for {formatIndianPrice(property.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Calculated Monthly EMI</span>
                    <span className="text-xl font-black text-brand-700">₹ {emi.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Loan Amount</span>
                      <span className="text-brand-600 font-extrabold">{formatIndianPrice(loanAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={property.price}
                      step={100000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-brand-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Interest Rate</span>
                      <span className="text-brand-600 font-extrabold">{interestRate} %</span>
                    </div>
                    <input
                      type="range"
                      min={7}
                      max={14}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-brand-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Tenure (Years)</span>
                      <span className="text-brand-600 font-extrabold">{tenureYears} Yrs</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full accent-brand-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center space-x-6">
                    <div>
                      <span className="text-slate-400 block font-medium">Principal Amount</span>
                      <strong className="text-slate-900 text-sm font-bold">₹ {loanAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Total Interest</span>
                      <strong className="text-slate-900 text-sm font-bold">₹ {totalInterest.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Total Payable</span>
                      <strong className="text-brand-700 text-sm font-bold">₹ {totalPayment.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                  <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl transition shadow">
                    Check Loan Eligibility
                  </button>
                </div>
              </div>
            )}

            {/* Similar Properties in same city */}
            {similarProperties.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Similar Properties You May Like</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Handpicked premium listings in {property.city}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('/')}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarProperties.map((simProp) => (
                    <div
                      key={simProp.id}
                      onClick={() => onNavigate(`/property/${getPropertySlug(simProp)}`)}
                      className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      <div className="h-36 relative overflow-hidden bg-slate-900">
                        <img
                          src={simProp.images[0]}
                          alt={simProp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {simProp.bhk}
                        </div>
                      </div>
                      <div className="p-3.5">
                        <div className="text-base font-black text-slate-900">
                          {formatIndianPrice(simProp.price, simProp.purpose)}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition mt-1">
                          {simProp.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center">
                          <MapPin className="w-3 h-3 mr-0.5 text-brand-600 shrink-0" />
                          {simProp.locality}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Agent / Owner Profile Card */}
            <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl sticky top-32">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full inline-block mb-4">
                Verified Seller Contact
              </span>
              
              <div className="flex items-center space-x-3.5 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white text-brand-800 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                  {property.contact?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">{property.contact?.name}</h3>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">{property.contact?.badge}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Posted by {property.postedBy}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/15 text-xs">
                <a
                  href={`tel:${property.contact?.phone || ''}`}
                  className="flex items-center space-x-3 text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 p-3 rounded-xl transition"
                >
                  <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Mobile</span>
                    <strong className="text-white text-sm font-black">{property.contact?.phone}</strong>
                  </div>
                </a>

                <a
                  href={`mailto:${property.contact?.email || ''}`}
                  className="flex items-center space-x-3 text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 p-3 rounded-xl transition truncate"
                >
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Email</span>
                    <span className="text-white font-medium truncate block">{property.contact?.email}</span>
                  </div>
                </a>
              </div>

              {/* Instant Callback Form */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <h4 className="font-bold text-sm text-white mb-1">
                  Request Instant Callback
                </h4>
                <p className="text-xs text-slate-300 mb-4">
                  Schedule an on-site property visit or get floor plans.
                </p>

                {inquirySent ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 text-center">
                    <Check className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                    <h5 className="font-bold text-white text-sm">Inquiry Received!</h5>
                    <p className="text-xs text-emerald-200 mt-1">
                      {property.contact?.name} will contact you shortly on {inquiryPhone || 'your phone'}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Mobile Number (+91)"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="Email Address (Optional)"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Contact Seller & Request Tour</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      Your contact details are encrypted and shared directly with the verified seller.
                    </p>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
