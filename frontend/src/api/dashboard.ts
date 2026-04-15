import axios from "axios";

export interface PacificaMarketSnapshot {
  symbol: string;
  base_asset: string;
  mark_price: number;
  mid_price: number;
  oracle_price: number;
  yesterday_price: number;
  price_change_24h: number;
  funding_rate: number;
  next_funding_rate: number;
  open_interest: number;
  volume_24h: number;
  timestamp: number;
  best_bid: number | null;
  best_ask: number | null;
  spread_bps: number | null;
  orderbook_imbalance: number | null;
  trade_flow_bias: number | null;
  recent_trade_count: number;
  last_trade_price: number | null;
  last_trade_side: string | null;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  slug: string;
  related_asset: string;
  pacifica_symbol: string;
  probability: number;
  one_hour_price_change: number | null;
  one_day_price_change: number | null;
  one_week_price_change: number | null;
  volume_24h: number;
  liquidity: number;
  best_bid: number | null;
  best_ask: number | null;
  last_trade_price: number | null;
  spread: number | null;
  accepting_orders: boolean;
  clob_token_id: string | null;
}

export interface HedgeSignal {
  signal_id: string;
  market_question: string;
  market_slug: string;
  related_asset: string;
  pacifica_symbol: string;
  signal_type: "lead" | "confirm" | "fade";
  suggested_side: "long" | "short";
  confidence: number;
  urgency: "monitor" | "elevated" | "immediate";
  suggested_notional_usd: number;
  polymarket_probability: number;
  polymarket_move_1h: number | null;
  polymarket_move_1d: number | null;
  polymarket_volume_24h: number;
  pacifica_mark_price: number;
  pacifica_price_change_24h: number;
  pacifica_funding_rate: number;
  pacifica_orderbook_imbalance: number | null;
  pacifica_trade_flow_bias: number | null;
  rationale: string;
}

export interface DashboardOverview {
  generated_at: string;
  pacifica: {
    markets: PacificaMarketSnapshot[];
    summary: {
      count: number;
      total_volume_24h: number;
      total_open_interest: number;
    };
  };
  polymarket: {
    markets: PolymarketMarket[];
    summary: {
      count: number;
      total_volume_24h: number;
      total_liquidity: number;
    };
  };
  signals: {
    hedges: HedgeSignal[];
    summary: {
      count: number;
      immediate: number;
      assets: string[];
    };
  };
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
const dashboardApi = axios.create({
  baseURL: `${apiBaseUrl}/api/dashboard`,
});

export async function fetchDashboardOverview() {
  const response = await dashboardApi.get<DashboardOverview>("/overview");
  return response.data;
}
