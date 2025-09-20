import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";

// Initialize Google Analytics if measurement ID is provided
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaMeasurementId) {
  initGA(gaMeasurementId);
}

createRoot(document.getElementById("root")!).render(<App />);
