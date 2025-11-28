import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Donation from "../pages/Donation/Donation";
import ThankYou from "../pages/Donation/ThankYou"

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
import AllMembers from "../pages/admin/Members/AllMembers";
import AddBanner from "../pages/admin/Banners/AddBanner";
import AllBanners from "../pages/admin/Banners/AllBanners";
import UpdateBanner from "../pages/admin/Banners/UpdateBanner";
import AllRoles from "../pages/admin/Roles/AllRoles";
import AllAnnouncements from "../pages/admin/Announcement/AllAnnouncements";
import AllTestimonials from "../pages/admin/Testimonials/AllTestimonials";
import AddTestimonial from "../pages/admin/Testimonials/AddTestimonial";
import UpdateTestimonial from "../pages/admin/Testimonials/UpdateTestimonial";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ==================== PUBLIC WEBSITE ==================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/donation" element={<Donation />} />
        <Route path="/thank-you" element={<ThankYou />} />

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
        {/* <Route path="members" element={<div>Members Management</div>} /> */}
        <Route path="members" element={<AllMembers/>} />


        <Route path="banners" element={<AllBanners/>} />
        <Route path="banners/add" element={<AddBanner />} />
        <Route path="banners/edit/:id" element={<UpdateBanner />} />


        <Route path="roles" element={<AllRoles/>} />
        <Route path="announcements" element={<AllAnnouncements/>} />

            <Route path="testimonials" element={<AllTestimonials/>} />
        <Route path="testimonials/add" element={<AddTestimonial />} />
        <Route path="testimonials/:id" element={<UpdateTestimonial />} />

        <Route path="donations" element={<div>Donation Management</div>} />
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
