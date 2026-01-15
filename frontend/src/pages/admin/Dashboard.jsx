import React from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg"; // fallback photo
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  // --- Logic for charts and earnings (Unchanged) ---
  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;
  // ------------------------------------------------

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Back Arrow */}
      <FaArrowLeftLong 
        className='w-[22px] absolute top-[40px] left-[40px] h-[22px] cursor-pointer hover:text-gray-600 transition-colors' 
        onClick={() => navigate("/")} 
      />
      
      <div className="w-full px-6 py-10 bg-gray-50 space-y-10 mt-10">
        
        {/* Welcome Section */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userData?.photoUrl || img}
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />
          
          <div className="text-center md:text-left space-y-1 flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"} 👋
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>
              Total Earning : <span className='font-light text-gray-900'>₹{totalEarnings.toLocaleString()}</span>
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              {userData?.description || "Start creating amazing courses for your students!"}
            </p>
            
            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
                
                {/* Create Courses -> points to /createcourses */}
                <button 
                  onClick={() => navigate("/createcourses")} 
                  className='px-6 py-2 border-2 bg-black border-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-md'
                >
                  Create Courses
                </button>

                {/* View My Courses -> points to /courses */}
                <button 
                  onClick={() => navigate("/courses")}
                  className='px-6 py-2 border-2 bg-white border-black text-black rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm'
                >
                  View My Courses
                </button>
            </div>
            {/* ---------------------- */}

          </div>
        </div>

        {/* Graphs Section (Unchanged) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Course Progress Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enrolled Students Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard