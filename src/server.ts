import express, { Request, Response } from 'express';
import { obterPagamento } from './src/lib/mercadopago';
import { PrismaClient } from '@prisma/client';
// import { obterPagamento } from './src/lib/mercadopago';
const app = express();
app.use(express.static('public'));
import 'dotenv/config';
import { bots } from './bots';
const prisma = new PrismaClient()
app.get('/', (req, res) => res.type('html').send(html));
app.post('/webhook', async (req: Request, res: Response) => {
	try {
		console.log('Evento Recebido:', req.query);
		const dataId = req.query['data.id'];
		if (dataId && req.query.type === 'payment') {
			console.log('Obtendo pagamento referente a order')

			for (const bot of bots) {
				try {
					const pagamento = await obterPagamento(Number(dataId), bot.bot_name);
					console.log('Status do pagamento', pagamento.status)
					if (pagamento.status === 'approved') {
						console.log('Pagamento referente a transação'+pagamento.external_reference+' efetuado')
						await prisma.order.updateMany({
							data: {
								status: 'COMPLETE',
							},
							where: {
								txId: Number(pagamento.external_reference),
							},
						});
					}
				} catch (error) {
					console.log('Webhook de pagamento não processado para ', dataId)
				}
			}
		} else {
			console.error('data.id não foi fornecido na query string');
		}
        
	} catch (error) {
		console.log(error)
		console.log('Erro ao receber webhook')  
	}
	// Aqui você pode processar o evento
    
	// Exemplo de processamento:
	// const eventType = req.body.type;
	// const eventData = req.body.data;
    
	// Aqui você pode adicionar a lógica de processamento com base no tipo de evento ou outros dados.
	// const pagamento  = await obterPagamento(Number(eventData.id))
	// switch (eventType) {
	// case 'payment':
	// 	if(pagamento.status === 'approved') {
	// 		await prisma.order.updateMany({
	// 			data: {
	// 				status: 'COMPLETE'
	// 			},
	// 			where: {
	// 				txId: Number(pagamento.external_reference)
	// 			}
	// 		})
	// 	} 
	// 	console.log('Processando pagamento:', eventData);
	// 	break;
                    
	// default:
	// 	console.log('Tipo de evento não reconhecido.');
	// }
                    
	// Responda ao webhook com sucesso
	res.status(200).send('Evento recebido com sucesso');
});
const html = `
<!DOCTYPE html>
<html>
<head>
<title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          disableForReducedMotion: true
        });
    }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
          font-family: "neo-sans";
          src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
          font-style: normal;
          font-weight: 700;
        }
        html {
            font-family: neo-sans;
            font-weight: 700;
            font-size: calc(62rem / 16);
        }
        body {
            background: white;
        }
        section {
            border-radius: 1em;
            padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
    }
    </style>
    </head>
    <body>
    <section>
    Hello from Render!
    </section>
    </body>
    </html>
    `;
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));