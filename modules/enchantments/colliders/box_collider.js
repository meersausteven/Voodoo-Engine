
import { Vector2 } from './../../collection/vector2.js';
import { Bounds } from './../../collection/bounds.js';
import { Range } from './../../collection/range.js';

import { AttributeNumber } from './../../editor/attributes/attribute_number.js';

import { Collider } from './collider.js';

export class BoxCollider extends Collider {
        type = "Box Collider";
        icon = "fa-vector-square";

        /*
         * constructor
         * @param number width: width of the rectangle
         * @param number height: height of the rectangle
         * @param boolean isTrigger: turns this collider into a trigger (no collision will be possible)
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(width = 50, height = 50, isTrigger = false, offset = new Vector2()) {
                super(isTrigger, offset);

                this.width = width;
                this.height = height;

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['width'] = new AttributeNumber('Width', this.width, this.set.bind(this, 'width'));
                this.editorAttributes['height'] = new AttributeNumber('Height', this.height, this.set.bind(this, 'height'));
        }

        updateBounds() {
                this.bounds = new Bounds(
                        this.worldPos.y - (this.height / 2),
                        this.worldPos.x + (this.width / 2),
                        this.worldPos.y + (this.height / 2),
                        this.worldPos.x - (this.width / 2)
                );
        }

        renderGizmo(ocular) {
                ocular.canvasContext.save();
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);

                ocular.canvasContext.lineWidth = 3;
                ocular.canvasContext.strokeStyle = '#cc1133';
                ocular.canvasContext.setLineDash([3,6]);
                ocular.canvasContext.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

                ocular.canvasContext.restore();
        }
}