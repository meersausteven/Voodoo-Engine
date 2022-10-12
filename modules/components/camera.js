
import { AttributeNumber } from '../editor/attributes/attribute_number.js';

import { Vector2 } from '../collection/vector2.js';

import { Component } from './component.js';

export class Camera extends Component {
        type = 'Camera';

        canvas;
        cavnasContext;
        frameImage;

        constructor(width, height) {
                super();

                this.attributes['viewWidth'] = new AttributeNumber('view width', width);
                this.attributes['viewHeight'] = new AttributeNumber('view height', height);

                this.worldPos = new Vector2();

                this.canvas = document.createElement('canvas');
                this.canvas.width = this.attributes['viewWidth'].value;
                this.canvas.height = this.attributes['viewHeight'].value;
                this.canvasContext = this.canvas.getContext("2d");
        }

        // clear canvas
        clear() {
                this.canvasContext.clearRect(0, 0, this.attributes['viewWidth'].value, this.attributes['viewHeight'].value);
        }

        update() {
                if (this.gameObject !== null) {
                        this.attributes['worldPos'] = new Vector2(
                                this.gameObject.transform.attributes['position'].value.x,
                                this.gameObject.transform.attributes['position'].value.y
                        );

                        this.gameObject.scene.project.renderer.renderToCameraView(this);
                }

                this.frameImage = this.canvas;
        }
}