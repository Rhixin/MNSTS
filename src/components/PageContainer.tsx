export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" text-black py-4 flex-grow">
      <div className="max-w-[1700px] px-12 mx-5 flex justify-between items-center">
        {children}
      </div>
    </div>
  );
}
