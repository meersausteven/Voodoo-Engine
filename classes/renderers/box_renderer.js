
class BoxRenderer extends Renderer {
        constructor(parent, color, borderWidth, borderColor, offsetX = 0, offsetY = 0) {
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
        }

        mouseOverCheck(x, y, camera) {
                // calculate coords on canvas by taking in the coords of its parent
                let worldPos = {
                        x: this.parent.pos.x + this.offset.x - camera.pos.x,
                        y: this.parent.pos.y + this.offset.y - camera.pos.y
                };

                if ( valueBetween(x, worldPos.x - (this.width / 2), worldPos.x + (this.width / 2)) &&
                     valueBetween(y, worldPos.y - this.height, worldPos.y) ) {
                        return true;
                }
                
                return false;
        }

        render(context, camera) {
                context.save();
                context.translate(this.parent.pos.x + this.offset.x - camera.pos.x, this.parent.pos.y + this.offset.y - camera.pos.y);
                context.rotate(this.parent.rotationAngle);
                
                // border
                context.lineWidth = this.borderWidth;
                context.strokeStyle = this.borderColor;
                context.strokeRect(-this.parent.width / 2, -this.parent.height, this.parent.width, this.parent.height);
                // fill
                context.fillStyle = this.color;
                context.fillRect(-this.parent.width / 2, -this.parent.height, this.parent.width, this.parent.height);

                context.restore();
        }
}