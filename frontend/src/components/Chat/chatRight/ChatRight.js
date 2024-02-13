import React, { useEffect, useState } from "react";
import { useChatsContext } from "../../../context/ChatProvider";

import UpdatedGroup from "../../models/updatedGroupChatModal/UpdatedGroup";

import io from "socket.io-client";
import axios from "axios";

const ENDPOINT = process.env.REACT_APP_API_URL;
let socket, selectedChatCompare;

function ChatRight({ fetchAgain, setFetchAgain }) {
  const [groupModel, setGroupModel] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useChatsContext();
  console.log(selectedChat, "this is the selected chat");

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/message/${selectedChat._id}`,
        {
          headers: {
            authentication: user.token,
          },
        }
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = axios.post(
          `${process.env.REACT_APP_API_URL}/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          {
            headers: {
              authentication: user.token,
            },
          }
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setMessages(e.traget.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lasttypeingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lasttypeingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const backToMyChats = () => {
    console.log(selectedChat);
    setSelectedChat(false);
  };
  const onCloseModel = () => {
    setGroupModel(false);
  };
  return (
    <>
      {groupModel && (
        <UpdatedGroup
          fetchMessages={fetchMessage}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onCloseModel={onCloseModel}
        />
      )}
      <div
        className={`w-full flex flex-col md:w-[70%] h-full  p-2 ${
          selectedChat ? "block" : "hidden"
        } md:block `}
      >
        <div
          className={`  h-full relative  border border-gray-200    p-2 mb-2   rounded-lg `}
        >
          <div className="flex border hover:shadow-md border-gray-200 w-full min-h-[5%] items-center p-2 justify-between">
            <div className="ps-3">
              <i
                onClick={backToMyChats}
                className=" md:hidden block fa-regular fa-circle-left text-2xl"
              ></i>
            </div>
            <h1>
              {/* {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal */}
            </h1>
            <div>
              <i
                onClick={() => setGroupModel(true)}
                className="fa-solid fa-eye"
              ></i>
            </div>
          </div>
          <div className="p-3  h-[90%]">
            <div className="w-full h-full bg-gray-200 rounded-xl">chat box</div>
            <div
              className="w-full absolute bottom-0 left-0   pe-2 rounded-xl"
              onKeyDown={sendMessage}
            >
              <input
                type="text"
                className="border outline-green-500 w-full p-2"
                placeholder="type something"
                onChange={typingHandler}
                value={newMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatRight;
