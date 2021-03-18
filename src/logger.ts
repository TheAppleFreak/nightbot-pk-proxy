import * as winston from "winston";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import { stringify } from "flatted";

import config from "./config";

dayjs.extend(localizedFormat);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label(),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata}) => {
            let msg = `${dayjs(timestamp).format("LT")} [${level}] ${message}`;
            if (metadata.length > 0) {
                msg += stringify(metadata);
            }

            return msg;
        })
    ),
    transports: [new winston.transports.Console({ level: config.logging.level })]
});

export default logger;