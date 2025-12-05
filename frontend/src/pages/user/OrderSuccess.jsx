import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, totalAmount } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
      <p className="text-lg mt-3">Thank you for ordering with us.</p>

      <div className="border rounded p-4 mt-5 shadow">
        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>Amount Paid:</strong> ₹ {totalAmount}</p>
      </div>

      <button
        onClick={() => navigate("/orders")}
        className="bg-blue-600 text-white py-2 px-6 rounded mt-6"
      >
        Go to My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;
