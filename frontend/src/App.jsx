import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import FormEditor from "./components/FormEditor/FormEditor";
import FormPreview from "./components/FornPreview/FormPreview";
import FormPlayer from "./components/FormPlayer/FormPlayer";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/form/edit/:formId" element={<FormEditor />} />
        <Route path="/form/preview/:formId" element={<FormPreview />} />
        <Route path="/form/:shareableLink" element={<FormPlayer />} />
      </Routes>
    </div>
  );
}

export default App;
