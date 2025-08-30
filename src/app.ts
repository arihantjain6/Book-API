import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use(globalErrorHandler)

export default app;
