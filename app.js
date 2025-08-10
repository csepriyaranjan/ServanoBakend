// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware

const allowedOrigins = [
  "http://localhost:5173/", // React dev server
  "https://servano.vercel.app" // Your production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If you use cookies or auth headers
}));

app.use(express.json());

// Routes
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/bookings", bookingRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to Servano Backend API");
});

app.post("/v1/api/contact", async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  // Basic field validation
  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }

  // Ensure env vars are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res
      .status(500)
      .json({ error: "Email configuration is missing on the server" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        minVersion: "TLSv1", // allow older TLS
        rejectUnauthorized: false, // accept self-signed / weak cert
      },
    });

    // Email options
    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${service || "General Inquiry"}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || "N/A"}
Service: ${service || "Not specified"}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default app;
