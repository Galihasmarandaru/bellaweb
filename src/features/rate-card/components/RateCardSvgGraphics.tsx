import { renderToStaticMarkup } from 'react-dom/server';

export function LanyardTopRightSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M52 0 L92 0 L84 82 L44 82 Z" fill="#2A2927" />
      <rect x="44" y="76" width="40" height="8" rx="3" fill="#4A4946" />
      <circle cx="62" cy="108" r="18" stroke="#A8A9AD" strokeWidth="5" />
      <path
        d="M62 124 C74 124 82 138 78 156 C74 174 62 184 54 178 C46 172 48 152 54 140 L60 128"
        stroke="#8C8D91"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="62" cy="126" r="5" fill="#6F7074" />
    </svg>
  );
}

export function LanyardClipSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M30 0 L68 0 L94 96 L56 96 Z" fill="#2A2927" />
      <ellipse cx="75" cy="96" rx="18" ry="6" fill="#4A4946" />
      <circle cx="77" cy="120" r="18" stroke="#B6B7BB" strokeWidth="5" />
      <path
        d="M81 136 C96 140 104 162 96 184 C88 202 72 204 66 190 C62 178 68 158 76 144"
        stroke="#8D8E92"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="79" cy="138" r="6" fill="#6E6F73" />
    </svg>
  );
}

export function DualCardsSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g transform="rotate(-14 48 44)">
        <rect x="8" y="16" width="76" height="48" rx="6" fill="#232220" />
        <rect x="8" y="26" width="76" height="9" fill="#FFFFFF" fillOpacity="0.75" />
      </g>
      <g transform="translate(26, 26)">
        <rect
          x="0"
          y="0"
          width="84"
          height="54"
          rx="7"
          fill="#E82C8A"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <rect x="10" y="12" width="14" height="10" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="10" y="34" width="26" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
        <rect x="10" y="42" width="18" height="3.5" rx="1.75" fill="#FFFFFF" fillOpacity="0.75" />
        <rect x="52" y="37" width="22" height="5" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
      </g>
    </svg>
  );
}

export function getRateCardSvgMarkup(): {
  lanyardTopRight: string;
  lanyardClip: string;
  dualCards: string;
} {
  return {
    lanyardTopRight: renderToStaticMarkup(<LanyardTopRightSvg />),
    lanyardClip: renderToStaticMarkup(<LanyardClipSvg />),
    dualCards: renderToStaticMarkup(<DualCardsSvg />),
  };
}
