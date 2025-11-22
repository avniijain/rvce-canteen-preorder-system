import { Routes, Route } from "react-router-dom";
import CanteenAuthSystem from "./pages/authSystem";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CanteenAuthSystem />} />
      <Route path="/auth" element={<CanteenAuthSystem />} />
    </Routes>
  );
}
