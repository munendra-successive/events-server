import { type Document, type FilterQuery, type Model } from "mongoose";
import type mongoose from "mongoose";
import logger from "../../utils/logger";

class BaseRepository<T extends Document> {
  private readonly model: mongoose.Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async insert(data: T): Promise<any> {
    logger.info("BaseRepository - insert");
    return await this.model.insertMany(data);
  }

  public async findByField(filter: FilterQuery<T>): Promise<any> {
    logger.info("BaseRepository - findByField");
    return await this.model
      .find(filter)
      .select("-_id -__v -createdAt -updatedAt -createdBy -updatedBy");
  }
}

export default BaseRepository;
