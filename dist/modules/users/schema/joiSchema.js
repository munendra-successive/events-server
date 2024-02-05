"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class JoiSchema {
}
JoiSchema.register = () => joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15)
        .required(),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'in', 'net'] },
    }),
    password: joi_1.default.string()
        .pattern(/^(?=.*[@$])(?=.*[a-zA-Z0-9]).{3,30}$/)
        .required(),
    address: joi_1.default.string().min(10).max(50).required(),
    phone: joi_1.default.string().alphanum().length(10).required(),
});
exports.default = JoiSchema;
