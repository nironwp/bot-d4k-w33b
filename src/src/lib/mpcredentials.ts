import 'dotenv/config';

const sandbox = process.env.NODE_ENV === 'homog' ? true : false;

const mpcredentials = {
	sandbox,
	token:process.env.ACESS_TOKEN_PROD as string,
};

export default mpcredentials