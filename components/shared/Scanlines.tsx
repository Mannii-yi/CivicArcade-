export default function Scanlines() {
  return (
    <>
      {/* Horizontal scanlines */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9998,
        pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }} />
      {/* Moving scan line */}
      <div style={{
        position: "fixed", left: 0, right: 0, zIndex: 9997,
        height: 2,
        background: "linear-gradient(90deg, transparent, rgba(57,255,20,0.06), transparent)",
        pointerEvents: "none",
        animation: "scanline 8s linear infinite",
      }} />
      {/* Vignette */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9996,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)",
      }} />
    </>
  );
}