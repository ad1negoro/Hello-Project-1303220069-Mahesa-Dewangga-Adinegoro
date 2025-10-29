// Mahesa Dewangga adinegoro

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

// Impor semua file rute
const authRoutes = require("./routes/authRoutes");
const cafeRoutes = require("./routes/cafeRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*", // Izinkan semua origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());

// Middleware untuk menyajikan file statis (gambar)
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

// Rute dasar untuk pengujian
app.get("/", (req, res) => {
  res.send("Selamat datang di API NgopiYuk!");
});

// Gunakan rute-rute utama dengan prefix API
app.use("/api/auth", authRoutes);
app.use("/api/cafes", cafeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

// Sinkronisasi database dan jalankan server
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
      console.log("Database berhasil tersinkronisasi.");
    });
  })
  .catch((err) => {
    console.error("Gagal sinkronisasi database:", err);
  });
