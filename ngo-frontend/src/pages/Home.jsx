import MetaTags from "../components/common/MetaTags";

import Banner from "../components/home/Banner";
import VisionSection from "../components/home/VisionSection/VisionSection";
import ImpactSection from "../components/home/ImpactSection/ImpactSection";
import Mission from "../components/home/Mission/Mission";
import Objectives from "../components/home/Objectives/Objectives";
import MembersCarousel from "../components/home/MembersCarousel/MembersCarousel";
import NewsSection from "../components/home/NewsSection/NewsSection";


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
            <MembersCarousel />
            <NewsSection />
        </>
    );
}
