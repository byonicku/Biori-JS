const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pat')
		.setDescription('Pat someone virtually!')
		.addUserOption((option) => option.setName('user')
			.setDescription('Mention your friend you want to pat!')
			.setRequired(false),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		if (user.partial) await user.fetch();

		const member = interaction.guild?.members.cache.get(user.id);

		if (!member) {
			interaction.reply(
				{
					content: 'You cannot pat people outside this server!',
					ephemeral: true,
				},
			);

			return;
		}

		try {
			const img = await axios.get(
				'https://api.waifu.pics/sfw/pat',
				{},
			).then((res) => res.data);
			const title = user.equals(interaction.user) ?
				`${interaction.member.displayName} patted themselves... how sad...` :
				`${interaction.member.displayName} patted ${user.displayName}!`;
			const embed = new EmbedBuilder()
				.setColor(interaction.member.displayHexColor)
				.setImage(img.url)
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
			interaction.reply({ content: 'There was an error trying to pat this user!', ephemeral: true });
		}
	},
};