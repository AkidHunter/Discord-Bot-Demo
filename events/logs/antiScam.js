const { Message, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const DB = require("../../schema/antiScam");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   */
  async execute(message) {
    DB.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (!data) return;
      if(err) throw err;
      const array = require(`../../validation/scamlink.json`);
      if (array.some((word) => message.content.toLowerCase().includes(word))) {
        message.delete();
        const Ex = new MessageEmbed()
          .setTitle("Link detected")
          .setColor(config.Warna)
          .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
          .setDescription(`Please don't send any link messages. Thank you.`)
          .addField(
            "User:",
            `\`\`\`${message.author.tag} (${message.author.id})\`\`\``
          )
          .addField("Message Content:", `\`\`\`${message.content}\`\`\``)
          .setTimestamp();
        
        await message.guild.channels.cache.get(data.Channel).send({embeds: [Ex]});
      }
    });
  },
};
