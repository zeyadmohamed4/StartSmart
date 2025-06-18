import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function ProjectDetails() {
  const location = useLocation();
  const { state } = location;
  const ProjectId = state?.ProjectId;
  const navigate = useNavigate();

  // State initialization
  const [project, setProject] = useState({
    id: ProjectId,
    OwnerId: "",
    Name: "",
    Location: "",
    Progress: "0%",
    Raised: "€0",
    Goal: "€0",
    DaysLeft: "0",
    NoOfInvestors: "0",
    Status: "",
    Category: "",
    Website: "",
    ContactEmail: "",
    Address: "",
    YearFounded: "",
    Rounds: "0",
    RoundType: "",
    Description: "",
    Milestones: "",
    ProjectPhoto: null,
    IsActiveTill: "",
    CampaignDealType: "",
    MinimumInvestment: "",
    MaximumInvestment: "",
    InvestmentStatus: "",
    CampaignStory: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });
  const [originalCampaignStory, setOriginalCampaignStory] = useState("");
  const [originalProject, setOriginalProject] = useState({ ...project });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasDetails, setHasDetails] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoading, setIsLoading] = useState({
    basicInfo: true,
    investmentInfo: true,
    details: true,
    analysis: true
  });
  const [analysisData, setAnalysisData] = useState({
    TotalInvestment: 0,
    NextRoundType: "",
    NextRoundInvestment: 0
  });
  const [predictionResult, setPredictionResult] = useState(false);

  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    investmentAmount: '',
    fundingYear: ''
  });

  const [errors, setErrors] = useState({
    investmentAmount: '',
    fundingYear: ''
  });

  const isFormValid =
    formData.investmentAmount > 0 &&
    formData.fundingYear >= currentYear &&
    errors.investmentAmount === '' &&
    errors.fundingYear === '';

  // Get current user info from token
  // Get current user info from token
  const decodeToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub ||
        decoded.userId ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        decoded.nameid;

      if (!userId) {
        console.error('User ID not found in token');
        return null;
      }

      return {
        userId: String(userId), // Ensure consistent string comparison
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);


  // Get user info from token on component mount
  useEffect(() => {
    const user = decodeToken();
    setCurrentUser(user);
  }, []);
  // Get user info from token
  useEffect(() => {
    const currentUser = decodeToken(); // دالة استخلاص بيانات المستخدم من التوكن
    setCurrentUser(currentUser);

    if (currentUser && project?.OwnerId) {
      setIsProjectOwner(String(currentUser.userId) === String(project.OwnerId));
    }
  }, [project]);


  const verifyProjectOwnership = useCallback((projectOwnerId) => {
    if (!currentUser || !projectOwnerId) return false;
    return currentUser.userId === String(projectOwnerId);
  }, [currentUser]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch basic project info
  const fetchBasicProjectInfo = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`https://localhost:7010/api/Project/GetCategoryByIdInPD?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userId = response.data.userId; // من الرد

      setProject(prev => ({
        ...prev,
        Name: response.data.projectName,
        Location: `${response.data.location}`,
        Country: ` ${response.data.country}`,
        Progress: response.data.progress,
        NoOfInvestors: response.data.numberOfInvestors,
        Raised: response.data.raisedOfWhat,
        Goal: response.data.goal,
        DaysLeft: response.data.daysLeft,
/*         ProjectPhoto: response.data.photo,
 */        CampaignDealType: response.data.campaignDealType,
        Status: response.data.status,
        MinimumInvestment: response.data.minInvestment,
        MaximumInvestment: response.data.maxInvestment,
        InvestmentStatus: response.data.investmentStatus,
        InvestmentAmount: response.data.investmentAmount,
        InvestorName: response.data.investorName,
        InvestmentId: response.data.investmentId,
        UserId: response.data.userId
      }));

      // Check ownership after setting the owner ID
      if (currentUser) {
        setIsProjectOwner(currentUser.userId == userId);
      }

      setIsLoading(prev => ({ ...prev, basicInfo: false }));
    } catch (error) {
      console.error('Error fetching basic project info:', error);
    }

  };

  useEffect(() => {
    if (currentUser && project.UserId) {
      setIsProjectOwner(currentUser.userId == project.UserId);
    }
  }, [currentUser, project.UserId]);

  // Fetch project details with ownership verification
  const fetchProjectDetails = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/ProjectDetails/GetById?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const projectData = response.data;
      const ownerId = projectData.userId || projectData.OwnerId; // Get owner ID from response

      // Update project state with all fields
      setProject(prev => ({
        ...prev,
        OwnerId: ownerId,
        Website: projectData.website || "",
        ContactEmail: projectData.contactEmail || "",
        Address: projectData.address || "",
        Description: projectData.description || "",
        Milestones: projectData.milestones || "",
        Rounds: projectData.totalFundingRounds?.toString() || "0",
        RoundType: projectData.fundingRoundType || "",
        IsActiveTill: projectData.isActiveTill || "",
        YearFounded: projectData.foundingYear || "",
        CampaignStory: projectData.campaignStory || "",
        ProjectPhoto: projectData.companyPhoto || null
      }));

      // Update edited project for form
      setEditedProject({
        Website: projectData.website || "",
        ContactEmail: projectData.contactEmail || "",
        Address: projectData.address || "",
        Description: projectData.description || "",
        Milestones: projectData.milestones || "",
        ProjectPhoto: projectData.companyPhoto || null
      });

      // Verify ownership
      const isOwner = verifyProjectOwnership(ownerId);
      setIsProjectOwner(isOwner);

      setHasDetails(true);
      setIsLoading(prev => ({ ...prev, details: false }));

    } catch (error) {
      console.error('Error fetching project details:', error);

      if (error.response?.status === 404) {
        // Project details not found
        setHasDetails(false);
      } else {
        // Other errors
        console.error('Error:', error.response?.data || error.message);
      }

      setIsLoading(prev => ({ ...prev, details: false }));
    }
  };
  // Create new project details
  const createProjectDetails = async () => {
    try {
      const currentUser = decodeToken();
      if (!currentUser) {
        alert('You must be logged in to create project details');
        return;
      }
      if (currentUser == project?.OwnerId) {
        const formData = new FormData();
        if (editedProject.Website) formData.append('website', editedProject.Website);
        if (editedProject.ContactEmail) formData.append('contactEmail', editedProject.ContactEmail);
        if (editedProject.Address) formData.append('address', editedProject.Address);
        if (editedProject.Description) formData.append('description', editedProject.Description);
        if (editedProject.Milestones) formData.append('milestones', editedProject.Milestones);
        if (editedProject.CampaignStory) formData.append('campaignStory', editedProject.CampaignStory);
        formData.append('projectId', ProjectId);

        if (editedProject.ProjectPhoto instanceof File) {
          formData.append('companyPhoto', editedProject.ProjectPhoto);
        }

        const response = await axios.post(
          `https://localhost:7010/api/ProjectDetails/Add Project_Details`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        setProject(prev => ({
          ...prev,
          Website: editedProject.Website || prev.Website,
          ContactEmail: editedProject.ContactEmail || prev.ContactEmail,
          Address: editedProject.Address || prev.Address,
          Description: editedProject.Description || prev.Description,
          Milestones: editedProject.Milestones || prev.Milestones,
          CampaignStory: editedProject.CampaignStory || prev.CampaignStory,
          ProjectPhoto: response.data.companyPhoto || prev.ProjectPhoto,
        }));

        setHasDetails(true);
        setIsEditingInfo(true);
        setIsCreating(false);
        alert('Project details created successfully!');
      }
    } catch (error) {
      console.error('Error creating project details:', error);
      alert(error.response?.data?.message || 'Failed to create project details. Please try again.');
    }
  };

  // Save project details (update or create)
  const saveProjectDetails = async () => {
    if (hasDetails) {
      await updateProjectDetails();
    } else {
      await createProjectDetails();
    }
  };

  // Update existing project details
  const updateProjectDetails = async () => {
    try {


      const formData = new FormData();
      formData.append('website', editedProject.Website);
      formData.append('contactEmail', editedProject.ContactEmail);
      formData.append('address', editedProject.Address);
      formData.append('description', editedProject.Description);
      formData.append('milestones', editedProject.Milestones);

      if (editedProject.ProjectPhoto instanceof File) {
        formData.append('companyPhoto', editedProject.ProjectPhoto);
      }

      const response = await axios.put(
        `https://localhost:7010/api/ProjectDetails/Update?id=${ProjectId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update local state with the response data
      setProject(prev => ({
        ...prev,
        Website: editedProject.Website,
        ContactEmail: editedProject.ContactEmail,
        Address: editedProject.Address,
        Description: editedProject.Description,
        Milestones: editedProject.Milestones,
        ProjectPhoto: response.data.companyPhoto
      }));

      setIsEditingInfo(false);
      alert('Project details updated successfully!');
    } catch (error) {
      console.error('Error saving project details:', error);
      alert(error.response?.data?.message || 'Failed to save project details. Please try again.');
    }
  };

  // Update campaign story
  const updateCampaignStory = async () => {
    try {

      await axios.put(
        `https://localhost:7010/api/ProjectDetails/UpdateProject_Details?id=${ProjectId}`,
        { campaignStory: project.CampaignStory },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setIsEditing(false);
      alert('Campaign story updated successfully!');
    } catch (error) {
      console.error('Error updating campaign story:', error);
      alert(error.response?.data?.message || 'Failed to update campaign story. Please try again.');
    }
  };

  const deleteCampaignStory = async () => {
    try {

      const response = await axios.delete(
        `https://localhost:7010/api/ProjectDetails/Delete Project_Details?id=${ProjectId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setProject(prev => ({
          ...prev,
          CampaignStory: ""
        }));
        setOriginalCampaignStory("");
        setIsEditing(false);
        alert('Campaign story deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting campaign story:', error);
      alert(error.response?.data?.message ||
        'Failed to delete campaign story. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Submit investment prediction
  const submitInvestmentPrediction = async (ProjectId) => {
    try {
      const response = await axios.post(`https://localhost:7010/api/Prediction/project_status?projectId=${ProjectId}`, {
        investmentAmount: formData.investmentAmount,
        fundingYear: formData.fundingYear,

      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProject(prev => ({ ...prev, Status: response.data.prediction }));
      setPredictionResult(`Predicted status: ${response.data.prediction}`);
    } catch (error) {
      console.error('Error submitting investment prediction:', error);
      setPredictionResult('Failed to predict status. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setEditedProject(prev => ({
      ...prev,
      ProjectPhoto: file,
      ProjectPhotoUrl: imageUrl
    }));
  };

  const handleChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    let newErrors = { ...errors };

    if (name === 'investmentAmount') {
      if (value === '') {
        newErrors.investmentAmount = '';
      } else if (parseFloat(value) <= 0) {
        newErrors.investmentAmount = 'Amount must be greater than 0';
      } else {
        newErrors.investmentAmount = '';
      }
    }

    if (name === 'fundingYear') {
      if (value === '') {
        newErrors.fundingYear = '';
      } else if (parseInt(value) < currentYear) {
        newErrors.fundingYear = `Year must be ${currentYear} or later`;
      } else {
        newErrors.fundingYear = '';
      }
    }

    setErrors(newErrors);
  };

  const handleEditInfoClick = () => {
    setOriginalProject({ ...project });
    setEditedProject({ ...project });
    setIsEditingInfo(true);
  };

  const handleCreateInfoClick = () => {
    setOriginalProject({ ...project });
    setEditedProject({ ...project });
    setIsEditingInfo(true);
    setIsCreating(true);
  };

  const handleSaveInfo = async () => {
    try {
      await saveProjectDetails();
      setIsEditingInfo(false);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to save project details:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancelInfo = () => {
    setEditedProject(originalProject);
    setIsEditingInfo(false);
    setIsCreating(false);
  };

  const handleEditClick = () => {
    setOriginalCampaignStory(project.CampaignStory);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (project.CampaignStory) {
        await updateCampaignStory();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save campaign story:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setProject(prev => ({ ...prev, CampaignStory: originalCampaignStory }));
    setIsEditing(false);
  };

  const handleInvestNow = (project) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // ✅ استخرج الدور (role) من التوكن
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role;

        if (role == 'Investor') {
          navigate('/Payment', {
            state: {
              ProjectName: project.ProjectName,
              InvestmentId: project.InvestmentId,
              InvestorName: project.InvestorName,
              ProjectId: project.ProjectId,
              CampaignDealType: project.CampaignDealType,
              InvestmentStatus: project.InvestmentStatus,
              CategoryId: project.CategoryId,
              MinInvest: project.MinInvest,
              MaxInvest: project.MaxInvest,
              InvestmentAmount: project.InvestmentAmount
            }
          });
        } else {
          alert('Only investors can access this feature');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        alert('Please login to continue');
      }
    } else {
      alert('Please login to continue');
    }
  };
  // Fetch analysis data (for project owners only)
  const fetchAnalysisData = async (ProjectId) => {
    setIsAnalyzing(true);

    try {
      const response = await axios.get(`https://localhost:7010/api/Prediction/getPrediction?projectId=${ProjectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const responseData = response.data;

      const predictionData = {
        NextRoundType: responseData.nextRoundType,          // بدل .prediction
        TotalInvestment: responseData.totalInvestment,
        NextRoundInvestment: responseData.nextRoundFunding
      };

      setAnalysisData(predictionData); // هي دي اللي بتتقرى في الفرونت

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };


  // Fetch all data on component mount
  useEffect(() => {
    if (ProjectId) {
      fetchBasicProjectInfo(ProjectId);
      fetchProjectDetails(ProjectId);
      fetchAnalysisData(ProjectId);
    }
  }, [ProjectId]);

  return (
    <div className="relative content w-full flex flex-col items-center justify-center py-40 min-h-screen bg-gradient-to-b from-[#00192f] via-[#dce4e9] to-[#00192f] font-monst">
      {/* Wrapper Section */}
      <div className="relative w-2/3 bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        {/* Overlay Content */}
        <div
          className="text-white p-6 relative flex flex-col justify-between items-center w-full"
          style={{
            backgroundImage: `url(${project.ProjectPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex justify-between w-full mt-20">
            <div className="text-left">
              <h1 className="text-2xl font-bold">{project.Name}</h1>
              <p className="text-sm text-gray-600 font-lato text-left">
                {project.Location}
                <p className="text-sm text-gray-600 font-lato text-left">{project.Country}</p>
              </p>

            </div>
            <div className="text-right">
              <div className="flex flex-col items-end">

                <div className="flex flex-col items-center">
                  <p className="text-sm">{project.NoOfInvestors}</p>
                  <p className="text-sm">Investor{project.NoOfInvestors !== "1" ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full bg-gray-500 h-1 my-2">
            <div className="bg-green-500 h-1" style={{ width: project.Progress }}></div>
          </div>
          <div className="grid grid-cols-3 text-center font-semibold w-full">
            <p className="text-sm text-left">{project.Raised}</p>
            <p className="text-sm text-center">{project.Goal}</p>
            <p className="text-sm text-right pr-6">{project.DaysLeft}</p>
          </div>
          <div className="grid grid-cols-3 text-center text-neutral-300 mt-1 w-full mb-10">
            <p className="text-sm text-left">Raised</p>
            <p className="text-sm text-center">Goal</p>
            <p className="text-sm text-right">Days Left</p>
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="w-1/2 bg-gray-200 p-6 rounded-lg shadow-lg text-black relative -mt-10">
        <div className="grid grid-cols-2 text-center border-b pb-4 relative">
          <div>
            <p className="font-semibold text-[#00192f] text-[19px]">Campaign Deal Type</p>
            <p className="text-gray-500 text-[18px]">{project.CampaignDealType}</p>
          </div>
          <div className="border-l border-gray-300 pl-4">
            <p className="font-semibold text-[#00192f] text-[19px]">Status</p>
            <p className="text-gray-500 text-[18px]">{project.Status}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 text-center mt-4 relative">
          <div>
            <p className="font-semibold text-[#00192f] text-[19px]">Minimum Investment</p>
            <p className="text-gray-500 text-[18px]">{project.MinimumInvestment}</p>
          </div>
          <div className="border-l border-gray-300 pl-4">
            <p className="font-semibold text-[#00192f] text-[19px]">Maximum Investment</p>
            <p className="text-gray-500 text-[18px]">{project.MaximumInvestment}</p>
          </div>
        </div>
        <button
          onClick={handleInvestNow}
          className="w-full text-gray-300 text-center bg-[#00192F] text-lg font-monst shadow-md rounded-2xl font-bold text-[17px] mt-6 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
        >
          Invest Now
        </button>
      </div>

      {/* Info Sections Container */}
      <div className="w-4/5 flex flex-row gap-6 mt-5 mb-10">
        {/* Basic Company Info Section */}
        <div className="w-2/3 bg-gray-200 shadow-2xl rounded-lg p-6 border border-gray-500">
          <div className="flex justify-between items-center">
            <h2 className="text-[22px] font-bold mb-4 text-[#00192f] text-left py-4">Company Info</h2>
            {isProjectOwner && !isEditingInfo && !isCreating && !hasDetails && (
              <button onClick={handleCreateInfoClick} className="text-gray-500 hover:text-blue-500 font-bold mb-5">
                <i className="fas fa-plus"></i> Create Details
              </button>
            )}

            {isProjectOwner && hasDetails && (
              <button onClick={handleEditInfoClick} className="text-gray-500 hover:text-blue-500 font-bold mb-5">
                <i className="fas fa-edit"></i>
              </button>
            )}

          </div>
          <div className="space-y-4 text-black text-left">
            {isEditingInfo || isCreating ? (
              <>
                <label className="block font-semibold text-gray-700 text-[17px]">Company Website</label>
                <input type="text" name="Website" value={editedProject.Website} onChange={handleChange} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Company Name</label>
                <input type="text" name="Name" readOnly value={project.Name} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Location</label>
                <input type="text" name="Location" readOnly value={project.Location} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Address</label>
                <input type="text" name="Address" value={editedProject.Address} onChange={handleChange} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Description</label>
                <textarea name="Description" value={editedProject.Description} onChange={handleChange} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Milestones</label>
                <textarea name="Milestones" value={editedProject.Milestones} onChange={handleChange} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Upload Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#00192f] bg-transparent focus:outline-none placeholder:text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-white hover:file:bg-[#00192f]"
                />

                {(isEditingInfo || isCreating) && editedProject.ProjectPhoto && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 text-[17px]">New Photo Preview:</p>
                    <img
                      src={
                        editedProject.ProjectPhoto instanceof File
                          ? URL.createObjectURL(editedProject.ProjectPhoto)
                          : editedProject.ProjectPhoto
                      }
                      alt="Project preview"
                      className="mt-2 rounded-md max-h-40"
                    />
                  </div>
                )}

                <label className="block font-semibold text-gray-700 text-[17px]">Contact Email</label>
                <input type="text" name="ContactEmail" value={editedProject.ContactEmail} onChange={handleChange} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Is Active Till</label>
                <input type="text" name="IsActiveTill" readOnly value={project.IsActiveTill} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Days Left</label>
                <input type="text" name="DaysLeft" readOnly value={project.DaysLeft} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Rounds</label>
                <input type="text" name="Rounds" readOnly value={project.Rounds} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Round Type</label>
                <input type="text" name="RoundType" readOnly value={project.RoundType} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <label className="block font-semibold text-gray-700 text-[17px]">Year Founded</label>
                <input type="text" name="YearFounded" readOnly value={project.YearFounded} className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white" />

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={handleCancelInfo}
                    className="text-gray-200 bg-red-600 text-lg font-bold hover:bg-red-800 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    className="text-gray-200 bg-green-600 text-lg font-bold hover:bg-green-700 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Website</p>
                  {project.Website ? (
                    <a href={`https://${project.Website}`} className="text-gray-500 text-[20px] hover:underline" target="_blank" rel="noopener noreferrer">
                      {project.Website}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-[20px]">Not provided</p>
                  )}
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Company Name</p>
                  <p className="text-gray-500 text-[20px]">{project.Name}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Contact Email</p>
                  <p className="text-gray-500 text-[20px]">{project.ContactEmail || "Not provided"}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Location</p>
                  <p className="text-gray-500 text-[20px]">{project.Location}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Address</p>
                  <p className="text-gray-500 text-[20px]">{project.Address || "Not provided"}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Description</p>
                  <p className="text-gray-500 ml-6 text-right text-[20px]">{project.Description || "Not provided"}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Milestones</p>
                  <p className="text-gray-500 ml-6 text-right text-[20px]">{project.Milestones || "Not provided"}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Project Photo</p>
                  {project.ProjectPhoto ? (
                    <img
                      src={project.ProjectPhoto}
                      alt="Project"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <p className="text-gray-500 text-[20px]">No image uploaded</p>
                  )}
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Days Left</p>
                  <p className="text-gray-500 text-[20px]">{project.DaysLeft}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Is Active Till</p>
                  <p className="text-gray-500 text-[20px]">{project.IsActiveTill}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Rounds</p>
                  <p className="text-gray-500 text-[20px]">{project.Rounds}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Round Type</p>
                  <p className="text-gray-500 text-[20px]">{project.RoundType}</p>
                </div>
                <hr className="my-2 border-gray-300 w-full" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#00192f] text-[19px]">Year Founded</p>
                  <p className="text-gray-500 text-[20px]">{project.YearFounded}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Campaign Story Section */}
        <div className="w-1/2 bg-gray-200 rounded-xl shadow-lg overflow-hidden relative border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[22px] text-xl font-bold mt-6 text-[#00192f] py-4 ml-5">Campaign Story</h2>
            {isProjectOwner && (!isEditing || !isCreating) && (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleEditClick}
                  className="text-gray-500 hover:text-blue-500 transition-colors mr-2"
                >
                  <i className="fas fa-edit"></i>
                </button>
                {project.CampaignStory && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-gray-500 hover:text-red-600 transition-colors pr-5"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h3>
                <p className="mb-6 text-black">Are you sure you want to delete this campaign story?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteCampaignStory();
                      setShowDeleteConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {isEditing ? (
            <textarea
              className="w-[95%] p-2 text-gray-700 text-sm md:text-lg rounded-md border-2 border-gray-300 focus:border-[#3b5787] focus:outline-none placeholder:text-gray-400"
              rows="8"
              value={project.CampaignStory}
              onChange={(e) => setProject(prev => ({ ...prev, CampaignStory: e.target.value }))}
              placeholder="Tell your project's story..."
            />
          ) : (
            <div className="px-4">
              {project.CampaignStory ? (
                <p className="text-gray-700 whitespace-pre-line">{project.CampaignStory}</p>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <i className="fas fa-book-open fa-3x mb-3 opacity-30"></i>
                  <p className="text-[17px]">No campaign story added yet</p>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="flex justify-center space-x-3 mt-4 mb-4">
              <button
                onClick={handleCancel}
                className="text-gray-200 bg-red-600 text-lg font-bold hover:bg-red-800 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-gray-200 bg-green-600 text-lg font-bold hover:bg-green-700 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-300"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Investment Prediction Section */}
      <div className="w-1/2 border-2 bg-gray-200 p-4 rounded-lg mb-5">
        <form>
          <div>
            <h2 className="text-black text-lg font-semibold my-2 py-4">Predict the Project's Status</h2>
            <div className="flex gap-4 items-center">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-black mb-1 text-left">Investment Amount</label>
                <input
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-400 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                />
                {errors.investmentAmount && (
                  <p className="text-red-500 text-sm">{errors.investmentAmount}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-left text-black mb-1">Funding Year</label>
                <input
                  type="number"
                  name="fundingYear"
                  value={formData.fundingYear}
                  onChange={handleInputChange}
                  className="w-full p-2 text-gray-700 text-sm md:text-lg rounded-md border-b-2 border-gray-400 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                />
                {errors.fundingYear && (
                  <p className="text-red-500 text-sm">{errors.fundingYear}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => submitInvestmentPrediction(ProjectId)}
              className={`w-full mt-4 py-2 rounded-md text-white ${isFormValid ? "bg-[#00192F] text-lg font-monst shadow-md rounded-2xl font-bold text-[17px] py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500" : "bg-gray-700 rounded-2xl opacity-50 cursor-not-allowed"}`}
              disabled={!isFormValid}
            >
              Predict Status
            </button>
          </div>
          {predictionResult && (
            <div className="mt-4 p-3 rounded-lg bg-gray-300 text-blue-500">
              <p className="font-semibold">The Status of the project {project.Name} after your investment will be:</p>
              <p>{predictionResult}</p>
            </div>
          )}
        </form>
      </div>

      {/* Analysis Section (only for project owner) */}
      {isProjectOwner && (
        <section>
          <div className="text-center mt-4 border-2 rounded-xl bg-gray-200 border-gray-400 w-2/3 my-6 ml-64 font-monst px-6">
            <p className="text-gray-800 my-7 text-lg">
              <strong className="text-left">Project Analysis:</strong> <br /><br />
              <p>Recommended Funding Round Type: <strong className="text-blue-600">{analysisData.NextRoundType}</strong></p>
              <p>Total Funding Received: <strong className="text-blue-600">${analysisData.TotalInvestment}</strong></p>
              <p>Recommended Funding Amount: <strong className="text-blue-600">${analysisData.NextRoundInvestment}</strong></p>


              ✅ <strong className="text-left">Market Potential:</strong><br />
              The AI customer service industry is growing rapidly, with businesses increasingly investing in automation. Your project has strong demand, especially among e-commerce and SaaS companies.
              <br /><br />

              ✅ <strong>Financial Feasibility:</strong><br />
              Your budget allocation is reasonable for an early-stage AI startup. However, given your funding goal of $500,000, securing investor interest will require a strong proof of concept and traction.
              <br /><br />

              ✅ <strong>Team & Advisors:</strong><br />
              A team of 12 with 3 advisors indicates a well-structured startup. Ensure you have the right balance of technical, marketing, and sales expertise to scale efficiently.
              <br /><br />

              ✅ <strong>Competitive Edge:</strong><br />
              Your chatbot's unique selling proposition (USP) should be well-defined—whether it's superior NLP, seamless integrations, or cost efficiency. Market differentiation will be crucial.
              <br /><br />

              ✅ <strong>Scaling Strategy:</strong><br />
              Consider partnerships with B2B clients, integrations with existing CRM platforms, and leveraging AI-driven data insights to improve customer retention.
              <br /><br />

              <strong>Next Steps for Success:</strong><br />
              Develop an MVP and gather initial user feedback. <br />
              Strengthen your pitch for potential investors, focusing on ROI and scalability. <br />
              Identify key partnerships to accelerate market entry. <br />
              Leverage AI ethics and compliance as a selling point for enterprise clients.
              <br /><br />

              🔍 <strong>Final Verdict:</strong> Your project has strong potential, but success depends on execution, securing the right funding, and standing out in a competitive AI-driven market.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProjectDetails;