export function gerarIdNumerico(): number {

	// Retorna um inteiro aleatório dentro do intervalo seguro de inteiros de 32 bits
	return Math.floor(Math.random() * 2 ** 31);
	
}
