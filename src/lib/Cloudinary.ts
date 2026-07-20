import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { requireCloudinaryEnv } from "@/lib/env";
import { ImageUploadError, ValidationError, logServerError } from "@/lib/errors";

let isConfigured = false;

function configureCloudinary() {
  if (isConfigured) return;
  const credentials = requireCloudinaryEnv();
  cloudinary.config({
    cloud_name: credentials.cloudName,
    api_key: credentials.apiKey,
    api_secret: credentials.apiSecret,
    secure: true,
  });
  isConfigured = true;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function detectedImageType(bytes: Buffer): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (bytes.length >= 6 && (bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a")) return "image/gif";
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export async function uploadImage(file: Blob): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new ValidationError("Unsupported image type");
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new ValidationError("Image must be between 1 byte and 5 MB");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (detectedImageType(bytes) !== file.type) throw new ValidationError("File contents do not match the selected image type");
  configureCloudinary();
  try {
    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "cyber-academy", resource_type: "image", unique_filename: true, overwrite: false },
        (error, result) => error || !result ? reject(error ?? new Error("Upload returned no result")) : resolve(result)
      );
      stream.end(bytes);
    });
    return uploaded.secure_url;
  } catch (error) {
    throw new ImageUploadError({ cause: error });
  }
}

export async function deleteCloudinaryImage(url: string): Promise<void> {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return;
    const marker = "/upload/";
    const index = parsed.pathname.indexOf(marker);
    if (index < 0) return;
    const withoutVersion = parsed.pathname.slice(index + marker.length).replace(/^v\d+\//, "");
    const publicId = decodeURIComponent(withoutVersion).replace(/\.[^.\/]+$/, "");
    if (publicId.startsWith("cyber-academy/")) {
      configureCloudinary();
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    logServerError("Cloudinary image cleanup failed", error);
  }
}

export default cloudinary;
