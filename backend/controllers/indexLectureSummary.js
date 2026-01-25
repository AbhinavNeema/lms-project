import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import AIEmbedding from "../models/AIEmbedding.js";
import { embedText } from "../utils/embeddings.js";

export const indexLectureSummary = async (lectureId) => {
  console.log("🧠 indexLectureSummary CALLED");
  console.log("lectureId:", lectureId);

  const lecture = await Lecture.findById(lectureId);
  if (!lecture?.summary) {
    console.log("❌ No summary, skipping indexing");
    return;
  }

  
  const course = await Course.findOne({
    lectures: lectureId,
  }).select("_id");

  if (!course) {
    console.log("❌ Course not found for lecture");
    return;
  }

  const courseId = course._id;

  console.log("courseId:", courseId);

  const summary = lecture.summary;

  const chunks = summary.match(/.{1,300}/g) || [];
  console.log("📦 Summary chunks:", chunks.length);

  // remove old summary embeddings
  await AIEmbedding.deleteMany({
    lectureId,
    courseId,
    source: "summary",
  });

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);

    await AIEmbedding.create({
      courseId,
      lectureId,
      chunk,
      embedding,
      source: "summary",
    });
  }

  console.log("✅ SUMMARY EMBEDDINGS SAVED");
};
