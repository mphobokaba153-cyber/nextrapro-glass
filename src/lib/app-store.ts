export type SymbolConfig = {
  symbol: string;
  lot: string;
  trades: string;
  enabled: boolean;
};

export type Signal = {
  id: number;
  symbol: string;
  action: "BUY" | "SELL";
  lot: string;
  at: string;
};

export type MtAccount = {
  login: string;
  password: string;
  server: string;
  connected: boolean;
};

export const SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "BTCUSD",
  "AUDUSD",
  "USDCAD",
  "GBPJPY",
];

const KEYS = {
  configs: "nextrapro.symbolConfigs",
  account: "nextrapro.mtAccount",
};

export function defaultConfigs(): SymbolConfig[] {
  return SYMBOLS.map((symbol) => ({
    symbol,
    lot: "0.10",
    trades: "1",
    enabled: false,
  }));
}

export function loadConfigs(): SymbolConfig[] {
  try {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(KEYS.configs);
      if (raw) {
        const parsed = JSON.parse(raw) as SymbolConfig[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  return defaultConfigs();
}

export function saveConfigs(configs: SymbolConfig[]) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEYS.configs, JSON.stringify(configs));
    }
  } catch {
    /* ignore */
  }
}

export function loadAccount(): MtAccount {
  try {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(KEYS.account);
      if (raw) return JSON.parse(raw) as MtAccount;
    }
  } catch {
    /* ignore */
  }
  return { login: "", password: "", server: "", connected: false };
}

export function saveAccount(account: MtAccount) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEYS.account, JSON.stringify(account));
    }
  } catch {
    /* ignore */
  }
}

export function clearAppData() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(KEYS.configs);
      window.localStorage.removeItem(KEYS.account);
    }
  } catch {
    /* ignore */
  }
}
