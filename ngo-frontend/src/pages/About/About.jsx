
import MetaTags from "../../components/common/MetaTags"
import PageHeader from "../../components/common/PageHeader"

export default function About() {
  return (
    <>
      <MetaTags
        title="About Us | Helping Hands NGO"
        description="Learn more about our NGO, vision, mission and impact"
      />

       <PageHeader
        title="About Us"
        subtitle="Learn more about our NGO, vision & mission"
      />

      <section className="section-spacing">
        <div className="container-xl">
          <div className="row align-items-center g-5">

            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&w=1200&q=80"
                className="img-fluid rounded-4 shadow"
                alt="about"
              />
            </div>

            <div className="col-md-6">
              <div className="section-heading">
                <h2>Who We Are</h2>
                <p>Helping Hands NGO</p>
              </div>

              <p className="text-muted">
                Helping Hands is a non-profit organization dedicated to uplifting
                underprivileged communities through education, healthcare, and
                essential support services.
              </p>

              <p className="text-muted">
                Since our establishment, we have helped hundreds of families and
                empowered youth to build a brighter future.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
