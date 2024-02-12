import React from "react";
import HomeLeft from "../UI/HomeLeft";
import HomeRight from "../UI/HomeRight";

function Signup() {
  return (
    <div className="flex md:flex-row  flex-col md:h-screen">
      <HomeLeft imgurl="/images/bg02.png" />
      <HomeRight
        FormType="Signup"
        goToMessage="Already have an account? Login"
        goto="/login"
      />
    </div>
  );
}

export default Signup;
