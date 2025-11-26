import MetaTags from "../components/common/MetaTags"
import PageHeader from "../components/common/PageHeader"

export default function Contact() {
  return (
    <>
      <MetaTags
        title="Contact Us | Helping Hands NGO"
        description="Get in touch with us"
      />

      <PageHeader title="Contact Us" />

      <section className="section-spacing">
        <div className="container-xl">

          <div className="row g-5">

            {/* CONTACT DETAILS */}
            <div className="col-md-5">
              <h4>Contact Information</h4>
              <p className="text-muted">We’d love to hear from you</p>

              <p><i className="fa fa-phone me-2"></i> +91 98765 43210</p>
              <p><i className="fa fa-envelope me-2"></i> info@ngo.org</p>
              <p><i className="fa fa-map-marker-alt me-2"></i> New Delhi, India</p>
            </div>

            {/* CONTACT FORM */}
            <div className="col-md-7">
              <div className="p-4 bg-light rounded-4 shadow-sm">

                <div className="row g-3">

                  <div className="col-md-6">
                    <input className="form-control" placeholder="Your Name" />
                  </div>

                  <div className="col-md-6">
                    <input className="form-control" placeholder="Email" />
                  </div>

                  <div className="col-12">
                    <textarea className="form-control" rows="4" placeholder="Message"></textarea>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-primary px-4 py-2">
                      Send Message
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}
