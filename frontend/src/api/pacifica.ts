import axios from "axios";

const pacificaApi = axios.create({
  baseURL: "http://localhost:8000/api/pacifica",
});

export async function fetchPositions() {
  const response = await pacificaApi.get("/positions");
  return response.data.positions;
}

export async function fetchLeaderboard() {
  const response = await pacificaApi.get("/leaderboard");
  return response.data.leaderboard;
}
