import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../Config/Chatconfg";
import { useChatsContext } from "../../../context/ChatProvider";

function ScrollableChat({ messages }) {
  const { user } = useChatsContext();
  // console.log("this is the user bro", user);
  return (
    <ScrollableFeed className="w-full h-full">
      {messages &&
        messages.map((m, i) => {
          console.log(m.sender.name === user.name, "CHECKII");

          return (
            <div
              className={`flex  ${
                m.sender.name === user.name ? "justify-end" : "justify-start"
              } `}
              key={m._id}
            >
              <span
                className={` ${
                  m.sender.name === user.name ? "bg-blue-100" : "bg-green-400"
                }  flex gap-1 items-center px-2 py-1 mt-1 rounded-lg `}
              >
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <div className="w-[20px] rounded-full h-[20px]  ">
                    <img
                      src={m.sender.pic}
                      alt="user"
                      className="w-full rounded-full h-full object-cover"
                    />
                  </div>
                )}

                <span>{m.content}</span>
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
