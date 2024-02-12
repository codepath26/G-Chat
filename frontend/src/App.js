import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Chat from "./components/Chat/Chat";
import ChatProvider from "./context/ChatProvider.js";

function App() {
  return (
    <>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </>
  );
}

export default App;
