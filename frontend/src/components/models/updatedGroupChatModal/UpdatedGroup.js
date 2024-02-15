import React, { useState } from "react";
import { useChatsContext } from "../../../context/ChatProvider";
import ReactDOM from "react-dom";
import axios from "axios";
import UserBadgeItem from "../../UI/UserBadgeItem";
import SearchUser from "../../UI/SearchUser";

function BackDrop({ onCloseModel }) {
  return (
    <div
      className="h-screen w-screen bg-black opacity-50 fixed  z-40"
      onClick={onCloseModel}
    />
  );
}
const ModelOverlay = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  onCloseModel,
}) => {
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
    <div className="absolute rounded-md cursor-pointer shadow-lg z-50 bg-white top-[50%] left-[50%] transition-transform -translate-x-[50%] -translate-y-[50%] p-5 border rouded-xl">
      <span className="absolute top-1 right-4" onClick={onCloseModel}>
        <i className="fa-solid  fa-xmark text-2xl"></i>
      </span>
      <div className="flex mt-4">
        {selectedChat.users.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChat.groupAdmin}
            handlerFun={() => handleRemove(u)}
          />
        ))}
      </div>
      <div className="w-full border justify-between mt-3 gap-2 items-center flex flex-wrap">
        <input
          type="text"
          className="h-full outline-green-500  px-2 py-1 "
          value={groupChatName}
          placeholder="Change Group name"
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <button
          className=" h-full bg-green-500 font-bold text-white hover:text-black rounded-md  px-2 py-1"
          onClick={handleRename}
          isLoading={renameloading}
        >
          Update
        </button>
      </div>
      <div className="my-4">
        <input
          type="text"
          className="h-full w-full mb-1 outline-green-500  px-2 py-1 "
          placeholder="Add user to group"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <ul className="w-full">
        {loading ? (
          <p>Loadding...</p>
        ) : (
          searchResult?.map((user) => {
            console.log(user._id);
            return (
              <SearchUser handler={() => handleAddUser(user)} user={user} />
            );
          })
        )}
      </ul>
      <div className="flex justify-end">
        <button
          className="bg-red-600 text-white rounded-xl px-2 py-1 mt-3"
          onClick={() => handleRemove(user)}
        >
          Leave Group
        </button>
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
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onCloseModel={onCloseModel} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModelOverlay
          fetchMessages={fetchMessages}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onCloseModel={onCloseModel}
        />,
        portalElement
      )}
    </>
  );
}

export default UpdatedGroup;
