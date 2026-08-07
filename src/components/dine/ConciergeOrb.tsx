export function ConciergeOrb({
  size = 44,
  active = false,
  className = "",
}: {
  size?: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {active && (
        <span className="absolute inset-0 rounded-full pulse-ring bg-gold/40" />
      )}
      <span
        className="orb-spin absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, var(--gold), var(--primary), color-mix(in oklab, var(--gold) 70%, var(--background)), var(--primary), var(--gold))",
          filter: "blur(0.5px)",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          inset: Math.max(2, size * 0.14),
          background: "var(--gradient-hero)",
        }}
      />
      <span
        className="orb-breathe absolute rounded-full"
        style={{
          inset: Math.max(6, size * 0.3),
          background: "var(--gradient-gold)",
          filter: "blur(2px)",
        }}
      />
    </span>
  );
}
