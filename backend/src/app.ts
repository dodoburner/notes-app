import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import NotesRoutes from "./routes/notes";
import UsersRoutes from "./routes/users";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "./util/validateEnv";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/notes", NotesRoutes);

app.use("/api/users", UsersRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMsg = "Unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    errorMsg = error.message;
    statusCode = error.status;
  }
  res.status(statusCode).json({ error: errorMsg });
});

export default app;
