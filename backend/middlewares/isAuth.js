import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "User doesn't have a token" });
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ message: "User doesn't have a valid token" });
    }

    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(500).json({ message: `is auth error ${error}` });
  }
};

export default isAuth;
