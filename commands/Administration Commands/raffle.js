const {
  MessageEmbed,
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
} = require("discord.js");

module.exports = {
  name: "raffle",
  description: "Create a raffle!",
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: "roles",
      description:
        "The roles for this raffle. Seperate each role with a space!",
      required: true,
      type: "STRING",
    },
    {
      name: "winners",
      description: "The amount of winners for this raffle.",
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
    const roles = options.getString("roles").split(" ");
    const count = options.getNumber("winners");

    const members = [];
    const winners = [];

    roles.forEach((r) => {
      const id = r.replace(/\D/g, "");
      const role = interaction.guild.roles.cache.get(id);
      if (role) {
        const roleMembers = role.members;
        const people = roleMembers.map((m) => m.user.toString());
        people.forEach((person) => members.push(person));
      }
    });

    if (members.filter((m) => m === undefined).length > 0)
      return await interaction.reply({
   ephemeral: true,
        content: "Invalid role provided!!",
        
      });

    for (let i = 0; i < count; i++) {
      const random = Math.floor(Math.random() * members.length);
      const winner = members[random];
      winners.push(winner);
    }

    return await interaction.reply({
   ephemeral: true,
      content: [...new Set(winners)].join(" "),
      embeds: [
        {
          title: "You won the raffle!! 🎁",
          color: "GREEN",
        },
      ],
    });
  },
};
