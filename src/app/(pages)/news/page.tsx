export default function News() {
  return (
    <div className="bg-white flex w-full max-h-[650px]">
      <div className="flex-3 border-amber-500 justify-center items-center p-4">
        <img src="images/school_image.png" className="w-[1100px] h-[400px]" />
      </div>
      <div className="flex-1 border-amber-500 p-4 overflow-y-auto">
        <div className="my-2">
          <img src="images/school_image.png" className="w-[180px] h-[150px]" />
        </div>
        <div className="my-2">
          <img src="images/school_image.png" className="w-[180px] h-[150px]" />
        </div>
        <div className="my-2">
          <img src="images/school_image.png" className="w-[180px] h-[150px]" />
        </div>
        <div className="my-2">
          <img src="images/school_image.png" className="w-[180px] h-[150px]" />
        </div>
        <div className="my-2">
          <img src="images/school_image.png" className="w-[180px] h-[150px]" />
        </div>
      </div>
    </div>
  );
}
