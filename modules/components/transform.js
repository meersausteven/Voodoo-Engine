
import { Vector2 } from '../collection/vector2.js';

import { AttributeVector2 } from '../editor/attributes/attribute_vector2.js';
import { AttributeNumber } from '../editor/attributes/attribute_number.js';

import { Component } from './component.js';

export class Transform extends Component {
        type = "Transform";
        
        constructor(position = new Vector2(), rotation = 0) {
                super();

                // transform components may not be disabled
                this.attributes['position'] = new AttributeVector2('Position', position);
                this.attributes['rotation'] = new AttributeNumber('Rotation', rotation);
        }
}