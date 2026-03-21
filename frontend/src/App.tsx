import type { CSSProperties } from "react";

import Dashboard from "./components/Dashboard";

const appShellStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
  color: "#e5e7eb",
  fontFamily: "Segoe UI, Helvetica, Arial, sans-serif",
};

export default function App() {
  return (
    <div style={appShellStyle}>
      <Dashboard />
    </div>
  );
}
