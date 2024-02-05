"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const joiSchema_1 = __importDefault(require("./joiSchema"));
const modelError_1 = __importDefault(require("./repositoryBulk/modelError"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const index_1 = require("./index");
const SystemResponse_1 = __importDefault(require("../../lib/response-handler/SystemResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../../utils/logger"));
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Controller {
    constructor() {
        this.secretKey = config_1.default.jwtSecret;
        this.get = async (req, res) => {
            try {
                logger_1.default.info("Event Controller - get ");
                const { current, pageSize, query } = req.query;
                const limit = parseInt(pageSize, 10);
                const skip = (parseInt(current, 10) - 1) *
                    parseInt(pageSize, 10);
                if (!query) {
                    const data = await index_1.Service.getLimit(limit, skip);
                    return res
                        .status(200)
                        .send(SystemResponse_1.default.success("Data Retrieved Successfully", data.data, data.datalength));
                }
                if (String(query).endsWith("Filter")) {
                    const type = String(query).replace("Filter", "");
                    const data = await index_1.Service.findByType(type, limit, skip);
                    return res
                        .status(200)
                        .send(SystemResponse_1.default.success("Data Retrieved Successfully", data.data, data.datalength));
                }
                const data = await index_1.Service.search(query, limit, skip);
                return res
                    .status(200)
                    .send(SystemResponse_1.default.success("Data Retrieved Successfully", data.data, data.datalength));
            }
            catch (error) {
                logger_1.default.error(`Event Cotroller - get`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "Error in getting data", error));
            }
        };
        this.getByUploadId = async (req, res) => {
            try {
                logger_1.default.info("Event Controller - getByUploadId");
                const { uploadId } = req.params;
                const { current, pageSize } = req.query;
                const limit = parseInt(pageSize, 10);
                const skip = (parseInt(current, 10) - 1) *
                    parseInt(pageSize, 10);
                const data = await index_1.Service.getByUploadId(uploadId, limit, skip);
                const count = await modelError_1.default.countDocuments({ uploadId: uploadId });
                return res
                    .status(200)
                    .send(SystemResponse_1.default.success("Data Retrieved Successfully", data, count));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - getByUploadId error: ${error}`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse(error === null || error === void 0 ? void 0 : error.message, error));
            }
        };
        this.getBulk = async (req, res) => {
            try {
                logger_1.default.info("Event Controller - getBulk");
                const response = await index_1.Service.getBulk();
                return res
                    .status(200)
                    .send(SystemResponse_1.default.success("Data Retrieved Successfully", response));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - getBulk`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "error in getting bulk uploaded data", error));
            }
        };
        this.add = async (req, res) => {
            try {
                logger_1.default.info("Event Controller - add/create");
                const token = req.header("authorization");
                const decoded = jsonwebtoken_1.default.verify(token, this.secretKey);
                const eventData = req.body;
                joiSchema_1.default.bulkUpload().validate(eventData, {
                    abortEarly: false,
                });
                eventData.createdBy = decoded.email;
                await index_1.Service.add(eventData);
                return res
                    .status(200)
                    .send(SystemResponse_1.default.success("Event added Successfully"));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - add/create`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "Error in creating an event", error));
            }
        };
        this.getById = async (req, res) => {
            try {
                logger_1.default.info("Event Controller - start getById");
                const { id } = req.params;
                if (!mongoose_1.default.isValidObjectId(id)) {
                    return res.status(422).send(SystemResponse_1.default.invalidData("Invalid ID"));
                }
                const event = await index_1.Service.findById(id);
                if (event.length !== 0) {
                    return res
                        .status(200)
                        .send(SystemResponse_1.default.success("Data retrieved Successfully", event));
                }
                logger_1.default.info("Event Controller - end getById");
                return res.status(404).send(SystemResponse_1.default.notFound("Event not found"));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - getById `);
                return res
                    .status(500)
                    .json(SystemResponse_1.default.getErrorResponse(error === null || error === void 0 ? void 0 : error.message, "Error in finding an event by id", error));
            }
        };
        this.updateById = async (req, res) => {
            logger_1.default.info("Event Controller - updateById");
            const eventId = req.params.id;
            const dataToUpdate = req.body;
            if (!mongoose_1.default.isValidObjectId(eventId)) {
                return res.status(422).send(SystemResponse_1.default.invalidData("Invalid ID"));
            }
            try {
                const token = req.header("authorization");
                const decoded = jsonwebtoken_1.default.verify(token, this.secretKey);
                dataToUpdate.updatedBy = decoded.email;
                const updatedEvent = await index_1.Service.UpdateById(eventId, dataToUpdate);
                if (updatedEvent) {
                    return res
                        .status(200)
                        .send(SystemResponse_1.default.success("Data updated Successfully", updatedEvent));
                }
                return res
                    .status(400)
                    .send(SystemResponse_1.default.badRequest("Event not updated"));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - updateById error: ${error}`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "Error in updating an event by id", error));
            }
        };
        this.deleteById = async (req, res) => {
            logger_1.default.info("Event Controller - deleteById");
            const eventId = req.params.id;
            if (!mongoose_1.default.isValidObjectId(eventId)) {
                return res.status(422).send(SystemResponse_1.default.invalidData("Invalid ID"));
            }
            try {
                const response = await index_1.Service.deleteById(eventId);
                return res
                    .status(200)
                    .send(SystemResponse_1.default.success("Data deleted Successfully", response));
            }
            catch (error) {
                logger_1.default.error(`Event Controller - deleteById error: ${error}`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "Error in deleting an event by id", error));
            }
        };
        this.uploadCsv = async (req, res) => {
            var _a, _b;
            try {
                logger_1.default.info("Event Controller - uploadCsv");
                const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
                const token = req.header("authorization");
                const decoded = jsonwebtoken_1.default.verify(token, this.secretKey);
                const filePath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
                if (!filePath) {
                    return res
                        .status(400)
                        .send(SystemResponse_1.default.badRequest("No file provided"));
                }
                const dataToInsert = [];
                const validData = [];
                const invalidData = [];
                const startTime = new Date().toLocaleString();
                const uploadId = new Date().getTime().toString();
                fs_1.default.createReadStream(filePath)
                    .pipe((0, csv_parser_1.default)())
                    .on("data", async (row) => {
                    await this.processRow(row, dataToInsert);
                })
                    .on("end", async () => {
                    await this.validateCsvData(dataToInsert, decoded.email, validData, invalidData, uploadId);
                    // Remove the uploaded CSV file after processing
                    fs_1.default.unlinkSync(filePath);
                    await this.uploadValidData(validData);
                    await this.uploadInValidData(invalidData);
                    const endTime = new Date().toLocaleString();
                    const csvlogData = {
                        uploadId,
                        startTime,
                        endTime,
                        noOfItemsToBeInserted: dataToInsert.length,
                        successfulInserted: validData.length,
                        failedDuringInsert: invalidData.length,
                        fileName,
                    };
                    await index_1.Service.logCsvData(csvlogData);
                    return res
                        .status(200)
                        .send(SystemResponse_1.default.success("File uploaded Successfully"));
                });
            }
            catch (error) {
                logger_1.default.error(`Event Controller - uploadCsv error:${error}`);
                return res
                    .status(500)
                    .send(SystemResponse_1.default.getErrorResponse((error === null || error === void 0 ? void 0 : error.message) || "Error in uploading csv file", error));
            }
        };
        this.processRow = async (row, dataToInsert) => {
            // Process each row of the CSV and construct the data to be inserted
            // Customize this part according to your CSV columns and schema
            dataToInsert.push({
                name: row.name,
                address: {
                    street: row.street,
                    city: row.city,
                    state: row.state,
                    postalCode: row.postalCode,
                    country: row.country,
                },
                description: row.description,
                startDate: row.startDate,
                endDate: row.endDate,
                category: row.category,
                organizerInfo: row.organizerInfo,
                type: row.type,
                status: row.status,
            });
        };
        this.validateCsvData = async (dataToInsert, email, validData, invalidData, uploadId) => {
            dataToInsert.forEach((item, index) => {
                const { error } = joiSchema_1.default.bulkUpload().validate(item, {
                    abortEarly: false,
                });
                if (!error) {
                    item.createdBy = email;
                    validData.push(item);
                }
                else {
                    invalidData.push({
                        rowNumber: index + 1,
                        uploadId,
                        errorMessage: error === null || error === void 0 ? void 0 : error.details.map((items) => items.message),
                    });
                }
            });
        };
        this.uploadValidData = async (validData) => {
            let currentIndex = 0;
            while (currentIndex < validData.length) {
                const chunk = validData.slice(currentIndex, currentIndex + 100000);
                await index_1.Service.uploadCsv(chunk);
                currentIndex += 100000;
            }
        };
        this.uploadInValidData = async (invalidData) => {
            let currentIndex = 0;
            while (currentIndex < invalidData.length) {
                const chunk = invalidData.slice(currentIndex, currentIndex + 100000);
                await index_1.Service.csvError(chunk);
                currentIndex += 100000;
            }
        };
    }
}
exports.default = new Controller();
