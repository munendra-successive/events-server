"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const logger = (0, winston_1.createLogger)({
    transports: [
        // Info Transport
        new winston_1.transports.File({
            filename: "info.log",
            level: "info",
            format: winston_1.format.combine(winston_1.format.timestamp({
                format: () => (0, moment_timezone_1.default)().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
            }), winston_1.format.json()),
        }),
    ],
});
exports.default = logger;
