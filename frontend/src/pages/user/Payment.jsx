import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { QRCodeCanvas } from "qrcode.react";

export default function UserPayment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { clearCart } = useCart();

  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔐 Get data passed from checkout
  const session =
  state ||
  JSON.parse(localStorage.getItem("paymentSession"));

  const orderId = session?.orderId;
  const amount = session?.amount;
  const pickupTime = session?.pickupTime;

  const upiId = 'canteen@upi';

  const upiUrl = `upi://pay?pa=${upiId}&pn=Canteen&am=${amount}&cu=INR`;
  // 🚫 Prevent direct access / refresh issues
  if (!orderId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-red-600 font-semibold">
          Invalid payment session. Please place your order again.
        </h2>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmPayment = async () => {
    if (!utr.trim() || utr.length < 8) {
      alert('Please enter a valid Transaction ID (UTR)');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch('http://localhost:5000/api/user/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
          order_id: orderId,
          transaction_id: utr
        })
      });

      const data = await res.json();
      console.log("Payment API status:", res.status);
      console.log("Payment API response:", data);


      if (res.ok) {
        localStorage.removeItem("paymentSession");
        clearCart();
        alert(
          `✅ Payment Successful!\n\nOrder ID: ${orderId}\nPickup Time: ${pickupTime}`
        );
        navigate('/user/orders');
      } else {
        alert(data.error || 'Payment confirmation failed');
      }
    } catch (error) {
      alert('Payment confirmation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#EFEFEF" }}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-center" style={{ color: "#3F7D58" }}>
            Pay Using UPI
          </h1>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-md p-8">

          {/* Order Info */}
          <div className="mb-6 text-sm text-gray-600">
            <p><b>Order ID:</b> {orderId}</p>
            <p><b>Amount:</b> ₹{amount}</p>
            <p><b>Pickup Time:</b> {pickupTime}</p>
          </div>

          {/* UPI ID Section */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#E8F5E9" }}>
            <p className="text-sm text-gray-600 mb-2">UPI ID</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold" style={{ color: "#3F7D58" }}>
                {upiId}
              </p>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: copied ? "#3F7D58" : "#FDF6F0",
                  color: copied ? "white" : "#EF9651"
                }}
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && (
              <p className="text-xs mt-2" style={{ color: "#3F7D58" }}>
                Copied to clipboard!
              </p>
            )}
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-lg" style={{ backgroundColor: "#FAFAFA" }}>
                  <QRCodeCanvas
                    value={upiUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">Scan QR code to pay</p>
              </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">After payment</span>
            </div>
          </div>

          {/* UTR Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Transaction ID (UTR)
            </label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Enter UTR"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 rounded-lg flex gap-3" style={{ backgroundColor: "#FDF6F0" }}>
            <AlertCircle size={20} style={{ color: "#EF9651" }} />
            <p className="text-sm" style={{ color: "#EF9651" }}>
              You can find the UTR in your UPI app payment history.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={confirmPayment}
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60"
            style={{ backgroundColor: "#3F7D58" }}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Payment confirmation may take a few moments
        </div>
      </div>
    </div>
  );
}
