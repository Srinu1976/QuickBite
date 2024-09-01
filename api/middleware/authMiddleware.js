const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      // Corrected typo here
      return res.status(401).json({
        success: false,
        message: "Bearer Token not provided",
      });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) return res.status(403).json({
        success: false,
        message: "Token Verification Failed",
      });
      req.body.userId = decode.userId;
      req.body.role = decode.role;
      next();
    });

  } catch (error) {
    console.log("Token Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Token Server Error",
    });
  }
};

const verifyUser = (req, res, next) => {
  const userId = req.body.userId;
  const paramsId = req.params.id;
  const role = req.body.role;

  if (paramsId === userId || role === "admin") {
    next();
  } else {
    res.status(401).json({ success: false, message: "You're not Authorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  const role = req.body.role;
  if (role === "admin") {
    next();
  } else {
    res.status(401).json({ success: false, message: "You're not Authorized" });
  }
};

module.exports = { protect, verifyUser, verifyAdmin };
