const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const myrouter = require("./routes/v1");
const { apiKeyAuth } = require("./middleware/apiKeyAuth");
const { createDefaultAdmin } = require("./controllers/authController");
const path = require("path");

dotenv.config();

const app = express();

// Middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev
      "http://localhost:3001", // Possibly React dev
      "http://localhost:3000", // If frontend runs on backend port
      "file://", // Electron local files
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Example route
app.get("/", (req, res) => res.send("API running ..."));

// Routes
app.use("/api/v1", apiKeyAuth, myrouter);

// Error handler
app.use(errorHandler);

// Connect DB and start server
// mongoose
//   .connect("mongodb://localhost:27017/?replicaSet=rs0")
//   .then(async () => {
//     console.log("✅ MongoDB connected");
//     await createDefaultAdmin();

//     app.listen(process.env.PORT || 3000, () =>
//       console.log(`🚀 Server on http://localhost:${process.env.PORT || 3000}`)
//     );
//   })
//   .catch((err) => console.error("Mongo Error", err));

// module.exports = app;

let serverReady = false;
let serverPromise;

const startServer = () => {
  if (serverPromise) return serverPromise;

  serverPromise = mongoose
    .connect("mongodb://localhost:27017/?replicaSet=rs0")
    .then(async () => {
      console.log("✅ MongoDB connected");
      await createDefaultAdmin();

      return new Promise((resolve) => {
        const server = app.listen(process.env.PORT || 3000, () => {
          console.log(
            `🚀 Server on http://localhost:${process.env.PORT || 3000}`
          );
          serverReady = true;
          resolve(server);
        });
      });
    })
    .catch((err) => {
      console.error("Mongo Error", err);
      throw err;
    });

  return serverPromise;
};

// Start immediately when required
startServer();

module.exports = { app, startServer, isReady: () => serverReady };
