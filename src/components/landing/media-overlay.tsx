/** Landing-only image scrim — stronger than Home (/38) for white text. */
export function MediaOverlay({
  softBottom = true,
}: {
  softBottom?: boolean;
}) {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/18 to-transparent"
        aria-hidden
      />
      {softBottom ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-44"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--background) 40%, transparent) 55%, var(--background) 100%)",
          }}
          aria-hidden
        />
      ) : null}
    </>
  );
}
