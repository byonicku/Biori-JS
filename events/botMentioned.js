const { Events } = require('discord.js');
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		try {
			const responds =
				[
					'Can I help? OwO',
					'Hello! What can I do for you?',
					'Yes? What you need?',
					'What do you want?',
					'OwO?',
				];

			const random = Math.floor(Math.random() * responds.length);
			const respond = responds[random];

			if (message.content.includes('@here') || message.content.includes('@everyone') || message.type == 'REPLY') return false;

			if (message.mentions.has(message.client.user)) await message.reply(respond);
		}
		catch (error) {
			console.error(error);
		}
	},
};