const {
  MessageEmbed,
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
} = require("discord.js");

module.exports = {
  name: "guessthenumber",
  description: "Start guess the number",
  permission: 'MANAGE_CHANNELS',
  options: [
    {
      name: "channel",
      description: "The channel were the game should happen.",
      required: true,
      type: "CHANNEL",
    },
    {
      name: "range",
      description: "The range of the random number. Eg: 100 (it means 0-100)",
      required: true,
      type: "NUMBER",
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
    const channel = options.getChannel("channel");
    const range = options.getNumber("range");

    await interaction.reply({
   ephemeral: true,
      content: "Starting the game...",
      
    });

    await channel.send({
      embeds: [
        {
          title: "Guess the number!",
          description:
            "Guess the number in this chat, and try to get it right!",
          color: "RANDOM",
        },
      ],
    });

    const collector = await channel.createMessageCollector({
      time: 60000,
      filter: (m) => !m.author.bot,
    });

    const randomInt = Math.floor(Math.random() * range).toString();

    collector.on("collect", async (msg) => {
      if (msg.content === randomInt) {
        collector.stop();
        await channel.send(
          `${msg.author} has guessed the number correctly!! The number was: \`${randomInt}\``
        );
      }
    });

    collector.on("end", async (m, r) => {
      if (r === "time") {
        await channel.send(
          `No one guessed the number correctly! The number was: \`${randomInt}\``
        );
      }
    });
  },
};
