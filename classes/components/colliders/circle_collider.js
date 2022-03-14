
class CircleCollider extends Collider {
        type = "Collider/Circle Collider";
        radius = 0;

        constructor(radius, isTrigger = false, offset = new Vector2()) {
                // gameObject: the gameObject this component belongs to
                // radius: radius of the circle
                // offsetX: offset on the x axis (starting from center of gameObject)
                // offsetY: offset on the y axis (starting from bottom of gameObject)

                super(isTrigger, offset);

                this.radius = radius;
        }
        
        checkPointInside(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                let distPoints = (x - this.worldPos.x) * (x - this.worldPos.x) + (y - this.worldPos.y) * (y - this.worldPos.y);
                let r = this.radius;
                r *= r;

                if (distPoints < r) {
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
                                return circlesOverlapping(this, otherCollider, checkPos);
                        case "Box Collider":
                                return circleBoxOverlapping(this, otherCollider, checkPos, this.type);
                        default:
                                return
                }
        }

        showBounds() {
                let context = this.gameObject.scene.project.canvasContext;
                
                context.save();

                context.translate(this.worldPos.x, this.worldPos.y);
                context.rotate(this.gameObject.rotationAngle);
                // draw center
                if (this.isTrigger == false) {
                        // orange for colliders
                        context.fillStyle = '#994400';
                        context.strokeStyle = '#ffaa55';
                } else {
                        // blue for triggers
                        context.fillStyle = '#5555dd';
                        context.strokeStyle = '#8888ff';
                }
                context.fillRect(-2, -2, 4, 4);
                // draw outline
                context.beginPath();
                context.arc(0, 0, this.radius, 0, 2 * Math.PI);
                context.lineWidth = 1;
                context.stroke();

                context.restore();
        }
}