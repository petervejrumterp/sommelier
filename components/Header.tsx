import React from 'react';
import { Wine } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
      <div className="flex items-center space-x-3 text-[#102633] mb-2">
        <Wine size={32} strokeWidth={1.5} className="text-[#C09D6A]" />
        <span className="text-xl font-serif italic tracking-widest uppercase opacity-90">Vininvestoren | Sommelier</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#102633] tracking-tight">
        Hvad byder <span className="text-[#C09D6A]">menuen</span> på?
      </h1>
      <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base font-light">
        Find den perfekte flaske til at løfte dit måltid. Indtast din ret herunder for et ekspert-match.
      </p>
    </header>
  );
};