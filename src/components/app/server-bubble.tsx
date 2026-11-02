import { useRef, useState } from "react";
import { ChevronDown, Power, Wifi } from "lucide-react";
import type { Signal } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const CIRCLE = 60;
const BOX_W = 248;

export function ServerBubble({
  serverOn,
  signals,
  onServerOff,
}: {
  serverOn: boolean;
  signals: Signal[];
  onServerOff: () => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const drag = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
    moved: boolean;
  } | null>(null);

  const isBox = expanded;
  const width = isBox ? BOX_W : CIRCLE;

  const clamp = (x: number, y: number) => {
    const maxX = window.innerWidth - width - 10;
    const maxY = window.innerHeight - (isBox ? 300 : 100);
    return {
      x: Math.min(Math.max(10, x), Math.max(10, maxX)),
      y: Math.min(Math.max(10, y), Math.max(10, maxY)),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pos ?? {
      x: window.innerWidth - width - 24,
      y: window.innerHeight * 0.55,
    };
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: start.x,
      posY: start.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) d.moved = true;
    if (d.moved) setPos(clamp(d.posX + dx, d.posY + dy));
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setExpanded((v) => !v);
  };

  return (
    <div
      className={cn("fixed z-[60] touch-none select-none")}
      style={
        pos
          ? { left: pos.x, top: pos.y, width }
          : { right: 24, top: "58%", width }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {isBox ? (
        <div
          className="glass-strong overflow-hidden rounded-2xl"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            className="flex cursor-grab items-center justify-between border-b border-glass-border px-3 py-2.5 active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Server ON
            </span>
            <button
              type="button"
              aria-label="Minimize"
              onClick={() => setExpanded(false)}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto px-3 py-2">
            {signals.length === 0 ? (
              <p className="py-3 text-center text-xs text-muted-foreground">
                Waiting for signals…
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {signals.map((s) => (
                  <li
                    key={s.id}
                    className="animate-in fade-in slide-in-from-bottom-2 flex items-center justify-between rounded-xl bg-glass px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-display font-semibold text-foreground">
                      {s.symbol}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        s.action === "BUY" ? "text-success" : "text-destructive",
                      )}
                    >
                      {s.action}
                    </span>
                    <span className="text-muted-foreground">{s.lot} lot</span>
                    <span className="text-muted-foreground">{s.at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-glass-border p-2">
            <button
              type="button"
              onClick={onServerOff}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-glass py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
            >
              <Power className="h-3.5 w-3.5" />
              Turn server off
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Server status"
          className="btn-gradient relative flex h-[60px] w-[60px] cursor-grab items-center justify-center rounded-full active:cursor-grabbing"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <Wifi className="h-5 w-5 text-primary-foreground" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success">
            On
          </span>
        </button>
      )}
    </div>
  );
}
