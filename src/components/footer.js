// src/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <p className="text-sm">&copy; {new Date().getFullYear()} Say it Together. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-sm hover:text-blue-400">Privacy Policy</a>
                    <a href="#" className="text-sm hover:text-blue-400">Terms of Service</a>
                    <a href="#" className="text-sm hover:text-blue-400">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
