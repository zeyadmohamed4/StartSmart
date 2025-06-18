import React, { useState, useEffect } from "react";
import img from './imgs/contact.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Correct imports from free-brands-svg-icons
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
// Import solid icons separately
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ChatBox from './ChatBox.js';
import StyledInput from './StyledInput.jsx';
import { send } from 'emailjs-com';
function ContactUs() {
  const [formData, setFormData] = useState({
    PhoneNumber: "",
    Email: "",
    Message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    Email: false,
    Message: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing in a field with error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case "Email":
        if (value.trim() && !/\S+@\S+\.\S+/.test(value)) {
          error = "Enter a valid email (e.g., example@domain.com)";
        }
        break;

      case "Message":
        if (!value.trim()) {
          error = "Message cannot be empty";
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error || undefined
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Email
    if (!formData.Email.trim() || !/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = formData.Email.trim() ?
        "Enter a valid email (e.g., example@domain.com)" :
        "Email is required";
    }

    // Validate Message
    if (!formData.Message.trim()) {
      newErrors.Message = "Message cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://cors-anywhere.herokuapp.com/https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000" // Your localhost port
        },
        body: JSON.stringify({
          service_id: "service_sn4528b",
          template_id: "template_cnr4kge",
          user_id: "97iwWQmptWxBn29h8",
          template_params: {
            to_email: "startsmartgp@gmail.com",
            email: formData.Email,
            message: formData.Message,
          },
        }),
      });
      const data = await response.text();
      console.log("Email sent:", data);

      // Show success message
      setShowSuccess(true);
      setIsSubmitted(true);

      // Reset form after 7 seconds
      setTimeout(() => {
        setFormData({ PhoneNumber: "", Email: "", Message: "" });
        setTouchedFields({ Email: false, Message: false });
        setShowSuccess(false);
      }, 7000);

    } catch (error) {
      console.error("Proxy error:", error);
    }
  };


  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  // Scroll to top on component mount (and thus, on reload)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>
      <div className="relative content w-full bg-gray-200">
        {/* Full-width Background Section */}
        <div className="relative  h-[600px]">
          <div className="absolute inset-0 bg-cover " style={{ backgroundImage: `url(${img})`, width: '100%' }} />
          <div className="absolute inset-0 bg-black opacity-50" />

          {/* Right-aligned Contact Us heading */}
          <div className="absolute inset-0 flex items-center justify-end pr-10 md:pr-20">
            <div className="text-right mt-8">
              <h1 className="relative text-3xl font-[1000] font-monst text-white mb-4">
                Get In Touch With Us

              </h1>

              <h4 className="text-gray-300 font-monst text-[17px]">
                "Your message matters to us - Contact us"
              </h4>
            </div>
          </div>
        </div>




        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 bg-[#00192f]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#00192f]">


            <div className="bg-gray-300 p-6 shadow-xl rounded-lg text-left">
              <h3 className="text-2xl font-bold text-[#00192f] mb-4 font-monst">Contact Us</h3>

              <div className="space-y-6 text-gray-700">
                {/* Email with icon */}
                <div className="group">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00192f] group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="group-hover:text-blue-500 transition-colors font-monst">contact@startupfund.com</p>
                  </div>
                </div>

                {/* Phone with icon */}
                <div className="group">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00192f] group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="group-hover:text-blue-500 transition-colors font-monst">+20 123 456 7890</p>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="pt-4">
                  <h4 className="font-semibold text-lg mb-4 font-monst">Follow Us</h4>
                  <div className="flex space-x-4 text-[#00192f] ">
                    <a href="https://www.facebook.com/share/1H3shVtcdz/?mibextid=wwXIfr" className="hover:text-blue-500 transition duration-300 text-[30px]">
                      <FontAwesomeIcon icon={faFacebook} size="lg" />
                    </a>
                    <a href="#" className="hover:text-blue-500 transition duration-300 text-[30px]">
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://www.instagram.com/sama.gamaal?igsh=NXh2MGhjNWN4cWs0&utm_source=qr" className="hover:text-blue-500 transition duration-300 text-[30px]">
                      <FontAwesomeIcon icon={faInstagram} size="lg" />
                    </a>
                    <a href="#" className="hover:text-blue-500 transition duration-300 text-[30px]">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleChat}
                className="bg-[#00192f] rounded-2xl font-bold text-[17px] font-monst mt-4 text-gray-200 py-2 px-4 hover:bg-gray-600  transition-all duration-500"
              >
                {showChat ? "Hide Live Chat" : "Live Chat"}
              </button>
            </div>


            <div className="bg-[#00192f] p-8 text-white text-left  ">
              <h3 className="text-2xl font-bold mb-6 font-monst text-gray-300">Get In Touch With Us</h3>

              {isSubmitted && showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-3 mr-3 text-xl"
                  />
                  <div>
                    <h4 className="font-medium text-green-800">Message Sent Successfully</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="placeholder:text-sm">
                  <label className="block text-gray-300 font-monst text-sm opacity-70">Email </label>
                  <StyledInput
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}

                  /> {touchedFields.Email && errors.Email && (
                    <p className="text-red-500 text-xs ml-3">{errors.Email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <textarea
                    id="Message"
                    name="Message"
                    value={formData.Message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="5"
                    placeholder="Message Us"
                    className={`w-full p-2 text-white text-sm md:text-md rounded-md border-b-2 ${errors.Message ? "border-red-500 ml-5 " : "border-gray-300"
                      } focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-gray-300 font-monst`}
                  ></textarea>
                  {touchedFields.Message && errors.Message && (
                    <p className="text-red-500 text-xs ml-6">{errors.Message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      {showChat && <ChatBox />}

    </>
  );
}

export default ContactUs;