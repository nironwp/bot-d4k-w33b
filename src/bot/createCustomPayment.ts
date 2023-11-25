/* eslint-disable @typescript-eslint/no-explicit-any */

import resizeBase64Img from '../resizeBase64Img';
import { PrismaClient } from '@prisma/client';
import { createPaymentPoints, createPix } from '../src/lib/mercadopago';
import { gerarIdNumerico } from '../generarIdNumerico';
import { Markup } from 'telegraf';

const prisma = new PrismaClient();
export default async function createCustomPayment(
	ctx: any,
	custom_price: number,
	custom_description: string,
	isCard: boolean,
	bot_name: string,
	type?: 'TEEN' | 'INCEST',
) {
	try {
		await prisma.order.deleteMany({
			where: {
				chatId: ctx.chat.id,
				AND: {
					NOT: {
						status: 'COMPLETE'
					}
				}
			},
		});

		if(!isCard) {
			const payment = await createPix({
				devedor: {
					nome: ctx.from.first_name,
				},
				exp_sgs: 3600,
				valor: custom_price,
				mp_token: process.env[`MP_TOKEN_${bot_name}`] as  string
			});
	
			await prisma.order.create({
				data: {
					bot_name: bot_name,
					chatId: ctx.chat.id,
					status: 'PENDING',
					upssel: type,
					txId: payment.tx_id as number,
					buyerName: ctx.from.first_name,
					buyerUser: ctx.from.username,
				},
			});
			// const payment_points = await createPaymentPoints({
			// 	order_id: payment.tx_id+'',
			// 	valor: custom_price
			// });
			if (payment.error_message) {
				ctx.reply(payment.error_message);
			}
			await ctx.replyWithPhoto({
				source: Buffer.from(
					await resizeBase64Img(payment.qrcodebase64 as string),
					'base64'
				),
			});

			return await ctx.reply(
				custom_description,
			);
		}else {
			const order = await prisma.order.create({
				data: {
					chatId: ctx.chat.id,
					status: 'PENDING',
					bot_name,
					upssel: type,
					txId: gerarIdNumerico(),
					buyerName: ctx.from.first_name,
					buyerUser: ctx.from.username,
				},
			});
			const payment_points = await createPaymentPoints({
				order_id: order.txId + '',
				valor: custom_price,
				mp_token: process.env[`MP_TOKEN_${bot_name}`] as string,
			});


			return await ctx.reply(
				custom_description,
				Markup.inlineKeyboard([
					Markup.button.url(
						'𝙁𝙖𝙯𝙚𝙧 𝙥𝙖𝙜𝙖𝙢𝙚𝙣𝙩𝙤 ✅',
						process.env.NODE_ENV !== 'homog'
							? (payment_points.init_point as string)
							: (payment_points.sandbox_init_point as string)
					),
				])
			);
		}
	} catch (error: any) {
		console.log(error);
		console.log('Erro as ' + new Date().getTime());
	}
}
