import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home as HomeIcon,
  Link2,
  ScanLine,
  Settings as SettingsIcon,
} from "lucide-react";
import robotAvatar from "@/assets/robot-avatar.png";
import { HomeTab, LogsSheet, PairsSheet } from "@/components/app/home-tab";
import { MetaTraderTab } from "@/components/app/metatrader-tab";
import { ScannerTab } from "@/components/app/scanner-tab";
import { SettingsTab } from "@/components/app/settings-tab";
import { ServerBubble } from "@/components/app/server-bubble";
import {
  loadConfigs,
  type MtAccount,
  type Signal,
} from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "NextraPro App — Trading Assistant" },
      {
        name: "description",
        content:
          "The NextraPro mobile trading app: pick your symbols, run the server, scan charts and connect MetaTrader.",
      },
      { property: "og:title", content: "NextraPro App — Trading Assistant" },
      {
        property: "og:description",
        content:
          "Pick your symbols, run the server, scan charts and connect MetaTrader.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppPage,
});

type Tab = "home" | "metatrader" | "scanner" | "settings";

const TABS: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "metatrader", label: "MetaTrader", icon: Link2 },
  { id: "scanner", label: "AI Scanner", icon: ScanLine },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function AppPage() {
  const [tab, setTab] = useState<Tab>("home");
  const [activeRobot, setActiveRobot] = useState("Joker AI");
  const [serverOn, setServerOn] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [account, setAccount] = useState<MtAccount | null>(null);
  const [pairsOpen, setPairsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const signalId = useRef(1);

  /* Fake signal feed while the server runs */
  useEffect(() => {
    if (!serverOn) return;
    const tick = () => {
      const enabled = loadConfigs().filter((c) => c.enabled);
      if (enabled.length === 0) return;
      const pick = enabled[Math.floor(Math.random() * enabled.length)];
      if (!pick) return;
      const action = Math.random() > 0.5 ? "BUY" : "SELL";
      const at = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setSignals((prev) =>
        [
          {
            id: signalId.current++,
            symbol: pick.symbol,
            action: action as Signal["action"],
            lot: pick.lot,
            at,
          },
          ...prev,
        ].slice(0, 20),
      );
    };
    tick();
    const interval = window.setInterval(tick, 7000);
    return () => window.clearInterval(interval);
  }, [serverOn]);

  const stopServer = () => {
    setServerOn(false);
    setSignals([]);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient glow */}
      <div
        className="orb h-96 w-96 -top-24 left-1/2 -translate-x-1/2 bg-primary/30"
        aria-hidden
      />

      <main className="relative z-10 flex-1 pb-28">
        {tab === "home" && (
          <HomeTab
            activeRobot={activeRobot}
            onRobotChange={setActiveRobot}
            onOpenPairs={() => setPairsOpen(true)}
            onOpenLogs={() => setLogsOpen(true)}
            serverOn={serverOn}
            onStartToggle={() =>
              serverOn ? stopServer() : setServerOn(true)
            }
            signalCount={signals.length}
          />
        )}
        {tab === "metatrader" && (
          <MetaTraderTab account={account} setAccount={setAccount} />
        )}
        {tab === "scanner" && <ScannerTab />}
        {tab === "settings" && (
          <SettingsTab
            onReset={() => {
              setAccount(null);
              setSignals([]);
            }}
          />
        )}
      </main>

      {/* Bottom tab bar */}
      <nav
        className="glass-strong fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-md items-stretch justify-between rounded-t-3xl px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
        aria-label="App navigation"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                  active && "bg-primary/15",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-semibold tracking-tight">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Floating server bubble */}
      {serverOn && (
        <ServerBubble serverOn={serverOn} signals={signals} onServerOff={stopServer} />
      )}

      {/* Sheets */}
      <PairsSheet open={pairsOpen} onClose={() => setPairsOpen(false)} />
      <LogsSheet
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        signals={signals}
      />
    </div>
  );
}
