import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Anda tidak memiliki akses admin" });
  }

  next();
};

export const verifyUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Hanya user biasa yang bisa mengakses endpoint ini" });
  }

  next();
};
