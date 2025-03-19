export default function Announcement({
  headline,
  date,
}: {
  headline: string;
  date: string;
}) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-semibold">{headline}</h2>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
}
