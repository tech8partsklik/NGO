import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Donation from "../pages/Donation";
import Membership from "../pages/Membership";
import Gallery from "../pages/Gallery";
import News from "../pages/News";
import Contact from "../pages/Contact";

import MemberLogin from "../pages/members/Login";
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import MemberDashboard from "../pages/members/Dashboard";

import ProtectedRoute from "../components/admin/ProtectedRoute";
import MemberRoute from "../components/members/MemberRoute";

import About from "../pages/About/About";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ==================== PUBLIC WEBSITE ==================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AdminLogin />} />
      </Route>

      {/* ==================== LOGIN ==================== */}
      <Route path="/member/login" element={<MemberLogin />} />

      {/* ==================== ADMIN ==================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* ==================== MEMBER ==================== */}
      <Route
        path="/member"
        element={
          <MemberRoute>
            <MemberDashboard />
          </MemberRoute>
        }
      />

    </Routes>
  );
}
