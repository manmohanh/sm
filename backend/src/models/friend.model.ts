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
      enum: ["requested", "accepted"],
      default: "requested",
    }
  },
  { timestamps: true }
);

friendSchema.pre("save", async function (next) {
  try {
    const count = await model("Friend").countDocuments({
      user: this.user,
      friend: this.friend,
    });
    
    if(count > 0)
      throw next(new Error("Friend request already sent."))

    next()

  } catch (error) {
    next(new Error("Failed to send friend request"))
  }
});

const FriendModel = model("Friend", friendSchema);
export default FriendModel;
