
class Cursor {
        // position
        position;
        // left click
        leftClick;
        leftClickDownPos;
        leftClickUpPos;
        // right click
        rightClick;
        rightClickDownPos;
        rightClickUpPos;

        constructor() {
                this.position = new Vector2();
                this.hovering = null;
                
                this.leftClick = false;
                this.leftClickDownPos = null;
                this.leftClickUpPos = null;

                this.rightClick = false;
                this.rightClickDownPos = null;
                this.rightClickUpPos = null;
        }
}