import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import MathText from './plugin/mathTextPlugin'

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
})
.catch(error => {
    console.error(error.stack);
});

ClassicEditor
.create(document.querySelector('#editor1'), {
    plugins: [Essentials, Paragraph, Bold, Italic, Image, ImageToolbar, ImageStyle, ImageResize,MathText ],
    toolbar: ['bold', 'italic', 'imageUpload','MathText'],
    image: {
        toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles: ['full', 'alignLeft', 'alignRight', 'alignCenter']
    },
})
.then(editor => {
    console.log('Editor was initialized', editor);
})
.catch(error => {
    console.error(error.stack);
});