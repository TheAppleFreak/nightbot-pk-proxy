// Don't actually put any configuration in here! This module just translates and validates environment variables!
import * as dotenv from "dotenv";
dotenv.config();

import * as env from "env-var";

const useProxy = env.get("USE_PROXY").default("false").asBool();

const config = {
    logging: {
        level: env.get("LOG_LEVEL").default("info").asString(),
        logRequests: env.get("LOG_REQUESTS").default("true").asBool()
    },
    pk: {
        token: env.get("PK_TOKEN").required().asString(),
        systemId: env.get("PK_SYSTEM_ID").default("").asString(),
        systemName: "",
        censoredNames: env.get("CENSORED_NAMES").default("{}").asJsonObject()
    },
    server: {
        port: env.get("PORT").default(5000).asPortNumber()
    },
    proxy: {
        use: useProxy,
        host: env.get("PROXY_HOST").required(useProxy).asString(),
        sshPort: env.get("PROXY_SSH_PORT").default(22).asPortNumber(),
        user: env.get("PROXY_USER").required(useProxy).asString(),
        privateKeyPath: env.get("PROXY_PRIVATE_KEY_PATH").required(useProxy).asString(),
        remotePort: env.get("PROXY_REMOTE_PORT").required(useProxy).asPortNumber()
    }
};

export default config;