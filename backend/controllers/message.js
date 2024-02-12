import Message from "../models/message";

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

  try {
    let newMessage = {
      sender: req.user_id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
