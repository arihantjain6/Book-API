import type { Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary.ts";
import fs from "fs";
import BookModel from "./bookModel.ts";

const createBook = async (req: Request, res: Response) => {
  try {
    const { title, genre } = req.body;

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
    // @ts-ignore
    console.log("userId", req.userId);

    const newBook = await BookModel.create({
      title,
      genre,
      author: "68b2d4b6761109971e000484",
      coverImage: uploadResult.secure_url,
      bookFile: bookUploadResult.secure_url,
    });

    try {
      await fs.promises.unlink(coverImageFile.path);
      await fs.promises.unlink(bookFile.path);
      console.log("Local files deleted successfully");
    } catch (error) {
      console.error("Error deleting files:", error);
      // Don't return error here, just log it
    }

    return res.status(201).json({
      msg: "Book created successfully",
      book: newBook,
      coverImage: uploadResult,
      bookFile: bookUploadResult,
    });
  } catch {
    return res.json({ err: "Not able to uplaod files" });
  }
};

export { createBook };
