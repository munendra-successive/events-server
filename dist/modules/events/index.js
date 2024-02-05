"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.router = exports.Controller = void 0;
const controller_1 = __importDefault(require("./controller"));
exports.Controller = controller_1.default;
const route_1 = __importDefault(require("./route"));
exports.router = route_1.default;
const service_1 = __importDefault(require("./service"));
exports.Service = service_1.default;
