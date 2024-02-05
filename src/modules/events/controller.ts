import { type Response, type Request } from "express";
import fs from "fs";
import JoiSchema from "./joiSchema";
import BulkErrorModel from "./repositoryBulk/modelError";
import csvParser from "csv-parser";
import { Service } from "./index";
import { type IEvent } from "./entities";
import SystemResponse from "../../lib/response-handler/SystemResponse";
import { IBulkData } from "./entities/IBulkData";
import mongoose from "mongoose";
import logger from "../../utils/logger";
import serverConfig from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

class Controller {
  private readonly secretKey = serverConfig.jwtSecret;
  get = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - get ");
      const { current, pageSize, query } = req.query;
      const limit: number = parseInt(pageSize as string, 10);
      const skip: number =
        (parseInt(current as string, 10) - 1) *
        parseInt(pageSize as string, 10);
      if (!query) {
        const data = await Service.getLimit(limit, skip);

        return res
          .status(200)
          .send(
            SystemResponse.success(
              "Data Retrieved Successfully",
              data.data,
              data.datalength
            )
          );
      }

      if (String(query).endsWith("Filter")) {
        const type = String(query).replace("Filter", "");
        const data = await Service.findByType(type, limit, skip);
        return res
          .status(200)
          .send(
            SystemResponse.success(
              "Data Retrieved Successfully",
              data.data,
              data.datalength
            )
          );
      }
      const data = await Service.search(query, limit, skip);
      return res
        .status(200)
        .send(
          SystemResponse.success(
            "Data Retrieved Successfully",
            data.data,
            data.datalength
          )
        );
    } catch (error: any) {
      logger.error(`Event Cotroller - get`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "Error in getting data",
            error
          )
        );
    }
  };

  getByUploadId = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - getByUploadId");
      const { uploadId } = req.params;
      const { current, pageSize } = req.query;
      const limit: number = parseInt(pageSize as string, 10);
      const skip: number =
        (parseInt(current as string, 10) - 1) *
        parseInt(pageSize as string, 10);
      const data: any = await Service.getByUploadId(uploadId, limit, skip);
      const count = await BulkErrorModel.countDocuments({ uploadId: uploadId });
      return res
        .status(200)
        .send(
          SystemResponse.success("Data Retrieved Successfully", data, count)
        );
    } catch (error: any) {
      logger.error(`Event Controller - getByUploadId error: ${error}`);
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse(error?.message, error));
    }
  };

  getBulk = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - getBulk");

      const response: IBulkData = await Service.getBulk();

      return res
        .status(200)
        .send(SystemResponse.success("Data Retrieved Successfully", response));
    } catch (error: any) {
      logger.error(`Event Controller - getBulk`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "error in getting bulk uploaded data",
            error
          )
        );
    }
  };

  add = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - add/create");
      const token: any = req.header("authorization");
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;
      const eventData: IEvent = req.body;
      JoiSchema.bulkUpload().validate(eventData, {
        abortEarly: false,
      });
      eventData.createdBy = decoded.email;
      await Service.add(eventData);
      return res
        .status(200)
        .send(SystemResponse.success("Event added Successfully"));
    } catch (error: any) {
      logger.error(`Event Controller - add/create`);

      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "Error in creating an event",
            error
          )
        );
    }
  };

  getById = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - start getById");
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(422).send(SystemResponse.invalidData("Invalid ID"));
      }
      const event: any = await Service.findById(id);

      if (event.length !== 0) {
        return res
          .status(200)
          .send(SystemResponse.success("Data retrieved Successfully", event));
      }
      logger.info("Event Controller - end getById");

      return res.status(404).send(SystemResponse.notFound("Event not found"));
    } catch (error: any) {
      logger.error(`Event Controller - getById `);
      return res
        .status(500)
        .json(
          SystemResponse.getErrorResponse(
            error?.message,
            "Error in finding an event by id",
            error
          )
        );
    }
  };

  updateById = async (req: Request, res: Response): Promise<any> => {
    logger.info("Event Controller - updateById");
    const eventId: string = req.params.id;
    const dataToUpdate: IEvent = req.body;
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(422).send(SystemResponse.invalidData("Invalid ID"));
    }
    try {
      const token: any = req.header("authorization");
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;

      dataToUpdate.updatedBy = decoded.email;
      const updatedEvent: any = await Service.UpdateById(eventId, dataToUpdate);
      if (updatedEvent) {
        return res
          .status(200)
          .send(
            SystemResponse.success("Data updated Successfully", updatedEvent)
          );
      }
      return res
        .status(400)
        .send(SystemResponse.badRequest("Event not updated"));
    } catch (error: any) {
      logger.error(`Event Controller - updateById error: ${error}`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "Error in updating an event by id",
            error
          )
        );
    }
  };

  deleteById = async (req: Request, res: Response): Promise<any> => {
    logger.info("Event Controller - deleteById");
    const eventId: string = req.params.id;
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(422).send(SystemResponse.invalidData("Invalid ID"));
    }
    try {
      const response: any = await Service.deleteById(eventId);
      return res
        .status(200)
        .send(SystemResponse.success("Data deleted Successfully", response));
    } catch (error: any) {
      logger.error(`Event Controller - deleteById error: ${error}`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "Error in deleting an event by id",
            error
          )
        );
    }
  };

  uploadCsv = async (req: Request, res: Response): Promise<any> => {
    try {
      logger.info("Event Controller - uploadCsv");
      const fileName: any = req.file?.originalname;
      const token: any = req.header("authorization");
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;
      const filePath: string | undefined = req.file?.path;
      if (!filePath) {
        return res
          .status(400)
          .send(SystemResponse.badRequest("No file provided"));
      }
      const dataToInsert: any[] = [];
      const validData: any[] = [];
      const invalidData: any[] = [];
      const startTime: string = new Date().toLocaleString();
      const uploadId = new Date().getTime().toString();

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", async (row) => {
          await this.processRow(row, dataToInsert);
        })
        .on("end", async () => {
          await this.validateCsvData(
            dataToInsert,
            decoded.email,
            validData,
            invalidData,
            uploadId
          );

          // Remove the uploaded CSV file after processing
          fs.unlinkSync(filePath);
          await this.uploadValidData(validData);
          await this.uploadInValidData(invalidData);
          const endTime: string = new Date().toLocaleString();
          const csvlogData = {
            uploadId,
            startTime,
            endTime,
            noOfItemsToBeInserted: dataToInsert.length,
            successfulInserted: validData.length,
            failedDuringInsert: invalidData.length,
            fileName,
          };

          await Service.logCsvData(csvlogData);
          return res
            .status(200)
            .send(SystemResponse.success("File uploaded Successfully"));
        });
    } catch (error: any) {
      logger.error(`Event Controller - uploadCsv error:${error}`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "Error in uploading csv file",
            error
          )
        );
    }
  };
  processRow = async (row: any, dataToInsert: any[]) => {
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

  validateCsvData = async (
    dataToInsert: IEvent[],
    email: string,
    validData: IEvent[],
    invalidData: any[],
    uploadId: string
  ) => {
    dataToInsert.forEach((item, index) => {
      const { error } = JoiSchema.bulkUpload().validate(item, {
        abortEarly: false,
      });
      if (!error) {
        item.createdBy = email;
        validData.push(item);
      } else {
        invalidData.push({
          rowNumber: index + 1,
          uploadId,
          errorMessage: error?.details.map((items) => items.message),
        });
      }
    });
  };
  uploadValidData = async (validData: IEvent[]) => {
    let currentIndex = 0;
    while (currentIndex < validData.length) {
      const chunk = validData.slice(currentIndex, currentIndex + 100000);
      await Service.uploadCsv(chunk);
      currentIndex += 100000;
    }
  };
  uploadInValidData = async (invalidData: any[]) => {
    let currentIndex = 0;
    while (currentIndex < invalidData.length) {
      const chunk = invalidData.slice(currentIndex, currentIndex + 100000);
      await Service.csvError(chunk);
      currentIndex += 100000;
    }
  };
}
export default new Controller();
