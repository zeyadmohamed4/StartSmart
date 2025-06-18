import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { FaHandshake, FaLightbulb, FaChartBar, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Rawana from './imgs/Rawana.jpg';
import Rawana2 from './imgs/Rawana2.jpg';
import Ebrahim from './imgs/Ebrahim.jpg';
import Rawan from './imgs/Rawan.jpg';
import Sama from './imgs/Sama.jpg';
import Zeyad from './imgs/zoz.jpg';
import Aya from './imgs/Aya.jpg';

import img from './imgs/about.avif';
import secimg from './imgs/uii.jpg';

function AboutUs() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === 5 ? 5 : prev + 1));
  };

  const teamMembers = [

    { Id: 1, Name: "Aya Mahmoud ", Role: "Backend Developer", Image: Aya },
    { Id: 2, Name: "Sama Gamal", Role: "Frontend Developer", Image: Sama },
    { Id: 3, Name: "Rawan Abdo", Role: "Backend Developer", Image: Rawan },
    { Id: 4, Name: "Rawan ElOlemy", Role: "Frontend Developer", Image: Rawana },
    { Id: 5, Name: "Ebrahim Osama", Role: "AI Specialist", Image: Ebrahim },
    { Id: 6, Name: "Zeyad Mohamed", Role: "Backend Developer", Image: Zeyad },
  ];
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  // Scroll to top on component mount (and thus, on reload)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="relative content w-full">
      {/* Background Section*/}
      <div className="relative h-[600px] ">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${img})`, width: '100%' }}
        />
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>

      {/* About Section */}
      <div className="-mt-40 z-10 relative">
        <div className="bg-gray-300 drop-shadow-xl p-10 max-w-4xl mx-auto text-center shadow-lg">
          <h1 className="relative text-3xl font-[1000] font-monst text-[#00192f] mb-4 leading-[1.5]">
            About Us
            <div className="mt-2">
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[160px] h-[1px] bg-blue-300" />
            </div>
          </h1>
          <h2 className="text-xl font-semibold mb-2 py-2 font-monst text-gray-600">Empowering Dreams</h2>
          <h4 className="text-gray-500 font-monst text-center">
            Where bold ideas meet smart investments — we fuel the future by connecting those who dare to dream with those who believe in them.
          </h4>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="mt-20 mx-36 w-5/6 py-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={secimg} alt="Team Working" className="w-full h-[348px] shadow-md" />
          </motion.div>

          {/* Features */}
          <motion.div
            className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 px-4 text-[#00192f] bg-[#00192f]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title Card */}
            <div className="col-span-full text-center">
              <h1 className="text-2xl font-[1000]  relative font-monst text-gray-300 mb-4 leading-[1.5]">
                Why Choose Us
                <div className="mt-4">
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]" />
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[130px] h-[1px] bg-blue-300" />
                </div>
              </h1>
            </div>

            {/* Feature Cards */}
            {[
              { icon: "📊", title: "Market Analysis", desc: "Detailed reports to guide your startup decisions." },
              { icon: "🤝", title: "Investor Matching", desc: "Connect with investors tailored to your domain." },
              { icon: "💼", title: "Business Mentorship", desc: "One-on-one sessions with experienced founders." },
              { icon: "🔒", title: "Secure Platform", desc: "Data protection and verified project listings." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-start bg-gray-300 p-4 rounded-xl hover:bg-blue-400 hover:text-[#00192f] transition-all duration-300 shadow-md">
                {/* Icon and Text */}
                <div className=" flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-3xl text-blue">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-500 mb-2 font-monst">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-lato">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="mt-20  mx-auto w-[1350px] py-12 px-8 bg-gray-200  " id='Service'>
        <div className="text-center mb-16">
          <h1 className="text-4xl  font-[1000] font-monst text-[#00192f] mb-4 leading-[1.5] relative">
            Our Services
            <div className="mt-2">
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[160px] h-[1px] bg-blue-300" />
            </div>
          </h1>
          <h2 className="text-xl font-semibold mb-2 py-2 font-monst text-gray-600">
            We don’t just fund ideas—we fuel futures
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            {
              icon: <FaHandshake className="text-4xl text-blue-500 " />,
              title: "Investor Matching",
              description: "Strategic connections between startups and qualified investors based on industry and growth potential."
            },
            {
              icon: <FaLightbulb className="text-4xl text-blue-500" />,
              title: "Pitch Preparation",
              description: "Craft compelling pitches that showcase your startup's value proposition to potential investors."
            },
            {
              icon: <FaChartBar className="text-4xl text-blue-500" />,
              title: "Smart Funding Roadmap",
              description: "Develop tailored funding roadmaps from seed rounds to Series A and beyond."
            },
            {
              icon: <FaUserTie className="text-4xl text-blue-500" />,
              title: "Investor Relations",
              description: "Ongoing support maintaining productive relationships with your investor network."
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#00192f] shadow-lg p-6 rounded-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative pt-16"
              whileHover={{ y: -5 }}
            >
              {/* Icon Container - Half Inside/Half Outside */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center border-4 border-[#00192f] shadow-md">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold font-monst text-gray-400 mb-4">{service.title}</h3>
              <p className="text-gray-300 font-lato text-[16px]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet Our Team Section */}
      <div id="team" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#eceff1] w-[1350px]  mt-10 mx-auto">
        <h2 className="relative inline-block text-3xl text-center text-[#00192F] font-monst font-[800] mb-8 mx-auto">
          Meet Our Team
          <div className="mt-2">
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[160px] h-[1px] bg-blue-300" />
          </div>
        </h2>
        <h3 className="text-xl font-semibold mb-8  font-monst text-gray-500">
          The team behind our vision
        </h3>
        <div className="relative flex justify-center">
          {/* Slider */}
          <motion.div
            className="w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex" style={{ transform: `translateX(-${startIndex * 100 / 3}%)`, transition: 'all 0.4s ease' }}>
              {teamMembers.map((member, index) => (
                <div className="w-1/3 px-2" key={member.Id}>
                  <div className="bg-gray-200 shadow-md gap-6 overflow-hidden">
                    <img src={member.Image} alt={member.Name} className="w-full h-60 object-cover" />
                    <div className="p-4 text-center">
                      <h4 className="text-lg  text-[#00192f] font-monst font-[1000]">{member.Name}</h4>
                      <p className="text-gray-500 text-[16px] font-monst">{member.Role}</p>
                      <p className="mt-2 text-gray-400">{member.Bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}

      </div>
    </div>
  );
}

export default AboutUs;
