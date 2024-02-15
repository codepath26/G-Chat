import React from "react";
import ReactDOM from "react-dom";
import { useChatsContext } from "../../../context/ChatProvider";

function BackDrop({ onCloseModel }) {
  return (
    <div
      className="h-screen w-screen bg-black opacity-50 fixed  z-40"
      onClick={onCloseModel}
    />
  );
}
const ModelOverlay = (props) => {
  const { user } = useChatsContext();
  return (
    <div className="absolute rounded-md cursor-pointer shadow-lg z-50 bg-white top-[50%] left-[50%] transition-transform -translate-x-[50%] -translate-y-[50%] p-5 border rouded-xl">
      <div className="w-full  relative flex justify-center items-center flex-col">
        <div className="w-[100px] shadow-md h-[100px] rounded-full">
          <img
            src={user.pic}
            alt="profile"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <span className="absolute top-0 right-0" onClick={props.onCloseModel}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h1 className="text-xl my-5">
          {" "}
          Name: <span>{user.name}</span>{" "}
        </h1>
      </div>
      <div className="w-full mt-4 p-1 border-b ps-3">
        Email : <span>{user.email}</span>
      </div>
    </div>
  );
};
const portalElement = document.getElementById("overlays");

function Profile({ onCloseModel }) {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onCloseModel={onCloseModel} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModelOverlay onCloseModel={onCloseModel} />,
        portalElement
      )}
    </>
  );
}

export default Profile;
