import { Response, Request, NextFunction } from "express";

export const verifySession = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const user = req.session.user;
  console.log("req.session", req.session);
  if (!user) {
  return res
    .status(200)
    .json({ data: null, message: "Please log in!", success: false });
  }

  next();
};
