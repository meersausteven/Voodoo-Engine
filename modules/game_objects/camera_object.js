
import { Camera } from '../components/camera.js';

import { GameObject } from './game_object.js';

export class CameraObject extends GameObject {
        type = "Camera Object";
        
        constructor(x = 0, y = 0, rotation = 0) {
                super(x, y, rotation);

                this.attributes['name'].value = "New Camera";
        }

        start() {
                this.addComponent(new Camera(this.scene.project.settings['canvasWidth'], this.scene.project.settings['canvasHeight']));
        }
}