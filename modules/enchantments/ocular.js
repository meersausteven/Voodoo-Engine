
import { AttributeNumber } from '../editor/attributes/attribute_number.js';

import { Vector2 } from '../collection/vector2.js';
import { Range } from '../collection/range.js';

import { Enchantment } from './enchantment.js';
import { AttributeVector2 } from '../editor/attributes/attribute_vector2.js';

export class Ocular extends Enchantment {
        type = 'Ocular';
        icon = 'fa-eye';

        canvas;
        cavnasContext;
        frameImage;

        /*
         * constructor
         * @param number width: width of the ocular view (canvas)
         * @param number height: height of the ocular view (canvas)
         */
        constructor(width, height) {
                super();

                this.viewportSize = new Vector2(width, height);

                this.worldPos = new Vector2();

                this.prepareCanvas();
                this.createAttributes();
        }

        start() {
                if (this.canvas === null) {
                        this.prepareCanvas();
                }
        }

        update() {
                this.clear();

                if (this.talisman !== null) {
                        this.worldPos = new Vector2(
                                this.talisman.transform.position.x,
                                this.talisman.transform.position.y
                        );

                        this.talisman.scene.project.rendererEngine.renderToCameraView(this);
                }

                this.frameImage = this.canvas;
                /*
                this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
                this.debugContext.drawImage(this.frameImage, 0, 0);
                */
        }

        createAttributes() {
                this.editorAttributes['viewportSize'] = new AttributeVector2('Viewport Size', this.viewportSize, this.set.bind(this, 'viewportSize'), "Width", "Height", null, new Range());
        }

        // clear canvas
        clear() {
                this.canvasContext.clearRect(0, 0, this.viewportSize.x, this.viewportSize.y);
        }

        // prepare canvas
        prepareCanvas() {
                this.canvas = document.createElement('canvas');

                this.canvas.width = this.viewportSize.x;
                this.canvas.height = this.viewportSize.y;

                this.canvasContext = this.canvas.getContext("2d");
        }
}