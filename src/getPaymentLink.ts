import Gerencianet from 'gn-api-sdk-typescript';
import credentials from './credentials';
import createTxid from './createTxid';

interface Props {
  exp_sgs: number;
  devedor: {
    nome: string;
  };
  valor: string;
  chave_pix: string;
}

interface Return {
  tx_id: string;
  url: string;
  pixCopiaECola: string;
  qrcode: string
}

const gerencianet = new Gerencianet(credentials);
export default async function getPaymentLink(props: Props): Promise<Return> {
	const body = {
		calendario: {
			expiracao: props.exp_sgs,
		},
		devedor: {
			cpf: '94271564656',
			nome: props.devedor.nome,
		},
		valor: {
			original: props.valor,
		},
		chave: props.chave_pix,
	};

	const params = {
		txid: createTxid(),
	};

	const cob = await gerencianet.pixCreateCharge(params, body);

	const params_loc = {
		id: cob.loc.id,
	};

	const detail_location = await gerencianet.pixGenerateQRCode(params_loc);
	return {
		tx_id: params.txid,
		url: detail_location.linkVisualizacao,
		pixCopiaECola: detail_location.qrcode,
		qrcode: detail_location.imagemQrcode,
	};
}
