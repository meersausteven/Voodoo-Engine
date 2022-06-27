
class SpriteRenderer extends ComponentRenderer {
        type = "Sprite Renderer";

        constructor(width = 50, height = 50, filePath = "/default.png", offset = new Vector2()) {
                // int width: width of the sprite
                // int height: height of the sprite
                // file filePath: path to the image file relative to the path in project setting 'filePathSprites'
                // Vector2 offset: offset relative to this gameObject's position

                super(offset);

                this.attributes['width'] = new AttributeNumber('Width', width);
                this.attributes['height'] = new AttributeNumber('Height', height);
                this.attributes['image'] = new Image(this.attributes['width'].value, this.attributes['height'].value);
                this.attributes['filePath'] = new AttributeImage('File Path', filePath);
        }

        start() {
                console.log("Test - sprite renderer");
                this.attributes['filePath'].value = this.gameObject.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
                console.log(this.attributes['filePath'].value);
                // run this function after this component was added to the gameObject
                if (this.attributes['filePath'].value !== null) {
                        this.attributes['image'].src = this.attributes['filePath'].value;
                }
        }

        render(camera) {
                if ((camera === null) ||
                    (typeof camera === 'undefined') ||
                    !(camera instanceof Camera)) {
                        return false;
                }

                if (this.attributes['filePath'].value != null) {
                        camera.canvasContext.save();

                        camera.canvasContext.translate(this.worldPos.x + this.attributes['offset'].value.x - camera.worldPos.x, this.worldPos.y + this.attributes['offset'].value.y - camera.worldPos.y);
                        camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value));
                        camera.canvasContext.drawImage(this.attributes['image'], -this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                        camera.canvasContext.restore();
                }
        }

        updateSource() {
                this.attributes['image'].src = this.gameObject.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
        }
}