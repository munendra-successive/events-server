import { type Response, type Request, type NextFunction } from "express";
import logger from "../utils/logger";
import SystemResponse from "../lib/response-handler/SystemResponse";

class OtherMiddleware {
  static addCustomHeader = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    res.setHeader("customHeader", "X-myCustomHeader");
    next();
  };

  static Logger = (req: Request, res: Response, next: NextFunction): void => {
    logger.log("info", `Method is ${req.method}, Urls is ${req.originalUrl}`);
    next();
  };
  static validateQuery = (
    req: Request,
    res: Response,
    next: NextFunction
  ): any => {
    try {
      const { current, pageSize } = req.query;
      const limit: number = parseInt(pageSize as string, 10);
      const skip: number =
        (parseInt(current as string, 10) - 1) *
        parseInt(pageSize as string, 10);
      if (isNaN(limit) || isNaN(skip)) {
        return res
          .status(422)
          .send(
            SystemResponse.invalidData("current or pageSize is not a number")
          );
      }
      next();
    } catch (error) {
      logger.error(`Middleware - validate query`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse("Error in validating query", error)
        );
    }
  };
}

export default OtherMiddleware;
