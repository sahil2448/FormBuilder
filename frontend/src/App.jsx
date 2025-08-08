import React from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
