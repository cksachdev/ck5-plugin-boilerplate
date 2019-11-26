import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

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

        editor.model.schema.register('mathtex', {
            allowWhere: '$text',
            isObject: true,
            allowContentOf: '$block',
            allowAttributes: ['data-mthml']
        });
      
        editor.conversion.elementToElement({
            model: 'mathtex',
            view: {
              name: 'span',
              classes: 'math-tex',
              attribute: {
                'data-mthml': true
               }
            }
        });

        window.addEventListener('setDatatoCK', function(data){
            const selection = editor.model.document.selection;
            // const viewEditableRoot = editor.editing.view.document.getRoot();
            editor.model.change( writer => {
                // writer.setAttribute( 'data-mthml', data.detail.latexFrmla, viewEditableRoot);
                const imageElement = writer.createElement( 'image', {
                    src: data.detail.imgURL,
                } );
                const el = writer.createElement('mathtex', {
                    'data-mthml': data.detail.latexFrmla
                });
                writer.append( imageElement, el);
                // // Insert the image in the current selection location.
                editor.model.insertContent( el, selection );
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
        plugins: [Essentials, Paragraph, Bold, Italic, InsertImage, Image, ImageToolbar, ImageStyle, ImageResize ],
        toolbar: ['bold', 'italic', 'insertImage', 'imageUpload'],
        image: {
            toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
            styles: ['full', 'alignLeft', 'alignRight', 'alignCenter']
        },
    })
    .then(editor => {
        console.log('Editor was initialized', editor);
        CKEditorInspector.attach(editor);
    })
    .catch(error => {
        console.error(error.stack);
    });