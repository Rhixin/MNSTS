export default function Login() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen text-black">
      <div className="max-w-[1000px] m-12 min-h-[500px] container rounded-4xl flex flex-row">
        {/* LEFT CONTAINER */}
        <div className="flex-1 flex justify-center items-center rounded-l-2xl bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(13,222,128)] shadow-2xl">
          <img
            src="images/MNSTS_logo.jpg"
            className="w-84 rounded-full"
            alt="MNSTS Logo"
          />
        </div>

        {/* RIGHT CONTAINER */}
        <div className="flex-1 flex justify-center rounded-r-2xl bg-white flex-col p-8">
          <div className="">
            <h1 className="text-3xl">Admin</h1>
          </div>

          <div className="flex-1 flex items-start justify-center  flex-col">
            <span className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </span>

            <span className="flex flex-col space-y-2 mt-3 w-full">
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none "
                required
              />
            </span>

            <div className="mt-4 w-full">
              <button className="w-full bg-[#097444]  text-white py-2 rounded-md hover:bg-[#28513c] transition hover:cursor-pointer">
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
