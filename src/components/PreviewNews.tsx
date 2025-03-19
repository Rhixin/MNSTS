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
    <div className="flex p-3 border-b border-gray-100 hover:bg-gray-50">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
        {/* Image with proper sizing */}
        <img
          src={image_path}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}