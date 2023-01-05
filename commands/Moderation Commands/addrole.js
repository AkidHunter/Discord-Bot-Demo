const {
  MessageActionRow,
  MessageSelectMenu,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} = require("discord.js");

module.exports = {
  category: "Configuration",
  name: "addrole",
  description: "Adds a role to a bot's sent message.",
  permission: 'MANAGE_ROLES',
  options: [
    {
      name: "channel",
      description: "The channel for the role",
      type: "CHANNEL",
      required: true,
    },
    {
      name: "role",
      description: "The role.",
      type: "ROLE",
      required: true,
    },
    {
      name: "messageid",
      description: "The id of the message",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const channel = interaction.options.getChannel("channel");
    if (channel.type !== "GUILD_TEXT") {
      return "Please tag a text channel.";
    }

    const role = interaction.options.getRole("role");
    const messageId = interaction.options.getString("messageid");

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    });

    if (!targetMessage) {
      return "Unknown message ID.";
    }

    if (targetMessage.author.id !== client.user?.id) {
      return `Please provide a message ID that was sent from <@${client.user?.id}>`;
    }

    let row = targetMessage.components[0];
    if (!row) {
      row = new MessageActionRow();
    }

    const option = (MessageSelectOptionData = [
      {
        label: role.name,
        value: role.id,
      },
    ]);

    let menu = row.components[0];
    if (menu) {
      for (const o of menu.options) {
        if (o.value === option[0].value) {
          return {
            custom: true,
            content: `<@&${o.value}> is already part of this menu.`,
            allowedMentions: {
              roles: [],
            },
          };
        }
      }

      menu.addOptions(option);
      menu.setMaxValues(menu.options.length);
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId("auto_roles")
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder("Select your roles...")
          .addOptions(option)
      );
    }

    targetMessage.edit({
      components: [row],
    });

    interaction.reply({
      ephemeral: true,
      custom: true,
      content: `Added <@&${role.id}> to the auto roles menu.`,
      allowedMentions: {
        roles: [],
      },
    });
  },
};
