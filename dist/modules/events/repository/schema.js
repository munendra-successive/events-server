"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
});
const EventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    category: { type: String, required: true },
    organizerInfo: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
}, { timestamps: true });
exports.default = EventSchema;
