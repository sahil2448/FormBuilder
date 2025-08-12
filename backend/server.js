const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute.js");
const formRoutes = require("./Routes/formRoutes.js");
const questionRoutes = require("./Routes/questionRoutes.js");
const responseRoutes = require("./Routes/responseRoutes.js");
const uploadRoutes = require("./Routes/uploadRoutes.js");
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://form-builder-eight-azure.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);
app.use("/forms", formRoutes);
app.use("/questions", questionRoutes);
app.use("/responses", responseRoutes);
app.use("/upload", uploadRoutes);

// ----------------------------------------------
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const authRoute = require("./Routes/AuthRoute.js");
// const formRoutes = require("./Routes/formRoutes.js");
// const questionRoutes = require("./Routes/questionRoutes.js");
// const responseRoutes = require("./Routes/responseRoutes.js");
// const uploadRoutes = require("./Routes/uploadRoutes.js");

// const { MONGO_URL, PORT = 4000, NODE_ENV } = process.env;

// const app = express();

// // CORS: include localhost and your deployed frontend domain(s)
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://form-builder-eight-azure.vercel.app", // Vercel frontend
// ];

// app.use(
//   cors({
//     origin: function (origin, cb) {
//       // allow non-browser tools (origin undefined) and allowed origins
//       if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
//       return cb(new Error("CORS not allowed for origin: " + origin));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // Handle preflight quickly
// app.options("*", cors());

// app.use(cookieParser());
// app.use(express.json());

// // ROUTE MOUNTS
// // Option A: mount auth under /api to match frontend calls to /api/login, /api/me, /api/logout
// app.use("/api", authRoute);

// // Keep others as-is (frontend must call these absolute paths)
// app.use("/forms", formRoutes);
// app.use("/questions", questionRoutes);
// app.use("/responses", responseRoutes);
// app.use("/upload", uploadRoutes);

// // Health check
// app.get("/health", (req, res) => res.json({ ok: true }));

// mongoose
//   .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("Mongo connection error:", err);
//     process.exit(1);
//   });

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT} (${NODE_ENV || "dev"})`);
// });
