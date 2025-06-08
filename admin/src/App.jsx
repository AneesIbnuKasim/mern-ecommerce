import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminChat from "./pages/AdminChat";
import { ToastContainer } from "react-toastify";

export const backendUrl = 	"http://localhost:3001"; 
/*import.meta.env.VITE_BACKEND_URL*/ 
export const currency = "$";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="bg-gray-200">
      <ToastContainer autoClose={1000} />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex w-full">
          <Sidebar />
            <div className="flex-1 p-12">
            
          <Routes>
            <Route path="/add" element={<Add token={token} />}></Route>
            <Route path="/list" element={<List token={token} />}></Route>
            <Route path="/orders" element={<Orders token={token} />}></Route>
            <Route path="/messages" element={<AdminChat token={token} />}></Route>

          </Routes>
            </div>
           
          </div>
          
        </>
      )}
    </div>
  );
}

export default App;
