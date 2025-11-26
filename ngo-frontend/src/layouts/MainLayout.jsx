import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SocialIcons from "../components/common/SocialIcons";
import AnnouncementBar from "../components/common/AnnouncementBar";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

export default function MainLayout() {

  const { isAdmin, isMember } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate("/admin/dashboard");
    if (isMember) navigate("/member");
  }, [isAdmin, isMember, navigate]);


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
