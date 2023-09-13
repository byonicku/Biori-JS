const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information about a user')
		.addUserOption((option) => option.setName('user')
			.setDescription('Select a user')
			.setRequired(false),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		const embed = new EmbedBuilder()
			.setTitle(`User info for ${user.displayName}`)
			.addFields(
				{
					name: 'Discord ID',
					value: user.id,
					inline: false,
				},
				{
					name: 'Discord Username',
					value: user.username,
					inline: true,
				},
				{
					name: 'Account Creation Date',
					value: `\`${user.createdAt.toLocaleString('en-US', { timeZone: 'UTC' })}\``,
					inline: false,
				},
			)
			.setFooter(
				{
					text: `Requested by ${interaction.member.displayName}`,
					iconURL: interaction.user.displayAvatarURL(),
				},
			);

		if (user.partial) await user.fetch();

		const member = interaction.guild?.members.cache.get(user.id);

		if (member) {
			let roles = member.roles.cache
				.filter((role) => role.name !== '@everyone')
				.sort((roleA, roleB) => roleB.comparePositionTo(roleA))
				.map((role) => role.toString());
			const rolesSize = roles.length;

			const serverJoinDate = member.joinedAt;
			const dateNow = new Date();
			/*
				Date subtracting is returning miliseconds, so we need to divide by 1000 to get seconds,
				60 to get minutes, 60 to get hours, and 24 to get days.
			*/
			const daysSinceJoin = Math.floor((dateNow - serverJoinDate) / (1000 * 60 * 60 * 24));

			if (rolesSize == 0) {
				roles[0] = '*No roles assigned';
			}

			if (rolesSize > 20) {
				roles = roles.slice(0, 20);
				roles[20] = `... ${rolesSize - 20} more`;
			}
			embed.addFields(
				{
					name: 'Server Join Date',
					value: `\`${serverJoinDate.toLocaleString('en-US', { timeZone: 'UTC' })} (${daysSinceJoin} days ago)\``,
					inline: false,
				},
				{
					name: 'Role Color',
					value: member.displayHexColor,
					inline: true,
				},
				{
					name: `Roles [${rolesSize}]`,
					value: roles.join(', '),
					inline: false,
				},
			)
				.setThumbnail(user.displayAvatarURL())
				.setColor(interaction.member.displayHexColor);
		}
		else {
			embed.setTitle(`User info for ${user.username}`)
				.setThumbnail(user.displayAvatarURL())
				.setColor('White')
				.setDescription('*This user is not a member of this server.*');
		}

		await interaction.reply({ embeds: [embed] });
	},
};