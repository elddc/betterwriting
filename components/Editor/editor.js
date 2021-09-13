import {html, useState, useEffect, useRef} from 'https://unpkg.com/htm/preact/standalone.module.js';
import Quill from 'https://cdn.skypack.dev/quill';
import Delta from 'https://cdn.skypack.dev/quill-delta';
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import {getFirestore, doc, setDoc, getDoc} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import debounce from 'https://cdn.skypack.dev/debounce';
import Toolbar from "./toolbar.js";

const Editor = () => {
	const [db, setDb] = useState();
	const [quill, setQuill] = useState();

	const editor = useRef();
	const toolbar = useRef();

	//init
	useEffect(() => {
		//firebase
		initializeApp(
			//insert firebase config
		);
		setDb(getFirestore());

		//quill
		let Font = Quill.import('formats/font');
		Font.whitelist = ['helvetica', 'trebuchet-ms', 'times-new-roman', 'georgia', 'consolas']; //fonts to allow
		Quill.register(Font, true);
		setQuill(new Quill(editor.current, {
			theme: 'snow',
			placeholder: 'Start writing...',
			modules: {
				toolbar: toolbar.current.base
			}
		}));
	}, []);

	//load document from firebase and set up autosave
	useEffect(() => {
	    if (db && quill){
		    //doc(db, collection, docname)
		    getDoc(doc(db, 'dev', 'testing'))
		    .then((docSnap) => {
			    if (docSnap.exists()) {
				    quill.setContents(new Delta(docSnap.data()));
			    }
			    //save 3000 ms after last edit
			    quill.on('text-change', debounce(saveToFirebase, 3000));
		    })
	    }
	}, [db, quill]);

	//upload document to firestore
	const saveToFirebase = () => {
		setDoc(doc(db, 'dev', 'testing'), {ops: quill.getContents().ops});
	}

	return html`
		<${Toolbar} ref=${toolbar}/>
		<div id="editor" ref=${editor}></div>
    `;
};

export default Editor;
