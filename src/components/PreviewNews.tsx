export default function PreviewNews({
  title,
  date,
  image_path,
}: {
  title: string;
  date: string;
  image_path: string;
}) {
  return (
    <div className="flex">
      <div className="relative w-[180px] h-[140px] flex justify-center items-center overflow-hidden">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-center bg-cover blur-xl"
          style={{ backgroundImage: `url(${image_path})` }}
        />

        {/* Sharp Foreground Image */}
        <img
          src="images/school_image.png"
          className="relative max-w-full max-h-full object-contain"
        />
      </div>
      <div className="items-center px-4">
        <h2 className="text-m font-bold mt-4">{title}</h2>
        <h4 className="text-xs text-gray-600">{date}</h4>
      </div>
    </div>
  );
}
