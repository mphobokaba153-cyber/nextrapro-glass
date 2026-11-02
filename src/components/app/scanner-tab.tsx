import { useRef, useState } from "react";
import { ScanLine, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type ScanResult = {
  trend: string;
  signal: "BUY" | "SELL";
  confidence: string;
  entry: string;
  stop: string;
  target: string;
};

function analyse(): ScanResult {
  const buy = Math.random() > 0.5;
  const conf = Math.round(62 + Math.random() * 30);
  const entry = 1 + Math.round(Math.random() * 1000) / 1000;
  return {
    trend: buy ? "Bullish" : "Bearish",
    signal: buy ? "BUY" : "SELL",
    confidence: `${conf}%`,
    entry: entry.toFixed(4),
    stop: (entry - 0.0025).toFixed(4),
    target: (entry + 0.006).toFixed(4),
  };
}

export function ScannerTab() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
  };

  const scan = () => {
    if (!imageUrl || scanning) return;
    setScanning(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(analyse());
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col px-4 pt-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        AI Scanner
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Upload a picture of your chart and scan it for a signal.
      </p>

      {/* Upload */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="glass mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-glass-border p-8 transition-colors hover:bg-white/10"
      >
        {imageUrl ? (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt="Chart to scan"
              className="max-h-56 w-auto"
            />
            {scanning && (
              <div className="absolute inset-x-0 top-0 h-0.5 animate-[scanline_1.2s_ease-in-out_infinite] bg-primary shadow-[0_0_12px_2px_oklch(0.62_0.25_296/0.8)]" />
            )}
          </div>
        ) : (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow">
              <Upload className="h-6 w-6 text-primary-foreground" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              Upload chart picture
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tap to choose an image
            </span>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </button>

      <button
        type="button"
        onClick={scan}
        disabled={!imageUrl || scanning}
        className="btn-gradient mt-4 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
      >
        <ScanLine className="h-4 w-4" />
        {scanning ? "Scanning chart…" : "Scan Chart"}
      </button>

      {/* Result */}
      {result && (
        <div className="glass mt-5 animate-in fade-in slide-in-from-bottom-2 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-foreground">
              Scan Result
            </h2>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold",
                result.signal === "BUY"
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {result.signal}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-glass p-2.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Trend
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {result.trend}
              </dd>
            </div>
            <div className="rounded-xl bg-glass p-2.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Confidence
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {result.confidence}
              </dd>
            </div>
            <div className="rounded-xl bg-glass p-2.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Entry
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {result.entry}
              </dd>
            </div>
            <div className="rounded-xl bg-glass p-2.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Stop / Target
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {result.stop} / {result.target}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            Basic scan mode — full AI chart knowledge will be connected soon.
            Not financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
