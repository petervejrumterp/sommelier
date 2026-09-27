export interface WinePairing {
  wineName: string;
  type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert' | 'Fortified';
  region: string;
  grape: string;
  description: string;
  tastingNotes: string[];
  servingTemp: string;
  priceRange: string;
  matchScore: number; // 1-100 score of how good the match is
}

export interface PresetMeal {
  id: string;
  name: string;
  icon: string;
}

export type LoadingState = 'idle' | 'analyzing' | 'selecting' | 'pouring' | 'ready' | 'error';
