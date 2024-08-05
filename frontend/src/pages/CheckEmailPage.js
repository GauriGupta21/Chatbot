import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";
const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    console.log("Backend URL:", backendURL);
    const URL = `${backendURL}/api/email`;
    console.log("Constructed URL:", URL);
    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
          // Include any other required headers here
        },
      });
      // console.log("response", response);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response?.data?.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error", error);
    }
    // console.log("data", data);
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto ">
        <div className="w-fit mx-auto mb--2">
          <FaRegUserCircle size={70} />
        </div>
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-sec rounded mt-2 font-bold text-white">
            Let's Go
          </button>
          <p className="my-2 text-center">
            New User{" "}
            <Link to={"/email"} className="hover:text-primary font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckEmailPage;
