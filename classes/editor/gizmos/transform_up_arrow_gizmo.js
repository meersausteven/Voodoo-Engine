
class TransformUpArrowGizmo extends EditorComponentGizmo {
        sprite;

        constructor(component) {
                super(component);

                this.width = 18;
                this.height = 150;
                this.sprite = new Image(this.width, this.height);
                this.sprite.src = this.component.gameObject.scene.project.settings.filePathSprites + 'editor/widgets/transform_up_arrow.png';
        }

        render(camera) {
                if ((camera === null) ||
                    (typeof camera === 'undefined') ||
                    !(camera instanceof Camera)) {
                        return false;
                }

                camera.canvasContext.save();

                camera.canvasContext.translate(this.component.gameObject.transform.attributes['position'].value.x - camera.gameObject.transform.attributes['position'].value.x, this.component.gameObject.transform.attributes['position'].value.y - camera.gameObject.transform.attributes['position'].value.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.component.gameObject.transform.attributes['rotation'].value));
                camera.canvasContext.drawImage(this.sprite, -this.width / 2, -this.height, this.sprite.width, this.sprite.height);

                camera.canvasContext.restore();
        }
}