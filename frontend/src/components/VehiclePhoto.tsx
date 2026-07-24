// Real photos, sourced from Wikimedia Commons (freely licensed — see
// frontend/public/vehicle-photos/CREDITS.md). Every real plate visible in
// the original photo has been permanently pixelated in the image file
// itself before it ever entered this repo — not just hidden with CSS — so
// the only plate anyone can read is the fictional one rendered on top.
export function VehiclePhoto({
  src,
  plateText,
  alt,
  className = "card-img-top record-card-img",
}: {
  src: string;
  plateText: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className="position-relative">
      <img src={src} alt={alt} className={className} />
      <span
        className="position-absolute start-50 translate-middle-x bg-white text-dark rounded px-2 py-1 font-monospace fw-bold small border"
        style={{ bottom: 10 }}
      >
        {plateText ?? "UNREADABLE"}
      </span>
    </div>
  );
}
