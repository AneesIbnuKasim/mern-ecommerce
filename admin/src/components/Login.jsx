import React from "react";
import { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); 
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="bg-white shadow-md max-w-md rounded-lg px-8 py-6">
        <h1 className="text-2xl text-center mb-4">Admin Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="min-w-72">
            <p className="text-sm font-medium py-3">Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none rounded-md border border-gray-700 w-full px-2 py-2"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="min-w-72">
            <p className="text-sm font-medium py-3">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none rounded-md border border-gray-700 w-full px-2 py-2"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>
          <button className="text-white px-5 py-2 mt-4 bg-black rounded-md w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
