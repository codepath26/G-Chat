import Message from "../models/message.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";

export const allMessage = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
