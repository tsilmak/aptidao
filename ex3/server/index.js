import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cookieParser());
// Middleware setup
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

const server = createServer(app);

app.use(helmet());
app.use(morgan("common"));

const routes = [{ path: "/auth", route: authRoutes }];

routes.forEach(({ path, route }) => {
  app.use(path, route);
});

const port = 8000;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
