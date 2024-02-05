"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
const logger_1 = __importDefault(require("../../utils/logger"));
class Service {
    constructor() {
        this.search = async (searchQuery, limit, skip) => {
            logger_1.default.info("Event Service - Search");
            const filter = { $text: { $search: searchQuery } };
            return await repository_1.Repository.search(filter, limit, skip);
        };
        this.getByUploadId = async (uploadId, limit, skip) => {
            logger_1.default.info("Event Service - getByUploadId");
            return await repository_1.Repository.getByUploadId(uploadId, limit, skip);
        };
        this.getBulk = async () => {
            logger_1.default.info("Event Service - getBulk");
            return await repository_1.Repository.getBulk();
        };
    }
    async add(eventData) {
        logger_1.default.info("Event Service - add/create");
        return await repository_1.Repository.insert(eventData);
    }
    async getLimit(limit, skip) {
        logger_1.default.info("Event Service - getLimit");
        return await repository_1.Repository.getLimit(limit, skip);
    }
    async findByType(type, limit, skip) {
        logger_1.default.info("Event Service - findByType");
        return await repository_1.Repository.findByType(type, limit, skip);
    }
    async findById(_id) {
        logger_1.default.info("Event Service - findById");
        const filter = { _id };
        return await repository_1.Repository.findByField(filter);
    }
    async UpdateById(eventId, dataToUpdate) {
        logger_1.default.info("Event Service - UpdateById");
        return await repository_1.Repository.UpdateById(eventId, dataToUpdate);
    }
    async deleteById(eventId) {
        logger_1.default.info("Event Service - deleteById");
        return await repository_1.Repository.deleteById(eventId);
    }
    async uploadCsv(data) {
        logger_1.default.info("Event Service - uploadCsv");
        return repository_1.Repository.uploadCsv(data);
    }
    async csvError(errorData) {
        logger_1.default.info("Event Service - csvError");
        return repository_1.Repository.csvError(errorData);
    }
    async logCsvData(data) {
        logger_1.default.info("Event Service - logCsvData");
        return repository_1.Repository.logCsvData(data);
    }
}
exports.default = new Service();
