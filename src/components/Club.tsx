export default function Club({
  clubName,
  description,
  officers,
  adviser,
  activities,
  image_path,
  logo_path,
}: {
  clubName: string;
  description: string;
  officers: string;
  adviser: string;
  activities: string;
  image_path: string;
  logo_path: string;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Image container - full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2">
        <div className="relative w-full h-64 sm:h-96 md:h-[540px] flex justify-center items-center overflow-hidden my-4">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover blur-xl"
            style={{ backgroundImage: `url(${image_path})` }}
          />

          {/* Sharp Foreground Image */}
          <img
            src={image_path}
            className="relative max-w-full max-h-full object-contain"
            alt={`${clubName} image`}
          />
        </div>
      </div>

      {/* Club info container - full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 p-4 md:p-8">
        {/* Logo and Club Name */}
        <div className="flex items-center my-4">
          <img
            src={logo_path}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full"
            alt={`${clubName} Logo`}
          />
          <h1 className="text-2xl md:text-4xl ml-4 text-black font-bold">{clubName}</h1>
        </div>

        {/* Club Information */}
        <div>
          <p className="text-justify text-sm md:text-base">{description}</p>
        </div>

        <div className="bg-gray-100 p-4 md:p-6 rounded-xl shadow-lg flex flex-col space-y-2 md:space-y-4 my-4">
          <p className="text-black text-lg md:text-xl font-semibold">
            Officers: <span className="font-normal text-base md:text-lg">{officers}</span>
          </p>
          <p className="text-black text-lg md:text-xl font-semibold">
            Adviser: <span className="font-normal text-base md:text-lg">{adviser}</span>
          </p>
          <p className="text-black text-lg md:text-xl font-semibold">
            Activities:{" "}
            <span className="font-normal text-base md:text-lg">{activities}</span>
          </p>
        </div>
      </div>
    </div>
  );
}