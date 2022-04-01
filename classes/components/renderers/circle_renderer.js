
class CircleRenderer extends Renderer {
        type = "Renderer/Circle Renderer";
        color = null;
        borderWidth = 1;
        borderColor = null;
        radius = 0;
        
        constructor(color, borderWidth, borderColor, radius = 0, offset = new Vector2()) {
                // color: fill color
                // borderWidth: width of border
                // borderColor: color of border
                // radius: radius of the circle
                // offset: offset relative to this gameObject's position

                super(offset);

                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;
                this.radius = radius;
        }
        
        /*

        mouseOverCheck(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                let worldPos = new Vector2(
                        this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x,
                        this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y
                );

                let distPoints = (x - worldPos.x) * (x - worldPos.x) + (y - worldPos.y) * (y - worldPos.y);
                let r = this.radius;
                r *= r;

                if (distPoints < r) {
                        return true;
                }

                return false;
        }
        */

        update() {
                let context = this.gameObject.scene.project.canvasContext;

                context.save();
                context.translate(this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x, this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y);
                context.rotate(this.gameObject.rotationAngle);

                context.beginPath();
                context.arc(0, 0, this.radius, 0, 2 * Math.PI);
                // border
                context.lineWidth = this.borderWidth;
                context.strokeStyle = this.borderColor;
                context.stroke();
                // fill
                context.fillStyle = this.color;
                context.fill();

                context.restore();
        }

}