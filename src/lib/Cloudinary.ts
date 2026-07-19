import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { requireCloudinaryEnv } from "@/lib/env";

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

export async function uploadImage(file: File): Promise<string> {
  configureCloudinary();
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Unsupported image type");
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error("Image must be between 1 byte and 5 MB");
  const bytes = Buffer.from(await file.arrayBuffer());
  const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cyber-academy", resource_type: "image", unique_filename: true, overwrite: false },
      (error, result) => error || !result ? reject(error ?? new Error("Upload failed")) : resolve(result)
    );
    stream.end(bytes);
  });
  return uploaded.secure_url;
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
  } catch {
    // Old external URLs and malformed values are left untouched.
  }
}

export default cloudinary;
