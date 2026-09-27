import React, { useState } from 'react';
import { Search, Utensils, Beef, Fish, Carrot, Coffee, Pizza } from 'lucide-react';
import { PresetMeal } from '../types';

interface MealSelectorProps {
  onSelect: (meal: string) => void;
  isLoading: boolean;
}

const PRESETS: PresetMeal[] = [
  { id: 'steak', name: 'Ribeye Bøf', icon: 'Beef' },
  { id: 'salmon', name: 'Grillet Laks', icon: 'Fish' },
  { id: 'pasta', name: 'Carbonara', icon: 'Pizza' }, // Using Pizza as generic Italian/Carb icon
  { id: 'salad', name: 'Cæsarsalat', icon: 'Carrot' },
  { id: 'tacos', name: 'Spicy Tacos', icon: 'Utensils' },
  { id: 'cake', name: 'Chokoladekage', icon: 'Coffee' },
];

export const MealSelector: React.FC<MealSelectorProps> = ({ onSelect, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSelect(input);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Beef': return <Beef className="w-5 h-5" />;
      case 'Fish': return <Fish className="w-5 h-5" />;
      case 'Carrot': return <Carrot className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Pizza': return <Pizza className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 px-4">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#102633] transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Beskriv din ret (f.eks. 'Kylling i karry', 'Bøf Bearnaise')..."
          className="w-full bg-white border border-slate-200 text-[#102633] pl-12 pr-4 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#102633]/5 focus:border-[#C09D6A] transition-all placeholder-slate-400 shadow-sm"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute inset-y-2 right-2 bg-[#102633] hover:bg-[#1a3a4d] text-white px-6 rounded-xl font-medium text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Henter...' : 'Find Vin'}
        </button>
      </form>

      {/* Presets */}
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-6 text-center">Eller prøv en klassiker</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.name)}
              disabled={isLoading}
              className="flex flex-col items-center justify-center space-y-3 p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-[#C09D6A] rounded-2xl transition-all shadow-sm hover:shadow-md group"
            >
              <div className="bg-slate-50 p-3 rounded-full text-[#C09D6A] group-hover:bg-[#C09D6A]/10 transition-colors">
                {getIcon(preset.icon)}
              </div>
              <span className="font-semibold text-sm text-[#102633]">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};