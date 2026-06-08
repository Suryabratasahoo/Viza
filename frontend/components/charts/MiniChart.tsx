export default function MiniChart({
  type
}: {
  type?: string;
}) {

  switch (
    type?.toLowerCase()
  ) {

    case "linechart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <path
            d="M10 70 L40 55 L70 60 L100 40 L130 45 L150 20"
            fill="none"
            stroke="#4285F4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="150"
            cy="20"
            r="3.5"
            fill="#4285F4"
          />
        </svg>
      );

    case "barchart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <rect x="20" y="30" width="16" height="40" rx="3" fill="#EA4335"/>
          <rect x="52" y="45" width="16" height="25" rx="3" fill="#FBBC05"/>
          <rect x="84" y="20" width="16" height="50" rx="3" fill="#4285F4"/>
          <rect x="116" y="55" width="16" height="15" rx="3" fill="#34A853"/>
        </svg>
      );

    case "multibarchart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <rect x="20" y="25" width="10" height="45" fill="#4285F4"/>
          <rect x="32" y="40" width="10" height="30" fill="#EA4335"/>

          <rect x="60" y="20" width="10" height="50" fill="#4285F4"/>
          <rect x="72" y="35" width="10" height="35" fill="#EA4335"/>

          <rect x="100" y="30" width="10" height="40" fill="#4285F4"/>
          <rect x="112" y="15" width="10" height="55" fill="#EA4335"/>
        </svg>
      );

    case "piechart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <circle cx="80" cy="40" r="24" fill="#4285F4"/>
          <path
            d="M80 40 L80 16 A24 24 0 0 1 103 52 Z"
            fill="#EA4335"
          />
          <path
            d="M80 40 L103 52 A24 24 0 0 1 64 57 Z"
            fill="#FBBC05"
          />
        </svg>
      );

    case "donutchart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <circle
            cx="80"
            cy="40"
            r="24"
            stroke="#E1E6EC"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="80"
            cy="40"
            r="24"
            stroke="#34A853"
            strokeWidth="6"
            fill="none"
            strokeDasharray="150"
            strokeDashoffset="42"
            transform="rotate(-90 80 40)"
          />
        </svg>
      );

    case "scatterchart":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <circle cx="20" cy="60" r="3" fill="#4285F4"/>
          <circle cx="40" cy="50" r="3" fill="#4285F4"/>
          <circle cx="60" cy="45" r="3" fill="#4285F4"/>
          <circle cx="90" cy="30" r="3" fill="#4285F4"/>
          <circle cx="130" cy="15" r="3" fill="#4285F4"/>
        </svg>
      );

    case "table":
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <rect x="20" y="15" width="120" height="50" fill="none" stroke="#CDD4DC"/>
          <line x1="20" y1="30" x2="140" y2="30" stroke="#CDD4DC"/>
          <line x1="20" y1="45" x2="140" y2="45" stroke="#CDD4DC"/>
          <line x1="60" y1="15" x2="60" y2="65" stroke="#CDD4DC"/>
          <line x1="100" y1="15" x2="100" y2="65" stroke="#CDD4DC"/>
        </svg>
      );

    default:
      return (
        <svg width="100%" height="80" viewBox="0 0 160 80">
          <rect
            x="20"
            y="20"
            width="120"
            height="40"
            rx="8"
            fill="#F3F4F6"
          />
        </svg>
      );
  }
}