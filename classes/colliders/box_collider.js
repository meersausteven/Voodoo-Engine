
class BoxCollider extends Collider {
        constructor(parent, camera, width = null, height = null, isTrigger = false, offsetX = 0, offsetY = 0) {
                // parent: a GameObject
                // camera active game camera
                // width: width of the rectangle
                // height: height of the rectangle
                // offsetX: offset on the x axis (starting from center of parent)
                // offsetY: offset on the y axis (starting from bottom of parent)

                super(parent, camera, isTrigger, offsetX, offsetY);

                this.type = "Box Collider";

                this.width = width;
                this.height = height;

                if (this.width == null) {
                        this.width = this.parent.width;
                }

                if (this.height == null) {
                        this.height = this.parent.height;
                }
        }

        checkPointInside(x, y) {
                // calculate coords on canvas by taking in the coords of its parent
                if ( valueBetween(x, this.worldPos.x - (this.width / 2), this.worldPos.x + (this.width / 2)) &&
                     valueBetween(y, this.worldPos.y - this.height, this.worldPos.y) ) {
                        return true;
                }
                
                return false;
        }

        checkColliderOverlapping(otherCollider, checkPos = null) {
                // checkPosition is the position where collision should be checked
                // if null use the parent's position
                if (checkPos != null) {
                        checkPos = {
                                x: checkPos.x + this.offset.x - this.parent.game.activeCamera.pos.x,
                                y: checkPos.y + this.offset.y - this.parent.game.activeCamera.pos.y
                        }
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

        showBounds(context) {
                context.save();
                context.translate(this.worldPos.x, this.worldPos.y);
                context.rotate(this.parent.rotationAngle);
                // world Pos (should be parent pos)
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