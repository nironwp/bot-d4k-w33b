/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Upssel } from '@prisma/client';
import resizeBase64Img from '../resizeBase64Img';
import { createPaymentPoints, createPix } from '../src/lib/mercadopago';
import { Markup } from 'telegraf';
import { gerarIdNumerico } from '../generarIdNumerico';
const prisma = new PrismaClient();
export default async function generatePayment(
	ctx: any,
	value: number,
	isCard = false, 
	bot_name:string,
	upssel?: Upssel,
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

		if (!isCard) {
			const payment = await createPix({
				devedor: {
					nome: ctx.from.first_name,
				},
				exp_sgs: 3600,
				valor: value,
				mp_token: process.env[`MP_TOKEN_${bot_name}`] as string,
			});
			await prisma.order.create({
				data: {
					chatId: ctx.chat.id,
					status: 'PENDING',
					upssel: upssel,
					bot_name,
					txId: payment.tx_id as number,
					buyerName: ctx.from.first_name,
					buyerUser: ctx.from.username,
				},
			});

			if (payment.error_message) {
				ctx.reply(payment.error_message);
			}
			await ctx.replyWithPhoto({
				source: Buffer.from(
					await resizeBase64Img(payment.qrcodebase64 as string),
					'base64'
				),
			});

			return await ctx.replyWithMarkdownV2(
				`✅ Copie o pix copia e cola abaixou ou escaneia o qrcode para concluir sua compra & ↓ 𝗘 𝗿𝗲𝗮𝗹𝗶𝘇𝗲 𝗮 𝘀𝘂𝗮 𝗰𝗼𝗺𝗽𝗿𝗮 𝗰𝗼𝗺 𝘂𝗺 𝗱𝗲𝘀𝗰𝗼𝗻𝘁𝗼 ú𝗻𝗶𝗰𝗼 𝗱𝗲 𝟱𝟬% ❗️\n\n \`${payment.qrcode}\``
			);
		} else {
			const txId = gerarIdNumerico();
			const order = await prisma.order.create({
				data: {
					chatId: ctx.chat.id,
					status: 'PENDING',
					upssel: upssel,
					bot_name,
					txId: txId as unknown as number,
					buyerName: ctx.from.first_name,
					buyerUser: ctx.from.username,
				},
			});
			const payment_endpoints = await createPaymentPoints({
				order_id: order.txId + '',
				valor: value,
				mp_token: process.env[`MP_TOKEN_${bot_name}`] as string,
			});

			return await ctx.reply(
				'✅ Clique no botão abaixo para concluir sua compra no cartão',
				Markup.inlineKeyboard([
					Markup.button.url(
						'𝙁𝙖𝙯𝙚𝙧 𝙥𝙖𝙜𝙖𝙢𝙚𝙣𝙩𝙤 ✅',
						process.env.NODE_ENV !== 'homog'
							? (payment_endpoints.init_point as string)
							: (payment_endpoints.sandbox_init_point as string)
					),
				])
			);
		}
	} catch (error: any) {
		console.log(error);
		console.log('Erro as ' + new Date().getTime());
	}
}
