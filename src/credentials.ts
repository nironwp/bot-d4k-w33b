import 'dotenv/config';
import path from 'path';

const sandbox = process.env.NODE_ENV === 'homog' ? true : false;
const credentials = {
	sandbox,
	client_id: sandbox
		? (process.env.EFI_HOMOG_ID as string)
		: (process.env.EFI_PROD_ID as string),
	client_secret: sandbox
		? (process.env.EFI_HOMOG_SECRET as string)
		: (process.env.EFI_PROD_SECRET as string),
	certificate: 
		path.resolve(`certs/cert-${sandbox ? 'homog' : 'prod'}.p12`),
	validateMtls: false,
};

export default credentials