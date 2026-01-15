import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
}

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const interests = req.body.interests ? JSON.parse(req.body.interests) : [];
    const socialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : {};

    const preferredFields = req.body.preferredFields
      ? JSON.parse(req.body.preferredFields)
      : [];
    


    const updateData = {
      name,
      description,
      skills,
      interests,
      socialLinks,
      preferredFields,
    };

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      updateData.photoUrl = uploadResponse.secure_url || uploadResponse.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};