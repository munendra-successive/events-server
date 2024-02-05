"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const _1 = require(".");
const index_1 = require("../../../lib/index");
const logger_1 = __importDefault(require("../../../utils/logger"));
class Repository extends index_1.BaseRepository {
    constructor() {
        super(_1.UserModel);
        this.userModel = _1.UserModel;
    }
    async register(regData) {
        logger_1.default.info("User Repository -  register");
        const existUser = await this.userModel.findOne({
            email: regData.email,
        });
        if (!existUser) {
            const hashPassword = await bcrypt_1.default.hash(regData.password, 10);
            const newUser = Object.assign(Object.assign({}, regData), { password: hashPassword });
            return await this.userModel.create(newUser);
        }
        return { message: "User already exist" };
    }
    async findByEmail(email) {
        return await this.userModel.find({ email }).select("email");
    }
}
exports.default = new Repository();
