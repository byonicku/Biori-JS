const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kkn")
    .setDescription("Get timer before KKN ends!"),
  async execute(interaction) {
    // Current date in UTC
    const currentDate = new Date();

    // KKN end date in WIB (GMT+8)
    const endDate = new Date("2024-08-02T10:00:00+07:00");

    // Convert current date to UTC for accurate comparison
    const utcCurrentDate = new Date(currentDate.toISOString());

    // Calculate the difference between the end date and the current date in milliseconds
    const diff = endDate.getTime() - utcCurrentDate.getTime();

    if (diff < 0) {
      return interaction.reply({
        content: "KKN has ended!",
      });
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;
    const remainingDays = days;

    const embed = new EmbedBuilder()
      .setTitle("KKN Countdown")
      .setDescription(
        `KKN will end in ${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes, and ${remainingSeconds} seconds!`
      )
      .setColor(interaction.member.displayHexColor)
      .setFooter({
        text: `Requested by ${interaction.member.displayName}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
