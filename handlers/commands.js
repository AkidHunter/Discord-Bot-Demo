const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const { Perms } = require('../validation/permissions');
const { Client } = require("discord.js");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    const Table = new Ascii("Commands Loaded");

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) 
        return Table.addRow(`${file.split("/")[7]}`, "🔸 FAILED" ,`missing a name.`);

        if (!command.type && !command.description) 
        return Table.addRow(command.name, "🔸 FAILED", "missing a description.");

        if (command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else 
            return Table.addRow(command.name, "🔸 FAILED", `permission is invalid.`);
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "🔹 SUCCESSFUL") ;
    });

    console.log(Table.toString());

    client.on('ready', async () => {
        const mainGuild = await client.guilds.cache.get("969971521017761812");
        mainGuild.commands.set(CommandsArray);
    });
}