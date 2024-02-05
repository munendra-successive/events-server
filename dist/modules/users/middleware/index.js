"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = exports.Authentication = void 0;
const authenticate_1 = __importDefault(require("./authenticate"));
exports.Authentication = authenticate_1.default;
const validate_1 = __importDefault(require("./validate"));
exports.Validation = validate_1.default;
