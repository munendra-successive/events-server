"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const SystemResponse_1 = __importDefault(require("../lib/response-handler/SystemResponse"));
class OtherMiddleware {
}
OtherMiddleware.addCustomHeader = (req, res, next) => {
    res.setHeader("customHeader", "X-myCustomHeader");
    next();
};
OtherMiddleware.Logger = (req, res, next) => {
    logger_1.default.log("info", `Method is ${req.method}, Urls is ${req.originalUrl}`);
    next();
};
OtherMiddleware.validateQuery = (req, res, next) => {
    try {
        const { current, pageSize } = req.query;
        const limit = parseInt(pageSize, 10);
        const skip = (parseInt(current, 10) - 1) *
            parseInt(pageSize, 10);
        if (isNaN(limit) || isNaN(skip)) {
            return res
                .status(422)
                .send(SystemResponse_1.default.invalidData("current or pageSize is not a number"));
        }
        next();
    }
    catch (error) {
        logger_1.default.error(`Middleware - validate query`);
        return res
            .status(500)
            .send(SystemResponse_1.default.getErrorResponse("Error in validating query", error));
    }
};
exports.default = OtherMiddleware;
