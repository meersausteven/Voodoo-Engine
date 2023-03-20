
import { AttributeVector2 } from '../../editor/attributes/attribute_vector2.js';

import { Vector2 } from '../../collection/vector2.js';
import { Range } from '../../collection/range.js';

import { Component } from '../component.js';
import { AttributeNumber } from '../../editor/attributes/attribute_number.js';

export class ComponentRenderer extends Component {
        type = "Component Renderer";

        /*
         * constructor
         * @param Vector2 offset: offset relative to this gameObject's position
         */
        constructor(offset = new Vector2()) {
                super();

                this.worldPos = new Vector2();
                this.attributes['offset'] = new AttributeVector2('Offset', offset);
                this.attributes['alpha'] = new AttributeNumber('Alpha', 1, null, new Range(0, 1, 0.01));
        }

        update() {
                this.worldPos = Vector2.add(this.gameObject.transform.attributes['position'].value, this.attributes['offset'].value);

                if (this.gameObject !== null) {
                        this.passToRenderer();
                }
        }

        passToRenderer() {
                this.gameObject.scene.project.renderer.addComponentRenderer(this);
        }

        renderDefault(camera) {
                camera.canvasContext.save();

                // transform
                camera.canvasContext.translate(this.worldPos.x - camera.worldPos.x, this.worldPos.y - camera.worldPos.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value));

                // alpha
                camera.canvasContext.globalAlpha = this.attributes['alpha'].value;
        }
}
