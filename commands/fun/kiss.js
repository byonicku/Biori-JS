const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


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
			const img = await axios.get(
				'https://api.waifu.pics/sfw/kiss',
				{},
			).then((res) => res.data);
			const title = user.equals(interaction.user) ?
				`${interaction.member.displayName} kissed themselves? WTF O_O` :
				`${interaction.member.displayName} kissed ${user.displayName}!`;
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
			interaction.reply({ content: 'There was an error trying to kiss this user!', ephemeral: true });
		}
	},
};