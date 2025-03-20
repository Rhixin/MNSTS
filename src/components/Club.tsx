export default function Club({
  clubName,
  description,
  president,
  adviser,
  activities,
  projects,
  image_path,
  logo_path,
}: {
  clubName: string;
  description: string;
  president: string;
  adviser: string;
  activities: string;
  projects: string;
  image_path: string;
  logo_path: string;
}) {
  return (
    <div className="flex-row flex">
      <div className="flex-1 flex-col">
        <div className="relative w-[720px] h-[540px] flex justify-center items-center overflow-hidden my-4">
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
        {/* Logo and Club Name */}
        <div className="flex items-center my-4">
          <img
            src={logo_path}
            className="w-16 h-16 rounded-full"
            alt="MNSTS Logo"
          />
          <h1 className="text-4xl ml-4 text-black font-bold">{clubName}</h1>
        </div>

        {/* Club Information */}

        <div>
          <p className="text-justify">{description}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-lg flex flex-col space-y-4 my-4">
          <p className="text-black text-xl font-semibold">
            President: <span className="font-normal text-lg">{president}</span>
          </p>
          <p className="text-black text-xl font-semibold">
            Adviser: <span className="font-normal text-lg">{adviser}</span>
          </p>
          <p className="text-black text-xl font-semibold">
            Activities:{" "}
            <span className="font-normal text-lg">{activities}</span>
          </p>
          <p className="text-black text-xl font-semibold">
            Projects Implemented:{" "}
            <span className="font-normal text-lg">{projects}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
