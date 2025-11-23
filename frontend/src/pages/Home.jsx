import { useTheme } from "../hooks/useTheme";
import HeroSlider from "../components/HeroSlider";
import DonationStats from "../components/DonationStats";
import FloatingDonatePopup from "../components/FloatingDonatePopup";

import AboutSection from "../components/home/AboutSection";
import MissionGoals from "../components/home/MissionGoals";
import LeadershipSection from "../components/home/LeadershipSection";
import LatestNews from "../components/home/LatestNews";
import GalleryPreview from "../components/home/GalleryPreview";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text }}>
      <HeroSlider />
      <DonationStats />
      <AboutSection />
      <MissionGoals />
      <LeadershipSection />
      <LatestNews />
      <GalleryPreview />
      <FloatingDonatePopup />
    </div>
  );
}
