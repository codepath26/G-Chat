import React, { useCallback, useEffect, useState } from "react";
import { useChatsContext } from "../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../Config/Chatconfg";

function ChatLeft({ fetchAgain }) {
  const [loggeduser, setLoggeduser] = useState();

  const { selectedChat, chats, setChats, setSelectedChat } = useChatsContext();
  console.log(selectedChat, "this is the chagts");

  const fetchChats = useCallback(async () => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    try {
      const config = {
        headers: {
          authentication: userData.token,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat`,
        config
      );
      setChats(data);
      setLoggeduser(userData);
    } catch (error) {
      console.log(error);
    }
  }, [setChats]);

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="w-full border-2 border-gray-300 md:w-[30%] rounded-lg">
      <div className="flex border-b border-gray-200 justify-between items-center">
        <div className="w-1/2 text-center">
          <h1>My Chats</h1>
        </div>
        <div className="w-1/2 p-2 text-sm flex justify-end ">
          <button className="bg-gray-200 p-1 rounded-lg hover:shadow-md transition-all duration-300">
            New Group Chat <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <ul className="flex flex-col  p-3 w-full h-full  rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-auto border border-red-600">
            {chats.map((chat) => {
              console.log("this is the chat", chat);

              return (
                <li
                  onClick={() => setSelectedChat(chat)}
                  className={`${
                    selectedChat === chat
                      ? "bg-green-500 text-white"
                      : "bg-white text-black"
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
                        ? chat.latestMessage.content.substring(0, 51) + "..."
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
  );
}

export default ChatLeft;
