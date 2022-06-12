import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = Schema({
  title: {
    type: String,
    required: [true, "Please enter the post's title"],
  },
  content: {
    type: String,
    required: [true, "Please enter the post's content"],
  },
  like: { type: Boolean, default: false }, // It should be in the user's table or in a separate table but if there is a lack of time, then I am doing in this.
  follow: { type: Boolean, default: false }, /// It should be in the user's table or in a separate table but if there is a lack of time, then I am doing in this.
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model("Post", postSchema);
