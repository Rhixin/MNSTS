"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Page = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const changingWords = ["Innovation", "Excellence", "Leadership", "Discovery", "Technology"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % changingWords.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <motion.p
          className="text-5xl md:text-7xl text-white font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to MNSTS!
        </motion.p>

        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="text-black">Students of </span>
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-[#9bda71]"
          >
            {changingWords[currentWordIndex]}
          </motion.span>
        </motion.h1>

        <motion.p
          className="mb-6 text-white max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Excellence in Science, Technology, and Innovation
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            className="py-4 px-8 rounded-xl bg-[#097444] text-white hover:bg-[#0b854f] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
      
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Page;