import { useLocation, useNavigate } from "react-router-dom";
import "./ThankYou.css";
import toast from "react-hot-toast";

export default function ThankYou() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const donorName = state?.name || "Donor";
    const amount = state?.amount || 0;
    const cause = state?.cause || "General Fund";

    // Demo donor number (can be dynamic later from backend)
    const donorNumber = 1032;

    const handleShare = (platform) => {
        const text = `I just donated ₹${amount} to support "${cause}". Join me in making a difference 💙`;
        const url = window.location.origin;

        if (platform === "linkedin") {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        }

        if (platform === "twitter") {
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
        }

        if (platform === "copy") {
            navigator.clipboard.writeText(`${text} - ${url}`);
            toast.success("Link copied to clipboard");
        }
    };

    return (
        <section className="section-spacing thankyou-section">
            <div className="container d-flex justify-content-center">
                <div className="thankyou-card text-center">

                    {/* ICON */}
                    <div className="thankyou-icon">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    {/* HEADLINE */}
                    <h1 className="thankyou-title">
                        Thank You, <span className="donor-highlight">{donorName}</span>
                    </h1>


                    <p className="thankyou-text">
                        You are officially our <strong>#{donorNumber}</strong> supporter.
                    </p>

                    {/* AMOUNT */}
                    <div className="thankyou-amount">
                        ₹{amount}
                    </div>

                    <p className="thankyou-cause">
                        For: <strong>{cause}</strong>
                    </p>

                    <p className="thankyou-message">
                        Your kindness will help provide food, education and hope to those in need.
                        We are deeply grateful for your support.
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="thankyou-actions">

                        <button className="btn btn-outline-dark">
                            <i className="fa fa-file-pdf me-2"></i>
                            Download Receipt
                        </button>

                        <button className="btn btn-outline-dark">
                            <i className="fa fa-certificate me-2"></i>
                            Get Certificate
                        </button>

                    </div>

                    {/* SHARE */}
                    <div className="share-box">
                        <p className="mb-2 fw-semibold">Share your impact</p>

                        <button
                            className="share-btn linkedin"
                            onClick={() => handleShare("linkedin")}
                        >
                            <i className="fa-brands fa-linkedin-in"></i>
                        </button>

                        <button
                            className="share-btn twitter"
                            onClick={() => handleShare("twitter")}
                        >
                            <i className="fa-brands fa-x-twitter"></i>
                        </button>

                        {/* <button
              className="share-btn copy"
              onClick={() => handleShare("copy")}
            >
              <i className="fa fa-link"></i>
            </button> */}
                    </div>

                    {/* NAVIGATION */}
                    <div className="thankyou-actions mt-4">
                        <button
                            className="btn btn-outline-dark me-2"
                            onClick={() => navigate("/")}
                        >
                            <i className="fa fa-home me-2"></i>
                            Home
                        </button>

                        <button
                            className="btn btn-dark"
                            onClick={() => navigate("/donation")}
                        >
                            <i className="fa fa-heart me-2"></i>
                            Donate Again
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
