import MetaTags from "../components/common/MetaTags"
import PageHeader from "../components/common/PageHeader"
import { Link } from "react-router-dom"

export default function Membership() {
  return (
    <>
      <MetaTags
        title="Membership | Helping Hands NGO"
        description="Become a member of our NGO"
      />

      <PageHeader title="Membership" />

      <section className="section-spacing">
        <div className="container-xl text-center">

          <h3>Become a proud member</h3>
          <p className="text-muted mb-4">
            Join our NGO and be a part of meaningful change.
          </p>

          <Link to="/membership/apply" className="btn btn-success px-5 py-2">
            Apply for Membership
          </Link>

        </div>
      </section>
    </>
  )
}
