import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlayCircle,
  FaTrophy,
  FaHeadphones,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import Webcam from "react-webcam";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );

  // NEW: State to toggle between Video and Audio mode
  const [viewMode, setViewMode] = useState("video"); // 'video' or 'audio'

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  /* ================= REFS ================= */
  const mediaRef = useRef(null); // Renamed from videoRef to mediaRef to handle both
  const webcamRef = useRef(null);

  /* ================= ATTENTION STATE ================= */
  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const [calibrating, setCalibrating] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [attentionScore, setAttentionScore] = useState(null);

  /* ================= SEND FRAME ================= */
  const sendFrame = async () => {
    // DISABLE tracking if in Audio Mode
    if (viewMode === "audio") return;

    if (!webcamRef.current || !mediaRef.current) return;
    if (!selectedLecture?._id) return;

    // Only check attention if video is actually playing
    if (mediaRef.current.paused || mediaRef.current.ended) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || imageSrc.length < 1000) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    if (!blob || blob.size === 0) return;

    const form = new FormData();
    form.append("frame", blob);
    form.append("lectureId", selectedLecture._id);

    try {
      const res = await axios.post(`${serverUrl}/api/attention/frame`, form, {
        withCredentials: true,
      });
      const temporal = res.data.temporal;

      if (!temporal) return;
      if (!temporal.calibrated) {
        setCalibrating(true);
        return;
      }

      setCalibrating(false);
      setAttentionScore(temporal.attention ?? null);

      if (temporal.state === "NOT_ATTENTIVE") {
        setLowCount((c) => c + 1);
        setHighCount(0);
      } else {
        setHighCount((c) => c + 1);
        setLowCount(0);
      }
    } catch (err) {
      // Silent error logging to avoid console spam
    }
  };

  /* ================= AUTO PAUSE / RESUME ================= */
  useEffect(() => {
    const interval = setInterval(sendFrame, 1000);
    return () => clearInterval(interval);
  }, [selectedLecture, viewMode]); // Re-run if mode changes

  useEffect(() => {
    // Only auto-pause if in Video Mode
    if (
      viewMode === "video" &&
      lowCount >= 5 &&
      mediaRef.current &&
      !mediaRef.current.paused
    ) {
      mediaRef.current.pause();
      setAutoPaused(true);
    }
  }, [lowCount, viewMode]);

  useEffect(() => {
    if (highCount >= 3 && autoPaused && !userPaused && mediaRef.current) {
      mediaRef.current.play();
      setAutoPaused(false);
    }
  }, [highCount, autoPaused, userPaused]);

  useEffect(() => {
    setCalibrating(true);
    setLowCount(0);
    setHighCount(0);
    setAutoPaused(false);
    setAttentionScore(null);
    setViewMode("video"); // Reset to video when changing lecture
  }, [selectedLecture]);

  /* ================= DOWNLOAD HELPER ================= */
  const handleDownload = (url, type) => {
    if (!url) return;
    // Create a temporary link to force download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedLecture.lectureTitle}.${type}`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= XP HANDLER ================= */
  const handleLectureEnd = async () => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/progress`,
        { lectureId: selectedLecture._id },
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(setUserData(data.user));
        toast.success("🎯 +50 XP Earned!");
      }
    } catch (error) {
      console.error("XP Error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      {/* LEFT COLUMN: Player */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          {/* Header */}
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-4 text-gray-800">
              <FaArrowLeftLong
                className="cursor-pointer hover:text-blue-600 transition"
                onClick={() => navigate("/")}
              />
              {selectedCourse?.title}
            </h1>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm">
              <FaTrophy className="text-yellow-300" />
              <span className="font-bold">{userData?.xp || 0} XP</span>
            </div>
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                viewMode === "video"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              <FaVideo /> Video
            </button>
            {selectedLecture?.audioUrl && (
              <button
                onClick={() => setViewMode("audio")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                  viewMode === "audio"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <FaHeadphones /> Audio Only
              </button>
            )}
          </div>

          {/* Player Container */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
            {viewMode === "video" ? (
              selectedLecture?.videoUrl ? (
                <video
                  ref={mediaRef}
                  key={selectedLecture._id + "-video"}
                  src={selectedLecture.videoUrl}
                  controls
                  onPause={() => setUserPaused(true)}
                  onPlay={() => setUserPaused(false)}
                  onEnded={handleLectureEnd}
                  className="w-full h-full object-contain bg-black"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="text-white flex flex-col items-center justify-center h-full gap-2">
                  <p>Video not available</p>
                </div>
              )
            ) : (
              // AUDIO MODE UI
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-6 animate-pulse">
                  <FaHeadphones size={50} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {selectedLecture.lectureTitle}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Audio Mode • Attention Tracking Paused
                </p>
                <audio
                  ref={mediaRef}
                  key={selectedLecture._id + "-audio"}
                  src={selectedLecture.audioUrl}
                  controls
                  onEnded={handleLectureEnd}
                  className="w-3/4"
                />
              </div>
            )}
          </div>

          {/* Attention & Status Alerts */}
          <div className="mt-4 space-y-2">
            {viewMode === "video" && calibrating && (
              <div className="text-yellow-600 text-sm bg-yellow-50 p-2 rounded border border-yellow-200 flex items-center gap-2">
                <span>👀</span> Calibrating attention... please sit naturally.
              </div>
            )}

            {autoPaused && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200 flex items-center gap-2">
                <span>⏸️</span> Video paused due to low attention. Focus to
                resume!
              </div>
            )}

            {attentionScore !== null &&
              !calibrating &&
              viewMode === "video" && (
                <div className="text-blue-700 text-sm font-semibold flex items-center gap-2">
                  <span>🎯</span> Attention Score: {attentionScore}%
                </div>
              )}
          </div>

          {/* Meta & Downloads */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedLecture?.lectureTitle}
              </h2>
              <p className="text-sm text-gray-500">
                Lecture {selectedCourse?.lectures?.indexOf(selectedLecture) + 1}
              </p>
            </div>

            <div className="flex gap-2">
              {selectedLecture?.videoUrl && (
                <button
                  onClick={() =>
                    handleDownload(selectedLecture.videoUrl, "mp4")
                  }
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                  title="Download Video">
                  <FaVideo className="text-gray-600" />{" "}
                  <span className="hidden sm:inline">Video</span>{" "}
                  <FaDownload className="text-xs" />
                </button>
              )}
              {selectedLecture?.audioUrl && (
                <button
                  onClick={() =>
                    handleDownload(selectedLecture.audioUrl, "mp3")
                  }
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                  title="Download Audio">
                  <FaHeadphones className="text-gray-600" />{" "}
                  <span className="hidden sm:inline">Audio</span>{" "}
                  <FaDownload className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: List */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Course Content</h2>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {selectedCourse?.lectures?.map((lecture, index) => (
            <button
              key={index}
              onClick={() => setSelectedLecture(lecture)}
              className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                selectedLecture?._id === lecture._id
                  ? "bg-black text-white border-black shadow-lg transform scale-[1.02]"
                  : "bg-white hover:bg-gray-50 border-gray-100 text-gray-600"
              }`}>
              <div className="flex items-center gap-3 text-left">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    selectedLecture?._id === lecture._id
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium line-clamp-1">
                  {lecture.lectureTitle}
                </span>
              </div>
              {selectedLecture?._id === lecture._id ? (
                <div className="flex gap-2 text-xs">
                  {viewMode === "audio" ? (
                    <FaHeadphones className="animate-pulse" />
                  ) : (
                    <FaPlayCircle />
                  )}
                </div>
              ) : (
                <FaPlayCircle className="text-gray-300" />
              )}
            </button>
          ))}
        </div>

        {courseCreator && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">
              Instructor
            </p>
            <div className="flex gap-3 items-center">
              <img
                src={
                  courseCreator.photoUrl ||
                  "https://ui-avatars.com/api/?name=Instructor"
                }
                alt="Instructor"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <p className="font-bold text-sm text-gray-900">
                  {courseCreator.name}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {courseCreator.description || "Top Rated Instructor"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Webcam (Only active in Video Mode) */}
      {viewMode === "video" && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="w-32 h-24 fixed bottom-4 right-4 z-50 opacity-20 rounded-lg pointer-events-none"
        />
      )}
    </div>
  );
}

export default ViewLecture;
