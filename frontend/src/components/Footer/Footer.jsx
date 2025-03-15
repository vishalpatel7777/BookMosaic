import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="relative top- w-full bg-gray-50">
      <hr />

      <div className="flex justify-between px-10 py-6 text-lg">
        {/* Our Company  */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold">OUR COMPANY</h3>
          <ul className="space-y-1">
            <li>Find a Boutique</li>
            <li>Careers</li>
            <li>Cartier and Corporate Social Responsibility</li>
          </ul>
        </div>

        {/* Legal Area */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold">LEGAL AREA</h3>
          <ul className="space-y-1">
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Conditions of Sale</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-bold">FOLLOW US</h3>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-2xl hover:text-pink-600 transition"
              />
            </a>
            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-2xl hover:text-green-500 transition"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faTwitter}
                className="text-2xl hover:text-blue-500 transition"
              />
            </a>
          </div>
        </div>
      </div>

      <hr />

      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between  ",
          alignItems: "center",
          padding: "0   50px",
          background: "#bc453c",
        }}
        className='bottom-0 left-0 z-50 w-full h-15 text-white   bg-[ "#bc453c"] '
      >
        <p>SHOP IN : INDIA</p>
        <p className="relative  text-xl">
          {" "}
          COPYRIGHT &copy; {new Date().getFullYear()} BOOKMOSAIC
        </p>
      </div>
    </footer>
  );
}

export default Footer;
