const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kill someone virtually!')
		.addUserOption((option) => option.setName('user')
			.setDescription('Mention your friend you want to kill!')
			.setRequired(false),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		if (user.partial) await user.fetch();

		const member = interaction.guild?.members.cache.get(user.id);

		if (!member) {
			interaction.reply(
				{
					content: 'You cannot kill people outside this server!',
					ephemeral: true,
				},
			);

			return;
		}

		try {
			const img = await axios.get(
				'https://api.waifu.pics/sfw/kill',
				{},
			).then((res) => res.data);
			const title = user.equals(interaction.user) ?
				`${interaction.member.displayName} killed themselves! OOF!` :
				`${interaction.member.displayName} killed ${user.displayName}!`;
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
			interaction.reply({ content: 'There was an error trying to kill this user!', ephemeral: true });
		}
	},
};