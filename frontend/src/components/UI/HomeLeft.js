import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
function HomeLeft({ imgurl }) {
  return (
    <>
      <div className="md:w-1/2 w-full bg-gray-900 text-white  flex-col  flex items-center  p-2 ">
        <div className="  ">
          <LazyLoadImage
            effect="blur"
            className=" transition-all duration-300"
            src={imgurl}
            alt="singupImage"
          />
        </div>
        {/* <div className="w-full">
          <h1 className="w-full border-b py-2 hover:border-2 text-xl border-green-500  text-center">
            Welcome to our G-Chat
          </h1>
          <div className="flex p-5 ">
            <div className="mt-5 ">
              <h3>G-Chat Features:</h3>
              <li className="mt-3 ms-5">Group One-to-One Chat </li>
              <li className="mt-3 ms-5">
                Create and join unlimited group chats.
              </li>
              <li className="mt-3 ms-5">
                Share documents, images, and videos within the group.
              </li>
              <li className="mt-3 ms-5">
                Initiate private conversations with friends.
              </li>
              <li className="mt-3 ms-5">View real-time status indicators.</li>
              <li className="mt-3 ms-5">
                Secure end-to-end encryption for private conversations.
              </li>
              <p>
                Ready to get started? Sign up now and experience the next level
                of group and one-to-one chatting!
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default HomeLeft;
