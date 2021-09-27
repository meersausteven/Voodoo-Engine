
class ImageRenderer extends Renderer {
        constructor(parent, imagePath = null, offsetX = 0, offsetY = 0) {
                // parent: a GameObject
                // imagePath: path to the image
                // offsetX: offset on the x axis
                // offsetY: offset on the y axis

                super(parent, offsetX, offsetY);

                this.image = new Image(this.parent.width, this.parent.height);
                this.imagePath = imagePath;

                if (this.imagePath != null) {
                        this.image.src = window.location.href + "/../images/" + this.imagePath;
                }
        }

        mouseOverCheck(x, y, camera) {
                // calculate coords on canvas by taking in the coords of its parent
                let worldPos = {
                        x: this.parent.pos.x + this.offset.x - camera.pos.x,
                        y: this.parent.pos.y + this.offset.y - camera.pos.y
                };

                if ( valueBetween(x, worldPos.x - (this.parent.width / 2), worldPos.x + (this.parent.width / 2)) &&
                     valueBetween(y, worldPos.y - this.parent.height, worldPos.y) ) {
                        return true;
                }
                
                return false;
        }

        render(context, camera) {
                if (this.imagePath != null) {
                        context.save();

                        context.translate(this.parent.pos.x + this.offset.x - camera.pos.x, this.parent.pos.y + this.offset.y - camera.pos.y);
                        context.rotate(this.parent.rotationAngle);
                        context.drawImage(this.image, -this.parent.width / 2, -this.parent.height, this.image.width, this.image.height);

                        context.restore();
                }
        }

        showBounds(context, camera) {
                context.save();

                context.translate(this.parent.pos.x + this.offset.x - camera.pos.x, this.parent.pos.y + this.offset.y - camera.pos.y);
                context.rotate(this.parent.rotationAngle);
                // draw width and height
                context.lineWidth = 1;
                context.strokeStyle = '#ffffff';
                context.strokeRect(0, 0, this.width, this.height);

                context.restore();
        }

        updateSource() {
                this.image.src = window.location.href + "/../images/" + this.imagePath;
        }
}