import { create } from 'zustand';

interface CityState {
  selectedCityId: number;
  setSelectedCityId: (id: number) => void;
}

export const useCityStore = create<CityState>((set) => ({
  selectedCityId: 1, // Default to Bursa (id: 1)
  setSelectedCityId: (id) => set({ selectedCityId: id }),
}));
