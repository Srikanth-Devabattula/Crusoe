/** Light overlay for inner-page heroes; site bg image is on `main.site-main-bg`. */
export function PageHeroOverlay({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/28 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/30" />
      {children}
    </div>
  );
}
