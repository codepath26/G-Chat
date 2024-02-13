import React, { useEffect, useState } from "react";
import { useChatsContext } from "../../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../../Config/Chatconfg";
import NewGroup from "../../models/newgroup/NewGroupModel";

function ChatLeft({ fetchAgain }) {
  // console.log("chat left is called");
  const [loggeduser, setLoggeduser] = useState();
  const [isNewGroup, setIsNewGroup] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const { selectedChat, chats, setChats, setSelectedChat, setUser } =
    useChatsContext();

  // console.log(user);

  // console.log(selectedChat, "this is the chagts");
  const onCloseModel = () => {
    setIsNewGroup(false);
  };
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authentication: userData.token,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat`,
        config
      );
      // console.log("this");
      console.log(response.data);
      setChats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log("chat left useeffect is called");
    setUser(userData);
    setLoggeduser(userData);
    fetchChats();
  }, []);

  return (
    <>
      {isNewGroup && <NewGroup onCloseModel={onCloseModel} />}
      <div
        className={`w-full md:w-[30%]  h-full border-red-600 p-2 ${
          selectedChat ? "hidden" : "block"
        } md:block  `}
      >
        <div
          className={` border-2 w-full h-full  border-gray-300 rounded-lg  `}
        >
          <div className="flex border-b border-gray-200 justify-between items-center">
            <div className="w-1/2 text-center">
              <h1>My Chats</h1>
            </div>
            <div className="w-1/2 p-2 text-sm flex justify-end ">
              <button
                onClick={() => setIsNewGroup(true)}
                className="bg-gray-200 p-1 rounded-lg hover:shadow-md transition-all duration-300"
              >
                New Group Chat <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <ul className="flex flex-col  p-3 w-full h-full  rounded-lg overflow-y-hidden">
            {chats ? (
              <div className="overflow-y-auto">
                {chats.map((chat) => {
                  // console.log("this is the chat", chat);

                  return (
                    <li
                      onClick={() => setSelectedChat(chat)}
                      className={`${
                        selectedChat === chat
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-black"
                      }  px-3 py-2 rounded-lg cursor-pointer border mt-1`}
                      key={chat._id}
                    >
                      <h1>
                        {!chat.isGroupChat
                          ? getSender(loggeduser, chat.users)
                          : chat.chatName}
                      </h1>
                      {chat.latestMessage && (
                        <p>
                          <strong>{chat.latestMessage.sender.name} : </strong>
                          {chat.latestMessage.content.lenght > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </p>
                      )}
                    </li>
                  );
                })}
              </div>
            ) : (
              <p>Lodding...</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ChatLeft;
