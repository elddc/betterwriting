import {html, useState, useRef, useEffect, useContext} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Icon from './icon.js';
import QuillContext from "../context/quillcontext.js";

const Toolbar = () => {
	const {quill} = useContext(QuillContext);

	const [expanded, setExpanded] = useState(false);
	const [showExpand, setShowExpand] = useState(true);

	const toolbarRef = useRef();
	const containerRef = useRef();

	//update toolbar on resize, expand, collapse
	useEffect(() => {
		if (quill) {
			window.addEventListener('resize', updateToolbar);
			updateToolbar();
			return () => window.removeEventListener('resize', updateToolbar); //cleanup
		}
	}, [quill, expanded]);

	//updates button groups based on position and collapse needs
	const updateToolbar = () => {
		const groups = toolbarRef.current.children;
		const xPos = groups[0].getBoundingClientRect().x; //x pos of leftmost elements
		const yPos = groups[0].getBoundingClientRect().y; //y pos of elements on first line

		let collapseRest = false;
		for (const group of groups) {
			//collapse/expand
			if (collapseRest)
				group.classList.add('collapsed');
			else
				group.classList.remove('collapsed'); //required to determine pos

			if (!expanded && group.getBoundingClientRect().y !== yPos) {
				group.classList.add('collapsed');
				collapseRest = true;
			}

			//hide divider on leftmost children
			if (group.getBoundingClientRect().x === xPos)
				group.classList.add('leftmost');
			else
				group.classList.remove('leftmost');
		}

		//remove expand button if not needed
		setShowExpand(groups[groups.length - 1].getBoundingClientRect().y !== yPos);
	}

	const undo = () => {
		quill.history.undo();
	}

	const redo = () => {
		quill.history.redo();
	}

	return html`
		<div class="toolbar-container" ref=${containerRef}>
		    <div id="toolbar" ref=${toolbarRef}>
			    <span class="ql-formats">
			      <button class="tooltipped" title="undo" onclick=${undo}>
				      <${Icon} name="undo" size="18px"/>
			      </button>
				     <button class="tooltipped" title="redo" onclick=${redo}>
				      <${Icon} name="redo" size="18px"/>
			      </button>
			    </span>
    			<span class="ql-formats">
    				<select class="ql-font tooltipped" title="font family">
    					<!--Insert font options-->
    					<option value="helvetica" selected>Helvetica</option>
    					<option value="trebuchet-ms">Trebuchet MS</option>
    					<option value="times-new-roman">Times New Roman</option>
    					<option value="georgia">Georgia</option>
    					<option value="consolas">Consolas</option>
    				</select>
    				<select class="ql-size">
					    <option value="14px">14px</option>
					    <option value="16px">16px</option>
					    <option value="18px">18px</option>
				    </select>
				    <!-- todo -->
				    <button class="tooltipped" title="line height">
					    <${Icon} name="format_line_spacing" />
				    </button>
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
    		        <button class="ql-list tooltipped" value="ordered" title="numbered list"></button>
    		        <button class="ql-list tooltipped" value="bullet" title="bulleted list"></button>
    		        <button class="ql-list tooltipped" value="check" title="checklist"></button>
    		    </span>
    			<span class="ql-formats">
    		         <select class="ql-align tooltipped" title="text align"></select>
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
			
			<button class="expand-button ${!showExpand && 'hidden'}" onclick=${() => setExpanded(!expanded)}>
				<${Icon} name=${expanded ? 'expand_less' : 'expand_more'} />
			</button>
		</div>
    `;
};

export default Toolbar;
