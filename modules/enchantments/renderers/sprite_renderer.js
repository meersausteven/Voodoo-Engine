
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeImage } from './../../editor/attributes/attribute_image.js';

import { Vector2 } from './../../collection/vector2.js';

import { Renderer } from './renderer.js';

export class SpriteRenderer extends Renderer {
        type = "Sprite Renderer";

        /*
         * constructor
         * @param int width: width of the sprite
         * @param int height: height of the sprite
         * @param string filePath: path to the image file relative to the path in project setting 'filePathSprites'
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(width = 50, height = 50, filePath = "/default.png", offset = new Vector2()) {

                super(offset);

                this.attributes['width'] = new AttributeNumber('Width', width);
                this.attributes['height'] = new AttributeNumber('Height', height);
                this.attributes['image'] = new Image(this.attributes['width'].value, this.attributes['height'].value);
                this.attributes['filePath'] = new AttributeImage('File Path', filePath);
        }

        start() {
                console.log("Test - sprite renderer");
                this.attributes['filePath'].value = this.talisman.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
                console.log(this.attributes['filePath'].value);
                // run this function after this enchantment was added to the talisman
                if (this.attributes['filePath'].value !== null) {
                        this.attributes['image'].src = this.attributes['filePath'].value;
                }
        }

        render(ocular) {
                if (this.attributes['filePath'].value != null) {
                        ocular.canvasContext.save();

                        ocular.canvasContext.translate(this.worldPos.x + this.attributes['offset'].value.x - ocular.worldPos.x, this.worldPos.y + this.attributes['offset'].value.y - ocular.worldPos.y);
                        ocular.canvasContext.rotate(Math.degreesToRadians(this.talisman.transform.attributes['rotation'].value));

                        // alpha
                        ocular.canvasContext.globalAlpha = this.attributes['alpha'].value;

                        // draw image
                        ocular.canvasContext.drawImage(this.attributes['image'], -this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                        ocular.canvasContext.restore();
                }
        }

        updateSource() {
                this.attributes['image'].src = this.talisman.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
        }
}