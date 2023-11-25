'use strict';
import startBot from './bot';
import 'dotenv/config'


export let bots = [
	{
		bot_name: 'v1pd33pw3bbot',
		bot_token: '6752462658:AAGqGXLtRhGtpZfB8KYyfvHTJOlOp14yeIU',
		log_channel_id: '-1002032722119',
	},
];


if(process.env.NODE_ENV === 'homog') {
	bots = [
		{
			bot_name: 'PatysVazadasBot',
			bot_token: '6901986365:AAGHCbaum2DsmhBUn4Q8ZqbBhc75VGBW1bE',
			log_channel_id: '-4038873235',
		},
	];
}


export default async function startBots() {
	try {
		for (const bot of bots) {
			try {
				startBot(bot.bot_name, bot.bot_token, bot.log_channel_id)
			} catch (error) {
				console.log('Error '+bot.bot_name)
			}
		}
	
	} catch (error) {
		console.log(error);
	}
}
