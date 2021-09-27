
class DraggableObject extends GameObject {
        constructor(game, x, y, width, height, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.type = "Draggable Object";
                this.name = "new DraggableObject";

                // is the cursor hovering this object?
                this.hovering = false;
                // is the cursor hovering this object?
                this.dragging = false;
                this.cursor = null;
                this.lockedPos = {
                        x: false,
                        y: false
                };
        }

        update() {
                if (this.cursor != null) {
                        if (this.hovering == true) {
                                
                        }

                        if (this.dragging == true) {
                                if (this.lockedPos.x == false) {
                                        this.pos.x += this.cursor.delta.x;
                                }

                                if (this.lockedPos.y == false) {
                                        this.pos.y += this.cursor.delta.y;
                                }
                        }
                }
                
                super.update();
        }

        showBounds(context, camera) {
                super.showBounds(context, camera);

                if (this.dragging == true) {
                        context.save();
                        context.translate(this.pos.x - this.width - camera.pos.x, this.pos.y - this.height + 15 - camera.pos.y);

                        // show this objects position when being dragged
                        context.font = "14px Arial";
                        context.lineWidth = 1;
                        context.strokeStyle = "#ffffff";
                        context.strokeText("X: " + this.pos.x + " | Y: " + this.pos.y, 0, 0);
                        context.fillText("X: " + this.pos.x + " | Y: " + this.pos.y, 0, 0);

                        context.restore();
                }
        }

        onMouseDown(cursor) {
                this.dragging = true;
                this.cursor = cursor;

                return;
        }

        onMouseUp() {
                this.dragging = false;

                return;
        }

        onMouseEnter(cursor) {
                this.hovering = true;
                this.cursor = cursor;

                return;
        }

        onMouseLeave() {
                this.hovering = false;

                return;
        }
}