const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [ // Changed 'message' to 'messages'
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ConversationModel = mongoose.model("Conversation", conversationSchema);
module.exports = ConversationModel;
