
import { AttributeVector2 } from '../../editor/attributes/attribute_vector2.js';

import { Vector2 } from '../../collection/vector2.js';
import { Range } from '../../collection/range.js';

import { Enchantment } from '../enchantment.js';
import { AttributeRange } from '../../editor/attributes/attribute_range.js';

export class Renderer extends Enchantment {
        type = "Renderer";
        icon = "fa-draw-polygon";

        /*
         * constructor
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(offset = new Vector2()) {
                super();

                this.worldPos = new Vector2();
                this.attributes['offset'] = new AttributeVector2('Offset', offset);
                this.attributes['alpha'] = new AttributeRange('Alpha', 1, new Range(0.00, 1.00, 0.01), '', 2);
        }

        update() {
                this.worldPos = Vector2.add(this.talisman.transform.attributes['position'].value, this.attributes['offset'].value);

                if (this.talisman !== null) {
                        this.passToRenderer();
                }
        }

        render(ocular) {
                return;
        }

        renderDefault(ocular) {
                ocular.canvasContext.save();

                // transform
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);
                ocular.canvasContext.rotate(Math.degreesToRadians(this.talisman.transform.attributes['rotation'].value));

                // alpha
                ocular.canvasContext.globalAlpha = this.attributes['alpha'].value;
        }

        passToRenderer() {
                this.talisman.scene.project.rendererEngine.addComponentRenderer(this);
        }

        removeFromRenderer() {
                this.talisman.scene.project.rendererEngine.removeComponentRenderer(this);
        }
}
