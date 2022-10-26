
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Vector2 } from './../../collection/vector2.js';

import { ComponentRenderer } from './component_renderer.js';

export class CircleRenderer extends ComponentRenderer {
        type = "Circle Renderer";
        
        constructor(fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', radius = 25, offset = new Vector2()) {
                // color fillColor: fill color
                // int borderWidth: width of border
                // color borderColor: color of border
                // int radius: radius of the circle
                // Vector2 offset: offset relative to this gameObject's position

                super(offset);

                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth);
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
                this.attributes['radius'] = new AttributeNumber('Radius', radius);
        }

        render(camera) {
                camera.canvasContext.save();
                camera.canvasContext.translate(this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x, this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value));

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