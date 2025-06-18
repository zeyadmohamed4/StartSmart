import React, { useState, useEffect } from "react";
import SignatureModal from "./SignatureModal.jsx";
import StyledInput from "./StyledInput.jsx";
import StripeCard from "./StripeCard.jsx";
import video from "./imgs/videoo.mp4";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Payment() {
  const location = useLocation();
  const {
    ProjectName,
    CampaignDealType,
    InvestorName,
    InvestmentStatus,
    InvestmentId: propInvestmentId,
    InvestmentAmount,
    pendingData,
    ProjectId,
    MinInvest,
    MaxInvest,
  } = location.state || {};
  const [userToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);
  const [investStatus, setInvestStatus] = useState(() => InvestmentStatus || "Invest");
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("investmentFormData");
    return saved
      ? JSON.parse(saved)
      : {
        investmentAmount: InvestmentAmount || "",
        equityPercentage: 0,
        interestRate: 0,
        revenueShare: 0,
        projectId: ProjectId,
      };
  });
  const [investmentId, setInvestmentId] = useState(() => {
    const saved = localStorage.getItem("investmentId");
    return propInvestmentId || saved || null;
  });
  const [paymentSuccess, setPaymentSuccess] = useState(() => {
    if (investmentId) {
      const saved = localStorage.getItem(`paymentSuccess_${investmentId}`);
      return saved === "true";
    }
    return false;
  });
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureResetKey, setSignatureResetKey] = useState(0);
  const [error, setError] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Decode user token
  const [tokenProjectIds, setTokenProjectIds] = useState([]);

  // Decode user token
  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);

        setUserId(decoded.userId || decoded.sub);

        if (decoded.projectId) {
          if (Array.isArray(decoded.projectId)) {
            setTokenProjectIds(decoded.projectId);
          } else {
            setTokenProjectIds([decoded.projectId]);
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [userToken]);

  // Fetch pending investment data including paymentCompleted
  useEffect(() => {
    const fetchPendingInvestment = async () => {
      try {

        const response = await axios.get(
          `https://localhost:7010/api/Investment/Get_Investment?projectId=${ProjectId}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        if (response.data) {
          setFormData({
            investmentAmount: response.data.investmentAmount,
            equityPercentage: response.data.equityPercentage,
            interestRate: response.data.interestRate,
            revenueShare: response.data.revenueShare,
          });
          setIsSigned(response.data.isSigned || false);
          const wasPaymentCompleted = Boolean(response.data.completePayment);
          setPaymentSuccess(wasPaymentCompleted);
          if (wasPaymentCompleted && investmentId) {
            localStorage.setItem(`paymentSuccess_${investmentId}`, "true");
          }
        }
      } catch (error) {
        console.error("Error fetching pending investment:", error);
      }
    };
    if (investStatus === "Pending" || investStatus === "Approved") {
      fetchPendingInvestment();
    }
  }, [investStatus, ProjectId, userToken, investmentId]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form change + save to localStorage
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    localStorage.setItem("investmentFormData", JSON.stringify(newFormData));
    validateField(name, value);
  };

  // Field validation
  const validateField = (name, value) => {
    const newErrors = { ...error };
    if (!value) {
      delete newErrors[name];
    } else if (name === "investmentAmount") {
      const amount = parseFloat(value);
      if (amount < MinInvest) {
        newErrors.investmentAmount = `Minimum investment is ${formatCurrency(MinInvest)}.`;
      } else if (amount > MaxInvest) {
        newErrors.investmentAmount = `Maximum investment is ${formatCurrency(MaxInvest)}.`;
      } else {
        delete newErrors.investmentAmount;
      }
    } else if (["equityPercentage", "interestRate", "revenueShare"].includes(name)) {
      const percent = parseFloat(value);
      if (percent < 0 || percent > 100) {
        newErrors[name] = "Value must be between 0 and 100.";
      } else {
        delete newErrors[name];
      }
    }
    setError(newErrors);
  };

  const navigate = useNavigate();

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonsDisabled(true);
    try {
      if (investStatus === "Invest") {
        const response = await axios.post(
          "https://localhost:7010/api/Investment/Create",
          {
            ProjectName,
            ...formData,
            ProjectId,
            InvestorId: userId,
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const newStatus = response.investmentStatus || "Pending";
        setInvestStatus(newStatus);
        localStorage.removeItem("investmentFormData"); // ✅ Clear after submit

      } else if (Object.keys(error).length === 0 && isSigned) {
        setIsCardModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting investment:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // On payment success
  const handlePaymentSuccess = () => {
    if (!investmentId) return;
    setPaymentSuccess(true);
    localStorage.setItem(`paymentSuccess_${investmentId}`, "true");

  };

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Conditional rendering flags
  const showEquity = CampaignDealType === "Equity CrowdFunding";
  const showInterest = ["Debt CrowdFunding", "Convertible Notes"].includes(CampaignDealType);
  const showRevenueShare = CampaignDealType === "Revenue Based Financing";

  const isFormValid =
    formData.investmentAmount &&
    !error.investmentAmount &&
    (!showEquity || (formData.equityPercentage && !error.equityPercentage)) &&
    (!showInterest || (formData.interestRate && !error.interestRate)) &&
    (!showRevenueShare || (formData.revenueShare && !error.revenueShare));

  return (
    <div className="relative w-full">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-[600px] -z-10 overflow-hidden">
        <video autoPlay loop muted className="w-full h-full object-cover brightness-[0.4]">
          <source src={video} type="video/mp4" />
        </video>
      </div>

      {/* Header Section */}
      <div className="h-[600px] flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-monst text-gray-300 font-bold">Invest in {ProjectName}</h1>
        {/* Conditional Messages */}
        {investStatus === "Approved" && paymentSuccess && (
          <p className="text-lg font-lato mt-2 text-green-400 text-center">
            You have invested in {ProjectName} successfully
          </p>
        )}
        {investStatus === "Approved" && !paymentSuccess && (
          <p className="text-lg font-lato mt-2 text-gray-200 text-center">
            Your investment offer has been submitted successfully - complete payment
          </p>
        )}
        {investStatus !== "Approved" && (
          <p className="text-lg font-lato mt-2 text-gray-200 text-center">
            {investStatus === "Pending"
              ? "Your investment offer is pending approval"
              : "Join our journey and grow with us."}
          </p>
        )}
      </div>

      {/* Form Section */}
      <section className="bg-[#00192F] px-6 py-16 -mt-32 rounded-t-3xl shadow-xl relative z-10 w-[900px] mx-auto flex justify-center items-center">
        <div className="max-w-2xl w-full space-y-10">
          {/* Success Message Box */}
          {isLoading && (investStatus === "Approved" && paymentSuccess) && (
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
              <p className="font-bold text-xl">
                You have invested in {ProjectName} successfully
              </p>
            </div>
          )}

          <h2 className="text-center font-[800] text-gray-300 font-monst text-2xl">Investment Details</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Investment Amount Field */}
            <div className="space-y-4 placeholder:text-gray-300">
              <label className="block text-gray-400 font-lato text-sm opacity-70">
                Investment Amount
              </label>
              {(investStatus === "Pending" || investStatus === "Approved") ? (
                <input
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount || ""}
                  readOnly
                  className="bg-gray-300 text-center text-[#00192F] p-2 rounded w-full"
                />
              ) : (
                <StyledInput
                  type="number"
                  name="investmentAmount"
                  onChange={handleChange}
                  placeholder={`Enter investment amount (${MinInvest} - ${MaxInvest})`}
                  min={MinInvest}
                  max={MaxInvest}
                  disabled={buttonsDisabled}
                />
              )}
              {error.investmentAmount && (
                <p className="text-red-400 text-sm mt-1">{error.investmentAmount}</p>
              )}
            </div>

            {/* Equity Percentage Field */}
            {showEquity && (
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Equity Percentage (%)</label>
                {(investStatus === "Pending" || investStatus === "Approved") ? (
                  <input
                    type="number"
                    name="equityPercentage"
                    value={formData.equityPercentage || ""}
                    readOnly
                    className="bg-gray-300 text-center text-[#00192F] p-2 rounded w-full"
                  />
                ) : (
                  <StyledInput
                    type="number"
                    name="equityPercentage"
                    onChange={handleChange}
                    disabled={buttonsDisabled}
                  />
                )}
                {error.equityPercentage && (
                  <p className="text-red-400 text-sm mt-1">{error.equityPercentage}</p>
                )}
              </div>
            )}

            {/* Interest Rate Field */}
            {showInterest && (
              <div className="space-y-2">
                <label className=" block text-sm text-gray-400">Interest Rate (%)</label>
                {(investStatus === "Pending" || investStatus === "Approved") ? (
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate || ""}
                    readOnly
                    className="bg-gray-300 text-center text-[#00192F] p-2 rounded w-full"
                  />
                ) : (
                  <StyledInput
                    type="number"
                    name="interestRate"
                    onChange={handleChange}
                    disabled={buttonsDisabled}
                  />
                )}
                {error.interestRate && (
                  <p className="text-red-400 text-sm mt-1">{error.interestRate}</p>
                )}
              </div>
            )}

            {/* Revenue Share Field */}
            {showRevenueShare && (
              <div className="space-y-2">
                <label className=" block text-sm text-gray-400">Revenue Share (%)</label>
                {(investStatus === "Pending" || investStatus === "Approved") ? (
                  <input
                    type="number"
                    name="revenueShare"
                    value={formData.revenueShare || ""}
                    readOnly
                    className="bg-gray-300 text-center text-[#00192F] p-2 rounded w-full"
                  />
                ) : (
                  <StyledInput
                    type="number"
                    name="revenueShare"
                    onChange={handleChange}
                    disabled={buttonsDisabled}
                  />
                )}
                {error.revenueShare && (
                  <p className="text-red-400 text-sm mt-1">{error.revenueShare}</p>
                )}
              </div>
            )}

            {/* Contract Signing */}
            {investStatus !== "Invest" && (
              <div>
                <h2 className="text-center font-bold text-gray-300 font-monst text-2xl">Sign Contract</h2>
                <p className="text-sm font-lato text-gray-400 mt-2">
                  {investStatus === "Pending"
                    ? "You've already signed the contract (pending approval)"
                    : "Please click the below button to view and sign the contract."}
                </p>
                <button
                  type="button"
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-bold text-[17px] font-monst border-2 border-cyan-900 transition-all duration-500 ${investStatus === "Approved" && !paymentSuccess
                    ? "bg-gray-500 text-gray-300 hover:bg-gray-300 hover:text-blue-700"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  onClick={() => {
                    if (investStatus === "Approved" && !paymentSuccess) {
                      setIsModalOpen(true);
                    }
                  }}
                  disabled={!(investStatus === "Approved" && !paymentSuccess)}
                >
                  📜 View & Sign Contract{" "}
                  {isSigned && <span className="text-green-400 ml-2">✓</span>}
                </button>
              </div>
            )}



            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                investStatus === "Invest" || (investStatus == "Approved" && paymentSuccess)
                  ? !isFormValid || isLoading
                  : !isSigned || !isFormValid || isLoading || paymentSuccess
              }
              className={`rounded-2xl w-full font-bold text-[17px] font-monst mt-6 py-2 px-4 border-2 border-cyan-900 ${(investStatus === "Invest" ? isFormValid : isSigned && isFormValid) && !isLoading
                ? "text-gray-300 hover:bg-gray-300 hover:text-blue-700"
                : "text-gray-500 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : investStatus === "Invest" ? (
                "Submit Investment Offer"
              ) : (
                "Pay Now"
              )}
            </button>

          </form>
        </div>
      </section>

      {/* Modals */}
      <SignatureModal
        key={signatureResetKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={investmentId}
        investorName={InvestorName}
        projectName={ProjectName}
        projectId={ProjectId}
        CampaignDealType={CampaignDealType}
        userToken={userToken}
        onCompletionChange={(status) => setIsSigned(status)}
      />
      <StripeCard
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        investmentId={investmentId}
        formData={formData.investmentAmount}
        investorName={InvestorName}
        ProjectId={ProjectId}
        userToken={userToken}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}