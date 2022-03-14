
class BoxCollider extends Collider {
        type = "Collider/Box Collider";
        width = 0;
        height = 0;

        constructor(width = 0, height = 0, isTrigger = false, offset = new Vector2()) {
                // gameObject: the gameObject this component belongs to
                // camera active game camera
                // width: width of the rectangle
                // height: height of the rectangle
                // offset.x: offset on the x axis (starting from center of gameObject)
                // offset.y: offset on the y axis (starting from bottom of gameObject)

                super(isTrigger, offset);

                this.width = width;
                this.height = height;

                if (this.width == 0) {
                        this.width = this.gameObject.width;
                }

                if (this.height == 0) {
                        this.height = this.gameObject.height;
                }
        }

        checkPointInside(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                if ( valueBetween(x, this.worldPos.x - (this.width / 2), this.worldPos.x + (this.width / 2)) &&
                     valueBetween(y, this.worldPos.y - this.height, this.worldPos.y) ) {
                        return true;
                }
                
                return false;
        }

        checkColliderOverlapping(otherCollider, checkPos = null) {
                // checkPosition is the position where collision should be checked
                // if null use the gameObject's position
                if (checkPos != null) {
                        checkPos = new Vector2(
                                checkPos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x,
                                checkPos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y
                        );
                }
                
                switch (otherCollider.type) {
                        case "Circle Collider":
                                return circleBoxOverlapping(otherCollider, this, checkPos, this.type);
                        case "Box Collider":
                                return boxesOverlapping(this, otherCollider, checkPos);
                        default:
                                return
                }
        }

        showBounds() {
                let context = this.gameObject.scene.project.canvasContext;
                
                context.save();
                context.translate(this.worldPos.x, this.worldPos.y);
                context.rotate(this.gameObject.rotationAngle);
                // world Pos (should be gameObject pos)
                context.fillStyle = '#cc8833';
                context.fillRect(-4, -4, 8, 8);

                if (this.isTrigger == false) {
                        // orange for colliders
                        context.fillStyle = '#994400';
                        context.strokeStyle = '#ffaa55';
                } else {
                        // blue for triggers
                        context.fillStyle = '#5555dd';
                        context.strokeStyle = '#8888ff';
                }

                // draw width and height
                context.lineWidth = 1;
                context.strokeRect(this.width / -2, 0, this.width, -this.height);
                // draw corners
                context.fillRect((this.width / -2) - 3, -this.height - 3, 6, 6); // top left
                context.fillRect((this.width / 2) - 3, -this.height - 3, 6, 6); // top right
                context.fillRect((this.width / 2) - 3, 0 - 3, 6, 6); // bottom right
                context.fillRect((this.width / -2) - 3, 0 - 3, 6, 6); // bottom left

                context.restore();
        }
}