import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import { motion } from 'framer-motion';
import loanimg from "./imgs/4.webp";

const accordionItems = [
  {
    id: 1,
    title: "What do you need to start a business?",
    content: [
      "Business Plan: Your plan is a document that provides in-depth detail...",
      "Business Name: Your name is what you'll call your company...",
      "Business Structure: Refers to the type of leadership and ownership...",
      "Business Registration: Credential with state authorities...",
      "Legal Requirements: Licenses and permits...",
      "Funding: Grants, loans, personal savings...",
      "Branding: The identity and image of your business..."
    ]
  },
  {
    id: 2,
    title: "How to Start a Business?",
    content: [
      "Write a business plan",
      "Choose a business name.",
      "Choose an ownership structure.",
      "Register your business.",
      "Review and comply with legal requirements.",
      "Apply for funding",
      "Create a brand identity."
    ]
  },
  {
    id: 3,
    title: "How to Make a Business Plan?",
    content: [
      "Use a business plan template.",
      "Narrow down what makes you different.",
      "Describe your company and business model.",
      "Analyze your market's conditions.",
      "Design a marketing and sales strategy.",
      "Detail a financial plan with business costs, funding, and revenue projections.",
      "Summarize the above with an appendix."
    ]
  },
  {
    id: 4,
    title: "Funding for Your New Business",
    content: [
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className="hidden lg:block w-[600px]">
          <img
            src={loanimg}
            alt="Business Image"
            className="w-full h-auto shadow-lg rounded-lg"
          />
        </div>,
        <div>
          <p className='text-gray-700'>
            From the day you start building your business until the point where you can make a consistent profit,
            you need to finance your operation and growth with start-up capital. Some founders can finance their
            business entirely on their own dime or through friends and family, which is called "bootstrapping."
          </p>
        </div>
      </div>,
    ]
  },
  {
    id: 5,
    title: "Campaign Deal Type",
    content: [
      <div key="equity font-monst bg-gray-150">
        <h3 className="font-bold text-lg mb-2 text-[#00192f]">Equity Crowdfunding</h3>
        
        <p className="mb-4 ml-4 text-gray-600">A company raises money by selling small ownership shares to a large number of investors. Investors become partial owners of the company.</p>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Retail investors (individuals)</li>
          <li className='text-gray-600'>Small-scale venture capitalists</li>
        </ul>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">When is it Used? </span></p>
        <p className="mb-4 ml-4 text-gray-600">When a startup wants to raise funds without relying on venture capital firms.</p>
      </div>,
  
      <div key="debt1">
        <h3 className="font-bold text-lg mb-2  text-[#00192f]" >Debt Crowdfunding / Peer-to-Peer Lending</h3>
       
        <p className="mb-4 ml-4 text-gray-600">A company borrows money from multiple investors and agrees to pay it back with interest. Investors act as lenders, not owners.</p>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Individuals, banks, and institutional investors</li>
        </ul>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">When is it Used?</span></p>
        <p className="mb-4 ml-4 text-gray-600">When a company wants to raise funds without giving away equity.</p>
      </div>,
  
      <div key="revenue">
        <h3 className="font-bold text-lg mb-2  text-[#00192f]">Revenue-Based Financing</h3>
    
        <p className="mb-4 ml-4 text-gray-600">Investors provide capital in exchange for a percentage of future revenue until a set amount is repaid. No fixed monthly payments – repayment depends on company revenue.</p>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Private investors and specialized revenue-based financing firms.</li>
        </ul>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">When is it Used?</span></p>
        <p className="mb-4 ml-4 text-gray-600">When a company has steady revenue but doesn't want to take loans or sell equity.</p>
      </div>,
  
      <div key="safe">
        <h3 className="font-bold text-lg mb-2  text-[#00192f]">SAFE (Simple Agreement for Future Equity)</h3>
   
        <p className="mb-4 ml-4 text-gray-600">Investors provide funding now, but instead of immediate equity, they get equity in the future when the company raises its next funding round</p>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Angel investors and early-stage venture capital firms.</li>
        </ul>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">When is it Used?</span></p>
        <p className="mb-4 ml-4 text-gray-600">When a startup isn't ready to set a company valuation but needs funding.</p>
      </div>,
  
      <div key="convertible">
        <h3 className="font-bold text-lg mb-2  text-[#00192f]">Convertible Notes</h3>
       
        <p className="mb-4 ml-4 text-gray-600">A loan that converts into equity after a set time or funding milestone. Instead of repaying cash, the company gives investors shares in a future funding round.</p>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Angel investors and venture capital firms.</li>
        </ul>
  
        <p className="mb-2">📌 <span className="font-semibold  text-[#00192f]">When is it Used?</span></p>
        <p className="mb-4 ml-4 text-gray-600">When a startup needs quick funding but hasn't set its valuation yet.</p>
      </div>,
  
      <div key="private">
        <h3 className="font-bold text-lg mb-2  text-[#00192f]">Private Placements</h3>
       
        <p className="mb-4 ml-4 text-gray-600">Companies sell shares privately to selected investors, rather than on a public stock exchange. Investors receive ownership (equity) in the company.</p>
  
        <p className="mb-2  text-[#00192f]">📌 <span className="font-semibold">Who Invests?</span></p>
        <ul className="list-disc pl-5 mb-4">
          <li className='text-gray-600'>Institutional investors, hedge funds, and private equity firms.</li>
        </ul>
  
        <p className="mb-2  text-[#00192f]">📌 <span className="font-semibold">When is it Used?</span></p>
        <p className="mb-4 ml-4 text-gray-600">When a company wants to raise large sums without public listing.</p>
      </div>,
    ]
  }
];

const ReadMore = ({ children, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = children;

  if (!text) return null;

  if (text.length <= maxLength || isExpanded) {
    return (
      <div>
        {text}
        {text.length > maxLength && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 hover:underline ml-2"
          >
            Read Less
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {text.substring(0, maxLength)}...
      <button
        onClick={() => setIsExpanded(true)}
        className="text-blue-600 hover:underline ml-2"
      >
        Read More
      </button>
    </div>
  );
};

export default function TableContent() {
    useEffect(() => {
    // Initialize Flowbite
    initFlowbite({
      placement: 'top',
      padding: 24 
    });

    // Handle hash navigation
    const handleNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the '#'
        const element = document.getElementById(sectionId);
        
        if (element) {
          // First scroll to top to reset position
          window.scrollTo(0, 0);
          
          // Use requestAnimationFrame for reliable timing
          requestAnimationFrame(() => {
            // Calculate the offset (adjust 100 if you have a fixed header)
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            // Smooth scroll to the section
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Open the accordion if needed
            const accordionNumber = sectionId.split('-')[1];
            const accordionButton = document.querySelector(
              `[data-accordion-target="#accordion-open-body-${accordionNumber}"]`
            );
            
            if (accordionButton && accordionButton.getAttribute('aria-expanded') === 'false') {
              accordionButton.click();
            }
          });
        }
      }
    };

    // Run on initial load
    handleNavigation();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleNavigation);

    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);
  
  return (
    <div className="bg-gray-200 font-monst content w-full">
      {/* ======= Hero Section with Video and Animation ======= */}
      <div className="bg-[#00192f] min-h-screen flex flex-col lg:flex-row items-center justify-between lg:px-48 py-16 space-y-10 lg:space-y-0 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-white lg:w-1/2 space-y-6"
        >
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-200">
            Build Your Dream Business
          </h1>
          <p className="text-lg md:text-lg text-gray-400">
            A practical startup guide to help you take your business idea from vision to reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[50%]"
        >
          <iframe
            className="rounded-xl shadow-2xl w-full h-[300px] md:h-[400px] lg:h-[450px]"
            src="https://www.youtube.com/embed/wxyGeUkPYFM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>

      {/* ======= Accordion Section ======= */}
      <div
        id="accordion-open"
        data-accordion="open"
        className="mb-12 px-6 md:px-12 lg:px-24 py-10"
      >
        {accordionItems.map((item, index) => (
          <div key={item.id} id={`section-${item.id}`} className="mb-4">
            <h2 id={`accordion-open-heading-${item.id}`}>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 text-[20px] border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                data-accordion-target={`#accordion-open-body-${item.id}`}
                aria-expanded={index === 0 ? "false" : "false"}
                aria-controls={`accordion-open-body-${item.id}`}
              >
                <span className="flex text-left">
                  <svg className="w-5 h-5 me-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {item.title}
                </span>
                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-open-body-${item.id}`}
              className="hidden"
              aria-labelledby={`accordion-open-heading-${item.id}`}
            >
              <div className="p-7 border border-b-0 border-gray-200 dark:border-gray-600 text-[18px] text-left">
                {item.id === 5 ? (
                  <div className="space-y-6">
                    {item.content.map((section, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg text-left">
                        {section}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-3 text-gray-600 text-left">
                    {item.content.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}