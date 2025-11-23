import { useState } from "react";
import { createOrder, verifyPayment } from "../services/donationService";

export default function DonationPage() {
  const [amount, setAmount] = useState(500);

  const handlePayment = async () => {
    try {
      const order = await createOrder(amount);

      const options = {
        key: order.key,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "HopeBridge Foundation",
        description: "Donation",
        order_id: order.order_id, // FIXED

        handler: async function (response) {
          console.log("Razorpay Response:", response);

          // Send for backend verification
          const verifyResponse = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.message) {
            alert("🎉 Payment Successful! Thank you for donating.");
          } else {
            alert("❌ Payment verification failed!");
          }
        },

        theme: { color: "#0d9488" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      alert("Error starting payment. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Donate Now</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Proceed to Pay
      </button>
    </div>
  );
}
