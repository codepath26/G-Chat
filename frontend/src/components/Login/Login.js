import React from "react";
import HomeLeft from "../UI/HomeLeft";
import HomeRight from "../UI/HomeRight";

function Login() {
  return (
    <>
      <div className="flex md:flex-row bg-[url('assets/bg.jpg')] bg-cover bg-center flex-col md:h-screen">
        <HomeLeft imgurl="/images/bg.png" />
        <HomeRight
          FormType="Login"
          goToMessage="Don't have an account? Signup"
          goto="/signup"
        />
      </div>
    </>
  );
}

export default Login;
