const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { Database } = require("../../config.json");
const os = require("os");
const osUtils = require("os-utils");
const chalk = require("chalk");
const ms = require("ms");

const DB = require('../../schema/client');

/* ----------[CPU Usage]---------- */
    const cpus = os.cpus();
    const cpu = cpus[0];

    // Accumulate every CPU times values
        const total = Object.values(cpu.times).reduce(
        (acc, tv) => acc + tv, 0
    );

    // Calculate the CPU usage
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 1000;
    const perc = currentCPUUsage / total * 100;

/* ----------[RAM Usage]---------- */

/**Get the process memory usage (in MB) */
async function getMemoryUsage() {
    return process.memoryUsage().heapUsed / (1024 * 1024).toFixed(2);
}

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log(`${chalk.yellow("[INFO] ")}Logged In As ` + client.user.tag);
        
        // Initializing Database Connection 
            if(!Database) return;
            mongoose.connect(Database, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                console.log(`${chalk.yellow("[INFO] ")}Connected To Database!`);
            }).catch((err) => {
                console.log(err)
            });

        //-------------- Systems --------------//
        require("../../system/chatFilterSys")(client);

        // -------------- Events --------------//

        // Memory Data Update
        let memArray = [];

        setInterval(async () => {

            //Used Memory in GB
            memArray.push(await getMemoryUsage());

            if (memArray.length >= 14) {
                memArray.shift();
            }

            // Store in Database
            await DB.findOneAndUpdate({
                Client: true,
            }, {
                Memory: memArray,
            }, {
                upsert: true,
            });

        }, ms("5s")); //= 5000 (ms)
    },
}
