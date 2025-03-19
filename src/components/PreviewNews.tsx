export default function PreviewNews({
  title,
  date,
  image_path,
  onClick,
}: {
  title: string;
  date: string;
  image_path: string;
  onClick: () => void;
}) {
  return (
    <div
      className="flex my-4 cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <div className="relative w-[180px] h-[140px] flex justify-center items-center overflow-hidden flex-1">
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
      <div className="items-center px-4 flex-1">
        <h2 className="text-m font-bold mt-4">{title}</h2>
        <h4 className="text-xs text-gray-600">{date}</h4>
      </div>
    </div>
  );
}
