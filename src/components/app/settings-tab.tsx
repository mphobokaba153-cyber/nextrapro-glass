import { Info, RotateCcw, ShieldCheck } from "lucide-react";
import { clearAppData } from "@/lib/app-store";

export function SettingsTab({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col px-4 pt-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">App and data options.</p>

      <div className="mt-5 flex flex-col gap-2">
        <div className="glass flex items-center gap-3 rounded-2xl p-4">
          <Info className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              NextraPro App
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Version 1.0.0 · Mobile EA platform
            </p>
          </div>
        </div>

        <div className="glass flex items-center gap-3 rounded-2xl p-4">
          <ShieldCheck className="h-5 w-5 text-success" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Data stays on this device
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Symbols, trades and account details are saved locally.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            clearAppData();
            onReset();
          }}
          className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Clear saved data
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Removes saved symbols and MetaTrader details.
            </p>
          </div>
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] text-muted-foreground">
        © 2026 NEXTRA PRO. All rights reserved.
      </p>
    </div>
  );
}
