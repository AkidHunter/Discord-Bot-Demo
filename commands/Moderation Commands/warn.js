const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const warnModel = require("../../schema/warn");

module.exports = {
  name: "warn",
  description: "Warn a user",
  permission: "MUTE_MEMBERS",
  options: [
    {
      name: "target",
      description: "Provide a user to warn.", // Change able
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Provide a reason to warn this user", //Change able.
      type: "STRING",
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const { options, guild } = interaction;
    const reason = options.getString("reason") || "No reason provided";
    const target = options.getMember("target");

    new warnModel({
      userId: target.id,
      guildId: interaction.guild.id,
      moderatorId: interaction.user.id,
      reason,
    }).save();

    const Embed = new MessageEmbed()
      .setTitle("⚠️ Warning ⚠️")
      .setDescription(`Warned ${target} reason:\`${reason}\``);
    let message = interaction.reply({ embeds: [Embed], ephemeral: true });

    const DM = new MessageEmbed()
      .setTitle("⚠️ Warning ⚠️")
      .setDescription(
        `You have been warned on ${interaction.guild.name}, reason:\`${reason}\``
      );

    target.send({ embeds: [DM] }).catch(() => {
      console.log("⛔ Private message blocked by the user");
    });

    const log = new MessageEmbed()
      .setTitle("Logs | ⚠️ Warn ⚠️")
      .addFields(
        { name: "🔒 Action", value: "Warn" },
        { name: "📘 Author", value: `${interaction.member}` },
        { name: "👾 Member", value: `${target}` },
        { name: "📚 Reason", value: `${reason}` }
      )
      .setColor("YELLOW");

    await guild.channels.cache
      .get("970056028991389726")
      .send({ embeds: [log], ephemeral: true });
  },
};
