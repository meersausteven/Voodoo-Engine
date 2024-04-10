
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

                this.attributes['viewportSize'] = new AttributeVector2('Viewport Size', new Vector2(width, height), "Width", "Height", null, new Range());

                this.worldPos = new Vector2();

                this.prepareCanvas();
        }

        start() {
                if (this.canvas === null) {
                        this.prepareCanvas();
                }

                /*
                this.debugCanvas = document.createElement('canvas');
                this.debugCanvas.style.position = 'absolute';
                this.debugCanvas.style.left = '20px';
                this.debugCanvas.style.bottom = '20px';
                this.debugCanvas.style.backgroundColor = 'black';
                this.debugCanvas.style.border = '2px solid #ccc';
                document.body.appendChild(this.debugCanvas);
                this.debugCanvas.width = this.attributes['viewportSize'].value.x / 10;
                this.debugCanvas.height = this.attributes['viewportSize'].value.y / 10;
                this.debugContext = this.debugCanvas.getContext("2d");
                this.debugContext.scale(1 / 10, 1 / 10);
                */
        }

        // clear canvas
        clear() {
                this.canvasContext.clearRect(0, 0, this.attributes['viewportSize'].value.x, this.attributes['viewportSize'].value.y);
        }

        update() {
                this.clear();

                if (this.talisman !== null) {
                        this.worldPos = new Vector2(
                                this.talisman.transform.attributes['position'].value.x,
                                this.talisman.transform.attributes['position'].value.y
                        );

                        this.talisman.scene.project.rendererEngine.renderToCameraView(this);
                }

                this.frameImage = this.canvas;
                /*
                this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
                this.debugContext.drawImage(this.frameImage, 0, 0);
                */
        }

        prepareCanvas() {
                this.canvas = document.createElement('canvas');

                this.canvas.width = this.attributes['viewportSize'].value.x;
                this.canvas.height = this.attributes['viewportSize'].value.y;

                this.canvasContext = this.canvas.getContext("2d");
        }
}