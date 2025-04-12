import React from "react";
import { useNavigate } from "react-router-dom";
import Particles from "../Particles/Particles";
import { Toaster } from "sonner";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import GradientText from "../GradientText/GradientText";
import Header from "../Header";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/token");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.7 }}
      >
        <Header />

        <div className="relative w-full min-h-[90vh]  bg-black flex items-center justify-center overflow-hidden px-4 sm:px-8">
          {/* Optional: Particle Background */}

          <div className="absolute inset-0 z-0">
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={800}
              particleSpread={8}
              speed={0.15}
              particleBaseSize={60}
              moveParticlesOnHover={false}
              alphaParticles={true}
              disableRotation={true}
            />
          </div>

          {/* Spotlight Card */}
          <div className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 rounded-3xl shadow-xl w-full max-w-6xl p-6 sm:p-10 lg:p-16 text-white overflow-hidden h-[60vh]">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug">
              Welcome to <br className="sm:hidden" /> Solana Token Manager
            </h1>

            {/* Description */}
            <ul className="text-base sm:text-lg opacity-90 mb-10 list-disc list-inside space-y-3 pl-4">
              <li>Create, mint , and transfer Solana tokens easily.</li>
              <li>Use an intuitive interface to deploy tokens on devnet.</li>
              <li>Track your tokens and manage metadata in real time.</li>
              <li>Authentication will take few min (Kindly wait) </li>
            </ul>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Get Started
                <span>→</span>
              </button>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 w-full md:h-36 overflow-hidden ">
              <svg
                className="absolute bottom-0 w-full h-full"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path
                  fill="#4f46e5"
                  fillOpacity="1"
                  d="M0,160L60,144C120,128,240,96,360,106.7C480,117,600,171,720,181.3C840,192,960,160,1080,160C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
