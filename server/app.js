import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import componentRouter from "./modules/components/component.routes.js";
import compatibilityRouter from "./modules/compatibility/compatibility.routes.js";
import buildRouter from "./modules/builds/build.routes.js";
import recommendationRouter from "./modules/recommendations/recommendation.routes.js";
import compareRouter from "./modules/compare/compare.routes.js";
import learnRouter from "./modules/learn/learn.routes.js";
import historyRouter from "./modules/history/history.routes.js";
import pricingRouter from "./modules/pricing/pricing.routes.js";
import mediaRouter from "./modules/media/media.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(env.isDev ? morgan("dev") : morgan("combined"));

// Routes
app.use("/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/components", componentRouter);
app.use("/api/v1/compatibility", compatibilityRouter);
app.use("/api/v1/builds", buildRouter);
app.use("/api/v1/recommendations", recommendationRouter);
app.use("/api/v1/compare", compareRouter);
app.use("/api/v1/learn", learnRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/pricing", pricingRouter);
app.use("/api/v1/media", mediaRouter);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

export default app;