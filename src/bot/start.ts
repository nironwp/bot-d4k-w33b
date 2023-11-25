import { Markup, Context, Telegraf} from 'telegraf';
import { sendLog } from '../bot';
import * as fs from 'fs';
import path from 'path';
import createTxid from '../createTxid';
export default async function startBotMessage(ctx: Context, bot: Telegraf, log_channel_id: string) {
	if (!ctx.chat || !ctx.from) return;
	try {
		await bot.telegram
			.sendMessage(
				ctx.chat.id,
				'🍼 𝐀𝐏𝐄𝐍𝐀𝐒 𝟏 𝐂𝐋𝐈𝐂𝐊 • 𝐏𝐀𝐑𝐀 𝐕𝐎𝐂𝐄̂ 𝐄𝐍𝐓𝐑𝐀𝐑 𝐍𝐎 𝐌𝐄𝐋𝐇𝐎𝐑 𝐆𝐑𝐔𝐏𝐎 𝐃𝐀 𝐃𝐄𝐄𝐏𝐖𝟑𝟑𝐁 𝐍𝐎 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐕𝐄𝐍𝐇𝐀 𝐕𝐄𝐑 𝐎𝐒 𝐕𝐈́𝐃𝐄𝐎𝐒 𝐌𝐀𝐈𝐒 𝐏𝐄𝐒𝐀𝐃𝐎𝐒 𝐃𝐎 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 🔞\n\n👅 𝗝𝘂𝗻𝘁𝗮-𝘀𝗲 𝗮𝗼 𝗺𝗲𝗹𝗵𝗼𝗿 𝗚𝗿𝘂𝗽𝗼 𝗩𝗜𝗣 𝗱𝗲 𝗩𝗮𝘇𝗮𝗱𝗼𝘀, 𝗙𝗮𝗺𝗼𝘀𝗮𝘀 𝗩𝗮𝘇𝗮𝗱𝗮𝘀, 𝗣𝘂𝘁𝗶𝗻𝗵𝗮𝘀 𝗣𝗲𝗿𝗱𝗲𝗻𝗱𝗼 𝗼 𝗰𝗮𝗯𝗮𝗰̧𝗼, 𝗩𝗶𝘇𝗶𝗻𝗵𝗮 𝘁𝗼𝗺𝗮𝗻𝗱𝗼 𝗻𝗮 𝗯𝘂𝗰𝗲𝘁𝗶𝗻𝗵𝗮 𝗲 𝗺𝘂𝗶𝘁𝗼 𝗺𝗮𝗶𝘀.\n🔞 Tenha acesso ao nosso 𝗚𝗿𝘂𝗽𝗼 𝗩𝗜𝗣 para aproveitar de mais de 𝟴.𝟬𝟬𝟬 𝗠𝗶𝗹 𝗺𝗶́𝗱𝗶𝗮𝘀 𝘀𝗲𝗺𝗮𝗻𝗮𝗶𝘀, 𝗩𝗶́𝗱𝗲𝗼𝘀 e 𝗙𝗼𝘁𝗼𝘀 e 𝗔𝘁𝘂𝗮𝗹𝗶𝘇𝗮𝗰̧𝗼̃𝗲𝘀 𝗗𝗶𝗮́𝗿𝗶𝗮𝘀.\n📛 Pagamento Único & Acesso Vitalício (𝐏𝐚𝐠𝐮𝐞 𝐬𝐨𝐦𝐞𝐧𝐭𝐞 𝐮𝐦𝐚 𝐯𝐞𝐳) • 𝐕𝐚́𝐥𝐢𝐝𝐨 𝐬𝐨𝐦𝐞𝐧𝐭𝐞 𝐇𝐎𝐉𝐄.\n\n🔔 Clique no botão "𝐐𝐔𝐄𝐑𝐎 𝐂𝐎𝐌𝐏𝐑𝐀𝐑 ✅" e tenha acesso imediato 𝗽𝗼𝗿 𝗮𝗽𝗲𝗻𝗮𝘀 𝗥$ 9,𝟵𝟬 (𝗩𝗮́𝗹𝗶𝗱𝗮 𝘀𝗼𝗺𝗲𝗻𝘁𝗲 𝗽𝗼𝗿 𝗵𝗼𝗷𝗲) • Logo após as 𝟭 𝗛𝗼𝗿𝗮, o 𝗽𝗿𝗲𝗰̧𝗼 𝘃𝗼𝗹𝘁𝗮𝗿𝗮́ a ser R̶$̶ 2̶4̶,̶9̶9̶!'
			)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot: bot,
						log_channel_id: log_channel_id,
					});
				}
			});

		const tx = createTxid();
		const message = await ctx
			.replyWithPhoto(
				{
					source: fs.createReadStream(path.resolve('assets/images/banner.png')),
				},
				Markup.inlineKeyboard([
					Markup.button.callback('𝗤𝗨𝗘𝗥𝗢 𝗖𝗢𝗠𝗣𝗥𝗔𝗥 ✅', `select_${tx}`),
				])
			)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot: bot,
						log_channel_id: log_channel_id,
					});
				}
			});

		if (!message) return;
		const messageId = message.message_id;
		bot.action(`select_${tx}`, async (ctx_2) =>
			ctx_2.telegram.editMessageReplyMarkup(
				ctx.chat?.id,
				messageId,
				undefined,
				{
					inline_keyboard: [
						[
							Markup.button.callback(
								'𝙀𝙎𝘾𝙊𝙇𝙃𝘼 𝘾𝙊𝙈𝙊 𝘿𝙀𝙎𝙀𝙅𝘼 𝘼𝘿𝙌𝙐𝙄𝙍𝙄𝙍 ✅',
								'clicked_again'
							),
						],
						[
							Markup.button.callback('𝐏𝐢𝐱 ❖', 'generate_payment_pix'),
							Markup.button.callback('𝐂𝐚𝐫𝐭𝐚̃𝐨 💳', 'generate_payment_card'),
						],
					],
				}
			)
		);

		sendLog({
			userName: ctx.from.first_name,
			userUser: ctx.from.username,
			log_type: 'STARTBOT',
			bot: bot,
			log_channel_id: log_channel_id,
		});
	} catch (error) {
		console.log(error);
		console.log('Erro as ' + new Date().getTime());
	}
}