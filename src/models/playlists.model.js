import { model, Schema } from "mongoose";

const playlistModel = Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  ],

  title: {
    type: String,
    required: true,
  },
  
});

export const Playlist = model("Playlist",playlistModel)