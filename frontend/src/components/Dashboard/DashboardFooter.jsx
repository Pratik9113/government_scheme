import React from 'react';
import { Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';

const DigiKissanFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 relative" aria-label="Footer">
      {/* Decorative Diagonal Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gray-900 transform -translate-y-full overflow-hidden" aria-hidden="true">
        <div className="w-full h-20 bg-white transform rotate-2 origin-bottom-left translate-y-12"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Company Info */}
          <section className="md:col-span-1" aria-label="Company Information">
            <div className="mb-4">
              <span className="text-2xl font-bold">
                ©{currentYear} <span className="text-green-400">Digi</span>Kisan
              </span>
            </div>
            <div className="mb-4">
              <p className="mb-2">Powered by</p>
              <img
                src="/api/placeholder/140/50"
                alt="Digital India Logo"
                className="h-10"
              />
            </div>
            <div className="mb-4 text-sm">
              <p>Digital India Corporation (DIC)</p>
              <p>Ministry of Electronics & IT (MeitY)</p>
              <p>Government of India<sup>®</sup></p>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-2 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Linkedin" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                <Linkedin size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                <Instagram size={18} />
              </a>
            </div>
          </section>

          {/* Quick Links */}
          <nav className="md:col-span-1" aria-label="Quick Links">
            <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
            <ul className="space-y-4">
              <li>
                <a href="/about" aria-label="About Us" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> About Us
                </a>
              </li>
              <li>
                <a href="/contact" aria-label="Contact Us" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> Contact Us
                </a>
              </li>
              <li>
                <a href="#" aria-label="Screen Reader" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> Screen Reader
                </a>
              </li>
              <li>
                <a href="#" aria-label="Accessibility Statement" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> Accessibility Statement
                </a>
              </li>
              <li>
                <a href="#" aria-label="Frequently Asked Questions" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> FAQs
                </a>
              </li>
              <li>
                <a href="#" aria-label="Disclaimer" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> Disclaimer
                </a>
              </li>
              <li>
                <a href="#" aria-label="Terms and Conditions" className="flex items-center hover:text-green-400 transition">
                  <span className="mr-2">›</span> Terms & Conditions
                </a>
              </li>
            </ul>
          </nav>

          {/* Get in Touch */}
          <section className="md:col-span-1" aria-label="Contact Information">
            <h2 className="text-xl font-semibold mb-6">Get in touch</h2>
            <address className="not-italic mb-4">
              <p>Software Engineer</p>
              <p>DSA, Java, C++</p>
              <a href="mailto:pratik.patil9113@gmail.com" className="hover:underline text-green-400">pratik.patil9113@gmail.com</a>
            </address>
            <p className="mb-4">
              <a href="https://leetcode.com/u/pratik9113_/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline break-all">
                Leetcode account – pratik9113_
              </a>
            </p>
            <p>(9:00 AM to 5:30 PM)</p>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default DigiKissanFooter;
