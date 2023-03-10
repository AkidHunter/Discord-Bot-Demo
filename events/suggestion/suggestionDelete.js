
const suggestDB = require("../../schema/suggest");
const suggestSetupDB = require("../../schema/suggestSetup");

module.exports = {
    name: 'interactionCreate',

    async execute(message) {

    const suggestSetup = await suggestSetupDB.findOne({ GuildID: message.guild.id });
    if(!suggestSetup) return;
    
    const suggestion = await suggestDB.findOne({GuildID: message.guild.id, MessageID: message.id});
    if(!suggestion) return;

    return suggestDB.deleteOne({GuildID: message.guild.id, MessageID: message.id})
  }
}
