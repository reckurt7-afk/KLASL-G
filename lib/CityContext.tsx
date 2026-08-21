"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

type CityContextType = {
  activeCityId: string;
  activeCitySlug: string;
  setActiveCity: (cityId: string, slug: string) => void;
};

const CityContext = createContext<CityContextType>({
  activeCityId: "bursa",
  activeCitySlug: "bursa",
  setActiveCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [activeCityId, setActiveCityId] = useState("bursa");
  const [activeCitySlug, setActiveCitySlug] = useState("bursa");
  const pathname = usePathname();

  useEffect(() => {
    // URL bazlı basit bir algılama (Örn: /istanbul/puan-durumu)
    if (pathname) {
      const parts = pathname.split("/");
      // Eğer ilk kırılım bilinen bir şehir slug'ı ise onu aktif yap (şimdilik statik kontrol)
      const possibleCity = parts[1];
      const knownCities = ["bursa", "istanbul", "izmir", "antalya"];
      
      if (knownCities.includes(possibleCity)) {
        setActiveCityId(possibleCity);
        setActiveCitySlug(possibleCity);
      } else {
        // Default
        setActiveCityId("bursa");
        setActiveCitySlug("bursa");
      }
    }
  }, [pathname]);

  const setActiveCity = (cityId: string, slug: string) => {
    setActiveCityId(cityId);
    setActiveCitySlug(slug);
  };

  return (
    <CityContext.Provider value={{ activeCityId, activeCitySlug, setActiveCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
