"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const repository_1 = require("./repository");
const config_1 = __importDefault(require("../../config"));
const logger_1 = __importDefault(require("../../utils/logger"));
class Service {
    constructor() {
        this.secretKey = config_1.default.jwtSecret;
    }
    generateToken(loginData) {
        logger_1.default.info("User Service - generateToken");
        const token = jsonwebtoken_1.default.sign(loginData, this.secretKey, {
            expiresIn: "30m",
        });
        return token;
    }
    async login(loginData) {
        logger_1.default.info("User Service - login");
        const { email, password } = loginData;
        const filter = { email };
        const user = await repository_1.Repository.findByField(filter);
        if (user.length > 0) {
            const result = await bcrypt_1.default.compare(password, user[0].password);
            return result;
        }
        return false;
    }
    async findByEmail(email) {
        logger_1.default.info("User Service - findByEmail");
        return await repository_1.Repository.findByEmail(email);
    }
    async register(regData) {
        logger_1.default.info("User Service - register");
        return await repository_1.Repository.register(regData);
    }
}
exports.default = new Service();
