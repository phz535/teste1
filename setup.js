const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configura o painel de tickets da Nexa Store."),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({
        content: "❌ Você não tem permissão para usar este comando.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🎫 Suporte — Nexa Store")
      .setDescription(
        "Precisa de ajuda ou quer realizar uma compra?\n\n" +
        "Selecione abaixo o tipo de atendimento que deseja abrir.\n\n" +
        "❓ **Dúvidas** — dúvidas gerais sobre a loja.\n" +
        "🍇 **Blox Fruits** — comprar produtos de Blox Fruits.\n" +
        "🔪 **MM2** — comprar produtos de Murder Mystery 2.\n" +
        "👴 **Contas** — atendimento relacionado a contas/produtos digitais.\n" +
        "🚨 **Reportar** — informar um problema para a equipe."
      )
      .setFooter({ text: "Nexa Store © 2026" });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_type")
      .setPlaceholder("Selecione o tipo de atendimento")
      .addOptions([
        {
          label: "Dúvidas",
          description: "Tire dúvidas sobre a Nexa Store.",
          value: "duvidas",
          emoji: "❓"
        },
        {
          label: "Blox Fruits",
          description: "Atendimento para compras de Blox Fruits.",
          value: "blox",
          emoji: "🍇"
        },
        {
          label: "Murder Mystery 2",
          description: "Atendimento para compras de MM2.",
          value: "mm2",
          emoji: "🔪"
        },
        {
          label: "Contas",
          description: "Atendimento sobre produtos digitais.",
          value: "contas",
          emoji: "👴"
        },
        {
          label: "Reportar problema",
          description: "Reporte um problema à equipe.",
          value: "report",
          emoji: "🚨"
        }
      ]);

    await interaction.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });

    await interaction.reply({
      content: "✅ Painel de tickets enviado.",
      ephemeral: true
    });
  }
};
