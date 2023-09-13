const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a number!')
		.addIntegerOption((option) => option.setName('max')
			.setDescription('Maximum number (if min not defined will roll 0 - max)')
			.setRequired(true),
		)
		.addIntegerOption((option) => option.setName('min')
			.setDescription('Minimum number (can\'t be higher than maximum number)')
			.setRequired(false),
		),
	async execute(interaction) {
		const min = interaction.options.getInteger('min') || 0;
		const max = interaction.options.getInteger('max');
		let number;

		if (max < min) {
			await interaction.reply('Maximum Number cannot be under Minimum number!');
			return;
		}

		await interaction.reply('Rolling...');
		await wait(1000);
		for (let i = 0; i < 5; i++) {
			number = Math.floor((Math.random() * (max - min + 1)) + min);
			await interaction.editReply(`Rolling... ${number}`);
			await wait(500);
		}

		await interaction.editReply(`You rolled a **${number}**!`);
	},
};