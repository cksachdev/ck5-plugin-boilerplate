import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import { modelToViewAttributeConverter } from '@ckeditor/ckeditor5-image/src/image/converters';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

class MathText extends Plugin {
    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const componentFactory  = editor.ui.componentFactory;

        this._defineSchema();
        this._defineConverters();
        view.addObserver( ClickObserver );

        componentFactory.add('MathText', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: 'Add Equations',
                withText: true,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            this.listenTo(view, 'execute', () => {
                this._defineEquationWriter();
            });
            return view;
        });

        this.listenTo( editor.editing.view.document, 'click', ( evt, data ) => {
            if ( data.domEvent.detail == 2 ) {
                this._editorToPopupdoubleClickHandler( data.domTarget, data.domEvent );
                evt.stop();
            }
        }, { priority: 'highest' } );

        
    }

    _defineSchema () {
        const schema = this.editor.model.schema;
        schema.extend( 'image', {
            allowAttributes: [ 'data-mathml','advanced' ]
        } );
    }
    _defineConverters() {
        const conversion = this.editor.conversion;
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
    }
    _defineEquationWriter (dataObj = '') {
        const model = this.editor.model;
        const selection = model.document.selection;
        const options =  {};
        options.detail = dataObj;
        const openerMethod = 'modal';
        const originalOnInit = options.onInit;
        options.onInit = finder => {
            if ( originalOnInit ) {
				originalOnInit(finder);
			}
            finder.addEventListener("equation:add", function(data){
                console.log("file:choose -> " + JSON.stringify(data.target));
                model.change( writer => {
                    const imageElement = writer.createElement( 'image', {
                        src: data.target.imgURL,
                        'data-mathml': data.target.latexFrmla,
                        advanced : data.target.advanced
                    } );
                    model.insertContent( imageElement, selection );               
                } );
            });
        }
        window.org.ckditor.mathTextPlugin[openerMethod](options);
    }

    _editorToPopupdoubleClickHandler(element, event) {
        if (element.nodeName.toLowerCase() == 'img') {
            var latexStr = element.getAttribute("data-mathml");
            var advanced = element.getAttribute("advanced");
            if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
                event.stopPropagation();
            } else {
                event.returnValue = false;
            }
            this._defineEquationWriter({latex:latexStr,advanced :advanced});
            // event.stop();
        }
        
    };
};



ClassicEditor
.create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, Italic, Image, ImageToolbar, ImageStyle, ImageResize,MathText ],
    toolbar: ['bold', 'italic', 'imageUpload','MathText'],
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
