import {render, html, useState, useEffect, useRef} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Quill from 'https://cdn.skypack.dev/quill';
import Delta from 'https://cdn.skypack.dev/quill-delta';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import {getFirestore, doc, setDoc, getDoc} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import debounce from 'https://cdn.skypack.dev/debounce';
import QuillContext from './context/quillcontext.js';
import Toolbar from './components/toolbar.js';
import SaveIndicator from './components/saveindicator.js';

const App = () => {
	const [db, setDb] = useState(); //firestore
	const [quill, setQuill] = useState(); //quill, passed down through context
	const [saveStatus, setSaveStatus] = useState(-1); //-1: not loaded, 0: unsaved changes, 1: saved

	const editorRef = useRef(); //DOM ref
	const toolbarRef = useRef(); //DOM ref
	const saveDelta = useRef(); //delta of doc at last save
	const debounceSave = useRef(); //debounce save function

	//init
	useEffect(() => {
		//firebase
		initializeApp(
			//firebase config
		);
		setDb(getFirestore());

		//quill
		let Font = Quill.import('formats/font');
		Font.whitelist = ['helvetica', 'trebuchet-ms', 'times-new-roman', 'georgia', 'consolas']; //fonts to allow
		Quill.register(Font, true);

		setQuill(new Quill(editorRef.current, {
			theme: 'snow',
			placeholder: 'Start writing...',
			modules: {
				toolbar: toolbarRef.current.base
			}
		}));

		//save every 5 mins
		const saveInterval = setInterval(saveToFirebase, 5*60000);
		return () => clearInterval(saveInterval); //cleanup
	}, []);

	//set up quill and get doc from db
	useEffect(() => {
		if (saveStatus < 0) { //only activate once
			if (quill) {
				//set handlers
				quill.getModule('toolbar').addHandler('clean', cleanHandler);
				quill.keyboard.addBinding({key: 'S', shortKey: true}, saveHandler)
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

					//save 3 seconds after last text change
					debounceSave.current = debounce(saveToFirebase, 3000); //store this to clear it
					quill.on('text-change', debounceSave.current);

					//set save status indicator on first text change only in 3 sec interval
					quill.on('text-change', debounce(() => {setSaveStatus(0)}, 3000, true))
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
			.then(() => {setSaveStatus(1)});
		}
	}

	return html`
	   <div id="main">
		   <${QuillContext.Provider} value=${{quill, setQuill}}>
			   <${SaveIndicator} status=${saveStatus} />
			   <${Toolbar} ref=${toolbarRef} />
			   <div id="editor" ref=${editorRef}></div>
		   <//>
	   </div>
    `;
};

render(html`<${App}/>`, document.querySelector('#container'));
