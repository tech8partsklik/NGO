import MetaTags from "../components/common/MetaTags";

import Banner from "../components/home/Banner";
import VisionSection from "../components/home/VisionSection/VisionSection";
import ImpactSection from "../components/home/ImpactSection/ImpactSection";
import Mission from "../components/home/Mission/Mission";
import Objectives from "../components/home/Objectives/Objectives";
import MembersCarousel from "../components/home/MembersCarousel/MembersCarousel";
import NewsSection from "../components/home/NewsSection/NewsSection";
import JoinUsSection from "../components/home/JoinUsSection/JoinUsSection";
import TestimonialsSection from "../components/home/TestimonialsSection/TestimonialsSection";
import YoutubeSection from "../components/home/YoutubeSection/YoutubeSection";
import DonateCTA from "../components/home/DonateCTA/DonateCTA";
import GallerySection from "../components/home/GallerySection/GallerySection";
import VideoSection from "../components/home/VideoSection/VideoSection";


export default function Home() {
    return (
        <>
            <MetaTags
                title="NGO Home | Helping People, Changing Lives"
                description="Official NGO website to support, help and empower people through our initiatives."
            />

            <Banner />
            <VisionSection />
            <ImpactSection />
            <Mission />
            <Objectives />

            <GallerySection />

            <DonateCTA />

            <MembersCarousel />

            {/* <YoutubeSection /> */}
            <VideoSection />
            <TestimonialsSection />

            <NewsSection />


            <JoinUsSection />
        </>
    );
}
