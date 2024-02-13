import React, { useCallback, useState } from "react";
import { useChatsContext } from "../../context/ChatProvider";
import axios from "axios";
import SearchUser from "../UI/SearchUser";

function SidebarMenu() {
  const { sideBar, setChats, sideBarHandler, chats, setSelectedChat } =
    useChatsContext();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData.token;
  // console.log(userData.token);

  const submitHandler = useCallback(async () => {
    console.log("search is called");

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user?search=${search}`,
      {
        headers: {
          authentication: token,
        },
      }
    );
    // console.log(response.data);
    setSearchResult(response.data);
    setSearch("");
  }, [search, token]);

  const getChats = async (userId) => {
    console.log(userId, "userid");
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/chat/${userId}`,
      {
        headers: {
          authentication: token,
        },
      }
    );
    console.log(response.data, "response data");
    console.log(chats);
    // let d = chats.forEach((c) => {
    // console.log(` ${c._id} `);
    // });
    if (!chats.find((c) => c._id === response.data._id)) {
      console.log("inside the setting the chat");
      setChats([response.data, ...chats]);
    }
    console.log("new chat created", chats);
    setSelectedChat(response.data.users);
    sideBarHandler();
    setSearchResult([]);
  };

  return (
    <div
      className={`${
        sideBar ? "translate-x-0" : "-translate-x-[500px]"
      } transition-all duration-500 ease-in-out absolute top-0 left-0   w-[19em]  h-screen p-3 bg-white border-r shadow-md rounded-[10px] z-20`}
    >
      <div className="relative  p-3">
        <h1 className="font-bold text-xl">Search Users</h1>
        <span className="absolute top-2 right-0" onClick={sideBarHandler}>
          <i className="fa-solid fa-xmark text-2xl"></i>
        </span>
      </div>
      <div className="border  flex justify-between mt-2 ">
        <input
          type="text"
          className="text-sm h-full w-[90%] p-1 outline-none font-thin"
          required
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={submitHandler} className="me-1 text-xl">
          <i className="fa-solid fa-circle-right"></i>
        </button>
      </div>
      <ul className="w-full">
        {searchResult.map((user) => {
          console.log(user._id);
          return <SearchUser handler={getChats} user={user} />;
        })}
      </ul>
    </div>
  );
}

export default SidebarMenu;
