"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const logger_1 = __importDefault(require("../../utils/logger"));
const SystemResponse_1 = __importDefault(require("../../lib/response-handler/SystemResponse"));
class Controller {
}
_a = Controller;
Controller.login = async (req, res) => {
    try {
        logger_1.default.info("User Controller - login");
        const loginData = req.body;
        if (!loginData.email || !loginData.password) {
            return res.status(401).json({ message: "Invalid Data" });
        }
        const isAuthenticated = await _1.Service.login(loginData);
        if (isAuthenticated) {
            const token = _1.Service.generateToken(loginData);
            return res
                .status(200)
                .json({ message: "Login Successful", tokenIs: token });
        }
        return res.status(401).json({ message: "Invalid credentials" });
    }
    catch (error) {
        logger_1.default.error(`User Controller - login error: ${error}`);
        return res
            .status(500)
            .send(SystemResponse_1.default.getErrorResponse("error in login"));
    }
};
Controller.register = async (req, res) => {
    try {
        logger_1.default.info("User Controller - register");
        const registerData = req.body;
        const response = await _1.Service.register(registerData);
        if (response.message)
            return res.status(409).json({ message: "User already exist" });
        return res.status(200).json({ message: "Registered Successfully" });
    }
    catch (error) {
        logger_1.default.error("User Controller - register");
        return res.status(500).json({ "Error Occured": error });
    }
};
exports.default = Controller;
