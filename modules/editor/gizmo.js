import { Vector2 } from './../collection/vector2.js';

export class Gizmo {
        active = false;

        /*
         * constructor
         * @param string name: name of the gizmo
         * @param Bounds bounds: bounds of the gizmo
         * @param AttributeText attribute: attribute this gizmo controls
         * @param Vector2 pivot: pivot of the rendered image
         * @param string imagePath: path to the rendered image
         * @param number imageWidth: width of the rendered image
         * @param number imageHeight: height of the rendered image
         * @param Vector2 vectorBias: multiplies with the changed value (mouseMovement) to create a bias
         */
        constructor(name, bounds, attribute, pivot, imagePath, imageWidth, imageHeight, vectorBias = Vector2.zero) {
                this.name = name;
                this.bounds = bounds;
                this.attribute = attribute;
                this.imagePivot = pivot;
                this.imagePath = imagePath;
                this.imageWidth = imageWidth;
                this.imageHeight = imageHeight;
                this.vectorBias = vectorBias;

                this.updateImage();
        }

        updateImage() {
                this.image = new Image(this.imageWidth, this.imageHeight);
                this.image.src = this.imagePath;
        }

        render(ctx) {
                if (this.active === true) {
                        ctx.filter = 'brightness(200%)';
                } else {
                        ctx.filter = 'brightness(100%)';
                }

                ctx.drawImage(this.image, this.imagePivot.x, this.imagePivot.y, this.imageWidth, this.imageHeight);
        }

        /*
         * change the value of the attribute
         * gizmos are only used for Vector2 attributes for now
         * @param Vector2 mouseMovement: movementVector of mouse cursor
         */
        change(mouseMovement) {
                const changeValue = Vector2.multiply(this.vectorBias, mouseMovement);
                const newValue = this.attribute.value.add(changeValue);

                this.attribute.change(newValue.x, newValue.y);
        }
}