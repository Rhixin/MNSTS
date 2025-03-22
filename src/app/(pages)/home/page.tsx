"use client";
import { motion } from "framer-motion";

export default function Home() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.7 + i * 0.2,
        duration: 0.8,
      },
    }),
  };

  const programs = [
    {
      title: "STEM Education",
      description: "Comprehensive science and technology curriculum",
      icon: "🧪",
    },
    {
      title: "Innovation Labs",
      description: "Hands-on technology and engineering workshops",
      icon: "🔧",
    },
    {
      title: "Research Projects",
      description: "Student-led scientific investigations",
      icon: "🔬",
    },
  ];

  const floatingAnimation = {
    y: [0, -15, 0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  const emojis = [
    { symbol: "🧬", delay: 0 },
    { symbol: "🔭", delay: 1 },
    { symbol: "💻", delay: 2 },
  ];
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen rounded-4xl">
      <motion.div
        className="max-w-6xl mx-auto min-h-[580px] w-full p-8 rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-16">
          <div className="flex justify-items-start flex-col items-start w-full md:w-1/2">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold tracking-wide text-black leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              MNSTS{" "}
              <motion.span
                className="text-[rgb(9,116,68)]"
                animate={{
                  color: ["rgb(9,116,68)", "rgb(16,185,129)", "rgb(9,116,68)"],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                We Are
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-6 text-xl text-gray-700 max-w-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Medellin National Science and Technology School: Excellence in
              Science, Technology, and Innovation
            </motion.p>

            <div className="flex gap-4 mt-8">
              <motion.a
                href="/about"
                className="px-6 py-3 text-lg bg-[rgb(9,116,68)] text-white rounded-full shadow-lg hover:bg-[rgb(7,94,55)] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Learn More
              </motion.a>
            </div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="h-64 md:h-96 rounded-2xl flex items-center justify-center">
              <div className="text-6xl flex gap-4">
                {emojis.map((emoji, index) => (
                  <motion.span
                    key={index}
                    animate={{
                      y: [0, -15, 0, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      delay: emoji.delay,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  >
                    {emoji.symbol}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Programs Section */}
        <div className="py-8">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Academic Excellence
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <motion.div
                key={program.title}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
