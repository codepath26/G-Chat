import React, { useEffect, useState } from "react";
import { useChatsContext } from "../../context/ChatProvider";
import ChatHeader from "./ChatHeader";
import ChatRight from "./ChatRight";
import ChatLeft from "./ChatLeft";
import SidebarMenu from "../SidebarMenu/SidebarMenu";

function Chat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { setUser } = useChatsContext();
  useEffect(() => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    console.log(userData, "this is useeffect");
    setUser(userData);
  }, [setUser]);
  return (
    <>
      <SidebarMenu />
      <div className="w-full md:h-screen md:w-screen">
        <ChatHeader />
        <div className="flex w-full md:h-full md:flex-row  border border-orange-500 flex-col flex-wrap p-5">
          <ChatLeft fetchAgain={{ fetchAgain }} />
          <ChatRight fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </>
  );
}

export default Chat;
