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

function compile() {
	// Right now just some basic stuff :)
	
	output.innerHTML = compile_md(input.innerText);
}

compile_button.addEventListener('click', compile);