const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} = require("discord.js");
const ms = require("ms-prettify").default;

module.exports = {
  name: "moderate",
  description: "Moderate a member.",
  permissions: {
    member: ["MANAGE_MESSAGES"],
    bot: ["KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS"],
  },
  options: [
    {
      name: "member",
      description: "Provide a member.",
      type: "USER",
      required: true,
    },
  ],
  /**
   * @param {import(discord.js).CommandInteraction} interaction
   * @param {import(discord.js).Client} client
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const Target = options.getMember(`member`);

    if (
      interaction.member.roles.highest.position < Target.roles.highest.position
    ) {
      return interaction.reply({
        content: "Can't moderate higer staff than you!",
        ephemeral: true,
      });
    }

    if (interaction.user.id === Target.id) {
      return interaction.reply({
        content: "Can't moderate yourself!",
        ephemeral: true,
      });
    }

    const Embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setDescription(
        `
        User: ${Target}(\`${Target.user.tag}\`)
        UserID: \`${Target.id}\`
        Created: <t:${parseInt(Target.user.createdTimestamp / 1000)}:R>
        Bannable?: ${Target.bannable ? "Yes" : "No"}
        Kickable?: ${Target.kickable ? "Yes" : "No"}
        Timeoutable?: ${Target.moderatable ? "Yes" : "No"}
        Manageable?: ${Target.manageable ? "Yes" : "No"}		
        `
      )
      .setAuthor({
        name: Target.user.tag,
        iconURL: Target.displayAvatarURL({
          dynamic: true,
        }),
      })
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({
          dynamic: true,
        }),
      });

    let firstBanActionRow;
    let secondBanActionRow;

    let BanModel = new Modal()
      .setTitle(`Ban - ${Target.user.tag}`)
      .setCustomId(`model-ban`);

    const ban_message_deletes = new TextInputComponent()
      .setCustomId("ban-message_deletes")
      .setLabel("How many previous message should i delete?")
      .setPlaceholder("24 hour, 7 days, none")
      .setRequired(true)
      .setStyle("SHORT");

    const ban_reason = new TextInputComponent()
      .setCustomId("ban-reason")
      .setLabel("Why you banning? Reason")
      .setStyle("PARAGRAPH")
      .setRequired(false);

    secondBanActionRow = new MessageActionRow().addComponents(
      ban_message_deletes
    );
    firstBanActionRow = new MessageActionRow().addComponents(ban_reason);
    BanModel.addComponents(secondBanActionRow, firstBanActionRow);

    let TimeoutModel = new Modal()
      .setTitle(`Timeout - ${Target.user.tag}`)
      .setCustomId(`model-ban`);

    const timeout_duration = new TextInputComponent()
      .setCustomId("timeout-duration")
      .setLabel("Provide Duration")
      .setPlaceholder("1m, 1h, 1d")
      .setRequired(true)
      .setStyle("SHORT");

    const timeout_reason = new TextInputComponent()
      .setCustomId("timeout-reason")
      .setLabel("Why you muting him/her? Reason")
      .setStyle("PARAGRAPH")
      .setRequired(false);

    firstBanActionRow = new MessageActionRow().addComponents(timeout_reason);
    secondBanActionRow = new MessageActionRow().addComponents(timeout_duration);
    TimeoutModel.addComponents(secondBanActionRow, firstBanActionRow);

    let KickModel = new Modal()
      .setTitle(`Kick - ${Target.user.tag}`)
      .setCustomId(`model-kick`);

    const kick_reason = new TextInputComponent()
      .setCustomId("kick-reason")
      .setLabel("Why you kicking? Reason")
      .setStyle("PARAGRAPH")
      .setRequired(false);

    firstBanActionRow = new MessageActionRow().addComponents(kick_reason);
    KickModel.addComponents(firstBanActionRow);

    const Actions = new MessageActionRow();
    if (Target.bannable) {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-ban")
          .setStyle("DANGER")
          .setLabel("Ban")
      );
    } else {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-ban")
          .setStyle("DANGER")
          .setLabel("Ban")
          .setDisabled(true)
      );
    }

    if (Target.kickable) {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-kick")
          .setStyle("DANGER")
          .setLabel("Kick")
      );
    } else {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-kick")
          .setStyle("DANGER")
          .setLabel("Kick")
          .setDisabled(true)
      );
    }

    if (Target.moderatable) {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-timeout")
          .setStyle("DANGER")
          .setLabel("Timeout")
      );
    } else {
      Actions.addComponents(
        new MessageButton()
          .setCustomId("moderate-timeout")
          .setStyle("DANGER")
          .setLabel("Timeout")
          .setDisabled(true)
      );
    }

    const message = await interaction.reply({
      embeds: [Embed], ephemeral: true,
      components: [Actions],
      content: `User ID: ${Target.id}`,
      fetchReply: true,
    });
    const collector = await message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 30000,
    });

    collector.on("collect", (i) => {
      if (!i.user.id === interaction.user.id)
        return i.reply({
          content: "You are not owner of this button!",
          ephemeral: true,
        });

      switch (i.customId) {
        case "moderate-ban":
          i.showModal(BanModel);
          i.awaitModalSubmit({
            time: 60000,
          }).then((interact) => {
            let Duration = interact.fields.getTextInputValue(
              "ban-message_deletes"
            );
            const Formats = ["7 days", "1 day", "none"];
            if (!["7 days", "1 day", "none"].includes(Duration))
              return interact.reply({
                content: "You Provided a invaild choice in Message Deletes",
                ephemeral: true,
              });
            if (!interact.member.permissions.has("BAN_MEMBER"))
              return interact.reply({
                content:
                  "Suddenly you permissions disappear, you do not have permissions.",
                ephemeral: true,
              });
            let Reason =
              interact.fields.getTextInputValue("ban-reason") ||
              "No Reason Giving";

            const DurataON = Duration.replace(" days", "")
              .replace(" day", "")
              .replace("none", "0");
            const Edurationa = Number(DurataON);

            Target.ban({
              days: Edurationa,
              reason: `${Reason} - ${interact.user.tag}`,
            });
            interact.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("New Banned")
                  .setAuthor({
                    name: `${Target.user.tag}`,
                    iconURL: Target.user.displayAvatarURL(),
                  })
                  .setFooter({
                    text: `Banned by: ${interact.user.tag}`,
                    iconURL: interact.user.displayAvatarURL(),
                  })
                  .setColor("DARK_BUT_NOT_BLACK")
                  .setDescription(
                    `${Target}(\`${Target.user.tag}\`) has been banned`
                  )
                  .addField("Reason:", Reason, false),
              ],
            });
          });
          break;
        case "moderate-kick":
          i.showModal(KickModel);
          i.awaitModalSubmit({
            time: 60000,
          }).then((interact) => {
            Reason =
              interact.fields.getTextInputValue("kick-reason") ||
              "No Reason Giving";
            if (!interact.member.permissions.has("KICK_MEMBER"))
              return interact.reply({
                content:
                  "Suddenly you permissions disappear, you do not have permissions.",
                ephemeral: true,
              });

            Target.kick(`${Reason} - ${interaction.user.tag}`);
            interact.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("New Kicked")
                  .setAuthor({
                    name: `${Target.user.tag}`,
                    iconURL: Target.user.displayAvatarURL(),
                  })
                  .setFooter({
                    text: `Kicked by: ${interact.user.tag}`,
                    iconURL: interact.user.displayAvatarURL(),
                  })
                  .setColor("DARK_BUT_NOT_BLACK")
                  .setDescription(
                    `${Target}(\`${Target.user.tag}\`) has been kicked`
                  )
                  .addField("Reason:", Reason, false),
              ],
            });
          });

          break;
        case "moderate-timeout":
          i.showModal(TimeoutModel);
          i.awaitModalSubmit({
            time: 60000,
          }).then((interact) => {
            Reason =
              interact.fields.getTextInputValue("timeout-reason") ||
              "No Reason Giving";
            Duration = interact.fields.getTextInputValue("timeout-duration");
            const msDuration = ms(Duration);

            if (!msDuration)
              return interact.reply({
                content: "You provided a invald time. Eample: 1m, 1h, 1d",
                ephemeral: true,
              });

            Target.timeout(msDuration, `${Reason} - ${interact.user.tag}`);
            interact.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("New Timed out")
                  .setAuthor({
                    name: `${Target.user.tag}`,
                    iconURL: Target.user.displayAvatarURL(),
                  })
                  .setFooter({
                    text: `Timed out by: ${interact.user.tag}`,
                    iconURL: interact.user.displayAvatarURL(),
                  })
                  .setColor("DARK_BUT_NOT_BLACK")
                  .setDescription(
                    `${Target}(\`${Target.user.tag}\`) has been timed out`
                  )
                  .addField("Reason:", Reason, false)
                  .addField("Duration:", Duration, false)
              ], ephemeral: true
            });
          });
          break;
      }
    });

    collector.on("end", (i) => {
      Actions.components[0].setDisabled(true);
      Actions.components[1].setDisabled(true);
      Actions.components[2].setDisabled(true);

    });
  },
};
