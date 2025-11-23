import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SocialIcons from "../components/common/SocialIcons";
import AnnouncementBar from "../components/common/AnnouncementBar";

export default function MainLayout() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <SocialIcons />
      <main className="min-vh-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
