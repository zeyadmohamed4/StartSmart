import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Add this import

const DEAL_TYPES_DATA = {
  "Debt Financing": {
    riskTolerance: "Low",
    investmentHorizon: "Short to Medium",
    incomePreference: "Fixed Income",
    repaymentTerms: "Fixed Payments",
    collateral: "Company Assets",
    maturityDate: "2025-12-31"
  },
  "Revenue-Based Financing (RBF)": {
    riskTolerance: "Medium",
    investmentHorizon: "Short to Medium",
    incomePreference: "Variable Income",
    repaymentTerms: "Flexible Payments",
    repaymentCap: "$500,000"
  },
  "Convertible Notes": {
    riskTolerance: "Medium to High",
    investmentHorizon: "Medium to Long",
    incomePreference: "Variable Income",
    repaymentTerms: "Equity Conversion",
    maturityDate: "2025-12-31",
    valuationCap: "$10,000,000",
    discountRate: "20%"
  },
  "Equity Financing": {
    riskTolerance: "High",
    investmentHorizon: "Long-Term",
    incomePreference: "Capital Gains",
    ownershipOffered: "10%"
  },
  "SAFE (Simple Agreement for Future Equity)": {
    riskTolerance: "High",
    investmentHorizon: "Long-Term",
    incomePreference: "Capital Gains",
    repaymentTerms: "Equity Conversion",
    valuationCap: "$10,000,000",
    discountRate: "20%",
    conversionTrigger: "IPO"
  }
};
export default function SignatureModal({
  CampaignDealType,
  isOpen,
  onClose,
  onCompletionChange,
  id,
  investorName,
  projectName,
  projectId,
  userToken
}) {
  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("typing");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dealDetails = DEAL_TYPES_DATA[CampaignDealType] || {};

  const isTypingValid = signature.trim() && fullName.trim();
  const isUploadValid = uploadedFile;
  const isFormValid =
    ((activeTab === "typing" && isTypingValid) ||
      (activeTab === "upload" && isUploadValid)) &&
    isAgreed;

  const resetForm = () => {
    setSignature("");
    setFullName("");
    setUploadedFile(null);
    setActiveTab("typing");
    setIsAgreed(false);
    setError(null);
  };

  const handleAgreeClick = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (activeTab === "typing") {
        formData.append("FullName", fullName);
        formData.append("Signature", signature);
      } else if (activeTab === "upload" && uploadedFile) {
        formData.append("Image", uploadedFile);
      }

      const response = await axios.post(
        `https://localhost:7010/api/Investment/addContract?id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
        console.log("Contract signed successfully:", response.status);
        if (typeof onCompletionChange === "function") onCompletionChange(true);
        // resetForm();
        onClose();
      } else {
        throw new Error("Failed to submit signature");
      }
    } catch (error) {
      console.error("Error submitting signature:", error);
      setError(
        error?.response?.data?.message ||
        error.message ||
        "Failed to submit signature. Please try again."
      );
      if (typeof onCompletionChange === "function") onCompletionChange(false);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  const renderDealDetails = () => {
    return (
      <>
        <p><strong>Risk Tolerance:</strong> {dealDetails.riskTolerance}</p>
        <p><strong>Investment Horizon:</strong> {dealDetails.investmentHorizon}</p>
        <p><strong>Income Preference:</strong> {dealDetails.incomePreference}</p>
        {dealDetails.repaymentTerms && <p><strong>Repayment Terms:</strong> {dealDetails.repaymentTerms}</p>}
        {dealDetails.collateral && <p><strong>Collateral:</strong> {dealDetails.collateral}</p>}
        {dealDetails.maturityDate && <p><strong>Maturity Date:</strong> {dealDetails.maturityDate}</p>}
        {dealDetails.valuationCap && <p><strong>Valuation Cap:</strong> {dealDetails.valuationCap}</p>}
        {dealDetails.discountRate && <p><strong>Discount Rate:</strong> {dealDetails.discountRate}</p>}
        {dealDetails.repaymentCap && <p><strong>Repayment Cap:</strong> {dealDetails.repaymentCap}</p>}
        {dealDetails.conversionTrigger && <p><strong>Conversion Trigger:</strong> {dealDetails.conversionTrigger}</p>}
        {dealDetails.ownershipOffered && <p><strong>Ownership Offered:</strong> {dealDetails.ownershipOffered}</p>}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#00192f] p-5 rounded-xl shadow-2xl max-w-xl w-full mx-4 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          ×
        </button>

        <h2 className="text-xl font-[900] font-monst text-center text-gray-300 mb-4">
          Add Your Signature
        </h2>

        <div className="p-3 border-2 border-gray-500 shadow-lg rounded-lg h-40 overflow-auto text-sm text-gray-500 mb-4">
          <h4 className="font-bold text-lg font-monst text-gray-300 text-left">Subscription Agreement</h4>
          <p className="font-lato gapy-4 text-left">
            This <strong>SUBSCRIPTION AGREEMENT</strong> is dated as of{" "}
            {new Date().toLocaleDateString()} between <strong>{projectName}</strong> and the Subscriber{" "}
            <strong>{investorName}</strong>.
          </p>
          <hr className="my-2" />
          {renderDealDetails()}
          <p className="mt-2">
            <strong className="text-md">Penalty Clause:</strong>
            <br />
            In the event that the Subscriber decides to withdraw or modify their investment at any time after signing this agreement, a penalty of 50% of the invested amount will be applied.
          </p>
        </div>

        <div className="flex justify-around pb-2">
          <button
            className={`px-4 py-2 ${activeTab === "typing"
              ? "rounded-2xl font-monst text-gray-300 text-[18px] border-b-2 border-cyan-600 font-bold"
              : ""
              } hover:bg-gray-500 rounded-lg hover:text-gray-300 transition duration-500`}
            onClick={() => setActiveTab("typing")}
          >
            Typing
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "upload"
              ? "rounded-2xl font-monst text-gray-300 text-[18px] border-b-2 border-cyan-600 font-bold"
              : ""
              } hover:bg-gray-500 rounded-lg hover:text-gray-300 transition duration-500`}
            onClick={() => setActiveTab("upload")}
          >
            Image Upload
          </button>
        </div>

        <hr className="border-t border-gray-500 mt-4" />

        {activeTab === "typing" && (
          <div className="mt-4">
            <label className="block text-[19px] font-monst text-gray-500">Type Your Signature</label>
            <input
              type="text"
              className="w-full text-black font-lato text-[17px] py-2 bg-gray-200 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Your signature"
            />
            <label className="block text-[19px] font-monst text-gray-500 mt-2">Your Full Name</label>
            <input
              type="text"
              className="w-full text-black font-lato text-[17px] p-2 border bg-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name as identification"
            />
          </div>
        )}

        {activeTab === "upload" && (
          <div className="mt-4 font-lato text-[18px] text-gray-300">
            <label className="block mb-2">Upload Signature Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadedFile(e.target.files[0] || null)}
              className="w-full p-2 border rounded-lg bg-gray-800"
            />
            {uploadedFile && (
              <p className="text-green-400 text-sm mt-1">
                {uploadedFile.name} selected
              </p>
            )}
          </div>
        )}

        <div className="mt-4 font-lato text-sm text-gray-600 flex items-start">
          <input
            type="checkbox"
            id="agree"
            className="mr-2 mt-1"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label htmlFor="agree" className="block">
            I agree to be legally bound by this document and understand all terms and conditions.
          </label>
        </div>

        {error && (
          <div className="mt-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <button
            className="flex-1 text-gray-300 bg-red-700 px-4 py-2 shadow-md font-bold font-monst rounded-lg hover:bg-red-800 transition duration-300"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            I Don't Agree
          </button>

          <button
            className={`flex-1 text-gray-300 font-bold font-monst 
              shadow-md rounded-lg px-4 py-2 transition-all duration-300
              ${isFormValid
                ? "bg-green-600 hover:bg-green-500"
                : "bg-green-800 cursor-not-allowed opacity-70"
              }`}
            disabled={!isFormValid || isLoading}
            onClick={handleAgreeClick}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "I Agree"}
          </button>
        </div>
      </div>
    </div>
  );
}