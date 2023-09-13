const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		const owner = await interaction.guild.fetchOwner({ cache : true })
			.catch((error) => {
				console.error('Error logging in:', error);
			});
		const url = interaction.guild.iconURL({ size: 512 });
		let roles = interaction.guild.roles.cache
			.filter((role) => role.name !== '@everyone')
			.sort((roleA, roleB) => roleB.comparePositionTo(roleA))
			.map((role) => role.toString());

		const rolesSize = roles.length;

		if (rolesSize > 20) {
			roles = roles.slice(0, 20);
			roles[20] = `... ${rolesSize - 20} more`;
		}

		const serverCreationDate = interaction.guild.createdAt;
		const dateNow = new Date();
		/*
			Date subtracting is returning miliseconds, so we need to divide by 1000 to get seconds,
			60 to get minutes, 60 to get hours, and 24 to get days.
		*/
		const daySinceCreated = Math.floor((dateNow - serverCreationDate) / (1000 * 60 * 60 * 24));
		const embed = new EmbedBuilder()
			.setDescription(`## **${interaction.guild.name}**
			**[Link to server icon](${url})**`)
			.setColor(interaction.member.displayHexColor)
			.setThumbnail(url)
			.addFields(
				{
					name: 'Server Owner',
					value: String(owner),
					inline: false,
				},
				{
					name: 'Server ID',
					value: String(interaction.guild.id),
					inline: false,
				},
				{
					name: 'Server Creation Date',
					value: `\`${serverCreationDate.toLocaleString('en-US', { timeZone: 'UTC' })} (${daySinceCreated} days ago)\``,
					inline: false,
				},
				{
					name: 'Member Count',
					value: String(interaction.guild.memberCount),
					inline: true,
				},
				{
					name: 'Role Count',
					value: String(interaction.guild.roles.cache.size),
					inline: true,
				},
				{
					name: 'Emoji Count',
					value: String(interaction.guild.emojis.cache.size),
					inline: true,
				},
				{
					name: 'Channel Count',
					value: String(interaction.guild.channels.cache.filter((channel) => channel.isTextBased() || channel.isVoiceBased()).size),
					inline: true,
				},
				{
					name: 'Voice Channel',
					value: String(interaction.guild.channels.cache.filter((channel) => channel.isVoiceBased()).size),
					inline: true,
				},
				{
					name: 'Text Channel',
					value: String(interaction.guild.channels.cache.filter((channel) => channel.isTextBased() && !channel.isVoiceBased()).size),
					inline: true,
				},
				{
					name: 'Boost Level',
					value: String(interaction.guild.premiumTier),
					inline: true,
				},
				{
					name: 'Boost Count',
					value: String(interaction.guild.premiumSubscriptionCount),
					inline: true,
				},
				{
					name: 'Boost Tier',
					value: String(interaction.guild.premiumTier),
					inline: true,
				},
				{
					name: `Roles [${rolesSize}]`,
					value: roles.join(', '),
					inline: false,
				},
			)
			.setFooter(
				{
					text: `Requested by ${interaction.member.displayName}`,
					iconURL: interaction.user.displayAvatarURL(),
				},
			);
		await interaction.reply({ embeds: [embed] });
	},
};