import { type NextFunction, type Request, type Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import serverConfig from "../../../config";
import logger from "../../../utils/logger";
import SystemResponse from "../../../lib/response-handler/SystemResponse";
import { Service } from "..";

class Authentication {
  private readonly secretKey = serverConfig.jwtSecret;

  validateRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    logger.info("Validate Request ");
    try {
      const token: any = req.header("authorization");

      logger.info(`token is: ${token}`);
      if (!token) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }
      const { email } = jwt.verify(token, this.secretKey) as JwtPayload;
      const user = await Service.findByEmail(email);
      if (user) next();
      else {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }

      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("Internal Server Error"));
    }
  };

  validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    logger.info("Validate Token");
    try {
      const token: any = req.header("authorization");
      logger.info(`token is: ${token}`);
      if (!token) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }
      const { email } = jwt.verify(token, this.secretKey) as JwtPayload;
      const user = await Service.findByEmail(email);
      if (user) {
        return res.status(200).send(SystemResponse.success("Token is Valid"));
      } else {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }

      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("Internal Server Error"));
    }
  };

  public authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<any, Record<string, any>> | undefined => {
    logger.info("Authentication - authenticate");
    const token: any = req.header("authorization");

    if (!token) {
      next();
      return;
    }
    try {
      const decoded: string | jwt.JwtPayload = jwt.verify(
        token,
        this.secretKey
      );
      return res.status(200).json({
        message: "Login Successful",
        details: decoded,
        tokenIs: token,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        next();
        return;
      }
      return res.status(403).json({ message: error });
    }
  };
}

export default new Authentication();
