import React, { useState,useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaUser,FaGlobe,FaMapMarkerAlt, FaLinkedin,FaEnvelope, FaLock, FaIdCard, FaPhone, FaBirthdayCake, FaUsers, FaCamera } from 'react-icons/fa';

function Auth() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    UserName: '',
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    SSN: '',
    PhoneNumber: '',
    Role: '',
    Image: null,
     Country: '',
    City: '',
    LinkedIn: '',
  });
  const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'EG', name: 'Egypt' },
  // Add more countries as needed
];

const citiesByCountry = {
  US: ['New York', 'Los Angeles', 'Chicago'],
  UK: ['London', 'Manchester', 'Birmingham'],
  CA: ['Toronto', 'Vancouver', 'Montreal'],
  AU: ['Sydney', 'Melbourne', 'Brisbane'],
  EG: ['Cairo', 'Alexandria', 'Giza'],
  // Add more cities as needed
};
  const [loginData, setLoginData] = useState({
    Email: '',
    Password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupStatus, setSignupStatus] = useState({ message: '', isSuccess: false });
  const [loginStatus, setLoginStatus] = useState({ message: '', isSuccess: false });

  
  // Scroll to top on component mount (and thus, on reload)
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  const handleFileChange = (e) => {
    setFormData({ ...formData, Image: e.target.files[0] });
  };

   const handleGoogleSignUp = async (response) => {
    try {
      const res = await axios.post('/api/auth/google', {
        credential: response.credential
      });
      if (res.data.success) {
        // Save user data to localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify({
          username: res.data.user.UserName,
          email: res.data.user.Email,
          role: res.data.user.Role
        }));
        navigate('/');
      }
    } catch (err) {
      setLoginStatus({
        message: err.response?.data?.message || 'Google login failed',
        isSuccess: false
      });
    }
  };
  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    if (value.trim() === "") {
      setLoginErrors(prev => ({ ...prev, [name]: undefined }));
    } else if (loginTouched[name] || loginErrors[name]) {
      validateLoginField(name, value);
    }
  };

  const handleLoginBlur = (e) => {
    const { name, value } = e.target;
    setLoginTouched(prev => ({ ...prev, [name]: true }));
    validateLoginField(name, value);
  };

  const validateLoginField = (fieldName, value) => {
    const newErrors = { ...loginErrors };

    switch (fieldName) {
      case "Email":
        if (value.trim() === "") {
          delete newErrors.Email;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.Email = "Enter a valid email (e.g., example@domain.com)";
        } else {
          delete newErrors.Email;
        }
        break;

      case "Password":
        if (value.trim() === "") {
          delete newErrors.Password;
        } else if (value.length < 8) {
          newErrors.Password = "Password must be at least 8 characters long";
        } else {
          delete newErrors.Password;
        }
        break;

      default:
        break;
    }

    setLoginErrors(newErrors);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginStatus({ message: '', isSuccess: false });

    // Validate all fields
    const allTouched = Object.keys(loginData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setLoginTouched(allTouched);
    Object.keys(loginData).forEach((field) => validateLoginField(field, loginData[field]));
    
    // Check for empty fields
    const hasEmptyFields = Object.values(loginData).some(field => field.trim() === "");
    if (hasEmptyFields) {
      setLoginStatus({
         message: 'All fields are required to complete the submission',
          isSuccess: false });
      return;
    }

    if (isLoginValid) {
      try {
        const response = await axios.post('https://localhost:7010/api/Users/Login', loginData);
        
        if (response.data.success) {
          // Save token to localStorage
          localStorage.setItem('token', response.data.token);

      alert("Login Successfully");
          // Navigate to home page
          navigate('/');
          
          // Reset form
          setLoginData({ Email: '', Password: '' });
        } else {
          setLoginStatus({
            message: response.data.message || 'Login failed',
            isSuccess: false
          });
        }
      } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.isActive === "Pending") {
          errorMessage = 'Your account is still pending approval';
        } else if (error.response.isActive === "") {
          errorMessage = 'You have to sign up first';
        } else {
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        'Login failed. Please try again.';
        }
      }
      
        setLoginStatus({
          message: errorMessage,
          isSuccess: false
        });
      }
    }
  };

  // Signup handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "SSN" && (!/^\d*$/.test(value) || value.length > 14)) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (value.trim() === " ") {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } else if (touched[name] || errors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
  const validations = {
  UserName: () => {
    if (value.trim() === "") return "Username is required";
    return null;
  },
  Name: () => {
    if (value.trim() === "") return "Full name is required";
    return null;
  },
  Email: () => {
    if (value.trim() === "") return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
    return null;
  },
  Password: () => {
    if (value.trim() === "") return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
      return "Password must contain letters, numbers, and special characters";
    }
    return null;
  },
  ConfirmPassword: () => {
    if (value.trim() === "") return "Please confirm your password";
    if (value !== formData.Password) return "Passwords do not match";
    return null;
  },
  SSN: () => {
    if (value.trim() === "") return "National ID is required";
    if (value.length !== 14) return "National ID must be 14 digits";
    return null;
  },
  PhoneNumber: () => {
    if (value.trim() === "") return "Phone number is required";
    if (!/^\+?\d{10,15}$/.test(value)) return "Please enter a valid phone number";
    return null;
  },

  Role: () => {
    if (value.trim() === "") return "Please select a user type";
    return null;
  },
  Country: () => {
    if (value.trim() === "") return "Country is required";
    return null;
  },
  City: () => {
    if (value.trim() === "") return "City is required";
    return null;
  },
 LinkedIn: () => {
      if (value.trim() !== "") {
        if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/.test(value)) {
          return "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)";
        }
      }
      return null;
    },
};


    const error = validations[fieldName]?.();
    if (error) newErrors[fieldName] = error;
    else delete newErrors[fieldName];
    
    setErrors(newErrors);
  };

const handleBlur = (e) => {
  const { name, value } = e.target;
  setTouched(prev => ({ ...prev, [name]: true }));
  
  // Only validate if field has content
  if (value.trim() !== "") {
    validateField(name, value);
  } else {
    // Field is empty - remove any existing error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSignupStatus({ message: '', isSuccess: false });

  
    // Validate all fields
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    Object.keys(formData).forEach((field) => validateField(field, formData[field]));
  
    // Check for empty fields (excluding Image which is optional)
    const requiredFields = Object.entries(formData).filter(([key]) => key !== 'Image');
    const hasEmptyFields = requiredFields.some(([_, value]) => value === "" || value === null);
    
    if (hasEmptyFields) {
      setSignupStatus({
         message: 'All fields are required', 
        isSuccess: false });
      setIsSubmitting(false);
      return;
    }
  
    if (formData.Password !== formData.ConfirmPassword) {
      setSignupStatus({
         message: 'Passwords do not match',
          isSuccess: false });
      setIsSubmitting(false);
      return;
    }
  
    if (isSignupValid) {
      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });

        const response = await axios.post('https://localhost:7010/api/Users/SignUp', formDataToSend, {
          headers: {

          }
        });

        if (response.data.success) {
          
          setSignupStatus({ 
            message: 'Registration Is Pending approval!', 
            isSuccess: true,
             
          });
      
             // Navigate to auth page
          navigate('/Auth');
          
          // Reset form after successful registration
          setFormData({
            UserName: '',
            Name: '',
            Email: '',
            Password: '',
            ConfirmPassword: '',
            SSN: '',
            PhoneNumber: '',
            Role: '',
            Image: null,
            Country:'',
            City:'',
            LinkedIn:''
          });
        } else {
          setSignupStatus({
            message: response.data.message || 'Registration failed',
            isSuccess: false
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Registration failed. Please try again.';
        setSignupStatus({
          message: errorMessage,
          isSuccess: false
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSignupStatus({ 
        message: 'Please fix the errors in the form', 
        isSuccess: false 
      });
      setIsSubmitting(false);
    }
  };
  // Validation states for submit buttons
  const isLoginValid = Object.keys(loginErrors).length === 0 && 
                       loginData.Email.trim() !== " " && 
                       loginData.Password.trim() !== " ";

  const isSignupValid = Object.keys(errors).length === 0 && 
                        Object.entries(formData).every(([key, value]) => {
                          if (key === 'Image') return true;
                          return value !== " " && value !== null;
                        });

  return (
    <div className="content w-full max-h-[2000px]">
      <div className="w-full content flex items-center justify-center py-12 mt-16 bg-gray-200">
        <div className="w-full max-w-5xl mx-4 bg-gradient-to-r from-cyan-300 to-[#171d38] rounded-2xl shadow-xl mt-6 grid grid-cols-1 md:grid-cols-2 h-[850px]">
          {/* Left Panel */}
          <div className="bg-[#00192F] p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-6 transition-colors duration-300 min-h-[400px] md:h-[850px]">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center">
              {showSignUp ? "Welcome Back!" : "Hello,"}
            </h2>
            <p className="text-white text-center text-sm md:text-base px-4">
              {showSignUp
                ? "To keep connected with us please login with your personal info"
                : "Enter your personal details and start your journey with us"}
            </p>
            <button
              className="border-2 border-white rounded-xl px-6 bg-white md:px-8 py-2 text-cyan-900 text-sm md:text-base uppercase hover:text-cyan-900 hover:bg-gray-300 font-bold"
              onClick={() => setShowSignUp(!showSignUp)}
            >
              {showSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          

          {/* Right Panel */}
          <div className="relative p-4 mt-8 md:p-8 min-h-[400px] md:h-[700px]">
            {showSignUp ? (
              // Sign Up Form
              <form onSubmit={handleSubmit} className="w-full p-4 space-y-4 md:space-y-6 transition-transform duration-300 max-h-[650px] overflow-y-auto">
                <h3 className="text-2xl md:text-3xl text-center font-bold text-white">
                  Create An Account
                </h3>
          {/* Signup Status Messages */}
          {signupStatus.message && (
                  <div className={`flex items-start gap-2 ${signupStatus.isSuccess ? 'bg-blue-50 border-blue-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'} border px-4 py-3 rounded-md shadow-sm mb-4`}>
                    <svg
                      className={`w-5 h-5 ${signupStatus.isSuccess ? 'text-green-500' : 'text-red-500'} mt-0.5`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={signupStatus.isSuccess ? "M5 13l4 4L19 7" : "M12 9v2m0 4h.01M5.07 18.93A10 10 0 1118.93 5.07 10 10 0 015.07 18.93z"}
                      />
                    </svg>
                    <p className="text-sm font-medium leading-relaxed">{signupStatus.message}</p>
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  {/* Username */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-white" />
                    </div>
                    <input
                      type="text"
                      name="UserName"
                      value={formData.UserName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Username"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base border-b-2 border-gray-300 rounded-md outline-none focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    {errors.UserName && <p className="text-red-500 text-xs text-left pl-10">{errors.UserName}</p>}
                  </div>

                  {/* Full Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-white" />
                    </div>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Full Name"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    {errors.Name && <p className="text-red-500 text-xs text-left pl-10">{errors.Name}</p>}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-white" />
                    </div>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    {errors.Email && <p className="text-red-500 text-xs text-left pl-10">{errors.Email}</p>}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-white" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 mt-2 mr-2 text-white text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    {errors.Password && <p className="text-red-500 text-xs text-left pl-10">{errors.Password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-white" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="ConfirmPassword"
                      value={formData.ConfirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm Password"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 mt-2 mr-2 text-white text-sm"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                    {errors.ConfirmPassword && <p className="text-red-500 text-xs text-left pl-10">{errors.ConfirmPassword}</p>}
                  </div>

                  {/* National ID */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-white" />
                    </div>
                    <input
                      type="text"
                      name="SSN"
                      value={formData.SSN}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={14}
                      placeholder="National ID"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    />
                    {errors.SSN && <p className="text-red-500 text-xs text-left pl-10">{errors.SSN}</p>}
                  </div>
{/* Country and City */}
<div className="grid grid-cols-2 gap-4">
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaGlobe className="text-white" />
    </div>
    <select
      name="Country"
      value={formData.Country}
      onChange={(e) => {
        handleChange(e);
        // Reset city when country changes
        setFormData(prev => ({ ...prev, City: '' }));
      }}
      onBlur={handleBlur}
      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none"
    >
      <option className="text-gray-600 bg-gray-200" value="" disabled>Select Country</option>
      {countries.map(country => (
        <option key={country.code} value={country.code} className="text-gray-400">
          {country.name}
        </option>
      ))}
    </select>
    {errors.Country && <p className="text-red-500 text-xs text-left pl-10">{errors.Country}</p>}
  </div>

  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaMapMarkerAlt className="text-white" />
    </div>
    <select
      name="City"
      value={formData.City}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={!formData.Country}
      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none"
    >
      <option className="text-gray-600 bg-gray-200" value="" disabled>Select City</option>
      {formData.Country && citiesByCountry[formData.Country]?.map(city => (
        <option key={city} value={city} className="text-gray-400">
          {city}
        </option>
      ))}
    </select>
    {errors.City && <p className="text-red-500 text-xs text-left pl-10">{errors.City}</p>}
  </div>
</div>

{/* Phone Number with Country Code */}
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
{/*     <FaPhone className="text-white " />
 */}  </div>

  <div className="flex">
    <select
      name="CountryCode"
      value={formData.CountryCode || '+20'} // Default to Egypt
      onChange={handleChange}
      className="w-24 p-2 text-white text-sm md:text-base rounded-l-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none"
    >
      <option value="+1" className="text-gray-400">+1 (US)</option>
      <option value="+44" className="text-gray-400">+44 (UK)</option>
      <option value="+20" className="text-gray-400">+20 (EG)</option>
      {/* Add more country codes as needed */}
    </select>
    <input
      type="tel"
      name="PhoneNumber"
      value={formData.PhoneNumber}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Phone Number"
      className="flex-1 p-2 text-white text-sm md:text-base border-b-2 rounded-r-md border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
    />
  </div>
  {errors.PhoneNumber && <p className="text-red-500 text-xs text-left pl-10">{errors.PhoneNumber}</p>}
</div>
                  {/* User Type */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-white" />
                    </div>
                    <select
                      name="Role"
                      value={formData.Role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="pl-10 w-full p-2 text-white text-sm md:text-base rounded-md border-b-2
                       border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
                    >
                      <option className="text-gray-600 bg-gray-200" value="" disabled>Select User Type</option>
                      <option className="text-gray-400  "value="Owner">Owner</option>
                      <option className="text-gray-400 " value="Investor">Investor</option>
                    </select>
                    {errors.Role && <p className="text-red-500 text-xs text-left pl-10">{errors.Role}</p>}
                  </div>

{/* LinkedIn Profile */}
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <FaLinkedin className="text-white" />
  </div>
  <input
    type="url"
    name="LinkedIn"
    value={formData.LinkedIn}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder="LinkedIn Profile URL"
    className="pl-10 w-full p-2 text-white text-sm md:text-base border-b-2 rounded-md border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white"
  />
  {errors.LinkedIn && <p className="text-red-500 text-xs text-left pl-10">{errors.LinkedIn}</p>}
</div>

                  {/* Image Upload */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCamera className="text-white" />
                    </div>
                    <input
                      type="file"
                      name="Image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="pl-10 w-full p-2 text-white text-sm md:text-base border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-white hover:file:bg-cyan-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isSignupValid || isSubmitting}
                  className="w-full bg-transperant text-white py-2 px-6 text-sm md:text-base rounded-lg hover:bg-gray-300 hover:text-cyan-900 border-2 border-cyan-900 font-bold duration-600 transition-colors duration-600"
                >
                  {isSubmitting ? 'Registering...' : 'SIGN UP'}
                </button>
              </form>
            ) : (
         
                // Sign In Form
              <form onSubmit={handleLoginSubmit} className="w-full absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-4 md:space-y-6 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl text-center font-bold text-white">
                  Sign in To Your Account
                </h3>
             
                {/* Login Status Messages */}
                {loginStatus.message && (
                  <div className={`flex items-start gap-2 ${loginStatus.isSuccess ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'} border px-4 py-3 rounded-md shadow-sm mb-4`}>
                    <svg
                      className={`w-5 h-5 ${loginStatus.isSuccess ? 'text-green-500' : 'text-red-500'} mt-0.5`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={loginStatus.isSuccess ? "M5 13l4 4L19 7" : "M12 9v2m0 4h.01M5.07 18.93A10 10 0 1118.93 5.07 10 10 0 015.07 18.93z"}
                      />
                    </svg>
                    <p className="text-sm font-medium leading-relaxed">{loginStatus.message}</p>
                  </div>
                )}
                <div className="space-y-3 md:space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      name="Email"
                      value={loginData.Email}
                      onChange={handleLoginChange}
                      onBlur={handleLoginBlur}
                      placeholder="Email"
                      className="w-full text-white p-2 text-sm md:text-base border-b-2 border-gray-300 rounded-md bg-transparent focus:outline-none placeholder:text-white"
                    />
                    {loginErrors.Email && <p className="text-red-500 text-xs text-left">{loginErrors.Email}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="Password"
                      value={loginData.Password}
                      onChange={handleLoginChange}
                      onBlur={handleLoginBlur}
                      placeholder="Password"
                      className="w-full p-2 text-white text-sm md:text-base border-b-2 border-gray-300 rounded-md bg-transparent focus:outline-none placeholder:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 mt-2 mr-2 text-white text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    {loginErrors.Password && <p className="text-red-500 text-xs text-left">{loginErrors.Password}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!isLoginValid}
                  className="w-full bg-transperant text-white py-2 px-6 text-sm md:text-base rounded-lg hover:bg-gray-300 hover:text-cyan-900 border-2 border-cyan-900 font-bold duration-600 transition-colors duration-600"
                >
                  Login
                </button>
                <div className="text-center mt-0">
                  <a
                    href="/auth/forgot-password"
                    className="text-xs md:text-sm font-semibold text-white hover:text-gray-200 transition-all duration-300 mt-0"
                  >
                    Forgot Password?
                  </a>
                </div>
                {/* Google Sign In Button */}
                <div className="flex justify-center mt-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSignUp}
                   onError={() => {
                      setLoginStatus({ message: 'Google login failed', isSuccess: false });
                    }}
                    useOneTap
                    render={(renderProps) => (
                      <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="flex items-center justify-center bg-white text-gray-800 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors w-full"
                      >
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                          alt="Google logo" 
                          className="w-5 h-5 mr-2"
                        />
                        Sign in with Google
                      </button>
                    )}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;