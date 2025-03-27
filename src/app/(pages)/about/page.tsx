"use client";
import Counter from "@/components/Counter";
import SchoolStatistics from "@/components/SchoolStatistics";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-6 lg:px-8">
      {/* STORY */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white px-6 sm:px-8 md:px-12 py-6 md:py-8 rounded-3xl md:rounded-4xl shadow-xl w-full sm:w-[90%] md:w-[80%] lg:w-[60%]"
          >
            <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold text-center">
              Our Story
            </h2>
            <p className="text-base md:text-lg text-justify leading-7 md:leading-10">
              In its early years, when no dedicated building or sufficient rooms
              were available, classes at the Medellin National Science and
              Technology School (MNSTS) were conducted at Medellin Central
              School, where students sat on the floor. Once completed, the new
              MNSTS building in the New Medellin Estate Subdivision provided a
              more suitable environment for learning. The school began
              operations in the 1996-1997 academic year under its founder, Dr.
              Carolino B. Mordeno. Alongside standard secondary education
              subjects, students received additional intensive training in
              challenging disciplines such as Mathematics and Science, with
              extended instructional hours for each subject.
            </p>
          </motion.div>
        </div>
      </section>
      {/* FACULTY AND STUDENTS */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white px-6 sm:px-8 md:px-12 py-6 md:py-8 rounded-3xl md:rounded-4xl shadow-xl w-full sm:w-[90%] md:w-[80%] lg:w-[60%] flex flex-col md:flex-row justify-evenly items-center gap-8 md:gap-4"
          >
            <SchoolStatistics />
          </motion.div>
        </div>
      </section>
      {/* SCHOOL UNIFORMS */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white px-6 sm:px-8 md:px-12 py-6 md:py-8 rounded-3xl md:rounded-4xl shadow-xl w-full sm:w-[90%] md:w-[80%] lg:w-[90%] xl:w-[80%]"
          >
            <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold text-center">
              School Uniforms
            </h2>
            <p className="text-base md:text-lg text-justify leading-7 md:leading-10 mb-8">
              Our school uniforms are designed to promote a sense of unity and
              pride among our students. The distinct designs for Junior and
              Senior High School reflect their academic progression while
              maintaining our institution's tradition of excellence and
              professionalism.
            </p>

            <div className="flex flex-col gap-12">
              {/* Junior High School Uniforms */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-6">
                  Junior High School
                </h3>
                <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-200 pb-8">
                  <div className="flex-1">
                    <div className="flex justify-center">
                      <img
                        src="images/senior_design.png"
                        className="object-contain max-w-full h-auto"
                        alt="Junior High School Female Uniform"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Senior High School Uniforms */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-6">
                  Senior High School
                </h3>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex justify-center">
                      <img
                        src="images/junior_design.png"
                        className="object-contain max-w-full h-auto"
                        alt="Senior High School Female Uniform"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* EXCELLENCE */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex flex-col justify-center p-4 w-full md:w-1/2 lg:w-3/5 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white px-6 sm:px-8 md:px-12 py-6 md:py-8 rounded-3xl md:rounded-4xl shadow-xl"
            >
              <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold">
                Excellence in education across fields
              </h2>
              <p className="text-base md:text-lg text-justify">
                At our science high school, we strive to provide students with a
                dynamic and enriching learning environment that fosters
                curiosity, innovation, and critical thinking. Our focus on
                science and technology encourages students to explore new ideas,
                engage in hands-on discovery, and develop problem-solving skills
                that prepare them for the future. Beyond academics, we cultivate
                a culture of integrity, leadership, and resilience, ensuring
                that our students grow into well-rounded individuals ready to
                make meaningful contributions to society.
              </p>
            </motion.div>
          </div>
          <div className="flex justify-center items-center w-full md:w-1/2 lg:w-2/5 p-4 order-1 md:order-2 mb-6 md:mb-0">
            <img
              src="images/about_excellence.png"
              className="object-contain max-w-full h-auto"
              alt="Excellence in Education"
            />
          </div>
        </div>
      </section>
      {/* VISION */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32 flex items-center justify-center flex-col py-8 md:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-bold text-amber-100 text-center px-4">
          THE DEPED VISION
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center w-full px-4"
        >
          <img
            src="images/vision.png"
            className="object-contain w-full max-w-[750px] h-auto"
            alt="DepEd Vision"
          />
        </motion.div>
      </section>
      {/* MISSION */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32 flex items-center justify-center flex-col py-8 md:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-bold text-amber-100 text-center px-4">
          THE DEPED MISSION
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center w-full px-4"
        >
          <img
            src="images/mission.png"
            className="object-contain w-full max-w-[750px] h-auto"
            alt="DepEd Mission"
          />
        </motion.div>
      </section>
      {/* CORE VALUES */}
      <section className="min-h-[400px] md:min-h-[550px] lg:min-h-[650px] w-full my-16 md:my-24 lg:my-32 flex items-center justify-center flex-col py-8 md:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-bold text-amber-100 text-center px-4">
          OUR COURE VALUES
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center w-full px-4"
        >
          <img
            src="images/core_values.png"
            className="object-contain w-full max-w-[750px] h-auto"
            alt="Core values"
          />
        </motion.div>
      </section>
      ≈
    </div>
  );
}
