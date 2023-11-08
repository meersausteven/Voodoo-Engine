
import { AttributeText } from './../../editor/attributes/attribute_text.js';
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeSelect } from './../../editor/attributes/attribute_select.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class TextRenderer extends Renderer {
        type = "Text Renderer";

        /*
         * constructor
         * @param string text: text
         * @param number textSize: text size
         * @param string textFont: font family
         * @param string textColor: text color
         * @param Vector2 offset: offset relative to this gameObject's position
        */
        constructor(text = 'Lorem Ipsum', textSize = 20, textColor = '#ffffff', offset = new Vector2()) {
                super(offset);

                this.attributes['text'] = new AttributeText('Text', text);
                this.attributes['textSize'] = new AttributeNumber('Text Size', textSize, null, new Range());
                this.attributes['textFont'] = new AttributeSelect('Font-Family', 'Arial', this.getFamilies());
                this.attributes['textColor'] = new AttributeColor('Text Color', textColor);
                this.attributes['textAlign'] = new AttributeSelect('Text Alignment', 'start', ['left', 'right', 'center', 'start', 'end']);
                this.attributes['textBaseline'] = new AttributeSelect('Text Baseline', 'alphabetic', ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom']);
                this.attributes['textDirection'] = new AttributeSelect('Text Direction', 'inherit', ['ltr', 'rtl', 'inherit']);
                this.attributes['kerning'] = new AttributeSelect('Kerning', 'auto', ['auto', 'default', 'none']);
                // todo: add once supported in Firefox
                // this.attributes['letterSpacing'] = new AttributeNumber('Letter Spacing', '0', null, new Range());
                // this.attributes['stretch'] = new AttributeSelect('Stretch', 'normal', ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded']);
                this.attributes['metrics'] = null;
        }

        /*
         * renders text to the camera
         * @param Camera camera
         */
        render(camera) {
                this.renderDefault(camera);

                // text variables
                camera.canvasContext.font = `${this.attributes['textSize'].value}px ${this.attributes['textFont'].value}`;
                camera.canvasContext.textAlign = this.attributes['textAlign'].value;
                camera.canvasContext.textBaseline = this.attributes['textBaseline'].value;
                camera.canvasContext.textDirection = this.attributes['textDirection'].value;
                camera.canvasContext.fontKerning = this.attributes['kerning'].value;
                // todo: add once supported in Firefox
                // camera.canvasContext.letterSpacing = `${this.attributes['letterSpacing'].value}px`;
                // camera.canvasContext.fontStretch = this.attributes['stretch'].value;

                // fill text
                camera.canvasContext.fillStyle = this.attributes['textColor'].value;
                camera.canvasContext.fillText(this.attributes['text'].value, 0, 0);
                // calculate text metrics and save them to the attribute
                this.attributes['metrics'] = camera.canvasContext.measureText(this.attributes['text'].value);

                camera.canvasContext.restore();
        }

        // list of font families
        getFamilies() {
                return [
                        'Andale Mono',
                        'Apple Chancery',
                        'Arial',
                        'Arnoldboecklin',
                        'Avanta Garde',
                        'Baskerville',
                        'Big Caslon',
                        'Blippo',
                        'Bodoni MT',
                        'Book Antiqua',
                        'Bookman',
                        'Bradley Hand',
                        'Brush Script MT',
                        'Brush Script Std',
                        'Brushstroke',
                        'Calibri',
                        'Calisto MT',
                        'Cambria',
                        'Candara',
                        'Century Gothic',
                        'Chalkduster',
                        'Comic Sans',
                        'Comic Sans MS',
                        'Consolas',
                        'Copperplate',
                        'Coronet script',
                        'Courier',
                        'Courier New',
                        'Didot',
                        'Florence',
                        'Franklin Gothic Medium',
                        'Futara',
                        'Garamond',
                        'Geneva',
                        'Georgia',
                        'Gill Sans',
                        'Goudy Old Style',
                        'Helvetica',
                        'Hoefler Text',
                        'Impact',
                        'Jazz LET',
                        'Lucida Bright',
                        'Lucida Console',
                        'Lucida Sans',
                        'Lucida Sans Typewriter',
                        'Lucidatypewriter',
                        'Luminari',
                        'Marker Felt',
                        'Monaco',
                        'New Century Schoolbook',
                        'Noto',
                        'Oldtown',
                        'Optima',
                        'Palatino',
                        'papyrus',
                        'Parkavenue',
                        'Perpetua',
                        'Rockwell',
                        'Rockwell Extra Bold',
                        'Segoe UI',
                        'Snell Roundhan',
                        'Stencil Std',
                        'Times New Roman',
                        'Trattatello',
                        'Trebuchet MS',
                        'URW Chancery',
                        'Verdana',
                        'Zapf Chancery'
                ];
        }
}
