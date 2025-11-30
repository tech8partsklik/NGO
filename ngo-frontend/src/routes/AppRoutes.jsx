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
import AllGallery from "../pages/admin/Gallery/AllGallery";
import AddGallery from "../pages/admin/Gallery/AddGallery";
import UpdateGallery from "../pages/admin/Gallery/UpdateGallery";
import AllCampaigns from "../pages/admin/Campaigns/AllCampaigns";
import AddCampaign from "../pages/admin/Campaigns/AddCampaign";
import UpdateCampaign from "../pages/admin/Campaigns/UpdateCampaign";
import AllNews from "../pages/admin/News/AllNews";
import AddNews from "../pages/admin/News/AddNews";
import UpdateNews from "../pages/admin/News/UpdateNews";
import AllEvents from "../pages/admin/Event/AllEvents";
import AddEvent from "../pages/admin/Event/AddEvent";
import UpdateEvent from "../pages/admin/Event/UpdateEvent";
import Donations from "../pages/admin/Donation/Donations";
import SiteDataEditor from "../pages/admin/SiteData/SiteDataEditor";
import AboutEditor from "../pages/admin/SiteData/AboutEditor";
import MissionEditor from "../pages/admin/SiteData/MissionEditor";
import VisionEditor from "../pages/admin/SiteData/VisionEditor";
import ObjectiveEditor from "../pages/admin/SiteData/ObjectiveEditor";
import AchievementEditor from "../pages/admin/SiteData/AchievementEditor";
import AllCertificate from "../pages/admin/Certificate/AllCertificate";
import CertificateAdd from "../pages/admin/Certificate/CertificateAdd";
import CertificateEdit from "../pages/admin/Certificate/CertificateEdit";
import YouTubeVideoManager from "../pages/admin/YouTubeVideoManager/YouTubeVideoManager";

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
        <Route path="members" element={<AllMembers />} />


        <Route path="banners" element={<AllBanners />} />
        <Route path="banners/add" element={<AddBanner />} />
        <Route path="banners/edit/:id" element={<UpdateBanner />} />


        <Route path="roles" element={<AllRoles />} />
        <Route path="announcements" element={<AllAnnouncements />} />

        <Route path="testimonials" element={<AllTestimonials />} />
        <Route path="testimonials/add" element={<AddTestimonial />} />
        <Route path="testimonials/:id" element={<UpdateTestimonial />} />

        {/*  Gallery (NEW) */}
        <Route path="gallery" element={<AllGallery />} />
        <Route path="gallery/add" element={<AddGallery />} />
        <Route path="gallery/:id" element={<UpdateGallery />} />

        <Route path="campaigns" element={<AllCampaigns />} />
        <Route path="campaigns/add" element={<AddCampaign />} />
        <Route path="campaigns/:id" element={<UpdateCampaign />} />


        <Route path="news" element={<AllNews />} />
        <Route path="news/add" element={<AddNews />} />
        <Route path="news/:id" element={<UpdateNews />} />

        <Route path="events" element={<AllEvents />} />
        <Route path="events/add" element={<AddEvent />} />
        <Route path="events/:id" element={<UpdateEvent />} />



        <Route path="donations" element={<Donations />} />



        <Route path="site-data" element={<SiteDataEditor />} />

        <Route path="site-data/about" element={<AboutEditor />} />
        <Route path="site-data/mission" element={<MissionEditor />} />
        <Route path="site-data/vision" element={<VisionEditor />} />
        <Route path="site-data/objective" element={<ObjectiveEditor />} />
        <Route path="site-data/achievement" element={<AchievementEditor />} />

        {/* ================= CERTIFICATES ================= */}
        <Route path="certificates" element={<AllCertificate />} />
        <Route path="certificates/add" element={<CertificateAdd />} />
        <Route path="certificates/:id" element={<CertificateEdit />} />

        <Route path="youtube-videos" element={<YouTubeVideoManager />} />


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
