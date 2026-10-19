import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Upload, 
  Building2,
  MapPin, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Video,
  Play,
  Plus,
  Trash2,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  CITIES, 
  PROPERTY_TYPES, 
  BHK_OPTIONS, 
  FURNISHING_OPTIONS, 
  POSSESSION_OPTIONS, 
  FACING_OPTIONS, 
  AMENITIES_LIST,
  formatIndianPrice 
} from '../data/mockProperties';

const EXTENDED_AMENITIES = [
  ...AMENITIES_LIST,
  'High-Speed Elevators',
  'Piped Gas Connection',
  'Children Play Area',
  'Rainwater Harvesting',
  'Intercom & Video Security',
  'Fire Fighting Systems',
  'Jogging Track',
  'Visitor Parking'
];

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Living Room', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modular Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Luxury Balcony', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Clubhouse Pool', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' }
];

const SAMPLE_VIDEO_TOUR = 'https://www.youtube.com/watch?v=1la41n17gR0';

function getVideoEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

function formatPriceHelper(amount, purpose) {
  if (!amount || isNaN(amount)) return '';
  const num = Number(amount);
  if (purpose === 'rent') {
    return `₹ ${num.toLocaleString('en-IN')} / month`;
  }
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹ ${cr.replace(/\.00$/, '')} Crore`;
  }
  if (num >= 100000) {
    const lac = (num / 100000).toFixed(2);
    return `₹ ${lac.replace(/\.00$/, '')} Lakh`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export default function PostPropertyModal({ isOpen, onClose, onPropertyAdded }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userRole: 'Owner',
    purpose: 'buy', // 'buy', 'rent', 'pg'
    category: 'residential',
    type: 'apartment',
    bhk: '3 BHK',
    bedrooms: 3,
    baths: 3,
    balconies: 2,
    city: 'Delhi NCR',
    locality: '',
    projectName: '',
    address: '',
    floorNumber: '5',
    totalFloors: '18',
    facing: 'North-East',
    areaSqFt: '',
    carpetAreaSqFt: '',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    ageOfProperty: '0-1 Year (Brand New)',
    coveredParking: 1,
    openParking: 1,
    amenities: [
      'Swimming Pool',
      'Clubhouse & Spa',
      'Full Gym & Aerobics Room',
      '24x7 High-Tier Security',
      'Power Backup 100%',
      'Covered Car Parking'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: SAMPLE_VIDEO_TOUR,
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    price: '',
    maintenanceFee: '4500',
    bookingAmount: '100000',
    priceNegotiable: true,
    title: '',
    description: '',
    reraApproved: true,
    reraId: 'HRERA/GGM/2026/894',
    userName: '',
    userPhone: '',
    userEmail: '',
    preferredContactTime: 'Anytime (9 AM - 8 PM)',
    whatsappUpdates: true
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);
  const [stepError, setStepError] = useState('');

  const inputClass = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-xs font-bold text-slate-700 uppercase mb-1.5';

  const handleAutoTitle = () => {
    const typeObj = PROPERTY_TYPES.find(t => t.id === formData.type);
    const typeLabel = typeObj ? typeObj.label : formData.type;
    const projectPart = formData.projectName ? `in ${formData.projectName}` : '';
    const locPart = formData.locality ? `${projectPart ? '' : 'in '}${formData.locality}` : `in ${formData.city}`;
    const generated = `${formData.bhk} ${typeLabel} ${[projectPart, locPart].filter(Boolean).join(', ')}`;
    setFormData(prev => ({ ...prev, title: generated.trim() }));
  };

  const handleAiDescription = () => {
    const typeObj = PROPERTY_TYPES.find(t => t.id === formData.type);
    const typeLabel = typeObj ? typeObj.label : formData.type;
    const descParts = [
      `Exceptional opportunity to own a spacious ${formData.bhk} ${typeLabel.toLowerCase()} in prime ${formData.locality || formData.city}${formData.projectName ? ` (${formData.projectName})` : ''}.`,
      `Spans ${formData.areaSqFt || '1850'} sq.ft with ${formData.baths} baths and ${formData.balconies} balconies.`,
      `Finished with ${formData.furnishing.toLowerCase()} interiors, ${formData.facing} facing with optimal natural daylight.`,
      `Floor ${formData.floorNumber} of ${formData.totalFloors}. Possession: ${formData.possession}.`,
      `Society amenities include ${formData.amenities.slice(0, 4).join(', ')}.`,
      `Directly posted by ${formData.userRole}${formData.reraApproved && formData.reraId ? ` (RERA: ${formData.reraId})` : ''}.`
    ];
    setFormData(prev => ({ ...prev, description: descParts.join(' ') }));
  };

  const handleAddImage = (urlToAdd) => {
    const url = (urlToAdd || imageUrlInput).trim();
    if (!url) return;
    if (!formData.images.includes(url)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetCoverImage = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const reordered = [...prev.images];
      const [chosen] = reordered.splice(index, 1);
      return { ...prev, images: [chosen, ...reordered] };
    });
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
  };

  const handleToggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const validateStep = (currentStep) => {
    setStepError('');
    if (currentStep === 1 && !formData.type) {
      setStepError('Please select a property type.');
      return false;
    }
    if (currentStep === 2 && !formData.locality.trim()) {
      setStepError('Please enter a locality or sector name.');
      return false;
    }
    if (currentStep === 3 && (!formData.areaSqFt || Number(formData.areaSqFt) <= 0)) {
      setStepError('Please enter a valid super built-up area in Sq.Ft.');
      return false;
    }
    if (currentStep === 4 && formData.images.length === 0) {
      setStepError('Please add at least one property photo.');
      return false;
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(5, prev + 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.price || Number(formData.price) <= 0) {
      setStepError('Please specify the expected price or rent.');
      return;
    }
    if (!formData.userName.trim()) {
      setStepError('Please enter your full name.');
      return;
    }
    if (!formData.userPhone.trim()) {
      setStepError('Please provide a contact phone number.');
      return;
    }

    const priceNum = Number(formData.price) || (formData.purpose === 'rent' ? 45000 : 8500000);
    const areaNum = Number(formData.areaSqFt) || 1500;
    const calculatedRate = Math.round(priceNum / areaNum);

    const fullTitle = formData.title.trim() || 
      `${formData.bhk} ${PROPERTY_TYPES.find(t => t.id === formData.type)?.label || formData.type} in ${formData.projectName ? `${formData.projectName}, ` : ''}${formData.locality || formData.city}`;

    const newProperty = {
      id: `prop-${Date.now()}`,
      title: fullTitle,
      locality: formData.projectName ? `${formData.projectName}, ${formData.locality}` : formData.locality || 'Prime Locality',
      city: formData.city,
      project: formData.projectName || '',
      address: formData.address || `${formData.locality}, ${formData.city}`,
      price: priceNum,
      pricePerSqFt: calculatedRate,
      maintenanceFee: Number(formData.maintenanceFee) || 0,
      bookingAmount: Number(formData.bookingAmount) || 0,
      priceNegotiable: formData.priceNegotiable,
      areaSqFt: areaNum,
      carpetAreaSqFt: Number(formData.carpetAreaSqFt) || Math.round(areaNum * 0.78),
      bhk: formData.bhk,
      bedrooms: Number(formData.bedrooms) || 3,
      baths: Number(formData.baths) || 2,
      balconies: Number(formData.balconies) || 2,
      type: formData.type,
      purpose: formData.purpose === 'pg' ? 'rent' : formData.purpose,
      furnishing: formData.furnishing,
      facing: formData.facing,
      floor: `${formData.floorNumber}th of ${formData.totalFloors} Floors`,
      floorNumber: Number(formData.floorNumber) || 1,
      totalFloors: Number(formData.totalFloors) || 10,
      possession: formData.possession,
      ageOfProperty: formData.ageOfProperty,
      coveredParking: Number(formData.coveredParking) || 1,
      openParking: Number(formData.openParking) || 0,
      postedBy: `${formData.userRole}${formData.userRole === 'Owner' ? ' (Zero Brokerage)' : ''}`,
      postedDate: 'Just Now',
      verified: true,
      reraApproved: Boolean(formData.reraApproved),
      reraId: formData.reraApproved ? (formData.reraId || 'RERA/NEW/2026') : '',
      featured: true,
      images: formData.images.length > 0 ? formData.images : [SAMPLE_PHOTO_PRESETS[0].url],
      videoUrl: formData.videoUrl || '',
      floorPlanUrl: formData.floorPlanUrl || '',
      description: formData.description.trim() || 'Newly listed verified premium property with modern architectural finishes, high-tier security and world-class connectivity.',
      amenities: formData.amenities.length > 0 ? formData.amenities : ['24x7 High-Tier Security', 'Power Backup 100%', 'Covered Car Parking'],
      contact: {
        name: formData.userName || 'Property Lister',
        phone: formData.userPhone || '+91 98000 00000',
        email: formData.userEmail || 'contact@propertyowner.in',
        badge: `Verified ${formData.userRole}`,
        preferredTime: formData.preferredContactTime
      }
    };

    setCreatedProperty(newProperty);
    onPropertyAdded(newProperty);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCreatedProperty(null);
    setStep(1);
    onClose();
  };

  const embedUrl = getVideoEmbedUrl(formData.videoUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white px-5 sm:px-8 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm shadow">
              99
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">Post Property on 99acres</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  100% FREE
                </span>
              </div>
              <p className="text-xs text-slate-200 hidden sm:block">
                Reach over 10 Lakh verified buyers & tenants with instant live visibility
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        {!isSuccess && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-3 shrink-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-between min-w-[560px] text-xs">
              {[
                { num: 1, label: 'Type & Role' },
                { num: 2, label: 'Location & Society' },
                { num: 3, label: 'Features & Amenities' },
                { num: 4, label: 'Photos & Videos' },
                { num: 5, label: 'Pricing & Publish' }
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num < step || validateStep(step)) {
                        setStep(s.num);
                      }
                    }}
                    className={`flex items-center space-x-2 font-bold transition px-2 py-1 rounded-lg ${
                      isActive ? 'text-brand-700 bg-brand-50' : isPassed ? 'text-emerald-700 hover:text-brand-700' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                      isActive ? 'bg-brand-600 text-white ring-2 ring-brand-300' : isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </span>
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {stepError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs font-bold animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{stepError}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-6 sm:py-10 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  🎉 Property Listed Successfully on 99acres!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Your ad has been created with rich photos, video walkthrough and amenities checklist. It is now active and ready for buyers.
                </p>
              </div>

              {createdProperty && (
                <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left shadow-sm flex items-center space-x-4">
                  <img
                    src={createdProperty.images[0]}
                    alt={createdProperty.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block bg-brand-100 text-brand-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-1">
                      {createdProperty.bhk} • {createdProperty.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {createdProperty.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {createdProperty.locality}, {createdProperty.city}
                    </p>
                    <p className="text-sm font-black text-slate-900 mt-1">
                      {formatIndianPrice(createdProperty.price, createdProperty.purpose)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm shadow-lg shadow-brand-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Live Listing Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setStep(1);
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl text-sm transition"
                >
                  Post Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Type & Role */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className={labelClass}>I am listing as:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Owner', 'Agent / Broker', 'Developer / Builder'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, userRole: role })}
                          className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border text-center transition ${
                            formData.userRole === role
                              ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-300'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-extrabold">{role}</div>
                          {role === 'Owner' && <span className="text-[10px] opacity-90 block mt-0.5">Zero Brokerage</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Listing Purpose:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'buy', label: 'Sell Property', hint: 'Direct Sale / Resale' },
                        { id: 'rent', label: 'Rent / Lease Out', hint: 'Monthly Rental' },
                        { id: 'pg', label: 'PG / Co-Living', hint: 'Shared Living' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, purpose: item.id })}
                          className={`p-3.5 rounded-2xl border text-left transition ${
                            formData.purpose === item.id
                              ? 'bg-brand-50 border-brand-600 text-brand-900 shadow-sm ring-1 ring-brand-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-black text-sm">{item.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.hint}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Property Type:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PROPERTY_TYPES.filter(t => t.id !== 'all').map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t.id })}
                          className={`py-3 px-3.5 rounded-xl text-xs font-bold border text-left transition flex items-center space-x-2.5 ${
                            formData.type === t.id
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Building2 className={`w-4 h-4 shrink-0 ${formData.type === t.id ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>BHK / Bedroom Configuration:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {BHK_OPTIONS.map((bhk) => (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => {
                            const bedCount = parseInt(bhk, 10) || 1;
                            setFormData({ ...formData, bhk, bedrooms: bedCount });
                          }}
                          className={`py-2.5 px-2 text-xs font-black rounded-xl border text-center transition ${
                            formData.bhk === bhk
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className={labelClass}>Bathrooms:</label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, baths: num })}
                            className={`flex-1 py-2 rounded-xl text-xs font-black border text-center transition ${
                              formData.baths === num
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Balconies:</label>
                      <div className="flex items-center space-x-2">
                        {[0, 1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, balconies: num })}
                            className={`flex-1 py-2 rounded-xl text-xs font-black border text-center transition ${
                              formData.balconies === num
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center space-x-2 shadow-md transition"
                    >
                      <span>Continue to Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Society */}
              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City <span className="text-rose-500">*</span></label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={inputClass}
                      >
                        {CITIES.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Locality / Sector <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        placeholder="e.g. Sector 65, Golf Course Extension"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Society / Project Name</label>
                      <input
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        placeholder="e.g. DLF The Arbour / Godrej Woods / Prestige Falcon"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Facing / Vastu Orientation</label>
                      <select
                        value={formData.facing}
                        onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                        className={inputClass}
                      >
                        {FACING_OPTIONS.map((f) => (
                          <option key={f} value={f}>{f} Facing</option>
                        ))}
                        <option value="South">South Facing</option>
                        <option value="North-West">North-West Facing</option>
                        <option value="South-East">South-East Facing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Property on Floor:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.floorNumber}
                        onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                        placeholder="e.g. 5 (0 for Ground)"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Total Floors in Building:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                        placeholder="e.g. 18"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Street Address / Flat / Tower (Optional):</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Tower 3, Flat 502, Near Rapid Metro Station"
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center space-x-2 shadow-md transition"
                    >
                      <span>Continue to Features</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Features & Amenities */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Super Built-up Area (Sq.Ft) <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        value={formData.areaSqFt}
                        onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                        placeholder="e.g. 1850"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Carpet Area (Sq.Ft):</label>
                      <input
                        type="number"
                        value={formData.carpetAreaSqFt}
                        onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: e.target.value })}
                        placeholder="e.g. 1450"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Furnishing Status:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {FURNISHING_OPTIONS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormData({ ...formData, furnishing: f })}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition ${
                            formData.furnishing === f
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Possession Status:</label>
                      <select
                        value={formData.possession}
                        onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                        className={inputClass}
                      >
                        {POSSESSION_OPTIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Age of Property:</label>
                      <select
                        value={formData.ageOfProperty}
                        onChange={(e) => setFormData({ ...formData, ageOfProperty: e.target.value })}
                        className={inputClass}
                      >
                        <option value="0-1 Year (Brand New)">0-1 Year (Brand New)</option>
                        <option value="1-5 Years">1-5 Years Old</option>
                        <option value="5-10 Years">5-10 Years Old</option>
                        <option value="10+ Years">10+ Years Old</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Covered Car Parking:</label>
                      <div className="flex space-x-2">
                        {[0, 1, 2, 3].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, coveredParking: num })}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                              formData.coveredParking === num ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Open Parking:</label>
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, openParking: num })}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                              formData.openParking === num ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className={labelClass}>
                        Select Society Amenities ({formData.amenities.length} selected):
                      </label>
                      <div className="space-x-3 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, amenities: [...EXTENDED_AMENITIES] })}
                          className="text-brand-600 hover:text-brand-800"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, amenities: [] })}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {EXTENDED_AMENITIES.map((item) => {
                        const checked = formData.amenities.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleToggleAmenity(item)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition ${
                              checked
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-white ${
                              checked ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}>
                              {checked && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span className="truncate">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-slate-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center space-x-2 shadow-md transition"
                    >
                      <span>Continue to Photos & Video</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Photos & Video Tour */}
              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-amber-950 font-black">99acres Verification Advantage:</strong>
                      Properties with 5+ photos and a video walkthrough receive up to <strong>8x more inquiries</strong> and reach top search rankings.
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass}>
                        Property Photos ({formData.images.length} uploaded) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-xs text-slate-500 font-medium">Click on any photo to set as Cover</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                      {formData.images.map((url, idx) => (
                        <div 
                          key={idx} 
                          className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 aspect-video shadow-xs"
                        >
                          <img 
                            src={url} 
                            alt={`Property Photo ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {idx === 0 ? (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                              Cover Photo
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm transition"
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition opacity-0 group-hover:opacity-100"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1 right-2 text-[10px] text-white/80 font-mono drop-shadow">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}

                      <label className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/50 flex flex-col items-center justify-center p-4 cursor-pointer transition aspect-video group text-center">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-600 mb-1 transition" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-brand-700">Upload Photos</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Paste image URL (e.g. https://...)"
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImage()}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add URL</span>
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Quick Photo Presets:</span>
                      {SAMPLE_PHOTO_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleAddImage(preset.url)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Walkthrough Tour */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <Video className="w-4 h-4 text-brand-600" />
                        <span>Video Tour / Virtual Walkthrough URL:</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: SAMPLE_VIDEO_TOUR })}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800"
                      >
                        Use Sample Real Estate Video
                      </button>
                    </div>

                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or Vimeo / MP4 link"
                      className={inputClass}
                    />

                    {formData.videoUrl && (
                      <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video max-w-lg mx-auto shadow-md">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title="Property Video Tour"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : formData.videoUrl.endsWith('.mp4') ? (
                          <video 
                            src={formData.videoUrl} 
                            controls 
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center space-y-2">
                            <Play className="w-10 h-10 text-brand-400" />
                            <div className="text-xs font-bold">Video URL Attached:</div>
                            <div className="text-[11px] text-slate-300 break-all">{formData.videoUrl}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Floor Plan URL */}
                  <div className="pt-4 border-t border-slate-200">
                    <label className={labelClass}>Floor Plan Image URL (Optional):</label>
                    <input
                      type="url"
                      value={formData.floorPlanUrl}
                      onChange={(e) => setFormData({ ...formData, floorPlanUrl: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/... or blueprint link"
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-slate-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center space-x-2 shadow-md transition"
                    >
                      <span>Continue to Pricing</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Pricing, RERA & Contact */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                          Expected {formData.purpose === 'rent' ? 'Monthly Rent (₹)' : 'Sale Price (₹)'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder={formData.purpose === 'rent' ? 'e.g. 45000' : 'e.g. 17500000'}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:ring-2 focus:ring-brand-500"
                        />
                        {formData.price && (
                          <div className="text-xs font-black text-emerald-700 mt-1.5">
                            {formatPriceHelper(formData.price, formData.purpose)}
                            {formData.areaSqFt && Number(formData.areaSqFt) > 0 && (
                              <span className="text-slate-500 font-medium ml-2">
                                (₹ {Math.round(Number(formData.price) / Number(formData.areaSqFt)).toLocaleString('en-IN')}/sq.ft)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Maintenance Fee (₹/month):</label>
                        <input
                          type="number"
                          value={formData.maintenanceFee}
                          onChange={(e) => setFormData({ ...formData, maintenanceFee: e.target.value })}
                          placeholder="e.g. 4500"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Booking / Token Amount (₹):</label>
                        <input
                          type="number"
                          value={formData.bookingAmount}
                          onChange={(e) => setFormData({ ...formData, bookingAmount: e.target.value })}
                          placeholder="e.g. 100000"
                          className={inputClass}
                        />
                      </div>

                      <div className="flex items-center space-x-4 pt-4 sm:pt-6">
                        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.priceNegotiable}
                            onChange={(e) => setFormData({ ...formData, priceNegotiable: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span>Price is Negotiable</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelClass}>Property Ad Title:</label>
                      <button
                        type="button"
                        onClick={handleAutoTitle}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <span>Auto-Generate Title</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 3 BHK Luxury High-Rise Apartment in DLF The Arbour, Sector 65"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelClass}>Property Description:</label>
                      <button
                        type="button"
                        onClick={handleAiDescription}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <span>✨ Generate AI Description</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Highlight project connectivity, sunlight, clubhouse features, nearby schools and hospitals..."
                      className={`${inputClass} resize-none`}
                    ></textarea>
                  </div>

                  <div className="bg-brand-50/50 border border-brand-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-brand-700" />
                        <div>
                          <div className="text-xs font-black text-slate-900 uppercase">RERA Compliance</div>
                          <div className="text-[11px] text-slate-500">RERA verified listings gain genuine trust from buyers</div>
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.reraApproved}
                          onChange={(e) => setFormData({ ...formData, reraApproved: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span>RERA Registered</span>
                      </label>
                    </div>

                    {formData.reraApproved && (
                      <input
                        type="text"
                        value={formData.reraId}
                        onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                        placeholder="RERA Registration ID (e.g. HRERA/GGM/2026/894)"
                        className="w-full px-4 py-2 bg-white border border-brand-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className={labelClass}>Contact Information:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          placeholder="e.g. Vikram Malhotra"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.userPhone}
                          onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Email Address:
                        </label>
                        <input
                          type="email"
                          value={formData.userEmail}
                          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                          placeholder="e.g. owner@example.com"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Best Time:</span>
                        <select
                          value={formData.preferredContactTime}
                          onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                        >
                          <option value="Anytime (9 AM - 8 PM)">Anytime (9 AM - 8 PM)</option>
                          <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                          <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                          <option value="Weekends Only">Weekends Only</option>
                        </select>
                      </div>

                      <label className="flex items-center space-x-2 text-slate-700 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={formData.whatsappUpdates}
                          onChange={(e) => setFormData({ ...formData, whatsappUpdates: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Receive verified buyer leads on WhatsApp</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-slate-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-2xl text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>Publish Property Ad (FREE)</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
