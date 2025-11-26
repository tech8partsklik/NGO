import MetaTags from "../components/common/MetaTags"
import PageHeader from "../components/common/PageHeader"

export default function Donation() {
  return (
    <>
      <MetaTags
        title="Donate | Helping Hands NGO"
        description="Donate to help those in need"
      />

      <PageHeader title="Donate Now" />

      <section className="section-spacing">
        <div className="container-xl text-center">

          <h3>Your small contribution can change lives</h3>
          <p className="text-muted mb-4">
            Choose an amount and donate via UPI / Bank / QR.
          </p>

          <div className="d-flex justify-content-center gap-3">

            <button className="btn btn-outline-primary">₹100</button>
            <button className="btn btn-outline-primary">₹500</button>
            <button className="btn btn-primary px-4">₹1000</button>

          </div>

        </div>
      </section>
    </>
  )
}
