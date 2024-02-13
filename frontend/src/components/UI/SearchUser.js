import React from 'react'

function SearchUser({ handler, user }) {
  return (
    <>
      <li
        onClick={() => handler(user._id)}
        className="w-full mt-2 px-3 py-2 rounded-lg flex items-center text-black hover:text-white bg-[#E8E8E8] hover:bg-[#38B2AC] mb-2 border-2"
        key={user._id}
      >
        <div className="mr-2 cursor-pointer bg-black w-[1.6rem] rounded-full">
          <img
            src={user.pic}
            alt={user.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3>{user.name}</h3>
          <p className="text-sm">
            <strong> Email : </strong> <span>{user.email}</span>
          </p>
        </div>
      </li>
    </>
  );
}

export default SearchUser;