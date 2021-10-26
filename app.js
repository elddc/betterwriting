import {render, html, useState, useEffect, useRef} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Quill from 'https://cdn.skypack.dev/quill';
import Delta from 'https://cdn.skypack.dev/quill-delta';

import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import {getFirestore, doc, setDoc, getDoc} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import debounce from 'https://cdn.skypack.dev/debounce';

import QuillContext from './context/quillcontext.js';
import Header from './components/header/header.js';
import Toolbar from './components/header/toolbar.js';
import SaveIndicator from './components/header/saveindicator.js';
import WordCount from './components/wordcount.js';

const App = () => {
	const [db, setDb] = useState(); //firestore
	const [quill, setQuill] = useState(); //quill, passed down through context
	const [fontSizes, setFontSizes] = useState([12, 14, 16, 18, 20, 24, 28, 32]);
	const [currentFont, setCurrentFont] = useState('trebuchet-ms');

	const [saveStatus, setSaveStatus] = useState(-1); //-1: not loaded, 0: unsaved changes, 1: saved
	const [wordCount, setWordCount] = useState(0);

	const editorRef = useRef(); //DOM ref
	const toolbarRef = useRef(); //DOM ref
	const containerRef = useRef(); //DOM ref

	const saveDelta = useRef(); //delta of doc at last save
	const debounceSave = useRef(); //debounce save function

	const currentFormat = useRef(); //attributes

	//init
	useEffect(() => {
		//firebase
		initializeApp(
			//firebase config
		);
		setDb(getFirestore());

		//quill
		var Size = Quill.import('attributors/style/size');
		Size.whitelist = fontSizes.map(size => `${size+8}px`);
		Quill.register(Size, true);

		setQuill(new Quill(editorRef.current, {
			theme: 'snow',
			placeholder: 'Start writing...',
			modules: {
				toolbar: toolbarRef.current.base,
				syntax: true,
			},
			scrollingContainer: containerRef.current,
		}));

		//save every 5 mins
		const saveInterval = setInterval(saveToFirebase, 5 * 60000);
		return () => {clearInterval(saveInterval)}; //cleanup
	}, []);

	//set up quill and get doc from db
	useEffect(() => {
		if (saveStatus < 0) { //only activate once
			if (quill) {
				//set handlers
				quill.getModule('toolbar').addHandler('clean', cleanHandler);
				quill.getModule('toolbar').addHandler('font', fontChangeHandler);
				quill.keyboard.addBinding({key: 'S', shortKey: true}, saveHandler);
			}
			//load document from firebase and set up autosave
			if (db && quill) {
				//get doc from firebase
				getDoc(doc(db, 'dev', 'testing')) //doc(db, collection, docname)
				.then((docSnap) => {
					//load data into editor
					setSaveStatus(1);
					if (docSnap.exists()) {
						quill.setContents(new Delta(docSnap.data()), 'api');
						quill.history.clear(); //prevent user from undoing initial load
						saveDelta.current = quill.getContents(); //required for Delta comparisons
					}

					//find word count .5 seconds after last text change
					quill.on('text-change', debounce(countWords, 500));
					countWords();

					//save 3 seconds after last text change
					debounceSave.current = debounce(saveToFirebase, 3000); //store this to clear it
					quill.on('text-change', debounceSave.current);

					//set save status indicator on first text change only in 3 sec interval
					quill.on('text-change', debounce(() => {
						setSaveStatus(0)
					}, 3000, true));
				})
			}
		}
	}, [db, quill]);

	//clear formatting button
	const cleanHandler = () => {
		const selection = quill.getSelection();
		if (selection == null)
			return;
		else if (selection.length === 0) {
			const formats = quill.getFormat();
			Object.keys(formats).forEach(name => {
				if (name !== 'font') {
					quill.format(name, false, 'user');
				}
			});
		}
		else {
			quill.removeFormat(selection, 'user');
			quill.format('font', 'helvetica', 'user');
		}
	}

	const fontChangeHandler = (font) => {
		setCurrentFont(font);
		console.log(font)
	}

	//save on Ctrl+S
	const saveHandler = () => {
		saveToFirebase();
		debounceSave.current.clear();
	}

	//upload document to firestore if differences exist
	const saveToFirebase = () => {
		if (!quill || !db)
			return;

		const docDelta = quill.getContents();
		const diff = saveDelta.current.diff(docDelta);
		if (diff.ops.length === 0) { //no differences
			setSaveStatus(1);
		}
		else {
			saveDelta.current = docDelta;
			setDoc(doc(db, 'dev', 'testing'), {ops: docDelta.ops})
			.then(() => {
				setSaveStatus(1)
			});
		}
	}

	const countWords = () => {
		const words = quill.getText().match(/[^\s]+/g);
		setWordCount(words ? words.length : 0);
	}

	return html`
		<div id="main">
			<${QuillContext.Provider} value=${{quill, setQuill}}>
				<${Header}>
					 <${SaveIndicator} status=${saveStatus} /> 
					<${Toolbar} ref=${toolbarRef} fontSizes=${fontSizes} />
				<//>
				<div class="editor-container" ref=${containerRef}>
					<div id="editor" class=${currentFont} ref=${editorRef}></div>
				</div>
			<//>
			<${WordCount} count=${wordCount} />
		</div>
	`;
};

render(html`
	<${App} />`, document.querySelector('#container'));
