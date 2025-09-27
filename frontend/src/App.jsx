import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RequestsProvider } from "./context/RequestsContext";
import Header from "./components/Header";
import AnimatedRoutes from "./AnimatedRoutes";

function App() {
  return (
    <RequestsProvider>
      <Router>
        <div className="app-container">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="container">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </RequestsProvider>
  );
}

export default App;
