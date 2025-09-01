import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.ts";

console.log("Cloudinary config:", {
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryApiKey ? "***" : "undefined",
  api_secret: config.cloudinarySecret ? "***" : "undefined",
});

cloudinary.config({
  cloud_name: config.cloudinaryCloud!,
  api_key: config.cloudinaryApiKey!,
  api_secret: config.cloudinarySecret!,
});
export default cloudinary;
