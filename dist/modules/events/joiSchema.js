"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class JoiSchema {
}
JoiSchema.bulkUpload = () => joi_1.default.object({
    name: joi_1.default.string().required().min(5),
    address: joi_1.default.object({
        street: joi_1.default.string().required().min(1),
        city: joi_1.default.string().required().min(1),
        state: joi_1.default.string().required().min(1),
        postalCode: joi_1.default.string().required().min(1),
        country: joi_1.default.string().required().min(1),
    }).required(),
    description: joi_1.default.string().required().min(20).max(100),
    startDate: joi_1.default.date().required().min(10),
    endDate: joi_1.default.date().greater(joi_1.default.ref("startDate")).required().min(10),
    category: joi_1.default.string().required().min(3),
    organizerInfo: joi_1.default.string().required().min(3),
    type: joi_1.default.string().required().min(3),
    status: joi_1.default.string().required().min(3),
});
exports.default = JoiSchema;
