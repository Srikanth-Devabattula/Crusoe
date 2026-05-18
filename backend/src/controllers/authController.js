const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

/**
 * @route   POST /api/auth/login
 * @desc    Admin login — placeholder implementation
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = generateToken(user._id);

    // Optional: set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 200, "Login successful", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { login };
