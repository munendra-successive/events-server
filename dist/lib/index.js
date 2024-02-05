"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = exports.Connection = void 0;
const Connection_1 = __importDefault(require("./Connection"));
exports.Connection = Connection_1.default;
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
exports.BaseRepository = baseRepository_1.default;
