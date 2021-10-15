import {html} from 'https://unpkg.com/htm/preact/standalone.module.js';

const Icon = ({name, style, size}) => {
	return html`
		<span class="material-icons icon" 
		      style="${size ? `font-size: ${size};` : ''} ${style}"
		>
			${name}
		</span>
    `;
};

export default Icon;
