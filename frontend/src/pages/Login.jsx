import React, { useContext, useEffect } from "react";
import Title from "../components/Title";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentState == "SignUp") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token',token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  //useffect to navigate to home page when logged in
  useEffect(()=>{
    if (token) {
      navigate('/');
    }
  },[token])
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-90% sm:max-w-96 gap-10 m-auto mt-14 items-center"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        {/* signup/login title depending on state */}
        <p className="sm:text-3xl prata-regular">{currentState}</p>
        <hr className="h-[1.5px] w-8 bg-gray-800 broder-none" />
      </div>
      {currentState === "SignUp" ? (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="border w-full py-1.5 px-3.5  "
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          required
        />
      ) : (
        ""
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        className="border w-full py-1.5 px-3.5 "
        type="text"
        name="email"
        id="email"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="border w-full py-1.5 px-3.5"
        type="password"
        name="password"
        id="password"
        placeholder="password"
        required
      />
      <div className="w-full flex justify-between">
        <Link to={"/password"}>
          <p className="cursor-pointer">Forgot your password</p>
        </Link>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("SignUp")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login to account
          </p>
        )}
      </div>
      <button
        className={`border py-2 px-4 rounded-lg ${
          currentState === "Login"
            ? "bg-black text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        {currentState === "Login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}

export default Login;
