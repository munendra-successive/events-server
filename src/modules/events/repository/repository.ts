import type IEvent from "../entities/IEvent";
import EventModel from "./model";
import BaseRepository from "../../../lib/base/baseRepository";
import BulkModel from "../repositoryBulk/model";
import BulkErrorModel from "../repositoryBulk/modelError";
import { IBulkError } from "../entities/IBulkError";
import mongoose, { FilterQuery } from "mongoose";
import logger from "../../../utils/logger";
import { IBulkData } from "../entities/IBulkData";

class Repository extends BaseRepository<IEvent> {
  private readonly eventModel: mongoose.Model<IEvent>;
  private readonly bulkErrorModel: mongoose.Model<IBulkError>;
  private readonly bulkModel: mongoose.Model<IBulkData>;

  constructor() {
    super(EventModel);
    this.eventModel = EventModel;
    this.bulkErrorModel = BulkErrorModel;
    this.bulkModel = BulkModel;
  }

  async search(
    filter: FilterQuery<IEvent>,
    limit: number,
    skip: number
  ): Promise<any> {
    logger.info("Event Repository - search");
    const datalength = await this.eventModel.find(filter).countDocuments();
    const data = await this.eventModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .select(
        "-address -startDate -endDate -createdAt -updatedAt -__v -updatedBy -createdBy"
      );
    return { data, datalength };
  }
  async getByUploadId(uploadId: string, limit: number, skip: number) {
    logger.info("Event Repository - getByUploadId");
    return await BulkErrorModel.find({ uploadId }).limit(limit).skip(skip);
  }

  async getBulk(): Promise<any> {
    logger.info("Event Repository - getBulk");
    return await BulkModel.find();
  }

  async getLimit(limit: number, skip: number): Promise<any> {
    logger.info("Event Repository - getLimit");
    const datalength = await this.eventModel.countDocuments();
    const data = await this.eventModel
      .find()
      .limit(limit)
      .skip(skip)
      .select(
        "-address -startDate -endDate -createdAt -updatedAt -__v -updatedBy -createdBy"
      );
    return { data, datalength };
  }

  async findByType(type: string, limit: number, skip: number): Promise<any> {
    try {
      logger.info("Event Repository - findByType");
      const datalength = await this.eventModel
        .find({ type: type })
        .countDocuments();
      const data = await this.eventModel
        .find({ type: type })
        .limit(limit)
        .skip(skip)
        .select(
          "-address -startDate -endDate -createdAt -updatedAt -__v -createdBy -updatedBy"
        );
      return { data, datalength };
    } catch (error) {
      logger.error("Event Repository - findByType");
    }
  }

  async UpdateById(eventId: string, dataToUpdate: IEvent): Promise<any> {
    logger.info("Event Repository - UpdateById");
    return await this.eventModel.findByIdAndUpdate(eventId, dataToUpdate, {
      new: true,
    });
  }

  async deleteById(eventId: string): Promise<any> {
    logger.info("Event Repository - deleteById");
    return await this.eventModel.deleteOne({ _id: eventId });
  }

  async uploadCsv(data: any): Promise<any> {
    logger.info("Event Repository - uploadCsv");
    return this.eventModel.insertMany(data, { ordered: false });
  }
  async csvError(errorData: IBulkError): Promise<any> {
    logger.info("Event Repository - csvError");
    return this.bulkErrorModel.insertMany(errorData);
  }

  async logCsvData(data: any): Promise<any> {
    logger.info("Event Repository - logcsvData");
    return this.bulkModel.create(data);
  }
}

export default new Repository();
