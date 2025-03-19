"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function Counter({
  end,
  label,
}: {
  end: number;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Runs animation only once

  useEffect(() => {
    if (!isInView) return; // Only start when visible

    let start = 0;
    const duration = 1500; // Animation duration (ms)
    const stepTime = duration / end; // Time per increment

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-9xl font-bold text-[rgb(9,116,68)] text-center"
    >
      {count}
      <span className="text-3xl block text-gray-600">{label}</span>
    </motion.div>
  );
}
