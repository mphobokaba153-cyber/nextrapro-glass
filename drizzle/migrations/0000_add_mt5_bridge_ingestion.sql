CREATE TABLE public.mt5_bridge_account_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_login bigint NOT NULL CHECK (account_login > 0),
  server text NOT NULL,
  currency text,
  balance numeric,
  equity numeric,
  margin numeric,
  margin_free numeric,
  margin_level numeric,
  leverage integer,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mt5_bridge_account_snapshots_login_server_key UNIQUE (account_login, server)
);
GRANT ALL ON public.mt5_bridge_account_snapshots TO service_role;
ALTER TABLE public.mt5_bridge_account_snapshots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.mt5_bridge_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  account_login bigint NOT NULL CHECK (account_login > 0),
  server text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('OPEN', 'CLOSE', 'MODIFY')),
  symbol text NOT NULL,
  ticket bigint NOT NULL,
  direction text,
  volume numeric,
  price_open numeric,
  price_current numeric,
  sl numeric,
  tp numeric,
  profit numeric,
  occurred_at timestamptz NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.mt5_bridge_events TO service_role;
ALTER TABLE public.mt5_bridge_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX mt5_bridge_events_account_time_idx
  ON public.mt5_bridge_events (account_login, server, occurred_at DESC);
CREATE INDEX mt5_bridge_events_ticket_time_idx
  ON public.mt5_bridge_events (ticket, occurred_at DESC);