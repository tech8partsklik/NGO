import MetaTags from "../components/common/MetaTags"
import PageHeader from "../components/common/PageHeader"
import NewsSection from "../components/home/NewsSection/NewsSection"

export default function News() {
  return (
    <>
      <MetaTags
        title="News | Helping Hands NGO"
        description="Latest news and activities"
      />

      <PageHeader title="Latest News" />
      <NewsSection />
    </>
  )
}
