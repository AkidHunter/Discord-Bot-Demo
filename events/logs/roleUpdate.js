const { LogarithmicScale } = require("chart.js");
const { Client, GuildMember, Guild } = require("discord.js");
module.exports = {
    name: "roleUpdate",

/**
 *
 * @param {Client} client
 */
  // ROLE SECTION
  async execute (oldRole, newRole) {
    await sendLogs(oldRole.guild, oldRole.guild.me, "role", "Role Updated!", [
        {
            name: "Old Role:",
            value: `${oldRole.name}`,
          },
          {
            name: "New Role:",
            value: `${newRole.name}`,
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
