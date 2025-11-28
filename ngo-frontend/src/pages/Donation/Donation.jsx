import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaTags from "../../components/common/MetaTags";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";

import { getSiteCredential } from "../../services/siteCredential.service";
import { createDonationOrder, verifyDonationPayment } from "../../services/donation.service";

import "./Donation.css";

export default function Donation() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    amount: 500,
    cause: "General Fund",
    is_anonymous: false
  });

  /* ================= LOAD RAZORPAY KEY ================= */
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const res = await getSiteCredential();
        if (res?.razorpay_key_id) {
          setRazorpayKey(res.razorpay_key_id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payment gateway");
      }
    };

    loadCredentials();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectAmount = (amount) => {
    setForm((prev) => ({
      ...prev,
      amount
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.amount || form.amount < 1) return toast.error("Enter a valid amount");

    setLoading(true);

    try {
      const payload = {
        user_pk: 0,
        email: form.email,
        amount: Number(form.amount),
        donor_detail_json: {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          cause: form.cause,
          is_anonymous: form.is_anonymous
        }
      };

      const order = await createDonationOrder(payload);

      if (!order?.order_id) throw new Error("Order creation failed");

      const options = {
        key: razorpayKey,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "Helping Hands NGO",
        description: "Donation",
        order_id: order.order_id,

        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },

        handler: async function (response) {
          try {
            const verifyResponse = await verifyDonationPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse?.status === 1 || verifyResponse?.message) {
              toast.success("Payment successful!");

              navigate("/thank-you", {
                state: {
                  name: form.full_name,
                  amount: form.amount,
                  cause: form.cause
                }
              });
            } else {
              toast.error("Payment verification failed");
            }

          } catch (error) {
            console.error(error);
            toast.error("Payment verification error");
          }
        },

        theme: { color: "#0f172a" } // your dark corporate tone
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
      toast.error("Error starting payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Donate | Helping Hands NGO"
        description="Donate to help those in need"
      />

      {/* <PageHeader
        title="Donate Now"
        subtitle="Your small help can bring big change"
      /> */}

      <section className="section-spacing donation-section">
        <div className="container-xl">
          <div className="row justify-content-center">

            <div className="col-lg-7">
              <div className="donation-card">

                <h2 className="text-center fw-bold mb-2">Support Our Mission</h2>
                <p className="text-center text-muted mb-4">
                  Your generosity creates real impact
                </p>

                <form onSubmit={handlePayment}>

                  {/* QUICK AMOUNTS */}
                  <label className="form-label fw-semibold mb-2">
                    Select Amount
                  </label>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {[100, 300, 500, 1000, 2500].map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={`amount-chip ${form.amount === value ? "active" : ""}`}
                        onClick={() => selectAmount(value)}
                      >
                        ₹{value}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOM AMOUNT */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Custom Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control custom-input"
                      value={form.amount}
                      min="1"
                      onChange={handleChange}
                    />
                  </div>

                  {/* CAUSE */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Choose a Cause</label>
                    <select
                      className="form-select custom-input"
                      value={form.cause}
                      onChange={(e) =>
                        setForm({ ...form, cause: e.target.value })
                      }
                    >
                      <option value="General Fund">General Fund</option>
                      <option value="Children Education">Children Education</option>
                      <option value="Food for Needy">Food for Needy</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Medical Help">Medical Help</option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        className="form-control custom-input"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control custom-input"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-control custom-input"
                    />
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="anonymous"
                      checked={form.is_anonymous}
                      onChange={(e) =>
                        setForm({ ...form, is_anonymous: e.target.checked })
                      }
                    />
                    <label className="form-check-label" htmlFor="anonymous">
                      Donate as Anonymous
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="donate-btn w-100 d-block text-center"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-heart me-2"></i>
                        Donate ₹{form.amount}
                      </>
                    )}
                  </button>

                </form>

              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0 d-none d-lg-block">
              <div className="impact-box">

                <div className="impact-header">
                  <h4>Your Impact</h4>
                  <span>What your money does</span>
                </div>

                <ul className="impact-list">
                  <li>
                    <i className="fa-solid fa-bowl-food"></i>
                    <div>
                      <strong>₹100</strong>
                      <span>Feeds a hungry child</span>
                    </div>
                  </li>

                  <li>
                    <i className="fa-solid fa-book"></i>
                    <div>
                      <strong>₹500</strong>
                      <span>Books for students</span>
                    </div>
                  </li>

                  <li>
                    <i className="fa-solid fa-briefcase-medical"></i>
                    <div>
                      <strong>₹1000</strong>
                      <span>Medical aid support</span>
                    </div>
                  </li>

                  <li>
                    <i className="fa-solid fa-graduation-cap"></i>
                    <div>
                      <strong>₹2500</strong>
                      <span>Full education kit</span>
                    </div>
                  </li>
                </ul>

                <div className="impact-highlight">
                  <h6>Why donate to us?</h6>
                  <p>
                    We are a transparent, impact-focused NGO working to uplift
                    underprivileged lives with trust & accountability.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
