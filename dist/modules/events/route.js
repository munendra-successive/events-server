"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const _1 = require(".");
const middleware_1 = require("../users/middleware");
const middlewares_1 = __importDefault(require("../../middlewares"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
/**
 * @swagger
 * /events/create:
 *   post:
 *     tags:
 *       - Events API -Create an new event
 *     summary: Create an event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Conference Event - 4860"
 *                 description: Name of the event.
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "598 Elm St."
 *                   city:
 *                     type: string
 *                     example: "New York"
 *
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   postalCode:
 *                     type: string
 *                     example: "19236"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               description:
 *                 type: string
 *                 example: "A Conference event happening in the heart of Seattle."
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-19T18:30:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-29T18:30:00.000Z"
 *               category:
 *                 type: string
 *                 example: "Theater"
 *               organizerInfo:
 *                 type: string
 *                 example: "Eventbrite"
 *               type:
 *                 type: string
 *                 example: "Class"
 *               status:
 *                 type: string
 *                 example: "Registration open"
 *     responses:
 *       '200':
 *         description: An created successfully.
 *       '500':
 *         description: Internal server error.
 */
router.route("/create").post(middleware_1.Authentication.validateRequest, _1.Controller.add);
/**
 * @swagger
 * /events/getBulk:
 *   get:
 *     tags:
 *       -  Events API - Get details of bulk uploaded events"
 *     summary: Returns all bulk uploaded records.
 *     responses:
 *       '200':
 *         description: Details retrieved successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/getBulk")
    .get(middleware_1.Authentication.validateRequest, _1.Controller.getBulk);
/**
 * @swagger
 * /events/get:
 *   get:
 *     tags:
 *       -  Events API - Get numbers of event with search filter or without search filter"
 *     summary: Returns events based on current size and pageSize.
 *     parameters:
 *       - name: current
 *         in: query
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "1"
 *       - name: pageSize
 *         in: query
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "10"
 *       - name: query
 *         in: query
 *         required: false
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "GameFilter"
 *     responses:
 *       '200':
 *         description: An events retrieved successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/get")
    .get(middleware_1.Authentication.validateRequest, middlewares_1.default.validateQuery, _1.Controller.get);
/**
 * @swagger
 * /events/getById/{id}:
 *   get:
 *     tags:
 *       -  Events API - Get an Events by id"
 *     summary: Returns all events.
 *     description: Retrieves a events matched to that id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "658978c8b133a70e00173968"
 *     responses:
 *       '200':
 *         description: An events retrieved successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/getById/:id")
    .get(middleware_1.Authentication.validateRequest, _1.Controller.getById);
/**
 * @swagger
 * /events/updateById/{id}:
 *   put:
 *     tags:
 *       - Events API - Update an Events by id
 *     summary: Update an event.
 *     description: Update an event matched to the specified ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Conference Event - 4860"
 *                 description: Name of the event.
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "598 Elm St."
 *                   city:
 *                     type: string
 *                     example: "New York"
 *
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   postalCode:
 *                     type: string
 *                     example: "19236"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               description:
 *                 type: string
 *                 example: "A Conference event happening in the heart of Seattle."
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-19T18:30:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-29T18:30:00.000Z"
 *               category:
 *                 type: string
 *                 example: "Theater"
 *               organizerInfo:
 *                 type: string
 *                 example: "Eventbrite"
 *               type:
 *                 type: string
 *                 example: "Class"
 *               status:
 *                 type: string
 *                 example: "Registration open"
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "658978c8b133a70e00173968"
 *     responses:
 *       '200':
 *         description: An event updated successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/updateById/:id")
    .put(middleware_1.Authentication.validateRequest, _1.Controller.updateById);
/**
 * @swagger
 * /events/deleteById/{id}:
 *   delete:
 *     tags:
 *       - Events API - Delete an event by id
 *     summary: Delete all events matched to that id.
 *     description: Delete all events matched to that id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "658978c8b133a70e00173968"
 *     responses:
 *       '200':
 *         description: An events deleted successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/deleteById/:id")
    .delete(middleware_1.Authentication.validateRequest, _1.Controller.deleteById);
/**
 * @swagger
 * /events/getByUploadId/{uploadId}:
 *   get:
 *     tags:
 *       -  Events API - Get an details of all errors occured in bulk Upload"
 *     summary: Returns details of bulkupload errors according to current page and pageSize.
 *     parameters:
 *       - name: uploadId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "1704967600601"
 *       - name: current
 *         in: query
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "1"
 *       - name: pageSize
 *         in: query
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       '200':
 *         description: details of errors retrieved successfully.
 *       '400':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/getByUploadId/:uploadId")
    .get(middleware_1.Authentication.validateRequest, _1.Controller.getByUploadId);
/**
 * @swagger
 * /events/upload:
 *   post:
 *     tags:
 *       -  Events API - Bulk Upload
 *     summary: Uploads a CSV file.
 *     description: Endpoint to upload a CSV file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully.
 *       '400':
 *         description: Bad request or invalid file format.
 *       '500':
 *         description: Internal server error.
 */
router
    .route("/upload")
    .post(middleware_1.Authentication.validateRequest, upload.single("csvFile"), _1.Controller.uploadCsv);
exports.default = router;
