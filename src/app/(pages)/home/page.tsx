"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="min-h-[580px] w-full p-6 rounded-xl overflow-auto text-center flex items-center justify-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex justify-items-start flex-col items-start w-full">
        <motion.h1
          className="text-6xl font-extrabold tracking-wide text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          SciTech{" "}
          <motion.span
            className="text-[rgb(9,116,68)]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            We Are
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 text-2xl text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Excellence in Science, Technology, and Innovation
        </motion.p>

        <motion.a
          href="/about"
          className="mt-6 px-6 py-3 text-lg bg-[rgb(9,116,68)] text-white rounded-full shadow-lg hover:bg-yellow-500 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Learn More
        </motion.a>
      </div>
    </motion.div>
  );
}
