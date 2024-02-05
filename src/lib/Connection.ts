import mongoose from "mongoose";
import serverConfig from "../config";
import logger from "../utils/logger";
class Connection {
  private readonly URI = serverConfig.mongoUrl;

  connectDb = async (): Promise<any> => {
    try {
      await mongoose.connect(this.URI);
      logger.log("info", "Connection Successful");
    } catch (error) {
      logger.error(`Database Connection Failed: ${error}`);
    }
  };

  disconnectDb = async (): Promise<any> => {
    try {
      await mongoose.disconnect();
      logger.info("Disconnected successfully");
    } catch (error) {
      logger.error(`Error in disconnect", ${error}`);
    }
  };
}

export default new Connection();
