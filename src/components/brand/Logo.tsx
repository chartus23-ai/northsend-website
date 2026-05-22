import { ComponentPropsWithoutRef } from "react";

/**
 * NorthSend V2 Origami Arrow — locked logo system.
 * Geometry: apex (48,10) · outer (16,80)/(80,80) · notch (48,58)
 * Two facets only — left lit (#334155), right shadow (#0F172A).
 */

type SvgProps = Omit<ComponentPropsWithoutRef<"svg">, "viewBox">;

export function Mark({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="48,10 16,80 48,58" fill="#94A3B8" />
      <polygon points="48,10 80,80 48,58" fill="#F8FAFC" />
    </svg>
  );
}

export function MarkDark({ className, ...props }: SvgProps) {
  /* Mark on light backgrounds — uses navy/slate fills */
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="48,10 16,80 48,58" fill="#334155" />
      <polygon points="48,10 80,80 48,58" fill="#0F172A" />
    </svg>
  );
}

export function MarkMono({ className, ...props }: SvgProps) {
  /* Single-tone fallback for tiny sizes */
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="48,10 16,80 48,58 80,80" fill="currentColor" />
    </svg>
  );
}

type LockupProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Lockup({ size = "md", className = "" }: LockupProps) {
  const sizes = {
    sm: { mark: "h-6 w-6", text: "text-lg" },
    md: { mark: "h-8 w-8", text: "text-2xl" },
    lg: { mark: "h-12 w-12", text: "text-4xl" },
  } as const;
  const s = sizes[size];
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className={s.mark} />
      <span
        className={`font-extrabold tracking-[-0.025em] text-navy-50 ${s.text}`}
      >
        NorthSend
      </span>
    </div>
  );
}
