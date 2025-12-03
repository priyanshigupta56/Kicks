// src/components/Footer.jsx
import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logoImg from "../assets/img/logo2.png"; // <-- Replace with your logo path

const Footer = () => {
  return (
    <footer className="bg-[#0e1626] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* LEFT: Logo + description + social */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logoImg}
              alt="KICKS logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-semibold">KICKS</span>
          </div>

          <p className="text-gray-300 leading-relaxed max-w-sm">
            Premium footwear for every lifestyle. Step into comfort and style.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-5">
            <a href="#" className="hover:opacity-80 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:opacity-80 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:opacity-80 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:opacity-80 transition">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">Men's Shoes</a></li>
            <li><a href="#">Women's Shoes</a></li>
            <li><a href="#">Kids' Shoes</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 my-10 max-w-[1400px] mx-auto" />

      {/* Bottom text */}
      <p className="text-center text-gray-400 text-sm">
        © 2025 KICKS. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
