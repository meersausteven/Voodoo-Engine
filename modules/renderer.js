
import { ComponentRenderer } from './components/renderers/component_renderer.js';

export class Renderer {
        componentRenderer = [];
        settings = {

        };

        /*
         * adds a component renderer to the renderer stack
         * @param ComponentRenderer renderer: the component renderer that is to be added
         */
        addComponentRenderer(renderer) {
                if (renderer instanceof ComponentRenderer) {
                        let i = 0;
                        let l = this.componentRenderer.length;

                        while (i < l) {
                                if (this.componentRenderer[i] === renderer) {
                                        return;
                                }

                                ++i;
                        }

                        this.componentRenderer.push(renderer);
                }
        }

        /*
         * removes a component renderer from the renderer stack
         * @param int index: array index of the component renderer that is to be removed
         */
        removeComponentRenderer(index) {
                if ((typeof index == "number") &&
                    ((this.componentRenderer[index] !== null) &&
                    (typeof this.componentRenderer[index] != "undefined"))
                ) {
                        this.componentRenderer[index] = null;

                        dispatchEvent(new Event('component_renderer_list_changed'));
                }
        }

        /*
         * renders all renderer components in the renderer stack to a passed camera component
         * @param Camera camera: the camera component to which it should render
         */
        renderToCameraView(camera) {
                let i = 0;
                let l = this.componentRenderer.length;
                while (i < l) {
                        if (this.componentRenderer[i].gameObject === null) {
                                ++i;

                                continue;
                        }

                        if ((this.componentRenderer[i].gameObject.attributes['enabled'].value === true) && 
                            (this.componentRenderer[i].attributes['enabled'].value === true)
                        ) {
                                camera.canvasContext.save();
                                camera.canvasContext.translate(camera.gameObject.scene.project.settings['canvasWidth'] / 2, camera.gameObject.scene.project.settings['canvasHeight'] / 2)

                                this.componentRenderer[i].render(camera);

                                camera.canvasContext.restore();
                        }

                        ++i;
                }
        }
}