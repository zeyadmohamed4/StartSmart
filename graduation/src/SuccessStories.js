import React, { useState, useEffect } from "react";
import Rawan from './imgs/Rawana.jpg';
import img from './imgs/12.jpg';
import { motion } from "framer-motion";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://localhost:7010/api/SuccessStory';
const API_ENDPOINTS = {
  SUCCESS_STORIES: `${API_BASE_URL}/GetAllWithDescription`,
  OWNER_PROJECTS: `${API_BASE_URL}/owner/projects`,
  DELETE_STORY: `${API_BASE_URL}/reject`,
};

const SuccessStories = () => {
  const location = useLocation();
  const storyIdFromState = location.state?.id;

  const [showDetails, setShowDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ProjectName: "",
    Description: "",
  });
  const [formError, setFormError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState({
    successStories: true,
    ownerProjects: true,
    storyDetails: true
  });
  const [ownerProjects, setOwnerProjects] = useState([]);
  const [successCards, setSuccessCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Enhanced token decoding function
  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);

      const userId =
        decoded.sub ||
        decoded.userId ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        decoded.nameid;

      if (!userId) {
        console.error('User ID not found in token');
        return null;
      }

      const username =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded.username;

      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded.role;


      return { userId, username, role };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  // Get user info from token
  useEffect(() => {
    const userData = decodeToken();
    if (userData) {
      setCurrentUser({
        userId: userData.userId,
        userName: userData.username,
        isOwner: userData.role === 'Owner'
      });
    }
  }, []);

  // Dummy data fallback
  const dummyCards = Array.from({ length: 18 }, (_, index) => ({
    Id: index + 1,
    ProjectName: `Project ${index + 1}`,
    OwnerPhoto: Rawan,
    Name: "Rawan El-Olemy",
    userName: "user" + (index + 1),
    userId: index + 100,
    Category: ["Technology", "Business", "Education"][index],
    Description: `This is a sample success story description for project ${index + 1}.`
  }));

  useEffect(() => {
    window.scrollTo(0, 0);

    if (storyIdFromState && successCards.length > 0) {
      const story = successCards.find(card => card.Id === parseInt(storyIdFromState));
      if (story) {
        setTimeout(() => {
          const storyElement = document.getElementById(`story-${story.Id}`);
          if (storyElement) {
            storyElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            handleViewMore(successCards.indexOf(story));
          }
        }, 300);
      }
    }
  }, [storyIdFromState, successCards]);

  useEffect(() => {
    if (window.location.hash === "#SuccessForm") {
      window.scrollTo(0, 0);
      setShowForm(true);
      setTimeout(() => {
        const formElement = document.getElementById("SuccessForm");
        if (formElement) {
          formElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    }
  }, []);

  const fetchSuccessStories = async () => {
    try {
      setIsLoading(prev => ({ ...prev, successStories: true }));
      const response = await axios.get(API_ENDPOINTS.SUCCESS_STORIES);

      const formattedStories = response.data.map(story => ({
        Id: story.id,
        ProjectName: story.projectName,
        OwnerPhoto: story.userImage || Rawan,
        Name: story.name,
        userName: story.userName,
        userId: story.userId,
        Category: story.category || "General",
        Description: story.description
      }));

      setSuccessCards(formattedStories);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setSuccessCards(dummyCards);
    } finally {
      setIsLoading(prev => ({ ...prev, successStories: false }));
    }
  };

  const fetchOwnerProjects = async () => {
    try {
      setIsLoading(prev => ({ ...prev, ownerProjects: true }));
      const token = localStorage.getItem('token');

      if (!token) {
        setOwnerProjects([{ value: "", label: "No Projects (Please login as Owner)" }]);
        return;
      }

      const response = await axios.get('https://localhost:7010/api/Project/GetByUserName', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedProjects = response.data.map(project => ({
        value: project.projectName,
        label: project.projectName
      }));

      setOwnerProjects(formattedProjects.length > 0
        ? formattedProjects
        : [{ value: "", label: "No Projects" }]);
    } catch (error) {
      console.error('Error fetching owner projects:', error);
      setOwnerProjects([{ value: "", label: "No Projects (Error loading)" }]);
    } finally {
      setIsLoading(prev => ({ ...prev, ownerProjects: false }));
    }
  };

  const fetchStoryDetails = async (storyId) => {
    try {
      setIsLoading(prev => ({ ...prev, storyDetails: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get('', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setSuccessCards(prev => prev.map(card =>
        card.Id === storyId ? {
          ...card,
          Description: response.data.description || card.Description,
          Category: response.data.category || card.Category,
          userName: currentUser?.name || card.userName,
        } : card
      ));
    } catch (error) {
      console.error('Error fetching story details:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, storyDetails: false }));
    }
  };

  const submitSuccessStory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login as Owner to share your success story');
        return;
      }

      const response = await axios.post(
        'https://localhost:7010/api/SuccessStory/Create',
        {
          projectName: formData.ProjectName,
          description: formData.Description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newStory = {
        Id: response.data.id,
        ProjectName: ownerProjects.find(p => p.value === formData.ProjectName)?.label,
        OwnerPhoto: response.data.userImage,
        Name: response.data.name || "Unknown",
        userId: response.data.userId,
        Category: response.data.category,
        Description: formData.Description,
      };

      setSuccessCards(prev => [newStory, ...prev]);
      alert("Story Added Successfully!");
      fetchSuccessStories();
      setShowForm(false);
      resetForm();

      /*    setTimeout(() => {
     window.location.reload();
   }, 100); */


    } catch (error) {
      console.error('Error submitting success story:', error);
      alert('Failed to add story. Please try again.');
    }
  };

  const deleteSuccessStory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to delete this story');
        return;
      }

      await axios.post(
        API_ENDPOINTS.DELETE_STORY,
        { id: storyToDelete },  // Send ID directly as the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'  // Ensure proper content type
          }
        }
      );

      alert("Success Story Deleted")
      const updatedCards = successCards.filter(card => card.Id !== storyToDelete);
      setSuccessCards(updatedCards);

      if (showDetails && showDetails.Id === storyToDelete) {
        setShowDetails(null);
      }

      setShowDeleteConfirm(false);
      setStoryToDelete(null);
    } catch (error) {
      console.error('Error deleting success story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchOwnerProjects();
    }
  }, [showForm]);

  const handleViewMore = (index) => {
    const story = successCards[index];
    setShowDetails(story);

    if (!story.Description || story.Description.length < 100) {
      fetchStoryDetails(story.Id);
    }
  };

  const handleClose = () => {
    setShowDetails(null);
  };

  const resetForm = () => {
    setFormData({ ProjectName: "", Description: "" });
    setIsFormValid(false);
  };

  const handleFormChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    setIsFormValid(Object.values(updatedFormData).every(value => value.trim() !== ""));
  };

  const handleDeleteClick = (storyId) => {
    setStoryToDelete(storyId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteSuccessStory();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setStoryToDelete(null);
  };

  const isStoryOwner = (story) => {
    return currentUser?.userId == story.userId;
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header with background image */}
      <div
        className="font-monst relative bg-cover w-full min-h-[550px] text-white"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[500px] px-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-gray-400 mb-4 drop-shadow-md"
          >
            Success Stories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[18px] text-gray-300 max-w-2xl font-medium leading-relaxed"
          >
            Your story could be the spark that inspires someone else to keep going...
          </motion.p>

          {currentUser?.isOwner && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={() => setShowForm(true)}
              id="SuccessForm"
              className="mt-6 text-[17px] px-4 py-2 rounded-2xl border-2 border-cyan-900 text-gray-200 font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300"
            >
              Share Your Success Story
            </motion.button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-monst px-4">
          <div className="bg-[#00192f] p-8 rounded-2xl shadow-2xl w-full max-w-xl relative">
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-center text-gray-400 mb-6">
              Share Your Success Story
            </h3>

            <form onSubmit={submitSuccessStory} className="space-y-6">
              <div>
                <label htmlFor="ProjectName" className="block text-lg text-gray-500 text-left mb-1">
                  Select Project
                </label>
                <select
                  name="ProjectName"
                  id="ProjectName"
                  value={formData.ProjectName}
                  onChange={handleFormChange}
                  className="w-full bg-gray-200 p-3 border border-gray-300 text-[17px] rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  disabled={isLoading.ownerProjects || ownerProjects.length === 0}
                >
                  <option className="text-[17px]" value="" disabled>Select a Project</option>
                  {ownerProjects.length > 0 ? (
                    ownerProjects.map((project) => (
                      <option key={project.value} value={project.value} className="text-[17px]">
                        {project.label}
                      </option>
                    ))
                  ) : (
                    <option className="text-[17px]" value="" disabled>No Projects Available</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="Description" className="block text-lg text-gray-500 text-left mb-1">
                  Your Story
                </label>
                <textarea
                  name="Description"
                  id="Description"
                  value={formData.Description}
                  onChange={handleFormChange}
                  rows="5"
                  className="w-full text-[17px] p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                  placeholder="Write your inspiring journey here..."
                  required
                />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-6 py-2 rounded-lg transition duration-200 ${isFormValid
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Add Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete your success story?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-[1650px] mx-auto bg-gray-200 py-4">
        <div className="w-full px-4 lg:px-8 flex justify-center">
          <div className="w-full max-w-4xl rounded-lg p-6 mb-16 text-center font-monst">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#00192f] mb-2">
                Our Successful Stories
              </h2>
              <div className="relative flex justify-center items-center mb-6">
                <span className="w-[80px] h-[1px] border-t border-b border-blue-300 py-[5px]"></span>
                <span className="absolute bottom-[6px] w-[180px] h-[0.5px] bg-blue-300"></span>
              </div>
            </div>
            <p className="text-gray-700 text-[17px] leading-relaxed mx-auto max-w-3xl">
              Every success story begins with a dream. These stories reflect the courage, passion, and perseverance of individuals who believed in their vision and brought it to life. Let their journeys motivate you to write your own.
            </p>
          </div>
        </div>

        <section className="font-monst w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 w-full">
            {isLoading.successStories ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-[#00192f] shadow-lg rounded-md overflow-hidden relative h-[450px] animate-pulse">
                  <div className="w-full h-[300px] bg-gray-400"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-400 rounded w-32"></div>
                  </div>
                </div>
              ))
            ) : (
              successCards.map((card, index) => (
                <div
                  key={card.Id || index}
                  id={`story-${card.Id}`}
                  className="bg-[#00192f] shadow-lg rounded-md overflow-hidden relative transform transition-transform duration-300 hover:scale-105"
                >
                  <img className="w-full h-[300px] object-center" src={card.OwnerPhoto} alt={card.Name} />
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-400">{card.Name}</h2>
                    <h2 className="text-lg font-bold text-gray-400">{card.ProjectName}</h2>
                    <p className="text-sm text-gray-500">Category: {card.Category}</p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewMore(index)}
                        className="text-[17px] px-4 py-2 rounded-2xl border-2 border-cyan-900 text-gray-200 font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300"
                      >
                        View More
                      </button>
                      {isStoryOwner(card) && (
                        <button
                          onClick={() => handleDeleteClick(card.Id)}
                          className="text-[17px] px-4 py-2 rounded-2xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>  </div>


                  {showDetails && showDetails.Id === card.Id && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-400 bg-opacity-70 flex justify-center items-center ">
                      <div className="bg-gray-300 m-2 p-6 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">

                        <button onClick={handleClose} className="absolute top-24 right-3 text-xl text-gray-800">
                          &times;
                        </button>
                        <img src={card.OwnerPhoto} alt={card.Name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800">{card.ProjectName}</h2>
                        <p className="text-center text-sm text-gray-500">{card.Category}</p>
                        <div className="text-gray-700 mt-4 overflow-y-auto max-h-40 text-[16px]">
                          {isLoading.storyDetails ? "Loading story details..." : card.Description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuccessStories;