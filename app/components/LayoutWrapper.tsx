"use client";

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide standard layout elements on the splash screen
  const isSplash = pathname === "/";

  if (isSplash) {
    return <>{children}</>;
  }

  // Phase 4: We keep the dark theme for now, but we prepare for the Sidebar structure later.
  return (
    <>
      <Topbar />
      <Navbar />
      <div className="pt-[50px]">
        {children}
      </div>
    </>
  );
}
