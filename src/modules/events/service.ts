import { type IEvent } from "./entities";
import { Repository } from "./repository";
import logger from "../../utils/logger";

class Service {
  search = async (
    searchQuery: any,
    limit: number,
    skip: number
  ): Promise<any> => {
    logger.info("Event Service - Search");
    const filter = { $text: { $search: searchQuery } };
    return await Repository.search(filter, limit, skip);
  };
  getByUploadId = async (
    uploadId: string,
    limit: number,
    skip: number
  ): Promise<any> => {
    logger.info("Event Service - getByUploadId");
    return await Repository.getByUploadId(uploadId, limit, skip);
  };

  getBulk = async (): Promise<any> => {
    logger.info("Event Service - getBulk");
    return await Repository.getBulk();
  };

  async add(eventData: IEvent): Promise<any> {
    logger.info("Event Service - add/create");
    return await Repository.insert(eventData);
  }

  async getLimit(limit: number, skip: number): Promise<any> {
    logger.info("Event Service - getLimit");
    return await Repository.getLimit(limit, skip);
  }

  async findByType(type: string, limit: number, skip: number): Promise<any> {
    logger.info("Event Service - findByType");
    return await Repository.findByType(type, limit, skip);
  }

  async findById(_id: string): Promise<any> {
    logger.info("Event Service - findById");
    const filter: { _id: string } = { _id };
    return await Repository.findByField(filter);
  }

  async UpdateById(eventId: string, dataToUpdate: IEvent): Promise<any> {
    logger.info("Event Service - UpdateById");
    return await Repository.UpdateById(eventId, dataToUpdate);
  }

  async deleteById(eventId: string): Promise<any> {
    logger.info("Event Service - deleteById");
    return await Repository.deleteById(eventId);
  }

  async uploadCsv(data: IEvent[]): Promise<any> {
    logger.info("Event Service - uploadCsv");
    return Repository.uploadCsv(data);
  }
  async csvError(errorData: any): Promise<any> {
    logger.info("Event Service - csvError");
    return Repository.csvError(errorData);
  }
  async logCsvData(data:any):Promise<any>{
    logger.info("Event Service - logCsvData")
    return Repository.logCsvData(data);
  }
}
export default new Service();
