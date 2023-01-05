const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const warnModel = require("../../schema/warn")

module.exports = {
    name: "remove-warn",
    description: "Remove a warn",
    permission: "MUTE_MEMBERS",
    options: [
        {
            name: "warnid",
            description: "Provide the warning ID you want to remove", //Change able.
            type: "STRING",
            required: true,
        },
    ],

 /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
  async execute(interaction) {
      const warnId = interaction.options.getString("warnid")

      const data = await warnModel.findById(warnId);


      const er = new MessageEmbed()
      .setDescription(`Woops no warn Id found matching ${warnId}`)
      if(!data) return interaction.reply({embeds:[er], ephemeral: true});

      data.delete();
        const embed = new MessageEmbed()
        .setTitle("Remove Infraction")
        .setDescription(`Successfully removed the warn with the ID matching ${warnId}`)
      const user = interaction.guild.members.cache.get(data.userId)
      return interaction.reply({ embeds: [embed], ephemeral: true})
  }

}