import { useState, useEffect } from 'react';
import img from "./imgs/1.png";
import { BarChart2 } from 'lucide-react';
import StyledInput from './StyledInput.jsx';

const AddProject = () => {
  // Campaign deal type mapping
  const campaignDealTypeMap = {
    "Debt Financing": 1,
    "Revenue-Based Financing (RBF)": 2,
    "Convertible Notes": 3,
    "Equity Financing": 4,
    "SAFE (Simple Agreement for Future Equity)": 5
  };

  const reverseCampaignDealTypeMap = {
    1: "Debt Financing",
    2: "Revenue-Based Financing (RBF)",
    3: "Convertible Notes",
    4: "Equity Financing",
    5: "SAFE (Simple Agreement for Future Equity)"
  };

  const [formData, setFormData] = useState({
    ProjectName: '', TotalFundingRounds: '', TotalMilestones: '', MileStoneYear: '',
    TotalPartenerships: '', FundingAmount: '', NoOfInvestors: '', FundAmountRaised: '',
    FundingYear: '', FundingFundYear: '', AverageFundingPerRound: '',
    FirstFundedAt: '', Category: '', Location: '', Country: '', IsActiveTill: '',
    Status: '', CampaignDealTypeId: '', FundingRoundType: '', TotalFundingRecieved: '',
    Funding_Source: '', FoundingYear: '', Budget: '',InvestmentStatus:'Invest'
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [showZZZ, setShowZZZ] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [showRequiredErrors, setShowRequiredErrors] = useState(false);
  const [username, setUsername] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length > 0) {
        setUsername(tokenParts[0]);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateField = (name, value, checkRequired = false) => {
    let error = '';

    if (checkRequired && !value.trim()) {
      error = 'This field is required';
    } else if ((name.includes('Year') || name === 'FoundingYear') && value && !/^(19|20)\d{2}$/.test(value)) {
      error = 'Please enter a valid year starting with 19 or 20';
    } else if (numberFields.includes(name) && value && isNaN(value)) {
      error = 'Please enter a valid number';
    } else if ((name === 'FundingAmount' || name === 'Budget') && value && parseFloat(value) <= 0) {
      error = 'Amount must be positive';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (value) {
      const error = validateField(name, value, false);
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fieldsByStep = {
    1: ['ProjectName', 'Location', 'Country', 'Category', 'Status', 'FoundingYear'],
    2: [
      'TotalFundingRounds', 'FundingAmount', 'FundingRoundType',
      'FundAmountRaised', 'FundingYear', 'FundingFundYear',
      'AverageFundingPerRound', 'TotalFundingRecieved', 'FirstFundedAt', 'Budget'
    ],
    3: [
      'NoOfInvestors', 'TotalPartenerships',
      'CampaignDealType', 'Funding_Source', 'TotalMilestones', 'MileStoneYear', 'IsActiveTill'
    ]
  };

  const numberFields = [
    "TotalFundingRounds", "FundingAmount", "FundAmountRaised",
    "FundingYear", "FundingFundYear", "AverageFundingPerRound", "TotalFundingRecieved",
    "NoOfInvestors", "TotalPartenerships", "TotalMilestones", "MileStoneYear",
    "Budget", "FoundingYear", "CampaignDealTypeId"
  ];

  const allFieldsFilledInStep = (stepNum) => {
    return fieldsByStep[stepNum].every(field => formData[field] !== '');
  };

  const validateStep = () => {
    let isValid = true;
    const newErrors = {};

    fieldsByStep[step].forEach(field => {
      const error = validateField(field, formData[field], true);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setShowRequiredErrors(!isValid);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prepareFormDataForApi = () => {
    const data = { ...formData, username: username };

    // Convert CampaignDealType from string to integer if it exists
    if (data.CampaignDealTypeId && campaignDealTypeMap[data.CampaignDealTypeId]) {
      data.CampaignDealTypeId = campaignDealTypeMap[data.CampaignDealTypeId];
    }

    return data;
  };

  const handleAddProject = async () => {
    if (!validateStep() || !allFieldsFilledInStep(3)) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setShowZZZ(true);

      const apiData = prepareFormDataForApi();

      const response = await fetch('https://localhost:7010/api/Project/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Project creation failed');
      }

      const { projectId } = await response.json();
      setProjectId(projectId);

    } catch (error) {
      console.error('Project creation error:', error);
      alert(`Project creation failed: ${error.message}`);
      setShowZZZ(false);
    }
  };

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`https://localhost:7010/api/Prediction/analyze?projectId=${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const responseData = await response.json();

      // Extract the prediction data from the response
      const predictionData = {
        fundingRoundType: responseData.fundingRoundType.prediction,
        totalFundingRecieved: responseData.totalFundingRecieved.prediction,
        fundingAmount: responseData.fundingAmount.prediction
      };

      setAnalysisData(predictionData);

      // Update form with analysis results
      setFormData(prev => ({
        ...prev,
        FundingRoundType: predictionData.fundingRoundType,
        TotalFundingRecieved: predictionData.totalFundingRecieved.toString(),
        FundingAmount: predictionData.fundingAmount.toString()
      }));

    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLaunchProject = async () => {
    try {
      if (!analysisData || !projectId) {
        throw new Error('بيانات التحليل أو معرف المشروع مفقودة');
      }

      // Prepare payload with converted CampaignDealType
      const payload = {
        fundingRoundType: analysisData.fundingRoundType,
        totalFundingRecieved: analysisData.totalFundingRecieved,
        fundingAmount: analysisData.fundingAmount,
        CampaignDealType: formData.CampaignDealType ? campaignDealTypeMap[formData.CampaignDealType] : null
      };

      const response = await fetch(`https://localhost:7010/api/Prediction/save-prediction/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حفظ التوقع');
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 7000);

      resetForm();
    } catch (error) {
      console.error('Launch error:', error);
      alert(`Project launch failed: ${error.message}`);
    }
  };

  const handleCancelProcess = () => {
    resetForm();
    alert("Thanks for your interest. We hope to see you again soon!");
  };

  const resetForm = () => {
    setFormData({
      ProjectName: '', TotalFundingRounds: '', TotalMilestones: '', MileStoneYear: '',
      TotalPartenerships: '', FundingAmount: '', NoOfInvestors: '', FundAmountRaised: '',
      FundingYear: '', FundingFundYear: '', AverageFundingPerRound: '',
      FirstFundedAt: '', Category: '', Location: '', Country: '', IsActiveTill: '',
      Status: '', CampaignDealType: '', FundingRoundType: '', TotalFundingRecieved: '',
      Funding_Source: '', FoundingYear: '', Budget: ''
    });
    setErrors({});
    setStep(1);
    setShowZZZ(false);
    setAnalysisData(null);
    setShowRequiredErrors(false);
    setProjectId(null);
  };

  const getInputType = (field) => {
    if (field.includes('At') || field === 'IsActiveTill') return 'date';
    if (numberFields.includes(field)) return 'number';
    return 'text';
  };

  const renderInput = (field) => {
    if (field === 'Status' || field === 'Category' || field === 'FundingRoundType' || field === 'Country') {
      const optionsMap = {
        Status: ["Closed", "Acquired", "IPO", "Operating"],
        Category: ["Technology", "Art_Design", "Education", "Science_Research", "Business_Entrepreneurship", "Entertainment"],
        FundingRoundType: ["Series-A", "Series-B", "Series-C+", "Venture", "Angel", "Private-Equity", "Post-Ipo", "CrowdFunding", "Other"],
        Country: ["Egypt", "United States", "Germany", "Canada", "United Kingdom", "France", "UAE", "Saudi Arabia", "India", "Other"]
      };

      return (
        <div key={field} className="w-full">
          <select
            id={field}
            name={field}
            value={formData[field]}
            onChange={(e) => {
              handleChange(e);
              setErrors(prev => ({ ...prev, [field]: '' }));
            }}
            onBlur={handleBlur}
            className="w-full py-2 px-4 border-b-2 border-gray-300 bg-transparent rounded-md text-[16px] outline-none text-sm hover:bg-gray-400 text-center"
          >
            <option value="">Select {field}</option>
            {optionsMap[field].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {(showRequiredErrors || errors[field]) && (
            <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
          )}
        </div>
      );
    }

    if (field === 'CampaignDealType') {
      return (
        <div key={field} className="w-full">
          <select
            id={field}
            name={field}
            value={formData[field]}
            onChange={(e) => {
              handleChange(e);
              setErrors(prev => ({ ...prev, [field]: '' }));
            }}
            onBlur={handleBlur}
            className="w-full py-2 px-4 border-b-2 border-gray-300 bg-transparent rounded-md text-[16px] outline-none text-sm hover:bg-gray-400 text-center"
          >
            <option value="">Select Campaign Deal Type</option>
            {Object.keys(campaignDealTypeMap).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {(showRequiredErrors || errors[field]) && (
            <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
          )}
        </div>
      );
    }

    if (field === 'FirstFundedAt' || field === 'IsActiveTill') {
      return (
        <div className="w-full">
          <label className="block text-gray-400 text-sm opacity-70 mb-1">
            {field === 'FirstFundedAt' ? 'First Funded At' : 'Is Active Till'}
          </label>
          <StyledInput
            key={field}
            type="date"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={field === 'FirstFundedAt' ? 'First Funded At' : 'Is Active Till'}
          />
          {(showRequiredErrors || errors[field]) && (
            <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        <StyledInput
          key={field}
          label=""
          type={getInputType(field)}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field}
          min={getInputType(field) === 'number' ? 0 : undefined}
        />
        {(showRequiredErrors || errors[field]) && (
          <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0 w-full h-[600px] -z-10">
        <img src={img} alt="background" className="w-full h-full object-cover" />
      </div>

      <div className="h-[600px] w-full" />

      <section className="bg-[#00192F] px-6 py-16 -mt-32 rounded-t-3xl shadow-xl relative z-10 w-[800px] mx-auto flex justify-center items-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-center font-bold text-gray-300 font-monst">Add Project Details</h2>

          {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Success!</h3>
                <p className="text-gray-700 mb-6">
                  Your project is pending approval. Check your notifications for updates.
                </p>
                <div className="animate-pulse text-blue-500">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-3 w-12 mx-2 rounded-full transition-all duration-300 ${step === s ? 'bg-[#3b5787]' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldsByStep[step].map((field) => renderInput(field))}
            </div>

            <div className="flex justify-end mt-10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-transparent rounded-2xl font-bold mx-4 text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                >
                  Next
                </button>
              )}
              {step === 3 && !projectId && (
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={!allFieldsFilledInStep(3)}
                  className={`bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 ${allFieldsFilledInStep(3)
                    ? 'hover:bg-gray-300 hover:text-blue-700 transition-all duration-500'
                    : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  Add Project
                </button>
              )}
              {step === 3 && projectId && !analysisData && (
                <button
                  type="button"
                  onClick={handleAnalyzeClick}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2 bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 hover:text-blue-700 transition-all duration-500'
                    }`}
                >
                  <BarChart2 size={20} />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
              )}
            </div>
          </form>

          {showZZZ && (
            <div className="text-center mt-10 border-4 rounded-xl border-[#00192f] p-6 bg-gray-200 shadow-lg">
              {analysisData ? (
                <section>
                  <div className="text-center mt-4 border-2 rounded-xl bg-gray-200 border-gray-400 w-full my-6 font-monst px-6">
                    <p className="text-gray-800 my-7 text-lg">
                      <strong className="text-left">Project Analysis Results:</strong> <br /><br />
                      <div className="mb-5 space-y-2">
                        <p>Recommended Funding Round Type: <strong className="text-blue-600">{analysisData.fundingRoundType}</strong></p>
                        <p>Total Funding Received: <strong className="text-blue-600">${analysisData.totalFundingRecieved.toLocaleString()}</strong></p>
                        <p>Recommended Funding Amount: <strong className="text-blue-600">${analysisData.fundingAmount.toLocaleString()}</strong></p>
                        <p>✅ <strong>Market Potential:</strong> Rapidly growing AI customer service sector with strong e-commerce/SaaS demand.</p>

                        <p>✅ <strong>Financial Feasibility:</strong> Reasonable budget but requires strong proof of concept for $500K funding.</p>

                        <p>✅ <strong>Team & Advisors:</strong> Well-structured 12-member team with 3 advisors needs balanced expertise.</p>

                        <p>✅ <strong>Competitive Edge:</strong> Requires clear USP in NLP, integrations, or cost efficiency for differentiation.</p>

                        <p>✅ <strong>Scaling Strategy:</strong> Focus on B2B partnerships, CRM integrations, and AI-driven retention.</p>

                        <p>🔍 <strong>Next Steps:</strong> Build MVP, refine investor pitch, secure partnerships, highlight AI ethics.</p>

                        <p>✅ <strong>Final Verdict:</strong> Strong potential contingent on execution, funding, and market differentiation.</p>
                      </div>
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleLaunchProject}
                      className="bg-green-500 rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 hover:bg-green-700 transition-all"
                    >
                      Launch Project
                    </button>
                    <button
                      onClick={handleCancelProcess}
                      className="bg-red-500 rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 hover:bg-red-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </section>
              ) : (
                <p className="text-gray-800 font-serif text-lg">
                  {projectId ? "Ready for analysis" : "Processing your project..."}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AddProject;
