import welcomeBg from "../assets/welcome.png";
import vynox from "../assets/vynox.png";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Welcome = () => {
  return (
    <div
      style={{ backgroundImage: `url(${welcomeBg})`}}
      className="w-screen h-screen bg-cover bg-center relative flex items-center justify-center text-white"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#000000a8]"></div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center gap-4 w-[90%] md:w-1/2 text-center px-4">
        {/* Logo + Name */}
        <div className="flex items-center justify-center gap-1">
          <img src={vynox} alt="Vynox Logo" className="w-16" />
          <h1 className="text-5xl font-bold tracking-wide">Vynox</h1>
        </div>

        {/* Tagline */}
        <h3 className="text-2xl italic text-gray-200">
          Discover, watch, and enjoy all your favorite videos in one place.
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
          Vynox is a full-featured video platform where you can upload and stream videos, 
          interact with others through likes and comments, create playlists, subscribe to channels, 
          and receive notifications. All your entertainment needs are covered with a modern, seamless experience.
        </p>

        {/* Button */}
        <Link
          to="/user/login"
          className="flex items-center gap-2 px-6 py-2 mt-4 rounded-md bg-[#005fb8] hover:bg-[#0070da] duration-300 text-white font-semibold text-lg"
        >
          <span>Get Started</span>
          <ArrowRight size={18} className="ml-3"/>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
