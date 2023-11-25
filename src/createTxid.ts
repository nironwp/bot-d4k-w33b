import { v4 as uuidv4 } from 'uuid';

function createTxid() {
	// Gera um UUID e remove os hífens
	const rawUuid = uuidv4().replace(/-/g, '');

	// Limita o UUID a 32 caracteres para cumprir a especificação do txid
	const txid = rawUuid.substring(0, 32);

	return txid;
}

export default createTxid;
