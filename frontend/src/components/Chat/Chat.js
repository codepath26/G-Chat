import React, { useEffect, useState } from "react";
import { useChatsContext } from "../../context/ChatProvider";
import ChatHeader from "./chatHeader/ChatHeader";
import ChatRight from "./chatRight/ChatRight";
import ChatLeft from "./chatLeft/ChatLeft";
import SidebarMenu from "../SidebarMenu/SidebarMenu";

function Chat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { setUser } = useChatsContext();
  useEffect(() => {
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    // console.log(userData, "this is useeffect");
    setUser(userData);
  }, [setUser]);
  return (
    <>
      <SidebarMenu />
      <div className="w-full h-[100vh] overflow-hidden  border border-green-800   md:w-screen">
        <ChatHeader />
        <div className="flex w-full md:h-[93%] h-[80%]    flex-wrap  ">
          <ChatLeft fetchAgain={{ fetchAgain }} />
          <ChatRight fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </>
  );
}

export default Chat;
