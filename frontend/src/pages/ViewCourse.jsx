import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle, FaVideo } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";
import CourseChat from "../components/CourseChat";
import CourseAIChat from "../components/CourseAIChat";

function ViewCourse() {

  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector(state => state.lecture)
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // === NEW STATE FOR LIVE LECTURES ===
  const [liveLectures, setLiveLectures] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  // ===================================

  const handleReview = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1); 
  };

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
        dispatch(setSelectedCourseData(item))
        return null;
      }
    })
  }

  // === NEW: FETCH LIVE LECTURES ===
  const fetchLiveLectures = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/live/course/${courseId}`, { withCredentials: true });
      if (data.success) {
        setLiveLectures(data.lectures);
        
        // Simple check: Is there a class starting within the last hour or next 15 mins?
        const now = new Date();
        const active = data.lectures.find(l => {
            const start = new Date(l.startTime);
            const diff = (now - start) / 1000 / 60; // difference in minutes
            // Active if: Started less than 60 mins ago OR starts in next 15 mins
            return diff > -15 && diff < 60; 
        });
        setActiveLiveClass(active);
      }
    } catch (error) {
      console.error("Failed to fetch live lectures", error);
    }
  };
  // ================================

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });

    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
    // Trigger live lecture fetch
    if(isEnrolled) {
        fetchLiveLectures();
    }
  }, [courseId, courseData, lectureData, isEnrolled])


  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();
  }, [selectedCourseData]);


  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourses = courseData.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId 
      );
      setSelectedCreatorCourse(creatorCourses);

    }
  }, [creatorData, courseData]);


  const handleEnroll = async (courseId, userId) => {
    try {
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
        courseId,
        userId
      }, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.data.amount,
        currency: "INR",
        name: "TLE Terminator LMS",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", {
              ...response,
              courseId,
              userId
            }, { withCredentials: true });

            setIsEnrolled(true)
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
      };

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      toast.error("Something went wrong while enrolling.");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8">
    <div className="max-w-7xl mx-auto space-y-10">

      {/* BACK */}
      <FaArrowLeftLong
        onClick={() => navigate("/allcourses")}
        className="text-black text-xl cursor-pointer hover:scale-110 transition"
      />

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <img
            src={selectedCourseData?.thumbnail || img}
            className="w-full h-[360px] object-cover rounded-3xl shadow-xl"
          />

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-black">
              {selectedCourseData?.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {selectedCourseData?.subTitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="font-semibold text-black">{avgRating || "New"}</span>
              <span className="text-gray-500 text-sm">
                ({selectedCourseData?.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT – ENROLL CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 h-fit sticky top-10 border">
          <div className="space-y-4">
            <div>
              <span className="text-3xl font-bold text-black">
                ₹{selectedCourseData?.price}
              </span>
              <span className="ml-2 line-through text-gray-400">
                ₹{selectedCourseData?.price * 2}
              </span>
            </div>

            {/* === LIVE CLASS BUTTON === */}
            {isEnrolled && activeLiveClass && (
                <button 
                  onClick={() => navigate(`/live/${activeLiveClass.meetingId}`)}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse shadow-red-200 shadow-lg mb-2"
                >
                  <FaVideo className="animate-bounce" />
                  🔴 Join Live: {activeLiveClass.topic}
                </button>
            )}
            {/* ========================= */}

            {!isEnrolled ? (
              <button
                onClick={() => handleEnroll(courseId, userData._id)}
                className="w-full bg-gradient-to-r from-black to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Enroll Now
              </button>
            ) : (
              <button
                onClick={() => navigate(`/viewlecture/${courseId}`)}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
              >
                Go to Lectures
              </button>
            )}

            <ul className="text-sm text-gray-600 space-y-2 pt-2">
              <li>✔ Lifetime Access</li>
              <li>✔ Expert Instructor</li>
              <li>✔ Certificate of Completion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
        <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
          <li>✔ Master {selectedCourseData?.category}</li>
          <li>✔ Build real-world projects</li>
          <li>✔ Industry-ready skills</li>
          <li>✔ Learn at your own pace</li>
        </ul>
      </section>

      {/* CURRICULUM + PLAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* CURRICULUM */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>

          <div className="space-y-2">
            {selectedCourseData?.lectures?.map((lecture, i) => (
              <button
                key={i}
                disabled={!lecture.isPreviewFree}
                onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition
                  ${lecture.isPreviewFree
                    ? "hover:bg-blue-50 border-gray-200"
                    : "opacity-50 cursor-not-allowed"}
                `}
              >
                {lecture.isPreviewFree ? (
                  <FaPlayCircle className="text-blue-600" />
                ) : (
                  <FaLock className="text-gray-500" />
                )}
                <span className="text-sm font-medium">
                  {lecture.lectureTitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PLAYER */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-lg">
          <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center mb-4">
            {selectedLecture?.videoUrl ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <span className="text-white text-sm">
                Select a preview lecture
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg">
            {selectedLecture?.lectureTitle || "Lecture Title"}
          </h3>
          <p className="text-sm text-gray-500">
            {selectedCourseData?.title}
          </p>
        </div>
      </div>

      {/* REVIEW */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full border rounded-xl p-3 mb-3"
          placeholder="Share your experience..."
        />

        <button
          onClick={handleReview}
          className="bg-black text-white px-6 py-2 rounded-xl"
        >
          Submit Review
        </button>
      </section>

      {/* CHAT */}
      {isEnrolled && (
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <CourseChat courseId={courseId} user={userData} />
        </div>
      )}
      {isEnrolled && <CourseAIChat courseId={courseId} />}
      
      {/* INSTRUCTOR */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-6">
          <img
            src={creatorData?.photoUrl || img}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{creatorData?.name}</h3>
            <p className="text-gray-600">{creatorData?.description}</p>
            <p className="text-sm text-gray-500">{creatorData?.email}</p>
          </div>
        </div>
      </section>

      {/* OTHER COURSES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          More Courses by this Instructor
        </h2>
        <div className="flex flex-wrap gap-6">
          {selectedCreatorCourse?.map((item, i) => (
            <Card
              key={i}
              thumbnail={item.thumbnail}
              title={item.title}
              id={item._id}
              price={item.price}
              category={item.category}
            />
          ))}
        </div>
      </section>

    </div>
  </div>
)

}

export default ViewCourse