import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// ✅ 1. IMAGE HELPER (Optimized for Buffer)
const uploadOnCloudinary = async (fileBuffer) => {
    try {
       if (!fileBuffer) return null;
       
       return new Promise((resolve, reject) => {
           const uploadStream = cloudinary.uploader.upload_stream(
               { 
                   resource_type: 'image',
                   folder: 'course_thumbnails',
                   quality: 'auto',
                   fetch_format: 'auto'
               },
               (error, result) => {
                   if (error) {
                       console.error("❌ Cloudinary Image Upload Error:", error);
                       reject(error);
                   } else {
                       resolve(result.secure_url);
                   }
               }
           );
           uploadStream.end(fileBuffer);
       });
    } catch (error) {
        console.error("❌ Cloudinary Image Error:", error.message);
        return null;
    }
};

// ✅ 2. PDF HELPER (Optimized for Buffer)
export const uploadFileToCloudinary = async (fileBuffer, originalName) => {
    try {
        if (!fileBuffer) return null;
        
        const safeName = originalName.replace(/\s+/g, '_');
        const nameWithoutExtension = safeName.replace(/\.[^/.]+$/, "");
        
        console.log(`🚀 Uploading PDF: ${safeName}`);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "course_notes",
                    public_id: `${Date.now()}-${nameWithoutExtension}`,
                    use_filename: true,
                    unique_filename: false,
                    access_mode: "public",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });

        console.log("✅ PDF Upload Success:", result.secure_url);
        
        // Append fl_attachment to ensure it downloads instead of opening
        return `${result.secure_url}?fl_attachment`;
        
    } catch (error) {
        console.error("❌ Cloudinary PDF Error:", error.message);
        throw error;
    }
};

// ✅ 3. VIDEO HELPER (PERFORMANCE FIX: Uses Streams instead of Base64)
export const uploadMediaWithAudio = async (fileBuffer, originalName) => {
    try {
        if (!fileBuffer) return null;
        const safeName = originalName.replace(/\s+/g, '_');

        console.log(`🚀 Uploading Video (Stream): ${safeName}`);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: "course_content",
                    public_id: `${Date.now()}-${safeName.replace(/\.[^/.]+$/, "")}`,
                    eager: [
                        {
                            format: 'mp3',
                            audio_codec: 'mp3'
                        }
                    ],
                    eager_async: true,
                    timeout: 600000
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });

        console.log("✅ Video Upload Success:", result.secure_url);
        
        return {
            videoUrl: result.secure_url,
            audioUrl: result.eager?.[0]?.secure_url || null
        };
    } catch (error) {
        console.error("❌ Cloudinary Video Error:", error.message);
        throw error;
    }
};

export default uploadOnCloudinary;