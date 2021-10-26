import {html} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Icon from '../icon.js';

const SaveIndicator = ({status}) => {
	return html`
	   <div class="save-indicator icon-with-label">
		   <${Icon} name=${status === 1 ? 'cloud_done' : 'sync'} size="18px;" style="margin-right: 6px;" />
	       ${status === 1 ? 'saved' : 'saving...'}
	   </div>
    `;
};

export default SaveIndicator;
