
import { AttributeText } from './../../editor/attributes/attribute_text.js';
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeSelect } from './../../editor/attributes/attribute_select.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class TextRenderer extends Renderer {
        type = "Text Renderer";
        icon = "fa-font";

        /*
         * constructor
         * @param string text: text
         * @param number textSize: text size
         * @param string textFont: font family
         * @param string textColor: text color
         * @param Vector2 offset: offset relative to this talisman's position
        */
        constructor(text = 'Lorem Ipsum', textSize = 20, textColor = '#ffffff', offset = new Vector2()) {
                super(offset);

                this.text = text;
                this.textSize = textSize;
                this.textFont = 'Arial';
                this.textColor = textColor;
                this.textAlign = 'start';
                this.textBaseline = 'alphabetic';
                this.textDirection = 'inherit';
                this.kerning = 'auto';
                this.letterSpacing = 0;
                this.stretch = 'normal';
                this.metrics = null;

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['text'] = new AttributeText('Text', this.text, this.set.bind(this, 'text'));
                this.editorAttributes['textSize'] = new AttributeNumber('Text Size', this.textSize, this.set.bind(this, 'textSize'));
                this.editorAttributes['textFont'] = new AttributeSelect('Font-Family', this.textFont, this.getFamilies(), this.set.bind(this, 'textFont'));
                this.editorAttributes['textColor'] = new AttributeColor('Text Color', this.textColor, this.set.bind(this, 'textColor'));
                this.editorAttributes['textAlign'] = new AttributeSelect('Text Alignment', this.textAlign, ['left', 'right', 'center', 'start', 'end'], this.set.bind(this, 'textAlign'));
                this.editorAttributes['textBaseline'] = new AttributeSelect('Text Baseline', this.textBaseline, ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'], this.set.bind(this, 'textBaseline'));
                this.editorAttributes['textDirection'] = new AttributeSelect('Text Direction', this.textDirection, ['ltr', 'rtl', 'inherit'], this.set.bind(this, 'textDirection'));
                this.editorAttributes['kerning'] = new AttributeSelect('Kerning', this.kerning, ['auto', 'default', 'none'], this.set.bind(this, 'kerning'));
                this.editorAttributes['letterSpacing'] = new AttributeNumber('Letter Spacing', this.letterSpacing, this.set.bind(this, 'letterSpacing'));
                this.editorAttributes['stretch'] = new AttributeSelect('Stretch', this.stretch, ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'], this.set.bind(this, 'stretch'));
        }

        /*
         * renders text to the ocular
         * @param Ocular ocular
         */
        render(ocular) {
                this.renderDefault(ocular);

                // text variables
                ocular.canvasContext.font = `${this.textSize}px ${this.textFont}`;
                ocular.canvasContext.textAlign = this.textAlign;
                ocular.canvasContext.textBaseline = this.textBaseline;
                ocular.canvasContext.textDirection = this.textDirection;
                ocular.canvasContext.fontKerning = this.kerning;
                ocular.canvasContext.letterSpacing = `${this.letterSpacing}px`;
                ocular.canvasContext.fontStretch = this.stretch;

                // fill text
                ocular.canvasContext.fillStyle = this.textColor;
                ocular.canvasContext.fillText(this.text, 0, 0);
                // calculate text metrics and save them to the attribute
                this.metrics = ocular.canvasContext.measureText(this.text);

                ocular.canvasContext.restore();
        }

        // list of font families
        getFamilies() {
                // todo: add fancy Voodoo fonts
                // + adding own fonts some day
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
