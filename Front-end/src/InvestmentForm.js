import React, { useState } from "react";

function InvestmentForm() {
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState({
    InvestmentAmount: "",
    EquityPercentage: "",
    OwnershipOffered: "",
    InterestRate: "",
    ValuationCap: "",
    DiscountRate: "",
    MaturityDate: "",
  });
  const [FormData, setFormData] = useState({
    InvestmentAmount: "",
    InvestmentHorizon: "",
    TermLength: "",
    IncomePreference: "",
    RiskTolerance: "",
    DealType: "Equity CrowdFunding",
    EquityPercentage: "",
    OwnershipOffered: "",
    InterestRate: "",
    ValuationCap: "",
    DiscountRate: "",
    MaturityDate: "",
    ProjectedRevenue: "",

  });

  const Project = {
    Name: "Green Energy Expansion",
    MinInvestment: 1000,
    MaxInvestment: 10000,
  };

  const validatePositiveValue = (value) => {
    const amount = parseFloat(value);
    if (amount < 0) {
      return "Value must be a positive number.";
    }
    return "";
  };

  const validatePercentage = (value) => {
    const percentage = parseFloat(value);
    if (percentage < 1 || percentage > 100) {
      return "Percentage must be between 1 and 100.";
    }
    return "";
  };

  const validateInvestment = (value) => {
    const amount = parseFloat(value);
    if (amount < Project.MinInvestment || amount > Project.MaxInvestment) {
      return `Investment amount must be between $${Project.MinInvestment.toLocaleString()} and $${Project.MaxInvestment.toLocaleString()}`;
    }
    return "";
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;

    let errorMessage = "";
    if (fieldName === "InvestmentAmount") {
      errorMessage = validateInvestment(value);
    } else if (
      fieldName === "EquityPercentage" ||
      fieldName === "OwnershipOffered" ||
      fieldName === "DiscountRate" ||
      fieldName === "InterestRate"
    ) {
      errorMessage = validatePercentage(value);
    } else if (
      fieldName === "ValuationCap"
    ) {
      errorMessage = validatePositiveValue(value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    setFormError((prevError) => ({
      ...prevError,
      [fieldName]: errorMessage,
    }));
  };

  const isFormValid = () => {
    const commonFieldsValid =
      FormData.InvestmentAmount &&
      FormData.RiskTolerance &&
      !formError.InvestmentAmount;

    let dealTypeSpecificValid = true;

    switch (FormData.DealType) {
      case "Equity Crowdfunding":
        dealTypeSpecificValid =
          FormData.EquityPercentage &&
          FormData.OwnershipOffered &&
          !formError.EquityPercentage &&
          !formError.OwnershipOffered;
        break;
      case "Debt Crowdfunding":
        dealTypeSpecificValid =
          FormData.InterestRate && !formError.InterestRate;
        break;
      case "Revenue-Based Financing":
        dealTypeSpecificValid = true;
        break;
      case "SAFE":
        dealTypeSpecificValid =
          FormData.ValuationCap &&
          FormData.DiscountRate &&
          !formError.ValuationCap &&
          !formError.DiscountRate;
        break;
      case "Convertible Notes":
        dealTypeSpecificValid =
          FormData.InterestRate &&
          FormData.MaturityDate &&
          !formError.InterestRate &&
          !formError.MaturityDate;
        break;
      case "Private Placements":
        dealTypeSpecificValid = true;
        break;
      default:
        dealTypeSpecificValid = true;
    }

    return commonFieldsValid && dealTypeSpecificValid;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setFormError((prevError) => ({
        ...prevError,
        form: "Please fill in all fields before submitting.",
      }));
      return;
    }
    setFormError({});
    alert("Investment confirmed!");
    handleCloseModal();
  };

  const resetForm = () => {
    setFormData({
      InvestmentAmount: "",
      InvestmentHorizon: "",
      TermLength: "",
      IncomePreference: "",
      RiskTolerance: "",
      DealType: "SAFE",
      EquityPercentage: "",
      OwnershipOffered: "",
      InterestRate: "",
      ValuationCap: "",
      DiscountRate: "",
      MaturityDate: "",
      ProjectedRevenue: "",

    });
    setFormError({});
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const renderDealTypeSpecificFields = () => {
    switch (FormData.DealType) {
      case "Equity Crowdfunding":
        return (
          <>
            <div>
              <label className="block mb-2">Equity Percentage:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={FormData.EquityPercentage}
                onChange={(e) => handleInputChange(e, "EquityPercentage")}
                className="w-full border p-2 rounded bg-white"
                placeholder="Enter equity percentage"
                required
              />
              {formError.EquityPercentage && (
                <p className="text-red-500 text-sm mt-1">{formError.EquityPercentage}</p>
              )}
            </div>
            <div>
              <label className="block mb-2">Ownership Offered (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={FormData.OwnershipOffered}
                onChange={(e) => handleInputChange(e, "OwnershipOffered")}
                className="w-full border p-2 rounded bg-white"
                required
              />
              {formError.OwnershipOffered && (
                <p className="text-red-500 text-sm mt-1">{formError.OwnershipOffered}</p>
              )}
            </div>
          </>
        );
      case "Debt Crowdfunding":
        return (
          <div>
            <label className="block mb-2">Interest Rate (%):</label>
            <input
              type="number"
              min="1"
              max="100"
              value={FormData.InterestRate}
              onChange={(e) => handleInputChange(e, "InterestRate")}
              className="w-full border p-2 rounded bg-white"
              required
            />
            {formError.InterestRate && (
              <p className="text-red-500 text-sm mt-1">{formError.InterestRate}</p>
            )}
          </div>
        );
      case "SAFE":
        return (
          <>
            <div>
              <label className="block mb-2">Valuation Cap:</label>
              <input
                type="number"
                min="0"
                value={FormData.ValuationCap}
                onChange={(e) => handleInputChange(e, "ValuationCap")}
                className="w-full border p-2 rounded bg-white"
                required
              />
              {formError.ValuationCap && (
                <p className="text-red-500 text-sm mt-1">{formError.ValuationCap}</p>
              )}
            </div>
            <div>
              <label className="block mb-2">Discount Rate (%):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={FormData.DiscountRate}
                onChange={(e) => handleInputChange(e, "DiscountRate")}
                className="w-full border p-2 rounded bg-white"
                required
              />
              {formError.DiscountRate && (
                <p className="text-red-500 text-sm mt-1">{formError.DiscountRate}</p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="content w-full mx-auto p-4 bg-gradient-to-b from-[#2b3d5c] to-[#D8C4B6] min-h-screen">
      <div className="flex justify-center mt-40 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl text-black overflow-y-auto" style={{ maxHeight: "80vh" }}>
          <p className="text-center mb-1 text-gray-600 mt-2">You are investing in</p>
          <h2 className="text-xl font-bold text-center mb-4">{Project.Name}</h2>
          <p className="text-center text-gray-600 mb-10">
            Payments are processed immediately. The minimum investment is{" "}
            <strong>${Project.MinInvestment.toLocaleString()}</strong> and the
            maximum investment is{" "}
            <strong>${Project.MaxInvestment.toLocaleString()}</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Investment Amount:</label>
              <input
                type="number"
                min="1"
                value={FormData.InvestmentAmount}
                onChange={(e) => handleInputChange(e, "InvestmentAmount")}
                className="w-full border p-2 rounded bg-white"
                required
              />
              {formError.InvestmentAmount && (
                <p className="text-red-500 text-sm mt-1">{formError.InvestmentAmount}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Risk Tolerance:</label>
              <select
                value={FormData.RiskTolerance}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    RiskTolerance: e.target.value,
                  }))
                }
                className="w-full border p-2 rounded bg-white"
                required
              >
                <option value="" disabled></option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {renderDealTypeSpecificFields()}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className={`w-2/5 py-2 px-4 rounded-md text-white 
                ${isFormValid() ? 'bg-blue-800 hover:bg-gray-400' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!isFormValid()}
            >
              Confirm Investment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestmentForm;
