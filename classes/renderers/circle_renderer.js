
class CircleRenderer extends Renderer {
        constructor(parent, color, borderWidth, borderColor, radius = null, offsetX = 0, offsetY = 0) {
                // parent: a GameObject
                // color: fill color
                // borderWidth: width of border
                // borderColor: color of border
                // radius: radius of the circle
                // offsetX: offset on the x axis
                // offsetY: offset on the y axis

                super(parent, offsetX, offsetY);

                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;

                if (radius == null) {
                        if (this.parent.width < this.parent.height) {
                                this.radius = this.parent.width;
                        } else {
                                this.radius = this.parent.height;
                        }
                }
        }
        mouseOverCheck(x, y, camera) {
                // calculate coords on canvas by taking in the coords of its parent
                let worldPos = {
                        x: this.parent.pos.x + this.offset.x - camera.pos.x,
                        y: this.parent.pos.y + this.offset.y - camera.pos.y
                };

                let distPoints = (x - worldPos.x) * (x - worldPos.x) + (y - worldPos.y) * (y - worldPos.y);
                let r = this.radius;
                r *= r;

                if (distPoints < r) {
                        return true;
                }

                return false;
        }

        render(context, camera) {
                context.save();
                context.translate(this.parent.pos.x + this.offset.x - camera.pos.x, this.parent.pos.y + this.offset.y - camera.pos.y);
                context.rotate(this.parent.rotationAngle);

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