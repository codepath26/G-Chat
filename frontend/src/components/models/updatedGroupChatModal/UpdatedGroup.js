import React, { useState } from "react";
import { useChatsContext } from "../../../context/ChatProvider";
import ReactDOM from "react-dom";
import axios from "axios";

function BackDrop({ onCloseModel }) {
  return (
    <div
      className="h-screen w-screen bg-black opacity-50 fixed  z-10"
      onClick={onCloseModel}
    />
  );
}
const ModelOverlay = (props) => {
  const { user } = useChatsContext();
  return (
    <div className="absolute rounded-md shadow-lg z-50 bg-white top-[50%] left-[50%] transition-transform -translate-x-[50%] -translate-y-[50%] p-5 border rouded-xl">
      <div className="w-full  relative flex justify-center items-center flex-col">
        <div className="w-[100px] shadow-md h-[100px] rounded-full">
          <img
            src={user.pic}
            alt="profile"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <span className="absolute top-0 right-0" onClick={props.onCloseModel}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h1 className="text-xl my-5">
          {" "}
          Name: <span>{user.name}</span>{" "}
        </h1>
      </div>
      <div className="w-full mt-4 p-1 border-b ps-3">
        Email : <span>{user.email}</span>
      </div>
    </div>
  );
};
const portalElement = document.getElementById("overlays");

function UpdatedGroup({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  onCloseModel,
}) {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = useChatsContext();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/user?search=${search}`,
        {
          headers: {
            authentication: user.token,
          },
        }
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            authentication: user.token,
          },
        }
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            authentication: user.token,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            authentication: user.token,
          },
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    setGroupChatName("");
  };

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

export default UpdatedGroup;
