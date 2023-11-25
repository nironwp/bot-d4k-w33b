import sharp from 'sharp';

async function resizeBase64Img(base64: string): Promise<string> {
	// Decodificar a string Base64 e obter o buffer da imagem
	const buffer = Buffer.from(base64, 'base64');

	// Redimensionar a imagem usando sharp
	try {
		const metadata = await sharp(buffer).metadata();

		// Verifique se a imagem tem formato especificado
		if (metadata.format) {
			const width = metadata.width ? metadata.width * 2 : undefined;
			const height = metadata.height ? metadata.height * 2 : undefined;

			// Redimensionar a imagem
			const resizedBuffer = await sharp(buffer)
				.resize(width, height)
				.toBuffer();

			// Converter de volta para Base64
			return resizedBuffer.toString('base64');
		} else {
			throw new Error('Formato de imagem não suportado');
		}
	} catch (error) {
		console.error('Erro ao redimensionar a imagem:', error);
		throw error;
	}
}

export default resizeBase64Img;
