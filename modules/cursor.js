
import { Vector2 } from './collection/vector2.js';

export class Cursor {
        // position
        position;
        // left click
        leftClick;
        leftClickDownPos;
        leftClickUpPos;
        // wheel click
        wheelClick;
        wheelClickDownPos;
        wheelClickUpPos;
        // right click
        rightClick;
        rightClickDownPos;
        rightClickUpPos;

        constructor() {
                this.position = new Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
                this.hovering = null;

                this.leftClick = false;
                this.leftClickDownPos = null;
                this.leftClickUpPos = null;

                this.wheelClick = false;
                this.wheelClickDownPos = null;
                this.wheelClickUpPos = null;

                this.rightClick = false;
                this.rightClickDownPos = null;
                this.rightClickUpPos = null;
        }
}