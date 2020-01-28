import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';

//Reference: https://github.com/ckeditor/ckeditor5/issues/2077
export default class DoubleClickObserver extends DomEventObserver {
    constructor(view) {
        super(view);
        this.domEventType = 'dblclick';
    }
    onDomEvent(domEvent) {
        this.fire(domEvent.type, domEvent);
    }
}