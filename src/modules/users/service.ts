import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Repository } from "./repository";
import { type ILogin, type IUser } from "./entities";
import serverConfig from "../../config";
import logger from "../../utils/logger";

class Service {
  private readonly secretKey = serverConfig.jwtSecret;

  generateToken(loginData: ILogin): string {
    logger.info("User Service - generateToken");
    const token: string = jwt.sign(loginData, this.secretKey, {
      expiresIn: "30m",
    });
    return token;
  }

  async login(loginData: ILogin): Promise<any> {
    logger.info("User Service - login");
    const { email, password } = loginData;
    const filter: { email: string } = { email };
    const user: any = await Repository.findByField(filter);

    if (user.length > 0) {
      const result = await bcrypt.compare(password, user[0].password);
      return result;
    }
    return false;
  }
  async findByEmail(email: string): Promise<any> {
    logger.info("User Service - findByEmail");
    return await Repository.findByEmail(email);
  }
  async register(regData: IUser): Promise<any> {
    logger.info("User Service - register");
    return await Repository.register(regData);
  }
}
export default new Service();
