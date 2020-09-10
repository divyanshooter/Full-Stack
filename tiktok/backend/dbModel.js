import mongoose from "mongoose";

const tittokSchema = mongoose.Schema({
  url: String,
  channel: String,
  song: String,
  likes: String,
  shares: String,
  messages: String,
  description: String,
});

export default mongoose.model("tittokVideos", tittokSchema);
