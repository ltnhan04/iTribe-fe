const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const connectDB = require("./libs/db");
const initSocket = require("./libs/initSocket");

const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const messageRoutes = require("./routes/message.routes");
const corsOptions = require("./config/cors");

dotenv.config();

const app = express();
const server = http.createServer(app);
require("./libs/passport");

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
// routes
app.use("/api/v1", customerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/messages", messageRoutes);
app.get("/", (_, res) => res.send("Hello World!"));

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
