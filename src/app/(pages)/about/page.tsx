"use client";
import { motion } from "framer-motion";

export default function About() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <>
      {/*HISTORY*/}
      <motion.div 
        className="min-h-[650px] bg-transparent w-full mb-60 flex text-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="flex flex-col flex-2 justify-center p-4">
          <span className="bg-white px-12 py-8 rounded-4xl shadow-xl">
            <h2 className="text-3xl mb-6 font-bold">
              Our History
            </h2>
            <p className="text-lg text-justify">
              In its early years, when no dedicated building or sufficient rooms were available, classes at the Medellin National Science and Technology School (MNSTS) were conducted at Medellin Central School, where students sat on the floor. Once completed, the new MNSTS building in the New Medellin Estate Subdivision provided a more suitable environment for learning. The school began operations in the 1996-1997 academic year under its founder, Dr. Carolino B. Mordeno. Alongside standard secondary education subjects, students received additional intensive training in challenging disciplines such as Mathematics and Science, with extended instructional hours for each subject.
            </p>
          </span>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <img src="images/school_history.png" className="object-contain" alt="MNSTS Historical Photo" />
        </div>
      </motion.div>

      {/*EXCELLENCE*/}
      <motion.div 
        className="min-h-[650px] bg-transparent w-full mb-60 flex text-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col flex-2 justify-center p-4">
          <span className="bg-white px-12 py-8 rounded-4xl shadow-xl">
            <h2 className="text-3xl mb-6 font-bold">
              Excellence in education across fields
            </h2>
            <p className="text-lg text-justify">
              At our science high school, we strive to provide students with a
              dynamic and enriching learning environment that fosters curiosity,
              innovation, and critical thinking. Our focus on science and
              technology encourages students to explore new ideas, engage in
              hands-on discovery, and develop problem-solving skills that
              prepare them for the future. Beyond academics, we cultivate a
              culture of integrity, leadership, and resilience, ensuring that
              our students grow into well-rounded individuals ready to make
              meaningful contributions to society.
            </p>
          </span>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <img src="images/about_excellence.png" className="object-contain" alt="Excellence in Education" />
        </div>
      </motion.div>

      {/*VISION*/}
      <motion.div 
        className="min-h-[650px] w-full mb-60 flex items-center justify-center flex-col"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <h2 className="text-5xl mb-6 font-bold text-white">THE DEPED VISION</h2>
        <div className="flex flex-1 justify-center">
          <img
            src="images/vision.png"
            className="object-contain max-w-[750px] max-h-[500px]"
            alt="DepEd Vision"
          />
        </div>
      </motion.div>

      {/*MISSION*/}
      <motion.div 
        className="min-h-[650px] w-full mb-60 flex items-center justify-center flex-col"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <h2 className="text-5xl mb-6 font-bold text-white">
          THE DEPED MISSION
        </h2>
        <div className="flex flex-1 justify-center">
          <img
            src="images/mission.png"
            className="object-contain max-w-[750px] max-h-[500px]"
            alt="DepEd Mission"
          />
        </div>
      </motion.div>
    </>
  );
}