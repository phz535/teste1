const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "close_ticket") return;

    const isStaff = interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID);

    if (!isStaff) {
      return interaction.reply({
        content: "❌ Apenas a equipe pode fechar este ticket.",
        ephemeral: true
      });
    }

    await interaction.reply("🔒 Ticket sendo fechado...");

    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      await logChannel.send(
        `🔒 Ticket fechado: **${interaction.channel.name}** por **${interaction.user.tag}**`
      ).catch(() => {});
    }

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 1500);
  }
};
