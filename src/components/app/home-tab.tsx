import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ScrollText,
  SlidersHorizontal,
  X,
} from "lucide-react";
import robotAvatar from "@/assets/robot-avatar.png";
import {
  loadConfigs,
  saveConfigs,
  type Signal,
  type SymbolConfig,
} from "@/lib/app-store";
import { cn } from "@/lib/utils";

const ROBOTS = ["Joker AI", "Vector AI", "Pulse AI"];

export function HomeTab({
  activeRobot,
  onRobotChange,
  onOpenPairs,
  onOpenLogs,
  serverOn,
  onStartToggle,
  signalCount,
}: {
  activeRobot: string;
  onRobotChange: (name: string) => void;
  onOpenPairs: () => void;
  onOpenLogs: () => void;
  serverOn: boolean;
  onStartToggle: () => void;
  signalCount: number;
}) {
  return (
    <div className="flex flex-col px-4 pt-6">
      {/* Top bar — brand + LIVE */}
      <div className="flex items-center justify-center gap-2">
        <img
          src={robotAvatar}
          alt="NextraPro"
          width={1024}
          height={1024}
          loading="lazy"
          className="h-6 w-6 rounded-full object-cover ring-1 ring-glass-border"
        />
        <span className="font-display text-sm font-bold tracking-tight text-foreground">
          NEXTRA&nbsp;PRO
        </span>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-success">
          LIVE
        </span>
      </div>

      {/* Hero — glowing avatar */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-primary-glow/40 blur-2xl" />
          <div className="animate-[spin_14s_linear_infinite] absolute inset-0 rounded-full border-2 border-dashed border-primary/40" />
          <img
            src={robotAvatar}
            alt={activeRobot}
            width={1024}
            height={1024}
            className="relative h-32 w-32 rounded-full object-cover ring-2 ring-primary/50"
          />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
          {activeRobot}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Fully automated mobile EA
        </p>
      </div>

      {/* Control pill — PAIRS | START | LOGS */}
      <div className="glass relative mt-8 flex items-center justify-between rounded-full py-2 pl-6 pr-6">
        <button
          type="button"
          onClick={onOpenPairs}
          className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
          PAIRS
        </button>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={onStartToggle}
            aria-label={serverOn ? "Stop server" : "Start server"}
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.05] active:scale-[0.97]",
              serverOn ? "bg-destructive" : "btn-gradient",
            )}
          >
            {!serverOn && (
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
            )}
            {serverOn ? (
              <span className="h-4 w-4 rounded-[3px] bg-primary-foreground" />
            ) : (
              <span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-primary-foreground" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenLogs}
          className="relative flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ScrollText className="h-4 w-4" />
          LOGS
          {signalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
              {signalCount > 9 ? "9+" : signalCount}
            </span>
          )}
        </button>
      </div>

      {/* Powered by */}
      <div className="mt-4 flex justify-center">
        <span className="glass rounded-full px-4 py-1.5 text-[10px] font-medium tracking-wide text-muted-foreground">
          Powered by <span className="text-gradient font-bold">NEXTRA SYNC</span>
        </span>
      </div>

      {/* Robot list */}
      <div className="mt-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Robot List
        </p>
        <div className="flex flex-col gap-2">
          {ROBOTS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onRobotChange(name)}
              className={cn(
                "glass flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-white/10",
                activeRobot === name && "ring-1 ring-primary/60",
              )}
            >
              <img
                src={robotAvatar}
                alt={name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-glass-border"
              />
              <span className="flex-1 font-display text-sm font-semibold text-foreground">
                {name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {activeRobot === name ? "Selected" : "Standby"}
              </span>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Pairs sheet ---------- */

export function PairsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<SymbolConfig[]>([]);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (open) setRows(loadConfigs());
  }, [open]);

  if (!open) return null;

  const update = (i: number, patch: Partial<SymbolConfig>) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const saveRow = (i: number) => {
    setRows((r) => {
      const next = r.map((row, j) => (j === i ? { ...row, enabled: true } : row));
      saveConfigs(next);
      return next;
    });
    setSavedIdx(i);
    window.setTimeout(() => setSavedIdx(null), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="animate-in fade-in slide-in-from-bottom-8 glass-strong relative z-10 flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl">
        <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">
              Symbols
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Pick lot size and trades per symbol, then Save
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close symbols"
            className="rounded-xl bg-glass p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex flex-col gap-2">
            {rows.map((row, i) => (
              <div
                key={row.symbol}
                className="glass rounded-2xl p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-foreground">
                    {row.symbol}
                  </span>
                  {row.enabled ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                      <Check className="h-3 w-3" />
                      Saved
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      Not saved
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="flex-1">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Lot size
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={row.lot}
                      onChange={(e) => update(i, { lot: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="flex-1">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Trades
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={row.trades}
                      onChange={(e) => update(i, { trades: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => saveRow(i)}
                    className={cn(
                      "btn-gradient mt-4 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-[0.97]",
                      savedIdx === i && "ring-1 ring-success",
                    )}
                  >
                    {savedIdx === i ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Logs sheet ---------- */

export function LogsSheet({
  open,
  onClose,
  signals,
}: {
  open: boolean;
  onClose: () => void;
  signals: Signal[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="animate-in fade-in slide-in-from-bottom-8 glass-strong relative z-10 flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl">
        <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
          <h2 className="font-display text-base font-bold text-foreground">
            Signal Logs
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close logs"
            className="rounded-xl bg-glass p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {signals.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No signals yet. Press START to run the server.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {signals.map((s) => (
                <li
                  key={s.id}
                  className="glass flex items-center justify-between rounded-xl px-3 py-2.5 text-sm"
                >
                  <span className="font-display font-bold text-foreground">
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
                  <span className="text-xs text-muted-foreground">
                    {s.lot} lot
                  </span>
                  <span className="text-xs text-muted-foreground">{s.at}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
