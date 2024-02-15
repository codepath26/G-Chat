import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useChatsContext } from "../../../context/ChatProvider";
import SearchUser from "../../UI/SearchUser";
import axios from "axios";
import UserBadgeItem from "../../UI/UserBadgeItem";

function BackDrop({ onCloseModel }) {
  return (
    <div
      className="h-screen w-screen bg-black opacity-50 fixed  z-40"
      onClick={onCloseModel}
    />
  );
}
const ModelOverlay = (props) => {
  const { user, chats, setChats } = useChatsContext();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [lodding, setLodding] = useState(false);
  const [alter2, setAlert2] = useState("");

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLodding(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/user?search=${search}`,
        {
          headers: {
            authentication: user.token,
          },
        }
      );
      console.log(data);
      setLodding(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeAlert = () => {
    setTimeout(() => {
      setAlert2("");
    }, 2000);
  };

  const handleGroup = (usersAdd) => {
    if (selectedUsers.includes(usersAdd)) {
      setAlert2("user already added");
      closeAlert();
      return;
    }
    setSelectedUsers([...selectedUsers, usersAdd]);
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setAlert2("Please fil all the details first");
      closeAlert();

      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        {
          headers: {
            authentication: user.token,
          },
        }
      );
      console.log(data);
      setChats([data, ...chats]);
      props.onCloseModel();
    } catch (error) {
      console.log(error);
    }
  };

  const handlerDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((data) => data._id !== delUser._id));
  };

  return (
    <div className="absolute min-h-[400px] rounded-md shadow-lg z-50 bg-white top-[50%] left-[50%] transition-transform -translate-x-[50%] -translate-y-[50%] pr-1 border rouded-xl p-2">
      <h1 className="bg-red-600 text-sm text-white text-center rounded-md">
        {alter2}
      </h1>
      <div className="w-full  relative p-2">
        <span
          className="absolute top-0 cursor-pointer  text-2xl right-3"
          onClick={props.onCloseModel}
        >
          <i className="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div className="m-3 border-b text-3xl">
        <h1>Create group Chat</h1>
      </div>
      <div className="p-2">
        <form>
          <input
            required
            type="text"
            className="border w-full  p-2 bg-gray-200 rounded-lg mb-3 outline-green-500 "
            value={groupChatName}
            placeholder="Enter the Group Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
        </form>
        <form>
          <input
            required
            className=" w-full p-2 bg-gray-200 rounded-lg mb-1  outline-green-500 "
            type="text"
            placeholder="Add user like: ram shyam and dhrasti"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="w-full flex flex-wrap">
        {selectedUsers.map((sel) => (
          <UserBadgeItem
            admin={user._id}
            user={sel}
            handlerFun={() => handlerDelete(sel)}
          />
        ))}
      </div>
      {lodding ? (
        <div>Loading...</div>
      ) : (
        searchResult
          ?.slice(0, 4)
          .map((user1) => (
            <SearchUser
              key={user1._id}
              user={user1}
              handler={() => handleGroup(user1)}
            />
          ))
      )}
      <div className="border text-center">
        <button
          className="bg-green-600 rounded-lg text-white px-2 py-1"
          onClick={handleSubmit}
        >
          {" "}
          Create Chat
        </button>
      </div>
    </div>
  );
};
const portalElement = document.getElementById("overlays");

function NewGroup({ onCloseModel }) {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onCloseModel={onCloseModel} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModelOverlay onCloseModel={onCloseModel} />,
        portalElement
      )}
    </>
  );
}

export default NewGroup;
