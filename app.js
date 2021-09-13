import {render, html} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Editor from './components/Editor/editor.js';

const App = () => {
	return html`
	   <div id="main">
		   <${Editor}/>
	   </div>
    `;
};

render(html`<${App}/>`, document.querySelector('#container'));
