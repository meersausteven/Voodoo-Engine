
import { Vector2 } from './collection/vector2.js';
import { AttributeArrayText } from './editor/attributes/attribute_array_text.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';

export class RendererEngine {
        renderers = [];
        settings = {
                renderAxis: new AttributeVector2("Render Axis", Vector2.zero),
                renderLayers: new AttributeArrayText("Render Layers", [
                        "Background 1",
                        "Background 2",
                        "Background 3",
                        "Center",
                        "Foreground 1",
                        "Foreground 2",
                        "Foreground 3",
                ]),
                
        };

        /*
         * adds a Renderer to the renderer stack
         * @param Renderer renderer: the renderer that is to be added
         */
        addComponentRenderer(renderer) {
                // don't add if already in the array
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i] === renderer) {
                                return;
                        }

                        ++i;
                }

                this.renderers.push(renderer);
        }

        /*
         * removes a Renderer from the renderer stack
         * @param int index: array index of the Renderer that is to be removed
         */
        removeComponentRenderer(renderer) {
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i] === renderer) {
                                this.renderers[i] = null;
                                return;
                        }

                        ++i;
                }
        }

        /*
         * renders all renderer components in the renderer stack to a passed camera component
         * @param Camera camera: the camera component to which it should render
         */
        renderToCameraView(camera) {
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i].gameObject === null) {
                                ++i;

                                continue;
                        }

                        if ((this.renderers[i].gameObject.attributes['enabled'].value === true) && 
                            (this.renderers[i].attributes['enabled'].value === true)
                        ) {
                                camera.canvasContext.save();
                                camera.canvasContext.translate(camera.gameObject.scene.project.settings['canvasWidth'] / 2, camera.gameObject.scene.project.settings['canvasHeight'] / 2)

                                this.renderers[i].render(camera);

                                camera.canvasContext.restore();
                        }

                        ++i;
                }
        }
}