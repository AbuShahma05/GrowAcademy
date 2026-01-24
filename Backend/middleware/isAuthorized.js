const isAuthorized = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      console.log("AUTH USER:", req.user);

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions",
          success: false,
        });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Authorization error",
        success: false,
      });
    }
  };
};


export default isAuthorized;
