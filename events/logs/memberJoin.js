const { LogarithmicScale } = require("chart.js");
const { Client, GuildMember, Guild } = require("discord.js");
module.exports = {
  name: "guildMemberAdd",

  /**
   *
   * @param {Client} client
   */
  //MEMBER SECTION
  async execute(member) {
    await sendLogs(member.guild, member, "member", "Member Joined", [
      {
        name: "Account Created On:",
        value: `<t:${Math.round(member.user.createdAt.getTime() / 1000)}:T>`,
      },
    ]);

    let role1 = member.guild.roles.cache.get("977901189343629372");
    let role2 = member.guild.roles.cache.get("970370773325852722");
    let role3 = member.guild.roles.cache.get("985495555339845632");
    await member.roles.add(role1);
    await member.roles.add(role2);
    await member.roles.add(role3);
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
