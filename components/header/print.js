import {html, useContext} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Icon from '../icon.js';
import pdf from '../../lib/pdf.js';
import QuillContext from "../../context/quillcontext.js";

const PrintButton = ({size}) => {
	const {quill} = useContext(QuillContext);

	const printDocument = () => {
		console.log('printing...');
		const text = quill.getText();
		pdf(text);
	}

	return html`
	  <button class="tooltipped" title="print" onclick=${printDocument}>
	       <${Icon} name='print' size=${size} />
	  </button>
    `;
};

export default PrintButton;
