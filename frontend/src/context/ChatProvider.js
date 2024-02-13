import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // console.log("chat provider is called");
  const [selectedChat, setSelectedChat] = useState(false);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [sideBar, setSideBar] = useState(false);

  const sideBarHandler = () => {
    setSideBar(!sideBar);
  };
  console.log(selectedChat, "selected chat");

  return (
    <ChatContext.Provider
      value={{
        sideBar,
        sideBarHandler,
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatsContext = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
