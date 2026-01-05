import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { onLogin } from "../redux/slices/AuthSlice";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const loginUser = (e) => {
    e.preventDefault();
    dispatch(onLogin(input));
    navigate("/dashboard");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8 tracking-wide">
          Login
        </h1>

        <form onSubmit={loginUser} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={input.email}
              onChange={handleInput}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-gray-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={input.password}
              onChange={handleInput}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-gray-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-gray-100 font-semibold text-lg bg-gray-600 hover:bg-gray-500 transition-shadow shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-gray-200 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
