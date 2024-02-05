"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User API - Login
 *     summary: Give access to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "monu@gmail.com"
 *              password:
 *                type: password
 *                example: "MOnu@123"
 *     responses:
 *       '200':
 *         description: Vaild User.
 *       '401':
 *         description: Invalid Credentials
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/login")
    .post(middleware_1.Authentication.authenticate, controller_1.default.login);
router.route("/verify-token").get(middleware_1.Authentication.validateToken);
/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - User API - Register
 *     summary: Give access to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "munendra kushwaha"
 *              email:
 *                type: string
 *                example: "munendra@gmail.com"
 *              password:
 *                type: password
 *                example: "Monu@4556"
 *              address:
 *                type: string
 *                example: "Mathura, Uttar Pradesh"
 *              phone:
 *                type: string
 *                example: "9878423898"
 *     responses:
 *       '200':
 *         description: Registered Successfully
 *       '400':
 *         description: Not Registered
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/register")
    .post(middleware_1.Validation.validate, controller_1.default.register);
exports.default = router;
