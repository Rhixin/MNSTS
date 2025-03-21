export default function Achievement({
  title,
  description,
  image_path,
}: {
  title: string;
  description: string;
  image_path: string;
}) {
  return (
    <>
      <div className="flex-1 flex-col items-center justify-center flex">
        <div className="relative w-[520px] h-[400px] flex justify-center items-center overflow-hidden my-4">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover blur-xl"
            style={{ backgroundImage: `url(${image_path})` }}
          />

          {/* Sharp Foreground Image */}
          <img
            src={image_path}
            className="relative max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <div className="flex-1 flex-col flex p-8">
        {/* Headliine */}
        <div className="flex items-center my-4">
          <h1 className="text-4xl text-black font-bold">{title}</h1>
        </div>

        {/* Description */}
        <div>
          <p className="text-justify">{description}</p>
        </div>
      </div>
    </>
  );
}
