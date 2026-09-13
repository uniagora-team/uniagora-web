import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ChatPage from "../pages/ChatPage";
import ConversationsPage from "../pages/ConversationsPage";
import LoginPage from "../pages/LoginPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import StoreDetailPage from "../pages/StoreDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/password-reset"
          element={<PasswordResetPage />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/products/:slug"
          element={<ProductDetailPage />}
        />

        <Route
          path="/stores/:slug"
          element={<StoreDetailPage />}
        />

        <Route
          path="/chat"
          element={<ConversationsPage />}
        />

        <Route
          path="/chat/:id"
          element={<ChatPage />}
        />
      </Route>
    </Routes>
  );
}