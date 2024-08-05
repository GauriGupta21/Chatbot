import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPages = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
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
  const handleUploadPhoto = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log("uploadPhoto", uploadPhoto);

    setUploadPhoto(file);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  //   console.log("uploadPhoto", uploadPhoto);
  const handleClearUploadPic = (e) => {
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    console.log("Backend URL:", backendURL);
    const URL = `${backendURL}/api/register`;
    console.log("Constructed URL:", URL);
    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
          // Include any other required headers here
        },
      });
      console.log("response", response);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error", error);
    }
    console.log("data", data);
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto ">
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="paasword"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipis line-clamp-1">
                  {uploadPhoto ? uploadPhoto.name : "Upload photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPic}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              onChange={handleUploadPhoto}
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-sec rounded mt-2 font-bold text-white">
            Register
          </button>
          <p className="my-2 text-center">
            Already have account?{" "}
            <Link to={"/email"} className="hover:text-primary font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPages;
