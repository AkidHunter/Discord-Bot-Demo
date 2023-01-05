const {
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Client,
    CommandInteractionOptionResolver
  } = require("discord.js");
  const suggestDB = require("../../schema/suggest");
  const suggestSetupDB = require("../../schema/suggestSetup");
  module.exports = {
    name: "suggest",
    description: "Create a suggestion.",
    options: [
      {
        name: "type",
        description: "Select a type.",
        required: true,
        type: "STRING",
        choices: [
          {
            name: "Client",
            value: "Client",
          },
          {
            name: "Event",
            value: "Event",
          },
          {
            name: "Discord",
            value: "Discord",
          },
          {
            name: "Other",
            value: "Other",
          },
        ],
      },
      {
        name: "suggestion",
        description: "Describe your suggestion.",
        type: "STRING",
        required: true,
      },
      {
        name: "dm",
        description:
          "Set whether the bot will DM you, once your suggestion has been declined or accepted.",
        type: "BOOLEAN",
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
      const { guildId, member, user, options } = interaction;
  
      const suggestionsSetup = await suggestSetupDB.findOne({ GuildID: guildId });
      let suggestionsChannel;
  
      if (!suggestionsSetup) {
        return await interaction.reply({
     ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(
                `❌ This server has not setup the suggestion system.`
              ),
          ],
        });
      } else {
        suggestionsChannel = interaction.guild.channels.cache.get(
          suggestionsSetup.ChannelID
        );
      }
  
      if (suggestionsSetup.Disabled)
        return await interaction.reply({
     ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`❌ Suggestions are currently disabled.`),
          ],
        });
  
      if (suggestionsSetup.ChannelID === "None")
        return await interaction.reply({
     ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`❌ The suggestion channel hasn't been set.`),
          ],
        });
  
      const type = options.getString("type");
      const suggestion = options.getString("suggestion");
      const DM = options.getBoolean("dm");
  
      const Embed = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`**Suggestion:**\n${suggestion}`)
        .addFields(
          { name: "Type", value: type, inline: true },
          { name: "Status", value: "🕐 Pending", inline: true },
          { name: "Reason", value: "Pending", inline: true }
        )
        .addFields(
          { name: "Upvotes", value: "0", inline: true },
          { name: "Downvotes", value: "0", inline: true },
          { name: "Overall votes", value: "0", inline: true }
        )
        .setTimestamp();
  
      const buttons = new MessageActionRow();
      buttons.addComponents(
        new MessageButton()
          .setCustomId("suggestion-upvote")
          .setLabel(`Upvote`)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("suggestion-downvote")
          .setLabel(`Downvote`)
          .setStyle("DANGER")
      );
  
      try {
        const M = await suggestionsChannel.send({
          embeds: [Embed],
          components: [buttons],
        });
  
        await suggestDB.create({
          GuildID: guildId,
          MessageID: M.id,
          Details: [
            {
              MemberID: member.id,
              Type: type,
              Suggestion: suggestion,
            },
          ],
          MemberID: member.id,
          DM: DM,
          UpvotesMembers: [],
          DownvotesMembers: [],
          InUse: false,
        });
        await interaction.reply({
     ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("ORANGE")
              .setDescription(
                `✅ Hey ${interaction.user.tag}, Your [suggestion](${M.url}) was successfully created and sent to ${suggestionsChannel}`
              ),
          ],
        });
      } catch (err) {
        console.log(err);
        return await interaction.reply({
     ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`❌ An error occured.`),
          ],
        });
      }
    },
  };
  