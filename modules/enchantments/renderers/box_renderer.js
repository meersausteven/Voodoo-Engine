
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeColor } from './../../editor/attributes/attribute_color.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class BoxRenderer extends Renderer {
        type = "Box Renderer";
        icon = "fa-regular fa-square";

        /* 
         * constructor
         * @param number width: width of the box
         * @param number height: height of the box
         * @param string fillColor: fill color
         * @param number borderWidth: width of border
         * @param string borderColor: color of border
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(width = 50, height = 50, fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', offset = new Vector2()) {
                super(offset);

                this.width = width;
                this.height = height;
                this.fillColor = fillColor;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['width'] = new AttributeNumber('Width', this.width, this.set.bind(this, 'width'));
                this.editorAttributes['height'] = new AttributeNumber('Height', this.height, this.set.bind(this, 'height'));
                this.editorAttributes['fillColor'] = new AttributeColor('Fill Color', this.fillColor, this.set.bind(this, 'fillColor'));
                this.editorAttributes['borderWidth'] = new AttributeNumber('Border Width', this.borderWidth, this.set.bind(this, 'borderWidth'));
                this.editorAttributes['borderColor'] = new AttributeColor('Border Color', this.borderColor, this.set.bind(this, 'borderColor'));
        }

        /*
         * renders a box to a ocular
         * @param Ocular ocular
         */
        render(ocular) {
                this.renderDefault(ocular);

                // border
                if (this.borderWidth > 0) {
                        ocular.canvasContext.lineWidth = this.borderWidth;
                        ocular.canvasContext.strokeStyle = this.borderColor;
                        ocular.canvasContext.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
                }

                // fill
                ocular.canvasContext.fillStyle = this.fillColor;
                ocular.canvasContext.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

                ocular.canvasContext.restore();
        }
}