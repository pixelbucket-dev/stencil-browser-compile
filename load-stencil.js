const myWorker = new Worker('worker.js'/* , { type: 'module' } */);

// auto inject the h import, to reduce boilerplate required in source
const h = "import { h } from 'https://cdn.skypack.dev/@stencil/core';\n";

function addHToSources(sources) {
	return sources.map(source => h + source);
}
export async function compileStencil(sources) {
	if (!sources || !sources.length) {
		throw new Error('no source code provided to compile');
	}


	myWorker.postMessage(addHToSources(sources));

	try {
		return await new Promise((resolve) => {
			myWorker.onmessage = function ({ data }) {
				resolve(data);
			};
		});
	} catch (error) { }
}

export async function runStencil(sources, doc = document) {
	if (!sources || !sources.length) {
		throw new Error('no source code provided to compile');
	}

	// async load the stencil compiler and get the transpile function
	const codes = await compileStencil(sources);
	// make a script tag of type module and set script tag's content to the transpiled code

	codes.forEach(code => {
		const s = doc.createElement('script');
		s.type = 'module';
		s.innerHTML = code;

		// append script tag to execute transpiled code
		doc.body.appendChild(s);
	})

}

export async function parseFromHTML(selector, doc = document) {
	let list = [];

	if (typeof selector === 'string') {
		list = Array.from(doc.querySelectorAll(selector));
	} else if (selector.innerHTML) {
		list = [selector];
	} else if (list.forEach) {
		list = selector;
	}

	runStencil(list.map((el) => el.textContent.trim()), doc);
}
