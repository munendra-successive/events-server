"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const lib_1 = require("./lib");
const users_1 = require("./modules/users");
const events_1 = require("./modules/events");
const swaggerConfig_1 = __importDefault(require("./docs/swaggerConfig"));
const logger_1 = __importDefault(require("./utils/logger"));
const middlewares_1 = __importDefault(require("./middlewares"));
const config_1 = __importDefault(require("./config"));
class Server {
    constructor() {
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
    }
    async bootstrap() {
        await this.configure();
        this.routes();
    }
    async configure() {
        await lib_1.Connection.connectDb();
        dotenv_1.default.config();
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: "*",
            methods: "GET,POST,PUT,PATCH,DELETE",
            allowedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        }));
        this.app.use(middlewares_1.default.Logger);
        this.app.use(middlewares_1.default.addCustomHeader);
    }
    routes() {
        this.app.use("/users", users_1.router);
        this.app.use("/events", events_1.router);
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
        this.app.use("/health-check", (req, res) => res.status(200).send("Health is ok"));
        this.app.use("*", (req, res) => {
            res.status(404).send("URL not found");
        });
    }
    start() {
        this.app.listen(config_1.default.port, () => {
            logger_1.default.log("info", `listening on port: ${config_1.default.port}`);
        });
    }
}
exports.default = Server;
