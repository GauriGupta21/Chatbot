import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";

const SideBar = () => {
  const user = useSelector((state) => state?.user);
  const [editUser, setEditUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[300px,1fr] bg-white">
      <div className="w-12 h-full bg-slate-100 flex flex-col justify-between py-5 text-slate-600">
        <div className="flex flex-col items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded mt-2"
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUser(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded mt-2"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <RiLogoutBoxLine size={25} />
            </span>
          </button>
        </div>
      </div>
      <div className="z-10 w-[251px] left-[-251px] relative">
        <h2 className="text-xl font-bold p-4 text-slate-700">Message</h2>
        <div className=" h-[calc(100vh-65px)] overflow-hidden overflow-y-scroll scrollbar">
          {allUser.length === 0 && (
            <div className="mt-2">
              <div className="flex justify-center items-center my-4 text-slate-700">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-800">
                Explore user to start a conversation with.
              </p>
            </div>
          )}
          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {editUser && (
        <EditUserDetails onClose={() => setEditUser(false)} user={user} />
      )}
      {/** search user* */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default SideBar;
