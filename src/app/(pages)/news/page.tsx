import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

export default function News() {
  return (
    <div className="bg-white flex w-full max-h-[650px] rounded-xl">
      <div className="flex-3  justify-center items-center p-4">
        <HighlightNews
          title="Sci-Tech Wins Again"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Vestibulum nec felis eget sapien auctor dapibus. Integer vel
          lectus at nulla convallis dictum. Mauris vel risus at enim pharetra
          consectetur. Donec vitae ligula ut odio tincidunt tempor. Proin non
          velit ut elit vestibulum pharetra."
          date="March 18, 2025"
          image_path="images/school_image.png"
        ></HighlightNews>
      </div>
      <div className="relative flex-1 overflow-y-auto">
        <div className="">
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
          <PreviewNews
            title="Robotics Champion"
            date="March 2, 2024"
            image_path="images/school_image.png"
          />
        </div>

        {/* Bottom Fade Effect */}
        <div className="sticky bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
