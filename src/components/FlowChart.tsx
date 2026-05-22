/**
 * NorthSend system flow chart.
 * Visual diagram of the full patient acquisition pipeline.
 * Reusable in both light and dark themes via the `tone` prop.
 *
 * Layout: 1000 x 720 viewBox. Designed mobile-friendly via responsive scaling.
 */

type Tone = "dark" | "light";

type FlowChartProps = {
  tone?: Tone;
  className?: string;
};

const palette = {
  dark: {
    nodeFill: "#0F172A",
    nodeStroke: "#10B981",
    nodeText: "#F8FAFC",
    nodeSubtle: "#94A3B8",
    altNodeStroke: "#A78BFA",
    decisionFill: "#0F172A",
    decisionStroke: "#22D3EE",
    decisionText: "#F8FAFC",
    arrow: "#475569",
    arrowYes: "#10B981",
    arrowNo: "#A78BFA",
    labelYes: "#10B981",
    labelNo: "#A78BFA",
    gridDot: "#1E293B",
  },
  light: {
    nodeFill: "#FAF7F1",
    nodeStroke: "#1F6A4C",
    nodeText: "#0B130E",
    nodeSubtle: "#6A6F69",
    altNodeStroke: "#A6822A",
    decisionFill: "#FAF7F1",
    decisionStroke: "#2A6F69",
    decisionText: "#0B130E",
    arrow: "#B4B5AE",
    arrowYes: "#1F6A4C",
    arrowNo: "#A6822A",
    labelYes: "#134F39",
    labelNo: "#604B17",
    gridDot: "#E8E2D0",
  },
} as const;

const Node = ({
  x,
  y,
  w,
  h,
  label,
  sub,
  c,
  alt,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  c: typeof palette.dark;
  alt?: boolean;
}) => (
  <g className={alt ? "flow-node-violet" : "flow-node"}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill={c.nodeFill}
      stroke={alt ? c.altNodeStroke : c.nodeStroke}
      strokeWidth={1.5}
    />
    <text
      x={x + w / 2}
      y={sub ? y + h / 2 - 5 : y + h / 2 + 5}
      textAnchor="middle"
      fontFamily="var(--font-sans)"
      fontSize={15}
      fontWeight={700}
      fill={c.nodeText}
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 14}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={11}
        fontWeight={500}
        fill={c.nodeSubtle}
      >
        {sub}
      </text>
    )}
  </g>
);

const Diamond = ({
  cx,
  cy,
  label,
  c,
}: {
  cx: number;
  cy: number;
  label: string;
  c: typeof palette.dark;
}) => {
  const w = 130;
  const h = 90;
  const pts = [
    [cx, cy - h / 2],
    [cx + w / 2, cy],
    [cx, cy + h / 2],
    [cx - w / 2, cy],
  ]
    .map((p) => p.join(","))
    .join(" ");
  return (
    <g>
      <polygon
        points={pts}
        fill={c.decisionFill}
        stroke={c.decisionStroke}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={14}
        fontWeight={700}
        fill={c.decisionText}
      >
        {label}
      </text>
    </g>
  );
};

const Arrow = ({
  d,
  c,
  variant = "default",
  label,
  labelX,
  labelY,
}: {
  d: string;
  c: typeof palette.dark;
  variant?: "default" | "yes" | "no";
  label?: string;
  labelX?: number;
  labelY?: number;
}) => {
  const stroke =
    variant === "yes" ? c.arrowYes : variant === "no" ? c.arrowNo : c.arrow;
  const markerId =
    variant === "yes" ? "arrow-yes" : variant === "no" ? "arrow-no" : "arrow-default";
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        markerEnd={`url(#${markerId})`}
      />
      {label && labelX !== undefined && labelY !== undefined && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fontWeight={700}
          fill={variant === "yes" ? c.labelYes : variant === "no" ? c.labelNo : c.arrow}
        >
          {label}
        </text>
      )}
    </>
  );
};

/**
 * Mobile-only stacked-card variant of the flow.
 * Renders the same step list as the SVG, but as readable cards instead of
 * a tiny scaled-down SVG. Used on viewports below the md breakpoint.
 */
const mobileLinear = [
  { n: "01", title: "Meta + Google Ads", sub: "Geo-targeted" },
  { n: "02", title: "Landing page", sub: "Two CTAs offered" },
];
const mobileFork = [
  { n: "03", title: "WhatsApp inquiry", sub: "1-tap from page" },
  { n: "03", title: "Form or booking", sub: "Contact form or live slot" },
];
const mobileTail = [
  { n: "04", title: "AI follow-up", sub: "Under 5 minutes" },
  { n: "05", title: "Patient picks slot", sub: "Calendar or chat" },
  { n: "06", title: "Reminder sequence", sub: "24h + 1h before" },
  { n: "07", title: "Patient shows up", sub: "Booked appointment" },
  { n: "08", title: "Clinic books revenue", sub: "Refund-backed guarantee" },
];

const MobileCard = ({
  n,
  title,
  sub,
}: {
  n: string;
  title: string;
  sub: string;
}) => (
  <div className="flex items-start gap-4 rounded-xl border border-paper-3 bg-paper p-4">
    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-forest-200 bg-forest-50 font-mono text-xs font-bold text-forest-700">
      {n}
    </span>
    <div className="min-w-0">
      <h4 className="text-base font-bold leading-tight text-ink-900">{title}</h4>
      <p className="mt-1 text-sm leading-snug text-ink-500">{sub}</p>
    </div>
  </div>
);

const MobileArrow = () => (
  <div className="flex justify-center py-1" aria-hidden="true">
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3 text-paper-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 4 L6 9 L10 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const MobileOR = () => (
  <div className="flex items-center justify-center gap-3 py-1" aria-hidden="true">
    <span className="h-px flex-1 bg-paper-3" />
    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">
      OR
    </span>
    <span className="h-px flex-1 bg-paper-3" />
  </div>
);

function MobileFlow({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {mobileLinear.map((s) => (
        <div key={s.n}>
          <MobileCard {...s} />
          <MobileArrow />
        </div>
      ))}
      <MobileCard {...mobileFork[0]} />
      <MobileOR />
      <MobileCard {...mobileFork[1]} />
      <MobileArrow />
      {mobileTail.map((s, i) => (
        <div key={s.n}>
          <MobileCard {...s} />
          {i < mobileTail.length - 1 && <MobileArrow />}
        </div>
      ))}
    </div>
  );
}

export function FlowChart({ tone = "light", className = "" }: FlowChartProps) {
  const c = palette[tone];

  return (
    <>
      {/* MOBILE: stacked-card layout (below md breakpoint).
          Readable on phones where the SVG would shrink to unreadable. */}
      <MobileFlow className={`md:hidden ${className}`} />

      {/* DESKTOP: SVG flow chart (md and up). */}
      <svg
        viewBox="0 0 1000 320"
        xmlns="http://www.w3.org/2000/svg"
        className={`hidden md:block ${className}`}
        role="img"
        aria-label="NorthSend patient acquisition system flow"
      >
      <defs>
        {/* Subtle dot grid background */}
        <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill={c.gridDot} />
        </pattern>
        {/* Arrowhead markers */}
        <marker id="arrow-default" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill={c.arrow} />
        </marker>
        <marker id="arrow-yes" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill={c.arrowYes} />
        </marker>
      </defs>

      <rect width="1000" height="320" fill="url(#dotgrid)" opacity="0.5" />

      {/* ===========================================================
          ROW 1 (top, left-to-right): lead acquisition + entry fork
          After Landing page, path forks into two CTAs (WhatsApp OR
          Form / Booking), then merges back into AI follow-up.
          =========================================================== */}
      <Node x={40} y={40} w={180} h={60} label="Meta + Google Ads" sub="Geo-targeted" c={c} />
      <Arrow d="M 220 70 L 290 70" c={c} />
      <Node x={290} y={40} w={180} h={60} label="Landing page" sub="Two CTAs offered" c={c} />

      {/* Fork: Landing → WhatsApp (upper) + Landing → Form/Booking (lower) */}
      <Arrow d="M 470 70 L 505 70 L 505 37 L 540 37" c={c} />
      <Arrow d="M 470 70 L 505 70 L 505 103 L 540 103" c={c} />

      <Node x={540} y={12} w={180} h={50} label="WhatsApp inquiry" sub="1-tap from page" c={c} />
      <Node x={540} y={78} w={180} h={50} label="Form or booking" sub="Contact form or live slot" c={c} />

      {/* "OR" label between the two branches */}
      <text
        x={630}
        y={73}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={700}
        fill={c.nodeSubtle}
      >
        OR
      </text>

      {/* Merge: both entry options → AI follow-up */}
      <Arrow d="M 720 37 L 755 37 L 755 70 L 790 70" c={c} />
      <Arrow d="M 720 103 L 755 103 L 755 70 L 790 70" c={c} />

      <Node x={790} y={40} w={180} h={60} label="AI follow-up" sub="Under 5 minutes" c={c} />

      {/* ===========================================================
          BRIDGE: AI follow-up bottom → bottom row top
          Drops down on the right side, then bottom row runs
          right-to-left (snake / Z-pattern).
          =========================================================== */}
      <Arrow d="M 880 100 L 880 200" c={c} variant="yes" />

      {/* ===========================================================
          ROW 2 (bottom, right-to-left): commitment → reminder →
          show-up → revenue. All YES-coloured (happy path is the
          only path; the brand voice handles "not-ready-yet" on
          the strategy call, not on the diagram.)
          =========================================================== */}
      <Node x={790} y={200} w={180} h={60} label="Patient picks slot" sub="Calendar or chat" c={c} />
      <Arrow d="M 790 230 L 720 230" c={c} variant="yes" />

      <Node x={540} y={200} w={180} h={60} label="Reminder sequence" sub="24h + 1h before" c={c} />
      <Arrow d="M 540 230 L 470 230" c={c} variant="yes" />

      <Node x={290} y={200} w={180} h={60} label="Patient shows up" sub="Booked appointment" c={c} />
      <Arrow d="M 290 230 L 220 230" c={c} variant="yes" />

      <Node x={40} y={200} w={180} h={60} label="Clinic books revenue" sub="Refund-backed guarantee" c={c} />
      </svg>
    </>
  );
}
