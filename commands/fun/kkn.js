const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kkn")
    .setDescription("Get timer before KKN ends!"),
  async execute(interaction) {
    const date = new Date();
    const end = new Date("2024-08-02T00:00:00Z");

    if (date > end) {
      return interaction.reply({
        content: "KKN has ended!",
      });
    }

    const diff = end - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;
    const remainingDays = days % 7;

    const embed = {
      title: "KKN Countdown",
      description: `KKN will end in ${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes, and ${remainingSeconds} seconds!`,
      color: 0x00ff00,
    };

    await interaction.reply({ embeds: [embed] });
  },
};
