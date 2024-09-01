const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/orderSchema");
const cors = require("cors");
const path = require("path"); // Import the path module
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const foodRoutes = require("./routes/foodRoutes");
const { createOrder } = require("./controllers/orderController");
// const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const feedbackRoutes = require("./routes/feedbackRoute");
const messageRoutes = require("./routes/messageRoutes");
const cartRoutes = require("./routes/cart");
const multer = require("multer");
const dotenv = require("dotenv");
const stripe = require("stripe");
const cookieParser = require("cookie-parser");
const { default: Stripe } = require("stripe");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
// Connect to MongoDB with updated options
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.log(err));

const dbConnect = () => {
  const connectionParams = { useNewUrlParser: true };
  mongoose.connect(process.env.MONGO_URL, connectionParams);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database sucessfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database :" + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb connection disconnected");
  });
};
dbConnect();

// again push
// Middleware for CORS and JSON parsing

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://pizza-uno-frontend-git-main-uzairs-projects-328814ec.vercel.app",
      "https://pizza-uno-frontend.vercel.app",
      "http://localhost:5173",
    ];
    const isAllowed = allowedOrigins.includes(origin);
    callback(null, isAllowed ? origin : false);
  },
  medthod: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

// Error handling for CORS middleware
app.use((err, req, res, next) => {
  if (err) {
    console.error("CORS Error:", err.message);
    res.status(403).json({ error: "CORS Error: " + err.message });
  } else {
    next();
  }
});

app.use(express.json());
// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function validateCreditCard(cardNumber) {
  // Remove non-digit characters from the card number
  const cleanedCardNumber = cardNumber.replace(/\D/g, "");

  // Check if the length of the cleaned card number is within the valid range
  if (cleanedCardNumber.length < 12 || cleanedCardNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  // Iterate over each digit of the card number from right to left
  for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedCardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    // Add the digit to the sum
    sum += digit;

    // Toggle the isEven flag
    isEven = !isEven;
  }

  // Check if the sum is divisible by 10
  return sum % 10 === 0;
}

app.post("/payment/checkout", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.SECRET_STRIPE_KEY);
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: "GBP",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment/cancel",
    });

    console.log(session);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image route
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file === undefined) {
    return res.status(400).json({ message: "Error: No file selected!" });
  } else {
    res.status(200).json({
      message: "Image uploaded successfully!",
      file: req.file,
    });
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

// Routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/food", foodRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/message", messageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});
