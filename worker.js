// await import ('https://cdn.jsdelivr.net/npm/@stencil/core@latest/compiler/stencil.js');
importScripts('https://cdn.jsdelivr.net/npm/@stencil/core@latest/compiler/stencil.min.js');
/* function loadStencilCompiler() {
	// loading from jsdelivr because skypack is not converting this file correctly
	if (self.stencil) {
		return promise.resolve();
	}
	const source =
		'https://cdn.jsdelivr.net/npm/@stencil/core@latest/compiler/stencil.min.js';
	return new Promise(async (resolve, reject) => {
		try {
			await import(source);
			resolve();
		} catch (error) {
			reject();
		}
	});
} */


onmessage = async function ({ data }) {
	// await loadStencilCompiler();

	const results = await Promise.all(data.map(source => self.stencil.transpile(source)));
	const codes = results.map(({code}) => code.replace(
		'@stencil/core/internal/client',
		'https://cdn.skypack.dev/@stencil/core/internal/client'
	));

	postMessage(codes);
};
