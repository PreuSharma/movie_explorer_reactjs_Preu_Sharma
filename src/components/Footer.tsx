import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-bold mb-2">MovieExplore+</h2>
          <p className="text-sm text-gray-400">
            The ultimate destination for movie lovers. Watch unlimited movies and TV shows anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/dashboard/movies')}>Movies</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/dashboard/subscription')}>Subscription</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/dashboard/my-list')}>My List</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-2">Help & Support</h3>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">FAQ</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h3 className="font-semibold mb-2">Connect With Us</h3>
          <div className="flex space-x-3 mb-4">
            <FaFacebookF className="bg-gray-800 p-2 rounded-full w-8 h-8 hover:bg-red-600 cursor-pointer" />
            <FaTwitter className="bg-gray-800 p-2 rounded-full w-8 h-8 hover:bg-red-600 cursor-pointer" />
            <FaInstagram className="bg-gray-800 p-2 rounded-full w-8 h-8 hover:bg-red-600 cursor-pointer" />
            <FaYoutube className="bg-gray-800 p-2 rounded-full w-8 h-8 hover:bg-red-600 cursor-pointer" />
          </div>

          <h3 className="font-semibold mb-2">Newsletter</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white px-3 py-2 rounded-l w-full outline-none"
            />
            <button
              type="button"
              className="bg-red-600 px-4 py-2 rounded-r hover:bg-red-700"
              onClick={() => {
                navigate('/dashboard/subscription');
                window.scrollTo(0, 0);
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © 2024 MovieExplore+. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
