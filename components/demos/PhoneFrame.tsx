// Reusable phone mockup for the /demos pages. Renders children inside a
// dark phone-shaped frame with a status bar.
export default function PhoneFrame({
  children,
  time = "19:30",
  className = "",
}: {
  children: React.ReactNode;
  time?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-[300px] shrink-0 rounded-[36px] border border-[#2a2a2a] bg-[#050505] p-2 shadow-[0_0_60px_rgba(124,58,237,0.10)] ${className}`}
    >
      <div className="relative h-[600px] overflow-hidden rounded-[28px] bg-[#0e0e10] flex flex-col">
        {/* Status bar + notch */}
        <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1.5 text-[10px] font-mono text-white/60">
          <span>{time}</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-20 h-4 rounded-full bg-black" />
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-2 rounded-[2px] border border-white/40" />
            LTE
          </span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
