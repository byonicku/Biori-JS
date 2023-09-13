const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target')
			.setDescription('The user\'s avatar to show'),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		let url, name;
		const embed = new EmbedBuilder()
			.setColor(interaction.member.displayHexColor);

		if (user) {
			const member = interaction.guild?.members.cache.get(user.id);
			name = member ? member.displayName : user.username;
			url = member ?
				member.user.displayAvatarURL({ size: 1024 }) : user.displayAvatarURL({ size: 1024 });
		}
		else {
			name = interaction.member.displayName;
			url = interaction.user.displayAvatarURL({ size: 1024 });
		}

		embed.setTitle(`${name}'s avatar `)
			.setDescription(`**[Link to the picture](${url})**`)
			.setImage(url)
			.setFooter(
				{
					text: `Requested by ${interaction.member.displayName}`,
					iconURL: interaction.user.displayAvatarURL(),
				},
			);

		await interaction.reply({ embeds: [embed] });
	},
};