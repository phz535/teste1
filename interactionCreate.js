const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const names = {
  duvidas: "duvida",
  blox: "blox-fruits",
  mm2: "murder-mystery",
  contas: "conta",
  report: "report"
};

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        const reply = {
          content: "❌ Ocorreu um erro ao executar este comando.",
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply).catch(() => {});
        } else {
          await interaction.reply(reply).catch(() => {});
        }
      }

      return;
    }

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== "ticket_type") return;

    const type = interaction.values[0];
    const baseName = names[type] || "atendimento";

    const existing = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.topic === `ticket:${interaction.user.id}`
    );

    if (existing) {
      return interaction.reply({
        content: `❌ Você já possui um ticket aberto: ${existing}`,
        ephemeral: true
      });
    }

    const channel = await interaction.guild.channels.create({
      name: `${baseName}-${interaction.user.username}`.toLowerCase().slice(0, 90),
      type: ChannelType.GuildText,
      parent: process.env.TICKET_CATEGORY_ID,
      topic: `ticket:${interaction.user.id}`,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
          id: process.env.STAFF_ROLE_ID,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ManageMessages
          ]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle("🎫 Ticket aberto")
      .setDescription(
        `Olá, ${interaction.user}!\n\n` +
        "Explique o que você precisa e aguarde um membro da equipe.\n\n" +
        "⚠️ Não envie pagamentos até receber instruções oficiais da equipe."
      )
      .setFooter({ text: "Nexa Store © 2026" });

    const closeButton = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Fechar ticket")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger);

    await channel.send({
      content: `${interaction.user} <@&${process.env.STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(closeButton)]
    });

    await interaction.reply({
      content: `✅ Seu ticket foi criado: ${channel}`,
      ephemeral: true
    });

    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      await logChannel.send(
        `🎫 Ticket aberto: ${channel} | Cliente: ${interaction.user.tag} | Tipo: ${baseName}`
      ).catch(() => {});
    }
  }
};
