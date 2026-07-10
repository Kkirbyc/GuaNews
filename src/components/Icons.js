import React from 'react';

/*
 * Lightweight inline SVG icon set (Lucide-style: 24x24, stroke, currentColor).
 * Replaces emoji used as structural/UI icons so they render consistently
 * across platforms and adapt to theme color. Flag emoji stay — those are content.
 */

function Icon({ size = 20, children, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>
);

export const HeartIcon = ({ filled, ...p }) => (
  <Icon {...p}>
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </Icon>
);

export const PlusIcon = (p) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);

export const ShareIcon = (p) => (
  <Icon {...p}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M16 6l-4-4-4 4" /><path d="M12 2v14" />
  </Icon>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p) => (
  <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>
);

export const GlobeIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);

export const ChevronDownIcon = (p) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
);

export const BellIcon = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);

/* Topic icons (replace the emoji category tiles) */
export const PoliticsIcon = (p) => (
  <Icon {...p}>
    <path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M3 10l9-6 9 6" />
  </Icon>
);
export const FinanceIcon = (p) => (
  <Icon {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></Icon>
);
export const ScienceIcon = (p) => (
  <Icon {...p}>
    <path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3" />
    <path d="M7 15h10" />
  </Icon>
);
export const TechIcon = (p) => (
  <Icon {...p}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
  </Icon>
);
export const SportsIcon = (p) => (
  <Icon {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M6 5H3v1.5A3.5 3.5 0 0 0 6.5 10M18 5h3v1.5A3.5 3.5 0 0 1 17.5 10" />
  </Icon>
);
export const ClimateIcon = (p) => (
  <Icon {...p}>
    <path d="M11 20A7 7 0 0 1 4 13C4 7 9 4 20 3c0 8-3 15-9 17z" />
    <path d="M4 21c3.5-6.5 7.5-9 13-10" />
  </Icon>
);
export const CultureIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.9 4.3L18 9l-4.1 1.7L12 15l-1.9-4.3L6 9l4.1-1.7z" />
    <path d="M18.5 14l1 2.2L22 17l-2.2 1-1 2.2-1-2.2L15.5 17l2.3-.8z" />
  </Icon>
);
export const HealthIcon = (p) => (
  <Icon {...p}>
    <path d="M20.8 6a5.4 5.4 0 0 0-8.8-1.2A5.4 5.4 0 0 0 3.2 6c-1.4 2-1 4.6 1 6.4L12 20l7.8-7.6c2-1.8 2.4-4.4 1-6.4z" />
    <path d="M3.5 12h3.5l1.5-2.5L11 15l2-6 1.5 3H20.5" />
  </Icon>
);
export const CompassIcon = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" /></Icon>
);
