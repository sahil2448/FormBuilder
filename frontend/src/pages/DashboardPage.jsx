import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/dashboad/Dashboard";

function DashboardPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default DashboardPage;
