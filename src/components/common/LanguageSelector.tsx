import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Check, 
  ChevronDown, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Languages
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'pills';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'compact',
  className = '' 
}) => {
  const { 
    language, 
    setLanguage, 
    currentLanguageInfo, 
    t, 
    speakText, 
    stopSpeaking, 
    isSpeaking 
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Quick Horizontal Pills (e.g. for Home Hero or Footer)
  if (variant === 'pills') {
    const topLanguages: LanguageCode[] = ['en', 'kn', 'hi', 'es', 'ta', 'te'];
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('language_switcher')}:</span>
        </span>
        {topLanguages.map((code) => {
          const l = SUPPORTED_LANGUAGES.find((item) => item.code === code)!;
          const isActive = language === code;
          return (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Full / Compact Header Dropdown
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="language-selector-btn"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        aria-label="Select application language"
        title={`Current Language: ${currentLanguageInfo.name} (${currentLanguageInfo.nativeName})`}
      >
        <span className="text-base leading-none">{currentLanguageInfo.flag}</span>
        <span className="hidden sm:inline font-bold text-slate-900">
          {currentLanguageInfo.nativeName}
        </span>
        <span className="sm:hidden font-bold uppercase text-[11px] text-slate-700">
          {currentLanguageInfo.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Quick Search */}
          <div className="p-2 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-blue-600" />
                <span>Choose Language</span>
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                11 Supported
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto p-1 space-y-1 mt-1 custom-scrollbar">
            {filteredLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/60'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div>
                      <div className="text-xs font-bold leading-tight flex items-center gap-1">
                        <span>{lang.nativeName}</span>
                        {lang.code === 'kn' && (
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            KA Local
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lang.name}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching languages found
              </div>
            )}
          </div>

          {/* Quick Audio Speech Prompt */}
          <div className="p-2 border-t border-slate-100 mt-1 flex items-center justify-between text-[11px] bg-slate-50 rounded-xl">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Voice TTS Active</span>
            </span>
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(t('hero_headline'));
                }
              }}
              className="px-2 py-0.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3 h-3 text-rose-600" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-blue-600" />
                  <span>Test Voice</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
