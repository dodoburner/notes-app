import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import NotesRoutes from "./routes/notes";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/notes", NotesRoutes);

app.use((req, res, next) => {
  next(Error("Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMsg = "Unknown error occured";
  if (error instanceof Error) errorMsg = error.message;
  res.status(500).json({ error: errorMsg });
})

export default app;