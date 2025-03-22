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
    <div className="flex flex-col md:flex-row w-full">
      {/* Image Section - Full width on mobile, half width on medium screens and up */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md h-64 sm:h-80 md:h-96 flex justify-center items-center overflow-hidden rounded-lg">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover blur-xl opacity-70"
            style={{ backgroundImage: `url(${image_path})` }}
          />

          {/* Sharp Foreground Image */}
          <img
            src={image_path}
            alt={title}
            className="relative max-w-full max-h-full object-contain z-10"
          />
        </div>
      </div>

      {/* Content Section - Full width on mobile, half width on medium screens and up */}
      <div className="w-full md:w-1/2 flex flex-col p-4 md:p-6">
        {/* Headline */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold">{title}</h1>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm sm:text-base md:text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
}