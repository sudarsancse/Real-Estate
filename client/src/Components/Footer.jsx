import React from "react";
import {FaFacebook, FaInstagram, FaGithub, FaLinkedin} from "react-icons/fa";
import {FaSquareXTwitter} from "react-icons/fa6";
import {Link} from "react-router-dom";

export default function Footer() {
  const handleExternalLinkClick = (url) => (event) => {
    event.preventDefault();
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <div>
      <div className="flex gap-2 flex-col py-10 items-center justify-center bg-[#E2E8F0]">
        <div className="flex gap-4">
          <Link to="" onClick={handleExternalLinkClick("/")}>
            <FaFacebook className="w-10 h-8 hover:text-pink-700" />
          </Link>
          <Link to="" onClick={handleExternalLinkClick("/")}>
            <FaInstagram className="w-10 h-8 hover:text-pink-700" />
          </Link>
          <Link to="" onClick={handleExternalLinkClick("https://twitter.com")}>
            <FaSquareXTwitter className="w-8 h-8 hover:text-pink-700" />
          </Link>
          <Link
            to=""
            onClick={handleExternalLinkClick(
              "https://www.linkedin.com/in/sudarsan-sarkar-a59b2825a/"
            )}
          >
            <FaLinkedin className="w-10 h-8 hover:text-pink-700" />
          </Link>
          <Link
            to=""
            onClick={handleExternalLinkClick("https://github.com/sudarsancse")}
          >
            <FaGithub className="w-10 h-8 hover:text-pink-700" />
          </Link>
        </div>
        <p className="text-center text-slate-700 text-xs lg:text-sm">
          &copy; By Sudarsan Sarkar
          <br /> in 2024
        </p>
      </div>
    </div>
  );
}
