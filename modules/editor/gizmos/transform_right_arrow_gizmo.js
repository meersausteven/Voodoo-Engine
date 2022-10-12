
import { EditorComponentGizmo } from './editor_component_gizmo.js';

export class TransformRightArrowGizmo extends EditorComponentGizmo {
        sprite;

        constructor(component) {
                super(component);

                this.width = 100;
                this.height = 18;
                this.sprite = new Image(this.width, this.height);
                this.sprite.src = this.component.gameObject.scene.project.settings.filePathSprites + 'editor/widgets/transform_right_arrow.png';
        }

        render(camera) {
                camera.canvasContext.save();

                camera.canvasContext.translate(this.component.gameObject.transform.attributes['position'].value.x - camera.worldPos.x, this.component.gameObject.transform.attributes['position'].value.y - camera.worldPos.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.component.gameObject.transform.attributes['rotation'].value));
                camera.canvasContext.drawImage(this.sprite, 0, -this.height / 2, this.sprite.width, this.sprite.height);

                camera.canvasContext.restore();
        }
}