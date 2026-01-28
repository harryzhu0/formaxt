console.log("main.js has connected to the program!");

const input = document.getElementById("editor");
const output = document.getElementById("output-doc");
const compile_button = document.getElementById("compile-button");

// --- TOKEN TYPES ---
const TOKEN_TYPES = {
	BOLD: '**',
	ITALIC: '*',
	UNDERLINE: '__',
	STRIKETHROUGH: '~',
	INLINE_CODE: '`',
	CODE_BLOCK: '```',
	MATH_INLINE: '$',
	MATH_BLOCK: '$$'
};

// --- UTILITIES ---
function escapeHTML(str) {
	return str.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;");
}

// --- PARSER ---
function parse(text) {
	const paragraphs = text.split(/\n{2,}/); // split by 2+ newlines
	return paragraphs.map(parseParagraph);
}

function parseParagraph(text) {
	const root = { type: 'root', children: [] };
	const stack = [root];

	let i = 0;
	while (i < text.length) {
		// --- Code block ```
		if (text.slice(i, i + 3) === TOKEN_TYPES.CODE_BLOCK) {
			const end = text.indexOf('```', i + 3);
			const content = text.slice(i + 3, end === -1 ? text.length : end);
			stack[stack.length - 1].children.push({ type: 'code_block', content });
			i = (end === -1 ? text.length : end + 3);
			continue;
		}

		// --- Inline code `
		if (text[i] === TOKEN_TYPES.INLINE_CODE) {
			const end = text.indexOf('`', i + 1);
			const content = text.slice(i + 1, end === -1 ? text.length : end);
			stack[stack.length - 1].children.push({ type: 'inline_code', content });
			i = (end === -1 ? text.length : end + 1);
			continue;
		}

		// --- Block math $$
		if (text.slice(i, i + 2) === TOKEN_TYPES.MATH_BLOCK) {
			const end = text.indexOf('$$', i + 2);
			const content = text.slice(i + 2, end === -1 ? text.length : end);
			stack[stack.length - 1].children.push({ type: 'math_block', content });
			i = (end === -1 ? text.length : end + 2);
			continue;
		}

		// --- Inline math $
		if (text[i] === TOKEN_TYPES.MATH_INLINE) {
			const end = text.indexOf('$', i + 1);
			const content = text.slice(i + 1, end === -1 ? text.length : end);
			stack[stack.length - 1].children.push({ type: 'math_inline', content });
			i = (end === -1 ? text.length : end + 1);
			continue;
		}

		// --- Headings Markdown (#...) or LaTeX \chapter{}
		if (/^#{1,6} /.test(text.slice(i))) {
			const match = text.slice(i).match(/^(#{1,6}) (.*)/);
			if (match) {
				const level = match[1].length;
				stack[stack.length - 1].children.push({ type: 'heading', level, content: match[2] });
				break; // heading consumes whole line
			}
		}
		if (text.slice(i, i + 9) === '\\chapter{') {
			const end = text.indexOf('}', i + 9);
			const content = text.slice(i + 9, end === -1 ? text.length : end);
			stack[stack.length - 1].children.push({ type: 'chapter', content });
			i = (end === -1 ? text.length : end + 1);
			continue;
		}

		// --- Formatting tokens
		const formattingTokens = [
			{ type: 'bold', token: TOKEN_TYPES.BOLD },
			{ type: 'underline', token: TOKEN_TYPES.UNDERLINE },
			{ type: 'italic', token: TOKEN_TYPES.ITALIC },
			{ type: 'strikethrough', token: TOKEN_TYPES.STRIKETHROUGH },
		];

		let matchedToken = false;

		for (const f of formattingTokens) {
			const tLen = f.token.length;
			if (text.slice(i, i + tLen) === f.token) {
				const top = stack[stack.length - 1];
				if (top.type === f.type) {
					stack.pop(); // close
				} else {
					const node = { type: f.type, children: [] };
					stack[stack.length - 1].children.push(node);
					stack.push(node);
				}
				i += tLen;
				matchedToken = true;
				break;
			}
		}
		if (matchedToken) continue;

		// --- Plain text until next special char
		const specials = ['**','__','*','~','`','```','$$','$','\\chapter{','#'];
		let next = text.length;
		specials.forEach(tok => {
			const idx = text.indexOf(tok, i);
			if (idx !== -1 && idx < next) next = idx;
		});

			const content = text.slice(i, next);
			stack[stack.length - 1].children.push({ type: 'text', content });
			i = next;
	}

	return root;
}

// --- RENDERER ---
function renderNode(node, inMath = false) {
	switch(node.type) {
		case 'root':
			return node.children.map(c => renderNode(c, inMath)).join('');
		case 'text':
			return inMath ? node.content : escapeHTML(node.content);
		case 'bold':
			return inMath
			? `\\textbf{${node.children.map(c => renderNode(c, true)).join('')}}`
			: `<strong>${node.children.map(c => renderNode(c)).join('')}</strong>`;
		case 'italic':
			return inMath
			? `\\textit{${node.children.map(c => renderNode(c, true)).join('')}}`
			: `<em>${node.children.map(c => renderNode(c)).join('')}</em>`;
		case 'underline':
			return inMath
			? `\\underline{${node.children.map(c => renderNode(c, true)).join('')}}`
			: `<u>${node.children.map(c => renderNode(c)).join('')}</u>`;
		case 'strikethrough':
			return inMath
			? `\\sout{${node.children.map(c => renderNode(c, true)).join('')}}`
			: `<s>${node.children.map(c => renderNode(c)).join('')}</s>`;
		case 'inline_code':
			return `<code>${escapeHTML(node.content)}</code>`;
		case 'code_block':
			return `<pre>${escapeHTML(node.content)}</pre>`;
		case 'math_inline':
			return `\\(${node.content}\\)`;
		case 'math_block':
			return `\\[${node.content}\\]`;
		case 'heading':
			return `<h${node.level}>${escapeHTML(node.content)}</h${node.level}>`;
		case 'chapter':
			return `<h1>${escapeHTML(node.content)}</h1>`; // render LaTeX chapter as H1
		default:
			return '';
	}
}

function render() {
	console.log("Rendering...");
	const text = input.innerText;
	const paragraphs = parse(text);
	const html = paragraphs.map(p => `<p>${renderNode(p)}</p>`).join('');
	output.innerHTML = html;
	if (window.MathJax) MathJax.typesetPromise([output]);
	console.log("Rendered!");
}

compile_button.addEventListener('click', render);
