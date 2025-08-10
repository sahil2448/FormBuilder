import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import FormEditor from "./components/FormEditor/FormEditor";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/form/edit/:formId" element={<FormEditor />} />
      </Routes>
    </div>
  );
}

export default App;
