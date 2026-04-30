// import express from "express";
// import dotenv from "dotenv";
// import connectDB from './src/config/db.js';
// import authRoutes from "./src/routes/authRoutes.js";
// import authMiddleware from "./src/middleware/authMiddleware.js";
// import appointmentRoutes from "./src/routes/appointmentRoutes.js";
// import queueRoutes from "./src/routes/queueRoutes.js";


// dotenv.config();

// const app = express();

// app.use(express.json());

// connectDB();



// app.use("/api/v1/auth", authRoutes);

// app.use("/api/v1/appointments", appointmentRoutes);

// app.use("/api/v1/queues", queueRoutes);



// app.get("/", (req, res) => {
//   res.send("API Running...");
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("MONGO_URI:", process.env.MONGO_URI);
// });


import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import queueRoutes from "./src/routes/queueRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();

// 🔥 Create HTTP server (IMPORTANT for socket.io)
const server = http.createServer(app);

// 🔥 Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 Make io exportable (used in services)
export { io };

app.use(express.json());

connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/queues", queueRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

// 🔥 Socket connection logic
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Join queue room
//   socket.on("joinQueue", (queueId) => {
//     socket.join(queueId);
//     console.log(`Joined queue: ${queueId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });
// io.on("connection", (socket) => {
//   console.log("🔥 User connected:", socket.id);

//   // Join queue
//   socket.on("joinQueue", (queueId) => {
//     socket.join(queueId);

//     console.log("✅ Joined queue:", queueId);
//   });

//   // Leave queue
//   socket.on("leaveQueue", (queueId) => {
//     socket.leave(queueId);

//     console.log("🚪 Left queue:", queueId);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  // Join queue
  socket.on("joinQueue", (queueId) => {
    if (!queueId) {
      return socket.emit("socketError", {
        message: "Queue ID is required",
      });
    }

    socket.join(queueId);

    console.log("✅ Joined queue:", queueId);
  });

  // Leave queue
  socket.on("leaveQueue", (queueId) => {
    if (!queueId) {
      return socket.emit("socketError", {
        message: "Queue ID is required",
      });
    }

    console.log("📩 leaveQueue event received:", queueId);

    socket.leave(queueId);

    console.log("🚪 Left queue:", queueId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 🔥 Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("MONGO_URI:", process.env.MONGO_URI);
});