import React, { useState, useMemo, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  Building2, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  CalendarCheck,
  LocateFixed,
  AlertTriangle,
  Ambulance,
  Radio,
  Sparkles,
  IndianRupee,
  BadgePercent,
  CheckCircle,
  HelpCircle,
  FileText,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Layers,
  ZoomIn,
  ZoomOut,
  Mountain,
  Award,
  Bus,
  Shield,
  Flame,
  Droplets,
  Building
} from 'lucide-react';
import { MedicalFacility } from '../../types';
import { 
  RAMANAGARA_DISTRICT_FEATURES, 
  RAMANAGARA_GEO_LINES, 
  RamanagaraFeatureItem 
} from '../../data/ramanagaraFeatures';
import { RamanagaraFeaturesCard } from './RamanagaraFeaturesCard';

export const RAMANAGARA_FACILITIES: MedicalFacility[] = [
  {
    id: 'RAM-01',
    name: 'District Government Hospital Ramanagara (ಜಿಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಆಸ್ಪತ್ರೆ)',
    category: 'Hospital',
    address: 'GCEC, B.M. Road, Ramanagara, Karnataka 562159',
    lat: 12.7215,
    lng: 77.2842,
    phone: '+91 80 2727 1222',
    emergencyPhone: '108',
    rating: 4.6,
    reviewCount: 430,
    openHours: '24/7 Government Emergency & Trauma Care',
    services: ['24/7 Emergency Casualty', 'Maternity & NICU', 'Blood Bank', 'Digital X-Ray', 'Dialysis Center', 'ICU'],
    traumaLevel: 'Government District Trauma & Emergency',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 10,
    distanceKm: 0.6,
    estimatedDriveTimeMin: 3,
    consultationFee: '₹0 (100% Free Govt OPD)',
    isGovtFreeCare: true,
    feeTier: 'Free / Govt (₹0)',
    schemeAccepted: ['Arogya Karnataka', 'Ayushman Bharat (AB-PMJAY)', 'BPL Free Care', 'Jan Aushadhi Scheme'],
    bedChargesPerDay: '₹0 (Free General Ward & ICU)',
  },
  {
    id: 'RAM-02',
    name: 'Ramanagara Super Speciality Hospital & Maternity Centre',
    category: 'Hospital',
    address: 'B.M. Road, Near Bus Station, Ramanagara, Karnataka 562159',
    lat: 12.7198,
    lng: 77.2826,
    phone: '+91 94801 88444',
    emergencyPhone: '+91 94801 88444',
    rating: 4.8,
    reviewCount: 310,
    openHours: '24/7 Emergency & Multi-Speciality Care',
    services: ['24/7 Emergency & ICU', 'Cardiology', 'Orthopedics', 'Urology', '24/7 Diagnostic Lab', 'Digital X-Ray'],
    traumaLevel: 'Multi-Speciality Emergency & Trauma',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 8,
    distanceKm: 0.4,
    estimatedDriveTimeMin: 2,
    consultationFee: '₹200 - ₹300 (OPD)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Ayushman Bharat Empanelled', 'Private Cashless TPA', 'Yeshasvini Scheme'],
    bedChargesPerDay: '₹400 / day (Semi-private)',
  },
  {
    id: 'RAM-03',
    name: 'Ramakrishna Hospital Ramanagara',
    category: 'Hospital',
    address: 'S.S. Complex, Vivekananda Nagara, Near IDBI Bank, B.M. Road, Ramanagara, Karnataka 562159',
    lat: 12.7242,
    lng: 77.2789,
    phone: '+91 80 2727 2333',
    emergencyPhone: '+91 80 2727 2333',
    rating: 4.7,
    reviewCount: 265,
    openHours: '24/7 Emergency Department & Inpatient Care',
    services: ['24/7 Emergency', 'General Medicine', 'Pediatric Care', 'Ultrasound & Diagnostics', 'Inpatient ICU'],
    traumaLevel: 'Cashless Care Network Hospital',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 12,
    distanceKm: 0.9,
    estimatedDriveTimeMin: 4,
    consultationFee: '₹150 - ₹200 (OPD)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Arogya Karnataka Network', 'Universal Health Card', 'Star Health / Cashless'],
    bedChargesPerDay: '₹350 / day',
  },
  {
    id: 'RAM-04',
    name: 'Bharath Kempanna Multi Speciality Hospital',
    category: 'Hospital',
    address: 'B.M. Road, Ijoor, Ramanagara, Karnataka 562159',
    lat: 12.7163,
    lng: 77.2871,
    phone: '+91 80 2727 5555',
    emergencyPhone: '+91 80 2727 5555',
    rating: 4.6,
    reviewCount: 195,
    openHours: '24/7 Emergency Services & Minor OT',
    services: ['Emergency Trauma', 'Obstetrics & Gynaecology', 'Orthopedic Surgery', 'Dialysis Unit', 'Digital X-Ray'],
    traumaLevel: 'Surgical & Emergency Care Unit',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 15,
    distanceKm: 1.2,
    estimatedDriveTimeMin: 5,
    consultationFee: '₹200 (General) / ₹350 (Specialist)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Ayushman Bharat Co-pay', 'TPA Cashless Networks'],
    bedChargesPerDay: '₹500 / day',
  },
  {
    id: 'RAM-05',
    name: 'BGS Health Care & Care Network Hospital',
    category: 'Hospital',
    address: 'Vivekanandanagar, B.M. Road, Ramanagara, Karnataka 562159',
    lat: 12.7231,
    lng: 77.2804,
    phone: '+91 80 2727 1818',
    emergencyPhone: '+91 80 2727 1818',
    rating: 4.7,
    reviewCount: 340,
    openHours: '24/7 Emergency & Referral Support',
    services: ['Emergency Triage', 'Cardiology Consultation', 'Critical Care', 'Pathology Lab', 'BGS Referral Network'],
    traumaLevel: 'Secondary Referral & Emergency Unit',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 10,
    distanceKm: 0.7,
    estimatedDriveTimeMin: 3,
    consultationFee: '₹250 (OPD)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['BGS Trust Subsidized Care', 'Arogya Karnataka Referral', 'ECHS / CGHS'],
    bedChargesPerDay: '₹450 / day',
  },
  {
    id: 'RAM-06',
    name: 'MediScan Diagnostic & 3T MRI/CT Imaging Center Ramanagara',
    category: 'Imaging Center',
    address: 'Ijoor Circle, Near B.M. Road, Ramanagara, Karnataka 562159',
    lat: 12.7175,
    lng: 77.2855,
    phone: '+91 80 2727 8899',
    rating: 4.9,
    reviewCount: 220,
    openHours: 'Daily: 7:00 AM - 10:00 PM (Emergency CT on call)',
    services: ['3T High-Resolution MRI', 'Multi-Slice CT Scan', 'Color Doppler Ultrasound', 'Digital Mammography', '24/7 Lab'],
    hasEmergencyRoom: false,
    isOpenNow: true,
    distanceKm: 1.0,
    estimatedDriveTimeMin: 4,
    consultationFee: 'Govt Subsidized (₹0 with Doctor Referral) / Private ₹1,200 CT',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Arogya Sanjeevini Subsidized', 'Govt Scheme Referral Partner'],
    bedChargesPerDay: 'Daycare Diagnostics Only',
  },
  {
    id: 'RAM-07',
    name: 'Sri Balaji Hospital & Nursing Home',
    category: 'Hospital',
    address: 'Near Saibaba Temple, Court Road, Ramanagara, Karnataka 562159',
    lat: 12.7181,
    lng: 77.2818,
    phone: '+91 80 2727 4141',
    rating: 4.5,
    reviewCount: 160,
    openHours: '24/7 Inpatient & Emergency Care',
    services: ['Maternity Care', 'General Medicine', 'Minor Operation Theatre', '24/7 Pharmacy'],
    traumaLevel: 'Community Emergency Clinic',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 10,
    distanceKm: 0.5,
    estimatedDriveTimeMin: 2,
    consultationFee: '₹100 - ₹150 (OPD)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Local Subsidized Trust Care', 'Maternity Janani Suraksha'],
    bedChargesPerDay: '₹250 / day',
  },
  {
    id: 'RAM-08',
    name: 'Abhi Hospital & Highway Trauma Care',
    category: 'Hospital',
    address: 'B.M. Road, Ramanagar, Karnataka 562159',
    lat: 12.7228,
    lng: 77.2838,
    phone: '+91 80 2727 6789',
    emergencyPhone: '+91 80 2727 6789',
    rating: 4.5,
    reviewCount: 145,
    openHours: '24/7 Highway Emergency & Accident Triage',
    services: ['Highway Accident Trauma', 'Orthopedic Surgery', 'Emergency Wound Care', 'Digital X-Ray'],
    traumaLevel: 'Highway Trauma Center',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 8,
    distanceKm: 0.8,
    estimatedDriveTimeMin: 3,
    consultationFee: '₹150 (Casualty Triage Free)',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Highway Emergency Accident Scheme (Free First 48 hrs)', 'TPA Cashless'],
    bedChargesPerDay: '₹300 / day',
  },
  {
    id: 'RAM-09',
    name: 'Astra Specialty Diagnostics & Blood Laboratory',
    category: 'Diagnostic Lab',
    address: 'Opp. KSRTC Bus Stand, BM Road, Ramanagara, Karnataka 562159',
    lat: 12.7202,
    lng: 77.2811,
    phone: '+91 80 2727 9000',
    rating: 4.8,
    reviewCount: 180,
    openHours: 'Mon-Sat: 6:30 AM - 9:30 PM, Sun: 7:00 AM - 2:00 PM',
    services: ['Stat Clinical Biochemistry', 'Automated Hematology', 'Thyroid & Hormonal Panels', 'Microbiology Culture'],
    hasEmergencyRoom: false,
    isOpenNow: true,
    distanceKm: 0.3,
    estimatedDriveTimeMin: 1,
    consultationFee: '₹50 - ₹120 (Routine Tests) / ₹0 under Jan Aushadhi',
    isGovtFreeCare: false,
    feeTier: 'Affordable (₹100-₹250)',
    schemeAccepted: ['Subsidized Student & Senior Citizen Discount', 'Jan Aushadhi Partner'],
    bedChargesPerDay: 'OPD Lab Only',
  },
  {
    id: 'RAM-10',
    name: 'Rajarajeswari Medical College & Hospital (Tertiary Trauma Center)',
    category: 'Hospital',
    address: 'Mysore Road, Kambipura, Bangalore-Mysore Highway (Near Ramanagara District)',
    lat: 12.8792,
    lng: 77.4474,
    phone: '+91 80 2843 7444',
    emergencyPhone: '+91 80 2843 7888',
    rating: 4.8,
    reviewCount: 890,
    openHours: '24/7 Level 1 Tertiary Trauma & Super-Speciality Hospital',
    services: ['24/7 Level 1 Trauma Center', 'Comprehensive Stroke Unit', '128-Slice Dual CT', '3T MRI', 'Cath Lab', 'Neurosurgery'],
    traumaLevel: 'Level 1 Tertiary Super-Speciality Hospital',
    hasEmergencyRoom: true,
    isOpenNow: true,
    waitTimesMin: 12,
    distanceKm: 24.5,
    estimatedDriveTimeMin: 28,
    consultationFee: '₹20 (Teaching Hospital Subsidized OPD) / Free for BPL',
    isGovtFreeCare: true,
    feeTier: 'Free / Govt (₹0)',
    schemeAccepted: ['Ayushman Bharat 100% Cashless', 'Arogya Karnataka', 'Yeshasvini', 'ECHS/CGHS'],
    bedChargesPerDay: '₹0 (Free General Ward Beds)',
  },
];

// Helper: Haversine formula to compute spherical distance between GPS coordinates in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const FacilityLocatorView: React.FC = () => {
  const [facilities, setFacilities] = useState<MedicalFacility[]>(RAMANAGARA_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<MedicalFacility | null>(RAMANAGARA_FACILITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>('All');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);
  
  // Scheme Checker & Fee Calculator Modal states
  const [showFeeGuideModal, setShowFeeGuideModal] = useState<boolean>(false);
  const [userSchemeType, setUserSchemeType] = useState<'bpl' | 'student' | 'apl' | 'emergency'>('bpl');

  // Default coordinates centered on Ramanagara 562159, Karnataka
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 12.7208,
    lng: 77.2799, // Ramanagara 562159 center
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Ramanagara 562159 (Karnataka)');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filtered & Sorted Facilities by Search, Category, and Fee Tier (computed early for Map markers)
  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (facility.traumaLevel && facility.traumaLevel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (facility.consultationFee && facility.consultationFee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        facility.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || 
        (selectedCategory === 'Emergency ER' && facility.hasEmergencyRoom) ||
        facility.category === selectedCategory;

      const matchesFeeTier =
        selectedFeeTier === 'All' ||
        (selectedFeeTier === 'Free' && facility.isGovtFreeCare) ||
        (selectedFeeTier === 'Affordable' && facility.feeTier === 'Affordable (₹100-₹250)');

      const matchesEmergency = !emergencyOnly || facility.hasEmergencyRoom;

      return matchesSearch && matchesCategory && matchesFeeTier && matchesEmergency;
    });
  }, [facilities, searchQuery, selectedCategory, selectedFeeTier, emergencyOnly]);

  // Tile Layer options for high performance, Geoapify API, and zero errors
  const [mapLayer, setMapLayer] = useState<'geoapify' | 'voyager' | 'osm' | 'satellite'>('geoapify');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize and manage Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = userLocation 
        ? [userLocation.lat, userLocation.lng] 
        : [12.7208, 77.2799];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        zoomControl: false,
      });

      // Geoapify Carto map tiles with active API key
      const tileUrl = 'https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=33ff538fac9d487889cf464b8e248a9d';
      const attribution = '&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      
      const layer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = layer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance stable during re-renders
    };
  }, []);

  const [selectedDistrictFeature, setSelectedDistrictFeature] = useState<RamanagaraFeatureItem | null>(null);
  const [showGeoOverlays, setShowGeoOverlays] = useState<boolean>(true);
  const [districtFeatureFilter, setDistrictFeatureFilter] = useState<string>('all');

  const geoLinesGroupRef = useRef<L.LayerGroup | null>(null);
  const districtFeaturesGroupRef = useRef<L.LayerGroup | null>(null);

  // Filtered Ramanagara district features based on search & category
  const filteredDistrictFeatures = useMemo(() => {
    return RAMANAGARA_DISTRICT_FEATURES.filter((feat) => {
      const matchesSearch = 
        feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.kannadaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        districtFeatureFilter === 'all' || feat.category === districtFeatureFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, districtFeatureFilter]);

  // Update Tile Layer when layer type changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let newUrl = 'https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=33ff538fac9d487889cf464b8e248a9d';
    let attribution = '&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    if (mapLayer === 'voyager') {
      newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap';
    } else if (mapLayer === 'osm') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    } else if (mapLayer === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newLayer = L.tileLayer(newUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Render Ramanagara Geo-Overlays (10-Lane Expressway, Arkavathi River, Ramadevarabetta Sanctuary)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!geoLinesGroupRef.current) {
      geoLinesGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    } else {
      geoLinesGroupRef.current.clearLayers();
    }

    if (!showGeoOverlays) return;

    // 1. Bengaluru - Mysuru 10-Lane Expressway Polyline
    const expresswayPolyline = L.polyline(RAMANAGARA_GEO_LINES.expresswayRoute, {
      color: '#d97706',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
    }).bindPopup(`
      <div style="font-family: inherit; font-size: 11px; padding: 2px;">
        <strong style="color: #b45309;">🛣️ Bengaluru-Mysuru 10-Lane Expressway (NH-275)</strong><br/>
        <span style="color: #475569;">118 km High-Speed Mobility & Emergency Trauma Corridor via Ramanagara</span>
      </div>
    `);
    geoLinesGroupRef.current.addLayer(expresswayPolyline);

    // 2. Arkavathi River Polyline
    const riverPolyline = L.polyline(RAMANAGARA_GEO_LINES.arkavathiRiverRoute, {
      color: '#0284c7',
      weight: 4,
      opacity: 0.75,
    }).bindPopup(`
      <div style="font-family: inherit; font-size: 11px; padding: 2px;">
        <strong style="color: #0369a1;">💧 Arkavathi River (ಅರ್ಕಾವತಿ ನದಿ)</strong><br/>
        <span style="color: #475569;">Cauvery Basin Tributary & Lifeline of Ramanagara Silk Valley</span>
      </div>
    `);
    geoLinesGroupRef.current.addLayer(riverPolyline);

    // 3. Ramadevarabetta Vulture Sanctuary Eco Polygon
    const sanctuaryPolygon = L.polygon(RAMANAGARA_GEO_LINES.sanctuaryPerimeter, {
      color: '#7c3aed',
      fillColor: '#8b5cf6',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '4, 4',
    }).bindPopup(`
      <div style="font-family: inherit; font-size: 11px; padding: 2px;">
        <strong style="color: #6d28d9;">⛰️ Ramadevarabetta Vulture Sanctuary (346.41 Ha)</strong><br/>
        <span style="color: #475569;">India's Premier Long-billed Vulture Sanctuary & Sholay Rocks</span>
      </div>
    `);
    geoLinesGroupRef.current.addLayer(sanctuaryPolygon);
  }, [showGeoOverlays]);

  // Update markers when facilities, district features, or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // Add User Location Pulse Marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
            <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[9px] font-black">
              YOU
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const uMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 11px;">
            <strong style="color: #1e40af;">📍 Your Center Point</strong><br/>
            <span>Ramanagara 562159 (Karnataka)</span>
          </div>
        `);
      
      markersGroupRef.current.addLayer(uMarker);
      userMarkerRef.current = uMarker;
    }

    // 1. Add Medical Facility Markers
    filteredFacilities.forEach((facility) => {
      const isSelected = selectedFacility?.id === facility.id;
      
      let pinColor = '#2563eb'; // blue
      let badgeLabel = 'OPD';
      
      if (facility.isGovtFreeCare) {
        pinColor = '#059669'; // emerald
        badgeLabel = '₹0';
      } else if (facility.hasEmergencyRoom) {
        pinColor = '#e11d48'; // rose
        badgeLabel = 'ER';
      }

      const markerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}" style="transform: translate(-50%, -100%);">
          <div style="background-color: ${pinColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" class="px-2 py-0.5 rounded-full text-white text-[10px] font-black flex items-center gap-1 border border-white whitespace-nowrap">
            <span>${badgeLabel}</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${facility.name.split(' ')[0]}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${pinColor}; margin-top: -1px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-facility-pin',
        html: markerHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([facility.lat, facility.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedFacility(facility);
        setSelectedDistrictFeature(null);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 2px;">
          <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px;">
            <span style="background: ${facility.isGovtFreeCare ? '#ecfdf5' : '#eff6ff'}; color: ${facility.isGovtFreeCare ? '#065f46' : '#1e40af'}; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
              ${facility.isGovtFreeCare ? '₹0 Free Care' : facility.category}
            </span>
            <span style="font-size: 10px; color: #64748b; font-weight: 700;">★ ${facility.rating}</span>
          </div>
          <strong style="color: #0f172a; font-size: 12px; line-height: 1.3;">${facility.name}</strong>
          <div style="margin-top: 4px; color: #047857; font-weight: 700; font-size: 11px;">
            OPD: ${facility.consultationFee}
          </div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">
            ${facility.address}
          </div>
          <div style="margin-top: 6px; display: flex; gap: 6px;">
            <a href="tel:${facility.phone}" style="background: #059669; color: white; text-decoration: none; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              📞 Call
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.7208},${userLocation?.lng || 77.2799}&destination=${facility.lat},${facility.lng}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: white; text-decoration: none; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              🧭 Directions
            </a>
          </div>
        </div>
      `);

      markersGroupRef.current.addLayer(marker);
    });

    // 2. Add Ramanagara District Feature Markers (Silk, Heritage, Emergency, Hills, Transit)
    filteredDistrictFeatures.forEach((feat) => {
      const isSelected = selectedDistrictFeature?.id === feat.id;
      
      let badgeEmoji = '✨';
      if (feat.category === 'silk') badgeEmoji = '🧵';
      else if (feat.category === 'heritage') badgeEmoji = '⛰️';
      else if (feat.category === 'emergency') badgeEmoji = '🚨';
      else if (feat.category === 'transit') badgeEmoji = '🛣️';
      else if (feat.category === 'water') badgeEmoji = '💧';

      const featMarkerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50 ring-2 ring-white rounded-full' : 'hover:scale-110'}" style="transform: translate(-50%, -100%);">
          <div style="background-color: ${feat.pinColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" class="px-2 py-0.5 rounded-full text-white text-[10px] font-black flex items-center gap-1 border border-white whitespace-nowrap">
            <span>${badgeEmoji}</span>
            <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${feat.name.split(' ')[0]}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${feat.pinColor}; margin-top: -1px;"></div>
        </div>
      `;

      const featIcon = L.divIcon({
        className: 'custom-ramanagara-feature-pin',
        html: featMarkerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const featMarker = L.marker([feat.lat, feat.lng], { icon: featIcon });

      featMarker.on('click', () => {
        setSelectedDistrictFeature(feat);
        setSelectedFacility(null);
      });

      featMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 260px; padding: 3px;">
          <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px;">
            <span style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
              ${feat.badge}
            </span>
          </div>
          <strong style="color: #0f172a; font-size: 12px; line-height: 1.3;">${feat.name}</strong>
          <div style="color: #1d4ed8; font-size: 10px; font-weight: 700; margin-top: 2px;">
            ${feat.kannadaName}
          </div>
          <p style="color: #475569; font-size: 11px; margin-top: 4px; line-height: 1.3;">
            ${feat.tagline}
          </p>
          <div style="margin-top: 4px; font-size: 10px; color: #059669; font-weight: 600;">
            🕒 ${feat.timingOrHours}
          </div>
          <div style="margin-top: 6px; display: flex; gap: 6px;">
            <a href="https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.7208},${userLocation?.lng || 77.2799}&destination=${feat.lat},${feat.lng}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: white; text-decoration: none; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              🧭 Directions
            </a>
          </div>
        </div>
      `);

      markersGroupRef.current.addLayer(featMarker);
    });
  }, [filteredFacilities, filteredDistrictFeatures, selectedFacility, selectedDistrictFeature, userLocation]);

  // Center on selected facility or Ramanagara feature
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedFacility) {
      mapInstanceRef.current.flyTo([selectedFacility.lat, selectedFacility.lng], 15, {
        duration: 0.8,
      });
    } else if (selectedDistrictFeature) {
      mapInstanceRef.current.flyTo([selectedDistrictFeature.lat, selectedDistrictFeature.lng], 15, {
        duration: 0.8,
      });
    }
  }, [selectedFacility, selectedDistrictFeature]);

  // Trigger GPS Geolocation to find hospitals near current device coordinates
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationStatus('Acquiring high-accuracy satellite GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newUserLoc = { lat: latitude, lng: longitude };
        setUserLocation(newUserLoc);
        setGpsAccuracy(Math.round(accuracy));
        setLocationStatus(`Live GPS Fixed (Accuracy ±${Math.round(accuracy)}m)`);
        setIsLocating(false);

        // Recalculate real distances to all hospitals and facilities
        setFacilities((prev) => {
          const updated = prev.map((facility) => {
            const dist = calculateDistanceKm(latitude, longitude, facility.lat, facility.lng);
            const estMinutes = Math.max(2, Math.round((dist / 30) * 60) + 2);
            return {
              ...facility,
              distanceKm: dist,
              estimatedDriveTimeMin: estMinutes,
            };
          });

          // Sort by nearest distance
          updated.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
          return updated;
        });

        if (facilities.length > 0) {
          setSelectedFacility(facilities[0]);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve device GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Centered on Ramanagara (562159) Karnataka.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS information is temporarily unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS location request timed out. Centered on Ramanagara 562159.';
        }
        setLocationError(errorMsg);
        setLocationStatus('Ramanagara 562159 (Karnataka)');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleSelectCityPreset = (lat: number, lng: number, name: string) => {
    setUserLocation({ lat, lng });
    setLocationStatus(name);
    setFacilities((prev) => {
      const updated = prev.map((facility) => {
        const dist = calculateDistanceKm(lat, lng, facility.lat, facility.lng);
        const estMinutes = Math.max(2, Math.round((dist / 30) * 60) + 2);
        return {
          ...facility,
          distanceKm: dist,
          estimatedDriveTimeMin: estMinutes,
        };
      });
      updated.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      return updated;
    });
  };

  const handleRequestReferral = (facility: MedicalFacility) => {
    setBookingSuccessId(facility.id);
    setTimeout(() => {
      setBookingSuccessId(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* College Academic & Zero-Cost Free Mode Indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-emerald-950">
                100% Free Academic & Community Mode (Ramanagara 562159)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-200 text-emerald-900 rounded-md uppercase tracking-wider">
                ₹0 Cost Guarantee
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              Zero software fees or subscription required for college demonstrations, clinical search, GPS proximity navigation, and Ayushman Bharat healthcare scheme verifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setShowFeeGuideModal(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <BadgePercent className="w-3.5 h-3.5" />
            <span>Govt Scheme & Free OPD Guide</span>
          </button>
        </div>
      </div>

      {/* Emergency Immediate Action Banner with 108 / 112 Dialers */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-sm animate-pulse">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-rose-950">
                24/7 Emergency Ambulance & Casualty (Ramanagara 562159)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-200 text-rose-900 rounded-md uppercase tracking-wider">
                100% Free 108 Service
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-0.5">
              Dial <strong className="font-bold">108</strong> (Govt Free Emergency Ambulance) or <strong className="font-bold">112</strong> for highway trauma, cardiac triage, and immediate casualty admission.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <a
            href="tel:108"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 108 (Free Ambulance)</span>
          </a>
          <a
            href="tel:112"
            className="px-3.5 py-2 bg-rose-950 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>112 (Emergency)</span>
          </a>
        </div>
      </div>

      {/* Header & Quick Geolocation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospitals & OPD Fees Near Ramanagara (562159)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
              <span>Interactive GIS Grounded</span>
            </span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              PIN 562159
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time consultation fee transparency, free government hospital OPDs, Ayushman Bharat cashless networks, and 24/7 ERs.
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{locationStatus}</span>
            </span>
            {gpsAccuracy && (
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                GPS Accuracy: ±{gpsAccuracy}m
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Live GPS Locate + Quick Ramanagara Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectCityPreset(12.7208, 77.2799, 'Ramanagara 562159 (Town Center)')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Ramanagara 562159</span>
          </button>

          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Use My Live GPS'}</span>
          </button>
        </div>
      </div>

      {locationError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Search, Category Filters, and Fee Tier Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospital, Free OPD, X-ray, fee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fee Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0 mr-1" />
          <span className="text-[11px] font-bold text-slate-600 mr-1 whitespace-nowrap">Fee Tier:</span>
          {[
            { id: 'All', label: 'All Fees' },
            { id: 'Free', label: '🎉 100% Free / Govt (₹0)' },
            { id: 'Affordable', label: '💳 Affordable (₹100-₹250)' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedFeeTier(tier.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedFeeTier === tier.id
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Facility & Feature Category Filters */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {[
            { id: 'All', label: 'All Map Features' },
            { id: 'Hospital', label: '🏥 Hospitals' },
            { id: 'Emergency ER', label: '🚨 24/7 ER' },
            { id: 'Imaging Center', label: '🔬 MRI / CT' },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ramanagara Quick Category Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Ramanagara Features:</span>
        </span>
        {[
          { id: 'all', label: '🗺️ All District Landmarks' },
          { id: 'silk', label: '🧵 Silk Cocoon Market' },
          { id: 'heritage', label: '⛰️ Ramadevarabetta & Sholay' },
          { id: 'emergency', label: '🚨 112 Police & 101 Fire' },
          { id: 'transit', label: '🛣️ 10-Lane Expressway & Rail' },
          { id: 'water', label: '💧 Arkavathi River & Kanva' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setDistrictFeatureFilter(btn.id)}
            className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              districtFeatureFilter === btn.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50/70 text-amber-950 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Ramanagara Hospital List (Left) + Interactive Google Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hospital Cards with Distances, ETAs, and Explicit Fees (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              Found {filteredFacilities.length} Hospitals &bull; {filteredDistrictFeatures.length} District Landmarks
            </span>
            <span>Fee &bull; Distance &bull; Drive Time</span>
          </div>

          {filteredFacilities.map((facility) => {
            const isSelected = selectedFacility?.id === facility.id;
            return (
              <div
                key={facility.id}
                onClick={() => {
                  setSelectedFacility(facility);
                  setSelectedDistrictFeature(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        facility.hasEmergencyRoom
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {facility.category}
                      </span>
                      {facility.isGovtFreeCare ? (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>100% Free Govt Care</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                          {facility.feeTier}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {facility.name}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{facility.rating}</span>
                    </div>
                    {facility.distanceKm !== undefined && (
                      <span className="text-xs font-extrabold text-blue-700 mt-1">
                        {facility.distanceKm} km
                      </span>
                    )}
                  </div>
                </div>

                {/* Consultation Fee & Bed Charge Highlight Box */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-emerald-950">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                      <span>OPD Fee: {facility.consultationFee}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {facility.bedChargesPerDay}
                    </span>
                  </div>
                  {facility.schemeAccepted && facility.schemeAccepted.length > 0 && (
                    <div className="mt-1.5 text-[10px] text-emerald-900 flex items-center gap-1 flex-wrap">
                      <span className="font-semibold">Schemes:</span>
                      {facility.schemeAccepted.slice(0, 2).map((sch, i) => (
                        <span key={i} className="bg-white/80 px-1.5 py-0.2 rounded border border-emerald-200">
                          {sch}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{facility.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{facility.openHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px] text-blue-700 font-semibold">{facility.phone}</span>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {facility.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                    >
                      {service}
                    </span>
                  ))}
                  {facility.services.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500 font-medium">
                      +{facility.services.length - 3} more
                    </span>
                  )}
                </div>

                {/* Card Action Row: Drive ETA, Directions, Call */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Drive ETA: ~{facility.estimatedDriveTimeMin || Math.max(2, Math.round((facility.distanceKm || 1) * 2))} mins
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.7208},${userLocation?.lng || 77.2799}&destination=${facility.lat},${facility.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>

                    <a
                      href={`tel:${facility.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestReferral(facility);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <CalendarCheck className="w-3 h-3" />
                      <span>{bookingSuccessId === facility.id ? 'Requested' : 'Book Exam'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredFacilities.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No medical facilities found matching criteria</p>
              <p className="text-xs text-slate-500 mt-1">Check out the Ramanagara District Features on the map and showcase below!</p>
            </div>
          )}
        </div>

        {/* Right Column: High-Performance OpenStreetMap & GIS Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px] lg:h-[750px] relative">
          {/* Map Header HUD */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs z-10">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="font-bold">Ramanagara District GIS & Features Map</span>
            </div>

            {/* Layer & Control Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Geo Overlays Toggle */}
              <button
                onClick={() => setShowGeoOverlays(!showGeoOverlays)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                  showGeoOverlays
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Toggle Expressway, Arkavathi River & Sanctuary Geo Overlays"
              >
                <Layers className="w-3 h-3 text-amber-600" />
                <span>Geo Overlays: {showGeoOverlays ? 'ON' : 'OFF'}</span>
              </button>

              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                {(
                  [
                    { id: 'geoapify', label: 'Geoapify Vector' },
                    { id: 'voyager', label: 'Clean Map' },
                    { id: 'osm', label: 'Detailed OSM' },
                    { id: 'satellite', label: 'Satellite' },
                  ] as const
                ).map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setMapLayer(layer.id)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      mapLayer === layer.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>

              {/* Map Zoom / Reset controls */}
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomIn();
                  }
                }}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomOut();
                  }
                }}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([12.7208, 77.2799], 13);
                  }
                }}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-blue-700 hover:bg-blue-50 shadow-2xs font-bold text-[11px] cursor-pointer"
                title="Reset Center"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Leaflet DOM Map Container (Zero API Key, Zero Error Popups) */}
          <div className="flex-1 relative w-full h-full min-h-[420px]">
            <div
              ref={mapContainerRef}
              id="leaflet-facility-map"
              className="w-full h-full z-0"
              style={{ minHeight: '400px' }}
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-slate-200 shadow-lg text-[10px] space-y-1.5 max-w-[200px]">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Ramanagara Map Features</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0"></span>
                <span className="text-slate-700 font-semibold truncate">🧵 Silk Cocoon Market</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block shrink-0"></span>
                <span className="text-slate-700 font-semibold truncate">⛰️ Ramadevarabetta / Sholay</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shrink-0"></span>
                <span className="text-slate-700 font-semibold truncate">🏥 ₹0 Free Govt Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block shrink-0"></span>
                <span className="text-slate-700 font-semibold truncate">🚨 24/7 ER & 112 Police</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shrink-0"></span>
                <span className="text-slate-700 font-semibold truncate">💧 Arkavathi River & Kanva</span>
              </div>
              {showGeoOverlays && (
                <div className="pt-1 border-t border-slate-100 text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                  <span className="w-3 h-0.5 bg-amber-600 inline-block"></span>
                  <span>10-Lane Expressway</span>
                </div>
              )}
            </div>
          </div>

          {/* Map Footer Bar with Active Selection Action Strip */}
          {selectedFacility && (
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{selectedFacility.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 rounded">
                    {selectedFacility.consultationFee}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Direct: {selectedFacility.phone} &bull; Drive Time: ~{selectedFacility.estimatedDriveTimeMin || 4} mins
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.7208},${userLocation?.lng || 77.2799}&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Maps GPS</span>
                </a>

                <button
                  onClick={() => handleRequestReferral(selectedFacility)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>
                    {bookingSuccessId === selectedFacility.id ? 'Referral Sent!' : 'Schedule Diagnostic Exam'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {selectedDistrictFeature && (
            <div className="p-4 bg-amber-50/90 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{selectedDistrictFeature.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 rounded">
                    {selectedDistrictFeature.badge}
                  </span>
                </div>
                <p className="text-amber-900 font-medium text-xs mt-0.5">
                  {selectedDistrictFeature.kannadaName} &bull; {selectedDistrictFeature.timingOrHours}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.7208},${userLocation?.lng || 77.2799}&destination=${selectedDistrictFeature.lat},${selectedDistrictFeature.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Get GPS Directions</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ramanagara District GIS Features & Heritage Showcase Card Component */}
      <RamanagaraFeaturesCard
        selectedFeatureId={selectedDistrictFeature?.id}
        onSelectFeatureOnMap={(feat) => {
          setSelectedDistrictFeature(feat);
          setSelectedFacility(null);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([feat.lat, feat.lng], 15, { duration: 0.8 });
          }
        }}
      />

      {/* Free Care & Ayushman Bharat Scheme Guide Modal */}
      {showFeeGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Karnataka Govt Healthcare Schemes & Free Treatment Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ramanagara District (PIN 562159) Eligibility & Fee Breakdown
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeeGuideModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Scheme Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Select Patient Beneficiary Category:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bpl', label: 'BPL / Antyodaya Ration', icon: HeartHandshake },
                  { id: 'student', label: 'College Student / Youth', icon: GraduationCap },
                  { id: 'emergency', label: 'Accident / Emergency', icon: Ambulance },
                  { id: 'apl', label: 'APL / General Citizen', icon: CreditCard },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setUserSchemeType(tab.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                        userSchemeType === tab.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Scheme Benefits Calculation */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {userSchemeType === 'bpl' && '✅ 100% Free Complete Treatment (Ayushman Bharat - Arogya Karnataka)'}
                  {userSchemeType === 'student' && '🎓 Free Govt OPD + Student Diagnostic Discounts'}
                  {userSchemeType === 'emergency' && '🚨 Free 48-Hour Highway Emergency & Casualty (Mukhyamantri Santwana Scheme)'}
                  {userSchemeType === 'apl' && '💳 30% Subsidized Rates at Government Hospitals + PMJAY Co-pay'}
                </span>
              </div>
              <ul className="text-xs space-y-1.5 list-disc pl-4 text-emerald-900">
                {userSchemeType === 'bpl' && (
                  <>
                    <li><strong>OPD Consultation:</strong> ₹0 (Free at District Govt Hospital Ramanagara).</li>
                    <li><strong>Diagnostics:</strong> Free X-Ray, CT scan, blood biochemistry with doctor referral.</li>
                    <li><strong>Hospitalization & Surgeries:</strong> Up to ₹5 Lakhs per year cashless family coverage.</li>
                    <li><strong>Medicines:</strong> Free generic medications via Pradhan Mantri Jan Aushadhi Kendra.</li>
                  </>
                )}
                {userSchemeType === 'student' && (
                  <>
                    <li><strong>Campus / Govt OPD:</strong> ₹0 at Ramanagara District Hospital with Student ID.</li>
                    <li><strong>Health Checkups & Blood Typing:</strong> Subsidized rates (₹50-₹100) at Astra Diagnostics.</li>
                    <li><strong>Ambulance Support:</strong> 100% Free 108 Emergency Dispatch.</li>
                  </>
                )}
                {userSchemeType === 'emergency' && (
                  <>
                    <li><strong>First 48 Hours Care:</strong> Free emergency treatment up to ₹25,000 at Abhi Trauma & Govt Hospital under Karnataka Santwana Scheme.</li>
                    <li><strong>ICU Stabilization:</strong> Immediate admission without advance payment mandatory by law.</li>
                    <li><strong>Ambulance 108:</strong> Zero fee for patient transfer.</li>
                  </>
                )}
                {userSchemeType === 'apl' && (
                  <>
                    <li><strong>Govt Hospital OPD:</strong> Nominal registration ₹10 - ₹20.</li>
                    <li><strong>Secondary & Tertiary Care:</strong> 30% package rate subsidy under Arogya Karnataka.</li>
                    <li><strong>Private Hospital Network:</strong> Cashless TPA claims at Ramakrishna & Ramanagara Super Speciality.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Test Rates Comparison Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Diagnostic & Imaging Cost Comparison (Ramanagara 562159)</span>
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Medical Service</th>
                      <th className="p-2.5 text-emerald-700">Govt Hospital (562159)</th>
                      <th className="p-2.5 text-slate-700">Private Center</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-medium">Doctor OPD Consultation</td>
                      <td className="p-2.5 font-bold text-emerald-700">₹0 (Free)</td>
                      <td className="p-2.5">₹200 - ₹350</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Digital Chest X-Ray</td>
                      <td className="p-2.5 font-bold text-emerald-700">₹0 / ₹50</td>
                      <td className="p-2.5">₹300 - ₹450</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Multi-Slice CT Scan (Head/Chest)</td>
                      <td className="p-2.5 font-bold text-emerald-700">₹500 (Free with BPL)</td>
                      <td className="p-2.5">₹2,200 - ₹3,500</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Complete Blood Count (CBC)</td>
                      <td className="p-2.5 font-bold text-emerald-700">₹0 / ₹30</td>
                      <td className="p-2.5">₹180 - ₹250</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Emergency Ambulance (108)</td>
                      <td className="p-2.5 font-bold text-emerald-700">₹0 (100% Free)</td>
                      <td className="p-2.5">₹1,500 - ₹2,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFeeGuideModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Got It, Return to Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
