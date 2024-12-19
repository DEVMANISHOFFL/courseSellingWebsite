import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Add decoded userId to the request object for downstream use
    req.id = decoded.userId;
    next(); // Move to the next middleware or route handler

  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({
      message: "Authentication failed: " + error.message,
      success: false,
    });
  }
};

export default isAuthenticated;
