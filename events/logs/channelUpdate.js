// const { LogarithmicScale } = require("chart.js");
// const { Client, GuildMember, Guild } = require("discord.js");
// module.exports = {
//   name: "channelUpdate",

//   /**
//    *
//    * @param {Client} client
//    */
//   //CHANNEL SECTION
//   async execute(oldCh, newCh) {
//     await sendLogs(oldCh.guild, oldCh.guild.me, "channel", "Channel Updated!", [
//         {
//             name: "Old Channel:",
//             value: `[#${oldCh.name}](https://discord.com/channels/${oldCh.guild.id}/${oldCh.id})`,
//           },
//           {
//             name: "New Channel:",
//             value: `[#${newCh.name}](https://discord.com/channels/${newCh.guild.id}/${newCh.id})`,
//           },
//     ]);
//   },
// };

// /**
//  *
//  * @param {Guild} guild
//  * @param {GuildMember} member
//  * @param {String} title
//  * @returns
//  */
// async function sendLogs(guild, member, section, title, fields) {
//   const db = require("../../schema/logs.js");
//   const data = await db.findOne({
//     guild: guild.id,
//   });

//   if (!data) return;
//   const channel = guild.channels.cache.get(data.info[section]);
//   if (!channel) return;

//   const embed = {
//     author: {
//       name: member.user.username,
//       iconURL: member.user.displayAvatarURL(),
//     },
//     title,
//     fields,
//     color: "GREEN",
//     footer: {
//       text: `ID: ${member.id}`,
//     },
//   };

//   if (!member.user.bot)
//     embed.thumbnail = {
//       url: member.user.displayAvatarURL(),
//     };

//   await channel.send({
//     embeds: [embed],
//   });
// }
