"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joiSchema_1 = __importDefault(require("../schema/joiSchema"));
const logger_1 = __importDefault(require("../../../utils/logger"));
class Validation {
}
Validation.validate = (req, res, next) => {
    try {
        logger_1.default.info("Validation - validate");
        joiSchema_1.default.register().validate(req.body, {
            abortEarly: false,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Validation error" });
    }
    next();
    return undefined;
};
exports.default = Validation;
