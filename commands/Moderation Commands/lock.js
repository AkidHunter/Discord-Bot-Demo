const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../schema/lock");
const ms = require("ms");
const { PLAYERID } = require('../../config.json')

module.exports = {
  name: "lock",
  description: "Lock a channel",
  permission: "MANAGE_CHANNELS",
  options: [
    {
      name: "time",
      description: "Expire date for this lockdown (1m, 1h, 1d)",
      type: "STRING",
    },
    {
      name: "reason",
      description: "Provide a reason for this lockdown.",
      type: "STRING",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel, options } = interaction;

    const Reason = options.getString("reason") || "no specified reason";

    const Embed = new MessageEmbed();

    if (!channel.permissionsFor(PLAYERID).has("SEND_MESSAGES"))
      return interaction.reply({
        embeds: [
          Embed.setColor("RED").setDescription(
            "⛔ | This channel is already locked."
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(PLAYERID, {
      SEND_MESSAGES: false,
    });

    interaction.reply({
      embeds: [
        Embed.setColor("RED").setDescription(
          `🔒 | This channel is now under lockdown for: ${Reason}`
        ),
      ]
    });
    const Time = options.getString("time");
    if (Time) {
      const ExpireDate = Date.now() + ms(Time);
      DB.create({ GuildID: PLAYERID, ChannelID: channel.id, Time: ExpireDate });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(PLAYERID, {
          SEND_MESSAGES: null,
        });
        interaction
          .editReply({
            embeds: [
              Embed.setDescription(
                "🔓 | The lockdown has been lifted"
              ).setColor("GREEN"),
            ], ephemeral: true,
          })
          .catch(() => {});
        await DB.deleteOne({ ChannelID: channel.id });
      }, ms(Time));
    }
  },
};