import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

class InsertImage extends Plugin {
    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;

        // Somewhere in your plugin's init() callback:
        view.addObserver( ClickObserver );

        editor.ui.componentFactory.add('insertImage', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: 'Add Equations',
                withText: true,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            this.listenTo(view, 'execute', () => {
                openModel();
            });
            return view;
        });

        window.addEventListener('setDatatoCK', function(data){
            editor.model.change( writer => {
                const imageElement = writer.createElement( 'image', {
                    src: data.detail
                } );
                // Insert the image in the current selection location.
                editor.model.insertContent( imageElement, editor.model.document.selection );
            } );
        })

        this.listenTo( editor.editing.view.document, 'click', ( evt, data ) => {
            // Is double click
            if ( data.domEvent.detail == 2 ) {
                doubleClickHandler( data.domTarget, data.domEvent );
                evt.stop();
            }
        }, { priority: 'highest' } );
    }
};

function doubleClickHandler(element, event) {
    if (element.nodeName.toLowerCase() == 'img') {
        console.log(element);
        console.log(event);
        if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }
        loadDataFromCktoPopup({src: element.src});
        evt.stop();
    }
    
};

ClassicEditor
    .create(document.querySelector('#editor'), {
        plugins: [Essentials, Paragraph, Bold, Italic, Image, InsertImage],
        toolbar: ['bold', 'italic', 'insertImage']
    })
    .then(editor => {
        console.log('Editor was initialized', editor);
        CKEditorInspector.attach(editor);
    })
    .catch(error => {
        console.error(error.stack);
    });