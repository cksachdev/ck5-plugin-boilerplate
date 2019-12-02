import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import { modelToViewAttributeConverter } from '@ckeditor/ckeditor5-image/src/image/converters';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

class InsertImage extends Plugin {

    
    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const schema = editor.model.schema;
        const conversion = editor.conversion;

        schema.extend( 'image', {
            allowAttributes: [ 'data-mathml','advanced' ]
        } );

        conversion.for( 'downcast' ).add( modelToViewAttributeConverter( 'data-mathml' ) );
        conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: 'img',
                key: 'data-mathml'
            },
            model: 'data-mathml'
        } );
        conversion.for( 'downcast' ).add( modelToViewAttributeConverter( 'advanced' ) );
        conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: 'img',
                key: 'advanced'
            },
            model: 'advanced'
        } );
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
            const selection = editor.model.document.selection;
            editor.model.change( writer => {
                 const imageElement = writer.createElement( 'image', {
                    src: data.detail.imgURL,
                    'data-mathml': data.detail.latexFrmla,
                    advanced : data.detail.advanced
                } );
                editor.model.insertContent( imageElement, selection );
            } );
        })

        this.listenTo( editor.editing.view.document, 'click', ( evt, data ) => {
            if ( data.domEvent.detail == 2 ) {
                editorToPopupdoubleClickHandler( data.domTarget, data.domEvent );
                evt.stop();
            }
        }, { priority: 'highest' } );

        
    }
};

function editorToPopupdoubleClickHandler(element, event) {
    if (element.nodeName.toLowerCase() == 'img') {
        var latexStr = element.getAttribute("data-mathml");
        var advanced = element.getAttribute("advanced");
        if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }
        loadDataFromCkEditortoPopup({latex:latexStr,advanced :advanced});
        // event.stop();
    }
    
};

ClassicEditor
.create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, Italic, Image,InsertImage, ImageToolbar, ImageStyle, ImageResize ],
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
