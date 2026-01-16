import Media from "../models/Media.js"
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";


ffmpeg.setFfmpegPath(ffmpegPath);

export const divideMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const result = await uploadMediaWithAudio(req.file.buffer);

    if (!result) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const media = await Media.create({
      videoPath: result.videoUrl,
      audioPath: result.audioUrl,
    });

    res.status(200).json(media);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};