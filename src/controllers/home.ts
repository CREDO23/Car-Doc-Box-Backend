import express from "express";
import { Request, Response, NextFunction } from "express";
import httpError, { HttpError } from "http-errors";

export const Home = (req: Request, res: Response, next: NextFunction) => {
  res.json(<IServerResponse>{
    status: 200,
    data: null,
    message: "API : Home",
    error: null,
  });

  // res.json({"name" : "Welcome to the server !"})
};

export const HomeApi = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({
    message: "The CarDocBox API is live !",
  });
};
