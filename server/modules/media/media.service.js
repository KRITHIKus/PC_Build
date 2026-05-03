import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import { AppError } from "../../utils/appError.js";

const VALID_FOLDERS = ["components", "learn", "history", "builds", "general"];

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const uploadImage = (buffer, { folder = "general", filename } = {}) => {
  const safeFolder = VALID_FOLDERS.includes(folder) ? folder : "general";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `pc-builder/${safeFolder}`,
        resource_type: "image",
        ...(filename && { public_id: filename }),
        overwrite: false,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(new AppError(`Cloudinary upload failed: ${error.message}`, 502));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    if (result.result !== "ok" && result.result !== "not found") {
      throw new AppError(`Cloudinary delete failed: ${result.result}`, 502);
    }
    return { deleted: true, publicId };
  } catch (err) {
    if (err.isOperational) throw err;
    throw new AppError(`Cloudinary delete error: ${err.message}`, 502);
  }
};