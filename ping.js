const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica se o Nexa Bot está online."),

  async execute(interaction) {
    await interaction.reply({
      content: `🏓 Pong! Latência: ${interaction.client.ws.ping}ms`,
      ephemeral: true
    });
  }
};
