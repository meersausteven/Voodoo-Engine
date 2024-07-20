
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class CircleRenderer extends Renderer {
        type = "Circle Renderer";
        icon = "fa-regular fa-circle";

        /*
         * constructor
         * @param string fillColor: fill color
         * @param number borderWidth: width of border
         * @param string borderColor: color of border
         * @param number radius: radius of the circle
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', radius = 25, offset = new Vector2()) {
                super(offset);

                this.radius = radius;
                this.fillColor = fillColor;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['radius'] = new AttributeNumber('Radius', this.radius, this.set.bind(this, 'radius'));
                this.editorAttributes['fillColor'] = new AttributeColor('Fill Color', this.fillColor, this.set.bind(this, 'fillColor'));
                this.editorAttributes['borderWidth'] = new AttributeNumber('Border Width', this.borderWidth, this.set.bind(this, 'borderWidth'));
                this.editorAttributes['borderColor'] = new AttributeColor('Border Color', this.borderColor, this.set.bind(this, 'borderColor'));
        }

        /*
         * renders a circle to a ocular
         * @param Ocular ocular
         */
        render(ocular) {
                this.renderDefault(ocular);

                // circle
                ocular.canvasContext.beginPath();
                ocular.canvasContext.arc(0, 0, this.radius, 0, 2 * Math.PI);

                // border
                if (this.borderWidth > 0) {
                        ocular.canvasContext.lineWidth = this.borderWidth;
                        ocular.canvasContext.strokeStyle = this.borderColor;

                        ocular.canvasContext.stroke();
                }

                // fill
                ocular.canvasContext.fillStyle = this.fillColor;
                ocular.canvasContext.fill();

                ocular.canvasContext.restore();
        }
}