/* eslint-disable @next/next/no-img-element */
export function Avatar({ src, name, size = 40 }: { src: string | null; name: string; size?: number }) {
  const style = { width: size, height: size };
  if (src) {
    return <img src={src} alt={name} style={style} className="flex-shrink-0 rounded-full bg-neutral-200 object-cover" />;
  }
  return (
    <span
      style={{ ...style, fontSize: size * 0.45 }}
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-orange-200 font-semibold text-orange-800"
      aria-label={name}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
