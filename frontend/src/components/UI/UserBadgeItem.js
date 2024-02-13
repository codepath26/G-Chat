import React from "react";

function UserBadgeItem({ admin, user, handlerFun }) {
  return (
    <div
      className="px-2 py-1 rounded-lg m-1 mb-2 bg-green-500 text-sm cursor-pointer"
      onClick={handlerFun}
    >
      {user.name}
      {admin === user._id && <span>(Admin)</span>}
      <i className="fa-solid fa-xmark"></i>
    </div>
  );
}

export default UserBadgeItem;
