import axios from "axios";

const polymarketApi = axios.create({
  baseURL: "http://localhost:8000/api/polymarket",
});

export async function fetchMarkets() {
  const response = await polymarketApi.get("/markets");
  return response.data.markets;
}

export async function fetchSignals() {
  const response = await polymarketApi.get("/signals");
  return response.data.signals;
}
