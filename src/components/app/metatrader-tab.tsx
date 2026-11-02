import { useEffect, useState } from "react";
import { Check, Link2, PlugZap } from "lucide-react";
import { loadAccount, saveAccount, type MtAccount } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export function MetaTraderTab({
  account,
  setAccount,
}: {
  account: MtAccount | null;
  setAccount: (a: MtAccount) => void;
}) {
  const [form, setForm] = useState<MtAccount>({
    login: "",
    password: "",
    server: "",
    connected: false,
  });
  const [saved, setSaved] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setForm(loadAccount());
  }, []);

  useEffect(() => {
    if (account) setForm(account);
  }, [account]);

  const update = (patch: Partial<MtAccount>) =>
    setForm((f) => ({ ...f, ...patch }));

  const onSave = () => {
    const next = { ...form, connected: false };
    saveAccount(next);
    setAccount(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  const onConnect = () => {
    if (!form.login.trim() || !form.password.trim() || !form.server.trim()) return;
    setConnecting(true);
    window.setTimeout(() => {
      const next = { ...form, connected: true };
      saveAccount(next);
      setAccount(next);
      setConnecting(false);
    }, 1400);
  };

  const ready =
    form.login.trim() && form.password.trim() && form.server.trim();

  return (
    <div className="flex flex-col px-4 pt-8">
      {/* Visual cut */}
      <div className="flex flex-col items-center" aria-hidden>
        <div className="relative flex w-full items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute h-2.5 w-2.5 rotate-45 rounded-[2px] bg-primary shadow-[0_0_14px_2px_oklch(0.62_0.25_296/0.7)]" />
        </div>
        <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Account Connection
        </span>
      </div>

      {/* MetaTrader */}
      <h1 className="mt-8 font-display text-2xl font-bold tracking-tight text-foreground">
        MetaTrader
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Connect your trading account. Enter your login details, save them, then
        connect.
      </p>

      <div className="glass mt-5 flex flex-col gap-4 rounded-2xl p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Account number
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={form.login}
            onChange={(e) => update({ login: e.target.value })}
            placeholder="e.g. 12345678"
            className="rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
            placeholder="Your account password"
            className="rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Server
          </span>
          <input
            type="text"
            value={form.server}
            onChange={(e) => update({ server: e.target.value })}
            placeholder="e.g. Exness-MT5Real8"
            className="rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </label>

        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className={cn(
              "glass flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-foreground transition-transform active:scale-[0.98]",
              saved && "ring-1 ring-success",
            )}
          >
            {saved ? <Check className="h-4 w-4 text-success" /> : null}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={onConnect}
            disabled={!ready || connecting}
            className={cn(
              "btn-gradient flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100",
            )}
          >
            <PlugZap className="h-4 w-4" />
            {connecting ? "Connecting…" : "Connect"}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="glass mt-4 flex items-center gap-3 rounded-2xl p-4">
        <Link2
          className={cn(
            "h-5 w-5",
            form.connected ? "text-success" : "text-muted-foreground",
          )}
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {form.connected ? "Account connected" : "Not connected"}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {form.connected
              ? `${form.login} · ${form.server}`
              : "Save your details, then press Connect."}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider",
            form.connected
              ? "bg-success/15 text-success"
              : "bg-glass text-muted-foreground",
          )}
        >
          {form.connected ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </div>
  );
}
