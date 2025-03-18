export default function HighlightNews({
  title,
  date,
  description,
  image_path,
}: {
  title: string;
  date: string;
  description: string;
  image_path: string;
}) {
  return (
    <>
      <div className="relative w-[1100px] h-[400px] flex justify-center items-center overflow-hidden">
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

      <h2 className="text-2xl font-bold mt-4">{title}</h2>
      <h4 className="text-lg text-gray-600">{date}</h4>
      <p className="text-lg">{description}</p>
    </>
  );
}
