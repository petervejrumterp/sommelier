import React from 'react';
import { WinePairing } from '../types';
import { Thermometer, Award, Coins, MapPin, Grape, RefreshCw, ShoppingBag, ExternalLink } from 'lucide-react';

interface WineDisplayProps {
  meal: string;
  pairing: WinePairing;
  onReset: () => void;
}

export const WineDisplay: React.FC<WineDisplayProps> = ({ meal, pairing, onReset }) => {
  const getColorClass = (type: string) => {
    switch (type) {
      case 'Red': return 'border-l-rose-600';
      case 'White': return 'border-l-yellow-400';
      case 'Rosé': return 'border-l-pink-400';
      case 'Sparkling': return 'border-l-amber-400';
      default: return 'border-l-slate-400';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Red': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'White': return 'bg-yellow-50 text-yellow-800 border-yellow-100';
      case 'Rosé': return 'bg-pink-50 text-pink-700 border-pink-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const translateType = (type: string) => {
    switch (type) {
        case 'Red': return 'Rødvin';
        case 'White': return 'Hvidvin';
        case 'Rosé': return 'Rosé';
        case 'Sparkling': return 'Mousserende';
        case 'Dessert': return 'Dessertvin';
        case 'Fortified': return 'Hedvin';
        default: return type;
    }
  };

  const shopLink = `https://vininvestoren.dk/search?q=${encodeURIComponent(pairing.wineName)}&utm_source=sommelier&utm_medium=referral&utm_campaign=vinmatch&utm_content=find_vin`;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
      
      {/* Top Controls */}
      <div className="flex justify-between items-end mb-8 px-4 border-b border-slate-100 pb-6">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-2">Dit valg</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#102633] tracking-tight">{meal}</h2>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 text-slate-500 hover:text-[#102633] transition-colors text-sm font-medium border border-slate-200 px-5 py-2.5 rounded-full hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw size={14} />
          <span>Ny Søgning</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Wine Identity */}
          <div className={`lg:col-span-5 p-8 md:p-12 border-l-8 ${getColorClass(pairing.type)} flex flex-col justify-between h-full bg-slate-50/30`}>
             <div className="space-y-6">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeColor(pairing.type)} shadow-sm`}>
                  {translateType(pairing.type)}
                </span>
                
                <div>
                   <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#102633] leading-[1.1] mb-4">
                     {pairing.wineName}
                   </h3>
                   <div className="flex items-center space-x-3 text-[#102633]/60 mb-8">
                     <MapPin size={18} className="text-[#C09D6A]" />
                     <span className="text-xl font-light italic">{pairing.region}</span>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-3 text-[#102633]/80">
                    <Grape size={20} className="text-[#C09D6A]" />
                    <span className="font-semibold">{pairing.grape}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[#102633]/80">
                    <Thermometer size={20} className="text-[#C09D6A]" />
                    <span className="font-semibold">{pairing.servingTemp}</span>
                  </div>
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Match Score</span>
                    <div className="flex items-center space-x-2">
                       <Award size={28} className="text-[#C09D6A]"/>
                       <span className="text-4xl font-serif font-bold text-[#102633]">{pairing.matchScore}</span>
                       <span className="text-lg text-slate-300 self-end mb-1">/100</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Prisleje</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-[#102633]">{pairing.priceRange.replace('$','').replace('kr.','')}</span>
                      <span className="text-sm font-medium text-slate-400 self-end mb-1 ml-1">DKK</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Right Column: Details & Description */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between">
            
            <div className="space-y-10">
              <section>
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 border-b border-slate-100 pb-2">
                  Sommelierens Vurdering
                </h4>
                <p className="text-xl leading-relaxed text-[#102633]/90 font-light italic opacity-90">
                  "{pairing.description}"
                </p>
              </section>

              <section>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-5">Smagsprofil</h4>
                  <div className="flex flex-wrap gap-3">
                    {pairing.tastingNotes.map((note, i) => (
                      <span key={i} className="px-5 py-2 bg-slate-50 rounded-xl text-sm font-semibold text-[#102633] border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-[#C09D6A] cursor-default">
                        {note}
                      </span>
                    ))}
                  </div>
              </section>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-slate-100">
               <a 
                 href={shopLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 onClick={() => {
                   if (typeof (window as any).gtag === 'function') {
                     (window as any).gtag('event', 'click_shop_link', {
                       wine_name: pairing.wineName,
                       wine_type: pairing.wineType,
                       meal: meal,
                       link_url: shopLink,
                     });
                   }
                 }}
                 className="group w-full flex items-center justify-between p-5 rounded-2xl bg-[#102633] hover:bg-[#1a3a4d] transition-all shadow-lg hover:shadow-xl"
               >
                 <div className="flex items-center space-x-4">
                   <div className="bg-white/10 p-3 rounded-xl text-white">
                     <ShoppingBag size={24} />
                   </div>
                   <div className="font-bold text-white tracking-wide">
                     <div className="text-xs opacity-70 uppercase tracking-widest mb-0.5">Køb vinen nu</div>
                     <div className="text-lg">Find hos Vininvestoren</div>
                   </div>
                 </div>
                 <ExternalLink size={24} className="text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
               </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};