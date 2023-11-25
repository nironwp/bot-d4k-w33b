/* eslint-disable no-mixed-spaces-and-tabs */
import {
	MercadoPagoConfig,
	Payment,
	Preference,
} from 'mercadopago';
import 'dotenv/config';
// Step 2: Initialize the client object

interface PixProps {
	exp_sgs: number;
	devedor: {
		nome: string;
	};
	valor: number;
	mp_token: string
}
interface PixReturn {
	tx_id?: number | undefined;
	url?: string | undefined;
	qrcode?: string | undefined;
	qrcodebase64?: string | undefined;
	error_message?: string;
	
}

export async function createPix(props: PixProps): Promise<PixReturn> {
	const client = new MercadoPagoConfig({
		accessToken: props.mp_token,
		options: { timeout: 5000 },
	});
	
	const payment = new Payment(client);
	const body = {
		transaction_amount: props.valor,
		description: 'Pagamento vitálicio VIP',
		payment_method_id: 'pix',
		payer: {
			email: 'unknown@gmail.com',
		},
	};
	const pay = await payment.create({ body });
	if (!pay.point_of_interaction || !pay.point_of_interaction.transaction_data) {
		return {
			error_message:
        'Aconteceu um erro ao executar seu pagamento entre em contato com o suporte (CONTATO NA BIO DESSE BOT)',
		};
	}

	return {
		qrcode: pay.point_of_interaction.transaction_data.qr_code,
		qrcodebase64: pay.point_of_interaction.transaction_data.qr_code_base64,
		tx_id: pay.id,
		url: pay.point_of_interaction.transaction_data.ticket_url,
	};
}

interface CardProps {
  mp_token: string;
  order_id: string;
  valor: number;
}

export async function createPaymentPoints(props: CardProps) {
	const client = new MercadoPagoConfig({
		accessToken: props.mp_token,
		options: { timeout: 5000 },
	});
	
	const preference = new Preference(client);
	const result = await preference.create({
		body: {
			payment_methods: {
				default_installments: 1,
				installments: 1,
			},
			items: [
				{
					title: 'Vitálicio VIP',
					unit_price: props.valor,
					currency_id: 'BRL',
					quantity: 1,
					id: 'qyiwgyqugeyuqwgewyquegqw',
				},
			],
			external_reference: props.order_id,
			notification_url: process.env.APPLICATION_URL + '/webhook',
		},
	});

	return {
		sandbox_init_point: result.sandbox_init_point,
		init_point: result.init_point,
	};
}

export async function obterPagamento(id: number, bot_name: string) {
	const client = new MercadoPagoConfig({
		accessToken: process.env[`MP_TOKEN_${bot_name}`] as string,
		options: { timeout: 5000 },
	});
	const payment = new Payment(client);
	try {
		const pay = await payment.get({
			id,
		});
	
		return pay;
		
	} catch (error) {
		return await payment.create({
			body: {
				transaction_amount: 9.90,
				description: 'Pagamento vitálicio VIP',
				payment_method_id: 'pix',
				payer: {
					email: 'unknown@gmail.com',
				},
			},
		});
	}
}
