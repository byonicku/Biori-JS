const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Decide your fate with 8 ball!")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Ask a question!")
        .setRequired(true)
    ),
  async execute(interaction) {
    const regex = /^[^a-zA-Z0-9]+$/;
    const question = interaction.options.getString("question");
    if (isFinite(question) || question.length < 1 || regex.test(question)) {
      await interaction.reply({
        content: "Please ask a question!",
        ephemeral: true,
      });
      return;
    }
    const responses = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes - definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "No",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply({ content: `${response}` });
  },
};
