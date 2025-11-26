import MetaTags from "../components/common/MetaTags"
import PageHeader from "../components/common/PageHeader"
import GallerySection from "../components/home/GallerySection/GallerySection"

export default function Gallery() {
  return (
    <>
      <MetaTags
        title="Gallery | Helping Hands NGO"
        description="Our social work gallery"
      />

      <PageHeader title="Our Gallery" />
      <GallerySection />
    </>
  )
}
