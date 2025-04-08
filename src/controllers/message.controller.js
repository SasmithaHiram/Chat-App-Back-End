import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("ERROR IN GETUSERSFORSIDEBAR:", error.message);
    res.status(500).json({ error: "INTERNAl SERVER ERROR" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("ERROR IN GETMESSAGES CONTROLLER:", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const sendMessage = async (requestAnimationFrame, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverdId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uplodeResponse = await cloudinary.uploader.upload(image);
      imageUrl = uplodeResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverdId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("ERROR IN SEND MESSAGE CONTROLLER", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
