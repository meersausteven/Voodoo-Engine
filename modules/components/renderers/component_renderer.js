
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
                this.worldPos = new Vector2(
                        this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x,
                        this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y
                );
                
                this.passToRenderer();
        }

        passToRenderer() {
                /*
                @todo: ADD FUNCTIONALITY TO PASS A RenderedObject-Object TO THE PROJECTS RENDERER
                       WORLD POSITION, ROTATION, WIDTH, HEIGHT, BOUNDS, etc. ARE NECCESSARY
                */
                this.gameObject.scene.project.renderer.addComponentRenderer(this);
        }
}
