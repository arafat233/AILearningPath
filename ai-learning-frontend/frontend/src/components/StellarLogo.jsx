import { useId } from "react";

export default function StellarLogo({ size = 44, style: extraStyle = {} }) {
  const uid      = useId();
  const filterId = `sg-${uid.replace(/:/g, "")}`;

  return (
    <span
      className="inline-block shrink-0 overflow-hidden"
      style={{
        width:        size,
        height:       size,
        borderRadius: Math.round(size * 0.25),
        background:   "linear-gradient(135deg,#9D50BB,#3A1C71)",
        ...extraStyle,
      }}
      aria-label="Stellar"
    >
      <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} x="80" y="80" width="360" height="320" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path d="M310 255 L350 310" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M310 255 L260 320" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M190 190 L310 255" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="310" cy="255" r="18" fill="white" />
          <circle cx="350" cy="310" r="18" fill="white" />
          <circle cx="260" cy="320" r="18" fill="white" />
          <path d="M190 155 C190 175 175 190 155 190 C175 190 190 205 190 225 C190 205 205 190 225 190 C205 190 190 175 190 155Z" fill="white" />
        </g>
      </svg>
    </span>
  );
}
