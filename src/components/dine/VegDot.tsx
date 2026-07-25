export function VegDot({ veg }: { veg: boolean }) {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-sm border-2"
      style={{ borderColor: veg ? "var(--color-veg)" : "var(--color-nonveg)" }}
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: veg ? "var(--color-veg)" : "var(--color-nonveg)" }}
      />
    </span>
  );
}
