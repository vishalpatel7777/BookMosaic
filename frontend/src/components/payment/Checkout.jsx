import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://bookmosaic.onrender.com";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { amount, customer_id, customer_email, customer_phone, book } = state || {};
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      if (!amount || !customer_id || !customer_email || !customer_phone || !book) {
        console.error("Missing payment details");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/api/v1/create-payment`, {
          amount,
          currency: "INR",
          customer_id,
          customer_email,
          customer_phone,
          version: "2025-01-01",
        });

        const { orderToken } = response.data;
        setPaymentSessionId(orderToken);

        if (orderToken) {
          const cashfree = await load({ mode: "sandbox" });
          cashfree.checkout({ paymentSessionId: orderToken, redirectTarget: "_modal" })
            .then((result) => {
              if (result.paymentDetails) {
                console.log("Payment Successful");
                navigate("/payment-success", {
                  state: {
                    book: book,
                    amount,
                    customer_email,
                    paymentDetails: result.paymentDetails,
                  },
                });
              } else if (result.error) {
                console.log("Error in payment:", result.error);
              }
            });
        }
      } catch (error) {
        console.error("Error fetching session ID:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [amount, customer_id, customer_email, customer_phone, book, navigate]);

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6">
      {loading ? (
        <p>Loading payment...</p>
      ) : (
        <button onClick={() => window.location.reload()} disabled={!paymentSessionId}>
          Pay Now
        </button>
      )}
    </div>
  );
}

export default Checkout;