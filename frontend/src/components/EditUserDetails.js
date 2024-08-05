import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import Divider from "./Divider";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.user,
    profile_pic: user?.profile_pic,
  });

  const uploadPhotoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setData((preve) => ({
      ...preve,
      ...user,
    }));
  }, [user]);

  console.log("edit", user);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log("uploadPhoto", uploadPhoto);

    setData((preve) => ({
      ...preve,
      profile_pic: uploadPhoto?.url,
    }));
  };
  console.log(
    "Data being sent:",
    JSON.stringify(data, (key, value) => {
      if (key === "socketConnection") {
        return undefined; // Avoid serializing the socket object
      }
      return value;
    })
  );

  const handleSubmit = async (e) => {
    const filteredData = {
      name: data.name,
      profile_pic: data.profile_pic,
    };
    e.preventDefault();
    e.stopPropagation();
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      console.log("Backend URL:", backendURL);
      const URL = `${backendURL}/api/update`;
      const response = await axios({
        method: "post",
        url: URL,
        data: filteredData,
        withCredentials: true,
      });
      console.log("response", response);

      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
      console.log("response", response);
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  return (
    <div className="flex top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 justify-center items-center fixed z-20">
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Edit User Details</h2>
        <p className="text-sm">Update your profile information below.</p>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div>Photo</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex gap-2 w-fit ml-auto">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded"
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-primary bg-primary text-white border px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
