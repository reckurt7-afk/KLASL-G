"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TableProperties, 
  CalendarDays, 
  Trophy, 
  Shield, 
  BarChart3, 
  ArrowRightLeft, 
  Newspaper, 
  PlaySquare, 
  AlertTriangle 
} from "lucide-react";

const MENU_GROUPS = [
  {
    title: "LİG",
    items: [
      { href: "/lig", label: "Genel Bakış", icon: LayoutDashboard },
      { href: "/puan-durumu", label: "Puan Durumu", icon: TableProperties },
      { href: "/fikstur", label: "Fikstür", icon: CalendarDays },
      { href: "/mac-sonuclari", label: "Sonuçlar", icon: Trophy },
    ]
  },
  {
    title: "TAKIMLAR",
    items: [
      { href: "/takimlar", label: "Takımlar", icon: Shield },
      { href: "/istatistikler", label: "İstatistikler", icon: BarChart3 },
      { href: "/transfer-borsasi", label: "Transferler", icon: ArrowRightLeft },
    ]
  },
  {
    title: "MEDYA",
    items: [
      { href: "/haberler", label: "Haberler", icon: Newspaper },
      { href: "/video-arsivi", label: "Klas Lig TV", icon: PlaySquare },
    ]
  },
  {
    title: "DİĞER",
    items: [
      { href: "/ceza-tahtasi", label: "Ceza Tahtası", icon: AlertTriangle },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-72px)] bg-white border-r border-gray-200 hidden lg:block overflow-y-auto">
      <div className="p-4 space-y-8">
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
              {group.title}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={itemIdx} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-red-50 text-[#e50914]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#e50914]" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
