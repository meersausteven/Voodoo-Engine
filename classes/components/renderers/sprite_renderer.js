
class SpriteRenderer extends Renderer {
        type = "Renderer/Sprite Renderer";
        width = 0;
        height = 0;
        image = null;
        filePath = null;

        constructor(width, height, filePath = null, offset = new Vector2()) {
                // width: width of the sprite
                // height: height of the sprite
                // filePath: path to the image file relative to the path in project setting 'spriteFilesPath'
                // offset: offset relative to this gameObject's position

                super(offset);

                this.width = width;
                this.height = height;
                this.image = new Image(this.width, this.height);
                this.filePath = filePath;
        }

        start() {
                // run this function after this component was added to the gameObject
                if (this.filePath != null) {
                        this.image.src = this.gameObject.scene.project.settings.spriteFilesPath + this.filePath;
                }
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
                if (this.filePath != null) {
                        let context = this.gameObject.scene.project.canvasContext;

                        context.save();

                        context.translate(this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x, this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y);
                        context.rotate(this.gameObject.rotationAngle);
                        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

                        context.restore();
                }
        }

        updateSource() {
                this.image.src = this.gameObject.scene.project.settings.spriteFilesPath + this.filePath;
        }
}