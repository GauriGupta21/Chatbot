import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";
const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });
  const [userName, setUserName] = useState(""); // State for user name

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  console.log("location", location.state);
  useEffect(() => {
    if (location.state) {
      setUserName(location.state.name || "Guest"); // Fallback to 'Guest'
    } else {
      setUserName("Guest"); // Default value if no state is passed
    }
  }, [location.state]);
  if (!location?.state?.name) {
    navigate("/email");
  }
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
    const URL = `${backendURL}/api/password`;
    console.log("Constructed URL:", URL);

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: { userId: location?.state?._id, password: data.password },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log("response", response);
      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      console.log("error", error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto ">
        <div className="w-fit mx-auto mb-2">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name || "Default Name"}
            imageUrl={location?.state?.profile_pic || ""}
          />
          <h2 className=" font-semibold text-center text-lg mt-1">
            {location?.state?.name || "Default Name"}
          </h2>
        </div>
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-sec rounded mt-2 font-bold text-white">
            Login
          </button>
          <p className="my-2 text-center">
            <Link
              to={"/forgot-password"}
              className="hover:text-primary font-semibold"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
