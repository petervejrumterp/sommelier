import React, { useState } from 'react';
import { Header } from './components/Header';
import { MealSelector } from './components/MealSelector';
import { WineDisplay } from './components/WineDisplay';
import { getWinePairing } from './services/geminiService';
import { WinePairing, LoadingState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [meal, setMeal] = useState<string>('');
  const [pairing, setPairing] = useState<WinePairing | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleMealSelect = async (selectedMeal: string) => {
    setMeal(selectedMeal);
    setStatus('analyzing');
    setError(null);
    setPairing(null);

    try {
      const pairingPromise = getWinePairing(selectedMeal);

      // Brief pause to display the sommelier thinking progression
      await new Promise((r) => setTimeout(r, 600));
      setStatus('selecting');

      const result = await pairingPromise;

      setStatus('pouring');
      await new Promise((r) => setTimeout(r, 400));

      setPairing(result);
      setStatus('ready');
    } catch (err: any) {
      console.error("Pairing error:", err);
      setError(err?.message || "Vores sommelier tabte flasken. Prøv venligst igen.");
      setStatus('error');
    }
  };

  const handleReset = () => {
    setMeal('');
    setPairing(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-[#102633]">
      {/* Top Banner */}
      <div className="bg-[#f2f2ed] py-2 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-[#102633]/60 border-b border-slate-100">
        Fri fragt på alle ordrer over 499 kr.
      </div>
      
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-16 min-h-screen flex flex-col">
        
        {/* Header is always visible until results */}
        <div className={`transition-all duration-700 ease-in-out ${pairing ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mb-12'}`}>
           <Header />
        </div>

        <main className="flex-grow flex flex-col items-center justify-center w-full relative z-10">
          
          {/* Input Section - Only visible when no pairing */}
          {!pairing && status !== 'error' && (
             <div className={`w-full transition-all duration-500 ${status !== 'idle' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <MealSelector onSelect={handleMealSelect} isLoading={status !== 'idle'} />
             </div>
          )}

          {/* Loading States */}
          {status !== 'idle' && status !== 'ready' && status !== 'error' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-20">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#C09D6A] blur-xl opacity-10 animate-pulse rounded-full"></div>
                   <Loader2 size={48} className="text-[#102633] animate-spin relative z-10" />
                </div>
                <p className="text-[#102633]/60 font-serif italic text-lg animate-pulse">
                  {status === 'analyzing' && "Analyserer smagsnuancer..."}
                  {status === 'selecting' && "Tjekker vinkælderen..."}
                  {status === 'pouring' && "Dekanterer..."}
                </p>
             </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center space-y-4">
              <p className="text-rose-600 text-lg font-medium">{error}</p>
              <button 
                onClick={handleReset}
                className="text-[#102633] font-medium underline underline-offset-4 hover:text-[#C09D6A] transition-colors"
              >
                Prøv igen
              </button>
            </div>
          )}

          {/* Result Display */}
          {pairing && status === 'ready' && (
            <WineDisplay meal={meal} pairing={pairing} onReset={handleReset} />
          )}

        </main>
        
        <footer className="mt-12 text-center text-slate-400 text-xs py-4">
          <p>© {new Date().getFullYear()} Vininvestoren | Sommelier. Nyd med omtanke.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;