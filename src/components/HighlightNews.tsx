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
      <div className="relative w-full h-[500px] flex justify-center items-center overflow-hidden rounded-lg">
        <img
          src={image_path}
          className="w-full h-full object-cover"
          alt={title}
        />
      </div>

      <h2 className="text-3xl font-bold mt-6 mb-2 text-gray-800 leading-tight">
        {title}
      </h2>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="font-medium">{date}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span>
          By <span className="font-medium">{author}</span>
        </span>
      </div>
      <p className="text-base text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
