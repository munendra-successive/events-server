import { type Response, type Request } from "express";
import { Service } from ".";
import { type ILogin, type IUser } from "./entities";
import logger from "../../utils/logger";
import SystemResponse from "../../lib/response-handler/SystemResponse";
export default class Controller {
  static login = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("User Controller - login");
      const loginData: ILogin = req.body;

      if (!loginData.email || !loginData.password) {
        return res.status(401).json({ message: "Invalid Data" });
      }
      const isAuthenticated: any = await Service.login(loginData);

      if (isAuthenticated) {
        const token: string = Service.generateToken(loginData);
        return res
          .status(200)
          .json({ message: "Login Successful", tokenIs: token });
      }
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      logger.error(`User Controller - login error: ${error}`);
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("error in login"));
    }
  };

  static register = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("User Controller - register");
      const registerData: IUser = req.body;
      const response: any = await Service.register(registerData);
      if (response.message)
        return res.status(409).json({ message: "User already exist" });
      return res.status(200).json({ message: "Registered Successfully" });
    } catch (error) {
      logger.error("User Controller - register");
      return res.status(500).json({ "Error Occured": error });
    }
  };
}
