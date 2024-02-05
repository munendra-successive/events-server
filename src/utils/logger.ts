import { createLogger, transports, format } from "winston";
import moment from "moment-timezone";

const logger = createLogger({
  transports: [
    // Info Transport
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(
        format.timestamp({
          format: () =>
            moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        }),
        format.json()
      ),
    }),
  ],
});

export default logger;
