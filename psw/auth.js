import jwt from "jsonwebtoken";

const SECRET = "leyndarmalstoken"; // Þetta á að passa við það sem er í users.js!

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Ekki með token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Ógilt eða útrunnið token" });
  }
};

export default verifyToken;
