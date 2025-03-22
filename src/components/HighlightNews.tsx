export default function HighlightNews({
  title,
  date,
  description,
  image_path,
  author,
}: {
  title: string;
  date: string;
  description: string;
  image_path: string;
  author: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-[300px] flex justify-center items-center overflow-hidden rounded-lg backdrop-blur-3xl">
        {/* Blurred Background */}
        <img
          src={image_path}
          className="absolute inset-0 w-full h-full object-cover blur-md"
          alt={`${title} background`}
          aria-hidden="true"
        />

        {/* Main Image */}
        <img
          src={image_path}
          className="relative z-10 max-w-full max-h-full object-contain"
          alt={title}
        />
      </div>

      {/* Title */}
      <h2
        className="font-bold mt-6 mb-2 text-gray-800 leading-tight text-wrap balance"
        style={{
          fontSize: `clamp(1.5rem, ${30 - title.length * 0.3}px, 3rem)`,
        }}
      >
        {title}
      </h2>

      {/* Metadata */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="font-medium">{date}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span>
          By <span className="font-medium">{author}</span>
        </span>
      </div>

      {/* Description with Scrollable Overflow */}
      <div className="text-base text-gray-700 leading-relaxed max-h-[220px] overflow-y-auto pr-2 text-justify">
        {description}
      </div>
    </div>
  );
}
