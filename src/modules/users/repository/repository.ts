import type mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from ".";
import { type IUser } from "../entities";
import { BaseRepository } from "../../../lib/index";
import logger from "../../../utils/logger";

class Repository extends BaseRepository<IUser> {
  private readonly userModel: mongoose.Model<IUser>;

  constructor() {
    super(UserModel);
    this.userModel = UserModel;
  }

  public async register(regData: IUser): Promise<any> {
    logger.info("User Repository -  register");
    const existUser: IUser | null = await this.userModel.findOne({
      email: regData.email,
    });
    if (!existUser) {
      const hashPassword: string = await bcrypt.hash(regData.password, 10);
      const newUser: any = {
        ...regData,
        password: hashPassword,
      };
      return await this.userModel.create(newUser);
    }
    return { message: "User already exist" };
  }

  public async findByEmail(email: string): Promise<any> {
    return await this.userModel.find({ email }).select("email");
  }
}
export default new Repository();
