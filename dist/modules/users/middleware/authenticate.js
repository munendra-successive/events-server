"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const logger_1 = __importDefault(require("../../../utils/logger"));
const SystemResponse_1 = __importDefault(require("../../../lib/response-handler/SystemResponse"));
const __1 = require("..");
class Authentication {
    constructor() {
        this.secretKey = config_1.default.jwtSecret;
        this.validateRequest = async (req, res, next) => {
            logger_1.default.info("Validate Request ");
            try {
                const token = req.header("authorization");
                logger_1.default.info(`token is: ${token}`);
                if (!token) {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
                const { email } = jsonwebtoken_1.default.verify(token, this.secretKey);
                const user = await __1.Service.findByEmail(email);
                if (user)
                    next();
                else {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError ||
                    error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse("Internal Server Error"));
            }
        };
        this.validateToken = async (req, res, next) => {
            logger_1.default.info("Validate Token");
            try {
                const token = req.header("authorization");
                logger_1.default.info(`token is: ${token}`);
                if (!token) {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
                const { email } = jsonwebtoken_1.default.verify(token, this.secretKey);
                const user = await __1.Service.findByEmail(email);
                if (user) {
                    return res.status(200).send(SystemResponse_1.default.success("Token is Valid"));
                }
                else {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError ||
                    error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    return res
                        .status(403)
                        .send(SystemResponse_1.default.unAuthenticated("UnAuthorized"));
                }
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse("Internal Server Error"));
            }
        };
        this.authenticate = (req, res, next) => {
            logger_1.default.info("Authentication - authenticate");
            const token = req.header("authorization");
            if (!token) {
                next();
                return;
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.secretKey);
                return res.status(200).json({
                    message: "Login Successful",
                    details: decoded,
                    tokenIs: token,
                });
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    next();
                    return;
                }
                return res.status(403).json({ message: error });
            }
        };
    }
}
exports.default = new Authentication();
