import ReactDOM from 'react-dom/client';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
//Component
import { App } from "./App"
//CSS
import "./core-ui/styles.css";
import "./routes/countries/countries.css";
import "./routes/country/country.css";

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <App />
      </Router>
    </React.StrictMode>
  );
} else {
  console.error("Root container not found");
}
