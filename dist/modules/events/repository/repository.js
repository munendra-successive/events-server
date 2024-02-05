"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const baseRepository_1 = __importDefault(require("../../../lib/base/baseRepository"));
const model_2 = __importDefault(require("../repositoryBulk/model"));
const modelError_1 = __importDefault(require("../repositoryBulk/modelError"));
const logger_1 = __importDefault(require("../../../utils/logger"));
class Repository extends baseRepository_1.default {
    constructor() {
        super(model_1.default);
        this.eventModel = model_1.default;
        this.bulkErrorModel = modelError_1.default;
        this.bulkModel = model_2.default;
    }
    async search(filter, limit, skip) {
        logger_1.default.info("Event Repository - search");
        const datalength = await this.eventModel.find(filter).countDocuments();
        const data = await this.eventModel
            .find(filter)
            .limit(limit)
            .skip(skip)
            .select("-address -startDate -endDate -createdAt -updatedAt -__v -updatedBy -createdBy");
        return { data, datalength };
    }
    async getByUploadId(uploadId, limit, skip) {
        logger_1.default.info("Event Repository - getByUploadId");
        return await modelError_1.default.find({ uploadId }).limit(limit).skip(skip);
    }
    async getBulk() {
        logger_1.default.info("Event Repository - getBulk");
        return await model_2.default.find();
    }
    async getLimit(limit, skip) {
        logger_1.default.info("Event Repository - getLimit");
        const datalength = await this.eventModel.countDocuments();
        const data = await this.eventModel
            .find()
            .limit(limit)
            .skip(skip)
            .select("-address -startDate -endDate -createdAt -updatedAt -__v -updatedBy -createdBy");
        return { data, datalength };
    }
    async findByType(type, limit, skip) {
        try {
            logger_1.default.info("Event Repository - findByType");
            const datalength = await this.eventModel
                .find({ type: type })
                .countDocuments();
            const data = await this.eventModel
                .find({ type: type })
                .limit(limit)
                .skip(skip)
                .select("-address -startDate -endDate -createdAt -updatedAt -__v -createdBy -updatedBy");
            return { data, datalength };
        }
        catch (error) {
            logger_1.default.error("Event Repository - findByType");
        }
    }
    async UpdateById(eventId, dataToUpdate) {
        logger_1.default.info("Event Repository - UpdateById");
        return await this.eventModel.findByIdAndUpdate(eventId, dataToUpdate, {
            new: true,
        });
    }
    async deleteById(eventId) {
        logger_1.default.info("Event Repository - deleteById");
        return await this.eventModel.deleteOne({ _id: eventId });
    }
    async uploadCsv(data) {
        logger_1.default.info("Event Repository - uploadCsv");
        return this.eventModel.insertMany(data, { ordered: false });
    }
    async csvError(errorData) {
        logger_1.default.info("Event Repository - csvError");
        return this.bulkErrorModel.insertMany(errorData);
    }
    async logCsvData(data) {
        logger_1.default.info("Event Repository - logcsvData");
        return this.bulkModel.create(data);
    }
}
exports.default = new Repository();
