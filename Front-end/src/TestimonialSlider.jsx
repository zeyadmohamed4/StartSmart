import { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://localhost:7010/api';
const FEEDBACK_API = {
  GET_ALL: `${API_BASE_URL}/FeedBack/GetAll`,
  ADD_FEEDBACK: `${API_BASE_URL}/FeedBack/Create`
};

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Get username and role from token
  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(FEEDBACK_API.GET_ALL);

        // Get current user data from token
        const currentUser = decodeToken();

        // Map feedback data with user info from token
        const mappedTestimonials = response.data.map(feedback => {
          // Use token user data if this is the current user's feedback
          if (currentUser && feedback.userName === currentUser.username) {
            return {
              id: feedback.id,
              name: currentUser.username,
              review: feedback.massage,
              rating: feedback.stars,
              date: feedback.createdAt,
              avatar: null,
              role: currentUser.role
            };
          }

          // Otherwise use data from API
          return {
            id: feedback.id,
            name: feedback.userName,
            review: feedback.massage,
            rating: feedback.stars,
            date: feedback.createdAt,
            avatar: null,
            role: feedback.role
          };
        });

        setTestimonials(mappedTestimonials);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([
          {
            id: 1,
            name: "Rawan",
            review: "I was struggling to find the right support for my startup...",
            rating: 4,
            date: "2023-05-15",
            avatar: null,
            role: "User"
          },
          {
            id: 2,
            name: "Ebrahim",
            review: "As an investor, I've found several promising projects...",
            rating: 5,
            date: "2023-06-20",
            avatar: null,
            role: "Investor"
          },
          {
            id: 3,
            name: "Zeyad",
            review: "The resources and community here helped me refine...",
            rating: 4,
            date: "2023-07-10",
            avatar: null,
            role: "Entrepreneur"
          }
        ]);
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Set user data on component mount
  useEffect(() => {
    const user = decodeToken();
    setUserData(user);
  }, []);

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const indices = [
      currentIndex,
      (currentIndex + 1) % testimonials.length,
      (currentIndex + 2) % testimonials.length,
    ];
    return indices.map(i => testimonials[i]);
  };

  useEffect(() => {
    if (!isHovered && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, testimonials.length]);

  const handleFeedbackSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first to submit feedback');
      navigate('/auth');
      return;
    }

    const currentUser = decodeToken();
    if (!currentUser) {
      alert('Error verifying your account. Please log in again.');
      return;
    }

    if (!review || !rating) {
      alert('Please provide feedback and rating');
      return;
    }

    try {
      await axios.post(
        FEEDBACK_API.ADD_FEEDBACK,
        {
          massage: review,
          userName: currentUser.username,
          stars: rating
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add new feedback with user data from token
      setTestimonials(prev => [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: currentUser.username,
          review: review,
          rating: rating,
          date: new Date().toISOString(),
          avatar: null,
          role: currentUser.role
        },
        ...prev
      ]);
      alert("Your FeedBack Added Successflly")
      setShowForm(false);
      setReview("");
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    }
  };

  const handleAddFeedbackClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add feedback');
      navigate('/auth');
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="relative">
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-[#00192F] text-black rounded-lg p-12 w-[600px] z-50 shadow-lg">
            <h3 className="text-center text-[#eceff1] font-monst font-[800] mb-8 mx-auto">Add Your Feedback</h3>



            <textarea
              placeholder="Your feedback message..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 mb-3 border rounded-xl"
              rows={4}
            />

            <div className="flex mb-4 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                />
              ))}
              <span className="ml-2 text-gray-300">{rating}/5</span>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="bg-[#eceff1] text-white py-16 px-4 w-[1250px] rounded-md shadow-xl mt-4 overflow-hidden relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center mb-12">
          <h2 className="relative inline-block text-3xl text-center text-[#00192F] font-monst font-[800] mb-8 mx-auto">
            What People Say
            <div className="mt-2">
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]"></span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[160px] h-[1px] bg-blue-300"></span>
            </div>
          </h2>
          <p className="text-center text-gray-500 mb-6 max-w-3xl mx-auto font-opensans">
            Voices from our platform
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-hidden relative px-12">
            <motion.div className="flex gap-8">
              {getVisibleTestimonials().map((t, i) => (
                <motion.div
                  key={`${t.id}-${i}`}
                  className="w-1/3 flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.1 } }}
                >
                  <div className="relative h-full group mr-4">
                    <div className="absolute top-0 left-0 w-full h-full z-0 bg-gray-400 translate-x-4 translate-y-6 transition-colors duration-300 group-hover:bg-blue-400" />

                    <div className="relative z-10 bg-[#00192F] px-6 py-8 h-full transition-all duration-300 hover:translate-y-[-10px] shadow-md">
                      <div className="flex text-[#FFD700] mb-3">
                        {Array(t.rating).fill().map((_, i) => <FaStar key={i} />)}
                        {Array(5 - t.rating).fill().map((_, i) => <FaStar key={i + t.rating} className="text-gray-400" />)}
                      </div>
                      <FaQuoteLeft className="text-gray-400 mb-2" />
                      <p className="italic font-opensans text-gray-300 mb-6 leading-relaxed">{t.review}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-gray-300 text-lg font-bold">{t.name}</span>
                          {t.role && (
                            <span className="block text-gray-400 text-sm">{t.role}</span>
                          )}
                        </div>
                        {t.date && (
                          <span className="text-gray-400 text-sm">
                            {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={handleAddFeedbackClick}
            className="bg-[#00192F] rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
          >
            Add Your Feedback
          </button>
        </div>
      </div>
    </div>
  );
}