"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BulkSchema = new mongoose_1.Schema({
    uploadId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    noOfItemsToBeInserted: { type: Number, required: true },
    fileName: { type: String, required: true },
    successfulInserted: { type: Number, required: true },
    failedDuringInsert: { type: Number, required: true },
}, {
    timestamps: true,
});
exports.default = BulkSchema;
