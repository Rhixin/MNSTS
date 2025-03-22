"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store JWT token and user info in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
        })
      );

      // Redirect to dashboard or home page
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="flex-1 flex items-start justify-center flex-col w-full"
          >
            <span className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

            <span className="flex flex-col space-y-2 mt-3 w-full">
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>

            <div className="mt-4 w-full">
              <button
                type="submit"
                className="w-full bg-[#097444] text-white py-2 rounded-md hover:bg-[#28513c] transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
