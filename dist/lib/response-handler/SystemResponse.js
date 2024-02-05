"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StatusCodes_1 = __importDefault(require("./StatusCodes"));
class SystemResponse {
    static success(message, data, datalength) {
        return {
            success: true,
            data: data !== null && data !== void 0 ? data : null,
            datalength: datalength !== null && datalength !== void 0 ? datalength : null,
            message: message !== null && message !== void 0 ? message : "SUCCESS",
            status: StatusCodes_1.default.SUCCESS,
        };
    }
    static badRequest(message, error) {
        return SystemResponse.getErrorResponse(message, error, StatusCodes_1.default.BAD_REQUEST);
    }
    static invalidData(message) {
        return {
            success: false,
            message: message !== null && message !== void 0 ? message : "Invalid data",
            status: StatusCodes_1.default.UNPROCESSABLE_ENTITY,
        };
    }
    static notFound(message) {
        return {
            success: false,
            message: message !== null && message !== void 0 ? message : "Data not found",
            status: StatusCodes_1.default.NOT_FOUND,
        };
    }
    static unAuthenticated(message) {
        return {
            success: false,
            message: message !== null && message !== void 0 ? message : "Unauthorized",
            status: StatusCodes_1.default.FORBIDDEN
        };
    }
    static getErrorResponse(message, error, code) {
        return {
            success: false,
            error: error !== null && error !== void 0 ? error : null,
            message: message !== null && message !== void 0 ? message : "Internal Server achhha Error",
            status: code !== null && code !== void 0 ? code : StatusCodes_1.default.INTERNAL_SERVER_ERROR,
        };
    }
}
exports.default = SystemResponse;
