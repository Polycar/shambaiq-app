export default function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  const scale = size / 40;
  return (
    <span className="inline-flex items-center gap-2" aria-label="ShambaIQ">
      <svg
        width={size}
        height={size}
        viewBox="10 70 100 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path d="M60 240 L35 140 Q30 100 60 80 Q90 100 85 140 Z" fill="#15803d" />
        <circle cx="60" cy="130" r="22" fill="#dcfce7" />
        <path d="M60 140 L60 118" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 125 Q48 115 50 108 Q55 105 60 118" fill="#16a34a" />
        <path d="M60 130 Q72 120 70 113 Q65 110 60 122" fill="#16a34a" />
        <circle cx="45" cy="245" r="2" fill="#8B6914" opacity="0.4" />
        <circle cx="55" cy="248" r="2.5" fill="#8B6914" opacity="0.4" />
        <circle cx="65" cy="247" r="2" fill="#8B6914" opacity="0.4" />
        <circle cx="75" cy="244" r="2.5" fill="#8B6914" opacity="0.4" />
      </svg>
      {showText && (
        <span className="flex items-baseline gap-0.5 leading-none">
          <span className="font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "#1a3a1a", fontSize: `${18 * scale}px` }}>
            Shamba
          </span>
          <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "#C8860A", fontSize: `${18 * scale}px` }}>
            IQ
          </span>
        </span>
      )}
    </span>
  );
}
