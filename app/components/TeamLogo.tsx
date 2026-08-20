// Shared TeamLogo utility
export function TeamLogo({ name, logoMap, size = 40 }: { name: string; logoMap: Record<string, string>; size?: number }) {
  const logo = logoMap[name];
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        className="drop-shadow-sm"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="bg-gray-100 rounded-full flex items-center justify-center shrink-0"
    >
      <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
  );
}
