import { modelToViewAttributeConverter } from '@ckeditor/ckeditor5-image/src/image/converters';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import DoubleClickObserver from '../plugin/doubleClickObserver';
import './popupui/js/mathmodal'

var imageIcon = `<?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 190 190" style="enable-background:new 0 0 190 190;" xml:space="preserve"> <path d="M3.53,0h182.94v44.78h-32.439V32.439H73.017L125.42,95l-52.403,62.561h81.015V145.22h32.439V190H3.53l79.574-95L3.53,0z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>`;

export default class MathText extends Plugin {

    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const componentFactory = editor.ui.componentFactory;
        this._defineSchema();
        this._defineConverters();
        view.addObserver(ClickObserver);
        view.addObserver(DoubleClickObserver);

        componentFactory.add('MathText', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: 'Add Equations',
                icon: imageIcon,
                withText: false,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            this.listenTo(view, 'execute', () => {
                this._defineEquationWriter();
            });
            return view;
        });

        this.listenTo(editor.editing.view.document, 'dblclick', (evt, data) => {
            let ifrm = document.getElementById('mathModalIframe')
            if (data.domTarget.nodeName.toLowerCase() == 'img' && data.domTarget.hasAttribute("data-mathtext") && !ifrm) {
                this._editorToPopupdoubleClickHandler(data.domTarget, data.domEvent);
            }
            evt.stop();
        }, { priority: 'highest' });
    }

    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.extend('image', {
            allowAttributes: ['data-mathtext', 'advanced']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for('downcast').add(modelToViewAttributeConverter('data-mathtext'));
        conversion.for('upcast').attributeToAttribute({
            view: {
                name: 'img',
                key: 'data-mathtext'
            },
            model: 'data-mathtext'
        });
        conversion.for('downcast').add(modelToViewAttributeConverter('advanced'));
        conversion.for('upcast').attributeToAttribute({
            view: {
                name: 'img',
                key: 'advanced'
            },
            model: 'advanced'
        });
    }

    _defineEquationWriter(dataObj = '') {
        const model = this.editor.model;
        const selection = model.document.selection;
        const options = {};
        options.detail = dataObj;
        const openerMethod = 'modal';
        const originalOnInit = options.onInit;
        options.onInit = data => {
            if (originalOnInit) {
                originalOnInit(data);
            }
            model.change(writer => {
                const imageElement = writer.createElement('image', {
                    src: data.imgURL,
                    'data-mathtext': encodeURIComponent(data.latexFrmla),
                    advanced: data.advanced
                });
                model.insertContent(imageElement, selection);
            });
        }
        window.mathModal.ckeditor.mathtext[openerMethod](options);
    }

    _editorToPopupdoubleClickHandler(element, event) {
        var latexStr = decodeURIComponent(element.getAttribute("data-mathtext"));
        var advanced = element.getAttribute("advanced");
        if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }
        this._defineEquationWriter({ latex: latexStr, advanced: advanced });
    };

};