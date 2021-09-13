import {html} from 'https://unpkg.com/htm/preact/standalone.module.js';

//note that toolbar can contain non-quill elements
const Toolbar = () => {
	return html`
		<div id="toolbar">
			<span class="ql-formats">
		      <select class="ql-font tooltipped" title="font family">
			      <!--Insert font options-->
			      <option value="helvetica" selected>Helvetica</option>
			      <option value="trebuchet-ms">Trebuchet MS</option>
			      <option value="times-new-roman">Times New Roman</option>
			      <option value="georgia">Georgia</option>
			      <option value="consolas">Consolas</option>
		      </select>
		      <!--<select class="ql-size"></select>-->
		    </span>
			<span class="ql-formats">
		      <button class="ql-bold tooltipped" title="bold"></button>
		      <button class="ql-italic tooltipped" title="italic"></button>
		      <button class="ql-underline tooltipped" title="underline"></button>
		      <button class="ql-strike tooltipped" title="strikethrough"></button>
		    </span>
			<span class="ql-formats">
		      <select class="ql-color tooltipped" title="font color"></select>
		      <select class="ql-background tooltipped" title="highlight"></select>
		    </span>
			<span class="ql-formats">
		      <select class="ql-align tooltipped" title="text align"></select>
		      <button class="ql-list tooltipped" value="ordered" title="numbered list"></button>
		      <button class="ql-list tooltipped" value="bullet" title="bullet point list"></button>
		      <button class="ql-indent tooltipped" value="-1" title="increase indent"></button>
		      <button class="ql-indent tooltipped" value="+1" title="decrease indent"></button>
		    </span>
			<span class="ql-formats">
		      <button class="ql-script tooltipped" value="sub" title="subscript"></button>
		      <button class="ql-script tooltipped" value="super" title="superscript"></button>
		    </span>
			<span class="ql-formats">
		      <!--<button class="ql-header" value="1"></button>
		      <button class="ql-header" value="2"></button>-->
		      <button class="ql-blockquote tooltipped" title="blockquote"></button>
		      <button class="ql-code-block tooltipped" title="insert code block"></button>
		    </span>
			<span class="ql-formats">
		      <button class="ql-link tooltipped" title="insert link"></button>
		      <button class="ql-image tooltipped" title="insert image"></button>
		      <button class="ql-video tooltipped" title="insert video"></button>
		      <button class="ql-formula tooltipped" title="insert formula"></button>
		    </span>
			<span class="ql-formats">
		      <button class="ql-clean tooltipped" title="remove formatting"></button>
		    </span>
		</div>
    `;
};

export default Toolbar;
