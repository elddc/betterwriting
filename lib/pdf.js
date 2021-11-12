import jspdf from 'https://cdn.skypack.dev/jspdf';

export default function pdf(text) {
	//set up PDF formatting
	const doc = new jspdf({
		unit: 'pt',
		format: 'letter',
	});
	doc.setFont('times'); //times new roman
	doc.setFontSize(12); //12pt font
	doc.setLineHeightFactor(2.38); //double spaced: 28pt

	//split text into lines, indenting first line of each paragraph
	let lines = doc.splitTextToSize(text, 468, {textIndent: 36}); //6.5in width, .5in indent
	console.log(lines.length)
	console.log(text)

	//replace tab character with 12 spaces to create .5in indent
	//could also replace in the original text string
	let indentedLines = lines.map(line => line.replace('\t', '            '));

	//group lines into pages
	const linesPerPage = 22; //22 lines per page, according to Google Docs
	let pages = [];
	while (indentedLines.length > 0)
		pages.push(indentedLines.splice(0, linesPerPage))

	//insert text into PDF
	const firstPage = pages.shift();
	doc.text(firstPage, 72, 83)
	for (let page of pages) { //additional pages
		doc.addPage('letter');
		doc.text(page, 72, 83);
	}

	//doc.autoPrint(); //print
	doc.save("text.pdf"); //save
	//doc.output('dataurlnewwindow'); //open in new window
}
