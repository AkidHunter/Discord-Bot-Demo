const { LogarithmicScale } = require("chart.js");
const { Client, GuildMember, Guild } = require("discord.js");
module.exports = {
    name: "channelCreate",

/**
 *
 * @param {Client} client
 */
  //MESSAGE SECTION
  async execute(client, msg) {
    if (msg.author?.bot) return;
    await sendLogs(msg.guild, msg.member, "message", "Message Deleted", [
      {
        name: "Content:",
        value: `\`\`\`${msg.content.replace("`", "")}\`\`\``,
      },
    ]);
  },

  async execute (reaction, user) {
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

  async execute (old, newMsg) {
    if (newMsg.author?.bot) return;

    let oldContent = old.content.replace("`", "");
    let newContent = newMsg.content.replace("`", "");

    await sendLogs(newMsg.guild, newMsg.member, "message", "Message Edited", [
      {
        name: "Previous Content:",
        value: `\`\`\`${oldContent}\`\`\``,
      },
      {
        name: "New Content:",
        value: `\`\`\`${newContent}\`\`\``,
      },
    ]);
  },

  //MEMBER SECTION
  async execute (member) {
    await sendLogs(member.guild, member, "member", "Member Joined", [
      {
        name: "Account Created On:",
        value: `<:t${member.user.createdAt.getTime()}:T>`,
      },
    ]);

    let role = member.guild.roles.cache.get("985495555339845632");
    if (!role) return;
    await member.roles.add(role);
  },

  async execute (oldMember, newMember) {
    const isOld = oldMember.isCommunicationDisabled();
    const isNew = newMember.isCommunicationDisabled();

    if (!isOld && isNew) {
      let time = newMember.communicationDisabledUntilTimestamp;
      let now = new Date();
      let finalTime = time - now.getTime();

      await sendLogs(newMember.guild, newMember, "member", "Member muted!", [
        {
          name: "Duration:",
          value: `\`${finalTime}\``,
        },
      ]);
    } else if (isOld && !isNew)
      await sendLogs(newMember.guild, newMember, "member", "Member unmuted!", [
        {
          name: "Time:",
          value: `<t:${newMember.communicationDisabledUntilTimestamp}:R>`,
        },
      ]);
  },

  // ROLE SECTION
  async execute (role) {
    await sendLogs(role.guild, role.guild.me, "role", "New Role Created!", [
      {
        name: "Role:",
        value: `${role}`,
      },
    ]);
  },

  async execute (role) {
    await sendLogs(role.guild, role.guild.me, "role", "Role Deleted!", [
      {
        name: "Role:",
        value: `${role}`,
      },
    ]);
  },

  async execute (oldRole, newRole) {
    await sendLogs(oldRole.guild, oldRole.guild.me, "role", "Role Updated!", [
      {
        name: "Old Role:",
        value: `${oldRole}`,
      },
      {
        name: "New Role:",
        value: `${newRole}`,
      },
    ]);
  },

  //CHANNEL SECTION
  async execute (channel) {
    await sendLogs(
      channel.guild,
      channel.guild.me,
      "channel",
      "New Channel Created!",
      [
        {
          name: "Channel:",
          value: `${channel}`,
        },
      ]
    );
  },

  async execute (channel) {
    await sendLogs(
      channel.guild,
      channel.guild.me,
      "channel",
      "Channel Deleted!",
      [
        {
          name: "Channel:",
          value: `${channel.name}`,
        },
      ]
    );
  },

  async execute (oldCh, newCh) {
    await sendLogs(oldCh.guild, oldCh.guild.me, "channel", "Channel Updated!", [
      {
        name: "Old Channel:",
        value: `${oldCh}`,
      },
      {
        name: "New Channel:",
        value: `${newCh}`,
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
