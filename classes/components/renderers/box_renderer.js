
class BoxRenderer extends Renderer {
        type = "Renderer/Box Renderer";
        width = 10;
        height = 10;
        color = null;
        borderWidth = 1;
        borderColor = null;
        
        constructor(width, height, color, borderWidth, borderColor, offset = new Vector2()) {
                // width: width of the box
                // height: height of the box
                // color: fill color
                // borderWidth: width of border
                // borderColor: color of border
                // offset: offset relative to this gameObject's position
                
                super(offset);

                this.width = width;
                this.height = height;
                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;
        }

        /*
        mouseOverCheck(x, y) {
                // calculate coords on canvas by taking in the coords of its gameObject
                let worldPos = new Vector2(
                        this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x,
                        this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y
                );

                if ( valueBetween(x, worldPos.x - (this.width / 2), worldPos.x + (this.width / 2)) &&
                     valueBetween(y, worldPos.y - this.height, worldPos.y) ) {
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
                
                // border
                context.lineWidth = this.borderWidth;
                context.strokeStyle = this.borderColor;
                context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
                // fill
                context.fillStyle = this.color;
                context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

                context.restore();
        }
}