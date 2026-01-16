import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { Readable } from "stream"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async(filePath)=>{
    try {
       if(!filePath){
        return null
       } 
       const uploadResult = await cloudinary.uploader.upload(filePath,{resource_type:'auto'})
       fs.unlinkSync(filePath)
       return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error);
        
    }
}

export const uploadMediaWithAudio = async (buffer) => {
    try {
        if (!buffer) return null;

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: "course_content",
                    eager: [
                        { format: 'mp3', audio_codec: 'mp3' }
                    ],
                    eager_async: false
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve({
                            videoUrl: result.secure_url,
                            audioUrl: result.eager[0].secure_url
                        });
                    }
                }
            );

            const readableStream = Readable.from(buffer);
            readableStream.pipe(stream);
        });

    } catch (error) {
        console.log("Upload Helper Error:", error);
        return null;
    }
}

export default uploadOnCloudinary