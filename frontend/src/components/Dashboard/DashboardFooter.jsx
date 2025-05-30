import React from 'react';
import { Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';

const DigiKissanFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-12 relative">
            {/* Diagonal top edge */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-900 transform -translate-y-full overflow-hidden">
                <div className="w-full h-20 bg-white transform rotate-2 origin-bottom-left translate-y-12"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-1">
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
                            <p>Digital India Corporation(DIC)</p>
                            <p>Ministry of Electronics & IT (MeitY)</p>
                            <p>Government of India<sup>®</sup></p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-2">
                            <a href="#" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Screen Reader
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Accessibility Statement
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Frequently Asked Questions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Disclaimer
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:text-green-400 transition">
                                    <span className="mr-2">›</span> Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </div>


                    {/* Get in touch */}
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-6">Get in touch</h2>
                        <address className="not-italic mb-4">
                            <p>Software Engineer</p>
                            <p>DSA, Java, cpp</p>
                            <p>pratik.patil9113@gmail.com</p>
                        </address>

                        <p className="mb-4">
                            <a href="https://leetcode.com/u/pratik9113_/" className="text-green-400 hover:underline break-all">
                                Leetcode account - pratik9113_
                            </a>
                        </p>

                        <p>(9:00 AM to 5:30 PM)</p>
                    </div>
                </div>
            </div>

            {/* My circle logo */}
            <div className="absolute bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                <span>DigiKisan</span>
            </div>
        </footer>
    );
};

export default DigiKissanFooter;