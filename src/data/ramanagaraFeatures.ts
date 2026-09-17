export interface RamanagaraFeatureItem {
  id: string;
  name: string;
  kannadaName: string;
  category: 'heritage' | 'silk' | 'transit' | 'emergency' | 'healthcare' | 'water';
  categoryLabel: string;
  badge: string;
  lat: number;
  lng: number;
  tagline: string;
  description: string;
  highlights: string[];
  timingOrHours: string;
  contact?: string;
  emergencyContact?: string;
  ticketOrFee?: string;
  iconName: 'mountain' | 'silk' | 'bus' | 'shield' | 'hospital' | 'water' | 'museum' | 'flame';
  pinColor: string;
}

export const RAMANAGARA_DISTRICT_FEATURES: RamanagaraFeatureItem[] = [
  {
    id: 'RAM-FEAT-01',
    name: 'Govt Silk Cocoon Market Ramanagara',
    kannadaName: 'ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಗೂಡು ಮಾರುಕಟ್ಟೆ (ರೇಷ್ಮೆ ನಗರಿ)',
    category: 'silk',
    categoryLabel: 'Silk City of India Hub',
    badge: "Asia's Largest Silk Market",
    lat: 12.7265,
    lng: 77.2835,
    tagline: "Asia's premier automated silk cocoon trading & auction floor",
    description: 'Ramanagara is globally celebrated as the "Silk City" of India. This massive government market handles over 40-50 metric tonnes of high-grade mulberry silk cocoons daily from farmers across Karnataka and neighboring states with modern electronic bidding.',
    highlights: ['40-50 Tonnes Daily Trading Volume', 'Modern e-Auction Floor', 'Direct Farmer Remittance', 'Mulberry Research Support'],
    timingOrHours: 'Daily: 6:00 AM - 4:00 PM (Auction from 8:00 AM)',
    contact: '+91 80 2727 1500 (Dept of Sericulture)',
    ticketOrFee: 'Free entry for licensed traders & visiting students',
    iconName: 'silk',
    pinColor: '#d97706', // amber/gold
  },
  {
    id: 'RAM-FEAT-02',
    name: 'Ramadevarabetta Vulture Sanctuary & Sholay Hill',
    kannadaName: 'ರಾಮದೇವರ ಬೆಟ್ಟ & ರಣಹದ್ದು ಸಂರಕ್ಷಣಾ ಧಾಮ',
    category: 'heritage',
    categoryLabel: 'Geological Wonder & Wildlife Sanctuary',
    badge: "India's Only Vulture Sanctuary",
    lat: 12.7485,
    lng: 77.2982,
    tagline: 'Iconic 3.5-billion-year-old granitic pluton and endangered Long-billed Vulture haven',
    description: 'A 346.41-hectare eco-sensitive sanctuary safeguarding the endangered Long-billed and Egyptian Vultures. Historically famous as the filming location for the blockbuster movie "Sholay" (Ramgarh) and revered for the ancient Sri Pattabhirama Swamy Temple atop 400 stone steps.',
    highlights: ['Protected Long-billed Vulture Nesting Rocks', 'Iconic 1975 "Sholay" Movie Landmark', 'Ancient Sri Pattabhirama Temple (400 steps)', 'Rock Climbing & Eco-Trekking'],
    timingOrHours: 'Daily: 9:00 AM - 4:30 PM (Eco-Zone Rules Apply)',
    contact: 'Karnataka Forest Dept (Ramanagara Range)',
    ticketOrFee: '₹25 (Eco Tourism Entry)',
    iconName: 'mountain',
    pinColor: '#7c3aed', // purple
  },
  {
    id: 'RAM-FEAT-03',
    name: 'Janapada Loka (Folk Arts Heritage Academy)',
    kannadaName: 'ಜಾನಪದ ಲೋಕ (ಕರ್ನಾಟಕ ಜಾನಪದ ಅಕಾಡೆಮಿ)',
    category: 'heritage',
    categoryLabel: 'Folk Culture & Arts Museum',
    badge: '15-Acre Living Heritage Village',
    lat: 12.6958,
    lng: 77.2421,
    tagline: 'Expansive 15-acre museum preserving 5,000+ artifacts of rural Karnataka folk life',
    description: 'Founded by H.L. Nage Gowda, Janapada Loka ("Folk World") is a sprawling 15-acre complex showcasing traditional rural art, folk musical instruments, puppets, farming tools, and live Yakshagana performances.',
    highlights: ['Loka Mahal (Folk Utensils & Weaponry)', 'Chitra Kuteera (Rural Photo Archive)', 'Ayagaramala (Rural Cottage Artifacts)', 'Kamat Lokaruchi Cultural Dine Zone'],
    timingOrHours: 'Tuesday - Sunday: 9:00 AM - 5:30 PM (Closed on Tuesdays/Govt holidays)',
    contact: '+91 80 2720 1555',
    ticketOrFee: '₹50 (Adults) / ₹20 (Students)',
    iconName: 'museum',
    pinColor: '#0891b2', // cyan
  },
  {
    id: 'RAM-FEAT-04',
    name: 'Kanva Reservoir & Dam (Eco Wetland)',
    kannadaName: 'ಕಣ್ವ ಜಲಾಶಯ & ಪರಿಸರ ತಾಣ',
    category: 'water',
    categoryLabel: 'Arkavathi Basin Hydrology & Birding',
    badge: 'Scenic Wetland & Dam',
    lat: 12.7092,
    lng: 77.2023,
    tagline: 'Irrigation reservoir built in 1946 across Kanva River (Arkavathi tributary)',
    description: 'A serene body of water providing vital irrigation and potable water to Ramanagara agricultural taluks. Serves as a major winter haven for migratory wetland birds including pelicans, painted storks, and kingfishers.',
    highlights: ['Birdwatching & Pelican Roosting Site', 'Kanva Fisheries Research Unit', 'Purushothama Thirtha Gavi (Hermitage Cave)', 'Arkavathi Basin Watershed'],
    timingOrHours: 'Daily: 6:00 AM - 6:00 PM',
    contact: 'Water Resources Dept Ramanagara Sub-Division',
    ticketOrFee: 'Free Public Access',
    iconName: 'water',
    pinColor: '#0284c7', // sky blue
  },
  {
    id: 'RAM-FEAT-05',
    name: 'Bengaluru-Mysuru 10-Lane Expressway (NH-275) Corridor',
    kannadaName: 'ಬೆಂಗಳೂರು-ಮೈಸೂರು ದಶಪಥ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ (ರಾ.ಹೆ.-275)',
    category: 'transit',
    categoryLabel: 'High-Speed Interstate Mobility Corridor',
    badge: '118 km Access-Controlled Corridor',
    lat: 12.7150,
    lng: 77.2750,
    tagline: 'Modern 10-lane access-controlled expressway with Ramanagara Bypass & Trauma Corridor',
    description: 'The 118-km world-class highway connecting Bengaluru to Mysuru in 75 minutes. Features the dedicated Ramanagara-Channapatna Bypass, intelligent traffic management systems (ITMS), and rapid trauma ambulance staging zones.',
    highlights: ['75-Minute Bengaluru to Mysuru Transit', 'Ramanagara Elevated Bypass & Interchanges', 'Dedicated 24/7 Highway Patrol & Trauma 1033', 'Rest Area & Electric Vehicle Fast Charging'],
    timingOrHours: '24/7 Access-Controlled Expressway',
    contact: 'NHAI Emergency Helpline: 1033',
    ticketOrFee: 'FASTag Automated Electronic Toll',
    iconName: 'bus',
    pinColor: '#475569', // slate
  },
  {
    id: 'RAM-FEAT-06',
    name: 'Ramanagara District Police HQ & 112 Command Center',
    kannadaName: 'ಜಿಲ್ಲಾ ಪೊಲೀಸ್ ವರಿಷ್ಠಾಧಿಕಾರಿಗಳ ಕಚೇರಿ & 112 ಕಂಟ್ರೋಲ್ ರೂಂ',
    category: 'emergency',
    categoryLabel: 'District Law & Disaster Emergency',
    badge: '24/7 Civil Protection & 112 Hub',
    lat: 12.7251,
    lng: 77.2891,
    tagline: 'Unified District Emergency Command & Highway Quick Reaction Force',
    description: 'The central security and emergency response headquarters for Ramanagara district. Operates the integrated 112 dispatch system, CCTV surveillance grid across Silk Market, and GPS-enabled emergency patrol vehicles.',
    highlights: ['24/7 ERSS-112 Emergency Dispatch', 'Highway Quick Reaction Patrol Teams', 'Cyber Crime & Women Safety Cell', 'District Disaster Quick Response Team'],
    timingOrHours: '24/7 Emergency Police Services',
    contact: 'Emergency: 112 | Control Room: +91 80 2727 1210',
    emergencyContact: '112',
    iconName: 'shield',
    pinColor: '#dc2626', // red
  },
  {
    id: 'RAM-FEAT-07',
    name: 'Fire & Emergency Services Station Ramanagara',
    kannadaName: 'ಅಗ್ನಿಶಾಮಕ ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳ ಠಾಣೆ ರಾಮನಗರ',
    category: 'emergency',
    categoryLabel: 'Fire & Disaster Rescue Station',
    badge: '101 Quick Rescue Station',
    lat: 12.7188,
    lng: 77.2862,
    tagline: '24/7 specialized firefighting, industrial rescue & flood rescue operations',
    description: 'Equipped with heavy water tenders, foam crash tenders for highway accidents, hydraulic cutting tools for vehicle extraction, and trained water rescue divers for Arkavathi & Kanva rivers.',
    highlights: ['Highway Vehicle Extraction Equipment', 'River & Lake Water Rescue Squad', 'Silk Warehouse Fire Safety Audits', 'Industrial Disaster Quick Response'],
    timingOrHours: '24/7 Emergency Fire & Rescue Response',
    contact: 'Emergency: 101 | Station: +91 80 2727 2101',
    emergencyContact: '101',
    iconName: 'flame',
    pinColor: '#ea580c', // orange
  },
  {
    id: 'RAM-FEAT-08',
    name: 'Ramanagara KSRTC Central Bus Terminal & Inter-City Hub',
    kannadaName: 'ರಾಮನಗರ ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಕೇಂದ್ರೀಯ ಬಸ್ ನಿಲ್ದಾಣ',
    category: 'transit',
    categoryLabel: 'Inter-City Public Transit Node',
    badge: 'Primary District Transit Terminal',
    lat: 12.7202,
    lng: 77.2818,
    tagline: 'Round-the-clock KSRTC bus terminal connecting all 4 taluks and major state highways',
    description: 'Central hub offering continuous electric EV (EV-Power Plus), Flybus, and rural Sarige buses connecting Ramanagara with Bengaluru Majestic, Mysuru, Kanakapura, Channapatna, Magadi, and Kollegal.',
    highlights: ['24/7 Bengaluru-Mysuru Frequent Service', 'Taluk Rural Feeder Networks', 'EV Bus Charging Station', 'Pre-paid Auto & Taxi Stand'],
    timingOrHours: '24/7 Passenger Terminal Operations',
    contact: '+91 80 2727 1313 (KSRTC Enquiry)',
    iconName: 'bus',
    pinColor: '#059669', // emerald
  },
  {
    id: 'RAM-FEAT-09',
    name: 'Ramanagara Railway Junction (South Western Railway)',
    kannadaName: 'ರಾಮನಗರ ರೈಲ್ವೆ ನಿಲ್ದಾಣ (SBC-MYS ಡಬಲ್ ಟ್ರ್ಯಾಕ್)',
    category: 'transit',
    categoryLabel: 'Electrified Rail Corridor',
    badge: 'Station Code: RMGM',
    lat: 12.7248,
    lng: 77.2764,
    tagline: 'Main railway junction on the electrified Bengaluru-Mysuru high-speed double line',
    description: 'Key railway junction on South Western Railway serving MEMU suburban commuter trains, express trains (Vande Bharat, Shatabdi, Chamundi Express, Malgudi Express), providing rapid 45-min access to Bengaluru City Station.',
    highlights: ['MEMU Suburban Commuter Trains', 'Vande Bharat / Express Train Stoppages', 'Automated Ticketing & Free Wi-Fi', 'Direct Parcel Logistic for Silk & Handicrafts'],
    timingOrHours: '24/7 Railway Station Operations',
    contact: 'Railway Enquiry: 139',
    iconName: 'bus',
    pinColor: '#2563eb', // blue
  },
  {
    id: 'RAM-FEAT-10',
    name: 'Arkavathi River Waterfront & Valley',
    kannadaName: 'ಅರ್ಕಾವತಿ ನದಿ ಕಣಿವೆ',
    category: 'water',
    categoryLabel: 'River Hydrology & Natural Basin',
    badge: 'Cauvery River Basin',
    lat: 12.7230,
    lng: 77.2885,
    tagline: 'Lifeline river originating at Nandi Hills, flowing through Ramanagara into Cauvery',
    description: 'The historic Arkavathi River courses through the heart of Ramanagara town, nourishing the agricultural silk-mulberry belt and replenishing groundwater for the entire taluk before joining the Cauvery at Sangama.',
    highlights: ['Cauvery River Major Tributary', 'Mulberry Silk Farming Water Resource', 'Scenic Valley Granite Gorges', 'Groundwater Recharging Zone'],
    timingOrHours: 'Open Natural River Valley',
    contact: 'Cauvery Neeravari Nigama',
    iconName: 'water',
    pinColor: '#0284c7', // sky blue
  },
];

// Geo-line coordinates for drawing features on Leaflet Map
export const RAMANAGARA_GEO_LINES = {
  // Bengaluru-Mysuru Expressway / NH-275 path through Ramanagara
  expresswayRoute: [
    [12.7650, 77.3320], // Towards Bidadi / Bengaluru
    [12.7480, 77.3100],
    [12.7290, 77.2910],
    [12.7150, 77.2750], // Ramanagara Bypass
    [12.6950, 77.2480], // Towards Janapada Loka
    [12.6780, 77.2250], // Towards Channapatna
  ] as [number, number][],

  // Arkavathi River Flow through Ramanagara
  arkavathiRiverRoute: [
    [12.7600, 77.2800],
    [12.7420, 77.2850],
    [12.7280, 77.2870],
    [12.7230, 77.2885], // Ramanagara Bridge
    [12.7050, 77.2820],
    [12.6850, 77.2750],
  ] as [number, number][],

  // Ramadevarabetta Sanctuary Eco-Perimeter Polygon
  sanctuaryPerimeter: [
    [12.7560, 77.2920],
    [12.7580, 77.3060],
    [12.7430, 77.3090],
    [12.7390, 77.2940],
    [12.7480, 77.2890],
  ] as [number, number][],
};
