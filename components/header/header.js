import {html} from 'https://unpkg.com/htm/preact/standalone.module.js';

//children = [SaveIndicator, Toolbar]
const Header = ({children}) => {
	return html`
		<div class="header no-print">
			<div class="doc-info">
			    <h1 class="doc-name" contenteditable=true>Untitled Document</h1>
			</div>
	        ${children}
		</div>
    `;
};

export default Header;
