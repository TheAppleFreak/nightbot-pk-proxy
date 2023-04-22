import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as qs from "qs";
import * as fs from "fs";
import * as path from "path";
import { Socket } from "net";
import { Client as SSHClient, ClientChannel } from "ssh2";
import Axios from "axios";

import logger from "./logger";
import config from "./config";

const axios = Axios.create({
    baseURL: "https://api.pluralkit.me/v2",
    headers: {
        common: {
            Authorization: config.pk.token
        }
    }
});

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
    try {
        const pkResponse = await axios.get(`/systems/${config.pk.systemId}/fronters`);
        const members = pkResponse.data.members;
        
        if (ctx.headers["nightbot-user"]) {
            const userHeaders = qs.parse(ctx.headers["nightbot-user"] as string);
            const provider = (userHeaders.provider as string).toLowerCase().charAt(0).toUpperCase() + (userHeaders.provider as string).slice(1);

            if (config.logging.logRequests) {
                logger.info(`${provider} user "${userHeaders.displayName}" requested the current fronter`);
            } else {
                logger.debug(`${provider} user "${userHeaders.displayName}" requested the current fronter`);
            }
        } else {
            if (config.logging.logRequests) {
                logger.info(`Unknown, non-Nightbot user (IP address ${ctx.ip !== "::ffff:127.0.0.1" ? ctx.ip : ctx.headers["x-forwarded-for"]}) requested the current fronter. This might possibly be a web crawler.`);
            } else {
                logger.debug(`Unknown, non-Nightbot user (IP address ${ctx.ip !== "::ffff:127.0.0.1" ? ctx.ip : ctx.headers["x-forwarded-for"]}) requested the current fronter. This might possibly be a web crawler.`);
            }
        }

        let response = "This stream is brought to you today by ";
        if (members.length > 0) {
            for (let i = 0; i < members.length; i++) {
                let name = members[i].display_name ? members[i].display_name : members[i].name;

                // If the name is on the list of names to censor, swap the string out here
                if (Object.keys(config.pk.censoredNames).includes(members[i].name)) {
                    name = config.pk.censoredNames[name];
                } else if (members[i].visibility === "private" || members[i].name_privacy === "private") {
                    const phrases = [
                        "████████", 
                        "[DATA EXPUNGED]", 
                        "[REDACTED]", 
                        "someone whose true name is incomprehensible by human minds", 
                        "[CLASSIFIED]",
                        "[SEALED BY ORDER OF THE O5 COUNCIL]",
                        "[INFOHAZARD REMOVED]",
                        "[COGNITOHAZARD REMOVED]",
                        "someone who is more powerful than you can possibly imagine",
                        "Lord Princess Dharkon, Destroyer of light, Conjurer of the dark abyss, Slayer of squid folks, the elves know me as the Dark Lord that stole the sun, the dwarves know me as Guardok, the Lord of Breath, and yes there are many forbidden names that if spoken out loud would make your skin turn inside out and all your bones would crumble to dust",
                        "[sorry, it seems the username is in another castle]"
                    ];
                    
                    name = phrases[Math.floor(Math.random() * (phrases.length - 1))];
                }

                if (members.length - 1 - i === 0) {
                    response += `${name}!`;
                } else if (members.length - 1 - i === 1) {
                    response += `${name}${members.length > 2 ? ",": ""} and `;
                } else {
                    response += `${name}, `;
                }
            }
        } else {            
            response += `the ${config.pk.systemName} system!`
        }

        ctx.body = response;

        await next();
    } catch (err) {
        logger.error(`Error fetching data from PluralKit:`, err);
        if (err.response) {
            ctx.body = `Error fetching data from PluralKit (Error ${err.code}), sorry 😢`;
        } else if (err.request) {
            ctx.body = `Error fetching data from PluralKit (no data received), sorry 😢`;
        } else {
            ctx.body = `Error fetching data from PluralKit (unknown issue), sorry 😢`;
        }
    }
});

getPKSystemInfo().then(() => {
    if (config.proxy.use) {
        const conn = new SSHClient();
    
        conn.on("ready", function() {
            logger.debug("SSH client ready");
            conn.forwardIn("", config.proxy.remotePort, (err, port) => {
                if (err) {
                    logger.error(`Could not establish proxy to ${config.proxy.host}:${config.proxy.remotePort}! Check your settings and your internet connection.`);
                    throw err;
                }
                logger.info(`Established proxy to ${config.proxy.host}:${port}. Starting local server...`);
    
                app.listen(config.server.port, () => {
                    logger.info(`Local server listening on port ${config.server.port}. Application is ready.`);
                });
    
                conn.emit("forward-in", port);
            });
        }).on("tcp connection", function(info, accept, reject) {
            let remote: ClientChannel;
            const srcSocket = new Socket();
    
            srcSocket.on("error", err => {
                if (remote === undefined) {
                    reject();
                } else {
                    remote.end();
                }
            });
    
            srcSocket.connect((config.server.port), "localhost", () => {
                remote = accept();
                logger.debug(`Accepted remote connection`);
    
                srcSocket.pipe(remote).pipe(srcSocket);
            });
        }).connect({
            host: config.proxy.host,
            port: config.proxy.sshPort,
            username: config.proxy.user,
            privateKey: fs.readFileSync(path.resolve(__dirname, "..", config.proxy.privateKeyPath))
        });
    } else {
        app.listen(config.server.port, () => {
            logger.info(`Local server listening on port ${config.server.port}. Application is ready.`);
        });
    }
});

async function getPKSystemInfo(): Promise<void> {
    try {
        const response = await axios.get(`/systems/${config.pk.systemId !== "" ? "/" + config.pk.systemId : ""}`);
    
        if (!config.pk.systemName) {
            config.pk.systemName = response.data.name;
        }
        if (!config.pk.systemId) {
            config.pk.systemId = response.data.id;
        }
    
        logger.info(`Retrieved information for system "${config.pk.systemName}" (ID ${config.pk.systemId})`);
    } catch (err) {
        logger.error("Fatal error fetching data from PluralKit:", err);
        process.exit(1);
    }
}
