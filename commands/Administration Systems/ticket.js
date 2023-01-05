const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const DB = require("../../schema/ticketSetup");

module.exports = {
  name: "ticketsetup",
  description: "Setup your ticketing message.",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "Select the ticket creation channel",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "category",
      description: "Select the ticket channels's creation category.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_CATEGORY"],
    },
    {
      name: "transcripts",
      description: "Select the transcripts channel.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "handlers",
      description: "Select the ticket handler's role.",
      required: true,
      type: "ROLE",
    },
    {
      name: "everyone",
      description: "Provide the @everyone role. ITS IMPORTANT!",
      required: true,
      type: "ROLE",
    },
    {
      name: "description",
      description: "Set the description of the ticket creation channel.",
      required: true,
      type: "STRING",
    },
    {
      name: "firstbutton",
      description:
        "Give your first button a name and add an emoji by adding a comma followed by the emoji.",
      required: true,
      type: "STRING",
    },
    {
      name: "secondbutton",
      description:
        "Give your second button a name and add an emoji by adding a comma followed by the emoji.",
      required: true,
      type: "STRING",
    },
    {
      name: "thirdbutton",
      description:
        "Give your third button a name and add an emoji by adding a comma followed by the emoji.",
      required: true,
      type: "STRING",
    },
    {
      name: "forthbutton",
      description:
        "Give your forth button a name and add an emoji by adding a comma followed by the emoji.",
      required: true,
      type: "STRING",
    },
    {
      name: "fifthbutton",
      description:
        "Give your fifth button a name and add an emoji by adding a comma followed by the emoji.",
      required: true,
      type: "STRING",
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;

    try {
      const Channel = options.getChannel("channel");
      const Category = options.getChannel("category");
      const Transcripts = options.getChannel("transcripts");
      const Handlers = options.getRole("handlers");
      const Everyone = options.getRole("everyone");

      const Description = options.getString("description").replaceAll('\\n', '\n')

      const Button1 = options.getString("firstbutton").split(",");
      const Button2 = options.getString("secondbutton").split(",");
      const Button3 = options.getString("thirdbutton").split(",");
      const Button4 = options.getString("forthbutton").split(",");
      const Button5 = options.getString("fifthbutton").split(",");

      const Emoji1 = Button1[1];
      const Emoji2 = Button2[1];
      const Emoji3 = Button3[1];
      const Emoji4 = Button4[1];
      const Emoji5 = Button5[1];

      await DB.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: Channel.id,
          Category: Category.id,
          Transcripts: Transcripts.id,
          Handlers: Handlers.id,
          Everyone: Everyone.id,
          Description: Description,
          Buttons: [Button1[0], Button2[0], Button3[0], Button4[0], Button5[0]],
        },
        {
          new: true,
          upsert: true,
        }
      );

      const Buttons = new MessageActionRow();
      Buttons.addComponents(
        new MessageButton()
          .setCustomId("discord")
          .setLabel(Button1[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji1),
        new MessageButton()
          .setCustomId("client")
          .setLabel(Button2[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji2),
        new MessageButton()
          .setCustomId("general")
          .setLabel(Button3[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji3),
        new MessageButton()
          .setCustomId("high")
          .setLabel(Button4[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji4),
        new MessageButton()
          .setCustomId("other")
          .setLabel(Button5[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji5)
      );

      const Embed = new MessageEmbed()
        .setAuthor({
          name: guild.name + " | Ticketing System",
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(Description)
        .setColor("#36393f")
        .setImage('https://i.imgur.com/ECvRM86.png');

      await guild.channels.cache
        .get(Channel.id)
        .send({ embeds: [Embed], components: [Buttons] });

      interaction.reply({ content: "Done", ephemeral: true });
    } catch (err) {
      const errEmbed = new MessageEmbed().setColor("RED").setDescription(
        `⛔ | An error occured while setting up your ticket system\n**what to make sure of?**
          1. Make sure none of your buttons' names are duplicated
          2. Make sure you use this format for your buttons => Name,Emoji
          3. Make sure your button names do not exceed 200 characters
          4. Make sure your button emojis, are actually emojis, not ids.`
      );
      console.log(err);
      interaction.reply({ embeds: [errEmbed] });
    }
  },
};
