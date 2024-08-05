const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const ConversationModel = require("../models/ConversationModel"); // Corrected path
const MessageModel = require("../models/MessageModel"); // Corrected path
const getConversation = require("../helpers/getConversation");

const app = express(); // Declare app here

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/***
 * socket running at http://localhost:8080/
 */

//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("No token provided");
    socket.disconnect();
    return;
  }

  //current user details
  const user = await getUserDetailsFromToken(token);
  if (user.error) {
    console.error(user.message);
    socket.disconnect();
    return;
  }
  if (!user || !user._id) {
    console.error("User not found or invalid token");
    socket.disconnect();
    return;
  }
  //create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId ObjectId", userId);
      return;
    }
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  //new message
  socket.on("new message", async (data) => {
    if (
      !mongoose.Types.ObjectId.isValid(data?.sender) ||
      !mongoose.Types.ObjectId.isValid(data?.receiver)
    ) {
      console.error("Invalid sender or receiver ObjectId", data);
      return;
    }
    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    //if conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    await ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      console.error("Invalid currentUserId ObjectId");
      return;
    }
    console.log("current user", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    if (!mongoose.Types.ObjectId.isValid(msgByUserId)) {
      console.error("Invalid msgByUserId ObjectId", msgByUserId);
      return;
    }
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });
  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      console.error("Invalid currentUserId ObjectId");
      return;
    }
    console.log("current user", currentUserId);
    const currentUserConversation = await ConversationModel.find({
      $or: [
        {
          sender: currentUserId,
        },
        {
          receiver: currentUserId,
        },
      ],
    })
      .sort({ updateAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    console.log("currentUserConversation", currentUserConversation);
    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv.messages.reduce(
        (prev, curr) => prev + (curr.seen ? 0 : 1),
        0
      );
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages.length - 1],
      };
    });
    socket.emit("conversation", conversation);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user ", socket.id);
  });
});

module.exports = {
  app,
  server,
};
