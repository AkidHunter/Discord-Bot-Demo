const { Events } = require("../validation/eventNames");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

module.exports = async (client) => {
    const Table = new Ascii("Events Loaded");

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/events/*/*.js`)).map(async (file) => {
        const event = require(file);
        const L = file.split("/");

        if (event.name) {
            if(!Events.includes(event.name))
            return Table.addRow(`${event.name || "MISSING"}`, `⛔ Event name is either invalid or missing ${L[6] + `/` + L[7]}`);
        }

        if(event.once)
        client.once(event.name, (...args) => event.execute(...args, client));
        else
        client.on(event.name, (...args) => event.execute(...args, client));
        
        await Table.addRow(event.name, "✔️ SUCCESSFUL")
    });
    
    console.log(Table.toString());
}