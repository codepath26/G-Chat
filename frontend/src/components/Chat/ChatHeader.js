import React, { useState } from "react";
import { useChatsContext } from "../../context/ChatProvider";
import Profile from "../models/profileModel/Profile";

function ChatHeader() {
  const [dropDown, setDropDown] = useState(false);
  const { user } = useChatsContext();
  const [OpenModel, setOpenModel] = useState(false);
  const { sideBarHandler } = useChatsContext();
  // console.log(user);
  // console.log(user);

  const onCloseModel = () => {
    setOpenModel(false);
  };
  const logoutHandler = () => {
    console.log("logout handler called");
  };
  const dropDownHandler = () => {
    setDropDown(!dropDown);
    setTimeout(() => {
      setDropDown(false);
    }, 2000);
  };

  const sidebarHandler = () => {
    console.log("sidebar called");
    sideBarHandler(true);
  };
  return (
    <header className="sticky top-0 w-full p-1 border-b shadow-md">
      <div className="flex sm:flex-row flex-col flex-wrap justify-center   items-center">
        <div className="sm:w-[30%] w-full text-center  sm:text-start mb-3 md:mb-0">
          <button
            onClick={sidebarHandler}
            className="border border-gray-200 px-2  cursor-pointer rounded-md "
          >
            <i className="text-green-600 fa-solid fa-magnifying-glass me-4"></i>
            Search User
          </button>
        </div>
        <div className="sm:w-[30%] w-full   font-bold  text-lg text-green-600 text-center">
          <h1>Welcome To G-Chat</h1>
        </div>
        <div className="sm:w-[30%] w-full  flex sm:justify-end justify-center mt-4 sm:mt-0">
          <div className="flex gap-3  shadow-sm hover:shadow-lg p-1 items-center">
            <div className="me-2">
              <i className="fa-solid fa-bell hover:show"></i>
            </div>

            <div className="relative flex items-center gap-1">
              <div className="w-[30px] rounded-full h-[30px] p-0 ">
                <img
                  src={user?.pic}
                  alt="user"
                  className="w-full rounded-full h-full object-cover"
                />
              </div>
              <i
                onClick={dropDownHandler}
                className={`fa-solid fa-chevron-${dropDown ? "up" : "down"}`}
              ></i>
              <div
                className={`${
                  dropDown ? "" : "hidden"
                } absolute top-10 py-2 px-4  right-0 transition-all duration-300 flex flex-col bg-white rounded-[1rem] border border-gray-100 shadow-sm w-[10em]`}
              >
                <div className="border-b w-full cursor-pointer hover:text-green-700 mb-1">
                  <button onClick={() => setOpenModel(true)} className="w-full">
                    My Profile
                  </button>
                </div>
                {OpenModel && <Profile onCloseModel={onCloseModel} />}
                <div className="border-b cursor-pointer hover:text-green-700 mb-1">
                  <button className="w-full" onClick={logoutHandler}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
