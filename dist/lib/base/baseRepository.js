"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async insert(data) {
        logger_1.default.info("BaseRepository - insert");
        return await this.model.insertMany(data);
    }
    async findByField(filter) {
        logger_1.default.info("BaseRepository - findByField");
        return await this.model
            .find(filter)
            .select("-_id -__v -createdAt -updatedAt -createdBy -updatedBy");
    }
}
exports.default = BaseRepository;
