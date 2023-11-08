
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeColor } from './../../editor/attributes/attribute_color.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class BoxRenderer extends Renderer {
        type = "Box Renderer";

        /* 
         * constructor
         * @param number width: width of the box
         * @param number height: height of the box
         * @param string fillColor: fill color
         * @param number borderWidth: width of border
         * @param string borderColor: color of border
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(width = 50, height = 50, fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', offset = new Vector2()) {
                super(offset);

                this.attributes['width'] = new AttributeNumber('Width', width, null, new Range());
                this.attributes['height'] = new AttributeNumber('Height', height, null, new Range());
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth, null, new Range());
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        /*
         * renders a box to a camera
         * @param Camera camera
         */
        render(camera) {
                this.renderDefault(camera);

                // border
                if (this.attributes['borderWidth'].value > 0) {
                        camera.canvasContext.lineWidth = this.attributes['borderWidth'].value;
                        camera.canvasContext.strokeStyle = this.attributes['borderColor'].value;
                        camera.canvasContext.strokeRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);
                }

                // fill
                camera.canvasContext.fillStyle = this.attributes['fillColor'].value;
                camera.canvasContext.fillRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                camera.canvasContext.restore();
        }
}