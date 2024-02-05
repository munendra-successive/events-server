"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BulkErrorSchema = new mongoose_1.Schema({
    uploadId: { type: String, required: true },
    rowNumber: { type: Number, required: true },
    errorMessage: { type: [String], required: true },
});
exports.default = BulkErrorSchema;
