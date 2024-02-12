import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [sideBar, setSideBar] = useState(false);

  const sideBarHandler = () => {
    setSideBar(!sideBar);
  };

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
