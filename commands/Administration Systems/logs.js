const {
  MessageEmbed,
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
} = require("discord.js");

const db = require("../../schema/logs.js");

module.exports = {
  name: "logs",
  description: "Set up the log system",
  permission: 'ADMINISTRATOR', 
  options: [
    {
      name: "message",
      description:
        "The channel where the logs related to message will be sent.",
      required: false,
      type: "CHANNEL",
    },
    {
      name: "role",
      description: "The channel where the logs related to role will be sent.",
      required: false,
      type: "CHANNEL",
    },
    {
      name: "member",
      description: "The channel where the logs related to member will be sent.",
      required: false,
      type: "CHANNEL",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const message = options.getChannel("message");
    const role = options.getChannel("role");
    const member = options.getChannel("member");

    if (!channel && !message && !role && !member)
      return interaction.reply({
        ephemeral: true,
        content:
          "Seems like none of the options were provided! Please provide atleast one to update!",
      });

    const data = await db.findOne({
      guild: interaction.guild.id,
    });

    const info = {
      message: message ? message.id : data?.info?.message || null,
      role: role ? role.id : data?.info?.role || null,
      member: member ? member.id : data?.info?.member || null,
    };

    if (!data) {
      await db.create({
        guild: interaction.guild.id,
        info,
      });
    } else {
      data.info = info;
      data.save();
    }

    const details = Object.entries(info)
      .map((entry) => {
        const [key, value] = entry;
        if (!value) return;
        return `**${key}** => <#${value}>`;
      })
      .filter((e) => e)
      .join("\n");

    await interaction.reply({
      content: `The logs channels has been updated! Info:\n${details}`,
      ephemeral: true,
    });
  },
};
