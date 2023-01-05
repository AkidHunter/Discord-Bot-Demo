const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../schema/lock");
const { PLAYERID } = require('../../config.json')

module.exports = {
  name: "unlock",
  description: "Unlock a channel",
  permission: "MANAGE_CHANNELS",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel } = interaction;

    const Embed = new MessageEmbed();

    if (channel.permissionsFor(PLAYERID).has("SEND_MESSAGES"))
      return interaction.reply({
        embeds: [
          Embed.setColor("RED").setDescription(
            "⛔ | This channel is not locked"
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(PLAYERID, {
      SEND_MESSAGES: null,
    });

    await DB.deleteOne({ ChannelID: channel.id });

    interaction.reply({
      embeds: [
        Embed.setColor("GREEN").setDescription(
          "🔓 | Lockdown has been lifted."
        ),
      ], ephemeral: true,
    });
  },
};