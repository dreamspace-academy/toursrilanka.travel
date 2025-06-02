"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-[#FBBA00] text-black p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-all"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 50 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <ArrowUp size={20} />
    </motion.button>
  );
};

export default ScrollToTopButton;
