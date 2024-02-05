"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
class Connection {
    constructor() {
        this.URI = config_1.default.mongoUrl;
        this.connectDb = async () => {
            try {
                await mongoose_1.default.connect(this.URI);
                logger_1.default.log("info", "Connection Successful");
            }
            catch (error) {
                logger_1.default.error(`Database Connection Failed: ${error}`);
            }
        };
        this.disconnectDb = async () => {
            try {
                await mongoose_1.default.disconnect();
                logger_1.default.info("Disconnected successfully");
            }
            catch (error) {
                logger_1.default.error(`Error in disconnect", ${error}`);
            }
        };
    }
}
exports.default = new Connection();
