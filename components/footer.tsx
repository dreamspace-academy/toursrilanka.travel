import Link from "next/link"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">Tour Sri Lanka</h2>
            <p className="text-gray-400 mt-3">
              Explore the beauty of Sri Lanka with curated tours and unforgettable experiences.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300">
                  Cancelation Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-3 space-y-2 text-gray-400">
              <li>
                <a href="mailto:info@toursrilanka.com" className="hover:text-white transition duration-300">
                  info@toursrilanka.com
                </a>
              </li>
              <li>
                <a href="tel:+94771234567" className="hover:text-white transition duration-300">
                  +94 77 123 4567
                </a>
              </li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4 mt-3">
              <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Tour Sri Lanka. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
