import { verifyAccessToken } from "../utils/jwt.utils.js";
import User from "../model/user.model.js";
import { AppError } from "./errorHandler.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) throw new AppError("Authentication required. Please log in.", 401);

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id).select("+passwordChangedAt");
  if (!user) throw new AppError("User no longer exists.", 401);
  if (!user.isActive) throw new AppError("Your account has been deactivated.", 401);
  if (user.changedPasswordAfter(decoded.iat)) {
    throw new AppError("Password was recently changed. Please log in again.", 401);
  }

  req.user = user;
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch {
    // ignore auth errors for optional auth
  }
  next();
};
