import mongoose, { Schema, model } from "mongoose";

const friendSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    friend: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["requested", "rejected", "accepted"],
      default: "requested",
    },
    type: {
      type: String,
      enum: ["sent", "received"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const FriendModel = model("Friend", friendSchema);
export default FriendModel;
