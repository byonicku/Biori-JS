const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const animeAPI = require('anime-images-api');
const images = new animeAPI();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Kiss someone virtually O_O!')
		.addUserOption((option) => option.setName('user')
			.setDescription('Mention your friend you want to kiss!')
			.setRequired(false),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		if (user.partial) await user.fetch();

		const member = interaction.guild?.members.cache.get(user.id);

		if (!member) {
			interaction.reply(
				{
					content: 'You cannot kiss people outside this server!',
					ephemeral: true,
				},
			);

			return;
		}

		try {
			const img = await images.sfw.kiss();
			const title = user.equals(interaction.user) ?
				`${interaction.member.displayName} kissed themselves? WTF O_O` :
				`${interaction.member.displayName} kissed ${user.displayName}!`;
			const embed = new EmbedBuilder()
				.setColor(interaction.member.displayHexColor)
				.setImage(img.image)
				.setAuthor(
					{
						name: title,
						iconURL: interaction.user.displayAvatarURL(),
					},
				);

			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to kiss this user!', ephemeral: true });
		}
	},
};