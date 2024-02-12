import React from "react";

function ChatRight() {
  return (
    <div className="w-full md: border border-red-700 h-full flex flex-wrap  md:flex-col   md:w-[70%] rounded-lg">
      <div className="flex border w-full h-[10%] border-black p-2 justify-between">
        <h1>Parth</h1>
        <div>
          <i className="fa-solid fa-eye"></i>
        </div>
      </div>
      <div className="p-2 border h-[90%]">
        <dir className="w-full h-full bg-gray-600">chat box</dir>
      </div>
    </div>
  );
}

export default ChatRight;
