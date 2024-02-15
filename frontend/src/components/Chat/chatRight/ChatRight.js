import React, { useEffect, useState } from "react";
import { useChatsContext } from "../../../context/ChatProvider";

import UpdatedGroup from "../../models/updatedGroupChatModal/UpdatedGroup";
import Lottie from "react-lottie";

import io from "socket.io-client";
import axios from "axios";
import { getSender } from "../../Config/Chatconfg";
import ScrollableChat from "./ScrollableChat";
import animationData from "../../../nimation/Typing.json";

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
  const {
    selectedChat,
    setUser,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = useChatsContext();
  // console.log(selectedChat, "this is the selected chat");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessage = async () => {
    console.log("fetchemendssage is  called");
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
        // console.log("this is the selected chatid", selectedChat);
        const { data } = await axios.post(
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
        // console.log(data, "message");
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    // console.log(userData, "this is useeffect");
    setUser(userData);

    if (userData) {
      // console.log("we are inside");
      socket = io(ENDPOINT);
      // console.log("suser", user);
      // console.log(userData);
      socket.emit("setup", userData);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    console.log("notification is called");
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
    // console.log("typing handler is called");
    setNewMessage(e.target.value);

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
    // console.log(selectedChat);
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
        {selectedChat ? (
          <div
            className={`  h-full relative  border border-gray-200    p-2 mb-2   rounded-lg `}
          >
            <div className="flex border  border-gray-200 w-full min-h-[5%] items-center p-2 justify-between z-0">
              <div className="ps-3">
                <i
                  onClick={backToMyChats}
                  className=" md:hidden block fa-regular fa-circle-left text-2xl"
                ></i>
              </div>
              <h1>
                {console.log("this is the message which fetched", messages)}
                {messages &&
                  (!selectedChat?.isGroupChat
                    ? getSender(user, selectedChat?.users)
                    : selectedChat.chatName.toUpperCase())}
              </h1>
              <div>
                <i
                  onClick={() => setGroupModel(true)}
                  className="fa-solid cursor-pointer fa-eye"
                ></i>
              </div>
            </div>
            <div className="p-3  h-[90%]">
              <div className="w-full h-full flex flex-col overflow-y-hidden bg-gray-200 rounded-xl">
                {loading ? (
                  <p>Loding...</p>
                ) : (
                  <div className="flex p-2 flex-col overflow-y-scroll h-full w-full  scrollbar-none ">
                    <ScrollableChat messages={messages} />
                  </div>
                )}
              </div>
              <div
                className="w-full absolute bottom-0 left-0   pe-2 rounded-xl"
                onKeyDown={sendMessage}
              >
                {" "}
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
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
        ) : (
          <div className="flex border border-red-400  justify-center items-center h-full">
            <div className="text-3xl pb-3 ">
              Click on a user to start chatting
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChatRight;
