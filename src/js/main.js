console.log("Main.js has linked to the program!")

const input = document.getElementById("editor");
const output = document.getElementById("output-doc");
const compile_button = document.getElementById("compile-button");

console.log("Input: ", input)
console.log("Output: ", output)
console.log("Compile Button: ", compile_button)

function compile_md(html) {
	// Title
	html = html.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
	html = html.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
	html = html.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
	html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
	html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
	html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

	// Bold
	html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Italic
	html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

	// Inline code
	html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

	// Paragraphs
	html = html.replace(/\n{2,}/g, "</p><p>");
	html = "<p>" + html + "</p>";
	
	return html;

}

function compile_latex(text) {
	// Block LaTeX first: $$...$$
	text = text.replace(/\$\$(.+?)\$\$/gs, (match, p1) => {
		return `\\[${p1}\\]`;
	});

	// Inline LaTeX: $...$
	text = text.replace(/\$(.+?)\$/g, (match, p1) => {
		return `\\(${p1}\\)`;
	});

	return text;
}



function render() {
	let text = input.innerText; // editor content

	let html = '';

	if (document.getElementById('md').checked) {
		html = compile_md(text); // enhanced Markdown parser
	}

	if (document.getElementById('latex').checked) {
		html = compile_latex(html); // detect & render LaTeX
	}

	if (document.getElementById('html').checked) {
		html += '<pre>' + escapeHTML(text) + '</pre>'; // raw HTML view
	}

	output.innerHTML = html;

	// Re-render LaTeX if using MathJax:
	if (window.MathJax) {
		MathJax.typesetPromise([output]);
	}
}


compile_button.addEventListener('click', render);
