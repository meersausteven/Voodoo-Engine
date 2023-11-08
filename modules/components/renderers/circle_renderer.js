
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class CircleRenderer extends Renderer {
        type = "Circle Renderer";

        /*
         * constructor
         * @param string fillColor: fill color
         * @param number borderWidth: width of border
         * @param string borderColor: color of border
         * @param number radius: radius of the circle
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', radius = 25, offset = new Vector2()) {

                super(offset);

                this.attributes['radius'] = new AttributeNumber('Radius', radius, null, new Range());
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth, null, new Range());
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        /*
         * renders a circle to a camera
         * @param Camera camera
         */
        render(camera) {
                this.renderDefault(camera);

                // circle
                camera.canvasContext.beginPath();
                camera.canvasContext.arc(0, 0, this.attributes['radius'].value, 0, 2 * Math.PI);

                // border
                if (this.attributes['borderWidth'].value > 0) {
                        camera.canvasContext.lineWidth = this.attributes['borderWidth'].value;
                        camera.canvasContext.strokeStyle = this.attributes['borderColor'].value;

                        camera.canvasContext.stroke();
                }

                // fill
                camera.canvasContext.fillStyle = this.attributes['fillColor'].value;
                camera.canvasContext.fill();

                camera.canvasContext.restore();
        }
}