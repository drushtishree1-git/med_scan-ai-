import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Mountain, 
  Shield, 
  Phone, 
  Clock, 
  ExternalLink,
  Flame,
  Bus,
  Layers,
  Award,
  ChevronRight,
  Info,
  Building,
  CheckCircle2,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { RAMANAGARA_DISTRICT_FEATURES, RamanagaraFeatureItem } from '../../data/ramanagaraFeatures';

interface RamanagaraFeaturesCardProps {
  onSelectFeatureOnMap: (feature: RamanagaraFeatureItem) => void;
  selectedFeatureId?: string | null;
}

export const RamanagaraFeaturesCard: React.FC<RamanagaraFeaturesCardProps> = ({
  onSelectFeatureOnMap,
  selectedFeatureId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFeatureModal, setActiveFeatureModal] = useState<RamanagaraFeatureItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Ramanagara Features', count: RAMANAGARA_DISTRICT_FEATURES.length },
    { id: 'silk', label: '🧵 Silk City Hub', count: RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === 'silk').length },
    { id: 'heritage', label: '⛰️ Heritage & Hills (Sholay)', count: RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === 'heritage').length },
    { id: 'emergency', label: '🚨 112 / 101 Command', count: RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === 'emergency').length },
    { id: 'transit', label: '🛣️ Expressway & Rail', count: RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === 'transit').length },
    { id: 'water', label: '💧 Arkavathi & Kanva', count: RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === 'water').length },
  ];

  const filtered = activeCategory === 'all'
    ? RAMANAGARA_DISTRICT_FEATURES
    : RAMANAGARA_DISTRICT_FEATURES.filter(f => f.category === activeCategory);

  const getFeatureIcon = (iconName: RamanagaraFeatureItem['iconName'], color: string) => {
    switch (iconName) {
      case 'mountain':
        return <Mountain className="w-4 h-4 text-purple-600" />;
      case 'silk':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-emerald-600" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-rose-600" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-600" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'museum':
        return <Building className="w-4 h-4 text-cyan-600" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Ramanagara District GIS Features & Heritage (ರಾಮನಗರ)
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 rounded-md uppercase tracking-wider">
              Silk City &bull; PIN 562159
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Interactive map directory covering Ramanagara's Silk Cocoon Market, Ramadevarabetta Vulture Sanctuary (Sholay Hill), Janapada Loka, Kanva Reservoir, 10-lane expressway transit grid, and emergency civil response hubs.
          </p>
        </div>

        {/* Quick Facts Strip */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 p-2 rounded-2xl shrink-0">
          <div className="text-center px-2.5 border-r border-slate-200">
            <span className="block text-xs font-black text-amber-700">50 Tonnes</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Daily Silk</span>
          </div>
          <div className="text-center px-2.5 border-r border-slate-200">
            <span className="block text-xs font-black text-purple-700">346 Ha</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Sanctuary</span>
          </div>
          <div className="text-center px-2.5">
            <span className="block text-xs font-black text-emerald-700">10-Lane</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Expressway</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((feature) => {
          const isSelected = selectedFeatureId === feature.id;
          return (
            <div
              key={feature.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400 shadow-md'
                  : 'bg-slate-50/50 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {getFeatureIcon(feature.iconName, feature.pinColor)}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {feature.categoryLabel}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {feature.name}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap shrink-0">
                    {feature.badge}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-blue-800 bg-blue-50/80 px-2 py-1 rounded-lg border border-blue-100">
                  {feature.kannadaName}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {feature.tagline}
                </p>

                {/* Highlights chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {feature.highlights.slice(0, 2).map((hl, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectFeatureOnMap(feature)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Show on Map</span>
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${feature.lat},${feature.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Open in Google Maps GPS"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setActiveFeatureModal(feature)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Detailed Modal */}
      {activeFeatureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-900">
                  {getFeatureIcon(activeFeatureModal.iconName, activeFeatureModal.pinColor)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                    {activeFeatureModal.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {activeFeatureModal.name}
                  </h3>
                  <p className="text-xs text-blue-700 font-bold">
                    {activeFeatureModal.kannadaName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed font-medium">
                {activeFeatureModal.description}
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Key Highlights & Significance:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeFeatureModal.highlights.map((hl, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium flex items-center gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Timings: {activeFeatureModal.timingOrHours}</span>
                </div>
                {activeFeatureModal.ticketOrFee && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">Entry Fee / Access:</span>
                    <span>{activeFeatureModal.ticketOrFee}</span>
                  </div>
                )}
                {activeFeatureModal.contact && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-blue-700" />
                    <span>{activeFeatureModal.contact}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeFeatureModal.lat},${activeFeatureModal.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Get GPS Directions</span>
              </a>

              <button
                onClick={() => {
                  onSelectFeatureOnMap(activeFeatureModal);
                  setActiveFeatureModal(null);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Interactive Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
