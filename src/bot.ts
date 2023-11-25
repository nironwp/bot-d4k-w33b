/* eslint-disable @typescript-eslint/no-explicit-any */
import { Markup, Telegraf } from 'telegraf';
import * as fs from 'fs';
import moment from 'moment-timezone';
import path from 'path';
import 'dotenv/config';
import { Order, PrismaClient, Upssel } from '@prisma/client';
import startBotMessage from './bot/start';
import generatePayment from './bot/generatePayment';
import createCustomPayment from './bot/createCustomPayment';
import cron from 'node-cron';
import { obterPagamento } from './src/lib/mercadopago';
import mpcredentials from './src/lib/mpcredentials';
import createTxid from './createTxid';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
const prisma = new PrismaClient();
async function startBot(bot_name: string, bot_token: string, log_channel_id: string) {
	console.log(`Initing ${bot_name}: sending log to ${log_channel_id}`)
	const bot = new Telegraf(
		bot_token
	);
	bot.start(async (ctx) => {
		await prisma.possibleLead.create({
			data: {
				chatId: ctx.chat.id,
				bot_sended: bot_name,
			},
		});
		return startBotMessage(ctx, bot, log_channel_id);
	});


	bot.action('clicked_again', (ctx) => {
		return ctx.reply(
			'𝙋𝙖𝙧𝙖 𝙘𝙤𝙣𝙩𝙞𝙣𝙪𝙖𝙧 𝙖 𝙟𝙤𝙧𝙣𝙖𝙙𝙖 𝙖𝙤 𝙥𝙧𝙖𝙯𝙚𝙧 𝙨𝙚𝙢 𝙡𝙞𝙢𝙞𝙩𝙚𝙨, 𝙚𝙨𝙘𝙤𝙡𝙝𝙖 𝙪𝙢𝙖 𝙙𝙖𝙨 𝙤𝙥𝙘̧𝙤̃𝙚𝙨 𝙖𝙜𝙤𝙧𝙖 – 𝙧𝙖́𝙥𝙞𝙙𝙤, 𝙛𝙖́𝙘𝙞𝙡 𝙚 𝙨𝙚𝙜𝙪𝙧𝙤.'
		);
	});

	bot.action('amostras_jovenzinhas', async (ctx) => {
		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia01-jovenzinhas.mp4')
			),
		});
		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia02-jovenzinhas.mp4')
			),
		});

		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia03-jovenzinhas.mp4')
			),
		});

		setTimeout(async () => {
			const tx = createTxid();
			const message = await ctx.reply(
				'𝙴𝚜𝚜𝚎 𝚐𝚛𝚞𝚙𝚘 𝚅𝙸𝙿 𝚎́ 𝚌𝚘𝚗𝚝𝚎́𝚞𝚍𝚘 𝚞́𝚗𝚒𝚌𝚘  𝚎𝚖 𝚚𝚞𝚎 𝚟𝚘𝚌𝚎̂ 𝚗𝚊̃𝚘 𝚟𝚊𝚒 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚛 𝚎𝚖 𝚗𝚎𝚗𝚑𝚞𝚖 𝚘𝚞𝚝𝚛𝚘 𝚕𝚞𝚐𝚊𝚛 𝚍𝚘 𝚝𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚍𝚎 𝚁$𝟷𝟸𝟶 𝚙𝚘𝚛 𝚁$19,9𝟶 𝑺𝑶𝑴𝑬𝑵𝑻𝑬 𝑯𝑶𝑱𝑬',
				Markup.inlineKeyboard([
					Markup.button.callback('𝗤𝗨𝗘𝗥𝗢 𝗖𝗢𝗠𝗣𝗥𝗔𝗥 ✅', `select_${tx}`),
				])
			);

			if (!message) return;
			const messageId = message.message_id;
			bot.action(`select_${tx}`, async (ctx_2) =>
				await ctx_2.telegram.editMessageReplyMarkup(
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
								Markup.button.callback('𝐏𝐢𝐱 ❖', 'payment_jovenzinhas_pix'),
								Markup.button.callback('𝐂𝐚𝐫𝐭𝐚̃𝐨 💳', 'payment_jovenzinhas_card'),
							],
						],
					}
				)
			);
		}, 3_699);
	});

	setInterval(() => {analysisOrders(bot_name, bot, log_channel_id)}, 10_000);
	setInterval(() => {analysisLeadsBuyed(bot, log_channel_id,bot_name)}, 10_000);

	bot.action('amostras_proibidao', async (ctx) => {
		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia01-proibidao.MP4')
			),
		});
		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia02-proibidao.MP4')
			),
		});

		await ctx.replyWithVideo({
			source: fs.createReadStream(
				path.resolve('assets/md/midia03-proibidao.MP4')
			),
		});

		setTimeout(async () => {
			const tx = createTxid();
			const message = await ctx.reply(
				'𝙴𝚜𝚜𝚎 𝚐𝚛𝚞𝚙𝚘 𝚅𝙸𝙿 é o único onde você vai encontrar esse tipo de contéudo amador & verdadeiro de 𝚁$𝟷𝟸𝟶 𝚙𝚘𝚛 𝚁$19,9𝟶 𝑺𝑶𝑴𝑬𝑵𝑻𝑬 𝑯𝑶𝑱𝑬',
				Markup.inlineKeyboard([
					Markup.button.callback('𝗤𝗨𝗘𝗥𝗢 𝗖𝗢𝗠𝗣𝗥𝗔𝗥 ✅', `select_${tx}`),
				])
			);

			if (!message) return;
			const messageId = message.message_id;
			bot.action(`select_${tx}`, async (ctx_2) =>
				await ctx_2.telegram.editMessageReplyMarkup(
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
								Markup.button.callback('𝐏𝐢𝐱 ❖', 'payment_proibidao_pix'),
								Markup.button.callback('𝐂𝐚𝐫𝐭𝐚̃𝐨 💳', 'payment_proibidao_card'),
							],
						],
					}
				)
			);
		}, 3_699);
	});

	bot.action('payment_jovenzinhas_pix', async (ctx: any) => {
		return await generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 19.9,
			false,
			bot_name,
			'TEEN'
		);
	});

	bot.action('payment_proibidao_pix', async (ctx: any) => {
		return await generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 19.9,
			false,
			bot_name,
			'INCEST'
		);
	});

	bot.action('payment_jovenzinhas_card', async (ctx: any) => {
		return await createCustomPayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 19.9,
			'✅ Clique no botão abaixo para concluir sua compra no cartão & ter acesso ao contéudo mais raro do telegram 😱',
			true,
			bot_name,
			'TEEN'
		);
	});

	bot.action('payment_proibidao_card', async (ctx: any) => {
		return await createCustomPayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 19.9,
			'✅ Clique no botão abaixo para concluir sua compra no cartão & ter acesso ao contéudo mais raro do telegram 😱',
			true,
			bot_name,
			'INCEST'
		);
	});

	bot.action('jovenzinhas_confirmation', async (ctx: any) => {
		return await ctx.sendMessage(
			'𝗩𝗼𝗰𝗲̂ 𝗾𝘂𝗲𝗿 𝘂𝗺 𝗴𝗿𝘂𝗽𝗼 𝗱𝗲 𝗷𝗼𝘃𝗲𝗻𝘇𝗶𝗻𝗵𝗮𝘀 𝗯𝗲𝗺𝗺𝗺 𝗻𝗼𝘃𝗶𝗻𝗵𝗮𝘀 𝘀𝗲𝗻𝘁𝗮𝗻𝗱𝗼 𝘀𝗲𝗺 𝗱𝗼́ 🤫😏',
			Markup.inlineKeyboard([
				Markup.button.callback('𝗠𝗔𝗡𝗗𝗔 𝗔𝗠𝗢𝗦𝗧𝗥𝗔 🥵', 'amostras_jovenzinhas'),
				Markup.button.callback(
					'𝗡𝗔̃𝗢 𝗣𝗥𝗘𝗙𝗜𝗥𝗢 𝗜𝗡𝗖𝗘𝗦𝗧𝗢 🤫',
					'jovenzinhas_confirmation'
				),
			])
		);
	});

	bot.action('proibidao_confirmation', async (ctx: any) => {
		return await ctx.sendMessage(
			'𝗩𝗼𝗰𝗲̂ 𝗾𝘂𝗲𝗿 𝘂𝗺 𝗴𝗿𝘂𝗽𝗼 com todo tipo de contéudo que ninguem tem coragem de mostrar?',
			Markup.inlineKeyboard([
				Markup.button.callback('𝗠𝗔𝗡𝗗𝗔 𝗔𝗠𝗢𝗦𝗧𝗥𝗔 🥵', 'amostras_proibidao'),
				Markup.button.callback(
					'𝐍𝐀̃𝐎 𝐏𝐑𝐄𝐅𝐈𝐑𝐎 𝐆𝐀𝐑𝐎𝐓𝐈𝐍𝐇𝐀𝐒🤫',
					'jovenzinhas_confirmation'
				),
			])
		);
	});

	bot.action('get_gifts', async (ctx) => {
		return await ctx.sendMessage(
			'𝗘𝗦𝗖𝗢𝗟𝗛𝗔 𝗦𝗘𝗨 𝗣𝗥𝗘𝗦𝗘𝗡𝗧𝗘 🎁 \n\n𝐿𝑒𝑚𝑏𝑟𝑎𝑛𝑑𝑜 𝑞𝑢𝑒 𝑣𝑜𝑐𝑒̂ 𝑡𝑒𝑚 𝑠𝑜𝑚𝑒𝑛𝑡𝑒 𝟷 𝘩𝑜𝑟𝑎 𝑝𝑎𝑟𝑎 𝑟𝑒𝑠𝑔𝑎𝑡𝑎𝑟 𝑒𝑙𝑒~\n\n𝗘𝗦𝗖𝗢𝗟𝗛𝗔 𝗨𝗠 𝗗𝗢𝗦 𝗗𝗢𝗜𝗦 𝗢𝗨 𝗢𝗦 𝗗𝗢𝗜𝗦 😏',
			Markup.inlineKeyboard([
				Markup.button.callback(
					'𝗜𝗡𝗖𝗘𝗦𝗧𝗢 𝟭𝟬𝟬% 𝗣𝗥𝗢𝗜𝗕𝗜𝗗𝗢 🥵',
					'proibidao_confirmation'
				),
				Markup.button.callback('𝗝𝗢𝗩𝗘𝗡𝗭𝗜𝗡𝗛𝗔𝗦 🤫', 'jovenzinhas_confirmation'),
			])
		);
	});

	const reportMessage = async () => {
		const currentDate = new Date();
		const firstDayOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1
		);
		const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));

		const orders_today = await prisma.sell.findMany({
			where: {
				bot_name: bot_name,
				createdAt: {
					gte: startOfDay,
				},
			},
		});

		const total_orders_value_today = orders_today.reduce(
			(total, order) => total + order.value,
			0
		);

		const orders_this_month = await prisma.sell.findMany({
			where: {
				bot_name: bot_name,
				createdAt: {
					gte: firstDayOfMonth,
				},
			},
		});

		const total_orders_value_this_month = orders_this_month.reduce(
			(total, order) => total + order.value,
			0
		);

		const total_orders_value = await prisma.sell.aggregate({
			where: {
				bot_name: bot_name,
			},
			_sum: {
				value: true,
			},
		});
		const messageReport = [
			`𝙍𝙀𝙇𝘼𝙏𝙊́𝙍𝙄𝙊 ${process.env.BOT_NAME as string} 🤖`,
			`ＨＯＪＥ：𝐑$${total_orders_value_today.toFixed(2)}`,
			`𝑻𝑶𝑻𝑨𝑳 𝑬𝑺𝑺𝑬 𝑴𝑬̂𝑺: R$ ${total_orders_value_this_month.toFixed(2)}`,
			`𝙌𝙐𝘼𝙉𝙏𝙄𝘿𝘼𝘿𝙀 𝘿𝙀 𝙑𝙀𝙉𝘿𝘼𝙎 𝙀𝙎𝙎𝙀 𝙈𝙀̂𝙎: ${orders_this_month.length}`,
			`𝐕𝐀𝐋𝐎𝐑 𝐓𝐎𝐓𝐀𝐋: R$ ${total_orders_value._sum.value?.toFixed(2)}`,
		].join('\n');

		await bot.telegram.sendMessage(log_channel_id as string, messageReport);
	};

	const gerarRelatorio = async () => {
		console.log('Gerando relatório de ganhos 💸.');
		await reportMessage();
	};
	// Agendamento da tarefa para ser executada todos os dias às 23:50
	cron.schedule(
		'30 23 * * *',
		() => {
			gerarRelatorio();
		},
		{
			scheduled: true,
			timezone: 'America/Sao_Paulo', // Substitua pela sua timezone, se necessário.
		}
	);

	bot.action('generate_payment_pix', async (ctx: any) => {
		return generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : Number(process.env.PRICE_BOT),
			false,
			bot_name,
		);
	});

	bot.action('generate_payment_pix_discount', async (ctx: any) => {
		return generatePayment(ctx, mpcredentials.sandbox ? 0.1 : 6.99, false, bot_name);
	});

	bot.action('generate_payment_pix_discount_proibidao', async (ctx: any) => {
		return generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 14.99,
			false,
			bot_name,
			'INCEST'
		);
	});

	bot.action('generate_payment_pix_discount_jovenzinhas', async (ctx: any) => {
		return generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 14.99,
			false,
			bot_name,
			'TEEN'
		);
	});

	bot.action('generate_payment_card', async (ctx: any) => {
		return generatePayment(ctx, mpcredentials.sandbox ? 0.1 : 9.9, true, bot_name);
	});

	bot.action('generate_payment_card_discount', async (ctx: any) => {
		return generatePayment(ctx, mpcredentials.sandbox ? 0.1 : 6.99, true, bot_name);
	});

	bot.action('generate_payment_card_discount_proibidao', async (ctx: any) => {
		return generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 14.99,
			true,
			bot_name,
			'INCEST'
		);
	});

	bot.action('generate_payment_card_discount_jovenzinhas', async (ctx: any) => {
		return generatePayment(
			ctx,
			mpcredentials.sandbox ? 0.1 : 14.99,
			true,
			bot_name,
			'TEEN'
		);
	});

	try {
		bot.launch();
	} catch (error) {
		console.log('Erro as ' + new Date().getTime());
	}
}

export async function analysisLeadsBuyed(bot: any,log_channel_id: string, bot_name: string) {
	const currentTime = new Date();
	try {
		const leads = await prisma.lead.findMany({
			where: {
				bot_name: bot_name
			}
		});
		for (const lead of leads) {
			const leadCreationTime = new Date(lead.createdAt);

			if (
				currentTime.getTime() - leadCreationTime.getTime() >= 10000 &&
        !lead.sendedPresent
			) {
				await bot.telegram
					.sendMessage(
						lead.chatId,
						'🎉 Decidimos dar um presente único para você em todo o telegram, clique em "𝗣𝗘𝗚𝗔𝗥 𝗣𝗥𝗘𝗦𝗘𝗡𝗧𝗘 🎁" para receber seu presente',
						Markup.inlineKeyboard([
							Markup.button.callback('𝗣𝗘𝗚𝗔𝗥 𝗣𝗥𝗘𝗦𝗘𝗡𝗧𝗘 🎉', 'get_gifts'),
						])
					)
					.catch(function (error: { response: { statusCode: number } }) {
						if (error.response && error.response.statusCode === 403) {
							sendLog({
								log_type: 'USERBLOCK',
								bot,
								log_channel_id: log_channel_id,
							});
						}
					});

				await prisma.lead.update({
					where: {
						id: lead.id,
					},
					data: {
						sendedPresent: true,
					},
				});
			}
		}
	} catch (error: any) {
		console.log('Erro ao buscar os leads: ' + error.message);
	}
}

export async function analysisOrders(bot_name: string, bot: any, log_channel_id: string) {
	const currentTime = new Date();
	///
	try {
		const orders = await prisma.order.findMany({
			where: {
				bot_name: bot_name
			}
		}); // Busca todas as orders
		console.log(`Analisando ${orders.length} pedidos`);
		for (const order of orders) {
			console.log('Status da order:', order.status);
			try {
				const orderCreationTime = new Date(order.createdAt);
				const details = await obterPagamento(
					order.txId,
					order.bot_name
				);

				console.log(details.status);
				if (order.status === 'COMPLETE' || details.status === 'approved') {
					console.log('Status approved ' + order.id);
					await buyedGroup(bot, bot_name, order, log_channel_id);
					await prisma.order.delete({
						where: { id: order.id },
					});
					await prisma.lead.create({
						data: {
							chatId: order.chatId,
							bot_name: order.bot_name,
						},
					});
					if (order.upssel === 'INCEST') {
						sendLog({
							order,
							log_type: 'INCESTUPSSELBUYED',
							bot,
							log_channel_id: log_channel_id,
						});
					} else if (order.upssel === 'TEEN') {
						sendLog({
							order,
							log_type: 'TEENUPSSELBUYED',
							log_channel_id: log_channel_id,
							bot,
						});
					} else {
						sendLog({
							order,
							log_channel_id: log_channel_id,
							log_type: 'EFFETUED',
							bot,
						});
					}
				}

				if (
					currentTime.getTime() - orderCreationTime.getTime() >= 43200000 &&
            order.remarketStage === 2
				) {
					await prisma.order.delete({
						where: { id: order.id },
					});
				}
				if (
					currentTime.getTime() - orderCreationTime.getTime() >= 240000 &&
          order.remarketStage === 0
				) {
					firstRemarket(bot, order.chatId, log_channel_id);
					await prisma.order.update({
						where: {
							id: order.id,
						},
						data: {
							remarketStage: 1,
						},
					});
					console.log(`Order ${order.id} processada após 4 minutos.`);
				}

				if (
					currentTime.getTime() - orderCreationTime.getTime() >= 3600000 &&
          order.remarketStage === 1
				) {
					sendLog({
						log_type: 'NOTEFETUED',
						order,
						bot,
						log_channel_id: log_channel_id,
					});
					if (order.upssel) {
						remarketUpssel(bot, order.chatId, order.upssel, log_channel_id);
					} else {
						secondRemarket(bot, order.chatId, log_channel_id);
					}
					await prisma.order.update({
						where: {
							id: order.id,
						},
						data: {
							remarketStage: 2,
						},
					});
				}
			} catch (error) {
				console.log(error);
				console.log(`Erro ao processar order ${order.id}`);
			}
		}
	} catch (error) {
		console.error('Erro ao analisar orders:', error);
	}
}

// async function firstUpssel(bot:any, chat_id: number) {

// }

async function secondRemarket(bot: any, chat_id: number,log_channel_id: string) {
	await bot.telegram
		.sendMessage(
			chat_id,
			'👋🏻 Olá, vimos que você gerou o Pagamento e ainda não concluiu a compra... Para demonstrar que queremos que você seja nosso assinante, abaixamos o valor para 𝗥$ 6,𝟵9 Caso você agora queira levar agora, te daremos: +𝟮 𝗚𝗿𝘂𝗽𝗼𝘀 𝗩𝗜𝗣𝗦 - +𝟭 𝗚𝗿𝘂𝗽𝗼 𝗣𝗮𝗿𝗮 𝗧𝗿𝗼𝗰𝗮𝘀 𝗱𝗲 𝗠𝗶́𝗱𝗶𝗮𝘀 𝗣𝗿𝗼𝗶𝗯𝗶𝗱𝗮𝘀 - + 𝟭𝟰𝗚𝗕 𝗱𝗲 𝗠𝗶́𝗱𝗶𝗮𝘀 𝗱𝗲 𝗣𝘂𝘁𝗮𝗿𝗶𝗮 𝗗𝟯𝟯𝗣𝗪𝗲𝗯.\n\n✅ Clique em: \'𝐐𝐔𝐄𝐑𝐎 𝐀𝐃𝐐𝐔𝐈𝐑𝐈𝐑 🎉\' E realize o Pagamento e Garanta acesso em nosso VIP.'
		)
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});
	await bot.telegram
		.sendPhoto(
			chat_id,
			{
				source: fs.createReadStream(
					path.resolve('assets/images/remarket-banner.jpg')
				),
			},
			Markup.inlineKeyboard([
				Markup.button.callback(
					'𝐐𝐔𝐄𝐑𝐎 𝐀𝐃𝐐𝐔𝐈𝐑𝐈𝐑 🎉',
					'generate_payment_pix_discount'
				),
			])
		)
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});
}

async function remarketUpssel(bot: any, chat_id: number, upssel: Upssel, log_channel_id: string) {
	const tx = createTxid();
	await bot.telegram
		.sendMessage(
			chat_id,
			'👋🏻 Olá, vimos que você gerou o Pagamento e ainda não concluiu a compra... Para demonstrar que queremos que você seja nosso assinante, abaixamos o valor para 𝗥$ 14,𝟵9 Caso você agora queira levar agora, te daremos: +𝟮 𝗚𝗿𝘂𝗽𝗼𝘀 𝗩𝗜𝗣𝗦 - +𝟭 𝗚𝗿𝘂𝗽𝗼 𝗣𝗮𝗿𝗮 𝗧𝗿𝗼𝗰𝗮𝘀 𝗱𝗲 𝗠𝗶́𝗱𝗶𝗮𝘀 𝗣𝗿𝗼𝗶𝗯𝗶𝗱𝗮𝘀 - + 𝟭𝟰𝗚𝗕 𝗱𝗲 𝗠𝗶́𝗱𝗶𝗮𝘀 𝗱𝗲 𝗣𝘂𝘁𝗮𝗿𝗶𝗮 𝗗𝟯𝟯𝗣𝗪𝗲𝗯.\n\n✅ Clique em: \'𝐐𝐔𝐄𝐑𝐎 𝐀𝐃𝐐𝐔𝐈𝐑𝐈𝐑 🎉\' E realize o Pagamento e Garanta acesso em nosso VIP.'
		)
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});
	const message = await bot.telegram
		.sendPhoto(
			chat_id,
			{
				source: fs.createReadStream(
					path.resolve('assets/images/remarket-banner-upssel.jpg')
				),
			},
			Markup.inlineKeyboard([
				Markup.button.callback('𝐐𝐔𝐄𝐑𝐎 𝐀𝐃𝐐𝐔𝐈𝐑𝐈𝐑 🎉', `select_${tx}`),
			])
		)
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});
	if (!message) return;
	const messageId = message.message_id;
	bot.action(
		`select_${tx}`,
		async (ctx_2: {
      telegram: {
        editMessageReplyMarkup: (
          arg0: any,
          arg1: any,
          arg2: undefined,
          arg3: {
            inline_keyboard: (InlineKeyboardButton.CallbackButton & {
              hide: boolean;
            })[][];
          }
        ) => any;
      };
    }) =>
			await ctx_2.telegram.editMessageReplyMarkup(chat_id, messageId, undefined, {
				inline_keyboard: [
					[
						Markup.button.callback(
							'𝙀𝙎𝘾𝙊𝙇𝙃𝘼 𝘾𝙊𝙈𝙊 𝘿𝙀𝙎𝙀𝙅𝘼 𝘼𝘿𝙌𝙐𝙄𝙍𝙄𝙍 ✅',
							'clicked_again'
						),
					],
					[
						Markup.button.callback(
							'𝐏𝐢𝐱 ❖',
							upssel === 'TEEN'
								? 'generate_payment_pix_discount_jovenzinhas'
								: 'generate_payment_pix_discount_proibidao'
						),
						Markup.button.callback(
							'𝐂𝐚𝐫𝐭𝐚̃𝐨 💳',
							upssel === 'TEEN'
								? 'generate_payment_card_discount_jovenzinhas'
								: 'generate_payment_card_discount_proibidao'
						),
					],
				],
			})
	);
}

async function firstRemarket(bot: any, chat_id: number, log_channel_id: string) {
	await bot.telegram
		.sendMessage(
			chat_id,
			'⛔️ 𝗦𝗲𝘂 𝗽𝗮𝗴𝗮𝗺𝗲𝗻𝘁𝗼 𝗮𝗶𝗻𝗱𝗮 𝗻𝗮̃𝗼 𝗳𝗼𝗶 𝗰𝗿𝗲𝗱𝗶𝘁𝗮𝗱𝗼 𝗲𝗺 𝗻𝗼𝘀𝘀𝗼 𝘀𝗶𝘀𝘁𝗲𝗺𝗮. O Pagamento para ser aprovado, demora em torno de 10 a 60 segundos 𝗮𝗽𝗼́𝘀 𝗮 𝗰𝗼𝗺𝗽𝗿𝗮 𝗳𝗲𝗶𝘁𝗮. '
		)
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});
}

async function buyedGroup(bot: any, bot_name: string, order: Order, log_channel_id:string) {
	console.log('Sending group for ' + order.id);
	await bot.telegram
		.sendMessage(order.chatId, 'Esperamos que goste ❤')
		.catch(function (error: { response: { statusCode: number } }) {
			if (error.response && error.response.statusCode === 403) {
				sendLog({
					log_type: 'USERBLOCK',
					bot,
					log_channel_id: log_channel_id,
				});
			}
		});

	if (order.upssel === 'INCEST') {
		await prisma.sell.create({
			data: {
				bot_name: bot_name,
				value: 19.9,
			},
		});
		await bot.telegram
			.sendMessage(
				order.chatId,
				'𝐕𝐈𝐏 𝐃𝐀𝐑𝐊𝐈𝐍𝐂𝟑𝐒𝐓𝟎💥 - https://t.me/+NvEVEfw0kuE4NmU5'
			)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot,
						log_channel_id: log_channel_id,
					});
				}
			});
	} else if (order.upssel === 'TEEN') {
		await prisma.sell.create({
			data: {
				bot_name: bot_name,
				value: 19.9,
			},
		});
		await bot.telegram
			.sendMessage(
				order.chatId,
				'⭐️NOVINHAS PROIBIDÃO VIP - https://t.me/+Z2tXFl5VVyVjNjYx'
			)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot,
						log_channel_id: log_channel_id,
					});
				}
			});
	} else {
		await prisma.sell.create({
			data: {
				bot_name: bot_name,
				value: Number(process.env.PRICE_BOT),
			},
		});
		await bot.telegram
			.sendMessage(
				order.chatId,
				'𝐕𝐈𝐏 D4RKMIDIAS 🔥 👇\nhttps://t.me/+yVVvVODhmOxmYTIx \n\nBrinde 1 👇\nhttps://t.me/You_Sexybeach \n\nBrinde 2 👇\nhttps://t.me/+__MUqkeNEqA1NDk0 \n\nBrinde 3 👇\nhttps://t.me/joinchat/BHQ95nfIP6YwZDk6 \n\n'
			)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot,
						log_channel_id: log_channel_id,
					});
				}
			});
	}
}

interface LogProps {
  log_type:
    | 'STARTBOT'
    | 'NOTEFETUED'
    | 'EFFETUED'
    | 'USERBLOCK'
    | 'TEENUPSSELBUYED'
    | 'INCESTUPSSELBUYED';
  order?: Order;
  userName?: string;
  userUser?: string;
  bot: any;
  log_channel_id: string
}

let index = 1;
export async function sendLog(props: LogProps): Promise<void> {
	const timestamp = moment().tz('America/Sao_Paulo').format('HH:mm:ss');

	let message = '';

	switch (props.log_type) {
	case 'STARTBOT':
		if (props.userName || props.userUser) {
			message = `ＢＯＴ ＩＮＩＣＩＡＤＯ💥\nNome do lead: ${props.userName}\nUsuário: @${props.userUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		}
		break;

	case 'EFFETUED':
		if (!props.order) return;
		message = `ＣＯＭＰＲＡ ＥＦＥＴＵＡＤＡ ✅\nNome do lead: ${props.order.buyerName}\nUsuário: @${props.order.buyerUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		break;

	case 'NOTEFETUED':
		if (!props.order) return;
		message = `ＣＯＭＰＲＡ ＮＡ̃Ｏ ＥＦＥＴＵＡＤＡ ⛔️\nNome do lead: ${props.order.buyerName}\nUsuário: @${props.order.buyerUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		break;

	case 'USERBLOCK':
		if (!props.order) return;
		message = `USUÁRIO BLOQUEOU O BOT ⛔️\nNome do lead: ${props.order.buyerName}\nUsuário: @${props.order.buyerUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		break;

	case 'TEENUPSSELBUYED':
		if (!props.order) return;
		message = `ＵＰＳＥＬＬ ＪＯＶＥＮＺＩＮＨＡＳ ✅\nNome do lead: ${props.order.buyerName}\nUsuário: @${props.order.buyerUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		break;
	case 'INCESTUPSSELBUYED':
		if (!props.order) return;
		if (!props.order) return;
		message = `ＵＰＳＥＬＬ ＰＲＯＩＢＩＤＡ̃Ｏ ✅\nNome do lead: ${props.order.buyerName}\nUsuário: @${props.order.buyerUser}\nN* do cliente: ${index}\nHora (Brasília): ${timestamp}`;
		break;
	default:
		break;
	}

	if (message) {
		await props.bot.telegram
			.sendMessage(Number(props.log_channel_id), message)
			.catch(function (error: { response: { statusCode: number } }) {
				if (error.response && error.response.statusCode === 403) {
					sendLog({
						log_type: 'USERBLOCK',
						bot: props.bot,
						log_channel_id: props.log_channel_id
					});
				}
			});
		index++;
	}
}

export default startBot;
