const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const pokemonControl = require('../../pokemonWrapper/pokemonControl.js');
const P = new pokemonControl();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Search a pokemon!')
		.addStringOption(option => option.setName('name_or_id')
			.setDescription('Type any pokemon name or id you want to search!')
			.setRequired(true),
		),
	async execute(interaction) {
		const name = interaction.options.getString('name_or_id');

		try {
			const response = await P.getPokemon(name);
			const capitalize = (s) => {
				if (typeof s !== 'string') return '';
				if (s === 'hp') return 'HP';
				return s.split(' ')
					.map(w => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' ');
			};

			const stats = response.stats.map(stat => {
				const formattedStatName = capitalize(stat.stat.name.replace('-', ' '));
				return { name: formattedStatName, value: String(stat.base_stat) };
			},
			);

			const shinyButton = new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setLabel('Shiny')
				.setCustomId('shiny');

			const row = new ActionRowBuilder()
				.addComponents(shinyButton);

			const embed = new EmbedBuilder()
				.setTitle(`${capitalize(response.name)}`)
				.setThumbnail(response.sprites.front_default)
				.setColor(interaction.member.displayHexColor)
				.addFields(
					{
						name: 'PokeDex ID',
						value: String(response.id),
						inline: true,
					},
					{
						name: 'Height',
						value: String(response.height),
						inline: true,
					},
					{
						name: 'Weight',
						value: String(response.weight),
						inline: true,
					},
					{
						name: 'Base Experience',
						value: String(response.base_experience),
						inline: true,
					},
					{
						name: 'Abilities',
						value: response.abilities.map(a => capitalize(a.ability.name)).join('\n'),
						inline: true,
					},
					{
						name: 'Types',
						value: response.types.map(t => capitalize(t.type.name)).join('\n'),
						inline: true,
					},
					{
						name: 'Stats',
						value: stats.map(s => `${s.name}: ${s.value}`).join('\n'),
						inline: true,
					},
				)
				.setFooter(
					{
						text: `Requested by ${interaction.member.displayName}`,
						iconURL: interaction.user.displayAvatarURL(),
					},
				);
			const interact = await interaction.reply({ embeds: [embed], components: [row] });

			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const confirmation = await interact.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

				if (confirmation.customId === 'shiny') {
					embed.setThumbnail(response.sprites.front_shiny);
					await interaction.editReply({ embeds: [embed], components: [] });
				}
			}
			catch (e) {
				await interaction.editReply({ embeds: [embed], components: [] });
			}
		}
		catch (err) {
			console.log(err);
			await interaction.reply('Error fetching API!');
		}
	},
};