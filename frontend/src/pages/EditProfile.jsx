import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa6";

function EditProfile() {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(userData.name || "")
    const [description, setDescription] = useState(userData.description || "")
    const [photoFile, setPhotoFile] = useState(null)

    const [skills, setSkills] = useState(userData.skills || [])
    const [skillInput, setSkillInput] = useState("")

    const [interests, setInterests] = useState(userData.interests || [])
    const [interestInput, setInterestInput] = useState("")

    const [socialLinks, setSocialLinks] = useState({
        github: userData.socialLinks?.github || "",
        linkedin: userData.socialLinks?.linkedin || "",
        twitter: userData.socialLinks?.twitter || "",
        personalWebsite: userData.socialLinks?.personalWebsite || "",
    })

    const [preferredFields, setPreferredFields] = useState(userData.preferredFields || [])
    const [preferredFieldInput, setPreferredFieldInput] = useState("")

    const addTag = (e, type) => {
        if (e.key === 'Enter' && e.target.value.trim() !== "") {
            e.preventDefault()
            if (type === 'skill') {
                if (!skills.includes(skillInput)) setSkills([...skills, skillInput])
                setSkillInput("")
            } 
            if (type === 'interest') {
                if (!interests.includes(interestInput)) setInterests([...interests, interestInput])
                setInterestInput("")
            }
            if (type === 'preferredFields') {
                if (!preferredFields.includes(preferredFieldInput)) setPreferredFields([...preferredFields, preferredFieldInput])
                setPreferredFieldInput("")
            }
        }
    }

    // Helper: Remove tag
    const removeTag = (tagToRemove, type) => {
        if (type === 'skill') setSkills(skills.filter(s => s !== tagToRemove))
        else if (type === 'preferredFields') setPreferredFields(preferredFields.filter(pf => pf !== tagToRemove))
        else setInterests(interests.filter(i => i !== tagToRemove))
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        if (photoFile) formData.append("photoUrl", photoFile)

        formData.append("skills", JSON.stringify(skills))
        formData.append("interests", JSON.stringify(interests))
        formData.append("socialLinks", JSON.stringify(socialLinks))
        formData.append("preferredFields", JSON.stringify(preferredFields))

        try {
            const result = await axios.post(
                `${serverUrl}/api/user/updateprofile`, 
                formData, 
                { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
            )

            dispatch(setUserData(result.data.user)) 
            toast.success("Profile Updated Successfully")
            navigate("/profile")
        } catch (error) {
            console.error(error)
            toast.error("Profile Update Error")
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
          <FaArrowLeftLong
            className="absolute top-[4%] left-[5%] w-5 h-5 cursor-pointer"
            onClick={() => navigate("/profile")}
          />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Update Your Profile
          </h2>

          <form className="space-y-6" onSubmit={updateProfile}>
            <div className="flex flex-col items-center gap-3">
              <img
                src={
                  photoFile ? URL.createObjectURL(photoFile) : userData.photoUrl
                }
                className="w-24 h-24 rounded-full border-2 border-black object-cover"
                alt="Preview"
              />
              <input
                type="file"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Email (Fixed)
                </label>
                <input
                  value={userData.email}
                  readOnly
                  className="w-full p-2 border rounded mt-1 bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">Bio</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Skills (Press Enter to add)
              </label>
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => addTag(e, "skill")}
                className="w-full p-2 border rounded mt-1"
                placeholder="React, Node, Figma..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="bg-black text-white px-2 py-1 rounded-md text-xs flex items-center gap-2">
                    {s}{" "}
                    <button type="button" onClick={() => removeTag(s, "skill")}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Social Links (Nested Object) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center gap-2 border p-2 rounded">
                <FaGithub />
                <input
                  placeholder="GitHub URL"
                  value={socialLinks.github}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, github: e.target.value })
                  }
                  className="text-sm outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-2 border p-2 rounded">
                <FaLinkedin className="text-blue-600" />
                <input
                  placeholder="LinkedIn URL"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                  }
                  className="text-sm outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 border p-2 rounded">
                <FaTwitter className="text-blue-400" />
                <input
                  placeholder="Twitter URL"
                  value={socialLinks.twitter}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, twitter: e.target.value })
                  }
                  className="text-sm outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 border p-2 rounded">
                <FaGlobe className="text-blue-400" />
                <input
                  placeholder="Personal Website URL"
                  value={socialLinks.personalWebsite}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, personalWebsite: e.target.value })
                  }
                  className="text-sm outline-none w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Interests (Press Enter to add)
              </label>
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => addTag(e, "interest")}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black outline-none"
                placeholder="AI, Web Development, Hiking..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 text-gray-800 border border-gray-300 px-2 py-1 rounded-md text-xs flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      className="text-red-500 font-bold hover:text-red-700"
                      onClick={() => removeTag(item, "interest")}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                PreferdFields (Press Enter to add)
              </label>
              <input
                value={preferredFieldInput}
                onChange={(e) => setPreferredFieldInput(e.target.value)}
                onKeyDown={(e) => addTag(e, "preferredFields")}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black outline-none"
                placeholder="Software Development, Data Science..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredFields.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 text-gray-800 border border-gray-300 px-2 py-1 rounded-md text-xs flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      className="text-red-500 font-bold hover:text-red-700"
                      onClick={() => removeTag(item, "preferredFields")}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    );
}

export default EditProfile