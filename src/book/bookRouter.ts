import { Router } from "express";
import { createBook } from "./bookController.ts";
import multer from "multer";


const bookRouter = Router();

const upload = multer({
    dest: path.resolve(_dirname,'../../public/data/uploads'),
    limits:{fileSize: 3e7}
})

bookRouter.post("/", upload.fields([
    {name:'coverImage', maxCount:1},
    {name:'file', maxCount:1},
]),createBook);

export default bookRouter;