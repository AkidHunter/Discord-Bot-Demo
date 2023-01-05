const { LogarithmicScale } = require("chart.js");
const { Client, GuildMember, Guild } = require("discord.js");
module.exports = {
    name: "messageReactionAdd",

/**
 *
 * @param {Client} client
 */
  //MESSAGE SECTION
  async execute (reaction, user, client) {
    if (user.bot) return;

    const fetched = await reaction.fetch();
    const member = fetched.message.guild.members.cache.get(user.id);
    const emoji = client.emojis.resolve(fetched.emoji);
    await sendLogs(fetched.message.guild, member, "message", "New Reaction", [
      {
        name: "Reaction Emoji:",
        value: `${emoji ? emoji : fetched.emoji.url}`,
      },
    ]);
  },
};

/**
 *
 * @param {Guild} guild
 * @param {GuildMember} member
 * @param {String} title
 * @returns
 */
async function sendLogs(guild, member, section, title, fields) {
  const db = require("../../schema/logs.js");
  const data = await db.findOne({
    guild: guild.id,
  });

  if (!data) return;
  const channel = guild.channels.cache.get(data.info[section]);
  if (!channel) return;

  const embed = {
    author: {
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    },
    title,
    fields,
    color: "GREEN",
    footer: {
      text: `ID: ${member.id}`,
    },
  };

  if (!member.user.bot)
    embed.thumbnail = {
      url: member.user.displayAvatarURL(),
    };

  await channel.send({
    embeds: [embed],
  });
}
