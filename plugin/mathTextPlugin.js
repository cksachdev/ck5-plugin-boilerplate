import { modelToViewAttributeConverter } from '@ckeditor/ckeditor5-image/src/image/converters';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/sigma-svgrepo-com.svg';
//import imageIcon from '../plugin/sigma-svgrepo-com.svg';
var iframeObj;
export default class MathText extends Plugin {

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
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            this.listenTo(view, 'execute', () => {
                this._loadIframeModal('btnClick');
            });
            return view;
        });

        this.listenTo( editor.editing.view.document, 'click', ( evt, data ) => {
            if ( data.domEvent.detail == 3 ) {
                if (data.domTarget.nodeName.toLowerCase() == 'img' && data.domTarget.hasAttribute("data-mathtext")) {
                    this._loadIframeModal('dbClick', data);
                }
                evt.stop();
            }
        }, { priority: 'highest' } );
    }

    _loadIframeModal(type, data="") {
        const that = this;
        var iframe = document.createElement('iframe');
        iframe.id = 'mathModalIframe';
        iframe.style="border: none;min-height: 520px; width:500px; position: fixed;top: 25%;left: 33%;";
        iframe.src = 'mathModal/index.html';
        document.body.appendChild(iframe);
        console.log('iframe.contentWindow =', iframe.contentWindow);
        iframe.onload = function() {  
            iframeObj = this;
            if(type === 'btnClick') {
                that._defineEquationWriter();
            } else if(type === 'dbClick') {
                that._editorToPopupdoubleClickHandler(data.domTarget, data.domEvent );
            }
        };
    }

    _removeIframeModal() {
        iframeObj.remove();
    }

    _defineSchema () {
        const schema = this.editor.model.schema;
        schema.extend( 'image', {
            allowAttributes: [ 'data-mathtext','advanced' ]
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for( 'downcast' ).add( modelToViewAttributeConverter( 'data-mathtext' ) );
        conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: 'img',
                key: 'data-mathtext'
            },
            model: 'data-mathtext'
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
        options.onInit = data => {
            if (originalOnInit) {
				originalOnInit(data);
			}
            model.change( writer => {
                const imageElement = writer.createElement( 'image', {
                    src: data.imgURL,
                    'data-mathtext': data.latexFrmla,
                    advanced : data.advanced
                });
                this._removeIframeModal();
                model.insertContent( imageElement, selection );                          
            } );
        }
        iframeObj.contentWindow.mathModal.ckeditor.mathtext[openerMethod](options);
    }

    _editorToPopupdoubleClickHandler(element, event) {
        var latexStr = element.getAttribute("data-mathtext");
        var advanced = element.getAttribute("advanced");
        if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }
        this._defineEquationWriter({latex:latexStr,advanced :advanced});
    };

};
