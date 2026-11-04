import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}