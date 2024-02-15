import React from "react";
import { getSender } from "../../../Config/Chatconfg";
import { useChatsContext } from "../../../../context/ChatProvider";

function Notification({ notification }) {
  const { setNotification, setSelectedChat, user } = useChatsContext();
  return (
    <div className="absolute top-5 p-2 rounded-lg border border-green-500 bg-white flex min-w-[300px] flex-col gap-2 right-0 pl-3">
      {notification.length === 0 && `NO New Message`}
      {notification.map((notif) => (
        <li
          key={notif._id}
          className="cursor-pointer hover:border-b hover:border-green-500 list-none"
          onClick={() => {
            setSelectedChat(notif.chat);
            setNotification(notification.filter((n) => n !== notif));
          }}
        >
          {notif.chat.isGroupChat
            ? `New Message in  ${notif.chat.chatName}  `
            : `New message from  ${getSender(user, notif.chat.users)} `}
        </li>
      ))}
    </div>
  );
}

export default Notification;
