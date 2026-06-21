import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    icon: "🥗",
    title: "Know your body's needs",
    description: "Get your daily calorie and macro targets calculated instantly based on science."
  },
  {
    icon: "🤖",
    title: "AI-crafted meal plans",
    description: "Our AI builds a full day's diet around your goal, cuisine, and lifestyle."
  },
  {
    icon: "🏆",
    title: "Reach your health goal",
    description: "Whether it's weight loss, muscle gain, or just eating better — we've got you."
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('hasCompletedOnboarding')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    navigate('/setup');
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-between p-6 bg-bgApp overflow-hidden">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between overflow-hidden">
        {/* Skip Button */}
        <div className="flex justify-end h-8 shrink-0">
          {currentSlide < slides.length - 1 && (
            <button
              onClick={handleComplete}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              Skip
            </button>
          )}
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 md:my-8 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              {/* Soft background shape around Emoji */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 flex items-center justify-center text-6xl md:text-7xl mb-4 md:mb-8 shadow-sm shrink-0">
                {slides[currentSlide].icon}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 mb-2 md:mb-3 px-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs md:text-sm font-medium text-gray-500 px-6 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 md:gap-6 mt-auto shrink-0">
          {/* Dot Indicators */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
                  currentSlide === idx ? 'bg-primary w-5' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-[50px] md:h-[52px] px-4 rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg focus:outline-none text-xs md:text-sm"
          >
            {currentSlide === slides.length - 1 ? 'Know your nutritional requirements' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
