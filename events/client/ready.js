const { Client } = require("discord.js");
const { Database } = require("../../config.json");
const osUtils = require("os-utils");
const ms = require("ms");
const DB = require("../../schema/client");
const mongoose = require("mongoose");
const User = require("../../schema/user");
module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    console.log("The client is now ready!");
    let activities = [`Zybre Discord`, `Zybre Client`, `Zybre Community`],
      i = 0;
    let activities1 = [`WATCHING`, `PLAYING`, `WATCHING`],
      c = 0;
    setInterval(
      () =>
        client.user.setActivity(`${activities[i++ % activities.length]}`, {
          type: `${activities1[c++ % activities1.length]}`,
        }),
      10000
    );

    if (!Database) return;
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client is now connected to the database!");
      })
      .catch((err) => {
        console.log(err);
      });

      const users = await User.find();
      for (let user of users) {
        client.userSettings.set(user.Id, user);
      }

    require('../../handlers/premium.js')(client)
    require("../../system/giveawaySys.js")(client);
    require("../../system/chatFilterSys.js")(client);
    require("../../system/lockdownSys.js")(client);
  },
};
