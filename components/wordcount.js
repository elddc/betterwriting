import {html} from 'https://unpkg.com/htm/preact/standalone.module.js';

const WordCount = ({count}) => {
	return html`
		<div class="word-count">${count} ${count === 1 ? 'word' : 'words'}</div>
    `;
};

export default WordCount;
