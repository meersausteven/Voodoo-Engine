
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
                this.offset = offset;
                this.alpha = 1;

                this.createAttributes();
        }

        update() {
                this.worldPos = Vector2.add(this.talisman.transform.position, this.offset);

                if (this.talisman !== null) {
                        this.passToRenderer();
                }
        }

        createAttributes() {
                this.editorAttributes['offset'] = new AttributeVector2('Offset', this.offset, this.set.bind(this, 'offset'));
                this.editorAttributes['alpha'] = new AttributeRange('Alpha', this.alpha, new Range(0.00, 1.00, 0.01), this.set.bind(this, 'alpha'), '', 2);
        }

        render(ocular) {
                return;
        }

        renderDefault(ocular) {
                ocular.canvasContext.save();

                // transform
                ocular.canvasContext.translate(this.worldPos.x - ocular.worldPos.x, this.worldPos.y - ocular.worldPos.y);
                ocular.canvasContext.rotate(Math.degreesToRadians(this.talisman.transform.rotation));

                // alpha
                ocular.canvasContext.globalAlpha = this.alpha;
        }

        passToRenderer() {
                this.talisman.scene.project.rendererEngine.addComponentRenderer(this);
        }

        removeFromRenderer() {
                this.talisman.scene.project.rendererEngine.removeComponentRenderer(this);
        }
}
