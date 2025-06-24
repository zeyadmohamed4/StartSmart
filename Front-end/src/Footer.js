import logo from './imgs/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import img from './imgs/footer.avif';

function Footer() {
  return (
    <footer
      className="relative font-monst text-white py-8 w-full  bottom-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00192f] bg-opacity-100 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 text-gray-200">

          {/* Logo & Quote */}
          <div className="flex flex-col items-start md:border-r border-gray-500 md:pr-8 md:min-h-[250px] ml-12  ">
            <div className="flex items-center space-x-2 mt-4 ">
              <h1 className="font-bold text-[28px] text-gray-300 ">Start Smart</h1>
              <i className="fa-solid fa-handshake text-blue-400 text-[28px]"></i>
            </div>
            <p className="text-sm italic mt-4 text-gray-200 text-left leading-relaxed max-w-[350px]">
              Empowering ideas, transforming futures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start md:border-r border-gray-500 px-6 md:min-h-[250px]">
            <h3 className="font-bold text-lg mb-6 text-gray-300">Quick Links</h3>
            <ul className="space-y-2">
              <li className="text-left"><a href="/AboutUs" className="hover:text-blue-300"><strong className='text-[19px] text-blue-300'>+</strong> About Us</a></li>
              <li className="text-left"><a href="/" className="hover:text-blue-300"><strong className='text-[19px] text-blue-300'>+</strong> Testimonials</a></li>
              <li className="text-left"><a href="/AboutUs#Service" className="hover:text-blue-300"><strong className='text-[19px] text-blue-300'>+</strong> Our Services</a></li>
              <li className="text-left"><a href="/Categories" className="hover:text-blue-300"><strong className='text-[19px] text-blue-300'>+</strong> Projects</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start px-6 md:min-h-[250px]">
            <h4 className="font-bold text-lg mb-6 text-gray-300 ">Contact</h4>
            <ul className="space-y-4">
              <li>
                <p className="text-sm text-white font-bold font-monst mb-1 text-left">Phone</p>
                <div className="flex items-start space-x-2">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-400 mt-1" />
                  <span className="text-md hover:text-blue-300 cursor-pointer">+212625034263</span>
                </div>
              </li>
              <li>
                <p className="text-sm text-white font-bold font-monst mb-1 text-left">Email</p>
                <div className="flex items-start space-x-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-400 mt-1" />
                  <span className="text-md hover:text-blue-300 cursor-pointer">contact@startsmart.com</span>
                </div>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl  hover:text-gray-400">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl  hover:text-gray-400">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl  hover:text-gray-400">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl  hover:text-gray-400">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-400 pt-4 text-center text-gray-300">
          <p className="text-sm">&copy; Copyright 2025 StartSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
