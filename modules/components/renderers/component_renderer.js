
import { AttributeVector2 } from '../../editor/attributes/attribute_vector2.js';

import { Vector2 } from '../../collection/vector2.js';

import { Component } from '../component.js';

export class ComponentRenderer extends Component {
        type = "Renderer";

        constructor(offset = new Vector2()) {
                super();
                
                this.attributes['offset'] = new AttributeVector2('Offset', offset);
                this.worldPos = new Vector2();
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
}
