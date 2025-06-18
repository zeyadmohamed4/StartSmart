import React, { useState } from "react";
import img from './imgs/meeza.png';
import card from './imgs/cardd.png';
import axios from 'axios';

export default function StripeCard({
  isOpen,
  onClose,
  investmentId,
  investorName,
  formData,
  projectId,
  userToken,
  onPaymentSuccess
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setexpiryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const cleanedCardNumber = cardNumber.replace(/-/g, '');

    // Validation checks
    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }
    if (!expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const [month, year] = expiryDate.split('/');
      if (!month || !year || isNaN(month) || isNaN(year)) {
        newErrors.expiryDate = "Invalid expiry date format";
      } else {
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        const currentDate = new Date();
        const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
        const currentMonth = currentDate.getMonth() + 1;

        if (monthNum < 1 || monthNum > 12) {
          newErrors.expiryDate = "Month must be between 01 and 12";
        } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          newErrors.expiryDate = "Card has expired";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `https://localhost:7010/api/Investment/payment?id=${investmentId}`,
        {
          paymentCompleted: true,
          cardNumber: cleanedCardNumber,
          expiryDate,
          cvv,
          paymentMethod
        }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log("Payment processed:", {
        investmentId,
        projectId,
        amount: formData,
        paymentMethod
      });
      if (onPaymentSuccess) onPaymentSuccess();
      resetForm();

      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      // Dummy success for demo purposes
      if (onPaymentSuccess) onPaymentSuccess();
      resetForm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join("-");
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: null }));
  };



  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) setCvv(value);
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: null }));
  };

  const handleexpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    if (value.length > 5) {
      value = value.substring(0, 5);
    }
    setexpiryDate(value);
    if (errors.expiryDate) setErrors(prev => ({ ...prev, expiryDate: null }));
  };

  const resetForm = () => {
    setCardNumber("");
    setCvv("");
    setexpiryDate("");
    setErrors({});
  };

  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-[500px] relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          ×
        </button>

        <h2 className="text-center text-lg font-bold py-2 font-monst mb-3 text-[#00192f]">
          Payment Details
        </h2>
        <h2 className="text-lg font-bold text-gray-700 mb-2">Pay {formData}</h2>


        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 font-lato">We support:</p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-8 w-10 cursor-pointer"
              onClick={() => handleMethodChange('visa')}
            />
            <img
              src={card}
              alt="Mastercard"
              className="h-8 w-10 cursor-pointer"
              onClick={() => handleMethodChange('mastercard')}
            />
            <img
              src={img}
              alt="Meeza Card"
              className="h-8 w-10 cursor-pointer"
              onClick={() => handleMethodChange('meeza')}
            />
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold font-monst text-left">Card Number</label>
            <input
              type="text"
              className="w-full mt-1 font-monst text-[#00192f] px-3 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder={paymentMethod === "meeza" ? "Meeza 16 digits" : "1234 - 4567 - 8901 - 2345"}
              maxLength={paymentMethod === "meeza" ? 19 : 23}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1 text-left ml-2">{errors.cardNumber}</p>
            )}
          </div>

          <div className="mb-4" >
            <label className="block text-gray-700 text-lg font-semibold font-monst text-left" disabled >Cardholder Name</label>
            <input
              type="text"
              className="w-full text-[#00192f] font-lato mt-1 px-3 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={investorName}
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold font-monst text-left">CVV</label>
              <input
                type="text"
                className="w-full mt-1 px-3 text-[#00192f] py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="•••"
                maxLength="3"
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1 text-left ml-2">{errors.cvv}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-semibold font-monst text-left">expiryDate Date</label>
              <input
                type="text"
                className="w-full font-monst text-[#00192f] mt-1 px-3 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={expiryDate}
                onChange={handleexpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiryDate
                && (
                  <p className="text-red-500 text-xs mt-1 text-left ml-2">{errors.expiryDate}</p>
                )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="text-gray-300 w-full bg-[#00192F] text-lg font-bold text-center font-monst border-blue-300 border-2 shadow-md px-6 py-3 rounded-2xl hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}