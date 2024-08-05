import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { ImCross } from "react-icons/im";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const URL = `${backendURL}/api/search`;

    if (!search) {
      setSearchUser([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(URL, { search });
      setLoading(false);

      if (response.data.success) {
        setSearchUser(response.data.data); // Assuming this is an array
      } else {
        setSearchUser([]);
        toast.error(response.data.message || "No users found");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Error searching user");
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log("Search term:", search);
  console.log("Search results:", searchUser);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-slate-700 bg-opacity-40 p-2">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search the user by name or email"
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={20} />
          </div>
        </div>
        <div className="bg-white mt-2 w-full p-4 rounded">
          {loading && (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          )}
          {!loading && searchUser.length === 0 && search && (
            <p className="text-center text-slate-600">No user found!</p>
          )}
          {!loading &&
            searchUser.length !== 0 &&
            searchUser.map((user) => {
              return <UserCard key={user._id} user={user} onClose={onClose} />;
            })}
        </div>
      </div>
      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-3xl hover:text-primary"
        onClick={onClose}
      >
        <button>
          <ImCross size={25} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
