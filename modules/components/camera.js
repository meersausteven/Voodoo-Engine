
import { AttributeNumber } from '../editor/attributes/attribute_number.js';

import { Vector2 } from '../collection/vector2.js';

import { Component } from './component.js';

export class Camera extends Component {
        type = 'Camera';

        canvas;
        cavnasContext;
        frameImage;
        // debugCanvas;
        // debugContext;

        /*
         * @param Number width: width of the camera view (canvas)
         * @param Number height: height of the camera view (canvas)
         */
        constructor(width, height) {
                super();

                this.attributes['viewWidth'] = new AttributeNumber('View Width', width);
                this.attributes['viewHeight'] = new AttributeNumber('View Height', height);

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
                this.debugCanvas.width = this.attributes['viewWidth'].value / 10;
                this.debugCanvas.height = this.attributes['viewHeight'].value / 10;
                this.debugContext = this.debugCanvas.getContext("2d");
                this.debugContext.scale(1 / 10, 1 / 10);
                */
        }

        // clear canvas
        clear() {
                this.canvasContext.clearRect(0, 0, this.attributes['viewWidth'].value, this.attributes['viewHeight'].value);
        }

        update() {
                this.clear();

                if (this.gameObject !== null) {
                        this.worldPos = new Vector2(
                                this.gameObject.transform.attributes['position'].value.x,
                                this.gameObject.transform.attributes['position'].value.y
                        );

                        this.gameObject.scene.project.renderer.renderToCameraView(this);
                }

                this.frameImage = this.canvas;
                /*
                this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
                this.debugContext.drawImage(this.frameImage, 0, 0);
                */
        }

        prepareCanvas() {
                this.canvas = document.createElement('canvas');

                this.canvas.width = this.attributes['viewWidth'].value;
                this.canvas.height = this.attributes['viewHeight'].value;
                
                this.canvasContext = this.canvas.getContext("2d");
        }
}