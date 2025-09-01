import type { Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary.ts";

const createBook = async (req: Request, res: Response) => {
  try {
    // const { title, genre, description } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Check for cover image
    if (!files?.["coverImage"]?.[0]) {
      return res.status(400).json({ err: "no cover image uploaded" });
    }

    // Check for book file
    if (!files?.["file"]?.[0]) {
      return res.status(400).json({ err: "no book file uploaded" });
    }

    const coverImageFile = files["coverImage"][0];
    const bookFile = files["file"][0];

    const coverImageMimeType = coverImageFile.mimetype.split("/").at(-1);

    const uploadResult = await cloudinary.uploader.upload(coverImageFile.path, {
      filename_override: coverImageFile.filename,
      folder: "book-covers",
      format: coverImageMimeType || "auto",
    });

    const bookFileName = bookFile.filename;
    const bookFilePath = path.resolve(bookFile.path);

    const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "books-pdfs",
      format: "pdf",
    });

    console.log("coverImage uploadResult", uploadResult);
    console.log("bookFile uploadResult", bookUploadResult);

    return res.json({
      msg: "files uploaded successfully",
      coverImage: uploadResult,
      bookFile: bookUploadResult,
    });
  } catch {
    return res.json({ err: "Not able to uplaod files" });
  }
};

export { createBook };
